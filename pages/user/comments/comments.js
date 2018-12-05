// pages/user/comments/comments.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    loadmore: true
  },
  commentsAll:function(){
    wx.navigateTo({
      url: '/pages/user/commentsall/commentsall',
    })
  },
  // onLoad: function (options) {
  //   this.init(true);
  // },
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
  //   app.login(function () {
  //     wx.request({
  //       url: app.globalData.host + '/user/comments',
  //       method: 'POST',
  //       header: app.globalData.header,
  //       data: { page: that.data.page },
  //       success: res => {
  //         if (res.data.error != 0) {
  //           wx.showToast({
  //             title: res.data.msg,
  //             icon: 'none',
  //             duration: 2000
  //           })
  //         } else {
  //           if (!first && res.data.data.comments.last_page <= that.data.page) {
  //             that.setData({
  //               loadmore: false
  //             })
  //           }
  //           that.setData({
  //             comments: first ? res.data.data.comments.data : that.data.comments.concat(res.data.data.comments.data),
  //             page: res.data.data.comments.current_page
  //           })
  //         }
  //       }
  //     })
  //   })
  // }
})