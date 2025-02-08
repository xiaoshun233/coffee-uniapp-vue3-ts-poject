<template>
  <view class="home">
    <view class="home-top">
      <image
        :src="userInfoStore.myInfo.userBg"
        mode="aspectFill"
        class="user-bg"
        @click="changeUserImage('bg')"
      />
    </view>
    <view class="home-middle">
      <view class="middle-card">
        <view class="card-user">
          <view class="mode-visitor" v-if="userState === 'visitor'">
            <navigator
              url="/pages/login/login"
              hover-class="none"
              open-type="navigate"
            >
              <view class="visitor-login">登录/注册</view>
            </navigator>
          </view>
          <view class="mode-user" v-else>
            <view class="user-image">
              <image
                :src="userInfoStore.myInfo.userImg"
                mode="aspectFill"
                class="image-img"
                @longpress="changeUserImage('avatar')"
            /></view>
            <view class="user-info">
              <view class="info-name">{{ userInfoStore.myInfo.nickName }}</view>
              <view class="info-desc">{{ userInfoStore.myInfo.desc }}</view>
            </view>
          </view>
        </view>
        <view class="card-nav">
          <view
            class="nav-item"
            v-for="(item, index) in homeNavData"
            :key="index"
          >
            <navigator
              :url="item.url"
              hover-class="navigator-hover"
              open-type="navigate"
            >
              <view class="item-content">
                <view class="nav-text">{{ item.text }}</view>
                <view class="nav-icon"
                  ><uni-icons type="right" color="#9f9f9f" size="24"
                /></view>
              </view>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useUserInfoStore, useUserTokenStore } from "@/stores/userStores";
import { changeUserImage } from "@/utils/userUtil";
import { onShow } from "@dcloudio/uni-app";
import { computed } from "vue";

const userInfoStore = useUserInfoStore();

const userState = computed(() => {
  if (
    useUserTokenStore().userToken !== "" &&
    userInfoStore.myInfo.nickName !== ""
  ) {
    return "user";
  } else {
    return "visitor";
  }
});

const getNavUrl = (key: string) => "/pages/my/" + key;
const homeNavData = [
  { url: getNavUrl("info"), text: "个人资料" },
  { url: getNavUrl("order"), text: "我的订单" },
  { url: getNavUrl("collection"), text: "我的收藏" },
  { url: getNavUrl("address"), text: "地址管理" },
  { url: getNavUrl("safe"), text: "安全中心" },
];

onShow(() => {
  userInfoStore.setMyInfo();
});
</script>

<style lang="scss" scoped>
.home {
  .home-top {
    width: 100vw;
    height: 30vh;
    .user-bg {
      width: 100%;
      height: 100%;
    }
  }
  .home-middle {
    .middle-card {
      width: 92vw;
      border-radius: 10px;
      background-color: #fff;
      margin: 0 auto;
      transform: translateY(-6vh);
      opacity: 0.8;
      .card-user {
        .mode-visitor {
          height: 150px;
          display: flex;
          align-items: center;
          .visitor-login {
            font-size: 20px;
            color: #2e42c7;
            padding: 10px 20px;
          }
        }
        .mode-user {
          height: 150px;
          display: flex;
          align-items: flex-start;
          .user-image {
            width: 100px;
            height: 100px;
            margin: 20px;
            overflow: hidden;
            .image-img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
          .user-info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            margin: 20px 0;
            .info-name {
              font-size: 16px;
              font-weight: bold;
            }
            .info-desc {
              margin-top: 8px;
              font-size: 14px;
              color: #9f9f9f;
            }
          }
        }
      }
      .card-nav {
        display: flex;
        flex-direction: column;
        .nav-item {
          width: 95%;
          margin: 0 auto;
          .item-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 0;
            .nav-text {
              font-size: 16px;
              font-weight: bold;
            }
          }
        }
        .nav-item:not(:last-child) {
          border-bottom: 1px solid #f0f0f0;
        }
      }
    }
  }
}
</style>
