// pages/user/authentication/authentication.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    region: [],
    user_types: ['学生', '企业'],
    user_type: '',
    photo: [],
    years: [],
    year: '',
    amount: 0,
    prices: [1, 1],
    vip_expired_at: '',
    loading: false
  },
  onLoad: function () {
    this.setData({
      region: app.globalData.region
    })
  },
  onShow: function (options) {
    var that = this
    app.login(function () {
      wx.request({
        url: app.globalData.host + '/authentication',
        method: 'POST',
        header: app.globalData.header,
        data: {
          t: 'price'
        },
        success: res => {
          if (res.data.error != 0) {
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
          } else {
            that.setData({
              years: res.data.data.years,
              prices: res.data.data.prices,
              vip_expired_at: res.data.data.vip_expired_at == null ? '状态：未开通' : '到期时间：' + res.data.data.vip_expired_at
            })
            if (res.data.data.vip) {
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
          }
        }
      })
    })
  },
  bindRegionChange: function (e) {
    let region = e.detail.value
    if (region[0] == '全部' || region[1] == '全部') {
      wx.showToast({
        title: '请选择具体的省市',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.setData({
        region: e.detail.value
      })
    }
  },
  bindUserTypeChange: function (e) {
    var that = this;
    that.setData({
      user_type: e.detail.value
    })
    if (that.data.user_type != '' && that.data.year!='') {
      that.setData({
        amount: that.data.prices[that.data.user_type] * (parseInt(that.data.year) + 1)
      });
    }
  },
  bindYearChange: function (e) {
    var that = this;
    that.setData({
      year: e.detail.value
    })
    if (that.data.user_type != '' && that.data.year != '') {
      that.setData({
        amount: that.data.prices[that.data.user_type] * (parseInt(that.data.year)+1)
      });
    }
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
              photo: that.data.photo.concat(res1.data)
            });
            wx.hideLoading();
          }
        })
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    that.setData({
      loading: true
    })
    app.login(function () {
      let data = e.detail.value
      data.photo = that.data.photo
      data.year = parseInt(that.data.year) + 1
      wx.showActionSheet({
        itemList: ['余额支付', '微信支付'],
        success: res => {
          var pay = (res.tapIndex === 0 ? 'money' : 'wechat')
          wx.request({
            url: app.globalData.host + '/authentication',
            method: 'POST',
            header: app.globalData.header,
            data: { type: 'pay', pay: pay, data: data },
            success: res => {
              if (res.data.error === 10) {
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
                return;
              }
              if (res.data.error !== 0) {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
                that.setData({
                  loading: false
                })
                return
              }
              var jsapi = res.data.data.jsapi
              var id = res.data.data.id
              var order = res.data.data.order
              wx.requestPayment({
                'timeStamp': jsapi.timeStamp,
                'nonceStr': jsapi.nonceStr,
                'package': jsapi.package,
                'signType': 'MD5',
                'paySign': jsapi.paySign,
                'success': res1 => {
                  wx.request({
                    url: app.globalData.host + '/authentication',
                    method: 'POST',
                    data: { type: 'paysuccess', id: id, order: order },
                    header: app.globalData.header,
                    success: res2 => {
                      that.setData({
                        loading: false
                      })
                      if (res2.data.error === 10) {
                        wx.showModal({
                          title: '提示',
                          showCancel: false,
                          content: res2.data.msg,
                          success: res => {
                            wx.switchTab({
                              url: '/pages/user/index/index',
                            })
                          }
                        })
                        return;
                      }
                    }
                  })
                },
                'fail': function (res3) {
                  console.log(res.data.id)
                  var errMsg = res3.errMsg == 'requestPayment:fail cancel' ? '您取消了支付' : res3.errMsg;
                  wx.request({
                    url: app.globalData.host + '/authentication',
                    method: 'POST',
                    data: { type: 'payfail', id: id, order: order },
                    header: app.globalData.header,
                    success: function (res2) {
                      wx.showModal({
                        title: '提示信息',
                        content: errMsg,
                        showCancel: false
                      })
                      that.setData({
                        loading: false
                      })
                    }
                  })
                }
              })

            },
            fail: res => {
              that.setData({
                loading: false
              })
            }
          })
        },
        fail: res => {
          that.setData({
            loading: false
          })
        }
      })
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id,
      urls: this.data.photo
    })
  }
})