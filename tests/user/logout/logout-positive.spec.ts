import { expect } from '@playwright/test';
import { HTTP_STATUS } from '../../../src/api/constants/constants';
import { test } from '../../../src/api/fixtures/loginFixture';

test.describe('User Authentication - Logout', () => {
  test(
    'should successfully log out authenticated user',
    { tag: '@positive' },
    async ({ authorizedClient: loginClient }) => {
      // Given: A user is logged in (provided by fixture)
      // When: The user attempts to log out
      const response = await loginClient.logout();

      // Then: The logout should succeed with a 200 status code
      expect(response.status).toBe(HTTP_STATUS.OK);

      // And: The response message should be 'ok'
      expect(response.body.message).toBe('ok');

      // And: The response code should be 200
      expect(response.body.code).toBe(HTTP_STATUS.OK);

      // And: The response type should be 'unknown'
      expect(response.body.type).toBe('unknown');
    }
  );
});
