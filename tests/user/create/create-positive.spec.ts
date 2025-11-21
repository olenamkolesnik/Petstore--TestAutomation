import { test, expect } from '../../../src/api/fixtures/loginFixture';
import { HTTP_STATUS } from '../../../src/api/constants/constants';
import { createUserPayload } from '../../../src/api/models/factories/createUserPayload';
import { UserModel } from '../../../src/api/models/UserModel';

test.describe('User API - Create User', () => {
  let payload: UserModel;

  test.beforeEach('Create user payload', () => {
    payload = createUserPayload();
  });

  test.afterEach('Delete created user', async ({ authorizedClient }) => {
    await authorizedClient.deleteUser(payload.username);
  });

  test(
    'should successfully create a new user',
    { tag: '@positive' },
    async ({ authorizedClient }) => {
      // When: The user is created
      const response = await authorizedClient.createUser(payload);

      // Then: API should return 200 OK
      expect(response.status).toBe(HTTP_STATUS.OK);

      // And: response contains success message
      expect(response.body.code).toBe(HTTP_STATUS.OK);
      expect(response.body.type).toBe('unknown');
      expect(response.body.message).toBe(payload.id.toString());

      // And: The created user can be retrieved
      const getUserResponse = await authorizedClient.getUser(payload.username);
      expect(getUserResponse.status).toBe(HTTP_STATUS.OK);
      expect(getUserResponse.body.username).toBe(payload.username);
    }
  );
});
