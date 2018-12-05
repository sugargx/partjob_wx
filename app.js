import Touches from './utils/Touches.js'
App({

  onLaunch: function () {
    
  },
  login: function (callback) {
    var that = this
    var user = wx.getStorageSync('user')
    if (!user || new Date().getTime() > user.expired_at * 1000) {
      that.globalData.login = false
      wx.navigateTo({
        url: '/pages/user/login/login'
      })
      return
    }
    if(!that.globalData.login){
      that.globalData.login = true
      that.globalData.id = user.id
      that.globalData.user = user
      that.globalData.header = { 'Authorization': 'Bearer ' + user.token }
    }
    wx.request({
      url: that.globalData.host + '/user/status',
      method: 'POST',
      header: that.globalData.header,
      data: {},
      success: res => {
        if (res.data.error != 0) {
          console.log(res.data,"哈哈哈哈哈")
          wx.showModal({
            title: '提示',
            content: res.data.msg + res.data.data.telephone,
            confirmText: '联系客服',
            success: result => {
              wx.switchTab({
                url: '/pages/index/index',
              })
              if (result.confirm) {
                wx.makePhoneCall({
                  phoneNumber: res.data.data.telephone
                })
              }
            }
          })
        } else {
          typeof callback === "function" ? callback(null) : null
        }
      }
    })
  },
  getUser: function (callback) {
    var that = this
    that.login(function (res) {
      if (!that.globalData.login) {
        wx.reLaunch({
          url: '/pages/user/login/login',
        })
      }
    })
  },
  getLocation: function (callback) {
    var that = this
    var city = that.globalData.city
    if (city === null || city === '') {
      var QQMapWX = require('/utils/qqmap-wx.min.js')
      var qqmapsdk = new QQMapWX({
        key: '7RBBZ-TCKC6-7QJSP-MXHAP-CEJD2-ZRFFX'
      });
      wx.getLocation({
        type: 'wgs84',
        success: res => {
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: addressRes => {
              let address = addressRes.result.address_component
              that.globalData.region = [address.province, address.city, address.district]
              that.globalData.city = address.city
              that.globalData.location = address.city
              typeof callback === "function" ? callback(null) : null
            },
            fail: res => {
            }
          })
        },
        fail: res => {
          that.globalData.region = ['山东省', '淄博市', '张店区']
          that.globalData.city = '淄博市'
          that.globalData.location = '淄博市'
          typeof callback === "function" ? callback(null) : null
        }
      })
    } else {
      typeof callback === "function" ? callback(null) : null
    }
  },
  globalData: {
    //host: 'http://127.0.0.1:8000/api/wxa',
    host: 'https://www.zczleduapp.com/api/wxa',
    s: 'WPJGzWLZrxoz$09B7s7E',
    user: null,
    header: null,
    login: false,
    region: [],
    city: '',
    location: '',
    keywords: '',
    id: '',
    mid: 0
  },
  Touches: new Touches(),
})