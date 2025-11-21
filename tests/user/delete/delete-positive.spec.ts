import { test, expect } from '../../../src/api/fixtures/loginFixture';
import { HTTP_STATUS } from '../../../src/api/constants/constants';
import { createUserPayload } from '../../../src/api/models/factories/createUserPayload';
import { UserModel } from '../../../src/api/models/UserModel';

test.describe('User API - Delete User', () => {
  let payload: UserModel;

  test.beforeEach('Create user', async ({ authorizedClient }) => {
    payload = createUserPayload();
    await authorizedClient.createUser(payload);
  });

  test(
    'should successfully delete an existing user',
    { tag: '@positive' },
    async ({ authorizedClient }) => {
      // When: The user is deleted
      const response = await authorizedClient.deleteUser(payload.username);

      // Then: API should return 200 OK
      expect(response.status).toBe(HTTP_STATUS.OK);

      // And: response contains success message
      expect(response.body.code).toBe(HTTP_STATUS.OK);
      expect(response.body.type).toBe('unknown');
      expect(response.body.message).toBe(payload.username);
    }
  );
});
