import puppeteer, { LaunchOptions, Page, Browser, KnownDevices, HTTPRequest, HTTPResponse } from 'puppeteer';

export interface MockApiResponse {
  url: string | RegExp;
  method?: string;
  status?: number;
  contentType?: string;
  body: any;
  delay?: number; // Simulate network delay
}

export interface VisualTestConfig {
  headless: boolean;
  viewport: {
    width: number;
    height: number;
  };
  baseUrl: string;
  slowMo?: number;
  devtools?: boolean;
  mobileMode?: boolean;
  deviceName?: string;
  mockApis?: MockApiResponse[];
}

export const defaultConfig: VisualTestConfig = {
  headless: process.env.HEADLESS === 'true',
  viewport: {
    width: 375, // iPhone-like width for mobile mode
    height: 667, // iPhone-like height for mobile mode
  },
  baseUrl: 'http://localhost:8081',
  slowMo: process.env.HEADLESS === 'true' ? 0 : 100,
  devtools: false,
  mobileMode: true, // Enable mobile mode by default
  deviceName: 'iPhone 12', // Default device to emulate
  mockApis: [], // No mocks by default
};

export class PuppeteerTestHelper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private config: VisualTestConfig;

  constructor(config: VisualTestConfig = defaultConfig) {
    this.config = { ...defaultConfig, ...config };
  }

  async init(): Promise<void> {
    const launchOptions: LaunchOptions = {
      headless: this.config.headless,
      slowMo: this.config.slowMo,
      devtools: this.config.devtools,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        // Mobile-specific args
        ...(this.config.mobileMode ? [
          '--enable-touch-events',
          '--force-device-scale-factor=2',
        ] : []),
      ],
    };

    this.browser = await puppeteer.launch(launchOptions);
    this.page = await this.browser.newPage();
    
    // Set up API mocking if configured
    if (this.config.mockApis && this.config.mockApis.length > 0) {
      await this.setupApiMocking();
    }

    if (this.config.mobileMode && this.config.deviceName) {
      // Use Puppeteer's built-in device emulation
      const deviceName = this.config.deviceName as keyof typeof KnownDevices;
      if (KnownDevices[deviceName]) {
        await this.page.emulate(KnownDevices[deviceName]);
        console.log(`📱 Emulating device: ${this.config.deviceName}`);
      } else {
        // Fallback to manual mobile configuration
        await this.setupMobileEmulation();
      }
    } else if (this.config.mobileMode) {
      // Manual mobile setup if no specific device
      await this.setupMobileEmulation();
    } else {
      // Desktop mode
      await this.page.setViewport(this.config.viewport);
    }
  }

  private async setupApiMocking(): Promise<void> {
    if (!this.page || !this.config.mockApis) return;

    // Enable request interception
    await this.page.setRequestInterception(true);

    this.page.on('request', async (request: HTTPRequest) => {
      const url = request.url();
      const method = request.method();

      // Find matching mock configuration
      const mockConfig = this.config.mockApis!.find(mock => {
        const urlMatches = typeof mock.url === 'string' 
          ? url.includes(mock.url)
          : mock.url.test(url);
        const methodMatches = !mock.method || method === mock.method;
        return urlMatches && methodMatches;
      });

      if (mockConfig) {
        console.log(`🎭 Mocking API call: ${method} ${url}`);
        
        // Simulate network delay if specified
        if (mockConfig.delay) {
          await new Promise(resolve => setTimeout(resolve, mockConfig.delay));
        }

        // Respond with mock data
        await request.respond({
          status: mockConfig.status || 200,
          contentType: mockConfig.contentType || 'application/json',
          body: typeof mockConfig.body === 'string' 
            ? mockConfig.body 
            : JSON.stringify(mockConfig.body),
        });
      } else {
        // Continue with actual request if no mock found
        await request.continue();
      }
    });

    console.log(`🎭 API mocking enabled for ${this.config.mockApis.length} endpoints`);
  }

  async addApiMock(mockConfig: MockApiResponse): Promise<void> {
    if (!this.config.mockApis) {
      this.config.mockApis = [];
    }
    this.config.mockApis.push(mockConfig);
    
    // If page is already initialized, we need to restart mocking
    if (this.page) {
      await this.setupApiMocking();
    }
  }

  async clearApiMocks(): Promise<void> {
    this.config.mockApis = [];
    if (this.page) {
      await this.page.setRequestInterception(false);
    }
  }

  private async setupMobileEmulation(): Promise<void> {
    if (!this.page) return;

    // Set mobile viewport
    await this.page.setViewport({
      width: this.config.viewport.width,
      height: this.config.viewport.height,
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
    });

    // Set mobile user agent
    await this.page.setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1'
    );

    console.log(`📱 Mobile emulation enabled: ${this.config.viewport.width}x${this.config.viewport.height}`);
  }

  async navigateTo(path: string = ''): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }
    
    const url = `${this.config.baseUrl}${path}`;
    await this.page.goto(url, { waitUntil: 'networkidle2' });
  }

  async takeScreenshot(name: string): Promise<string> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    const screenshotPath = `test-results/screenshots/${name}.png` as const;
    await this.page.screenshot({ 
      path: screenshotPath,
      fullPage: true 
    });
    
    return screenshotPath;
  }

  async waitForSelector(selector: string, timeout: number = 5000): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForText(text: string, timeout: number = 5000): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.waitForFunction(
      (searchText: string) => document.body.innerText.includes(searchText),
      { timeout },
      text
    );
  }

  async waitForApiCall(urlPattern: string | RegExp, timeout: number = 10000): Promise<HTTPResponse | null> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    return new Promise((resolve) => {
      const timer = setTimeout(() => resolve(null), timeout);
      
      this.page!.on('response', (response) => {
        const url = response.url();
        const matches = typeof urlPattern === 'string' 
          ? url.includes(urlPattern)
          : urlPattern.test(url);
          
        if (matches) {
          clearTimeout(timer);
          resolve(response);
        }
      });
    });
  }

  async click(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.click(selector);
  }

  async tap(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    // Mobile-friendly tap action
    await this.page.tap(selector);
  }

  async type(selector: string, text: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.type(selector, text);
  }

  async swipe(direction: 'up' | 'down' | 'left' | 'right', distance: number = 300): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    const viewport = this.page.viewport()!;
    const startX = viewport.width / 2;
    const startY = viewport.height / 2;

    let endX = startX;
    let endY = startY;

    switch (direction) {
      case 'up':
        endY = startY - distance;
        break;
      case 'down':
        endY = startY + distance;
        break;
      case 'left':
        endX = startX - distance;
        break;
      case 'right':
        endX = startX + distance;
        break;
    }

    await this.page.touchscreen.tap(startX, startY);
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY);
    await this.page.mouse.up();
  }

  async cleanup(): Promise<void> {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  getPage(): Page | null {
    return this.page;
  }

  async waitForTestId(testId: string, timeout: number = 5000): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.waitForSelector(`[data-testid="${testId}"]`, { timeout });
  }

  async clickByTestId(testId: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.click(`[data-testid="${testId}"]`);
  }

  async tapByTestId(testId: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.tap(`[data-testid="${testId}"]`);
  }

  async typeInTestId(testId: string, text: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.type(`[data-testid="${testId}"]`, text);
  }

  async waitForElementWithText(text: string, timeout: number = 5000): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.waitForFunction(
      (searchText: string) => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.some(el => {
          const htmlEl = el as HTMLElement;
          return htmlEl.textContent && 
            htmlEl.textContent.trim().includes(searchText) &&
            htmlEl.offsetParent !== null; // Element is visible
        });
      },
      { timeout },
      text
    );
  }

  async clickElementWithText(text: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.evaluate((searchText: string) => {
      const elements = Array.from(document.querySelectorAll('*'));
      const element = elements.find(el => {
        const htmlEl = el as HTMLElement;
        return htmlEl.textContent && 
          htmlEl.textContent.trim().includes(searchText) &&
          htmlEl.offsetParent !== null;
      }) as HTMLElement;
      
      if (element) {
        element.click();
      } else {
        throw new Error(`Element with text "${searchText}" not found`);
      }
    }, text);
  }

  async getElementText(selector: string): Promise<string | null> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    return await this.page.$eval(selector, el => el.textContent?.trim() || null);
  }

  async isElementVisible(selector: string): Promise<boolean> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    try {
      const element = await this.page.$(selector);
      if (!element) return false;
      
      const isVisible = await element.isIntersectingViewport();
      return isVisible;
    } catch {
      return false;
    }
  }

  async scrollToElement(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, selector);

    // Wait for scroll to complete
    await new Promise(resolve => setTimeout(resolve, 500));
  }
} 