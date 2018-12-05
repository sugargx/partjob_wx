// pages/user/infos/publish/publish.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    info: [],
    region: [],
    payment_methods: ['日结', '周结', '月结', '完工结算'],
    payment_method: null,
    wages_units: ['小时', '日', '周', '月'],
    wages_unit: 0,
    categories: ['调研', '配送员', '促销员', '服务员', '临时工', '校内', '编辑', '派单', '演艺', '家教', '客服', '分拣', '地推', '充场', '代理', '其他'],
    join_deadline: '',
    sexes: ['男', '女', '男女不限'],
    publish: [0, 0],
    role: '',
    tip: '',
    contact_name: '',
    contact_phone: ''
  },
  onLoad: function (option) {
    this.setData({
      region: app.globalData.region,
      id: option.id ? option.id : ''
    })
  },
  onShow: function () {
    app.globalData.mid = 0
    var that = this
    app.login(function () {
      if (that.data.id) {
        wx.request({
          url: app.globalData.host + '/infos/' + that.data.id,
          method: 'GET',
          header: app.globalData.header,
          data: {},
          success: res => {
            if (res.data.error != 0) {
              wx.navigateBack({

              })
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
              return
            }
            that.setData({
              info: res.data.data.info,
              role: res.data.data.role,
              tip: res.data.data.tip,
              contact_name: res.data.data.info.contact_name,
              contact_phone: res.data.data.info.contact_phone
            })
          }
        })
      } else {
        wx.request({
          url: app.globalData.host + '/infos/create',
          method: 'GET',
          header: app.globalData.header,
          data: {},
          success: res => {
            if (res.data.error == 1001) {
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
            if (res.data.error != 0) {
              wx.showModal({
                title: '提示',
                content: res.data.msg,
                showCancel: false,
                success: function (res) {
                  app.globalData.mid = 0
                  wx.switchTab({
                    url: '/pages/user/management/management'
                  })
                }
              })
              return
            }
            that.setData({
              publish: res.data.data.publish,
              role: res.data.data.role,
              tip: res.data.data.tip,
              contact_name: res.data.data.contact_name,
              contact_phone: res.data.data.contact_phone
            })
          }
        })
      }
    })
  },
  bindCategoryChange: function (e) {
    this.setData({
      category: e.detail.value
    })
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  bindPaymentMethodChange: function (e) {
    this.setData({
      payment_method: e.detail.value
    })
  },
  bindWagesUnitChange: function (e) {
    this.setData({
      wages_unit: e.detail.value
    })
  },
  bindSexChange: function (e) {
    this.setData({
      sex: e.detail.value
    })
  },
  bindJoinDeadlineChange: function (e) {
    this.setData({
      join_deadline: e.detail.value
    })
  },
  bindStartedAtChange: function (e) {
    this.setData({
      started_at: e.detail.value
    })
  },
  bindEndedAtChange: function (e) {
    this.setData({
      ended_at: e.detail.value
    })
  },
  bindGatheringTimeChange: function (e) {
    this.setData({
      gathering_time: e.detail.value
    })
  },
  bindGatheringDateChange: function (e) {
    this.setData({
      gathering_date: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this
    app.login(function () {
      wx.request({
        url: app.globalData.host + '/myinfos' + (that.data.id ? '/' + that.data.id : ''),
        method: that.data.id ? 'PUT' : 'POST',
        header: app.globalData.header,
        data: { t: 'edit', data: e.detail.value },
        success: res => {
          if (res.data.error != 0) {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          } else {
            app.globalData.mid = 0
            wx.switchTab({
              url: '/pages/user/management/management'
            })
            wx.showToast({
              title: res.data.msg,
              icon: 'success',
              duration: 2000
            })
          }
        }
      })
    })
  }
})