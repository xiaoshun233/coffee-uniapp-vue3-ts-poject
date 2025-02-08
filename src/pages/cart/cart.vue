<template>
  <view class="cart"
    ><view class="cart-top">
      <uni-nav-bar
        :fixed="true"
        :border="false"
        background-color="#ffffff"
        color="#000000"
        status-bar
        left-icon="left"
        left-text="返回"
        :right-text="editMode ? '完成' : '编辑'"
        title="购物袋"
        @clickLeft="returnBack"
        @clickRight="editMode = !editMode"
      />
      <view class="top-background"
        ><image
          src="/static/cart/shopbag_bg.png"
          mode="aspectFill"
          class="image-img"
      /></view>
    </view>
    <view class="cart-middle">
      <view class="middle-cart-content" v-if="cartData.length > 0">
        <view class="cart-item" v-for="(item, index) in cartData" :key="index">
          <TickCheckbox v-model="item.checked" class="item-checkbox" />
          <view class="item-image">
            <navigator
              :url="`/pages/goods/goods?pid=${item.pid}`"
              open-type="navigate"
              hover-class="none"
            >
              <image
                :src="item.small_img"
                mode="aspectFill"
                class="image-img"
              />
            </navigator>
          </view>
          <view class="item-message">
            <view class="message-top">
              <view class="top-name">{{ item.name }}</view>
              <view class="top-rules">{{ item.rule }}</view>
            </view>
            <view class="message-middle">
              <view class="middle-enname">{{ item.enname }}</view>
            </view>
            <view class="message-bottom">
              <view class="bottom-price"
                >￥{{ (item.price * item.count).toFixed(2) }}</view
              >
              <uni-number-box
                :min="1"
                :max="10000"
                v-model="item.count"
                class="bottom-count"
                @change="changeGoodsCount($event, item)"
            /></view>
          </view>
        </view>
        <view class="middle-cart-bottom">
          <view class="bottom-nav">
            <view class="nav-left">
              <view class="nav-selectAll">
                <TickCheckbox
                  v-model="selectAll"
                  @click="clickSelectAll"
                /><view class="selectAll-text">全选</view>
              </view>
            </view>
            <view class="nav-right">
              <view class="nav-total">
                <view class="total-tip">合计:</view>
                <view class="total-price"> ￥{{ totalPrice }}</view>
              </view>
              <view class="nav-button">
                <button class="button-pay" v-if="!editMode" @click="goOrder">
                  结算({{ selectCount }})
                </button>
                <button
                  class="button-delete"
                  v-else
                  @click="deleteSelectShopCartGoods"
                >
                  删除({{ selectCount }})
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view v-else class="middle-cart-empty">
        <view class="empty-icon"
          ><image
            src="/static/cart/empty-icon.jpg"
            mode="aspectFill"
            class="icon-cart"
        /></view>
        <view class="empty-text">购物袋空空如也</view>
        <view class="empty-walk"
          ><button class="walk-button" @click="takeWalk">
            逛一逛吧~
          </button></view
        >
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { findAllShopcart, modifyShopcartCount, removeShopcart } from "@/apis";
import { useUserTokenStore } from "@/stores/userStores";
import type { ShopCartGoods } from "@/types";
import { onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import TickCheckbox from "@/components/checkbox/TickCheckbox.vue";

interface ShopCartGoodsData extends ShopCartGoods {
  checked: boolean;
}

const cartData = ref<ShopCartGoodsData[]>([]);

const selectAll = ref(false);

const totalPrice = ref("0.00");

const selectCount = computed(() => {
  const allCount = cartData.value.length;
  const selectItems = cartData.value.filter((item) => item.checked);
  selectAll.value = allCount === selectItems.length;
  totalPrice.value = selectItems
    .reduce((prev, current) => {
      return prev + current.price * current.count;
    }, 0)
    .toFixed(2);

  return selectItems.length;
});

const editMode = ref(false);

onShow(() => {
  getAllShopcartData();
});

const getAllShopcartData = () => {
  const result = findAllShopcart(useUserTokenStore().userToken);
  result.then((res) => {
    cartData.value = (res.result as ShopCartGoods[]).reverse().map((item) => ({
      ...item,
      checked: false,
    }));
  });
};

const returnBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};

const takeWalk = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};

const clickSelectAll = (checked: boolean) => {
  cartData.value.forEach((item) => {
    item.checked = checked;
  });
};

