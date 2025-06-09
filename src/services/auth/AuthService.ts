import { IAuthStore, IUserStore, User } from '../../store/types';
import { BaseService } from '../BaseService';
import {
  IAuthService,
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../types';

class AuthService extends BaseService implements IAuthService {
  constructor(authStore: IAuthStore, userStore: IUserStore) {
    super(authStore, userStore);
  }

  public get(): Promise<UserResponse> {
    return this._api.get<UserResponse>('/user').then(this._responseBody);
  }

  public login(user: LoginUserRequest): Promise<UserResponse> {
    return this._api
      .post<UserResponse>('/users/login', { user })
      .then(this._responseBody);
  }

  public register(user: RegisterUserRequest): Promise<UserResponse> {
    return this._api
      .post<UserResponse>('/users', { user })
      .then(this._responseBody);
  }

  public put(user: User): Promise<UserResponse> {
    return this._api
      .put<UserResponse>('/user', { user })
      .then(this._responseBody);
  }
}

export { AuthService, IAuthService };
