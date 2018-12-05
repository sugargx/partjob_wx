// pages/user/money/money.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    tip: '',
    t: '',
    submitLoading: false
  },
  onLoad: function (e) {
    this.setData({
      t: e.t,
      title: e.t == 'recharge' ? '充值' : '提现'
    })
  },
  onShow: function () {
    app.login(function () {
    })
  },
  formSubmit: function (e) {
    var that = this
    that.setData({
      submitLoading: true
    });
    if (that.data.t == 'recharge') {
      app.login(function () {
        wx.request({
          url: app.globalData.host + '/wallet/recharge',
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
              that.setData({
                submitLoading: false
              })
            } else {
              var jsapi = res.data.data.jsapi
              var id = res.data.data.id
              wx.requestPayment({
                'timeStamp': jsapi.timeStamp,
                'nonceStr': jsapi.nonceStr,
                'package': jsapi.package,
                'signType': 'MD5',
                'paySign': jsapi.paySign,
                'success': res1 => {
                  wx.request({
                    url: app.globalData.host + '/wallet/paysuccess',
                    method: 'POST',
                    data: { id: id, prepay_id: jsapi.package.replace('prepay_id=', '') },
                    header: app.globalData.header,
                    success: res2 => {
                      that.setData({
                        loading: false
                      })
                      wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: res2.data.msg,
                        success: res => {
                          wx.navigateBack({
                          })
                        }
                      })
                    }
                  })
                },
                'fail': function (res3) {
                  var errMsg = res3.errMsg == 'requestPayment:fail cancel' ? '您取消了支付' : res3.errMsg;
                  wx.request({
                    url: app.globalData.host + '/wallet/payfail',
                    method: 'POST',
                    data: { id: id, msg: res3.errMsg },
                    header: app.globalData.header,
                    success: function (res2) {
                      wx.showModal({
                        title: '提示信息',
                        content: errMsg,
                        showCancel: false
                      })
                      that.setData({
                        submitLoading: false
                      })
                    }
                  })
                }
              })
            }
          }
        })
      })
    } else {
      app.login(function () {
        wx.showLoading({
          title: '请勿操作...',
        })
        wx.request({
          url: app.globalData.host + '/wallet/transfers',
          method: 'POST',
          header: app.globalData.header,
          data: e.detail.value,
          success: res => {
            wx.hideLoading()
            if (res.data.error !== 0) {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: res.data.msg,
                success: res => {
                  that.setData({
                    submitLoading: false
                  })
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                showCancel: false,
                content: res.data.msg,
                success: res => {
                  that.setData({
                    submitLoading: false
                  })
                  wx.navigateBack({
                  })
                }
              })
            }
          }
        })
      })
    }
  }
})