  //const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
      userInfo: {},
      //phone: '',
  },



      // getName(e) {
      //     this.setData({
      //         name: e.detail.value
      //     })
      // },
      // //新版选择图片
      // chooseImage() {
      //     wx.chooseMedia({
      //         count: 1,
      //         mediaType: ['image'],
      //         sizeType: ['compressed'], //可以指定是原图还是压缩图，这里用压缩
      //         sourceType: ['album', 'camera'], //从相册选择
      //         success: (res) => {
      //             console.log("选择图片成功", res)
      //             this.setData({
      //                 avatarUrl: res.tempFiles[0].tempFilePath
      //             })
      //         }
      //     })
      // },
      // //上传数据
      // submit(e) {
      //     let user = this.data.user
      //     let filePath = this.data.avatarUrl
      //     let name = this.data.name
      //     if (filePath == user.avatarUrl && name == user.name) {
      //         console.log('头像姓名都没有改变')
      //     } else if (filePath == user.avatarUrl && name != user.name) {
      //         console.log('只改变姓名')
      //         db.collection('users').doc(user._id).update({
      //             data: {
      //                 name: name
      //             }
      //         }).then(res => {
      //             console.log('修改姓名的结果', res)
      //             user.name = name
      //             wx.setStorageSync('user', user)
      //             wx.showToast({
      //                 title: '修改成功',
      //             })
      //         })
      //     } else {
      //         let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      //         wx.cloud.uploadFile({
      //             cloudPath: new Date().getTime() + suffix,
      //             filePath: filePath, // 文件路径
      //         }).then(res => {
      //             // get resource ID
      //             let fileID = res.fileID
      //             console.log("上传结果", fileID)
      //             db.collection('users').doc(user._id).update({
      //                 data: {
      //                     name: name,
      //                     avatarUrl: fileID
      //                 }
      //             }).then(res => {
      //                 console.log('修改姓名和头像的结果', res)
      //                 user.name = name
      //                 user.avatarUrl = fileID
      //                 wx.setStorageSync('user', user)
      //                 wx.showToast({
      //                     title: '修改成功',
      //                 })
      //             })
      //         }).catch(error => {
      //             console.log("上传失败", error)
      //         })
      //     }
      // },









  saveChange() {
      wx.setStorageSync('user', this.data.userInfo);
      //wx.setStorageSync('phone', this.data.phone);
      wx.showToast({
        title: '修改成功',
      })
      wx.switchTab({
        url: '/pages/person/person',
      })
  },
  //修改地址
  updateAddress() {
      wx.navigateTo({
        url: '/pkgB/pages/address/address',
      })
  },
//修改手机号
  // updatePhone(e) {
  //     wx.cloud.callFunction({
  //         name: 'getUserPhone',
  //         data: {
  //             cloudID: e.detail.cloudID,
  //         },
  //         success: (res) => {
  //             this.setData({
  //                 phone: res.result.list[0].data.phoneNumber,
  //             })
  //         }
  //     })
  // },
  //修改昵称
  updateNickName(e) {
     let userxm = this.data.userInfo;
     console.log(e.detail.value)
     userxm.nickName = e.detail.value;
     this.setData({
         userInfo:userxm,
     })
  },
  //修改头像
  updateAvatar() {
      let usertx = this.data.userInfo;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          wx.showLoading({
            title: '加载中',
          })
          const random = Math.floor(Math.random() * 1000);
          wx.cloud.uploadFile({
              cloudPath: `avatar/${this.data.userInfo.nickName}-${random}.png`,
              filePath: res.tempFilePaths[0],
              success: (res) => {
                  let fileID = res.fileID;
                  usertx.avatarUrl = fileID;
                  this.setData({
                      userInfo:usertx,
                  })
                  wx.hideLoading()
              }
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var user = wx.getStorageSync('users')
    // console.log('user', user)
    // console.log('user.name', user.name)
    // if (user && user.name) {
    //     this.setData({
    //         user: user,
    //         name: user.name,
    //         avatarUrl: user.avatarUrl
    //     })
    // }






      const userxx = wx.getStorageSync('user');
      //const phone = wx.getStorageSync('phone');
      this.setData({
          userInfo:userxx,
         // phone,
      })
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
