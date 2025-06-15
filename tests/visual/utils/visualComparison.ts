import fs from 'fs';
import path from 'path';

import { PNG } from 'pngjs';

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
  maxDiffPercentage: 0.1,
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

    const baselinePath = path.join(this.baselineDir, `${screenshotName}.png`);
    const currentPath = path.join(this.currentDir, `${screenshotName}.png`);
    const diffPath = path.join(this.diffDir, `${screenshotName}-diff.png`);

    if (!fs.existsSync(currentPath)) {
      throw new Error(`Current screenshot not found: ${currentPath}`);
    }

    if (!fs.existsSync(baselinePath)) {
      // Only create baseline automatically if UPDATE_BASELINES is true
      if (process.env.UPDATE_BASELINES === 'true') {
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

    const baselineImg = PNG.sync.read(fs.readFileSync(baselinePath));
    const currentImg = PNG.sync.read(fs.readFileSync(currentPath));

    this.validateImageDimensions(baselineImg, currentImg, screenshotName);

    const totalPixels = baselineImg.width * baselineImg.height;
    const diffImg = new PNG({
      width: baselineImg.width,
      height: baselineImg.height,
    });

    const pixelDifference = pixelmatch(
      baselineImg.data,
      currentImg.data,
      diffImg.data,
      baselineImg.width,
      baselineImg.height,
      { threshold: opts.threshold }
    );

    const diffPercentage = (pixelDifference / totalPixels) * 100;
    const passed = diffPercentage <= opts.maxDiffPercentage;

    const diffImagePath = this.createDiffImageIfNeeded(
      pixelDifference,
      diffImg,
      diffPath,
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
    const currentPath = path.join(this.currentDir, `${screenshotName}.png`);
    const baselinePath = path.join(this.baselineDir, `${screenshotName}.png`);

    if (!fs.existsSync(currentPath)) {
      throw new Error(`Current screenshot not found: ${currentPath}`);
    }

    fs.copyFileSync(currentPath, baselinePath);
  }

  getBaselinePath(screenshotName: string): string {
    return path.join(this.baselineDir, `${screenshotName}.png`);
  }

  getCurrentPath(screenshotName: string): string {
    return path.join(this.currentDir, `${screenshotName}.png`);
  }

  getDiffPath(screenshotName: string): string {
    return path.join(this.diffDir, `${screenshotName}-diff.png`);
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
    baselineImg: PNG,
    currentImg: PNG,
    screenshotName: string
  ): void {
    if (
      baselineImg.width !== currentImg.width ||
      baselineImg.height !== currentImg.height
    ) {
      throw new Error(
        `Image dimensions don't match for ${screenshotName}. ` +
          `Baseline: ${baselineImg.width}x${baselineImg.height}, ` +
          `Current: ${currentImg.width}x${currentImg.height}`
      );
    }
  }

  private createDiffImageIfNeeded(
    pixelDifference: number,
    diffImg: PNG,
    diffPath: string,
    createDiffImage: boolean
  ): string | undefined {
    if (pixelDifference > 0 && createDiffImage) {
      fs.writeFileSync(diffPath, PNG.sync.write(diffImg));
      return diffPath;
    }
    return undefined;
  }
}
