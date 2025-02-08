import { Method, request } from "../utils/requestUtil";

export const searchGoods = async (searchValue: string) => {
  const respone = await request(
    "/search",
    {
      name: searchValue,
    },
    Method.GET
  );
  return respone.json();
};

export const getGoods = async (goodsKey: string, goodsValue: string) => {
  const respone = await request(
    "/typeProducts",
    {
      key: goodsKey,
      value: goodsValue,
    },
    Method.GET
  );
  return respone.json();
};

export const getHotGoods = () => {
  return getGoods("isHot", "1");
};

export const getGoodsType = async () => {
  const respone = await request("/type", null, Method.GET);
  return respone.json();
};

export const getGoodsDetail = async (pid: string) => {
  const respone = await request("/productDetail", { pid }, Method.GET);
  return respone.json();
};

export const findlike = async (pid: string, tokenString: string) => {
  const respone = await request("/findlike", { pid, tokenString }, Method.GET);
  return respone.json();
};

export const likeGoods = async (pid: string, tokenString: string) => {
  const respone = await request("/like", { pid, tokenString }, Method.POST);
  return respone.json();
};

export const unlikeGoods = async (pid: string, tokenString: string) => {
  const respone = await request("/notlike", { pid, tokenString }, Method.POST);
  return respone.json();
};

export const findAllLike = async (tokenString: string) => {
  const respone = await request("/findAllLike", { tokenString }, Method.GET);
  return respone.json();
};
