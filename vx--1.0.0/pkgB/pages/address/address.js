const db = wx.cloud.database()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 存储地址列表，初始为空数组
    address: [],
  },

  // 选择地址的函数
  selectAddress(e) {
    const { index } = e.currentTarget.dataset;
    const address = this.data.address[index];
    console.log('点击选择的地址',address)
    wx.setStorageSync('addressNow', address);
    wx.navigateBack({
      delta:1,
    })
  },


  // 编辑地址的函数
  edit(e) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.address[index];
    console.log('编辑选择索引的地址',address)
    // 跳转到添加地址页面，并传递当前要编辑的地址和索引
    wx.navigateTo({
      url: `/pkgB/pages/addAddress/addAddress?address=${JSON.stringify(address)}&index=${index}`,
    });
    //在跳转的 URL 中，通过查询参数的方式传递了两个值：address 和 index。其中，address 是通过 JSON.stringify(address) 将地址对象转换为 JSON 字符串后传递的，以便在目标页面中可以解析并使用这个地址数据；index 则直接传递索引值，可能在目标页面中用于对特定地址进行编辑或其他操作。
  },

    // 删除地址的函数
    delete(e) {
      console.log('删除该地址')
      wx.showModal({
        title: '确定删除',
        content: '',
        complete: (res) => {
          if (res.cancel) {
            console.log('取消')
          }
          if (res.confirm) {
            console.log('确定')
            if (Array.isArray(this.data.address)) {
              // 从事件对象中获取要删除的地址的索引
              const index = e.currentTarget.dataset.index;
              // 从数组中删除指定索引的地址
              this.data.address.splice(index, 1);//第一个参数是要删除的元素的起始索引，这里是index；第二个参数是要删除的元素数量，这里是1，表示删除一个元素。
              // 将更新后的地址列表存储到本地存储中
              wx.setStorageSync('address', this.data.address);
              // 提示删除成功
              wx.showToast({
                title: '删除成功',
              });
              // 重新加载页面数据
              this.onLoad();
            } else {
              console.log('地址数据不是数组');
            }
          }
        }
      })
    },

  // 添加地址的函数
  addAddress() {
    // 跳转到添加地址页面
    wx.navigateTo({
      url: '/pkgB/pages/addAddress/addAddress',
    });
  },




  /**============================-------------------------------------------------===================================
   * 生命周期函数--监听页面加载----------------------================----------------------
   */
  onLoad: function (options) {
    const addressFromStorage = wx.getStorageSync('address');
    console.log('从本地获取到的地址：',addressFromStorage)
    // 如果从本地存储中获取的地址是数组
    if (Array.isArray(addressFromStorage)) {
      // 更新页面数据中的地址列表，确保每个地址对象中有 phone 属性，若没有则设置为空字符串
      console.log('地址信息====>>>>',addressFromStorage.map(item => ({
        ...item})))
      this.setData({
        address: addressFromStorage.map(item => ({
         ...item,
        })),
      });
    } else {
      // 如果从本地存储中获取的地址不是数组，打印错误信息
      console.log('地址数据不是数组');
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
    // 页面显示时，从本地存储中获取地址列表并更新页面数据
    this.setData({
      address: wx.getStorageSync('address')
    });
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