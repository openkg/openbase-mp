const baseUrl = "http://10.234.29.6:3000/api";
const formalUrl = "https://openbase-mini.ai.xiaomi.com/api";

function request (url, method = "get", success, fail, data) {
  const handleFail = err => {
    wx.showToast({
      title: "网络请求错误",
      icon: "none"
    });
    if (fail) {
      fail(err);
    }
  };
  const handleSuccess = res => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      if (success) {
        success(res.data);
      }
    } else if (res.statusCode === 401 || res.statusCode === 403) {
      wx.showToast({
        title: "登录过期，请重新登录。",
        icon: "none"
      });
      wx.reLaunch({
        url: "/pages/index/index"
      });
    } else {
      wx.showToast({
        title: res.errMsg,
        icon: "none"
      });
    }
  };
  const accessToken = wx.getStorageSync("accessToken");
  const header = {
    "content-type": "application/json"
  };
  if (accessToken) {
    header["x-access-token"] = accessToken;
  }
  return wx.request({
    header,
    url: `${formalUrl}${url}`,
    method,
    data,
    success: handleSuccess,
    fail: handleFail
  });
}

module.exports = request;
