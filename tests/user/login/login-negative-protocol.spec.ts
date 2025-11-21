import test, { expect } from '@playwright/test';
import { HTTP_STATUS} from '../../../src/api/constants/constants';
import { env } from '../../../src/api/utils/env';

test.describe('User Login API - negative scenarios', () => {

  const HTTP_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];
  HTTP_METHODS.forEach((method) => {
    test(`should reject login attempt with HTTP ${method} method`, async ({
      request,
    }) => {
      // Given: A user tries to log in using invalid HTTP method
      const response = await request.fetch('/user/login', {
        method,
        data: { username: env.username, password: env.password },
      });

      switch (method) {
        case 'POST':
          // Then: The login should be rejected with a 404 status code-it's an actual behaviour
          expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
          break;
        default:
          // Then: The login should be rejected with a 405 status code
          expect(response.status()).toBe(HTTP_STATUS.METHOD_NOT_ALLOWED);
      }
    });
  });

   const MALFORMED_QUERY_PARAMS = [
    'username==abc',
    'username[=abc',
    '<script>alert(1)</script>',
    ' OR 1=1 --',
    '; rm -rf /',
  ];
  for (const raw of MALFORMED_QUERY_PARAMS) {
    test(`should handle malformed query safely [${raw}]`, async ({ request }) => {
      const response = await request.get(`/user/login?username=${raw}&password=${env.password}`);

      // Real API should return 400, but Petstore returns 404
      expect(response.status()).toBe(HTTP_STATUS.BAD_REQUEST);
    });
  }
});
