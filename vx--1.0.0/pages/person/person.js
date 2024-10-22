// const {
//   fail
// } = require("mobx-miniprogram/lib/internal");
const db = wx.cloud.database();
let userxx = {}
Page({
  data: {
    userInfo: {},
    personReceiveState: '',
    admin: false,
  },

  //退出登录
  tuichu() {
    console.log('点击退出')
    wx.showModal({
      title: '确定退出登录',
      content: '',
      complete: (res) => {
        if (res.cancel) {
          console.log('取消')
        }
        if (res.confirm) {
          console.log('确定')
          wx.setStorageSync('user', null)
          this.setData({
            userInfo: null,
          })
        }
      }
    })
  },
  /**
   * 授权获取头像昵称相关
   */


  /**
   * 关闭/打开弹框
   */
  closeTank(e) {
    if (!this.data.userInfo_tank) {
      wx.cloud.database().collection('users')
        .get()
        .then(res => {
          console.log("用户信息====", res);
          if (res.data.length) {
            this.setData({
              userInfo: res.data[0],
              userInfo_tank: false,
            })
            wx.setStorageSync('user', res.data[0]);
            userxx = wx.getStorageSync('user')
            this.howstate()
            console.log('已经有缓存信息', userxx)
            console.log(this.data.userInfo)
          } else {
            console.log("还未注册====", res)
            this.setData({
              userInfo_tank: true
            })
          }
        }).catch(res => {
          console.log('提醒你添加微信云开发users集合表')
        })
    } else {
      this.setData({
        userInfo_tank: false
      })
    }

  },
  /**
   * 获取头像
   */
  onChooseAvatar(e) {
    console.log(e);
    this.setData({
      avatarUrl: e.detail.avatarUrl
    })
  },
  /**
   * 获取用户昵称
   */
  getNickName(e) {
    console.log(e);
    this.setData({
      nickName: e.detail.value
    })
  },

  /**
   * 提交
   */
  submit(e) {
    if (!this.data.avatarUrl) {
      return wx.showToast({
        title: '请选择头像',
        icon: 'error'
      })
    }
    if (!this.data.nickName) {
      return wx.showToast({
        title: '请输入昵称',
        icon: 'error'
      })
    }
    this.setData({
      userInfo_tank: false
    })
    wx.showLoading({
      title: '正在注册',
      mask: 'true'
    })
    let tempPath = this.data.avatarUrl

    let suffix = /\.[^\.]+$/.exec(tempPath)[0];
    console.log(suffix);

    //上传到云存储
    wx.cloud.uploadFile({
      cloudPath: 'userimg/' + new Date().getTime() + suffix, //在云端的文件名称
      filePath: tempPath, // 临时文件路径
      success: res => {
        console.log('上传成功', res)
        let fileID = res.fileID
        wx.hideLoading()
        wx.cloud.database().collection('users')
          .add({
            data: {
              avatarUrl: fileID,
              nickName: this.data.nickName
            }
          }).then(res => {
            let user = {
              avatarUrl: fileID,
              nickName: this.data.nickName
            }
            // 注册成功
            console.log('注册成功')
            wx.setStorageSync('user', user);
            this.setData({
              userInfo: user,
            })
          }).catch(res => {
            console.log('注册失败', res)
            wx.showToast({
              icon: 'error',
              title: '注册失败',
            })
          })

      },
      fail: err => {
        wx.hideLoading()
        console.log('上传失败', res)
        wx.showToast({
          icon: 'error',
          title: '上传头像错误',
        })
      }
    })
  },


  // 跳转审核接单员页面
  orderReceiver() {
    wx.navigateTo({
      url: '/pkgA/pages/orderReceiver/orderReceiver',
    });
  },

  // 跳转申请接单权限
  applyOrder() {
    userxx = wx.getStorageSync('user')
    console.log('点击了申请接单', userxx)
    if (!userxx) {
      wx.showToast({
        icon: 'none',
        title: '请先登录!',
      });
      return;
    }
    const {
      personReceiveState
    } = this.data;
    if (personReceiveState === 'success') {
      wx.showModal({
        title: '提示',
        content: '您已经是接单员了, 请勿重复申请!',
        showCancel: false,
      });
    } else if (personReceiveState === 'fail') {
      wx.showModal({
        title: '提示',
        content: '您之前提交的申请未通过审核, 您可以继续申请, 如有疑问请联系管理员: 1335xxxx872',
        success: (res) => {
          const {
            confirm
          } = res;
          if (confirm) {
            wx.navigateTo({
              url: '/pkgC/pages/applyOrder/applyOrder',
            });
          }
        },
      });
    } else if (personReceiveState === 'loading') {
      wx.showModal({
        title: '提示',
        content: '您之前申请的内容正在审核中, 请耐心等待! 如加急审核请添加管理员微信: 1335xxxx872',
        showCancel: false,
      });
    } else if (personReceiveState === 'null') {
      wx.navigateTo({
        url: '/pkgC/pages/applyOrder/applyOrder',
      });
    }
  },

  // 跳转关于我们界面
  toAbout() {
    wx.navigateTo({
      url: '/pkgC/pages/aboutAs/aboutAs',
    });
  },

  // 复制微信号到剪贴板
  getWXCustomer() {
    wx.setClipboardData({
      data: '1335xxxx872',
      success: () => {
        wx.showToast({
          title: '复制微信成功',
        });
      },
    });
  },

  // 跳转更新用户信息界面
  updateInfo() {
    if (this.data.userInfo.avatarUrl) {
      wx.navigateTo({
        url: '/pkgC/pages/updateInfo/updateInfo',
      });
    }
  },

  // // 获取用户手机号码
  // getPhoneNumber(e) {
  //   wx.cloud.callFunction({
  //     name: 'getUserPhone',
  //     data: {
  //       cloudID: e.detail.cloudID,
  //     },
  //     success: (res) => {
  //       console.log('获取手机号成功', res);
  //       if (res.result && res.result.list && res.result.list.length > 0) {
  //         const phoneNumber = res.result.list[0].data.phoneNumber;
  //         wx.setStorageSync('phone', phoneNumber);
  //       } else {
  //         console.log('获取手机号失败：返回数据格式不正确');
  //       }
  //     },
  //     fail: (err) => {
  //       console.log('获取手机号失败', err);
  //     },
  //   });
  // },


  // 判断当前用户是否是管理员，更新 admin 状态
  getAdminPower() {
    //let personAdminState = '';
    //在管理员集合查找信息        
    const adid = wx.getStorageSync('user')
    console.log('请求本地,管理员？', adid)
    db.collection('admin').where({
        _openid: adid._openid
      })
      .get()
      .then(res=>{
      const {
        data
      } = res;
      if (data.length) {
        console.log('是管理员')
        this.setData({
          admin: !!res.data.length,
        });
      } else {
        console.log("不是管理员")
      }
      })
      .catch(res=>{
        console.log('没有admin数据集合，或者没有登录')
      })
  },

  //判断申请接单状态
  howstate() {
    let personReceiveState = '';
    //在接单员集合查找信息        
    const id = wx.getStorageSync('user')
    console.log('请求本地信息', id)
    db.collection('orderReceive').where({
      _openid: id._openid,
    }).get({
      success: (res) => {
        const {
          data
        } = res;
        if (data.length) {
          console.log('申请接单集合有您的_openid')
          for (let i = 0; i < data.length; i++) {
            if (data[i].state === '审核通过') {
              personReceiveState = 'success';
              break;
            } else if (data[i].state === '审核不通过') {
              personReceiveState = 'fail';
            } else {
              personReceiveState = 'loading';
              break;
            }
          }
        } else {
          console.log("接单员集合还没有您的信息")
          personReceiveState = 'null';
        }
        this.setData({
          personReceiveState,
        });
      }
    })
  },

  //启动页面————————————————---------------=============------------————————————————————

  onLoad: function (options) {
    userxx = wx.getStorageSync('user');
    if (userxx) {
      console.log('进入个人界面', userxx)
      this.setData({
        userInfo: userxx
      })
      this.howstate()
      this.getAdminPower();
    } else {
      console.log('还未登录过', userxx)
    }
  },


  onReady: function () {},
  onShow: function () {
    this.onLoad();
  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  //假设的验证用户信息有效性的方法,头像+昵称
  // checkUserInfoValidity(userInfo) {
  //   return !!userInfo.nickName && !!userInfo.avatarUrl;
  // },
});