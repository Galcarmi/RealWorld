import { existsSync } from 'fs';
import { mkdir } from 'fs/promises';
import path from 'path';

export async function ensureDirectoriesExist(): Promise<void> {
  const directories = [
    'test-results',
    'test-results/screenshots',
    'baselines',
    'baselines/screenshots',
  ];

  for (const dir of directories) {
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
  }
}

export function getScreenshotPath(
  name: string,
  type: 'test' | 'baseline' = 'test'
): string {
  const baseDir = type === 'test' ? 'test-results' : 'baselines';
  return path.join(baseDir, 'screenshots', `${name}.png`);
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
