Page({
  data: {
    tabList: ['宿舍区','教学区'],
    tabNow: 0,
    dormitoryBuildings: ['太阳座', '月亮座', '天星座', '木星座', '金星座', '金牛座', '天马座', '水星座', '土星座', '海星座', '彗星座', '土星座', '金沙 A 座', '金沙 B 座', '金沙 C 座', '金沙 D 座', '国际创意学院学生公寓'],
    buildingNames: ['贡院', '翰院', '闻院', '宏院', '铭院', '华苑', '华院', '杰院', '大剧院', '艺步楼'],
  },

  selectTab(e) {
    console.log('选择了----区域?',e.currentTarget.dataset)
    const id = e.currentTarget.dataset.id;
    this.setData({
      tabNow: id
    });
  },

  DormitoryBuilding(e) {
    const buildingIndex = e.currentTarget.dataset.index;
    const building = this.data.dormitoryBuildings[buildingIndex];
    const area = this.data.tabNow === 0? '宿舍区' : '';
    wx.navigateTo({
      url: `/pkgB/pages/addAddress/addAddress?build=${building}&area=${area}`
    });
  },
  
  EducationBuild(e) {
    const index = e.currentTarget.dataset.index;
    const build = this.data.buildingNames[index];
    const area = this.data.tabNow === 1? '教学区' : '';
    wx.navigateTo({
      url: `/pkgB/pages/addAddress/addAddress?build=${build}&area=${area}`
    });
  },



  //=========-----------================-----------------==========

  onLoad: function (options) {

  },

  onReady: function () { },

  onShow: function () { },

  onHide: function () { },

  onUnload: function () { 

  },

  onPullDownRefresh: function () { },

  onReachBottom: function () { },

  onShareAppMessage: function () { }
});