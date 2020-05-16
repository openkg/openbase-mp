// components/menumodal/menumodal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    goHome: function() {
      wx.reLaunch({
        url: "/pages/index/index"
      });
    },
    goPerson: function() {
      wx.navigateTo({
        url: "/pages/personalcenter/personalcenter"
      });
    },
    goError: function() {
      wx.navigateTo({
        url: "/pages/falsebook/falsebook"
      });
    },
    handleClose: function() {
      this.triggerEvent("closeModal");
    }
  }
});
