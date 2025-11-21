import { APIRequestContext } from '@playwright/test';
import { responseSchema } from '../models/schemas/responseSchema';
import { userSchema } from '../models/schemas/userSchema';
import { wrapResponse } from '../utils/responseWrapper';
import { ApiResponse } from '../models/APIResponse';
import { retry } from '../utils/retry';
import { API_ENDPOINTS } from '../constants/endpoints';
import { logger } from '../utils/logger';
import { UserModel } from '../models/UserModel';

export default class UserClient {
  constructor(private request: APIRequestContext) {
    logger.debug('UserClient initialized');
  }

  /**
   * Login user with provided credentials
   * @param username - User's username
   * @param password - User's password
   * @returns Promise containing API response with user session info
   */
  async login(username: string, password: string) {
    logger.info('User login attempt');

    return retry(async () => {
      const response = await this.request.get(API_ENDPOINTS.USER.LOGIN, {
        params: { username, password },
      });

      logger.debug('Login API response received', {
        status: response.status(),
        statusText: response.statusText(),
      });

      return wrapResponse<ApiResponse>(response, responseSchema);
    });
  }

  /**
   * Logout the current user
   * @returns Promise containing API response
   */
  async logout() {
    logger.info('User logout attempt');

    return retry(async () => {
      const response = await this.request.get(API_ENDPOINTS.USER.LOGOUT);

      logger.debug('Logout API response received', {
        status: response.status(),
        statusText: response.statusText(),
      });

      return wrapResponse<ApiResponse>(response, responseSchema);
    });
  }

  /**
   * Create a new user
   * 
   * @param userPayload - Full user payload (UserModel )
   * @returns Promise containing API response
   */
  async createUser(userPayload: UserModel) {
    logger.info('Create user attempt');

    return retry(async () => {
    const response = await this.request.post(API_ENDPOINTS.USER.CREATE, {
      data: userPayload,
    });

      logger.debug('Create User API response received', {
        status: response.status(),
        statusText: response.statusText(),
      });

      return wrapResponse<ApiResponse>(response, responseSchema);
    });
  }

  /** 
   * Delete a user by username
   * @param username - Username of the user to delete
   * @returns Promise containing API response
   */
  async deleteUser(username: string) {
    logger.info(`Delete user attempt: ${username}`);

    return retry(async () => {
      const response = await this.request.delete(API_ENDPOINTS.USER.DELETE(username));

      logger.debug('Delete User API response received', {
        status: response.status(),
        statusText: response.statusText(),
      });

      return wrapResponse<ApiResponse>(response, responseSchema);
    });
  }

  /** 
   * Get a user by username
   * @param username - Username of the user to retrieve
   * @returns Promise containing API response with UserModel
   */
  async getUser(username: string) {
    logger.info(`Get user attempt: ${username}`); 

    return retry(async () => {
      const response = await this.request.get(API_ENDPOINTS.USER.GET(username));
      
      logger.debug('Get User API response received', {
        status: response.status(),
        statusText: response.statusText(),
      });
      return wrapResponse<UserModel>(response, userSchema);
    });
  }

  /** 
   * Update a user by username
   * @param username - Username of the user to update
   * @param userPayload - Updated user payload (UserModel)
   * @returns Promise containing API response
   */
  
  async updateUser(username: string, userPayload: UserModel) {
    logger.info(`Update user attempt: ${username}`);  

    return retry(async () => {
      const response = await this.request.put(API_ENDPOINTS.USER.UPDATE(username), {
        data: userPayload,
      });

      logger.debug('Update User API response received', {
        status: response.status(),
        statusText: response.statusText(),
      });
      
      return wrapResponse<ApiResponse>(response, responseSchema);
    });
  }
}
