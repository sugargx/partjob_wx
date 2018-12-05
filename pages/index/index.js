//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    city: '淄博市',
    slides: [],
    infos: [],
    slides1: [],
    inputShowed: true,
    inputVal:''
  },
  onShow: function () {
    this.setData({
      city: app.globalData.city
    })
    this.init();
  },
  init: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    app.getLocation(function () {
      that.setData({
        city: app.globalData.city
      })
      wx.request({
        url: app.globalData.host + '/home',
        method: 'POST',
        data: {
          s: app.globalData.s,
          city: app.globalData.city
        },
        success: function (res) {
          that.setData({
            slides: res.data.data.slides,
            infos: res.data.data.infos,
            slides1: res.data.data.slides1
          })
          wx.hideLoading();
        }
      })
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  search:function(){
    if (this.data.inputVal==''){
      wx.showToast({
        title: '搜索关键词不能为空',
        icon: 'none',
        duration: 2000
      })
    }else{
      app.globalData.keywords = this.data.inputVal
      wx.switchTab({
        url: '/pages/infos/infos',
      })
    }
  },
  onShareAppMessage: function () {
  },
  handleSwiper:function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  handMore:function(){
    wx.switchTab({
      url: '/pages/infos/infos',
    })
  }
})