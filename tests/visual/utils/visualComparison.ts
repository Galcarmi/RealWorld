import fs from 'fs';
import path from 'path';

import sharp from 'sharp';

// Use require for pixelmatch to avoid ES module issues in Jest
const pixelmatch = require('pixelmatch').default || require('pixelmatch');

export interface VisualComparisonResult {
  passed: boolean;
  pixelDifference: number;
  totalPixels: number;
  diffPercentage: number;
  diffImagePath?: string;
}

export interface VisualComparisonOptions {
  threshold: number; // 0-1, where 0 is identical and 1 is completely different
  maxDiffPercentage: number; // Maximum allowed difference percentage (0-100)
  createDiffImage: boolean;
}

const DEFAULT_OPTIONS: VisualComparisonOptions = {
  threshold: 0.05,
  maxDiffPercentage: 0.01,
  createDiffImage: true,
};

export class VisualComparator {
  private baselineDir: string;
  private currentDir: string;
  private diffDir: string;

  constructor() {
    this.baselineDir = path.join('tests', 'visual', 'baselines');
    this.currentDir = path.join('tests', 'visual', 'screenshots');
    this.diffDir = path.join('tests', 'visual', 'diffs');

    this.ensureDiffDirectoryExists();
  }

  async compareScreenshot(
    screenshotName: string,
    options: Partial<VisualComparisonOptions> = {}
  ): Promise<VisualComparisonResult> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    const baselinePath = path.join(this.baselineDir, `${screenshotName}.jpeg`);
    const currentPath = path.join(this.currentDir, `${screenshotName}.jpeg`);
    const diffPath = path.join(this.diffDir, `${screenshotName}-diff.jpeg`);

    if (!fs.existsSync(currentPath)) {
      throw new Error(`Current screenshot not found: ${currentPath}`);
    }

    if (!fs.existsSync(baselinePath)) {
      // Only create baseline automatically if UPDATE_BASELINES is true
      if (process.env.UPDATE_BASELINES === 'true') {
        console.log(`\n📸 Creating new baseline: ${screenshotName}`);
        return this.createNewBaseline(
          screenshotName,
          currentPath,
          baselinePath
        );
      } else {
        // Fail the test and tell user to create baseline
        throw new Error(
          `Baseline not found for "${screenshotName}"!\n` +
            `Expected baseline at: ${baselinePath}\n` +
            `To create baseline: yarn test:visual:update-baselines -- --testNamePattern="${screenshotName}"`
        );
      }
    }

    // Use Sharp to read JPEG images and convert to consistent RGBA format for pixelmatch
    const baselineImg = await sharp(baselinePath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const currentImg = await sharp(currentPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    this.validateImageDimensions(
      baselineImg.info,
      currentImg.info,
      screenshotName
    );

    const totalPixels = baselineImg.info.width * baselineImg.info.height;

    // Create a buffer for the diff image with same dimensions (RGBA = 4 channels)
    const diffImg = Buffer.alloc(totalPixels * 4);

    const pixelDifference = pixelmatch(
      baselineImg.data,
      currentImg.data,
      diffImg,
      baselineImg.info.width,
      baselineImg.info.height,
      { threshold: opts.threshold }
    );

    const diffPercentage = (pixelDifference / totalPixels) * 100;
    const passed = diffPercentage <= opts.maxDiffPercentage;

    // Console log the comparison results
    console.log(`\n📸 Visual Comparison: ${screenshotName}`);
    console.log(
      `   Pixel Difference: ${pixelDifference}/${totalPixels} pixels`
    );
    console.log(`   Difference: ${diffPercentage.toFixed(4)}%`);
    console.log(
      `   Threshold: ${opts.threshold} | Max Allowed: ${opts.maxDiffPercentage}%`
    );
    console.log(`   Result: ${passed ? '✅ PASSED' : '❌ FAILED'}`);

    const diffImagePath = await this.createDiffImageIfNeeded(
      pixelDifference,
      diffImg,
      diffPath,
      baselineImg.info,
      opts.createDiffImage
    );

    return {
      passed,
      pixelDifference,
      totalPixels,
      diffPercentage,
      diffImagePath,
    };
  }

  async updateBaseline(screenshotName: string): Promise<void> {
    const currentPath = path.join(this.currentDir, `${screenshotName}.jpeg`);
    const baselinePath = path.join(this.baselineDir, `${screenshotName}.jpeg`);

    if (!fs.existsSync(currentPath)) {
      throw new Error(`Current screenshot not found: ${currentPath}`);
    }

    console.log(`\n📸 Updating baseline: ${screenshotName}`);
    fs.copyFileSync(currentPath, baselinePath);
  }

  getBaselinePath(screenshotName: string): string {
    return path.join(this.baselineDir, `${screenshotName}.jpeg`);
  }

  getCurrentPath(screenshotName: string): string {
    return path.join(this.currentDir, `${screenshotName}.jpeg`);
  }

  getDiffPath(screenshotName: string): string {
    return path.join(this.diffDir, `${screenshotName}-diff.jpeg`);
  }

  private ensureDiffDirectoryExists(): void {
    if (!fs.existsSync(this.diffDir)) {
      fs.mkdirSync(this.diffDir, { recursive: true });
    }
  }

  private createNewBaseline(
    screenshotName: string,
    currentPath: string,
    baselinePath: string
  ): VisualComparisonResult {
    fs.copyFileSync(currentPath, baselinePath);
    return {
      passed: true,
      pixelDifference: 0,
      totalPixels: 0,
      diffPercentage: 0,
    };
  }

  private validateImageDimensions(
    baselineInfo: { width: number; height: number },
    currentInfo: { width: number; height: number },
    screenshotName: string
  ): void {
    if (
      baselineInfo.width !== currentInfo.width ||
      baselineInfo.height !== currentInfo.height
    ) {
      throw new Error(
        `Image dimensions don't match for ${screenshotName}. ` +
          `Baseline: ${baselineInfo.width}x${baselineInfo.height}, ` +
          `Current: ${currentInfo.width}x${currentInfo.height}`
      );
    }
  }

  private async createDiffImageIfNeeded(
    pixelDifference: number,
    diffBuffer: Buffer,
    diffPath: string,
    imageInfo: { width: number; height: number; channels: number },
    createDiffImage: boolean
  ): Promise<string | undefined> {
    if (pixelDifference > 0 && createDiffImage) {
      // Create diff image using Sharp with the original image dimensions
      // pixelmatch always outputs RGBA format (4 channels)
      await sharp(diffBuffer, {
        raw: {
          width: imageInfo.width,
          height: imageInfo.height,
          channels: 4 as const, // pixelmatch always outputs RGBA
        },
      })
        .jpeg()
        .toFile(diffPath);

      return diffPath;
    }
    return undefined;
  }
}
