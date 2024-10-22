const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabList: ['待审核', '审核不通过', '审核通过'],
    tabNow: 0,
    //审核列表
    receiveList: [],
    receiveListtg:[],
    receiveListbtg:[]
  },
// 选择标签页
selectTab(e) {
  const { id } = e.currentTarget.dataset;
  console.log(id)
  // 设置当前选中的标签页索引
  this.setData({
    tabNow: id,
  });
  // 根据不同的标签页索引执行不同的加载数据方法

},



  // 审核内容
  toExamine(e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log('点击按钮传过来的值：',e.currentTarget.dataset)
    const {
      item: {
        _id
      },
      name
    } = e.currentTarget.dataset;
    const shyid = wx.getStorageSync('user')
    console.log('审核员_openid：',shyid._openid)
    db.collection('orderReceive').doc(_id).update({
      data: {
        state: name,
        examinePerson: shyid._openid
      },
      success: (res) => {
        this.onLoad();
        wx.hideLoading();
      }
    })
  },

  //待审核信息
  dsh(){
    db.collection('orderReceive').where({
      state: '待审核'
    })
    .get()
    .then(res => {
      console.log('获取的待审核信息',res.data)
      this.setData({
        receiveList: res.data
      })
    })
    .catch(res => {
      console.log('未获取到待审核信息')
    })
  },

  //通过信息
  tg(){
    db.collection('orderReceive').where({
      state: '审核通过'
    })
    .get()
    .then(res => {
      console.log('获取审核通过信息',res.data)
      this.setData({
        receiveListtg: res.data
      })
    })
    .catch(res => {
      console.log('未获取到审核信息')
    })
  },  
    
  //未通过信息
  btg(){
    db.collection('orderReceive').where({
      state: '审核不通过'
    })
    .get()
    .then(res => {
      console.log('获取审核不通过信息',res.data)
      this.setData({
        receiveListbtg: res.data
      })
    })
    .catch(res => {
      console.log('未获取到待审核信息')
    })
  },

  /**
   * 生命周期函数--监听页面加载--------------------------------------------------
   * --------------------------------------___________________----------------------------
   */
  onLoad: function (options) {
    this.dsh()
    this.tg()
    this.btg()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})