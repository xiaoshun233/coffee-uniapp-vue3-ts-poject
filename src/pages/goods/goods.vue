<template>
  <view class="goods">
    <view class="goods-top">
      <uni-nav-bar
        dark
        :fixed="true"
        shadow
        background-color="#0b34ba"
        status-bar
        left-icon="left"
        left-text="返回"
        title="商品详情页面"
        @clickLeft="returnBack"
      />
    </view>
    <view class="goods-middle">
      <view class="middle-detail" v-if="goodsDetailData !== null">
        <view class="detail-background">
          <image
            :src="goodsDetailData.large_img"
            mode="aspectFill"
            class="background-image"
          />
        </view>
        <view class="detail-card">
          <view class="card-top">
            <view class="top-desc">
              <view class="desc-name">
                <view class="name-cn">{{ goodsDetailData.name }}</view>
                <view class="name-en">{{ goodsDetailData.enname }}</view>
              </view>
              <view class="desc-price"
                >￥{{ goodsDetailData.price }}</view
              ></view
            >
            <view class="top-rules">
              <view
                class="rule-box"
                v-for="(item, index) in goodsDetailRulesData"
                :key="index"
              >
                <view class="rule-desc">{{ item.desc }}</view>
                <view class="rule-type"
                  ><uni-data-checkbox
                    mode="tag"
                    v-model="goodsRuleSelectData[item.rule as keyof GoodsDetailRuleData]"
                    :localdata="item.field"
                    selectedTextColor="#ffffff"
                    selectedColor="#0b34ba"
                  ></uni-data-checkbox></view
              ></view>
            </view>
          </view>
          <view class="card-middle">
            <view class="middle-count">
              <view class="count-text">选择数量</view>
              <view>
                <uni-number-box
                  v-model="goodsDetailParams.count"
                  :min="1"
                  :max="999"
                  :step="1"
                ></uni-number-box>
              </view>
            </view>
          </view>
          <view class="card-bottom">
            <view class="bottom-desc">
              <view class="desc-text">商品描述</view>
              <view class="desc-content">
                <view v-for="(item, index) in goodsDetailDesc">{{
                  `${index + 1}、${item}`
                }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="goods-bottom">
      <uni-goods-nav
        :fill="true"
        :options="goodsNavOption.options"
        :buttonGroup="goodsNavOption.buttonGroup"
        @click="goodsNavClick"
        @buttonClick="goodsNavButtonClick"
      />
    </view>
  </view>
</template>

<script lang="ts" setup>
import {
  addShopcart,
  findlike,
  getGoodsDetail,
  likeGoods,
  shopcartCount,
  unlikeGoods,
} from "@/apis";
import { useUserTokenStore } from "@/stores/userStores";
import type { AddShopcartDto, GoodsDetail } from "@/types";
import { onLoad } from "@dcloudio/uni-app";
import { computed, ref } from "vue";

const goodsDetailData = ref<GoodsDetail | null>(null);

interface GoodsDetailRules {
  rule: string;
  desc: string;
  field: { text: string }[];
}

interface GoodsDetailRuleData {
  type?: string;
  cream?: string;
  milk?: string;
  sugar?: string;
  tem?: string;
}

const goodsNavOption = ref({
  fill: true,
  options: [
    { text: "购物车", icon: "wallet-filled", info: 0 },
    { text: "未收藏", icon: "heart-filled" },
  ],
  buttonGroup: [
    {
      text: "加入购物车",
      backgroundColor: "#6b92ed",
      color: "#fff",
    },
    {
      text: "立即购买",
      backgroundColor: "#0b34ba",
      color: "#fff",
    },
  ],
});

const goodsDetailDesc = computed(() => {
  const desc = goodsDetailData.value?.desc || "";
  return desc.split("\n");
});

const rules = ["cream", "milk", "sugar", "tem"];

const goodsDetailRulesData = ref<GoodsDetailRules[]>([]);

const goodsRuleSelectData = ref<GoodsDetailRuleData>({
  type: "",
  cream: "",
  milk: "",
  sugar: "",
  tem: "",
});

const goodsDetailParams = ref<AddShopcartDto>({
  pid: "",
  count: 1,
  rule: "",
});

onLoad((option) => {
  goodsDetailParams.value.pid = option?.pid || "";
  if (goodsDetailParams.value.pid) {
    getGoodsDetailData();
    if (isLogin(false)) {
      isUserLikeGoods();
      getshopcartCount();
    }
  } else {
    uni.showToast({
      title: "获取商品信息失败",
      icon: "error",
      duration: 2000,
    });
  }
});

let isUserLikeGoodsPromise: Promise<any> | null = null;

const isUserLikeGoods = () => {
  if (isUserLikeGoodsPromise !== null) return;
  isUserLikeGoodsPromise = findlike(
    goodsDetailParams.value.pid,
    useUserTokenStore().userToken
  );
  isUserLikeGoodsPromise
    .then((res) => {
      if (res.code === 1000 && res.result.length > 0) {
        goodsNavOption.value.options[1].text = "已收藏";
      } else {
        goodsNavOption.value.options[1].text = "未收藏";
      }
    })
    .finally(() => {
      isUserLikeGoodsPromise = null;
    });
};

const getGoodsDetailData = () => {
  const result = getGoodsDetail(goodsDetailParams.value.pid);
  result.then((res) => {
    if (res.code === 600) {
      goodsDetailData.value = res.result[0];
      checkGoodsRule();
    }
  });
};

const getshopcartCount = () => {
  const result = shopcartCount(useUserTokenStore().userToken);
  result.then((res) => {
    if (res.code === 4000) {
      goodsNavOption.value.options[0].info = res.result;
    }
  });
};

const checkGoodsRule = () => {
  rules.forEach((item) => {
    const rule = goodsDetailData.value![item as keyof GoodsDetail] as string;
    if (rule !== "") {
      const ruleSplit = rule.split("/");
      const ruleData = {
        rule: item,
        desc: goodsDetailData.value![
          `${item}_desc` as keyof GoodsDetail
        ] as string,
        field: ruleSplit.map((item) => {
          return { text: item, value: item };
        }),
      };
      goodsDetailRulesData.value.push(ruleData);
      goodsRuleSelectData.value[item as keyof GoodsDetailRuleData] =
        ruleSplit[0];
    }
  });
};

const goodsNavClick = (e: any) => {
  if (e.index === 0) {
    uni.switchTab({ url: "/pages/cart/cart" });
  } else if (e.index === 1) {
    if (!isLogin()) return;
    if (isUserLikeGoodsPromise !== null) return;
    if (goodsNavOption.value.options[1].text === "未收藏") {
      likeThisGoods("like");
    } else {
      likeThisGoods("notlike");
    }
  }
};

const goodsNavButtonClick = (e: any) => {
  if (!isLogin()) return;
  if (e.index === 0) {
    addShopcar();
  } else if (e.index === 1) {
    buyNow();
  }
};

const addShopcar = () => {
  const rule = [];
  for (const key in goodsRuleSelectData.value) {
    if (goodsRuleSelectData.value[key as keyof GoodsDetailRuleData] !== "") {
      rule.push(goodsRuleSelectData.value[key as keyof GoodsDetailRuleData]);
    }
  }
  goodsDetailParams.value.rule = rule.join("/");
  const result = addShopcart(
    goodsDetailParams.value,
    useUserTokenStore().userToken
  );
  result
    .then((res) => {
      if (res.code === 3000) {
        const message = res.status ? res.msg : "添加商品数量成功";
        uni.showToast({
          title: message,
          icon: "success",
          duration: 2000,
        });
        getshopcartCount();
      }
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: "error",
        duration: 2000,
      });
    });
};

