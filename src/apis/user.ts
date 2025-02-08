import type { Login, Register } from "../types";
import { request, Method } from "../utils/requestUtil";

export const login = async (loginForm: Login) => {
  const respone = await request("/login", loginForm, Method.POST);
  return respone.json();
};

export const register = async (registerForm: Register) => {
  const respone = await request("/register", registerForm, Method.POST);
  return respone.json();
};

export const findAccountInfo = async (tokenString: string) => {
  const respone = await request(
    "/findAccountInfo",
    {
      tokenString,
    },
    Method.GET
  );
  return respone.json();
};

export const findMy = async (tokenString: string) => {
  const respone = await request(
    "/findMy",
    {
      tokenString,
    },
    Method.GET
  );
  return respone.json();
};

export const updateUserBg = async (
  imgType: string,
  serverBase64Img: string,
  tokenString: string
) => {
  const respone = await request(
    "/updateUserBg",
    {
      imgType,
      serverBase64Img,
      tokenString,
    },
    Method.POST
  );
  return respone.json();
};

export const updateAvatar = async (
  imgType: string,
  serverBase64Img: string,
  tokenString: string
) => {
  const respone = await request(
    "/updateAvatar",
    {
      imgType,
      serverBase64Img,
      tokenString,
    },
    Method.POST
  );
  return respone.json();
};

export const updateNickName = async (nickName: string, tokenString: string) => {
  const respone = await request(
    "/updateNickName",
    {
      nickName,
      tokenString,
    },
    Method.POST
  );
  return respone.json();
};

export const updateDesc = async (desc: string, tokenString: string) => {
  const respone = await request(
    "/updateDesc",
    {
      desc,
      tokenString,
    },
    Method.POST
  );
  return respone.json();
};
