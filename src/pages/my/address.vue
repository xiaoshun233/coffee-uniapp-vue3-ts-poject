<template>
  <view class="address">
    <view class="address-top"
      ><uni-nav-bar
        :fixed="true"
        :border="false"
        background-color="#ffffff"
        color="#000000"
        status-bar
        title="地址列表"
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
    <view class="address-middle">
      <view class="address-background"></view>
      <view class="address-card">
        <view
          class="address-item"
          v-for="(item, index) in addressData"
          :key="index"
        >
          <view class="item-left">
            <view class="address-user">
              <view class="user-info">
                <view class="user-nickname">{{ item.name }}</view>
                <view class="user-phone">{{ item.tel }}</view>
                <view class="default-tip" v-show="item.isDefault === 1">
                  默认</view
                >
              </view>
              <view class="user-address">
                {{
                  item.province + item.city + item.county + item.addressDetail
                }}
              </view>
            </view>
          </view>
          <view class="item-right">
            <navigator
              :url="`/pages/address/address?aid=${item.aid}&mode=edit`"
              open-type="navigate"
              hover-class="navigator-hover"
            >
              <uni-icons type="gear-filled" color="#888888" size="24" />
            </navigator>
          </view>
        </view>
      </view>
    </view>
    <view class="address-bottom">
      <navigator
        :url="`/pages/address/address?mode=new`"
        open-type="navigate"
        hover-class="navigator-hover"
      >
        <view class="add-address">新增地址</view>
      </navigator>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { findAddress } from "@/apis";
import { useUserTokenStore } from "@/stores/userStores";
import type { AddressData } from "@/types";
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";

onShow(() => {
  getAddressData();
});

const addressData = ref<AddressData[]>([]);

const getAddressData = () => {
  const result = findAddress(useUserTokenStore().userToken);
  result.then((res) => {
    if (res.code === 20000) {
      addressData.value = res.result;
    }
  });
};

const returnBack = () => {
  uni.switchTab({
    url: "/pages/home/home",
  });
};
</script>

<style lang="scss" scoped>
.address {
  .address-top {
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
  .address-middle {
    padding-bottom: 10px;
    .address-background {
      width: 100vw;
      height: 16vh;
      background-color: #2e42c7;
    }
    .address-card {
      transform: translateY(-2vh);
      background-color: #ffffff;
      width: 95vw;
      border-radius: 10px 10px 0 0;
      margin: 0 auto 50px;
      padding: 10px 0;
      min-height: 300px;
      .address-item:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
      }
      .address-item {
        display: flex;
        align-items: center;
        margin: 10px 0;
        .item-left {
          margin-left: 12px;
          .address-user {
            min-width: 260px;
            min-height: 54px;
            .user-info {
              display: flex;
              .user-nickname,
              .user-phone,
              .default-tip {
                font-size: 14px;
                margin-right: 20px;
              }
              .user-nickname {
                width: 60px;
                font-size: 14px;
                color: #2d2d2d;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
              }
              .user-phone {
                font-size: 14px;
                color: #2d2d2d;
              }
              .default-tip {
                width: 50px;
                height: 18px;
                text-align: center;
                font-size: 13px;
                color: #ffffff;
                background-color: #0b34ba;
                border-radius: 18px;
              }
            }
            .user-address {
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              max-width: 260px;
              margin: 8px 0;
              font-size: 14px;
              color: #706466;
            }
          }
        }
        .item-right {
          width: 30%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
  .address-bottom {
    position: fixed;
    width: 100vw;
    bottom: 12px;
    margin: 0 auto;
    .add-address {
      margin: 0 auto;
      width: 90vw;
      height: 36px;
      line-height: 36px;
      text-align: center;
      font-size: 14px;
      color: #ffffff;
      border-radius: 20px;
      background-color: #2e42c7;
    }
  }
}
</style>
