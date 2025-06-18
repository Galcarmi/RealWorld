import { IAuthStore, IUserStore } from '../../store/types';

import { BaseService } from '../BaseService';
import { IProfileService, ProfileResponse, ApiErrorResponse } from '../types';

class ProfileService extends BaseService implements IProfileService {
  constructor(authStore: IAuthStore, userStore: IUserStore) {
    super(authStore, userStore);
  }

  public async getProfile(username: string): Promise<ProfileResponse> {
    try {
      const response = await this._api.get<ProfileResponse>(
        `/profiles/${username}`
      );
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async followUser(username: string): Promise<ProfileResponse> {
    try {
      const response = await this._api.post<ProfileResponse>(
        `/profiles/${username}/follow`
      );
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }

  public async unfollowUser(username: string): Promise<ProfileResponse> {
    try {
      const response = await this._api.delete<ProfileResponse>(
        `/profiles/${username}/follow`
      );
      return this._responseBody(response);
    } catch (error) {
      return this._logError(error as ApiErrorResponse);
    }
  }
}

export { ProfileService, IProfileService };
