<template>
  <view class="menu">
    <view class="menu-top">
      <uni-search-bar
        v-model="searchValue"
        class="search-bar"
        radius="80"
        placeholder="请输入商品名称..."
        clearButton="auto"
        cancelButton="none"
        @confirm="searchGoods"
      />
    </view>
    <view class="menu-middle">
      <view class="middle-type-box">
        <view class="type-item" @click="activeType = 'recommend'">
          <image
            :src="getActiveTypeImageUrl('recommend')"
            mode="widthFix"
            class="item-icon"
          />
          <view :class="getActiveTypeClass('recommend')">推荐</view>
        </view>
        <view
          class="type-item"
          v-for="(item, index) in goodsTypeData"
          :key="index"
          @click="activeType = item.type"
        >
          <image
            :src="getActiveTypeImageUrl(item.type)"
            mode="scaleToFill"
            class="item-icon"
          />
          <view :class="getActiveTypeClass(item.type)">{{
            item.typeDesc
          }}</view>
        </view>
      </view>
      <view class="middle-goods-box">
        <view
          class="goods-item"
          v-for="(item, index) in goodsData"
          :key="index"
        >
          <navigator
            :url="`/pages/goods/goods?pid=${item.pid}`"
            open-type="navigate"
            hover-class="none"
          >
            <view class="item-container">
              <view class="item-image">
                <image :src="item.smallImg" mode="widthFix" class="image-img" />
              </view>
              <view class="item-name">
                <view class="name-cn">{{ item.name }}</view>
                <view class="name-en">{{ item.enname }}</view>
              </view>
              <view class="item-price">￥{{ item.price }}</view>
            </view>
          </navigator>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getGoods, getGoodsType, getHotGoods } from "@/apis";
import type { Goods, GoodsType } from "@/types";
import { onShow } from "@dcloudio/uni-app";
import { ref, watch } from "vue";

const goodsTypeData = ref<GoodsType[]>([]);
const searchValue = ref<string>("");
const activeType = ref<string>("recommend");
const goodsData = ref<Goods[]>([]);

onShow(() => {
  getGoodsTypeData();
  getGoodsData();
});

const searchGoods = () => {
  uni.navigateTo({
    url: `/pages/search/search?searchValue=${searchValue.value}`,
  });
};

const getGoodsTypeData = async () => {
  const result = await getGoodsType();
  if (result.code === 400) {
    goodsTypeData.value = result.result;
  }
};

const getGoodsData = async () => {
  let result;
  if (activeType.value !== "" && activeType.value !== "recommend") {
    result = await getGoods("type", activeType.value);
  } else {
    result = await getHotGoods();
  }
  if (result.code === 500) {
    goodsData.value = result.result;
  } else {
    uni.showToast({
      title: "获取商品信息失败",
      icon: "error",
      duration: 2000,
    });
  }
};

watch(activeType, () => {
  getGoodsData();
});

const isActiveType = (type: string) => {
  return activeType.value === type;
};

const getActiveTypeClass = (type: string) => {
  return isActiveType(type) ? "item-name-active" : "item-name";
};

const getActiveTypeImageUrl = (type: string) => {
  return `/static/menu-icon/${type}${isActiveType(type) ? "_active" : ""}.png`;
};
</script>

<style lang="scss" scoped>
.menu {
  .menu-top {
    width: 100%;
    background-color: #ffffff;
  }
  .menu-middle {
    width: 100vw;
    .middle-type-box {
      width: 100%;
      height: 70px;
      background-color: #fbfbfb;
      margin: 20px 0 0;
      padding: 10px 0;
      display: flex;
      justify-content: space-around;
      overflow-x: scroll;
      .type-item {
        width: 18%;
        height: 100%;
        text-align: center;
        margin: 0 10px;
        .item-icon {
          width: 40px;
          height: 40px;
          margin: 0 auto;
        }
        .item-name {
          font-size: 14px;
          text-align: center;
          color: #1a1b1c;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .item-name-active {
          font-size: 14px;
          text-align: center;
          color: #0b34ba;
        }
      }
    }
    .middle-goods-box {
      width: 100%;
      .goods-item {
        width: 95%;
        height: 150px;
        background-color: #ffffff;
        margin: 10px auto;
        border-radius: 8px;
        .item-container {
          height: 150px;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          margin: 0 20px;
        }
        .item-image {
          width: 120px;
          height: 120px;
          display: flex;
          justify-content: center;
          align-items: center;
          .image-img {
            border-radius: 8px;
            width: 100%;
          }
        }
        .item-name {
          flex: 1;
          margin-left: 20px;
          overflow: hidden;
          .name-cn,
          .name-en {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin: 10px 0;
          }
          .name-cn {
            font-size: 16px;
            font-weight: bold;
            color: #545454;
          }
          .name-en {
            font-size: 12px;
            width: 95%;
            color: #787878;
          }
        }
        .item-price {
          font-size: 16px;
          color: #4e38ba;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
