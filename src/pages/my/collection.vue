<template>
  <view class="collection">
    <view class="collection-top"
      ><uni-nav-bar
        :fixed="true"
        :border="false"
        background-color="#ffffff"
        color="#000000"
        status-bar
        title="我的收藏"
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
    <view class="collection-middle">
      <view class="middle-mask"></view>
      <view class="middle-showcase">
        <view
          v-for="(item, index) in collectionGoodsData"
          class="content-item"
          :key="index"
        >
          <view class="item-container">
            <view class="item-image">
              <navigator
                :url="`/pages/goods/goods?pid=${item.pid}`"
                hover-class="none"
              >
                <image
                  :src="item.smallImg"
                  mode="widthFix"
                  class="image-img" /></navigator
            ></view>
            <view class="item-name">{{ item.name }}</view>
            <view class="item-enname">{{ item.enname }}</view>
            <view class="item-price-delete">
              <view class="item-price">￥{{ item.price }}</view>
              <view class="item-delete"
                ><uni-icons
                  type="trash-filled"
                  color="#0b34ba"
                  size="18"
                  @click="deleteCollection(item.pid)"
              /></view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { findAllLike, unlikeGoods } from "@/apis";
import { useUserTokenStore } from "@/stores/userStores";
import type { Goods } from "@/types";
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";

const collectionGoodsData = ref<Goods[]>([]);

onShow(() => {
  getCollectionGoodsData();
});

const getCollectionGoodsData = () => {
  const result = findAllLike(useUserTokenStore().userToken);
  result.then((res) => {
    if (res.code === 2000) {
      collectionGoodsData.value = res.result;
    }
  });
};

const deleteCollection = (pid: string) => {
  const result = unlikeGoods(pid, useUserTokenStore().userToken);
  result.then((res) => {
    if (res.code === 900) {
      uni.showToast({
        title: "已取消收藏",
        icon: "success",
        duration: 2000,
      });
      getCollectionGoodsData();
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
.collection {
  .collection-top {
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
  .collection-middle {
    width: 100%;
    .middle-mask {
      width: 100%;
      height: 15vh;
      background-color: #0b34ba;
    }
    .middle-showcase {
      width: 95%;
      margin: 0 auto;
      border-radius: 10px;
      background-color: #ffffff;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      transform: translateY(-5vh);
      min-height: 400px;
      .content-item {
        width: 30%;
        margin: 10px 1.5%;
        background-color: #ffffff;
        border-radius: 10px;
        .item-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 90%;
          margin: 0 auto;
          .item-image {
            width: 100%;
            .image-img {
              width: 100%;
              height: 140px;
              border-radius: 10px;
            }
          }
          .item-name,
          .item-enname {
            width: 95%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .item-name {
            font-size: 16px;
            font-weight: bold;
            color: #545454;
          }
          .item-enname {
            font-size: 12px;
            color: #787878;
          }
          .item-price-delete {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            width: 100%;
            .item-price {
              font-size: 14px;
              font-weight: bold;
              color: #0b34ba;
            }
            .item-delete {
              margin-right: 2px;
            }
          }
        }
      }
    }
  }
}
body {
  background-color: #f8f8f8;
}
</style>
