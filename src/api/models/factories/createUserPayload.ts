import { UserModel } from "../UserModel";
import { USER_DEFAULTS } from "../UserDefaults";

export const createUserPayload = (
  overrides: Partial<UserModel> = {}
): UserModel => {
  const timestamp = Date.now();

  return {
    id: overrides.id ?? timestamp,
    username: overrides.username ?? `user${timestamp}`,
    firstName: overrides.firstName ?? USER_DEFAULTS.firstName,
    lastName: overrides.lastName ?? USER_DEFAULTS.lastName,
    email: overrides.email ?? `user${timestamp}@example.com`,
    password: overrides.password ?? USER_DEFAULTS.password,
    phone: overrides.phone ?? USER_DEFAULTS.phone,
    userStatus: overrides.userStatus ?? USER_DEFAULTS.userStatus
  };
};
