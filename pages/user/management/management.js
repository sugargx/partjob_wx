// pages/user/management/management.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: ['兼职', '实习生', '成长体验', '特长生'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    page: 1,
    items: { 'infos': [], 'practices': [], 'experiences': [], 'specialties': [] },
    urls: ['infos', 'practices', 'experiences', 'specialties'],
    addVisible: [true, true, true, true],
    loadmore: true
  },
  onShow: function () {
    this.setData({
      activeIndex: app.globalData.mid,
    });
    this.init(true);
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - 85) / 2,
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
  // init: function (first) {
  //   var that = this
  //   var name = that.data.urls[that.data.activeIndex]
  //   app.login(function () {
  //     wx.showLoading({
  //       title: '加载中',
  //     })
  //     wx.request({
  //       url: app.globalData.host + '/my' + name,
  //       method: 'GET',
  //       header: app.globalData.header,
  //       data: { page: that.data.page },
  //       success: res => {
  //         wx.hideLoading();
  //         if (!first && res.data.data.items.last_page <= that.data.page) {
  //           that.setData({
  //             loadmore: false
  //           })
  //         }
          
  //         if (res.data.data.items.last_page <= that.data.page) {
  //           that.setData({
  //             loadmore: false
  //           })
  //         }

  //         let items = that.data.items;
  //         items[name] = first ? res.data.data.items.data : that.data.items.concat(res.data.data.items.data)
  //         that.setData({
  //           items: items,
  //           page: res.data.data.items.current_page
  //         })
  //       }
  //     })
  //   })
  // },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id,
      page: 1
    });
    app.globalData.mid = e.currentTarget.id
    this.init(true);
  },
  addInfo: function (e) {
    wx.navigateTo({
      url: '/pages/user/' + this.data.urls[this.data.activeIndex] + '/publish/publish',
    })
  }
})