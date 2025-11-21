import test, { expect } from '@playwright/test';
import UserClient from '../../../src/api/clients/userClient';
import {
  HTTP_STATUS,
  RESPONSE_MESSAGES,
} from '../../../src/api/constants/constants';
import { env } from '../../../src/api/utils/env';

test.describe('User Login API - positive scenarious', () => {
  test(
    'should successfully log in user with valid credentials',
    { tag: '@positive' },
    async ({ request }) => {
      // Given: A user has valid credentials
      const loginClient = new UserClient(request);
      const username = env.username;
      const password = env.password;

      // When: The user attempts to log in
      const response = await loginClient.login(username, password);

      // Then: The login should succeed with a 200 status code
      expect(response.status).toBe(HTTP_STATUS.OK);

      // And: The response should contain the logged in user session message
      expect(response.body.message).toContain(
        RESPONSE_MESSAGES.LOGGED_IN_USER_SESSION
      );

      // And: The response should have code 200
      expect(response.body.code).toBe(HTTP_STATUS.OK);

      // And: The response type should be 'unknown'
      expect(response.body.type).toBe('unknown');
    }
  );
});
