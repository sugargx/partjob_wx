// pages/user/userinfo/userinfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: [],
    genders: ['请选择','男', '女'],
    mobilephone: '',
    birthday:'',
    gender:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    var that = this
    app.login(function () {
      wx.request({
        url: app.globalData.host + '/user/userinfo',
        method: 'POST',
        header: app.globalData.header,
        data: { },
        success: res => {
          if (res.data.error != 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            var userinfo = res.data.data.userinfo
            that.setData({
              userinfo: userinfo,
              gender: userinfo['gender'],
              birthday: userinfo['birthday'],
              mobilephone: userinfo['mobilephone']
            })
          }
        }
      })
    })
  },
  bindGenderChange: function(e) {
    this.setData({
      gender: e.detail.value
    })
  },
  bindMobilephoneInput: function (e) {
    this.setData({
      mobilephone: e.detail.value
    })
  },
  bindBirthdayChange: function (e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  sendVerificationCode: function () {
    var that = this
    wx.request({
      url: app.globalData.host + '/verificationcode',
      method: 'POST',
      data: {
        data: {
          mobilephone: that.data.mobilephone
        }
      },
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    if(that.data.gender==0){
      wx.showToast({
        title: '请选择性别',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.request({
      url: app.globalData.host + '/user/saveuserinfo',
      method: 'POST',
      header: app.globalData.header,
      data: { data: e.detail.value },
      success: res => {
        if (res.data.error !== 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          wx.switchTab({
            url: '/pages/user/index/index',
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})