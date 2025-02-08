<template>
  <view class="order">
    <view class="order-top">
      <uni-nav-bar
        :fixed="true"
        :border="false"
        background-color="#ffffff"
        color="#000000"
        status-bar
        title="订单页面"
        @clickLeft="returnBack"
      >
        <template v-slot:left>
          <view class="top-nav-left">
            <uni-icons type="left" color="#2e42c7" size="20" />
            <view class="left-text">返回</view>
          </view>
        </template></uni-nav-bar
      >
    </view>
    <view class="order-middle">
      <view class="order-address-card">
        <view
          class="address-empty"
          v-if="addressData.length <= 0 && selectAddressData === null"
          @click="gotoNewAddress"
        >
          尚未拥有地址，点击我前去添加
        </view>
        <view class="address-content" v-else>
          <view class="address-button" @click="openSelectAddressPopup">
            <view>选择地址</view>
            <uni-icons type="right" color="#8b8a99" size="20" />
          </view>
          <view class="address-user">
            <view class="user-info">
              <view class="user-nickname">{{ selectAddressData?.name }}</view>
              <view class="user-phone">{{ selectAddressData?.tel }}</view>
              <view
                class="default-tip"
                v-show="selectAddressData?.isDefault === 1"
              >
                默认</view
              >
            </view>
            <view class="user-address">
              {{
                selectAddressData === null
                  ? ""
                  : selectAddressData.province +
                    selectAddressData?.city +
                    selectAddressData?.county +
                    selectAddressData?.addressDetail
              }}
            </view>
          </view>
        </view>
      </view>
      <view class="order-info-card">
        <view class="info-title">订单信息</view>
        <view class="info-goods">
          <view
            class="goods-item"
            v-for="(item, index) in addressGoodsData"
            :key="index"
          >
            <view class="item-left">
              <image
                class="left-image"
                :src="item.small_img"
                mode="aspectFill"
              />
            </view>
            <view class="item-center">
              <view class="goods-name">
                <view class="name-top">
                  <view class="item-name">
                    {{ item.name }}
                  </view>
                  <view class="item-rules"> {{ item.rule }} </view>
                </view>
                <view class="name-bottom">{{ item.enname }}</view>
              </view>
              <view class="goods-price">￥{{ item.price }}</view>
            </view>
            <view class="item-right">
              <view class="item-count">x{{ item.count }}</view>
            </view>
          </view>
        </view>
        <view class="dividing-line">
          <view class="line"></view>
        </view>
        <view class="total-message">
          <view class="message-top">
            {{ dayjs().format("YYYY-MM-DD HH:mm:ss") }}
          </view>
          <view class="message-bottom">
            <view class="total-count">共计{{ totalData.count }}件</view>
            <view class="total-price"
              >合计：￥{{ totalData.price.toFixed(2) }}</view
            >
          </view>
        </view>
      </view>
    </view>
    <view class="order-bottom">
      <button class="order-billing" @click="payOrder">立即结算</button>
    </view>
    <uni-popup
      ref="selectAddressPopupRef"
      type="bottom"
      class="select-address-popup"
    >
      <uni-nav-bar class="popup-top" left-width="160rpx" :border="false">
        <template v-slot:left>
          <view class="left-text">选择地址</view>
        </template>
        <template v-slot:right>
          <uni-icons
            type="closeempty"
            color="#b2b2b2"
            size="20"
            @click="closeSelectAddressPopup"
            class="right-icon"
          />
        </template>
      </uni-nav-bar>
      <view class="popup-content">
        <view
          class="address-item"
          v-for="(item, index) in addressData"
          :key="index"
        >
          <view class="item-left">
            <TickCheckbox
              v-model="item.checked"
              @click="selectAddress($event, item)"
            />
          </view>
          <view class="item-right">
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
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import TickCheckbox from "@/components/checkbox/TickCheckbox.vue";
import { commitShopcart, findAddress, pay } from "@/apis";
import { useUserTokenStore } from "@/stores/userStores";
import type { ShopCartGoods, AddressData } from "@/types";
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { ref } from "vue";

interface AddressCheckedData extends AddressData {
  checked: boolean;
}

const addressData = ref<AddressCheckedData[]>([]);

