import request from "../../utils/request";
// pages/register.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: "",
    disabled: false,
    errorForm: [],
    fields: ["金融", "人工智能", "计算机", "医疗", "农业"],
    favoriteList: [],
    countSec: 0
  },

  checkEmpty: function (e) {
    if (
      !e.detail.value.trim() &&
      !this.data.errorForm.includes(e.currentTarget.dataset.field)
    ) {
      this.setData({
        errorForm: [...this.data.errorForm, e.currentTarget.dataset.field]
      });
    }
  },

  checkPwd: function (e) {
    if (
      e.detail.value.trim().length < 6 &&
      !this.data.errorForm.includes(e.currentTarget.dataset.field)
    ) {
      this.setData({
        errorForm: [...this.data.errorForm, e.currentTarget.dataset.field]
      });
    }
  },

  clearErrormsg: function (e) {
    const result = [];
    this.data.errorForm.forEach(item => {
      if (item !== e.currentTarget.dataset.field) {
        result.push(item);
      }
    });
    this.setData({
      errorForm: result
    });
  },

  formCancel: function () {
    wx.navigateBack();
  },

  formSubmit: function (e) {
    const checkField = ["name", "smscode"];
    for (let field of checkField) {
      if (
        !e.detail.value[field].trim() &&
        !this.data.errorForm.includes(field)
      ) {
        this.setData({
          errorForm: [...this.data.errorForm, field]
        });
      }
    }

    if (
      (e.detail.value.password.length < 6 ||
        e.detail.value.password.length > 12) &&
      !this.data.errorForm.includes("password")
    ) {
      this.setData({
        errorForm: [...this.data.errorForm, "password"]
      });
    }

    if (this.data.errorForm.length) {
      return;
    }
    const { phoneNumber, favoriteList } = this.data;
    const body = { ...e.detail.value, phoneNumber, favoriteList };
    function handleSuccess(res) {
      if (res.code === "0") {
        const app = getApp();
        wx.setStorage({
          key: "accessToken",
          data: res.accessToken
        });
        app.globalData.userInfo = res.data;
        wx.showToast({
          title: "注册成功"
        });
        wx.navigateTo({ url: "/pages/mark/mark" });
      } else {
        wx.showToast({
          title: res.msg,
          icon: "none",
          duration: 3000
        });
      }
    }
    request("/signup", "post", handleSuccess, null, body);
  },

  getCodeSuccess: function () {
    wx.showToast({
      title: "验证码已发送"
    });
    this.setData({
      disabled: true,
      countSec: 60
    });
    const interval = setInterval(() => {
      this.setData({
        countSec: this.data.countSec - 1
      });
    }, 1000);
    setTimeout(() => {
      this.setData({
        disabled: false,
        countSec: 0
      });
      clearInterval(interval);
    }, 60000);
  },

  getCode: function () {
    request("/smscode", "post", this.getCodeSuccess, null, {
      phoneNumber: this.data.phoneNumber
    });
  },

  showModal: function () {
    wx.showModal({});
  },

  handleClickField: function (e) {
    const value = e.currentTarget.dataset.value;
    const result = [];
    if (this.data.favoriteList.includes(value)) {
      this.data.favoriteList.forEach(item => {
        if (item !== value) {
          result.push(item);
        }
      });
    } else {
      result.push(...this.data.favoriteList, value);
    }
    this.setData({
      favoriteList: [...result]
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phoneNumber: options.phone
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () { },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () { },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 用户点击右上角分享
   */
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

  handleCancel: function () {
    wx.navigateBack();
  }
});
