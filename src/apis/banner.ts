import { Method, request } from "../utils/requestUtil";

export const getBanner = async () => {
  const respone = await request("/banner", null, Method.GET);
  return respone.json();
};
