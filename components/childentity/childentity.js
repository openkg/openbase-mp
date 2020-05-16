// components/childentity/childentity.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imageUrl: String,
    info: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick: function () {
      this.triggerEvent('unfold');
    }
  }
});
