
import { getTimeNow } from '../../../utils/index';
const db = wx.cloud.database();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息，头像、昵称
    userInfo: {},
    // 用户证件照片
    userIDImg: '',
    // 用户姓名
    name: '',
    // 用户手机号
    userID: '',
  },
  // 提交接单员审核申请事件
  submit() {
    // 保存当前页面实例的引用，方便在回调函数中使用
    const that = this;
    // 获取当前页面的数据,姓名、电话、证件照
    const { name, userID, userIDImg } = that.data;
    // 提交信息
    if (name === '') {
      // 如果姓名为空，显示提示信息
      wx.showToast({
        icon: 'none',
        title: '姓名为空',
      });
    } else if (userID === '') {
      // 如果证件号为空，显示提示信息
      wx.showToast({
        icon: 'none',
        title: '证件号为空',
      });
    } else if (userIDImg === '') {
      // 如果证件照为空，显示提示信息
      wx.showToast({
        icon: 'none',
        title: '证件照为空',
      });
    } else {
      // 向云数据库的 'orderReceive' 集合添加数据
      db.collection('orderReceive').add({
        data: {
          // 页面数据中的姓名
          name: name,
          // 页面数据中的手机号
          userID: userID,
          // 页面数据中的证件照片文件路径
          userIDImg: userIDImg,
          // 页面数据中的用户信息对象
          //userInfo: that.userInfo,
          // 订单状态设置为 '待审核'
          state: '待审核',
          // 获取当前时间
          time: getTimeNow(),
          // 总金额初始为 0
          //allMoney: 0,
          // 订单总数初始为 0
          //allCount: 0,
          // 订单列表初始为空数组
          //allOrder: [],
        },
        success: (res) => {
          // 提交成功后，清空输入内容
          this.setData({
            name: '',
            userID: '',
            userIDImg: '',
          });
          // 显示提交成功的提示信息
          wx.showToast({
            title: '提交成功',
          });
          // 跳转到 'receiveLoading' 页面,审核中提示
          wx.navigateTo({
            url: '/pkgC/pages/receiveLoading/receiveLoading',
          });
        },
        fail: (res) => {
          // 提交失败时，显示提示信息
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          });
        },
      });
    }
  },
  // 获取用户输入的姓名
  getName(e) {
    this.setData({
      name: e.detail.value,
    });
  },
  
  // 获取用户输入的手机号
  getUserID(e) {
    this.setData({
      userID: e.detail.value,
    });
  },

  // 跳转到协议页面
  toAgreement() {
    wx.navigateTo({
      url: '/pkgC/pages/agreement/agreement',
    });
  },

  // 获取管理员微信号并复制到剪贴板
  getAdminWX() {
    wx.setClipboardData({
      data: '1335xxxx872',
      success: (res) => {
        // 复制成功后，显示提示信息
        wx.showToast({
          title: '复制微信成功',
        });
      },
    });
  },
  // 提示信息
  showTips() {
    // wx.navigateTo({
    //   url: 'url',
    // })
  },
  // 上传用户证件照片
  uploadImg() {
    // 调用微信的选择图片接口
    wx.chooseImage({
      count: 1, // 只选择一张图片
      sizeType: ['compressed', 'original'], // 可以选择压缩或原图
      sourceType: ['album', 'camera'], // 可以从相册或相机选择
      success: (res) => {
        // 显示加载提示
        wx.showLoading({
          title: '加载中',
        });
        const random = Math.floor(Math.random() * 1000);
        // 调用云存储的上传文件接口
        wx.cloud.uploadFile({
          cloudPath: `userIDImg/${this.data.userInfo.nickName}-${random}.png`,
          filePath: res.tempFilePaths[0],
          success: (res) => {
            let fileID = res.fileID;
            // 将上传后的文件 ID 设置到页面数据中
            this.setData({
              userIDImg: fileID,
            });
            // 隐藏加载提示
            wx.hideLoading();
          },
        });
      },
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 从本地存储中获取用户信息
    const userxx = wx.getStorageSync('user');
    this.setData({
      userInfo:userxx,
    });
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

  },
});