const changeGoodsCount = (count: number, item: ShopCartGoodsData) => {
  const result = modifyShopcartCount(
    item.sid,
    count,
    useUserTokenStore().userToken
  );

  const error = (msg?: string) => {
    uni.showToast({
      title: msg || "修改失败",
      icon: "error",
      duration: 2000,
    });
    getAllShopcartData();
  };
  result
    .then((res) => {
      if (res.code === 6000) {
        item.count = count;
      } else {
        error(res.msg);
      }
    })
    .catch((e) => {
      error(e.message);
    });
};

const deleteSelectShopCartGoods = () => {
  const selectGoods = cartData.value.map((item) => {
    if (item.checked) {
      return item.sid;
    }
  }) as string[];
  const result = removeShopcart(selectGoods, useUserTokenStore().userToken);
  result.then((res) => {
    if (res.code === 7000) {
      getAllShopcartData();
      uni.showToast({
        title: "删除成功",
        icon: "success",
        duration: 2000,
      });
    } else {
      uni.showToast({
        title: res.msg || "删除失败",
        icon: "error",
        duration: 2000,
      });
    }
  });
};

const goOrder = () => {
  const selectGoods = cartData.value.filter((item) => item.checked);
  if (selectGoods.length === 0) {
    uni.showToast({
      title: "请选择商品",
      icon: "none",
      duration: 2000,
    });
    return;
  }
  const sids = selectGoods.map((item) => item.sid);
  uni.navigateTo({
    url: `/pages/order/order?sids=${JSON.stringify(sids)}`,
  });
};
</script>

<style lang="scss" scoped>
.cart {
  .cart-top {
    .top-background {
      .image-img {
        width: 100%;
        height: 50px;
      }
    }
  }
  .cart-middle {
    .middle-cart-empty {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: calc(100vh - 200px);
      .empty-icon {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        .icon-cart {
          width: 100%;
          height: 100%;
        }
      }
      .empty-text {
        font-family: "宋体";
        font-size: 20px;
        font-weight: bold;
        margin-top: 40px;
        color: #454545;
      }
      .empty-walk {
        .walk-button {
          font-size: 14px;
          margin-top: 30px;
          color: #ffffff;
          background-color: #0b34ba;
          width: 120px;
          height: 38px;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 20px;
        }
      }
    }
    .middle-cart-content {
      margin-bottom: 60px;
      .cart-item {
        width: 95vw;
        margin: 10px auto 0;
        background-color: #ffffff;
        display: flex;
        align-items: center;
        padding: 20px 0;
        border-radius: 10px;
        .item-checkbox {
          margin-left: 5px;
        }
        .item-image {
          margin-left: 10px;
          .image-img {
            border-radius: 20px;
            width: 120px;
            height: 120px;
          }
        }
        .item-message {
          flex: 1;
          height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          margin-left: 10px;
          .message-top {
            display: flex;
            align-items: center;
            .top-name {
              font-size: 14px;
              color: #000000;
              font-weight: bold;
            }
            .top-rules {
              font-size: 12px;
              color: #686c75;
              margin-left: 10px;
            }
          }
          .message-middle {
            .middle-enname {
              font-size: 12px;
              color: #686c75;
            }
          }
          .message-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .bottom-price {
              font-size: 14px;
              color: #0933ba;
              font-weight: bold;
            }
            .bottom-count {
              font-size: 14px;
              color: #000000;
              margin-right: 10px;
            }
          }
        }
      }
      .middle-cart-bottom {
        .bottom-nav {
          position: fixed;
          bottom: 50px;
          left: 0;
          width: 100%;
          height: 50px;
          background-color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .nav-left {
            .nav-selectAll {
              margin-left: 10px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              width: 60px;
              .selectAll-text {
                font-size: 14px;
                color: #787778;
              }
            }
          }
          .nav-right {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .nav-total {
              display: flex;
              font-size: 14px;
              color: #454545;
              margin-right: 5px;
              .total-tip {
                font-size: 14px;
                color: #000;
              }
              .total-price {
                max-width: 80px;
                font-size: 14px;
                color: #0933ba;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
            }
            .nav-button {
              .button-pay,
              .button-delete {
                font-size: 14px;
                color: #ffffff;
                width: 120px;
                height: 38px;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 20px;
                margin: 0 10px;
              }
              .button-delete {
                background-color: #ed0924;
              }
              .button-pay {
                background-color: #0b34ba;
              }
            }
          }
        }
      }
    }
  }
}
</style>
