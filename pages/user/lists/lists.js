// pages/user/lists/lists.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    page: 1,
    lists: [],
    info: [],
    loadmore: true,
    total: '',
    genders: ['未知', '男', '女']
  },
  onLoad: function (options) {
    this.setData({
      id: options.id,
      t: (options.t == undefined || options.t == '') ? 100 : options.t
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
        url: app.globalData.host + '/orders?t=' + that.data.t + '&id=' + that.data.id,
        method: 'GET',
        header: app.globalData.header,
        success: res => {
          if (res.data.error != 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            if (!first && res.data.data.orders.last_page <= that.data.page) {
              that.setData({
                loadmore: false
              })
            }
            that.setData({
              info: res.data.data.info,
              lists: first ? res.data.data.orders.data : that.data.orders.concat(res.data.data.orders.data),
              page: res.data.data.orders.current_page,
              total: res.data.data.total
            })

          }
        }
      })
    })
  },
  handleContact: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  handleSign: function (e) {
    var that = this
    app.login(function (res) {
      wx.showLoading({
        title: '签到中',
      })
      wx.request({
        url: app.globalData.host + '/myinfo/' + e.currentTarget.dataset.id,
        method: 'POST',
        header: app.globalData.header,
        data: { t: 'signin'},
        success: res => {
          wx.hideLoading();
          if (res.data.error != 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            that.init(true);
            wx.showToast({
              title: '签到成功',
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    })
  }
})