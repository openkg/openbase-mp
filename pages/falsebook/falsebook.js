import request from "../../utils/request";
// pages/falsebook/falsebook.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    currentPage: 1,
    entities: [],
    scrollable: true
  },

  toggleScroll() {
    this.setData({
      scrollable: !this.data.scrollable
    })
  },

  query: function () {
    if (this.data.loading) {
      return;
    }
    this.setData({
      loading: true
    });
    const handleSuccess = res => {
      this.setData({
        loading: false,
        currentPage: this.data.currentPage + 1,
        entities: [...this.data.entities, ...res.data]
      });
    };
    const handleError = res => {
      this.setData({
        loading: false
      });
      wx.showToast({
        title: "获取列表失败",
        icon: "none"
      });
    };
    request(
      `/wrongUnfinisedSPOList?pageNumber=${this.data.currentPage}&pageSize=10`,
      "get",
      handleSuccess,
      handleError
    );
  },

  removeEntity: function (e) {
    this.setData({
      entities: this.data.entities.filter(entity => entity._id !== e.detail._id)
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.query();
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
  onReachBottom: function () {
  },

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
