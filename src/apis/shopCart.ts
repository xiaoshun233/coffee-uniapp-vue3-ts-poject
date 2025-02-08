import type { AddShopcartDto, PayDto } from "../types";
import { Method, request } from "../utils/requestUtil";

export const addShopcart = async (
  addShopcartDto: AddShopcartDto,
  tokenString: string
) => {
  const respone = await request(
    "/addShopcart",
    { ...addShopcartDto, tokenString },
    Method.POST
  );
  return respone.json();
};

export const findAllShopcart = async (tokenString: string) => {
  const respone = await request(
    "/findAllShopcart",
    { tokenString },
    Method.GET
  );
  return respone.json();
};

export const modifyShopcartCount = async (
  sid: string,
  count: number,
  tokenString: string
) => {
  const respone = await request(
    "/modifyShopcartCount",
    { sid, count, tokenString },
    Method.POST
  );
  return respone.json();
};

export const removeShopcart = async (sids: string[], tokenString: string) => {
  const respone = await request(
    "/removeShopcart",
    { sids: JSON.stringify(sids), tokenString },
    Method.POST
  );
  return respone.json();
};

export const commitShopcart = async (sids: string, tokenString: string) => {
  const respone = await request(
    "/commitShopcart",
    { sids, tokenString },
    Method.GET
  );
  return respone.json();
};

export const pay = async (payDto: PayDto, tokenString: string) => {
  const respone = await request(
    "/pay",
    { ...payDto, tokenString },
    Method.POST
  );
  return respone.json();
};

export const shopcartCount = async (tokenString: string) => {
  const respone = await request("/shopcartCount", { tokenString }, Method.GET);
  return respone.json();
};
