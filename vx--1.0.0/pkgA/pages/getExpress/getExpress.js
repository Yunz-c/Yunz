import {
  getTimeNow
} from '../../../utils/index'; //导入时间戳
const db = wx.cloud.database();

Page({
  data: {
    // 快递类型列表
    typeList: [{
        name: '无效码',
        money: 0,
      },
      {
        name: '小件',
        money: 2,
      },
      {
        name: '中件',
        money: 4,
      },
      {
        name: '大件',
        money: 6,
      }
    ],
    //用户头像
    userimg:[],
    // 当前选中的快递类型索引
    typeNow: 0,
    //快递大小--------------------------------1
    typeNowlist: '空',
    // 快递商家列表
    businessArray: ['韵达快递', '圆通速递', '中通快递', '申通快递', '百世快递', '顺丰快递', '极兔快递', '中国邮政'],
    businessNow: 0,
    // 快递商家名称----------------------------2
    business: '空',
    // 总价-------------------------------------------3
    totalPrice: 0,
    // 收件地址,楼栋+房间号，例如：太阳座306--------------------------4
    address: '',
    //下单人姓名------------------------------5
    name: '',
    // 用户手机号，地址信息里的手机号---------------------------------6
    phone: '',
    // 存储完整的取件码列表
    pickupCodes: [],
    // 快递取件码------------------------------------7
    expressCode: '',
    // 备注信息-------------------------8
    remark: '',
    money: 0,
    // 取件码开头部分
    firstPart: '',
    // 取件码中间部分
    secondPart: '',
    // 取件码末尾部分
    thirdPart: '',
  },

  // 处理取件码开头部分输入事件
  onFirstPartInput(e) {
    const value = e.detail.value;
    if (/^\d+$/.test(value)) {
      this.setData({
        firstPart: value,
      });
      // 检查快递公司
      this.pkbusinessIndex();
    } else {
      // 显示错误提示或进行其他处理
      wx.showToast({
        icon: 'none',
        title: '开头不能为空！',
      });
    }
    const sum = this.calculateTotalPrice()
    this.setData({
      totalPrice: sum
    })
  },

  //取件码中件部分
  onSecondPartInput(e) {
    const value = e.detail.value;
    if (/^\d+$/.test(value)) {
      this.setData({
        secondPart: value,
      });
      //检查快递大小
      this.pksizeindex()
    } else {
      // 显示错误提示或进行其他处理
      wx.showToast({
        icon: 'none',
        title: '中间不能为空！',
      });
    }
    const sum = this.calculateTotalPrice()
    this.setData({
      totalPrice: sum
    })
  },

  // 处理取件码末尾部分输入事件
  onThirdPartInput(e) {
    const value = e.detail.value;
    if (/^\d+$/.test(value)) {
      this.setData({
        thirdPart: value,
      });
      this.qjm()
      console.log('取件码多少？？？', this.data.expressCode)
    } else {
      // 显示错误提示或进行其他处理
      wx.showToast({
        icon: 'none',
        title: '末尾不能为空！',
      });
    }
    const sum = this.calculateTotalPrice()
    this.setData({
      totalPrice: sum
    })
  },

  //存放完整取件码
  qjm() {
    const first = this.data.firstPart;
    const second = this.data.secondPart;
    const third = this.data.thirdPart;
    if (first && second && third) {
      // 组合成完整的取件码格式，如xxx - xx - xxx
      const combinedCode = `${first}-${second}-${third}`;
      if (!this.data.pickupCodes) {
        this.setData({
          pickupCodes: []
        });
      }
      this.data.pickupCodes = []
      this.data.pickupCodes.push(combinedCode);
      this.setData({
        expressCode: this.data.pickupCodes
      });
    }
  },

  //添加取件码事件
  addpkg() {
    this.setData({
      firstPart: '',
      secondPart: '',
      thirdPart: ''
    });
  },

  // 更新快递大、中、小件信息
  pksizeindex() {
    const size = this.determineParcelSize();
    console.log('什么件：', size)
    const typeList = this.data.typeList;
    console.log('类型列表', typeList)
    const typeNow = typeList.findIndex(item => item.name === size); //遍历数组，满足就返回索引，不满足返回-1
    console.log('类型索引', typeNow)
    if (typeNow !== -1) {
      this.setData({
        typeNow: typeNow,
        money: typeList[typeNow].money,
        typeNowlist: typeList[typeNow].name
      });
      console.log('判断的件：', this.data.typeNowlist)
    }
  },

  //更新快递公司信息
  pkbusinessIndex() {
    const bsn = this.pkbusiness();
    console.log('什么公司：', bsn)
    const businesslist = this.data.businessArray;
    console.log('公司列表', businesslist)
    const businessNow = businesslist.findIndex(item => item === bsn); //遍历数组，满足就返回索引，不满足返回-1
    console.log('公司索引', businessNow)
    if (businessNow !== -1) {
      this.setData({
        businessNow: businessNow,
        business: businesslist[businessNow]
      });
      console.log('判断的公司：', this.data.business)
    }
  },

  pkbusiness() {
    const first = this.data.firstPart;
    // 将开头部分转换为数字
    const firstNumber = parseInt(first);
    // 如果开头数字在 60 到 80 之间，说明是京东快递
    if (firstNumber >= 1 && firstNumber <= 30) {
      return '顺丰快递';
    } else if (firstNumber >= 40 && firstNumber <= 50) {
      return '韵达快递';
    } else if (firstNumber >= 60 && firstNumber <= 80) {
      return '京东快递';
    } else if (firstNumber >= 90 && firstNumber <= 130) {
      return '中通快递';
    } else {
      return '其他';
    }
  },

  // 判断快递大、中、小件类型的函数
  determineParcelSize() {
    const first = parseInt(this.data.firstPart);
    const second = parseInt(this.data.secondPart);
    console.log(first)
    console.log(second)
    if (first >= 1 && first <= 30) {
      if (
        (second === 1 || second === 2)
      ) {
        return '大件';
      } else if (
        (second === 3 || second === 4)
      ) {
        return '中件';
      } else {
        return '小件';
      }
    } else if (first >= 40 && first <= 50) {
      if (
        (second === 1 || second === 2)
      ) {
        return '大件';
      } else if (
        (second === 3 || second === 4)
      ) {
        return '中件';
      } else {
        return '小件';
      }
    } else if (first >= 60 && first <= 80) {
      if (
        (second === 1 || second === 2)
      ) {
        return '大件';
      } else if (
        (second === 3 || second === 4)
      ) {
        return '中件';
      } else {
        return '小件';
      }
    } else if (first >= 90 && first <= 130) {
      if (
        (second === 1 || second === 2)
      ) {
        return '大件';
      } else if (
        (second === 3 || second === 4)
      ) {
        return '中件';
      } else if (second === 5 || second === 6 || second === 7) {
        return '小件';
      } else {
        return '无效码'
      }
    } else {
      return '无效码';
    }
  },

  // 上传订单信息到数据库
  submit() {
    const that = this.data;
    // 检查收件地址、快递商家、取件码是否都填写了
    if (!that.address || !that.business || !that.expressCode) {
      wx.showToast({
        icon: 'none',
        title: '您填写的信息不全',
      });
      return;
    }

    db.collection('order').add({

      data: {
        // 下单人名称1
        name: that.name,
        // 当前时间
        time: getTimeNow(),
        // 订单金额2
        money: Number(that.totalPrice),
        // 订单状态
        state: '待接单',
        // 收件地址,楼栋+房间号3
        address: that.address,
        // 快递大小4
        size: that.typeNowlist,
        // 快递商家5
        business: that.business,
        // 取件码6
        expressCode: that.expressCode,
        // 备注7
        remark: that.remark,
        // 用户手机号8
        phone: that.phone,
        //头像
        userInfo:that.userimg,
        // 服务器时间
        createTime: db.serverDate(),
      },

      success: (res) => {

        // 订单上传成功后的处理，待加支付功能，目前跳转首页并提示发布成功
        wx.switchTab({
          url: '/pages/index/index',
        });
        wx.showToast({
          title: '下单成功',
        });

      }

    });
  },

  //备注信息事件
  getRemark(e) {
    this.setData({
      remark: e.detail.value
    })
  },


  // 跳转地址页面路径
  selectAddress() {
    wx.navigateTo({
      url: '/pkgB/pages/address/address',
    })
  },

  //计算价格
  calculateTotalPrice() {
    const {
      typeList,
      typeNow,
    } = this.data;
    const basePrice = typeList[typeNow].money;
    const totalPrice = basePrice;
    return totalPrice;
  },




  /**
   * 生命周期函数--监听页面加载=================-----------------------==================
   * ---------------------------===================================================-------------------------------------
   */



  onLoad: function (options) {
    console.log('?????',options)
    const address = wx.getStorageSync('addressNow');
    console.log('本地地址信息', address)
    const userxx = wx.getStorageSync('user')
    console.log('用户缓存信息',userxx)
    this.setData({
      userimg:userxx.avatarUrl
    })
    this.setData({
      name: address.name,
    });
    console.log('获取的姓名', this.data.name)

    if (address) {
      //首先，获取楼栋+房间号
      const {
        build,
        houseNumber
      } = address;
      this.setData({
        address: `${build}-${houseNumber}`
      });
      // 然后，从地址中获取手机号码
      const phoneFromAddress = address.phone;
      console.log('本地手机号', phoneFromAddress)
      this.setData({
        phone: phoneFromAddress || '',
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
    wx.switchTab({
      url: '/pages/index/index', //返回首页
    })
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