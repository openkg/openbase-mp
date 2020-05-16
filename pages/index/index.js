//index.js
//获取应用实例
import request from "../../utils/request.js";

const app = getApp();

Page({
  data: {
    code: undefined,
    volunteers: [
      {
        name: "李涓子",
        job: "openbase发起人",
        org: "清华大学",
        avatar: "https://qiniu.ruyi.ai/vol_pic_17.jpg"
      },
      {
        name: "王昊奋",
        job: "openbase发起人",
        org: "深圳狗尾草智能科技有限公司",
        avatar: "https://qiniu.ruyi.ai/vol_pic_01.png"
      },
      {
        name: "陈华钧",
        job: "openbase发起人",
        org: "浙江大学",
        avatar: "https://qiniu.ruyi.ai/vol_pic_31.jpg"
      },
      {
        name: "漆桂林",
        job: "openbase发起人",
        org: "东南大学",
        avatar: "https://qiniu.ruyi.ai/vol_pic_03.png"
      },
      {
        name: "崔宝秋",
        job: "openbase发起人",
        org: "北京小米智能科技有限公司",
        avatar: "https://qiniu.ruyi.ai/vol_pic_26.jpg"
      },
      {
        name: "刘作鹏",
        job: "openbase发起人",
        org: "北京小米智能科技有限公司",
        avatar: "https://qiniu.ruyi.ai/vol_pic_28.jpg"
      },
      {
        name: "尚忆秋",
        job: "openbase产品设计",
        org: "北京海知智能科技有限公司",
        avatar: "https://qiniu.ruyi.ai/vol_pic_11.jpg"
      },
      {
        name: "陈阳",
        job: "项目助理",
        org: "北京海知智能科技有限公司",
        avatar: "https://qiniu.ruyi.ai/vol_pic_07.jpg"
      },
      {
        name: "戴振",
        job: "知识图谱工程师",
        org: "小米科技武汉有限公司",
        avatar: "../../assets/avatar/daizhen.jpg"
      },
      {
        name: "刘潇洋",
        job: "前端工程师",
        org: "小米科技武汉有限公司",
        avatar: "../../assets/avatar/liuxiaoyang.jpeg"
      },
      {
        name: "万志刚",
        job: "UI设计师",
        org: "小米科技武汉有限公司",
        avatar: "../../assets/avatar/wanzhigang.jpg"
      },
      {
        name: "彭茜",
        job: "产品经理",
        org: "小米科技武汉有限公司",
        avatar: "../../assets/avatar/pengxi.jpg"
      }
    ]
  },
  onShareAppMessage: function () {
    return {
      title: "OpenBase中文开发域高质量免费知识图谱",
      path: "/pages/index/index",
      imageUrl: "这个是显示的图片，不写就默认当前页面的截图",
      success: function (shareTickets) {
        console.info(shareTickets + "成功");
        // 转发成功
      },
      fail: function (res) {
        console.log(res + "失败");
        // 转发失败
      },
      complete: function (res) {
        // 不管成功失败都会执行
      }
    };
  },
  login: function () {
    wx.login({
      success: res => {
        if (res.code) this.setData({ code: res.code });
        else console.log("login failed", res.errMsg);
      }
    });
  },
  onLoad: function () {
    wx.clearStorageSync();
    this.login();
    setInterval(() => {
      this.login();
    }, 60000);
  },
  handleSuccess: function (res) {
    this.login();
    if (res.accessToken) {
      const app = getApp();
      wx.setStorage({
        key: "accessToken",
        data: res.accessToken
      });
      app.globalData.userInfo = res.data;
      wx.navigateTo({
        url: "/pages/mark/mark"
      });
    } else {
      wx.navigateTo({
        url: `/pages/register/register?phone=${res.data.phoneNumber}`
      });
    }
  },
  handleFail: function (err) {
    this.login();
  },
  getPhoneNumber: function (e) {
    const {
      detail: { encryptedData, iv }
    } = e;

    if (encryptedData) {
      request("/login", "post", this.handleSuccess, this.handleFail, {
        jsCode: this.data.code,
        iv,
        encryptedData
      });
    } else {
      wx.showToast({
        title: "审核需要手机号，如微信未绑定手机号，请先绑定.",
        icon: "none",
        duration: 3000
      });
    }
  }
});
