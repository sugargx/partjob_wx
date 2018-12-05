const App = getApp();
Page({
  data: {
    loadmore: true,

    // 消息状态
    status:true,
    itemData: [{
      headappear: '../../images/comment.png',
      name: '兼职名字',
      info: '文字！'
    },
    {
      headappear: '../../images/comment.png',
      name: '兼职名字',
      info: '文字2！'
    }
    ],
  },
  newshow: function(){
    wx.showModal({
      content: '消息内容展示',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('确定')
        }
      }
    });
  },
  touchS: function (e) { // touchstart
    let startX = App.Touches.getClientX(e)
    startX && this.setData({
      startX
    })
  },
  touchM: function (e) { // touchmove
    let itemData = App.Touches.touchM(e, this.data.itemData, this.data.startX)
    itemData && this.setData({
      itemData
    })

  },
  touchE: function (e) { // touchend
    const width = 300 // 定义操作列表宽度
    let itemData = App.Touches.touchE(e, this.data.itemData, this.data.startX, width)
    itemData && this.setData({
      itemData
    })
  },
  itemDelete: function (e) { // itemDelete
    let itemData = App.Touches.deleteItem(e, this.data.itemData)
    itemData && this.setData({
      itemData
    })
  },
  
})