const buyNow = () => {
  console.log("立即购买");
};

let likeGoodsPromise: Promise<any> | null = null;

const likeThisGoods = (flag: "like" | "notlike") => {
  if (likeGoodsPromise !== null) return;
  if (flag === "like") {
    likeGoodsPromise = likeGoods(
      goodsDetailParams.value.pid,
      useUserTokenStore().userToken
    );
  } else {
    likeGoodsPromise = unlikeGoods(
      goodsDetailParams.value.pid,
      useUserTokenStore().userToken
    );
  }
  likeGoodsPromise
    .then((res) => {
      if (res.code === 800 || res.code === 900) {
        uni.showToast({
          title: res.msg,
          icon: "success",
          duration: 2000,
        });
      }
      isUserLikeGoods();
    })
    .catch((err) => {
      uni.showToast({
        title: err.message,
        icon: "error",
        duration: 2000,
      });
    })
    .finally(() => {
      likeGoodsPromise = null;
    });
};

const isLogin = (tip: boolean = true) => {
  const token = useUserTokenStore().userToken;
  if (token === "") {
    if (tip) {
      uni.showToast({
        title: "请先登录",
        icon: "error",
        duration: 2000,
      });
    }
    return false;
  }
  return true;
};

const returnBack = () => {
  uni.navigateBack({
    delta: 1,
  });
};
</script>

<style scoped lang="scss">
.goods {
  .goods-top {
    width: 100%;
  }
  .goods-middle {
    .middle-detail {
      .detail-background {
        margin: 5px auto 0;
        width: 98vw;
        height: 35vh;
        .background-image {
          width: 100%;
          height: 100%;
        }
      }
      .detail-card {
        width: 90vw;
        min-height: 50vh;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 10px;
        transform: translateY(-30px);
        .card-top {
          margin: 0 20px;
          padding-top: 15px;
          border-bottom: #a3a3a3 1px solid;
          .top-desc {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .desc-name {
              .name-cn {
                color: #454545;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 3px;
              }
              .name-en {
                font-size: 12px;
                margin-top: 3px;
                color: #787878;
              }
            }
            .desc-price {
              font-size: 18px;
              font-weight: bold;
              color: #0b34ba;
            }
          }
          .top-rules {
            margin-top: 20px;
            padding-bottom: 10px;
            .rule-box {
              display: flex;
              align-items: baseline;
              margin: 12px 0;
              .rule-desc {
                width: 20%;
                font-size: 14px;
                color: #919191;
              }
              .rule-type {
                flex: 1;
                ::v-deep .uni-label-pointer {
                  border-radius: 20px;
                  padding: 5px 20px;
                  font-size: 14px;
                  color: #ffffff;
                  background-color: #0b34ba;
                  margin-right: 10px;
                }
              }
            }
          }
        }
      }
      .card-middle {
        margin: 20px 20px;
        .middle-count {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .count-text {
            font-size: 16px;
            color: #454545;
            font-weight: bold;
          }
        }
      }
      .card-bottom {
        border-top: #a3a3a3 1px solid;
        margin: 0 20px;
        .bottom-desc {
          padding: 20px 0;
          .desc-text {
            font-size: 14px;
            color: #454545;
          }
          .desc-content {
            font-size: 12px;
            color: #787878;
            margin-top: 20px;
          }
        }
      }
    }
  }
  .goods-bottom {
    width: 100%;
    ::v-deep .uni-tab__cart-box {
      padding-top: 10px;
    }
  }
}
body {
  background-color: #f8f8f8;
}
</style>
