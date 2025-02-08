<template>
  <view class="index">
    <view class="index-top">
      <uni-card :is-shadow="true" margin="0px" padding="0px" spacing="2px">
        <view class="index-top-card">
          <view class="card-welcome">
            <view class="card-timetext" @click="changetimeText">{{
              timeText
            }}</view>
            <view class="card-nickname">{{
              useUserInfoStore().myInfo.nickName || "好好学习"
            }}</view>
          </view>
          <uni-search-bar
            v-model="searchValue"
            class="search-bar"
            radius="80"
            placeholder="请输入商品名称..."
            clearButton="auto"
            cancelButton="none"
            @confirm="searchGoods" /></view
      ></uni-card>
      <view class="index-middle">
        <view class="middle-banner">
          <swiper
            class="banner-swiper"
            circular
            interva="5000"
            duration="1000"
            autoplay="true"
            @change="bannerScroll"
            :current="bannerIndex"
          >
            <swiper-item
              v-for="(item, index) in banners"
              :key="index"
              class="swiper-itembox"
            >
              <navigator
                :url="`/pages/goods/goods?pid=${item.pid}`"
                open-type="navigate"
                hover-class="navigator-hover"
              >
                <view>
                  <image
                    :src="item.bannerImg"
                    mode="aspectFill"
                    class="swiper-image"
                  />
                  <view class="swiper-item-name">{{ item.name }}</view>
                </view>
              </navigator>
            </swiper-item>
          </swiper>
          <view class="swiper-dots">
            <view
              v-for="(item, index) in banners"
              :key="index"
              class="swiper-dot"
              @click="bannerIndex = index"
              :style="{
                backgroundColor: bannerIndex === index ? '#1018ff' : '#ff8a1d',
              }"
            ></view>
          </view>
        </view>
        <view class="index-middle-hots">
          <view class="hots-title-box">
            <view class="hots-title-text">热卖推荐</view>
          </view>
          <view class="hots-content-box">
            <view
              v-for="(item, index) in hotGoods"
              class="content-item"
              :key="index"
            >
              <navigator
                :url="`/pages/goods/goods?pid=${item.pid}`"
                hover-class="none"
                open-type="navigate"
              >
                <view class="item-container">
                  <view class="item-image"
                    ><view class="image-flag">hot</view>
                    <image
                      :src="item.smallImg"
                      mode="aspectFill"
                      class="image-img"
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
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getHotGoods } from "@/apis";
import { getBanner } from "@/apis/banner";
import { useUserInfoStore } from "@/stores/userStores";
import type { Goods, Banner } from "@/types";
import { onShow } from "@dcloudio/uni-app";
import { ref } from "vue";

const timeText = ref<string>("");
const searchValue = ref<string>("");
const banners = ref<Banner[]>([]);
const hotGoods = ref<Goods[]>([]);
const bannerIndex = ref<number>(0);

onShow(() => {
  useUserInfoStore().setMyInfo();
  changetimeText();
  getBannerData();
  getHotGoodsData();
});

const getBannerData = async () => {
  const result = await getBanner();
  if (result.code === 300) {
    banners.value = result.result;
  }
};

const changetimeText = () => {
  const date = new Date();
  const hours = date.getHours();
  if (hours >= 0 && hours < 6) {
    timeText.value = "凌晨好";
  } else if (hours >= 6 && hours < 12) {
    timeText.value = "早上好";
  } else if (hours >= 12 && hours < 18) {
    timeText.value = "下午好";
  } else {
    timeText.value = "晚上好";
  }
};

const bannerScroll = (e: any) => {
  bannerIndex.value = e.detail.current;
};

const searchGoods = async () => {
  uni.navigateTo({
    url: `/pages/search/search?searchValue=${searchValue.value}`,
  });
};

const getHotGoodsData = async () => {
  const result = await getHotGoods();
  if (result.code === 500) {
    hotGoods.value = result.result;
  } else {
    uni.showToast({
      title: "获取热卖商品失败",
      icon: "error",
      duration: 2000,
    });
  }
};
</script>

<style lang="scss" scoped>
.index {
  .index-top {
    .index-top-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .card-welcome {
        display: flex;
        .card-timetext {
          margin: 0 10px;
          font-size: 16px;
          font-weight: bold;
          color: #5f5f5f;
        }
        .card-nickname {
          font-size: 16px;
          font-weight: bold;
          color: #0b34ba;
          width: 70px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .search-bar {
      width: 55vw;
      font-size: 12px;
      ::v-deep .uni-searchbar__box-search-input {
        margin-top: 0;
      }
    }
  }
  .index-middle {
    width: 95vw;
    margin: 10px auto 0;
    .middle-banner {
      width: 96vw;
      position: relative;
      height: 240px;
      border-radius: 10px;
      overflow: hidden;
      .banner-swiper {
        height: 240px;
        .swiper-image {
          width: 100%;
          object-fit: cover;
        }
      }
      .swiper-itembox {
        position: relative;
        .swiper-item-name {
          position: absolute;
          bottom: 12px;
          left: 15px;
          font-size: 14px;
          color: #fff;
          line-height: 25px;
          text-align: center;
          min-width: 80px;
          border-radius: 40px;
          padding: 0 10px;
          background-color: #0b34ba;
        }
      }
      .swiper-dots {
        position: absolute;
        display: flex;
        line-height: 20px;
        align-items: center;
        bottom: 10px;
        right: 10px;
        .swiper-dot {
          width: 30px;
          height: 12px;
          border-radius: 5px;
          background-color: #ff8a1d;
          margin: 0 5px;
        }
      }
    }
    .index-middle-hots {
      .hots-title-box {
        display: flex;
        align-items: center;
        justify-content: start;
        margin: 10px 0;
        height: 70px;
        background-color: #ffffff;
        border-radius: 5px;
        .hots-title-text {
          width: 33%;
          line-height: 35px;
          background-color: #0b34ba;
          border-radius: 0 20px 0 0;
          text-align: center;
          font-weight: bold;
          font-size: 17px;
          color: #ffffff;
          font-family: "宋体";
        }
      }
      .hots-content-box {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .content-item {
          width: 48%;
          margin: 10px 0;
          background-color: #ffffff;
          border-radius: 10px;
          .item-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 90%;
            margin: 12px auto;
            .item-image {
              position: relative;
              width: 100%;
              .image-flag {
                width: 30%;
                height: 30%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #0b34ba;
                position: absolute;
                top: 0;
                left: 10%;
                z-index: 1;
                color: #ffffff;
                font-weight: bold;
                font-size: 16px;
                border-radius: 0 0 10px 10px;
              }
              .image-img {
                width: 100%;
                height: 140px;
                border-radius: 10px;
              }
            }
            .item-name {
              font-size: 16px;
              font-weight: bold;
              color: #545454;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .item-enname {
              font-size: 12px;
              width: 95%;
              color: #787878;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
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
}
</style>
