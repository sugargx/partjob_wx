// pages/specialty/specialty.js
const app = getApp()
const wxParser = require('../../wxParser/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    specialty: [],
    orders: [],
    isAgree: true,
    verified: false,
    loading: false,
    userId: ''
  },
  onLoad: function (e) {
    var user = wx.getStorageSync('user')
    this.setData({
      id: e.id,
      userId: user ? user.id : ''
    })
  },
  onShow: function (e) {
    this.init();
  },
  // onReachBottom: function (e) {
  //   var that = this
  //   that.setData({
  //     page: that.data.page + 1
  //   })
  //   if (this.data.orders.length > 0) {
  //     this.getOrders();
  //   }
  // },
  getOrders: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: app.globalData.host + '/infos/' + that.data.id + '/orders',
      method: 'POST',
      data: {
        s: app.globalData.s,
        page: that.data.page,
      },
      success: res => {
        if (res.data.error != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          if (res.data.data.orders.last_page <= that.data.page) {
            wx.showToast({
              title: '加载完成，无更多内容',
              icon: 'none',
              duration: 2000
            })
          } else {
            that.setData({
              orders: that.data.orders.concat(res.data.data.orders.data),
              page: res.data.data.orders.current_page
            })
          }
        }
        wx.hideLoading();
      }
    })
  },
  init: function (e) {
    var that = this
    wx.request({
      url: app.globalData.host + '/infos/' + that.data.id,
      method: 'POST',
      data: {
        s: app.globalData.s,
        userId: that.data.userId
      },
      success: function (res) {
        if (res.data.error != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          that.setData({
            specialty: res.data.data.info,
            verified: res.data.data.mobilephone_verified_at,
            orders: res.data.data.orders.data
          })
          wxParser.parse({
            bind: 'richText',
            html: that.data.specialty.content ? that.data.specialty.content : '无',
            target: that,
            enablePreviewImage: false
          });
        }
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    var formId = e.detail.formId
    app.login(function () {
      if (!that.data.verified) {
        wx.showModal({
          title: '提示',
          content: '请先完善个人信息',
          showCancel: false,
          success: res => {
            wx.navigateTo({
              url: '/pages/user/userinfo/userinfo',
            })
          }
        })
        return;
      }
      that.join(formId);
    })
  },
  join: function (formId) {
    var that = this
    that.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.host + '/join',
      method: 'POST',
      header: app.globalData.header,
      data: {
        t: 'joinspecialty',
        id: that.data.id,
        formId: formId
      },
      success: function (res) {
        that.setData({
          loading: false
        })
        //未认证提示认证
        if (res.data.error === 2) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  loading: false
                })
                wx.navigateTo({
                  url: '/pages/user/authentication/authentication',
                })
              }
            }
          })
          return
        }
        if (res.data.error !== 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.makePhoneCall({
            phoneNumber: that.data.specialty.contact_phone
          })
        }
      }
    })
  },
  handleService: function () {
    wx.makePhoneCall({
      phoneNumber: '0533-8524043'
    })
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: that.data.specialty.title,
      path: '/pages/specialty/specialty?id=' + that.data.specialty.id,
      success: function (res) {
      },
      fail: function (res) {
      }
    }
  },
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  handleContact: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.specialty.contact_phone
    })
  },
})