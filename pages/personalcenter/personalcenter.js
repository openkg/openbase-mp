import request from '../../utils/request'
// pages/personalcenter/personalcenter.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      name: "",
      email: "",
      favoriteList: [],
      organization: "",
      reviewedSPOCount: 0,
      correctedSPOCount: 0,
      rankRatio: 0
    }
  },

  shareOut: function () {
    const handleFail = err => {
      console.log(err);
    };
    console.log("share");
    wx.showShareMenu();
  },

  onShareAppMessage: function () {
    return {
      title: "自定义，一般写小程序的名字",
      path: "这里写你这个页面的路径",
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const handleSuccess = (res) => {
      if (res.code === '0') {
        console.log(res.data)
        this.setData({
          userInfo: {
            ...this.data.userInfo,
            ...res.data,
            rankRatio: Math.round(res.data.rankRatio * 100)
          }
        })
      }
    }
    const app = getApp();
    request('/userStats', 'get', handleSuccess)
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        ...app.globalData.userInfo,
        favoriteList: app.globalData.userInfo.favoriteList.join("、")
      }
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
  }
});
