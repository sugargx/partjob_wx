// pages/page/page.js
// pages/index/detail/detail.js
const app = getApp()
const wxParser = require('../../wxParser/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: [],
    a: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      a: options.a
    })
    wx.request({
      url: app.globalData.host + '/article',
      method: 'POST',
      data: {
        s: app.globalData.s,
        a: that.data.a
      },
      success: function (res) {
        var content = res.data.data.article.content
        that.setData({
          article: res.data.data.article
        })
        wxParser.parse({
          bind: 'richText',
          html: content,
          target: that,
          enablePreviewImage: false
        });
      }
    })
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: that.data.article.title,
      path: '/pages/page/page?a=' + that.data.a,
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
  handleShare: function () {
    wx.showShareMenu({
      withShareTicket: true,
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  handleService: function () {
    wx.makePhoneCall({
      phoneNumber: '0533-8524043'
    })
  },
  handleAuthentication:function(){
    wx.navigateTo({
      url: '/pages/user/authentication/authentication',
    })
  }
})