import { test as base } from '@playwright/test';
import UserClient from '../clients/userClient';
import { env } from '../utils/env';

export const test = base.extend<{
  authorizedClient : UserClient;
}>({
  authorizedClient : async ({ request }, use) => {
    const userClient = new UserClient(request);
    await userClient.login(
      env.username,
      env.password
    );

    await use(userClient);

    await userClient.logout();
  },
});
export { expect } from '@playwright/test';
