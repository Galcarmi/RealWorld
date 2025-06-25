import { User } from '../../store/types';

import { BaseService } from '../common/BaseService';
import {
  ApiErrorResponse,
  IAuthService,
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../common/types';

class AuthService extends BaseService implements IAuthService {
  constructor() {
    super();
  }

  public async getCurrentUser(): Promise<UserResponse> {
    try {
      const response = await this._api.get<UserResponse>('/user');
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async login(user: LoginUserRequest): Promise<UserResponse> {
    try {
      const response = await this._api.post<UserResponse>('/users/login', {
        user,
      });
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async register(user: RegisterUserRequest): Promise<UserResponse> {
    try {
      const response = await this._api.post<UserResponse>('/users', { user });
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async updateUser(user: User): Promise<UserResponse> {
    try {
      const response = await this._api.put<UserResponse>('/user', { user });
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async validateStoredToken(): Promise<UserResponse | null> {
    try {
      const response = await this._api.get<UserResponse>('/user');
      return this._responseBody(response);
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
export { AuthService, IAuthService };
