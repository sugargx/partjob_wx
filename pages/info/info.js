// pages/info/info.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    info: [],
    orders: [],
    comments: [],
    deposit: 0,
    page: 1,
    isAgree: true,
    userid: '',
    vip: '',
    order: true,
    loading: false,
    verified: false,
    itemList: [[], []],
    genders: ['未知', '男', '女'],
    hiddenModal: true,
    formId: '',
    user: { mobilephone: '', fullname: '' },
    vipmoney: '15元/小时',
    noVipmoney:'13元/小时'
  },
  onLoad: function (e) {
    var user = wx.getStorageSync('user')
    this.setData({
      id: e.id,
      userid: user ? user.id : ''
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
    if (this.data.loadmore && this.data.order && this.data.orders.length > 0) {
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
          if (!first && res.data.data.orders.last_page <= that.data.page) {
            that.setData({
              loadmore: false
            })
          }
          that.setData({
            orders: that.data.orders.concat(res.data.data.orders.data),
            page: res.data.data.infos.current_page
          })

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
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.globalData.host + '/infos/' + that.data.id,
      method: 'POST',
      data: {
        s: app.globalData.s,
        userId: that.data.userid
      },
      success: function (res) {
        if (res.data.error == 1001) {
          wx.switchTab({
            url: '/pages/infos/infos',
          })
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          wx.hideLoading()
          return
        }
        if (res.data.error != 0) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          var info = res.data.data.info
          info.started_at = info.started_at.substring(0, 10)
          info.ended_at = info.ended_at.substring(0, 10)
          that.setData({
            info: info,
            orders: res.data.data.orders.data,
            comments: res.data.data.comments,
            deposit: res.data.data.deposit,
            vip: res.data.data.vip,
            order: res.data.data.order,
            verified: res.data.data.mobilephone_verified_at,
            itemList: res.data.data.itemList,
            user: res.data.data.user ? res.data.data.user : { mobilephone: '', fullname: '' }
          })
        }
        wx.hideLoading()
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
      if (!that.data.vip) {
        wx.makePhoneCall({
          phoneNumber: that.data.info.contact_phone,
          complete: res => {
            that.setData({
              loading: false
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
        wx.showModal({
          title: '确认报名吗？',
          content: '姓名:' + that.data.user.fullname + ' 电话：' + that.data.user.mobilephone,
          cancelText:'修改信息',
          success: function (res) {
            if (res.confirm) {
              that.join(that.data.formId, '');
            } else {
              wx.navigateTo({
                url: '/pages/user/userinfo/userinfo',
              })
            }
          }
        })
        
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
        t: 'join',
        id: that.data.id,
        formId: formId,
        pay: pay
      },
      success: function (res) {
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
          'success': res1 => {
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
              success: res2 => {
                that.init();
                wx.showToast({
                  title: res2.data.msg,
                  icon: 'success',
                  duration: 2000
                })
              }
            })
          },
          'fail': res3 => {
            var errMsg = res3.errMsg == 'requestPayment:fail cancel' ? '您取消了支付' : res3.errMsg;
            wx.request({
              url: app.globalData.host + '/join',
              method: 'POST',
              data: { t: 'payfail', id: orderId, msg: res3.errMsg },
              header: app.globalData.header,
              success: res4 => {
                wx.showModal({
                  title: '提示信息',
                  content: errMsg,
                  showCancel: false,
                  success: res => {
                    that.setData({
                      loading: false
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  handleEdit: function () {
    var that = this
    if (that.data.itemList[0].length > 0) {
      var id = that.data.id
      var itemList = that.data.itemList[0]
      wx.showActionSheet({
        itemList: itemList,
        success: function (res) {
          if (res.tapIndex === 0) {
            that.handleQrcode();
          }
          if (res.tapIndex === 1) {
            wx.navigateTo({
              url: '/pages/user/lists/lists?id=' + id,
            })
          }
          if (res.tapIndex === 2) {
            wx.navigateTo({
              url: '/pages/user/infos/publish/publish?id=' + id,
            })
          }
          if (res.tapIndex === 3) {
            app.login(function () {
              wx.showLoading({
                title: '加载中',
              })
              wx.request({
                url: app.globalData.host + '/myinfos/' + that.data.id,
                method: 'POST',
                header: app.globalData.header,
                data: { _method: 'DELETE' },
                success: res => {
                  wx.hideLoading();
                  if (res.data.error != 0) {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'success',
                      duration: 2000
                    })
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 1000)
                  }
                }
              })
            })
          }
          if (res.tapIndex === 4) {
            wx.navigateTo({
              url: '/pages/user/wages/wages?id=' + that.data.id,
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  handleManagement: function () {
    var that = this
    if (that.data.itemList[1].length > 0) {
      var itemList = that.data.itemList[1]
      wx.showActionSheet({
        itemList: itemList,
        success: function (res) {
          if (res.tapIndex === 0) {
            app.login(function () {
              wx.showLoading({
                title: '加载中',
              })
              wx.request({
                url: app.globalData.host + '/myinfos/' + that.data.id,
                method: 'POST',
                header: app.globalData.header,
                data: { _method: 'PUT', t: 'top' },
                success: res => {
                  wx.hideLoading();
                  if (res.data.error != 0) {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'success',
                      duration: 2000
                    })
                    that.init();
                  }
                }
              })
            })
          }
          if (res.tapIndex === 1) {
            app.login(function () {
              wx.showLoading({
                title: '加载中',
              })
              wx.request({
                url: app.globalData.host + '/myinfos/' + that.data.id,
                method: 'POST',
                header: app.globalData.header,
                data: { _method: 'DELETE' },
                success: res => {
                  wx.hideLoading();
                  if (res.data.error != 0) {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'none',
                      duration: 2000
                    })
                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'success',
                      duration: 2000
                    })
                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 1000)
                  }
                }
              })
            })
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    }
  },
  handleQrcode: function (e) {
    var that = this
    var id = that.data.id
    app.login(function () {
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: app.globalData.host + '/myinfo/' + id,
        method: 'POST',
        header: app.globalData.header,
        data: { t: 'getSignQrCode' },
        success: res => {
          wx.hideLoading();
          if (res.data.error != 0) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.msg,
              success: res => {
              }
            })
          } else {
            wx.previewImage({
              urls: res.data.data.urls
            })
          }
        }
      })
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
  handleContact: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.info.contact_phone
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
      title: that.data.info.title,
      path: '/pages/info/info?id=' + that.data.info.id,
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
      url: '/pages/comment/comment?t=comment&id=' + this.data.info.id,
    })
  }
})