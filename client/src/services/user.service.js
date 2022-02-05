import { requestGet, api } from "./api";

export const apiUsers = async () => {
  const users = await requestGet(api.users);
  return users;
};
