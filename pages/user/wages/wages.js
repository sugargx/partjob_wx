// pages/user/wages/wages.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    page: 1,
    wages: [],
    info: [],
    hiddenmodalput: true,
    wage: '',
    orderId: '',
    loadmore: true
  },
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  onShow: function () {
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
    app.login(function () {
      wx.request({
        url: app.globalData.host + '/wallet/wages',
        method: 'POST',
        header: app.globalData.header,
        data: { id: that.data.id, page: that.data.page },
        success: res => {
          if (res.data.error != 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            if (!first && res.data.data.wages.last_page <= that.data.page) {
              that.setData({
                loadmore: false
              })
            }
            if (res.data.data.wages.last_page <= that.data.page){
              that.setData({
                loadmore: false
              })
            }
            that.setData({
              info: res.data.data.info,
              wages: first ? res.data.data.wages.data : that.data.wages.concat(res.data.data.wages.data),
              page: res.data.data.wages.current_page
            })

          }
        }
      })
    })
  },
  handlePayWages: function (e) {
    this.setData({
      orderId: e.currentTarget.dataset.id,
      hiddenmodalput: false
    })
  },
  handleInput: function (e) {
    this.setData({
      wage: e.detail.value
    })
  },
  handleCancel: function (e) {
    this.setData({
      hiddenmodalput: true
    })
  },
  handleConfirm: function (e) {
    var that = this
    app.login(function () {
      wx.request({
        url: app.globalData.host + '/wallet/paywage',
        method: 'POST',
        header: app.globalData.header,
        data: { id: that.data.orderId, money: that.data.wage },
        success: res => {
          if (res.data.error == 2) {
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              confirmText: '充值',
              success: res => {
                if (res.confirm) {
                  that.setData({
                    hiddenmodalput: true
                  })
                  wx.navigateTo({
                    url: '/pages/user/money/money?t=recharge',
                  })
                }
              }
            })
            return
          }
          if (res.data.error != 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            that.setData({
              hiddenmodalput: true
            })
            that.init(true);
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