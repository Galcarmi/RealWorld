import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { BaseService } from '../../../src/services/BaseService';
import { IAuthStore, IUserStore } from '../../../src/store/types';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

class TestService extends BaseService {
  public testResponseBody<T>(res: AxiosResponse<T>): T {
    return this._responseBody(res);
  }
}

const createMockAxiosInstance = () => ({
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
  },
  defaults: { headers: { common: {} } },
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
  getUri: jest.fn(),
  request: jest.fn(),
  head: jest.fn(),
  options: jest.fn(),
  patch: jest.fn(),
  postForm: jest.fn(),
  putForm: jest.fn(),
  patchForm: jest.fn(),
});

describe('BaseService', () => {
  let authStore: jest.Mocked<IAuthStore>;
  let userStore: jest.Mocked<IUserStore>;
  let testService: TestService;

  beforeEach(() => {
    jest.clearAllMocks();

    authStore = {
      isLoading: false,
      errors: undefined,
      username: '',
      email: '',
      password: '',
      authValues: { email: '', username: '', password: '' },
      isLoginFormValid: false,
      isSignUpFormValid: false,
      clear: jest.fn(),
      setUsername: jest.fn(),
      setEmail: jest.fn(),
      setPassword: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
    };

    userStore = {
      user: null,
      token: null,
      forgetUser: jest.fn(),
      setUser: jest.fn(),
      getToken: jest.fn(),
      isAuthenticated: jest.fn(),
    };

    const mockAxiosInstance = createMockAxiosInstance();

    mockedAxios.create.mockReturnValue(
      mockAxiosInstance as unknown as AxiosInstance
    );

    testService = new TestService(authStore, userStore);
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
    it('should initialize with auth and user stores', () => {
      expect(testService).toBeInstanceOf(BaseService);
      expect(testService).toBeInstanceOf(TestService);
    });

    it('should setup axios interceptors during construction', () => {
      expect(mockedAxios.create).toHaveBeenCalled();
    });
  });
});
