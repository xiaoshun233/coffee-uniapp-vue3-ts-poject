<template>
  <view class="address">
    <view class="address-top"
      ><uni-nav-bar
        :fixed="true"
        :border="false"
        background-color="#ffffff"
        color="#000000"
        status-bar
        :title="addressOptions.mode === 'new' ? '新增地址' : '编辑地址'"
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
      <view class="middle-form-card">
        <uni-forms
          v-model="addressForm"
          class="card-form"
          :rules="addressFormRules"
          ref="addressFormRef"
          err-show-type="toast"
        >
          <uni-forms-item label="姓名" class="form-item" name="name">
            <uni-easyinput
              :inputBorder="false"
              v-model="addressForm.name"
              placeholder="收货人姓名"
              clearable
            ></uni-easyinput>
          </uni-forms-item>
          <uni-forms-item label="电话" class="form-item" name="tel">
            <uni-easyinput
              :inputBorder="false"
              v-model="addressForm.tel"
              placeholder="收货人手机号"
              clearable
            ></uni-easyinput>
          </uni-forms-item>
          <uni-forms-item label="地区" class="form-item">
            <uni-data-picker
              v-model="addressForm.areaCode"
              :clear-icon="false"
              placeholder="请选择省/市/区"
              :localdata="AddressPickerData"
              popup-title="请选择省/市/区"
              @change="onAddressChange"
            ></uni-data-picker>
          </uni-forms-item>
          <uni-forms-item
            label="详细地址"
            class="form-item"
            name="addressDetail"
          >
            <uni-easyinput
              :inputBorder="false"
              v-model="addressForm.addressDetail"
              placeholder="街道门牌、楼层房间号等信息"
              clearable
            ></uni-easyinput>
          </uni-forms-item>
          <uni-forms-item label="邮政编码" class="form-item" name="postalCode">
            <uni-easyinput
              :inputBorder="false"
              v-model="addressForm.postalCode"
              placeholder="邮政编码"
              clearable
            ></uni-easyinput>
          </uni-forms-item>
        </uni-forms>
      </view>
      <view class="address-default">
        <view class="default-text">设为默认地址</view>
        <view class="default-switch"
          ><switch
            style="transform: scale(0.7)"
            :checked="addressForm.isDefault === 1"
            @change="switchDefaultAddress"
        /></view>
      </view> </view
    ><view class="address-bottom">
      <view class="bottom-button">
        <button
          size="mini"
          style="
            background-color: #2e42c7;
            border-radius: 20px;
            color: #fff;
            width: 90vw;
          "
          @click="saveAddress"
        >
          保存地址
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { addAddress, editAddress, findAddress, findAddressByAid } from "@/apis";
import AddressPickerData from "@/static/address/addressData.json";
import { useUserTokenStore } from "@/stores/userStores";
import type { EditAddressDto } from "@/types";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

interface AddressOptions {
  aid: string;
  mode: string;
}

interface DetailAdress {
  detail: {
    value: DetailAdressData[];
  };
}

interface DetailAdressData {
  text: string;
  value: string;
}

const addressForm = ref<EditAddressDto>({
  aid: "",
  name: "",
  tel: "",
  province: "",
  city: "",
  county: "",
  areaCode: "",
  postalCode: "",
  addressDetail: "",
  isDefault: 0,
});

const addressOptions = ref<AddressOptions>({
  aid: "",
  mode: "new",
});

const addressFormRef = ref<any>(null);

const addressFormRules = {
  name: {
    label: "姓名",
    rules: [{ required: true, errorMessage: "请输入收货人姓名" }],
  },
  tel: {
    label: "电话",
    rules: [{ required: true, errorMessage: "请输入收货人手机号" }],
  },
  addressDetail: {
    label: "详细地址",
    rules: [{ required: true, errorMessage: "请输入详细地址" }],
  },
  postalCode: {
    label: "邮政编码",
    rules: [{ required: true, errorMessage: "请输入邮政编码" }],
  },
};

onLoad((option) => {
  checkAddressMode(option as AddressOptions);
});

const checkAddressMode = (option: AddressOptions) => {
  addressOptions.value = option;
  if (option.mode === "edit") {
    const result = findAddressByAid(
      addressOptions.value.aid,
      useUserTokenStore().userToken
    );
    result.then((res) => {
      if (res.code === 40000) {
        addressForm.value = res.result[0];
      }
    });
  }
};

const pick = ref();

const onAddressChange = (event: DetailAdress) => {
  event.detail.value.forEach((item, index) => {
    if (index === 0) {
      addressForm.value.province = item.text;
    } else if (index === 1) {
      addressForm.value.city = item.text;
    } else if (index === 2) {
      addressForm.value.county = item.text;
    }
  });
};

const switchDefaultAddress = (event: any) => {
  addressForm.value.isDefault = event.detail.value ? 1 : 0;
};

const saveAddress = () => {
  addressFormRef.value?.validate().then((res: Array<any>) => {
    if (res.length > 0) {
      return;
    }
    if (addressOptions.value.mode === "new") {
      newAddressMode();
    } else if (addressOptions.value.mode === "edit") {
      editAddressMode();
    }
  });
};

const newAddressMode = () => {
  const result = addAddress(addressForm.value, useUserTokenStore().userToken);
  result.then((res) => {
    if (res.code === 9000) {
      uni.showToast({
        title: "新增成功",
        icon: "success",
        duration: 2000,
      });
      setTimeout(() => {
        returnBack();
      }, 1000);
    }
  });
};

const editAddressMode = () => {
  addressForm.value.aid = addressOptions.value.aid;
  const result = editAddress(addressForm.value, useUserTokenStore().userToken);
  result.then((res) => {
    if (res.code === 30000) {
      uni.showToast({
        title: "修改成功",
        icon: "success",
        duration: 2000,
      });
      setTimeout(() => {
        returnBack();
      }, 1000);
    }
  });
};

const returnBack = () => {
  if (addressOptions.value.mode === "new") {
    uni.navigateBack({
      delta: 1,
    });
  } else {
    uni.navigateTo({
      url: "/pages/my/address",
    });
  }
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
    .middle-form-card {
      width: 92vw;
      margin: 20px auto 0;
      padding: 5px 0;
      border-radius: 10px;
      background-color: #fff;
      .card-form {
        .form-item {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #000;
          border: none;
          background-color: #fff;
          margin: 10px 16px;
          overflow: hidden;
          ::v-deep .input-value-border {
            border: none;
          }
          ::v-deep .selected-item .text-color {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        .form-item:not(:last-child) {
          border-bottom: 1px solid #e5e5e5;
        }
      }
    }
    .address-default {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #fff;
      width: 92vw;
      border-radius: 8px;
      padding: 10px 0;
      margin: 20px auto 0;
      .default-text {
        margin-left: 16px;
        font-size: 14px;
        color: #737373;
      }
      .default-switch {
        margin-right: 16px;
      }
    }
  }
  .address-bottom {
    .bottom-button {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