const addressGoodsData = ref<ShopCartGoods[]>([]);

const selectAddressData = ref<AddressData | null>(null);

const sidsData = ref("");

const selectAddressPopupRef = ref();

const openSelectAddressPopup = () => {
  selectAddressPopupRef.value?.open();
};

const closeSelectAddressPopup = () => {
  selectAddressPopupRef.value?.close();
};

const selectAddress = (e: boolean, item: AddressCheckedData) => {
  addressData.value.forEach((address) => {
    address.checked = false;
  });
  item.checked = true;
  selectAddressData.value = item;
  closeSelectAddressPopup();
};

const totalData = ref({
  count: 0,
  price: 0,
});

const computeTotalData = () => {
  let count = 0;
  let price = 0;
  addressGoodsData.value.forEach((item) => {
    count += item.count;
    price += item.count * item.price;
  });
  totalData.value = {
    count,
    price,
  };
};

onLoad((option) => {
  getAddressData();
  sidsData.value = option ? option.sids : "";
  getcommitShopcartData();
});

const getcommitShopcartData = () => {
  const result = commitShopcart(sidsData.value, useUserTokenStore().userToken);
  result
    .then((res) => {
      if (res.code === 50000) {
        addressGoodsData.value = res.result;
        computeTotalData();
      }
    })
    .finally(() => {
      if (addressGoodsData.value.length <= 0) {
        uni.showToast({
          title: "未获取到订单商品信息",
          icon: "none",
        });
        setTimeout(() => {
          uni.switchTab({ url: "/pages/cart/cart" });
        }, 2000);
      }
    });
};

const getAddressData = () => {
  const result = findAddress(useUserTokenStore().userToken);
  result.then((res) => {
    if (res.code === 20000) {
      res.result.forEach((item: AddressData) => {
        let checked = false;
        if (item.isDefault === 1) {
          selectAddressData.value = item;
          checked = true;
        }
        addressData.value.push({
          ...item,
          checked,
        });
      });
    }
  });
};

const returnBack = () => {
  uni.switchTab({ url: "/pages/cart/cart" });
};

const gotoNewAddress = () => {
  uni.navigateTo({
    url: "/pages/address/address?mode=new",
  });
};

const payOrder = () => {
  if (selectAddressData.value === null) {
    uni.showToast({
      title: "请选择地址",
      icon: "none",
    });
    return;
  }
  if (addressGoodsData.value.length <= 0 || addressData.value.length <= 0) {
    uni.showToast({
      title: "未获取到订单商品信息",
      icon: "none",
    });
    return;
  }
  const address =
    selectAddressData.value.province +
    selectAddressData.value.city +
    selectAddressData.value.county +
    selectAddressData.value.addressDetail;

  const result = pay(
    {
      phone: selectAddressData.value.tel,
      address,
      sids: sidsData.value,
      receiver: selectAddressData.value.name,
    },
    useUserTokenStore().userToken
  );
  result.then((res) => {
    if (res.code === 60000) {
      uni.showToast({
        title: "支付成功",
        icon: "success",
      });
      setTimeout(() => {
        uni.switchTab({ url: "/pages/cart/cart" });
      }, 2000);
    } else {
      uni.showToast({
        title: "支付失败",
        icon: "error",
      });
    }
  });
};
</script>

