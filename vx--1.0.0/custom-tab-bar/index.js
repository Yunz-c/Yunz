import { action } from 'mobx-miniprogram';
import {
  storeBindingsBehavior
} from 'mobx-miniprogram-bindings'
import {
  store
} from '../store/store'

Component({

  options: {
    styleIsolation: 'shared' //显示徽标
  },
  behaviors:[storeBindingsBehavior],
  storeBindings:{
    store,
    fields:{
      active:'activeTabBarIndex',      //映射store的active值
    },
    actions:{             //绑定方法
      updateActive:'updateActiveTabBarIndex'
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    "list": [{
        "text": "首页",
        "pagePath": "/pages/index/index",
        "iconPath": "/images/index.png",
        "selectedIconPath": "/images/index_fill.png"
      },
      {
        "text": "订单",
        "pagePath": "/pages/order/order",
        "iconPath": "/images/order.png",
        "selectedIconPath": "/images/order_fill.png",
        info: 0
      },
      {
        "text": "我的",
        "pagePath": "/pages/person/person",
        "iconPath": "/images/person.png",
        "selectedIconPath": "/images/person_fill.png"
      }
    ]
  },



  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      //console.log(event.detail);     //选中时索引值
      //this.setData({active:event.detail})  
      this.updateActive(event.detail)
      wx.switchTab({
        url:this.data.list[event.detail].pagePath,
      })     
    },
  }
})