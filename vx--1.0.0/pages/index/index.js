import {
  getTimeNow
} from '../../utils/index'; //导入时间戳

const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    time:getTimeNow,
    // 轮播图列表，存储图片路径
    banner: ['../../images/banner1.jpg', '../../images/banner2.jpg', '../../images/banner3.jpg'],
    // 代取业务图标、文本信息列表，每个元素包含图标路径、文本描述和跳转的页面路径
    indexConfig: [{
      icon: '../../images/kuaidi.png',
      text: '快递代取',
      url: '/pkgA/pages/getExpress/getExpress'
    }]
  },
  // 跳转业务界面的函数
  toDetail(e) {
    // 从本地存储中获取用户信息
    const userInfo = wx.getStorageSync('user');
    console.log(userInfo);
    console.log(e);
    // 从触发事件的元素中获取要跳转的页面路径
    const url = e.currentTarget.dataset.url;
    // 判断是否登录
    if (userInfo) {
      // 如果已登录，跳转到指定业务页面
      wx.navigateTo({
        url: url,
      });
    } else {
      // 如果未登录，显示提示信息
      wx.showToast({
        icon: 'none',
        title: '请前往个人中心登录',
      });
    }
  },
  
  /**
   * 生命周期函数--监听页面加载=========------========
   */
  onLoad: function (options) {
    // 从本地存储中获取 openid
    const openid = wx.getStorageSync('openid');
    console.log('主页获取openid',openid)
    if (!openid) {
      // 如果没有获取到 openid，则调用云函数获取
      wx.cloud.callFunction({
        name: 'UserOpenId',
        success: (res) => {
          const { openid } = res.result;
          // 将获取到的 openid 存储到本地存储中
          wx.setStorageSync('openid', openid);
        }
      });
    }
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
});