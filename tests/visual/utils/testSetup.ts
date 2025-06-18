import fs from 'fs';
import path from 'path';

export function ensureTestDirectories(): void {
  const directories = [
    'tests/visual/screenshots',
    'tests/visual/baselines',
    'tests/visual/diffs',
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

export function cleanupTestDirectories(): void {
  const directories = ['tests/visual/screenshots', 'tests/visual/diffs'];

  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
    }
  });
}

export function getScreenshotPath(
  testName: string,
  type: 'baseline' | 'current' = 'current'
): string {
  const subDir = type === 'baseline' ? 'baselines' : 'screenshots';
  return path.join('tests', 'visual', subDir, `${testName}.jpeg`);
}

export async function waitForServer(
  url: string,
  maxAttempts: number = 30
): Promise<boolean> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch {
      // Server not ready yet, continue waiting
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return false;
}
