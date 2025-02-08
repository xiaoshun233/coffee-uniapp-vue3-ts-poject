import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { AccountInfo, Info, MyInfo } from "../types";
import { findAccountInfo, findMy } from "../apis";

export const useUserTokenStore = defineStore(
  "userToken",
  () => {
    const userToken = ref<string>("");

    function setUserToken(token: string) {
      userToken.value = token;
    }

    return { userToken, setUserToken };
  },
  { unistorage: true }
);

export const useUserInfoStore = defineStore("userInfo", () => {
  const defaultInfo = {
    desc: "",
    nickName: "",
    userImg: "/static/default/default_userImg.png",
    vip: 0,
    userBg: "/static/default/default_userBg.jpg",
    phone: "",
    userId: "",
  };
  const myInfo = ref<MyInfo>(defaultInfo);
  const accountInfo = ref<AccountInfo>(defaultInfo);

  function setMyInfo() {
    try {
      findMy(getToken())
        .then((res) => {
          myInfo.value = res.result[0];
          setDefalutUserInfo(myInfo.value);
        })
        .catch(() => {
          resetInfo();
        });
    } catch (e) {
      console.error(e);
      resetInfo();
    }
  }

  function setAccountInfo() {
    try {
      findAccountInfo(getToken())
        .then((res) => {
          accountInfo.value = res.result[0];
          setDefalutUserInfo(accountInfo.value);
        })
        .catch(() => {
          resetInfo();
        });
    } catch (e) {
      console.error(e);
      resetInfo();
    }
  }

  function getToken() {
    const userToken = useUserTokenStore().userToken;
    if (userToken === "") {
      throw new Error("token is empty,should need login");
    }
    return useUserTokenStore().userToken;
  }

  const resetInfo = () => {
    myInfo.value = defaultInfo;
    accountInfo.value = defaultInfo;
  };

  const setDefaultUserImage = (info: MyInfo | AccountInfo) => {
    if (info.userImg === "http://127.0.0.1:10002/assets/default.png") {
      info.userImg = "/static/default/default_userImg.png";
    }
    if (
      "userBg" in info &&
      info.userBg === "http://127.0.0.1:10002/assets/default_bg.jpg"
    ) {
      info.userBg = "/static/default/default_userBg.jpg";
    }
  };

  const setDefaultUserDesc = (info: MyInfo | AccountInfo) => {
    if (info.desc === "") {
      info.desc = "这个人很懒，什么都没有留下！";
    }
  };

  const setDefalutUserInfo = (info: MyInfo | AccountInfo) => {
    setDefaultUserImage(info);
    setDefaultUserDesc(info);
  };

  return { myInfo, accountInfo, setMyInfo, setAccountInfo };
});
