// components/modal/modal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    type: String,
    style1: String
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleOk: function () {
      this.triggerEvent("ok");
    },
    handleCancel: function () {
      this.triggerEvent("cancel");
    }
  }
});
