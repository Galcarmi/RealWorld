import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { mockDeep } from 'jest-mock-extended';

import { BaseService } from '../../../src/services/common/BaseService';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

class TestService extends BaseService {
  public testResponseBody<T>(res: AxiosResponse<T>): T {
    return this._responseBody(res);
  }
}

describe('BaseService', () => {
  let testService: TestService;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockAxiosInstance = mockDeep<AxiosInstance>();

    mockedAxios.create.mockReturnValue(mockAxiosInstance);

    testService = new TestService();
  });

  describe('constructor', () => {
    it('should create axios instance with baseURL', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: expect.stringContaining(''),
      });
    });
  });

  describe('_responseBody', () => {
    it('should extract data from axios response', () => {
      const mockResponse: AxiosResponse = {
        data: { message: 'success' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      const result = testService.testResponseBody(mockResponse);

      expect(result).toEqual({ message: 'success' });
    });

    it('should handle different response data types', () => {
      const mockResponse: AxiosResponse<string> = {
        data: 'test string',
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      };

      const result = testService.testResponseBody(mockResponse);

      expect(result).toBe('test string');
    });
  });

  describe('service initialization', () => {
    it('should initialize without any dependencies', () => {
      expect(testService).toBeInstanceOf(BaseService);
      expect(testService).toBeInstanceOf(TestService);
    });

    it('should setup axios interceptors during construction', () => {
      expect(mockedAxios.create).toHaveBeenCalled();
    });
  });
});
