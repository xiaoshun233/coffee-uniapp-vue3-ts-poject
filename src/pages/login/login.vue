<template>
  <view class="login">
    <!-- 登陆页面顶部LOGO -->
    <view class="login-top">
      <view class="login-top-left"
        ><image
          src="/static/login-icon/logo.png"
          mode="scaleToFill"
          class="left-logo"
        /><text class="left-title">Lucky coffee</text></view
      ><view class="login-top-right">
        <text class="right-tip" @click="takeWalk">先逛一逛</text>
      </view>
    </view>
    <!-- 登陆页面中间部分 -->
    <view class="login-middle">
      <!-- 展示内容 -->
      <view class="login-middle-content">
        <view class="content-title">欢迎回来！</view>
        <view class="content-text">please login to your accounts</view>
      </view>
      <!-- 登录表单 -->
      <uni-forms
        v-model="loginForm"
        class="login-middle-form"
        :rules="loginRules"
        ref="loginFormRef"
      >
        <uni-forms-item name="phone" label="手机号码">
          <uni-easyinput
            type="text"
            v-model="loginForm.phone"
            id="phone"
            placeholder="请输入11位的手机号码..."
        /></uni-forms-item>
        <uni-forms-item name="password" label="用户密码">
          <uni-easyinput
            type="password"
            v-model="loginForm.password"
            placeholder="请输入用户密码..."
        /></uni-forms-item>
      </uni-forms>
      <!-- 忘记密码 -->
      <view class="login-middle-forgot">
        <navigator
          url="/pages/home/home"
          open-type="switchTab"
          class="forgot-password"
          >忘记密码了吗？</navigator
        >
      </view>
    </view>
    <!-- 登陆页面底部按钮 -->
    <view class="login-bottom">
      <button class="click-button button-login" @click="loginButton">
        登录
      </button>
      <button class="click-button button-regiseter" @click="openRegisterPopup">
        注册
      </button>
    </view>
    <!-- 登录页面注册部分 -->
    <view class="login-register"
      >、
      <!-- 注册弹出框 -->
      <uni-popup ref="registerPopupRef" type="bottom">
        <!-- 弹出框内容 -->
        <view class="register-popup">
          <view class="register-popup-title">
            <text class="popup-title-text">注册</text>
            <uni-icons
              type="closeempty"
              @click="closeRegisterPopup"
              class="popup-title-icon"
            />
          </view>
          <!-- 注册表单 -->
          <uni-forms
            v-model="registerForm"
            class="register-form"
            :rules="registerRules"
            ref="registerFormRef"
          >
            <uni-forms-item name="phone" label="手机号码">
              <uni-easyinput
                type="text"
                v-model="registerForm.phone"
                id="phone"
                placeholder="请输入11位的手机号码..."
            /></uni-forms-item>
            <uni-forms-item name="password" label="用户密码">
              <uni-easyinput
                type="password"
                v-model="registerForm.password"
                placeholder="请输入用户密码..."
            /></uni-forms-item>
            <uni-forms-item name="nickName" label="用户昵称">
              <uni-easyinput
                type="text"
                v-model="registerForm.nickName"
                placeholder="请输入用户昵称..."
            /></uni-forms-item>
          </uni-forms>
          <!-- 注册按钮 -->
          <button class="register-button click-button" @click="registerButton">
            开始注册
          </button>
        </view>
      </uni-popup>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { login, register } from "@/apis";
import { useUserTokenStore } from "@/stores/userStores";
import type { Login, Register } from "@/types";
import { ref } from "vue";

// 注册ref元素对象
const loginFormRef = ref<any>(null);
const registerPopupRef = ref<any>(null);
const registerFormRef = ref<any>(null);

const loginForm = ref<Login>({
  phone: "",
  password: "",
});

const registerForm = ref<Register>({
  phone: "",
  password: "",
  nickName: "",
});

const loginRules = {
  phone: {
    label: "手机号码",
    rules: [
      { required: true, errorMessage: "请输入手机号码" },
      {
        format: "number",
        errorMessage: "请输入正确的手机号码",
      },
    ],
  },
  password: {
    label: "用户密码",
    rules: [{ required: true, errorMessage: "请输入用户密码" }],
  },
};

const registerRules = Object.assign({}, loginRules, {
  nickname: {
    label: "用户昵称",
    rules: [{ required: true, errorMessage: "请输入用户昵称" }],
  },
});

interface RegRule {
  reg: RegExp;
  errorMsg: string;
}

