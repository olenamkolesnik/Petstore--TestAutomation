import { test, expect } from '../../../src/api/fixtures/loginFixture';
import { HTTP_STATUS } from '../../../src/api/constants/constants';
import { createUserPayload } from '../../../src/api/models/factories/createUserPayload';

test.describe('User API - Delete User Negative Scenarios', () => {
  test('should fail to delete user without authentication', async ({
    request,
  }) => {
    // Given: create a user to attempt deletion without auth
    const payload = createUserPayload();
    await request.post('/user', { data: payload });

    // When: Attempt to delete the user without authentication
    const response = await request.fetch(`/user/${payload.username}`, {
      method: 'DELETE',
    });

    // Then: API should return 4xx error
    expect(response.status()).toBeGreaterThanOrEqual(HTTP_STATUS.UNAUTHORIZED);
  });
});
