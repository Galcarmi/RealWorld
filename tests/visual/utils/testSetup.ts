import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
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
      console.log(`Created directory: ${dir}`);
    }
  }
}

export function getScreenshotPath(name: string, type: 'test' | 'baseline' = 'test'): string {
  const baseDir = type === 'test' ? 'test-results' : 'baselines';
  return path.join(baseDir, 'screenshots', `${name}.png`);
}

export async function waitForServer(url: string, maxRetries: number = 30): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log(`Server is ready at ${url}`);
        return true;
      }
    } catch (error) {
      // Server not ready yet
    }
    
    console.log(`Waiting for server... (${i + 1}/${maxRetries})`);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.error(`Server at ${url} did not respond after ${maxRetries} attempts`);
  return false;
} 