import { BaseService } from '../common/BaseService';
import {
  IProfileService,
  ProfileResponse,
  ApiErrorResponse,
} from '../common/types';

class ProfileService extends BaseService implements IProfileService {
  constructor() {
    super();
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

export const profileService = new ProfileService();
export { ProfileService, IProfileService };
