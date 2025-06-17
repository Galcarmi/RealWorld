import puppeteer, {
  LaunchOptions,
  Page,
  Browser,
  HTTPRequest,
  HTTPResponse,
} from 'puppeteer';

export interface MockApiResponse {
  url: string | RegExp;
  method?: string;
  status?: number;
  contentType?: string;
  body: Record<string, unknown> | string;
  delay?: number;
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
    width: 390,
    height: 844,
  },
  baseUrl: 'http://localhost:8081',
  slowMo: process.env.HEADLESS === 'true' ? 0 : 100,
  devtools: false,
  mobileMode: false,
  deviceName: undefined,
  mockApis: [],
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
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
      ],
    };

    this.browser = await puppeteer.launch(launchOptions);
    this.page = await this.browser.newPage();

    if (this.config.mockApis && this.config.mockApis.length > 0) {
      await this.setupApiMocking();
    }

    // Always use consistent viewport settings
    await this.page.setViewport({
      width: this.config.viewport.width,
      height: this.config.viewport.height,
      deviceScaleFactor: 2,
    });

    // Set consistent user agent across platforms
    await this.page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );

    // Force consistent fonts
    await this.page.evaluateOnNewDocument(() => {
      const style = document.createElement('style');
      style.textContent = `
        * {
          -webkit-font-smoothing: none !important;
          -moz-osx-font-smoothing: unset !important;
          text-rendering: geometricPrecision !important;
          font-feature-settings: "kern" 0 !important;
        }
        body, html {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif !important;
          font-synthesis: none !important;
        }
      `;
      document.head.appendChild(style);
    });
  }

  async addApiMock(mockConfig: MockApiResponse): Promise<void> {
    if (!this.config.mockApis) {
      this.config.mockApis = [];
    }
    this.config.mockApis.push(mockConfig);

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

    const screenshotPath = `tests/visual/screenshots/${name}.jpeg` as const;
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true,
      type: 'jpeg',
      omitBackground: false,
    });

    return screenshotPath;
  }

  async waitForSelector(
    selector: string,
    timeout: number = 10000
  ): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.waitForSelector(selector, { timeout });
  }

  async waitForText(text: string, timeout: number = 10000): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.waitForFunction(
      (searchText: string) => document.body.innerText.includes(searchText),
      { timeout },
      text
    );
  }

  async waitForApiCall(
    urlPattern: string | RegExp,
    timeout: number = 10000
  ): Promise<HTTPResponse | null> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    return new Promise(resolve => {
      const timer = setTimeout(() => resolve(null), timeout);

      this.page!.on('response', response => {
        const url = response.url();
        const matches =
          typeof urlPattern === 'string'
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

    await this.page.tap(selector);
  }

  async type(selector: string, text: string): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.type(selector, text);
  }

  async swipe(
    direction: 'up' | 'down' | 'left' | 'right',
    distance: number = 300
  ): Promise<void> {
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

  async waitForTestId(testId: string, timeout: number = 10000): Promise<void> {
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

  async waitForElementWithText(
    text: string,
    timeout: number = 10000
  ): Promise<void> {
    if (!this.page) {
      throw new Error('Page not initialized. Call init() first.');
    }

    await this.page.waitForFunction(
      (searchText: string) => {
        const elements = Array.from(document.querySelectorAll('*'));
        return elements.some(el => {
          const htmlEl = el as HTMLElement;
          return (
            htmlEl.textContent &&
            htmlEl.textContent.trim().includes(searchText) &&
            htmlEl.offsetParent !== null
          );
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
        return (
          htmlEl.textContent &&
          htmlEl.textContent.trim().includes(searchText) &&
          htmlEl.offsetParent !== null
        );
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

    return await this.page.$eval(
      selector,
      el => el.textContent?.trim() || null
    );
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

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  private async setupApiMocking(): Promise<void> {
    if (!this.page || !this.config.mockApis) return;

    await this.page.setRequestInterception(true);

    this.page.on('request', async (request: HTTPRequest) => {
      const url = request.url();
      const method = request.method();

      const mockConfig = this.config.mockApis!.find(mock => {
        const urlMatches =
          typeof mock.url === 'string'
            ? url.includes(mock.url)
            : mock.url.test(url);
        const methodMatches = !mock.method || method === mock.method;
        return urlMatches && methodMatches;
      });

      if (mockConfig) {
        if (mockConfig.delay) {
          await new Promise(resolve => setTimeout(resolve, mockConfig.delay));
        }

        await request.respond({
          status: mockConfig.status || 200,
          contentType: mockConfig.contentType || 'application/json',
          body:
            typeof mockConfig.body === 'string'
              ? mockConfig.body
              : JSON.stringify(mockConfig.body),
        });
      } else {
        await request.continue();
      }
    });
  }
}
