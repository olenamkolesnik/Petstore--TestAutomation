import { test, expect } from '../../../src/api/fixtures/loginFixture';
import { HTTP_STATUS } from '../../../src/api/constants/constants';
import { createUserPayload } from '../../../src/api/models/factories/createUserPayload';
import { UserModel } from '../../../src/api/models/UserModel';

test.describe(
  'User API - Create User Business-Level Negative Scenarios',
  { tag: '@negative' },
  () => {
    let existingUser = createUserPayload();

    test.beforeEach(async ({ authorizedClient }) => {
      //Given: create a user to test duplicates
      await authorizedClient.createUser(existingUser);
    });

    test.afterEach(async ({ authorizedClient }) => {
      // Cleanup: delete the created user
      await authorizedClient.deleteUser(existingUser.username);
    });

    const BUSINESS_NEGATIVE_CASES: {
      field: keyof UserModel;
      value: string;
      reason: string;
    }[] = [
      {
        field: 'username',
        value: existingUser.username,
        reason: 'Duplicate username',
      },
      { field: 'email', value: existingUser.email, reason: 'Duplicate email' },
    ];
    BUSINESS_NEGATIVE_CASES.forEach(({ field, value, reason }) => {
      test(`should fail to create user - ${reason}`, async ({
        authorizedClient,
      }) => {
        // When: Attempt to create user with invalid data
        const payload = createUserPayload();
        (payload as any)[field] = value;
        const response = await authorizedClient.createUser(payload as any);

        // Then: API should return 400 Bad Request
        expect(response.status).toBe(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.code).toBe(HTTP_STATUS.BAD_REQUEST);
      });
    });
  }
);
