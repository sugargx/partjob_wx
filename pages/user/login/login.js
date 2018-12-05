// pages/login/login.js
const app = getApp()
Page({
  data: {
    avatar: "http://static.zczleduapp.com/images/avatar.jpg",
    mobilephone: '',
    url: null,
    route: ''
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.login({
      success: res => {
        wx.request({
          url: app.globalData.host + '/onLogin',
          method: 'POST',
          data: { code: res.code },
          success: res => {
            wx.hideLoading();
            if (res.data.error == -1) {
              wx.showModal({
                title: '提示',
                content: res.data.msg + res.data.data.telephone,
                confirmText: '联系客服',
                success: res => {
                  if (res.confirm) {
                    wx.makePhoneCall({
                      phoneNumber: res.data.data.telephone
                    })
                  }
                }
              })
              return
            }
            if (res.data.error == 0) {
              wx.setStorageSync('user', res.data.data)
              if (that.data.route || that.data.route != '/pages/user/login/login' || that.data.route == '/pages/user/index/index' || that.data.route == '/pages/user/management/management') {
                wx.switchTab({
                  url: that.data.route
                })
              } else {
                wx.redirectTo({
                  url: that.data.route
                })
              }
            }
            return
          }
        })
      },
    })
  },
  onLoad: function (options) {
    var pages = getCurrentPages()
    var url = pages[pages.length - 2]
    var json = url.options
    var params = Object.keys(json).map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    }).join("&");
    this.setData({
      route: params == '' ? ('/' + url.route) : ('/' + url.route + '?' + params)
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
  getUserInfo: function (e) {
    var userinfo = e.detail
    if (userinfo.errMsg == 'getUserInfo:fail auth deny' || userinfo.errMsg == 'getUserInfo:cancel' || userinfo.errMsg=='getUserInfo:fail auth cancel') {
      wx.showToast({
        title: '同意授权才可以登录平台',
        icon: 'none',
        duration: 2000
      })
      return
    }
    var that = this
    wx.login({
      success: res => {
        wx.request({
          url: app.globalData.host + '/session',
          method: 'POST',
          data: { code: res.code },
          success: res => {
            if (res.data.error !== 0) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            } else {
              var openid = res.data.data.openid
              wx.request({
                url: app.globalData.host + '/login',
                method: 'POST',
                data: { t: 'openid', user: userinfo, openid: openid },
                success: res => {
                  if (res.data.error == -1) {
                    wx.showModal({
                      title: '提示',
                      content: res.data.msg + res.data.data.telephone,
                      confirmText: '联系客服',
                      success: res => {
                        if (res.confirm) {
                          wx.makePhoneCall({
                            phoneNumber: res.data.data.telephone
                          })
                        }
                      }
                    })
                    return
                  }
                  if (res.data.error !== 0) {
                    wx.showModal({
                      title: '提示',
                      content: res.data.msg,
                      showCancel: false,
                      success: function (res) {
                      }
                    })
                  } else {
                    var userinfo = res.data.data.userinfo
                    wx.setStorageSync('user', res.data.data)
                    if (that.data.route == null || that.data.route == '' || that.data.route == '/pages/user/index/index' || that.data.route == '/pages/user/management/management') {
                      wx.switchTab({
                        url: that.data.route,
                        success: res => {
                          if (!userinfo.mobilephone_verified_at) {
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
                          } else {
                            wx.showToast({
                              title: '登录成功',
                              icon: 'success',
                              duration: 2000
                            })
                          }
                        }
                      })
                    } else {
                      wx.redirectTo({
                        url: that.data.route,
                        success: res => {
                          if (!userinfo.mobilephone_verified_at) {
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
                          } else {
                            wx.showToast({
                              title: '登录成功',
                              icon: 'success',
                              duration: 2000
                            })
                          }
                        }
                      })
                    }
                  }
                }
              })
              fail: res => {
                console.log('wx.getuser 接口调用失败，将无法正常使用开放接口等服务', res)
              }
              wx.hideLoading();
            }
            return
          }
        })
      },
    })
  },
})