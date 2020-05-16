import request from "../../utils/request";

// components/entitycard/entitycard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Object,
    display: Boolean
  },

  observers: {
    data: function(data) {
      if (!data) {
        return;
      }

      const filterKeys = (obj, extraProp, propsNum = 3, subject) => {
        const result = {};
        const keys = Object.keys(obj);
        let j = 0;
        for (let i = 0; j < propsNum && i < keys.length; i++) {
          const key = keys[i];
          if (
            !key.startsWith("_") &&
            !key.startsWith("@") &&
            key !== "appID" &&
            key !== "relatedImage" &&
            key !== "image" &&
            key !== extraProp &&
            (!subject ? true : !subject[key])
          ) {
            result[key] = obj[key][0]["@value"];
            j++;
          }
        }
        return result;
      };

      const { subject, object, propertyName, type } = data;
      if (type === "relationship") {
        let subjectImage = "";
        let objectImage = "";
        if (subject.relatedImage) {
          subjectImage = subject.relatedImage[0]["@value"];
        }
        if (subject.image) {
          subjectImage = subject.image[0]["@value"];
        }
        if (object.relatedImage) {
          objectImage = object.relatedImage[0]["@value"];
        }
        if (object.image) {
          objectImage = object.image[0]["@value"];
        }
        this.setData({
          detail: filterKeys(subject, null, Infinity),
          objDetail: filterKeys(object, null, Infinity),
          subjectName: subject["@name"],
          objectName: object["@name"],
          subjectImage,
          objectImage,
          subject: filterKeys(subject),
          object: filterKeys(object),
          type,
          propertyName
        });
      } else {
        const sub = filterKeys(subject, propertyName);
        let imageUrl = "";
        if (subject.relatedImage) {
          imageUrl = subject.relatedImage[0]["@value"];
        }
        if (subject.image) {
          imageUrl = subject.image[0]["@value"];
        }
        this.setData({
          subject: sub,
          subjectName: subject["@name"],
          detail: filterKeys(subject, null, Infinity),
          extraProps: imageUrl
            ? filterKeys(subject, propertyName, 2, sub)
            : filterKeys(subject, propertyName, 4),
          subjectImage: imageUrl,
          type,
          propertyName,
          inputValue: subject[propertyName][0]["@value"]
        });
      }
      console.log(this.data);
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    type: "relationship",
    visible: false,
    objvisible: false,
    warnVisible: false,
    modifyAttrVisible: false,
    buttons: [{ text: "确定" }],
    reviewType: "",
    inputValue: "",
    x: 0,
    y: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleMove: function(e) {
      this.x = e.detail.x;
      this.y = e.detail.y;
      if (this.data.x !== undefined) {
        this.setData({
          x: undefined,
          y: undefined,
          animation: true
        });
      }
    },
    handleTouched: function(e) {
      if (Math.abs(this.y) > Math.abs(this.x)) {
        if (this.y < -50) {
          this.triggerEvent("unknow");
          setTimeout(() => {
            this.setData({
              animation: false,
              x: 0,
              y: 0
            });
          }, 360);
        } else {
          this.setData({
            x: 0,
            y: 0
          });
        }
      } else {
        if (this.x < -50) {
          this.triggerEvent("false");
          setTimeout(() => {
            this.setData({
              animation: false,
              x: 0,
              y: 0
            });
          }, 360);
        } else if (this.x > 50) {
          this.triggerEvent("right");
          setTimeout(() => {
            this.setData({
              animation: false,
              x: 0,
              y: 0
            });
          }, 360);
        } else {
          this.setData({
            x: 0,
            y: 0
          });
        }
      }
    },
    unknow: function() {
      this.triggerEvent("unknow");
    },
    showDialog: function() {
      this.setData({
        visible: true
      });
      this.triggerEvent("hideButtons");
      this.triggerEvent("togglescroll");
    },
    hideDialog: function() {
      this.setData({
        visible: false
      });
      this.triggerEvent("hideButtons");
      this.triggerEvent("togglescroll");
    },
    showObjDialog: function() {
      this.setData({
        objvisible: true
      });
      this.triggerEvent("hideButtons");
      this.triggerEvent("togglescroll");
    },
    hideObjDialog: function() {
      this.setData({
        objvisible: false
      });
      this.triggerEvent("hideButtons");
      this.triggerEvent("togglescroll");
    },
    handleInput: function(e) {
      this.setData({
        inputValue: e.detail.value
      });
    },
    handleReviewTap: function(e) {
      this.setData({
        reviewType: e.currentTarget.dataset.review,
        warnVisible: true
      });

      this.triggerEvent("togglescroll");
    },
    hideWarn: function() {
      this.setData({
        warnVisible: false
      });
      this.triggerEvent("togglescroll");
    },
    showAttrModify: function(e) {
      this.setData({
        reviewType: e.currentTarget.dataset.review,
        modifyAttrVisible: true
      });
      this.triggerEvent("togglescroll");
    },
    hideAttrModify: function() {
      this.setData({
        modifyAttrVisible: false
      });
      this.triggerEvent("togglescroll");
    },
    handleWarnOk: function() {
      console.log(this.data.reviewType);
      this.setData({
        warnVisible: false
      });
      this.triggerEvent("togglescroll");
      this.triggerEvent("remove", { _id: this.data.data._id });
      switch (this.data.reviewType) {
        case "unknow":
          this.reviewUnknow();
          break;
        case "no-property":
          this.reviewNoProperty();
          break;
        case "modify":
          this.reviewModify();
      }
    },
    reviewSuccess: function() {
      wx.showToast({
        title: "操作成功",
        icon: "none"
      });
    },
    reviewUnknow: function() {
      console.log(this.data.data);
      request("/correctedSPO", "post", this.reviewSuccess, null, {
        assembledObj: { ...this.data.data, ignored: true }
      });
    },
    reviewNoProperty: function() {
      console.log(this.data.data);
      request("/correctedSPO", "post", this.reviewSuccess, null, {
        assembledObj: { ...this.data.data, object: "", ignored: false }
      });
    },
    reviewModify: function() {
      console.log(this.data.data);
      request("/correctedSPO", "post", this.reviewSuccess, null, {
        assembledObj: {
          ...this.data.data,
          object: this.data.inputValue,
          ignored: false
        }
      });
    }
  }
});
