// pages/comment/comment.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    t: null,
    id: null
  },
  onLoad: function (e) {
    this.setData({
      id: e.id,
      t: e.t
    })
    app.login(function () {
    })
  },
  formSubmit: function (e) {
    var that = this
    wx.request({
      url: app.globalData.host + '/infos/' + that.data.id + '/comments',
      method: 'POST',
      header: app.globalData.header,
      data: { t: that.data.t, data: e.detail.value },
      success: function (res) {
        if (res.data.error !== 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.redirectTo({
            url: '/pages/info/info?id=' + res.data.data.id
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})