<style lang="scss" scoped>
.order {
  .order-top {
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
  .order-middle {
    .order-address-card,
    .address-info-card {
      width: 95vw;
      margin: 10px auto 0;
      padding: 5px 0;
      border-radius: 8px;
      background-color: #ffffff;
    }
    .order-address-card {
      .address-empty {
        height: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 32rpx;
        color: #8b8a99;
      }
      .address-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .address-button {
          display: flex;
          align-items: center;
          margin: 8px 0 0 16px;
          font-size: 14px;
          color: #878da1;
        }
        .address-user {
          margin: 16px 16px 0;
          .user-info {
            display: flex;
            .user-nickname,
            .user-phone,
            .default-tip {
              font-size: 14px;
              margin-right: 20px;
            }
            .user-nickname {
              font-size: 14px;
              font-weight: bold;
              color: #0b34ba;
            }
            .user-phone {
              font-size: 14px;
              color: #706466;
            }
            .default-tip {
              width: 50px;
              line-height: 18px;
              text-align: center;
              font-size: 13px;
              color: #ffffff;
              background-color: #0b34ba;
              border-radius: 18px;
            }
          }
          .user-address {
            margin: 8px 0;
            font-size: 14px;
            color: #706466;
          }
        }
      }
    }
    .order-info-card {
      background-color: #ffffff;
      width: 95vw;
      margin: 10px auto 0;
      padding: 8px 0;
      .info-title {
        margin: 10px 0 0 16px;
        font-size: 14px;
        color: #242424;
      }
      .info-goods {
        margin: 12px 0 0 16px;
        .goods-item {
          height: 100px;
          display: flex;
          justify-content: space-between;
          margin: 10px 0;
          .item-left {
            width: 100px;
            height: 100px;
            background-color: #f5f5f5;
            .left-image {
              width: 100%;
              height: 100%;
            }
          }
          .item-center {
            padding: 0 10px;
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .goods-name {
              .name-top {
                display: flex;
                align-items: center;
                .item-name {
                  font-size: 14px;
                  font-weight: bold;
                  color: #6b6b6b;
                }
                .item-rules {
                  margin-left: 10px;
                  font-size: 12px;
                  color: #b2b2b2;
                }
              }
              .name-bottom {
                margin-top: 5px;
                font-size: 12px;
                color: #b2b2b2;
              }
            }
            .goods-price {
              font-size: 14px;
              color: #0b34ba;
              font-weight: bold;
              margin-bottom: 10px;
            }
          }
          .item-right {
            margin-left: 10px;
            margin-right: 30px;
            display: flex;
            align-items: end;
            .item-count {
              font-size: 14px;
              color: #b2b2b2;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
    .dividing-line {
      position: relative;
      .line {
        height: 1px;
        border-bottom: dashed 1px #b2b2b2;
      }
      .line::before,
      .line::after {
        content: "";
        border-radius: 50%;
        width: 10px;
        height: 10px;
        background-color: #f8f8f8;
      }
      .line::before {
        background-color: #f8f8f8;
        position: absolute;
        top: -4px;
        left: -5px;
      }
      .line::after {
        background-color: #f8f8f8;
        position: absolute;
        top: -4px;
        right: -5px;
      }
    }
    .total-message {
      margin: 16px;
      .message-top {
        font-size: 14px;
        color: #b2b2b2;
      }
      .message-bottom {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        .total-count {
          font-size: 14px;
          color: #b2b2b2;
        }
        .total-price {
          font-size: 14px;
          color: #4a34ba;
          font-weight: bold;
        }
      }
    }
  }
  .order-bottom {
    width: 95vw;
    background-color: #ffffff;
    margin: 20px auto;
    height: 60px;
    .order-billing {
      width: 100%;
      line-height: 36px;
      background-color: #0b34ba;
      border-radius: 20px;
      color: #ffffff;
      font-size: 14px;
    }
  }
  .select-address-popup {
    .popup-top {
      .left-text {
        margin-left: 16px;
        font-size: 14px;
        color: #b2b2b2;
      }
      .right-icon {
        margin-right: 16px;
      }
    }
    .popup-content {
      max-height: 240px;
      overflow: scroll;
      background-color: #ffffff;
      padding: 10px 20px;
      .address-item:not(:last-child) {
        border-bottom: 1px solid #f5f5f5;
      }
      .address-item {
        margin: 16px 0 8px;
        padding-bottom: 8px;
        height: 70px;
        display: flex;
        align-items: center;
        .item-right {
          margin: 0 16px;
          .address-user {
            .user-info {
              display: flex;
              .user-nickname,
              .user-phone,
              .default-tip {
                font-size: 14px;
                margin-right: 20px;
              }
              .user-nickname {
                font-size: 14px;
                color: #000;
              }
              .user-phone {
                font-size: 14px;
                color: #000;
              }
              .default-tip {
                width: 50px;
                line-height: 18px;
                text-align: center;
                font-size: 13px;
                color: #ffffff;
                background-color: #0b34ba;
                border-radius: 18px;
              }
            }
            .user-address {
              margin: 8px 0;
              font-size: 14px;
              color: #706466;
            }
          }
        }
      }
    }
  }
}
</style>
