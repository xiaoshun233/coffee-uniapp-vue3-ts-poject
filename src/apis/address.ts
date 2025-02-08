import type { AddAddressDto, EditAddressDto } from "../types/address";
import { Method, request } from "../utils/requestUtil";

export const findAddress = async (tokenString: string) => {
  const respone = await request("/findAddress", { tokenString }, Method.GET);
  return respone.json();
};

export const findAddressByAid = async (aid: string, tokenString: string) => {
  const respone = await request(
    "/findAddressByAid",
    { aid, tokenString },
    Method.GET
  );
  return respone.json();
};

export const addAddress = async (
  address: AddAddressDto,
  tokenString: string
) => {
  const respone = await request(
    "/addAddress",
    { ...address, tokenString },
    Method.POST
  );
  return respone.json();
};

export const deleteAddress = async (aid: number, tokenString: string) => {
  const respone = await request(
    "/deleteAddress",
    { aid, tokenString },
    Method.POST
  );
  return respone.json();
};

export const editAddress = async (
  editAddress: EditAddressDto,
  tokenString: string
) => {
  const respone = await request(
    "/editAddress",
    { ...editAddress, tokenString },
    Method.POST
  );
  return respone.json();
};
