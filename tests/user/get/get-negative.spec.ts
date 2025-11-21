import { test, expect } from '../../../src/api/fixtures/loginFixture';
import { HTTP_STATUS } from '../../../src/api/constants/constants';

test.describe('User API - Get User Negative Scenarios', () => { 
  test('should fail to retrieve user without authentication', async ({
    request,
  }) => {
    // When: Attempt to retrieve user without authentication
    const response = await request.get('/user/nonexistent');

    // Then: API should return 4xx error
    expect(response.status()).toBe(HTTP_STATUS.NOT_FOUND);
  });
});
