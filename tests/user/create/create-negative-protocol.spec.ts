import { test, expect } from '../../../src/api/fixtures/loginFixture';
import { HTTP_STATUS } from '../../../src/api/constants/constants';
import { createUserPayload } from '../../../src/api/models/factories/createUserPayload';
import { UserModel } from '../../../src/api/models/UserModel';

test.describe('User API - Create User Protocol-Level Negative Scenarios', () => {
  const createdUsers: string[] = [];

  // Automatically clean up any users that were created during negative tests
  test.afterEach(async ({ authorizedClient }) => {
    for (const username of createdUsers) {
      await authorizedClient.deleteUser(username);
    }
  });

  const PROTOCOL_NEGATIVE_CASES = [
    { payload: { password: 'pwd123' }, reason: 'Missing username' },
    { payload: { username: 'testuser' }, reason: 'Missing password' },
    { payload: {}, reason: 'Missing username and password' },
    { payload: { username: '', password: 'pwd123' }, reason: 'Empty username' },
    {
      payload: { username: 'testuser', password: '' },
      reason: 'Empty password',
    },
    {
      payload: { username: 123, password: 'pwd123' },
      reason: 'Non-string username',
    },
    {
      payload: { username: 'testuser', password: 456 },
      reason: 'Non-string password',
    },
    {
      payload: { username: null, password: 'pwd123' },
      reason: 'Null username',
    },
    {
      payload: { username: 'testuser', password: null },
      reason: 'Null password',
    },
    {
      payload: { username: 'user', password: 'pwd', extra: 'field' },
      reason: 'Unknown additional field',
    },
  ];

  PROTOCOL_NEGATIVE_CASES.forEach(({ payload, reason }) => {
    test(`should fail to create user - ${reason}`, async ({
      authorizedClient,
    }) => {
      // When: Attempt to create user with invalid data
      const response = await authorizedClient.createUser(payload as any);

      // If somehow a user is created, track for cleanup
      if (response.status === HTTP_STATUS.OK && payload.username) {
        createdUsers.push((payload as UserModel).username);
      }
      // Then: API should return 4xx error
      expect(response.status).toBeGreaterThanOrEqual(HTTP_STATUS.BAD_REQUEST);
      expect(response.body.code).toBeGreaterThanOrEqual(
        HTTP_STATUS.BAD_REQUEST
      );
    });
  });

  const MALFORMED_JSON_CASE = `{ "username": "user", "password": "pwd" `; // missing closing }

  test('should fail to create user - malformed JSON', async ({ request }) => {
    // When: Attempt to create user with malformed JSON
    const response = await request.post('/user', { data: MALFORMED_JSON_CASE });

    // Then: API should return 4xx error
    expect(response.status()).toBeGreaterThanOrEqual(HTTP_STATUS.BAD_REQUEST);
  });

  const INVALID_HTTP_METHODS = ['GET', 'PUT', 'DELETE', 'PATCH'];
  INVALID_HTTP_METHODS.forEach((method) => {
    test(`should reject create user request with HTTP ${method}`, async ({
      request,
    }) => {
      // When: Attempt to create user with invalid HTTP method
      const payload = createUserPayload();
      const response = await request.fetch('/user', {
        method,
        data: payload,
      });

      // Then: API should return 4xx error
      expect(response.status()).toBeGreaterThanOrEqual(HTTP_STATUS.BAD_REQUEST);      
    });
  });
});
