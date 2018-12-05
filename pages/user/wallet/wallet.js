// pages/user/wallet/wallet.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    orders: [],
    money: 0,
    deposit: 0,
    loadmore: true
  },
  onShow: function (options) {
    this.init(true);
  },
  onReachBottom: function (e) {
    var that = this
    that.setData({
      page: that.data.page
    })
    this.init(false);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  init: function (first) {
    var that = this
    app.login(function () {
      wx.request({
        url: app.globalData.host + '/wallet/index',
        method: 'POST',
        header: app.globalData.header,
        data: {
        },
        success: res => {
          if (!first && res.data.data.orders.last_page <= that.data.page) {
            that.setData({
              loadmore: false
            })
          }
          that.setData({
            money: res.data.data.money,
            deposit: res.data.data.deposit,
            orders: first ? res.data.data.orders.data : that.data.infos.concat(res.data.data.orders.data),
            page: res.data.data.orders.current_page
          })

        }
      })
    })
  }
})