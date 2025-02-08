import { updateAvatar, updateUserBg } from "../apis";
import { useUserInfoStore, useUserTokenStore } from "../stores/userStores";

export const changeUserImage = (mode: "bg" | "avatar") => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    crop: {
      quality: 60,
      width: mode === "bg" ? 400 : 200,
      height: mode === "bg" ? 200 : 200,
    },
    success: async (res) => {
      const tempFilePaths = res.tempFilePaths[0];

      const tempFileSize = (res.tempFiles as Array<any>)[0].size;
      if (tempFileSize > 1024 * 512) {
        uni.showToast({
          title: "图片大小不能超过512KB",
          icon: "none",
          duration: 1500,
        });
        return;
      }
      // #ifdef H5
      const reader = new FileReader();
      await fetch(tempFilePaths)
        .then((res) => res.blob())
        .then((blob) => {
          reader.readAsDataURL(blob);
          reader.onload = () => {
            if (reader.result) {
              uploadUserImage(reader.result as string, mode);
            }
          };
        });

      // #endif

      // #ifdef APP-PLUS
      const fileSystemManager = uni.getFileSystemManager();
      fileSystemManager.readFile({
        filePath: tempFilePaths,
        encoding: "base64",
        success: (readFileRes) => {
          uploadUserImage(readFileRes.data as string, mode);
        },
        fail: (err) => {
          console.error("读取文件失败:", err);
        },
      });
      // #endif
    },
  });
};

const uploadUserImage = (base64Data: string, mode: "bg" | "avatar") => {
  uni.showModal({
    title: "提示",
    content: mode === "bg" ? "是否更换背景图片" : "是否更换头像",
    success: (res) => {
      if (res.confirm) {
        const imgType = base64Data.split(",")[0].split("/")[1].split(";")[0];
        const serverBase64Img = base64Data.replace(
          /^data:image\/[A-Za-z]+;base64,/,
          ""
        );
        let result;
        if (mode === "avatar") {
          result = updateAvatar(
            imgType,
            serverBase64Img,
            useUserTokenStore().userToken
          );
        } else if (mode === "bg") {
          result = updateUserBg(
            imgType,
            serverBase64Img,
            useUserTokenStore().userToken
          );
        }

        Promise.race([
          result,
          new Promise((_, reject) =>
            setTimeout(() => reject("请求超时"), 5000)
          ),
        ])
          .then((res) => {
            if (res.code === "I001") {
              useUserInfoStore().setMyInfo();
              uni.showToast({
                title: res.msg,
                icon: "success",
                duration: 2000,
              });
            }
          })
          .catch((err) => {
            console.error("上传失败:", err);
            uni.showToast({
              title: "上传失败",
              icon: "error",
              duration: 2000,
            });
          });
      }
    },
  });
};
