import { test, expect } from '@playwright/test';
import UserClient from '../../../src/api/clients/userClient';
import {
  HTTP_STATUS,
  RESPONSE_MESSAGES,
} from '../../../src/api/constants/constants';
import { env } from '../../../src/api/utils/env';

test.describe(
  'User Login API - negative scenarios',
  { tag: '@negative' },
  () => {
    const INVALID_CREDENTIALS = [
      {
        username: 'InvalidUser20251118',
        password: 'WrongPassword1111120251118',
      },
      { username: env.username, password: 'WrongPassword1111120251118' },
      {
        username: env.username.toUpperCase(),
        password: 'WrongPassword1111120251118',
      },
    ];
    INVALID_CREDENTIALS.forEach(({ username, password }, index) => {
      test(`should fail to log in user with invalid credentials: username = ${username}, password = ${password}`, async ({
        request,
      }) => {
        // When: The user attempts to log in
        const loginClient = new UserClient(request);
        const response = await loginClient.login(username, password);

        // Then: The login should fail with a 401 status code, but Petstore returns 200
        expect(response.status).toBe(HTTP_STATUS.UNAUTHORIZED);

        // And: The response should contain invalid credentials message
        expect(response.body.message).toBe(
          RESPONSE_MESSAGES.INVALID_CREDENTIALS
        );

        // And: The response should have code 401
        expect(response.body.code).toBe(HTTP_STATUS.UNAUTHORIZED);
      });
    });

    const EMPTY_OR_WEAK_PARAMS = [
      { username: '', password: env.password },
      { username: env.username, password: '' },
      { username: '', password: '' },
    ];
    for (const params of EMPTY_OR_WEAK_PARAMS) {
      test(`should fail with empty or missing fields [${params.username}/${params.password}]`, async ({
        request,
      }) => {
        // When: The user attempts to log in
        const loginClient = new UserClient(request);
        const response = await loginClient.login(
          params.username,
          params.password
        );

        // Then: The login should fail with a 401 status code, but Petstore returns 200
        expect(response.status).toBeGreaterThanOrEqual(HTTP_STATUS.BAD_REQUEST);
      });
    }
  }
);
