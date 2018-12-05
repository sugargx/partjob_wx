// pages/user/experiences/publish/publish.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    tip: ''
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  onLoad:function(){
    this.setData({
      region: app.globalData.region
    })
  },
  onShow: function () {
    app.globalData.mid = 2
    var that = this
    app.login(function () {
      wx.request({
        url: app.globalData.host + '/user/publishexperiences',
        method: 'POST',
        header: app.globalData.header,
        data: {},
        success: res => {
          if (res.data.error == 1001) {
            wx.showModal({
              title: '提示',
              content: '请先完善个人信息',
              showCancel: false,
              success: res => {
                wx.navigateTo({
                  url: '/pages/user/userinfo/userinfo',
                })
              }
            })
            return;
          } 
          if (res.data.error != 0) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success: function (res) {
                wx.switchTab({
                  url: '/pages/user/management/management'
                })
              }
            })
            return
          }
          that.setData({
            tip: res.data.data.tip
          })
        }
      })
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      count: 1,
      success: res => {
        wx.showLoading({
          title: '上传中',
        })
        wx.uploadFile({
          url: app.globalData.host + '/upload/image',
          filePath: res.tempFilePaths[0],
          name: 'file',
          header: app.globalData.header,
          success: res1 => {
            that.setData({
              image: res1.data
            });
            wx.hideLoading();
          }
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    app.login(function () {
      wx.request({
        url: app.globalData.host + '/myexperiences',
        method: 'POST',
        header: app.globalData.header,
        data: { data: e.detail.value },
        success: res => {
          if (res.data.error != 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.switchTab({
              url: '/pages/user/management/management'
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    })
  }
})