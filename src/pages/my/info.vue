<template>
  <view class="info">
    <view class="info-top"
      ><uni-nav-bar
        :fixed="true"
        :border="false"
        background-color="#ffffff"
        color="#000000"
        status-bar
        title="个人资料"
        @clickLeft="returnBack"
      >
        <template v-slot:left>
          <view class="top-nav-left">
            <uni-icons type="left" color="#2e42c7" size="20" />
            <view class="left-text">返回</view>
          </view>
        </template></uni-nav-bar
      ></view
    >
    <view class="info-middle">
      <view class="info-background"></view>
      <view class="info-card">
        <view class="card-item">
          <view class="item-text">头像</view>
          <view class="item-content"
            ><image
              :src="userInfoStore.accountInfo.userImg"
              mode="aspectFill"
              class="user-image"
              @longpress="changeUserImage('avatar')"
          /></view>
        </view>
        <view class="card-item">
          <view class="item-text">用户id</view>
          <view class="item-content">{{
            userInfoStore.accountInfo.userId
          }}</view>
        </view>
        <view class="card-item">
          <view class="item-text">昵称</view>
          <view class="item-content" @click="openInputPopup('nickname')">{{
            userInfoStore.accountInfo.nickName
          }}</view>
        </view>
        <view class="card-item">
          <view class="item-text">简介</view>
          <view class="item-content" @click="openInputPopup('desc')">
            {{ userInfoStore.accountInfo.desc }}
          </view>
        </view>
      </view>
    </view>

    <uni-popup ref="inputPopupRef" type="center">
      <view class="popup-content">
        <uni-easyinput
          :type="editMode === 'nickname' ? 'text' : 'textarea'"
          v-model="editInputValue"
          :placeholder="`请输入需要更改的${
            editMode === 'nickname' ? '昵称' : '简介'
          }`"
          class="popup-input"
        ></uni-easyinput>
        <view class="popup-button">
          <button @click="confirmInput" class="popup-confirm">确认</button>
          <button @click="closeInputPopup" class="popup-cancel">取消</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { updateDesc, updateNickName } from "@/apis";
import { useUserInfoStore, useUserTokenStore } from "@/stores/userStores";
import { changeUserImage } from "@/utils/userUtil";
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";

onShow(() => {
  userInfoStore.setAccountInfo();
});

const inputPopupRef = ref<any>();

const editMode = ref<"nickname" | "desc">("nickname");

const editInputValue = ref<string>("");

const confirmInput = () => {
  if (
    editInputValue.value === userInfoStore.accountInfo.nickName ||
    editInputValue.value === userInfoStore.accountInfo.desc
  ) {
    return;
  }

  let result: Promise<any>;
  if (editMode.value === "nickname") {
    result = updateNickName(
      editInputValue.value,
      useUserTokenStore().userToken
    );
  } else {
    result = updateDesc(editInputValue.value, useUserTokenStore().userToken);
  }
  result.then((res) => {
    if (res.code === "C001" || res.code === "D001") {
      userInfoStore.setAccountInfo();
      uni.showToast({
        title: res.msg,
        icon: "success",
      });
    }
  });
  inputPopupRef.value.close();
};

const closeInputPopup = () => {
  inputPopupRef.value.close();
};

const openInputPopup = (mode: "nickname" | "desc") => {
  editMode.value = mode;
  if (mode === "nickname") {
    editInputValue.value = userInfoStore.accountInfo.nickName;
  } else if (mode === "desc") {
    editInputValue.value = userInfoStore.accountInfo.desc;
  }
  inputPopupRef.value.open();
};

const userInfoStore = useUserInfoStore();

const returnBack = () => {
  uni.switchTab({
    url: "/pages/home/home",
  });
};
</script>

<style lang="scss" scoped>
.info {
  .info-top {
    height: 44px;
    .top-nav-left {
      display: flex;
      align-items: center;
      .left-text {
        font-size: 14px;
        color: #2e42c7;
      }
    }
  }
  .info-middle {
    .info-background {
      width: 100vw;
      height: 16vh;
      background-color: #2e42c7;
    }
    .info-card {
      transform: translateY(-2vh);
      background-color: #ffffff;
      width: 95vw;
      height: 260px;
      border-radius: 10px 10px 0 0;
      margin: 0 auto;
      .card-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 60px;
        margin: 0 10px;
        .item-text {
          color: #222222;
          font-size: 14px;
        }
        .item-content {
          color: #b8b8b8;
          font-size: 14px;
          .user-image {
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }
      }
      .card-item:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }
    }
  }
  .popup-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
    border-radius: 10px;
    .popup-input {
      width: 80%;
      margin: 10px 0;
    }
    .popup-button {
      display: flex;
      align-items: center;
      justify-content: center;
      .popup-confirm,
      .popup-cancel {
        width: 100px;
        line-height: 30px;
        margin: 5px 10px;
        border-radius: 20px;
        border: none;
        font-size: 14px;
      }
      .popup-confirm {
        color: #ffffff;
        background-color: #2e42c7;
      }
      .popup-cancel {
        color: #2e42c7;
        background-color: #f0f0f0;
      }
    }
  }
}
</style>
