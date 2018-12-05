// pages/experience/experience.js
const app = getApp()
const wxParser = require('../../wxParser/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    experience: [],
    orders: [],
    comments: [],
    deposit: 0,
    page: 1,
    isAgree: true,
    userId: '',
    vip: '',
    verified:false,
    itemList: [[], []],
    loading:false,
    hiddenModal: true,
    formId:''
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
  onReachBottom: function (e) {
    var that = this
    that.setData({
      page: that.data.page + 1
    })
    if (this.data.orders.length > 0) {
      this.getOrders();
    }
  },
  getOrders: function () {
    wx.showLoading({
      title: '加载报名中',
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
              page: res.data.data.infos.current_page
            })
          }
        }
        wx.hideLoading();
      }
    })
  },
  init: function (e) {
    var that = this
    that.setData({
      loading: false
    })
    wx.request({
      url: app.globalData.host + '/infos/' + that.data.id,
      method: 'POST',
      data: {
        s: app.globalData.s,
        userId: app.globalData.id
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
            experience: res.data.data.info,
            verified: res.data.data.mobilephone_verified_at,
            orders: res.data.data.orders.data,
            comments: res.data.data.comments,
            deposit: res.data.data.deposit,
            vip: res.data.data.vip,
            itemList: res.data.data.itemList
          })
          wxParser.parse({
            bind: 'richText',
            html: that.data.experience.content,
            target: that,
            enablePreviewImage: false
          });
        }
      }
    })
  },
  formSubmit: function (e) {
    var that = this
    that.setData({
      formId: e.detail.formId,
      loading: true
    })
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
      if (that.data.deposit !== 0) {
        that.setData({
          hiddenModal: false
        })
      } else {
        that.join(that.data.formId, '');
      }
    })
  },
  handleConfirm: function () {
    var that = this
    that.setData({
      hiddenModal: true
    })
    wx.showActionSheet({
      itemList: ['余额支付', '微信支付'],
      success: function (res) {
        var pay = (res.tapIndex === 0 ? 'money' : 'wechat')
        that.join(that.data.formId, pay);
      },
      fail: function (res) {
        that.setData({
          loading: false
        })
      }
    })
  },
  handleCancel: function () {
    this.setData({
      hiddenModal: true,
      loading: false
    })
  },
  join: function (formId, pay) {
    var that = this
    that.setData({
      loading: true
    })
    wx.request({
      url: app.globalData.host + '/join',
      method: 'POST',
      header: app.globalData.header,
      data: {
        t: 'joinexperience',
        id: that.data.id,
        formId: formId,
        pay: pay
      },
      success: function (res) {
        //未认证提示认证
        if (res.data.error === 2) {
          that.setData({
            loading: false
          })
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/user/authentication/authentication',
                })
              }
            }
          })
          return
        }
        if (res.data.error === 10) {
          that.init();
          wx.showToast({
            title: res.data.msg,
            icon: 'success',
            duration: 2000,
          })
          return;
        }
        if (res.data.error !== 0) {
          that.setData({
            loading: false
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          that.init();
          return
        }
        var jsapi = res.data.data.jsapi
        var orderId = res.data.data.order
        wx.requestPayment({
          'timeStamp': jsapi.timeStamp,
          'nonceStr': jsapi.nonceStr,
          'package': jsapi.package,
          'signType': 'MD5',
          'paySign': jsapi.paySign,
          'success': function (res1) {
            wx.request({
              url: app.globalData.host + '/join',
              method: 'POST',
              data: {
                t: 'paysuccess',
                id: orderId,
                formId: formId,
                userId: app.globalData.id
              },
              header: app.globalData.header,
              success: function (res2) {
                that.init();
                wx.showToast({
                  title: res2.data.msg,
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          },
          'fail': function (res3) {
            var errMsg = res3.errMsg == 'requestPayment:fail cancel' ? '您取消了支付' : res3.errMsg;
            wx.request({
              url: app.globalData.host + '/join',
              method: 'POST',
              data: { t: 'payfail', id: orderId, msg: res3.errMsg },
              header: app.globalData.header,
              success: function (res4) {
                that.setData({
                  loading: false
                })
                wx.showModal({
                  title: '提示信息',
                  content: errMsg,
                  showCancel: false
                })
              }
            })
          }
        })
      }
    })
  },
  openComment: function (e) {
    wx.navigateTo({
      url: '/pages/comment/comment?t=reply&id=' + e.currentTarget.dataset.id,
    })
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
  handleContact: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.experience.contact_phone
    })
  },
  handleEdit:function(){
    wx.navigateTo({
      url: '/pages/user/lists/lists?id= '+this.data.experience.id,
    })

  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: that.data.experience.title,
      path: '/pages/experience/experience?id=' + that.data.experience.id,
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
  add: function (e) {
    wx.navigateTo({
      url: '/pages/comment/comment?t=comment&id=' + this.data.experience.id,
    })
  }
})