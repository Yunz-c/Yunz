Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 默认地址状态，初始值为 true
    //defalutAddress: true,
    // 楼栋信息，初始为空字符串
    build: '',
    // 房间号信息，初始为空字符串
    houseNumber: '',
    // 收件人姓名信息，初始为空字符串
    name: '',
    // 收件人电话号码信息，初始为空字符串
    phone: '',
    // 默认地址是否为编辑状态，初始值为 false
    //isEdit: false,
    // 当前是否正在编辑，初始值为 false
    editNow: false,
    area:'',
    // 填写手机号报错状态，初始值为 false
    phoneError: false
  },


  // 保存地址的函数
  saveAddress() {
    // 解构获取页面数据中的各个变量
    const {
      //defalutAddress,
      build, //楼栋
      houseNumber, // 房间号
      name, //姓名
      phone, //电话
      //isEdit,//默认地址编辑状态
      editNow,//是否正在编辑
      index,//地址索引
      area, //区域信息
    } = this.data;
    console.log('楼栋信息',build)
    console.log('电话信息',houseNumber)
    if (build === undefined) {
      wx.showToast({
        icon: 'none',
        title: '楼栋为空',
      });
    } else if (houseNumber === '') {
      wx.showToast({
        icon: 'none',
        title: '寝室/房间为空',
      });
    } else if (name === '') {
      wx.showToast({
        icon: 'none',
        title: '姓名为空',
      });
    } else if (phone === '') {
      wx.showToast({
        icon: 'none',
        title: '请输入11位手机号',
      });
    } else {
      // 从本地存储中获取已有的地址数据
      let address = wx.getStorageSync('address');
      // 如果 不是编辑状态 且设置为默认地址 且已有地址数据存在
      // if (!isEdit && defalutAddress && address) {
      //   // 遍历已有的地址数据，检查是否已有默认地址
      //   for (let i = 0; i < address.length; i++) {
      //     if (address[i].defalutAddress) {
      //       // 如果已存在默认地址，弹出提示信息并返回
      //       wx.showToast({
      //         icon: 'none',
      //         title: '已存在默认地址!'
      //       });
      //       return;
      //     }
      //   }
      // }
      // 创建一个包含各个地址信息的对象
      const form = {
        build,
        houseNumber,
        name,
        phone,
        //defalutAddress,
        area 
      };
      // 如果地址数据不存在
      if (!address) {
        // 将新地址数据作为数组的第一个元素
        address = [form];
      } else {
        // 如果当前是编辑状态
        if (editNow) {
          // 根据索引更新地址数组中的对应元素
          address[Number(index)] = form;
        } else {
          // 如果不是编辑状态，将新地址数据添加到地址数组中
          address.push(form);
        }
      }
      // 将更新后的地址数据存储到本地存储中
      console.log('保存地址信息成功！！！',address)
      wx.setStorageSync('address', address);
      // 返回上一级页面，delta: 3 表示返回 3 层页面
      // wx.navigateBack({
      //   delta: 1
      // });
      wx.navigateTo({
        url: '/pkgB/pages/address/address',
      })
    }
  },


  // 处理开关状态变化的函数
  // handleChangeSwitch(e) {
  //   // 设置默认地址状态为开关的新值
  //   this.setData({
  //     defalutAddress: e.detail.value
  //   });
  // },

  // 获取楼栋信息的函数
  getbuild(e) {
    this.setData({
      build: e.detail.value
    });
  },

  // 输入手机号的函数
  getPhone(e) {
    const inputValue = e.detail.value;
    // 如果输入正好是 11 位
    if (inputValue.length === 11) {
      this.setData({
        phone: inputValue,
        phoneError: false
      });
    } else if (inputValue.length > 9 && inputValue.length < 11) {
      //弹出提示信息并设置错误提示状态为 true
      wx.showToast({
        title: '请输入 11 位手机号码',
        icon: 'none'
      });
      this.setData({
        phoneError: true
      });
    } else {
      console.log('输入手机号不正确')
    }
  },

  // 获取收件人姓名的函数
  getName(e) {
    this.setData({
      name: e.detail.value
    });
  },

  // 获取寝室号的函数
  getHouseNumber(e) {
    this.setData({
      houseNumber: e.detail.value
    });
  },

  // 选择宿舍楼的函数
  selectBuild() {
    // 跳转到选择宿舍楼页面
    wx.navigateTo({
      url: '/pkgB/pages/selectBuild/selectBuild',
    });
  },



  /**------------------------------=====================================================--------------------------------------
   * 生命周期函数--监听页面加载------------------------================--------------------------
   */


  onLoad: function (options) {
    console.log('要编辑的地址信息',options)
    const {
      build,
      area,
      address,
      index
    } = options;
    this.setData({
      build:build,
      area:area
    })
    console.log('传递过来的地址信息', address)
    console.log('传递过来的地址索引', index)
    // 如果地址页面传递了地址参数
    if (address) {
      console.log('解析出来的地址信息',JSON.parse(address))
      // 解析地址参数中的对象
      const {
        build,
        houseNumber,
        name,
        phone,
        //defalutAddress
      } = JSON.parse(address);
      console.log('index值多少',index)
      // 设置页面数据中的各个值，并将 editNow 设置为 true，表示正在编辑
      this.setData({
        build: build,
        area:area,
        houseNumber:houseNumber,
        name:name,
        phone:phone,
       // defalutAddress,
        index,
        editNow: true,//编辑状态，重要
      });
    } else {
      console.log('空空如也，准备添加地址信息',options)
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