// pages/user/feedback/feedback.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: []
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this
    wx.request({
      url: app.globalData.host + '/feedback',
      method: 'POST',
      data: { s: app.globalData.s, data: e.detail.value },
      success: res => {
        if (res.data.error != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.switchTab({
            url: '/pages/user/index/index'
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  }
})