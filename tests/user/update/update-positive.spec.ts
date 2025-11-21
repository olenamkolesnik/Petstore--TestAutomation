import { test, expect } from '../../../src/api/fixtures/loginFixture';
import { HTTP_STATUS } from '../../../src/api/constants/constants';
import { createUserPayload } from '../../../src/api/models/factories/createUserPayload';
import { UserModel } from '../../../src/api/models/UserModel';
import { logger } from '../../../src/api/utils/logger';

test.describe('User API - Update User', () => {
  let payload: UserModel, updatedpayload: UserModel;

  test.beforeEach('Create user', async ({ authorizedClient }) => {
    // Given: Create a user to be updated
    payload = createUserPayload();
    await authorizedClient.createUser(payload);

    // And: Prepare updated user data
    updatedpayload = createUserPayload();
  });

  test.afterEach('Delete created user', async ({ authorizedClient }) => {
    await authorizedClient.deleteUser(payload.username);
  });

  test(
    'should successfully update an existing user',
    { tag: '@positive' },
    async ({ authorizedClient }) => {
      // When: The user is updated
      const response = await authorizedClient.updateUser(
        payload.username,
        updatedpayload
      );
      // Then: API should return 200 OK
      expect(response.status).toBe(HTTP_STATUS.OK);

      // And: response contains success message
      expect(response.body.code).toBe(HTTP_STATUS.OK);
      expect(response.body.type).toBe('unknown');
      expect(response.body.message).toBe(updatedpayload.id.toString());

      // And: The updated user can be retrieved
      const getUserResponse = await authorizedClient.getUser(
        updatedpayload.username
      );
      expect(getUserResponse.status).toBe(HTTP_STATUS.OK);
      expect(getUserResponse.body.id).toBe(updatedpayload.id);
      expect(getUserResponse.body.username).toBe(updatedpayload.username);
      expect(getUserResponse.body.password).toBe(updatedpayload.password);
      expect(getUserResponse.body.email).toBe(updatedpayload.email);
      expect(getUserResponse.body.firstName).toBe(updatedpayload.firstName);
      expect(getUserResponse.body.lastName).toBe(updatedpayload.lastName);
      expect(getUserResponse.body.phone).toBe(updatedpayload.phone);
      expect(getUserResponse.body.userStatus).toBe(updatedpayload.userStatus);
    }
  );
});
