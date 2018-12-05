// components/userinfo.js
Component({
  options: {
    multipleSlots: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    avatar: {
      type: String,
      value: ''
    },
    nickname: {
      type: String,
      value: ''
    },
    label: {
      type: String,
      value: ''
    },
    url: {
      type: String,
      value: '/pages/user/login/login'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
