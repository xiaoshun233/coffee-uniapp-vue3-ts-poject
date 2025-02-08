import { appkey, defaultHeader, requestUrl } from "../config/request";

interface Interceptor {
  callback: (re: any) => void;
  name?: String;
}

interface InterceptorBefore extends Interceptor {
  callback: (request: Request) => void;
}

interface InterceptorAfter extends Interceptor {
  callback: (response: Response) => void;
}

export const init = () => {
  const interceptorsBefore: InterceptorBefore[] = [];
  const interceptorsAfter: InterceptorAfter[] = [];
  return {
    run: async (url: string, config: RequestInit) => {
      const request = new Request(requestUrl + url, config);
      for (const interceptor of interceptorsBefore) {
        await interceptor.callback(request);
      }
      try {
        const response = await fetch(request);
        for (const interceptor of interceptorsAfter) {
          await interceptor.callback(response);
        }
        return response;
      } catch (error) {
        // console.error("fetch error:", error);
        throw error;
      }
    },
    addInterceptorBefore: (interceptor: InterceptorBefore, order?: number) => {
      if (order !== void 0 && order < interceptorsBefore.length && order >= 0) {
        interceptorsBefore.splice(order, 0, interceptor);
      } else {
        interceptorsBefore.push(interceptor);
      }
      return this;
    },
    addInterceptorAfter: (interceptor: InterceptorAfter, order?: number) => {
      if (order !== void 0 && order < interceptorsAfter.length && order >= 0) {
        interceptorsAfter.splice(order, 0, interceptor);
      } else {
        interceptorsAfter.push(interceptor);
      }
      return this;
    },
  };
};

const requestUtil = init();

const createRequestInit = () => {
  let requestInit: RequestInit;
  // #ifdef H5
  requestInit = {
    headers: new Headers(defaultHeader),
  };
  // #endif

  // #ifdef MP-WEIXIN
  requestInit = {
    headers: defaultHeader,
  };
  // #endif
  return requestInit;
};

export const request = async (url: string, data: any, method: Method) => {
  const requestInit = createRequestInit();
  requestInit.method = method;

  // #ifdef MP-WEIXIN
  return new Promise<any>((resolve, reject) => {
    uni.request({
      url: requestUrl + url,
      data: { ...data, appkey },
      method: method,
      header: defaultHeader,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve({
            status: res.statusCode,
            json: () => new Promise((resolve) => resolve(res.data)),
          });
        } else {
          reject(
            new Error(`Request failed with status code ${res.statusCode}`)
          );
        }
        return;
      },
      fail: (err) => {
        console.log(err);
      },
    });
  });
  // #endif

  // #ifdef H5
  if (method === Method.GET || method === Method.HEAD) {
    if (data === null || data === undefined) {
      url += "?appkey=" + appkey;
    } else {
      url += "?" + new URLSearchParams(data) + "&appkey=" + appkey;
    }
  } else {
    requestInit.body = new URLSearchParams(Object.assign({ appkey }, data));
  }
  return requestUtil.run(url, requestInit);
  // #endif
};

requestUtil.addInterceptorAfter({
  callback: (respone) => {
    if (respone.status !== 200) {
      throw new Error("请求失败,服务器异常");
    }
  },
});
requestUtil.addInterceptorAfter({
  callback: async (respone) => {
    if (respone.status === 200) {
      const responeClone = respone.clone();
      const data = await responeClone.json();
      if (data.code === 700 && data.msg === "token检验无效，请先登录") {
        throw new Error("信息校验异常，请重新登录");
      }
    }
  },
});

export enum Method {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  OPTIONS = "OPTIONS",
  HEAD = "HEAD",
  TRACE = "TRACE",
  CONNECT = "CONNECT",
}
