import request from "../../utils/request";
// pages/mark/mark.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    upperIndex: 0,
    cache: [null, null],
    cardContainerStyle:
      "position: absolute; height: 100%; width: calc(100vw - 80rpx)",
    slideLeft: false,
    slideRight: false,
    slideUp: false,
    cardClass1: "upper",
    cardClass2: "",
    showModal: false,
    hideButtons: false
  },

  toggleHideButtons: function () {
    this.setData({
      hideButtons: !this.data.hideButtons
    });
  },

  toggleModal: function () {
    this.setData({
      showModal: !this.data.showModal
    });
  },

  openModal: function () {
    this.setData({
      showModal: true
    });
  },

  closeModal: function () {
    this.setData({
      showModal: false
    });
  },

  toggleUpperIndex: function () {
    this.setData({
      upperIndex: this.data.upperIndex ? 0 : 1
    });
  },

  query: function () {
    const dice = () => Math.round(Math.random());
    const index = this.data.index;
    const handleSuccess = res => {
      if (res.code === "0") {
        const newCache = [...this.data.cache];
        newCache[index] = res.data[0];
        this.setData({
          cache: newCache
        });
      }
    };
    if (dice()) {
      request("/randomAttributeSPOList", "get", handleSuccess);
    } else {
      request("/randomRelationshipSPOList", "get", handleSuccess);
    }
    this.setData({
      index: this.data.index ? 0 : 1
    });
  },

  handleCorrect: function () {
    const upperIndex = this.data.upperIndex;
    request("/labelRightSPO", "post", null, null, {
      assembledObj: this.data.cache[upperIndex]
    });
    this.setData({
      slideRight: true
    });
    setTimeout(() => {
      this.query();
    }, 200);
    setTimeout(() => {
      this.toggleUpperIndex();
    }, 370);

    setTimeout(() => {
      this.setData({
        slideRight: false
      });
    }, 380);
  },

  handleError: function () {
    const upperIndex = this.data.upperIndex;
    request("/labelWrongSPO", "post", null, null, {
      assembledObj: this.data.cache[upperIndex]
    });
    this.setData({
      slideLeft: true
    });
    setTimeout(() => {
      this.query();
    }, 200);
    setTimeout(() => {
      this.toggleUpperIndex();
    }, 370);

    setTimeout(() => {
      this.setData({
        slideLeft: false
      });
    }, 380);
  },

  handleUnknow: function () {
    this.setData({
      slideUp: true
    });
    setTimeout(() => {
      this.query();
    }, 200);
    setTimeout(() => {
      this.toggleUpperIndex();
    }, 370);

    setTimeout(() => {
      this.setData({
        slideUp: false
      });
    }, 380);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const handleSuccess = res => {
      if (res.code === "0") {
        const newCache = [...this.data.cache];
        newCache[0] = res.data[0];
        this.setData({
          cache: newCache
        });
      }
    };
    request("/randomRelationshipSPOList", "get", handleSuccess);
    setTimeout(() => {
      this.query();
    }, 150);
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
