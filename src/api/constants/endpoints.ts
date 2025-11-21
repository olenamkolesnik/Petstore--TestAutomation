import { log } from "console";

export const API_ENDPOINTS = {
  USER: {
    LOGIN: '/v2/user/login',
    LOGOUT: '/v2/user/logout',
    CREATE: '/v2/user',
    GET: (userName: string) => `/v2/user/${userName}`,
    UPDATE: (userName: string) => `/v2/user/${userName}`,
    DELETE: (userName: string) => `/v2/user/${userName}`
    },
};