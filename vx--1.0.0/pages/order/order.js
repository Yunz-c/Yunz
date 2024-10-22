const db = wx.cloud.database();

Page({
  data: {
    userList: ['全部订单', '已退款'],
    tabList: ['待接单', '待取件', '待派送', '已完成'], 
    tabNow: 0,
    orderList: [], //待接单
    myOrder: [],    //我的订单
    rewardOrder: [], //赏金
    helpOrder: [], //
    riderOrder: [], //骑手订单

    acceptedRiderOrders: [],
    openid: '',
    canReceive: false, //是否能接单
    helpTotalNum: 0,
    helpTotalMoeny: 0,
    selectedAddressIndex: null,
  },


  // 选择标签页
  selectTab(e) {
    const {
      id
    } = e.currentTarget.dataset;
    // 设置当前选中的标签页索引
    this.setData({
      tabNow: id,
    });
    // 根据不同的标签页索引执行不同的加载数据方法
    if (id === 0) {
      this.onLoad();
    } else if (id === 1) {
      this.getMyOrder();
    } else if (id === 2) {
      this.handleAwaitingPickupTask();
    } else if (id === 3) {
      this.prepareForPendingDelivery();
    }
  },


  // 删除订单
  deleteOrder(e) {
    // 显示加载提示
    wx.showLoading({
      title: '处理中',
    });
    const {
      id
    } = e.currentTarget.dataset;
    // 调用云函数删除订单
    wx.cloud.callFunction({
      name: 'deleteOrder',
      data: {
        _id: id,
      },
      success: () => {
        // 删除成功后提示并重新获取我的订单列表
        wx.showToast({
          title: '删除成功',
        });
        this.getMyOrder();
        // 隐藏加载提示
        wx.hideLoading();
      },
      fail: () => {
        // 删除失败后提示并隐藏加载提示
        wx.showToast({
          icon: 'none',
          title: '删除失败',
        });
        wx.hideLoading();
      }
    });
  },

  // 拨打电话
  callPhone(e) {
    const addressPage = getCurrentPages().find(page => page.route === '/pkgB/pages/address/address');
    if (addressPage) {
      // 假设 selectedIndex 是从某个地方获取的地址索引
      const selectedIndex = this.data.selectedAddressIndex;
      const phoneFromAddress = addressPage.getAddressPhoneNumber(selectedIndex);
      if (phoneFromAddress) {
        // 调用微信拨打电话接口
        wx.makePhoneCall({
          phoneNumber: phoneFromAddress,
        });
      } else {
        // 如果没有获取到电话号码，提示错误
        wx.showToast({
          icon: 'none',
          title: '电话号码错误或不存在',
        });
      }
    }
  },


  //获取待接单订单
  handlePendingOrderReceipt(){

  },


  // 获取待取件订单
  handleAwaitingPickupTask() {
    // 显示加载提示
    wx.showLoading({
      title: '加载中',
    });
    // 查询数据库获取当前用户的帮助订单信息
    db.collection('orderReceive').where({
      _openid: wx.getStorageSync('openid')
    }).get({
      success: (res) => {
        const {
          data
        } = res;
        // 设置帮助订单的总金额和总单数
        this.setData({
          helpTotalMoeny: data[0].allMoney,
          helpTotalNum: data[0].allCount
        });
        if (data[0].allOrder && data[0].allOrder.length > 0) {
          // 对帮助订单按时间倒序排序
          data[0].allOrder.sort((a, b) => b.createTime - a.createTime);
          this.setData({
            helpOrder: data[0].allOrder,
          });
        } else {
          this.setData({
            helpOrder: [],
          });
        }
        // 隐藏加载提示
        wx.hideLoading();
      }
    });
  },

  // 我帮助的订单单数总和
  getHelpTotalNum() {
    // 查询数据库获取当前用户已完成的帮助订单总数
    db.collection('order').where({
      receivePerson: wx.getStorageSync('openid'),
      state: '已完成'
    }).count({
      success: (res) => {
        console.log(res);
        this.setData({
          helpTotalNum: res.total
        });
      }
    });
  },

  // 我帮助的订单金额总和
  getHelpTotalMoney() {
    const $ = db.command.aggregate;
    // 使用聚合操作查询数据库获取当前用户已完成的帮助订单总金额
    db.collection('order').aggregate().match({
      receivePerson: wx.getStorageSync('openid'),
      state: '已完成',
    }).group({
      _id: null,
      totalNum: $.sum('$money'),
    }).end({
      success: (res) => {
        console.log(res);
        this.setData({
          helpTotalMoeny: res.list[0].totalNum
        });
      }
    });
  },

  // 获取待派送订单
  prepareForPendingDelivery() {
    // 显示加载提示
    wx.showLoading({
      title: '加载中',
    });
    // 查询数据库获取已接单状态的订单信息
    db.collection('order').where({
      state: '已接单'
    }).orderBy('createTime', 'desc').get({
      success: (res) => {
        const {
          data
        } = res;
        const formattedOrders = data.map((item) => {
          if (item.name === "快递代取" && item.info.expressCode) {
            item.expressCode = item.info.expressCode;
          }
          if (item.name === "快递代取" && item.info.codeImg) {
            item.codeImg = item.info.codeImg;
          }
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
          const addressPage = getCurrentPages().find(page => page.route === '/pkgB/pages/address/address');
          if (addressPage) {
            const selectedIndex = this.data.selectedAddressIndex;
            item.phoneNumberFromAddress = addressPage.getAddressPhoneNumber(selectedIndex);
          }
          return item;
        });
        // 检查当前用户是否为骑手并过滤订单，同时判断订单接收人是否为当前用户
        const isRider = this.data.canReceive;
        const visibleOrders = isRider ? formattedOrders.filter(item => item.receivePerson === this.data.openid) : [];
        this.setData({
          acceptedRiderOrders: visibleOrders,
        });
        if (!isRider) {
          // 如果不是骑手，提示用户
          wx.showToast({
            icon: 'none',
            title: '您还不是骑手！',
          });
        }
        // 隐藏加载提示
        wx.hideLoading();
      }
    });
  },

  // 获取我的订单信息
  getMyOrder() {
    // 显示加载提示
    wx.showLoading({
      title: '加载中',
    });
    // 查询数据库获取当前用户的订单信息
    db.collection('order').orderBy('createTime', 'desc').where({
      _openid: this.data.openid
    }).get({
      success: (res) => {
        const {
          data
        } = res;
        data.forEach(item => {
          if (item.name === "快递代取" && item.info.expressCode) {
            item.expressCode = item.info.expressCode;
          }
          if (item.name === "快递代取" && item.info.codeImg) {
            item.codeImg = item.info.codeImg;
          }
          item.info = this.formatInfo(item);
          item.stateColor = this.formatState(item.state);
          // 获取地址页面的手机号码并设置到订单信息中
          const addressPage = getCurrentPages().find(page => page.route === '/pkgB/pages/address/address');
          if (addressPage) {
            const selectedIndex = this.data.selectedAddressIndex;
            item.phoneNumberFromAddress = addressPage.getAddressPhoneNumber(selectedIndex);
          }
        });
        this.setData({
          myOrder: data,
        });
        // 隐藏加载提示
        wx.hideLoading();
      }
    });
  },

  // 点击接单
  orderReceive(e) {
    if (this.data.canReceive) {
      // 如果可以接单，显示加载提示
      wx.showLoading({
        title: '加载中',
      });
      const {
        item
      } = e.currentTarget.dataset;
      const {
        _id
      } = item;
      // 调用云函数更新订单状态和接收人信息
      wx.cloud.callFunction({
        name: 'updateReceive',
        data: {
          _id,
          receivePerson: this.data.openid,
          state: "已接单"
        },
        success: (res) => {
          if (this.data.tabNow === 0) {
            // 根据当前标签页重新加载数据
            this.onLoad();
          } else {
            this.prepareForPendingDelivery();
          }
          // 隐藏加载提示
          wx.hideLoading();
        },
        fail: (err) => {
          console.log(err);
        }
      });
    } else {
      // 如果不能接单，提示用户申请成为接单员
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '您目前不是接单员, 请前往个人中心申请成为接单员!'
      });
    }
  },
  async toFinish(e) {
    // 显示加载提示
    wx.showLoading({
      title: '加载中',
    });
    const {
      item
    } = e.currentTarget.dataset;
    const {
      _id: orderID,
      receivePerson,
      money
    } = item;
    // 查询数据库获取当前用户的订单接收信息
    const result = await db.collection('orderReceive').where({
      _openid: receivePerson
    }).get();
    let data = result.data[0];
    data.allMoney += money;
    data.allCount += 1;
    item.state = '已完成';
    item.stateColor = this.formatState(item.state);
    data.allOrder.push(item);
    const {
      _id,
      allCount,
      allMoney,
      allOrder
    } = data;
    // 调用云函数更新订单接收信息
    await wx.cloud.callFunction({
      name: 'updateReceiver',
      data: {
        _id,
        allMoney,
        allCount,
        allOrder
      },
    });
    // 更新订单状态为已完成
    await db.collection('order').doc(orderID).update({
      data: {
        state: '已完成'
      }
    });
    this.getMyOrder();
    // 隐藏加载提示
    wx.hideLoading();
  },

  // 格式化订单信息
  formatInfo(orderInfo) {
    const {
      name,
      info
    } = orderInfo;
    if (name === '快递代取') {
      const {
        business,
        expectGender,
        expectTime,
        number,
        remark,
        size
      } = info;
      let orderInfo = '';
      orderInfo += '快递类型：' + size + '\n';
      orderInfo += '快递数量：' + number + '\n';
      orderInfo += '快递商家：' + business + '\n';
      orderInfo += '期望送达：' + expectTime + '\n';
      orderInfo += '性别限制：' + expectGender + '\n';
      orderInfo += '备注：' + remark + '  ';
      return orderInfo;
    }
  },

  // 根据订单状态设置状态颜色
  formatState(state) {
    if (state === '待接单') {
      return 'top_right';
    } else if (state === '已接单') {
      return 'top_right_help';
    } else if (state === '已完成') {
      return 'top_right_finish';
    }
  },

  // 获取用户是否有接单权限
  getPersonPower() {
    db.collection('orderReceive').where({
      _openid: wx.getStorageSync('openid'),
      state: '审核通过'
    }).get({
      success: (res) => {
        this.setData({
          canReceive: !!res.data.length
        });
      }
    });
  },

  // 显示快递取件码图片
  // showCodeImg(e) {
  //   const { item: { codeImg, state, receivePerson } } = e.currentTarget.dataset;
  //   console.log(codeImg, state, receivePerson);
  //   if (state!== '已接单' || receivePerson!== this.data.openid) {
  //     // 如果状态不满足或者接收人不是当前用户，提示无权查看
  //     wx.showToast({
  //       icon: 'none',
  //       title: '无权查看!',
  //     });
  //     return;
  //   }
  //   // 预览图片
  //   wx.previewImage({
  //     urls: [codeImg],
  //   });
  // },



  //页面开始   ========================-----------------=================---------------------===========================

  onLoad: function (options) {
    console.log('???????',options)
    wx.showLoading({
      title: '加载中',
    });
    // 获取用户是否有接单权限
    this.getPersonPower();//接单状态true/false

    db.collection('order').orderBy('createTime', 'desc').get({
      success: (res) => {
        const {
          data
        } = res;

        console.log('获得订单信息', data);
        data.forEach(item => {   //forEach 是数组的一个方法，它接受一个回调函数作为参数。这个回调函数会在数组的每个元素上被调用一次。
          // if (item.name === name && item.expressCode) {
          //   item.expressCode = item.expressCode;
          // }
          item.info = this.formatInfo(item);  //自己定义的更改订单信息方法
          item.stateColor = this.formatState(item.state);    //自己定义的改变状态方法
        });

        this.setData({
          orderList: data,
          openid: wx.getStorageSync('openid')//获取本地自身id
        });
        // 隐藏加载提示
        wx.hideLoading();
      },
      fail: (res) => {
        console.log(res)
        // 查询失败后提示并隐藏加载提示
        wx.showToast({
          icon: 'none',
          title: '服务器异常~~~',
        });
        wx.hideLoading();
      }
    });
  },

  onUnload: function () {

  },

  onReady: function () {},

  onShow: function () {
    this.onLoad();
  },
  onHide: function () {},

  //下拉刷新
  onPullDownRefresh: function () {

  },

  //页面触底
  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  }
});