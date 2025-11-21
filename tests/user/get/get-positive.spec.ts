import { test, expect } from '../../../src/api/fixtures/loginFixture';
import { HTTP_STATUS } from '../../../src/api/constants/constants';
import { createUserPayload } from '../../../src/api/models/factories/createUserPayload';
import { UserModel } from '../../../src/api/models/UserModel';

test.describe('User API - Get User', () => {
  let payload: UserModel;

  test.beforeEach('Create user', async ({ authorizedClient }) => {
    payload = createUserPayload();
    await authorizedClient.createUser(payload);
  });

  test.afterEach('Delete created user', async ({ authorizedClient }) => {
    await authorizedClient.deleteUser(payload.username);
  });

  test(
    'should successfully retrieve an existing user',
    { tag: '@positive' },
    async ({ authorizedClient }) => {
      // When: The user is retrieved
      const response = await authorizedClient.getUser(payload.username);

      // Then: API should return 200 OK
      expect(response.status).toBe(HTTP_STATUS.OK);

      // And: response contains correct user data
      expect(response.body.id).toBe(payload.id);
      expect(response.body.username).toBe(payload.username);
      expect(response.body.password).toBe(payload.password);
      expect(response.body.email).toBe(payload.email);
      expect(response.body.firstName).toBe(payload.firstName);
      expect(response.body.lastName).toBe(payload.lastName);
      expect(response.body.phone).toBe(payload.phone);
      expect(response.body.userStatus).toBe(payload.userStatus);
    }
  );
});
