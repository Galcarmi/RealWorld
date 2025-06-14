import fs from 'fs';
import path from 'path';

const TEST_DIRECTORIES = ['tests/visual/screenshots', 'tests/visual/baselines'];

export const ensureTestDirectories = () => {
  TEST_DIRECTORIES.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

export function getScreenshotPath(
  testName: string,
  type: 'baseline' | 'current' = 'current'
): string {
  const subDir = type === 'baseline' ? 'baselines' : 'screenshots';
  return path.join('tests', 'visual', subDir, `${testName}.png`);
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
