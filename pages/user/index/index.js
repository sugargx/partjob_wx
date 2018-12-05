// pages/user/index/index.js
const app = getApp()
Page({
  /**
 * 页面的初始数据
 */
  data: {
    avatar: "http://static.zczleduapp.com/images/avatar.jpg",
    nickname: "",
    url: '/pages/user/login/login',
    role: '',
    label: '',
    login: false,
    // 后台需传入是否是会员的状态
    vipstatus: false,

  },
  // 会员认证页面跳转
  toVipRegister: function(){
    wx.navigateTo({
      url: '/pages/user/authentication/authentication',
    })
  },
  // onShow: function () {
  //   var that=this
  //   app.login(function () {
  //     if (!that.data.login) {
  //       that.init();
  //     }
  //   })
  // },
  // onLoad: function () {
  //   if (!app.globalData.login) {
  //     wx.stopPullDownRefresh()
  //   } else {
  //     this.init();
  //   }
  // },
  // onPullDownRefresh: function () {
  //   this.init();
  // },
  // init: function () {
  //   if (!app.globalData.login) {
  //     this.setData({
  //       nickname: '登录/注册'
  //     })
  //   } else {
  //     wx.showLoading({
  //       title: '加载中',
  //     })
  //     var that = this
  //     app.login(function () {
  //       wx.request({
  //         url: app.globalData.host + '/user/index',
  //         method: 'POST',
  //         header: app.globalData.header,
  //         data: {},
  //         success: res => {
  //           if (res.data.error != 0) {
  //             wx.showToast({
  //               title: res.data.msg,
  //               icon: 'none',
  //               duration: 2000
  //             })
  //           } else {
  //             that.setData({
  //               avatar: res.data.data.avatar,
  //               nickname: res.data.data.nickname,
  //               role: res.data.data.role,
  //               url: '',
  //               label: res.data.data.label,
  //               login: true
  //             })
  //           }
  //           wx.stopPullDownRefresh();
  //           wx.hideLoading();
  //         }
  //       })
  //     })
  //   }
  // },
  // openUrl: function (e) {
  //   var that = this
  //   app.login(function (res) {
  //     if (!app.globalData.login) {
  //       wx.navigateTo({
  //         url: '/pages/user/login/login',
  //       })
  //     } else {

  //       if (e.currentTarget.dataset.url == '/pages/user/management/management') {
  //         wx.switchTab({
  //           url: e.currentTarget.dataset.url,
  //         })
  //       } else {
  //         wx.navigateTo({
  //           url: e.currentTarget.dataset.url,
  //         })
  //       }
  //     }
  //   })
  // },
  openScanCode: function () {
    app.login(function (res) {
      wx.scanCode({
        onlyFromCamera: true,
        success: (res) => {
          if (res.path == undefined || res.path == '') {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '不是有效的签到小程序码',
              success: res => {
              }
            })
          } else {
            wx.navigateTo({
              url: '/' + res.path,
            })
          }
        }
      })
    })
  },
  handleService: function () {
    wx.makePhoneCall({
      phoneNumber: '0533-8524043'
    })
  }
})