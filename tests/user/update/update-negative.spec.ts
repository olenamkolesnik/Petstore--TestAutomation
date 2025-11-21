import { test, expect } from '../../../src/api/fixtures/loginFixture';
import { HTTP_STATUS } from '../../../src/api/constants/constants';
import { createUserPayload } from '../../../src/api/models/factories/createUserPayload';

test.describe('User API - Update User Negative Scenarios', () => {
  let existingUser = createUserPayload();

  test.beforeEach(async ({ authorizedClient }) => {
    //Given: create a user to be updated
    await authorizedClient.createUser(existingUser);
  });

  test.afterEach(async ({ authorizedClient }) => {
    // Cleanup: delete the created user
    await authorizedClient.deleteUser(existingUser.username);
  });

  const INVALID_USERNAMES = ['nonexistentuser', '', null, 12345];

  INVALID_USERNAMES.forEach((username, index) => {
    test(`should fail to update user - invalid username [${
      index + 1
    }]`, async ({ authorizedClient }) => {
      // When: Attempt to update a user with invalid username
      const payload = createUserPayload();
      const response = await authorizedClient.updateUser(
        username as any,
        payload as any
      );

      // Then: API should return 4xx error
      expect(response.status).toBeGreaterThanOrEqual(HTTP_STATUS.BAD_REQUEST);
    });
  });

  test('should fail to update user with unknown fields', async ({
    authorizedClient,
  }) => {
    // When: Attempt to update a user with unknown fields
    const payload = { ...createUserPayload(), unknownField: 'test' };
    const response = await authorizedClient.updateUser(
      existingUser.username,
      payload as any
    );

    // Then: API should return 4xx error
    expect(response.status).toBeGreaterThanOrEqual(HTTP_STATUS.BAD_REQUEST);
  });

  test('should fail to update user with empty payload', async ({
    authorizedClient,
  }) => {
    // When: Attempt to update a user with empty payload
    const response = await authorizedClient.updateUser(
      existingUser.username,
      {} as any
    );

    // Then: API should return 4xx error
    expect(response.status).toBeGreaterThanOrEqual(HTTP_STATUS.BAD_REQUEST);
  });

  test('should fail to update user without authentication', async ({
    request,
  }) => {
    // When: Attempt to update a user without authentication
    const payload = createUserPayload();
    const response = await request.put(`/user/${existingUser.username}`, {
      data: payload,
    });

    // Then: API should return 401 Unauthorized
    expect(response.status()).toBeGreaterThanOrEqual(HTTP_STATUS.UNAUTHORIZED);
  });
});
