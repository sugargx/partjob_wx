// pages/infos/infos.js

const app = getApp()

Page({
  data: {
    page: 1,
    infos: [],
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
    app.getLocation(function () {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.host + '/infos',
        method: 'POST',
        data: {
          s: app.globalData.s,
          page: that.data.page,
          city: app.globalData.city,
          keywords: app.globalData.keywords
        },
        success: res => {
          app.globalData.keywords = ''
          if (res.data.error != 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            if (!first && res.data.data.infos.last_page <= that.data.page) {
              that.setData({
                loadmore: false
              })
            }
            that.setData({
              infos: first ? res.data.data.infos.data : that.data.infos.concat(res.data.data.infos.data),
              page: res.data.data.infos.current_page
            })
          }
          wx.hideLoading()
        }
      })
    })
  }
})