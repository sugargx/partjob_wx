// pages/user/orders/orders.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["已报名", "进行中", "已完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    page: 1,
    orders: [],
    loadmore: true
  },
  onShow: function () {
    this.init(true);
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - 96) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
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
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.host + '/orders',
        method: 'GET',
        header: app.globalData.header,
        data: {
          page: that.data.page,
          t: that.data.activeIndex
        },
        success: res => {
          if (!first && res.data.data.orders.last_page <= that.data.page) {
            that.setData({
              loadmore: false
            })
          }
          that.setData({
            orders: first ? res.data.data.orders.data : that.data.infos.concat(res.data.data.orders.data),
            page: res.data.data.orders.current_page
          })
          wx.hideLoading();
        }
      })
    })
  },
  tabClick: function (e) {
    this.setData({
      page: 1,
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
    this.init(true);
  }
})