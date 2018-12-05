// pages/user/sign/sign.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene)
    if (scene == undefined) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '参数错误，请联系管理员',
        success: res => {
          wx.switchTab({
            url: '/pages/user/index/index',
          })
        }
      })
    } else {
      var that = this
      app.login(function (res) {
        wx.showLoading({
          title: '签到中',
        })
        wx.request({
          url: app.globalData.host + '/myinfo/' + scene,
          method: 'POST',
          header: app.globalData.header,
          data: { t: 'sign' },
          success: res => {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg,
              success: res => {
                wx.switchTab({
                  url: '/pages/user/index/index',
                })
              }
            })
          }
        })
      })
    }
  }
})