import { expect } from '@playwright/test';
import { HTTP_STATUS } from '../../../src/api/constants/constants';
import { test } from '../../../src/api/fixtures/loginFixture';

test.describe(
  'User Authentication - Logout - Negative Scenarios',
  { tag: '@negative' },
  () => {
    test('should return unauthorized when logging out without login', async ({
      request,
    }) => {
      // Given: No authenticated session

      // When: The user attempts to log out without logging in
      const response = await request.get('/user/logout');

      // Then: The API should return 401 Unauthorized, but Petstore returns 404
      expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    test('should not allow logging out twice (expired session)', async ({
      authorizedClient,
    }) => {
      // Given: A user is authenticated

      // When: First logout
      const firstLogout = await authorizedClient.logout();
      expect(firstLogout.status).toBe(HTTP_STATUS.OK);

      // And: Second logout
      const secondLogout = await authorizedClient.logout();

      // Then: The second logout should fail with 401 Unauthorized, but Petstore returns 200 OK
      expect(secondLogout.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    const INVALID_TOKENS = [
      '',
      '   ',
      'invalidtoken123',
      'Bearer abc.def.ghi',
      'DROP TABLE sessions;',
      '<script>alert(1)</script>',
      'OR 1=1 --',
    ];
    INVALID_TOKENS.forEach((token, i) => {
      test(`should fail logout with malformed session token [${
        i + 1
      }]`, async ({ request }) => {
        // Given: Manually setting an invalid cookie
        const response = await request.get('/user/logout', {
          headers: {
            Cookie: `token=${token}`,
          },
        });

        // Then: The API should return 401 Unauthorized, but Petstore returns 404
        expect(response.status()).toBe(HTTP_STATUS.UNAUTHORIZED);
      });
    });

    const WRONG_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
    WRONG_METHODS.forEach((method) => {
      test(`should reject logout attempt using HTTP ${method}`, async ({
        request,
      }) => {
        // Given: A user attempts to call logout with wrong method

        const response = await request.fetch('/user/logout', { method });

        // Then: The API should return Method Not Allowed
        expect(response.status()).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
      });
    });

    const MALFORMED_QUERIES = [
      '?;foo=bar',
      '?token==abc',
      '?x=<script>',
      '?a[]=1',
      '?param=%',
    ];
    MALFORMED_QUERIES.forEach((query, i) => {
      test(`should handle malformed logout query params [${i + 1}]`, async ({
        request,
      }) => {
        // Given: Malformed query string

        const response = await request.get(`/user/logout${query}`);

        // Then: API should return 400 Bad Request (or fail validation)
        expect(response.status()).toBeGreaterThanOrEqual(
          HTTP_STATUS.BAD_REQUEST
        );
      });
    });
  }
);
