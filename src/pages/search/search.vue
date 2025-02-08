<template>
  <view class="search">
    <view class="search-top">
      <view class="top-back" @click="returnBack"
        ><uni-icons type="left" color="#5263c7" size="16" /><text
          class="back-text"
          >返回</text
        ></view
      ><uni-search-bar
        placeholder="请输入商品名称..."
        clearButton="always"
        cancelButton="always"
        v-model="searchValue"
        @confirm="confirmSearch"
        @cancel="cancelSearch"
        class="top-searchbar"
      >
        <template v-slot:searchIcon>
          <uni-icons color="#5263c7" size="18" type="search" /> </template
      ></uni-search-bar>
    </view>
    <view class="search-middle">
      <view class="middle-mask"></view>
      <view class="middle-showcase">
        <view
          v-for="(item, index) in goodsData"
          class="content-item"
          :key="index"
        >
          <navigator
            :url="`/pages/goods/goods?pid=${item.pid}`"
            hover-class="none"
          >
            <view class="item-container">
              <view class="item-image">
                <image :src="item.smallImg" mode="widthFix" class="image-img"
              /></view>
              <view class="item-name">{{ item.name }}</view>
              <view class="item-enname">{{ item.enname }}</view>
              <view class="item-price">￥{{ item.price }}</view>
            </view>
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { searchGoods } from "@/apis";
import type { Goods } from "@/types";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const searchValue = ref<string>("");
const goodsData = ref<Goods[]>([]);

onLoad((option) => {
  searchValue.value = option?.searchValue || "";

  if (searchValue.value !== "") {
    searchGoodsData();
  }
});

const searchGoodsData = () => {
  const searchResult = searchGoods(searchValue.value);
  searchResult
    .then((res) => {
      if (res.code === "Q001") {
        goodsData.value = res.result;
      }
    })
    .catch((err) => {
      uni.showToast({
        title: "获取商品信息失败",
        icon: "error",
        duration: 2000,
      });
      console.error(err);
    });
};
const confirmSearch = () => {
  searchGoodsData();
};

const cancelSearch = () => {};

const returnBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};
</script>

<style lang="scss" scoped>
.search {
  .search-top {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #ffffff;
    height: 50px;
    .top-back {
      width: 20%;
      display: flex;
      align-items: center;
      margin-left: 15px;
      .back-text {
        color: #5263c7;
        font-size: 14px;
        margin-left: 2px;
      }
    }
    .top-searchbar {
      flex: 1;
      margin-right: 10px;
      ::v-deep .uni-searchbar__box {
        line-height: 36px;
        display: flex;
        align-items: center;
        background-color: #f5f5f5 !important;
        border-radius: 20px 0 0 20px !important;
        .uni-searchbar__box-search-input {
          margin: 0;
        }
      }
    }
  }
  .search-middle {
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
          .item-price {
            font-size: 14px;
            font-weight: bold;
            color: #0b34ba;
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