// 正则规则
const regRules = {
  phone: {
    reg: /^1[3-9]\d{9}$/,
    errorMsg: "手机号码格式错误",
  },
  password: {
    reg: /^[A-Za-z][A-Za-z\d]{5,15}$/,
    errorMsg: "密码格式错误",
  },
  nickName: {
    reg: /^[A-Za-z\u4e00-\u9fa5]{1,5}$/,
    errorMsg: "昵称格式错误",
  },
};

// 正则校验
const testReg = (value: string, regRule: RegRule) => {
  const flag = regRule.reg.test(value);
  if (!flag) {
    uni.showToast({
      title: regRule.errorMsg || "输入格式错误",
      icon: "error",
      duration: 2000,
    });
  }
  return flag;
};

// 关闭注册弹出框
const closeRegisterPopup = () => {
  registerPopupRef.value?.close();
};

// 打开注册弹出框
const openRegisterPopup = () => {
  registerPopupRef.value?.open();
};

// 登录逻辑
const loginButton = () => {
  loginFormRef.value?.validate().then(async (res: Login) => {
    if (
      testReg(res.phone, regRules.phone) &&
      testReg(res.password, regRules.password)
    ) {
      const result = await login(res);
      const { code, msg } = result as { code: number; msg: string };
      if (code === 200) {
        const { token } = result as { token: string };
        useUserTokenStore().setUserToken(token);
        clearObject(loginForm.value);
        uni.showToast({
          title: "登录成功,即将跳转",
          icon: "success",
          duration: 1000,
        });
        setTimeout(() => {
          uni.switchTab({
            url: "/pages/index/index",
          });
        }, 1500);
      } else {
        uni.showToast({
          title: msg || "登录失败",
          icon: "error",
          duration: 2000,
        });
      }
    }
  });
};

// 注册逻辑
const registerButton = () => {
  registerFormRef.value?.validate().then(async (res: Register) => {
    if (
      testReg(res.phone, regRules.phone) &&
      testReg(res.password, regRules.password) &&
      testReg(res.nickName, regRules.nickName)
    ) {
      const result = await register(res);
      const { code, msg } = result as { code: number; msg: string };
      if (code === 100) {
        uni.showToast({
          title: "注册成功",
          icon: "success",
          duration: 2000,
        });
        closeRegisterPopup();
        clearObject(registerForm.value);
      } else {
        uni.showToast({
          title: msg || "注册失败",
          icon: "error",
          duration: 2000,
        });
      }
    }
  });
};

// 清空对象
const clearObject = (obj: any) => {
  for (const key in obj) {
    obj[key] = "";
  }
};

// 先逛一逛
const takeWalk = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};
</script>

<style lang="scss" scoped>
.login {
  .login-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
  }
  .login-top-left {
    display: flex;
    align-items: center;
    margin-left: 20px;
    .left-logo {
      width: 40px;
      height: 40px;
    }
    .left-title {
      font-size: 16px;
      font-weight: bold;
      color: #5f5f5f;
    }
  }
  .login-top-right {
    margin-right: 20px;
    .right-tip {
      font-size: 14px;
      font-weight: bold;
      color: #0c34ba;
    }
  }
  .login-middle {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    width: 90vw;
    margin: 8vh auto 0;
    .login-middle-content {
      display: flex;
      flex-direction: column;
      .content-title {
        font-size: 26px;
        letter-spacing: 3px;
        font-weight: bold;
        color: #5f5f5f;
      }
      .content-text {
        font-size: 12px;
        color: #5f5f5f;
      }
    }
    .login-middle-form {
      margin-top: 8vh;
    }
    .login-middle-forgot {
      display: flex;
      justify-content: flex-end;
      .forgot-password {
        font-size: 12px;
        color: #5c5c5c;
      }
    }
  }
  .login-bottom {
    margin-top: 10vh;
    .button-login {
      background-color: #0c34ba;
      border: 1px solid #0c34ba;
      color: #fff;
    }
    .button-regiseter {
      background-color: #ffffff;
      color: #030303;
      border: 1px solid #c5c5c5;
    }
  }
  .login-register {
    .register-popup {
      height: 50vh;
      background-color: #fff;
      .register-popup-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0 20px;
        padding: 20px 0;
        .popup-title-text,
        .popup-title-icon {
          font-size: 24px;
          font-weight: bold;
          color: #5f5f5f;
        }
      }
      .register-form {
        margin: 0 20px;
      }
      .register-button {
        background-color: #0c34ba;
        border: 1px solid #0c34ba;
        color: #fff;
      }
    }
  }
}
.click-button {
  width: 90vw;
  height: 35px;
  line-height: 35px;
  border-radius: 80px;
  font-size: 14px;
  margin: 20px auto;
}
</style>
