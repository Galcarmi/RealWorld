import { Page, Browser } from 'puppeteer';

export interface VisualTestHelper {
  browser: Browser | null;
  config: VisualTestConfig;
  init(): Promise<void>;
  addApiMock(mockConfig: MockApiResponse): Promise<void>;
  clearApiMocks(): Promise<void>;
  navigateTo(path?: string): Promise<void>;
  takeScreenshot(name: string): Promise<string>;
  waitForSelector(selector: string, timeout?: number): Promise<void>;
  waitForText(text: string, timeout?: number): Promise<void>;
  waitForApiCall(urlPattern: string | RegExp, timeout?: number): Promise<any>;
  click(selector: string): Promise<void>;
  tap(selector: string): Promise<void>;
  type(selector: string, text: string): Promise<void>;
  swipe(
    direction: 'up' | 'down' | 'left' | 'right',
    distance?: number
  ): Promise<void>;
  cleanup(): Promise<void>;
  getPage(): Page | null;
  waitForTestId(testId: string, timeout?: number): Promise<void>;
  clickByTestId(testId: string): Promise<void>;
  tapByTestId(testId: string): Promise<void>;
  typeInTestId(testId: string, text: string): Promise<void>;
  waitForElementWithText(text: string, timeout?: number): Promise<void>;
  clickElementWithText(text: string): Promise<void>;
  getElementText(selector: string): Promise<string | null>;
  isElementVisible(selector: string): Promise<boolean>;
  scrollToElement(selector: string): Promise<void>;
}

export interface VisualTestSuiteConfig {
  name: string;
  description: string;
  url: string;
  actions: VisualTestAction[];
  expectedElements: string[];
  screenshotName: string;
}

export interface VisualTestAction {
  type: 'click' | 'type' | 'wait' | 'navigate';
  selector?: string;
  value?: string;
  timeout?: number;
  url?: string;
}

export interface VisualRegressionResult {
  testName: string;
  passed: boolean;
  similarityScore: number;
  diffImagePath?: string;
  baselineImagePath: string;
  screenshotImagePath: string;
}

export interface MockApiResponse {
  url: RegExp;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  status: number;
  contentType: string;
  body: Record<string, any>;
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
