// pages/practices/index/index.js
const app = getApp()
Page({
  data: {
    lists: [],
    t: '',
    page: 1,
    loadmore: true
  },
  onShow: function () {
    var that = this
    that.setData({
      page: 1,
      loadmore: true
    })
    this.init(true);
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      t: options.t
    })
  },
  onReachBottom: function (e) {
    if (this.data.loadmore) {
      this.setData({
        page: this.data.page + 1
      })
      this.init(false);
    }
  },
  init: function (first) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    app.getLocation(function () {
      that.setData({
        city: app.globalData.city
      })
      wx.request({
        url: app.globalData.host + '/lists',
        method: 'POST',
        data: {
          s: app.globalData.s,
          city: app.globalData.city,
          t: that.data.t,
          page: that.data.page
        },
        success: function (res) {
          if (!first && res.data.data.lists.last_page <= that.data.page) {
            that.setData({
              loadmore: false
            })
          }
          if (res.data.data.lists.last_page <= that.data.page) {
            that.setData({
              loadmore: false
            })
          }
          that.setData({
            lists: first ? res.data.data.lists.data : that.data.lists.concat(res.data.data.lists.data),
            page: res.data.data.lists.current_page
          })
          wx.hideLoading();
        }
      })
    })
  }
})