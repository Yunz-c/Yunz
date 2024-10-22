// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  try {
      const { _id, receivePerson, state } = event.data;
      await db.collection('order').doc(_id).update({
          data: {
              receivePerson,
              state,
          },
      });
      console.log('订单状态更新成功');
      return { success: true };
  } catch (error) {
      console.log('订单状态更新失败：', error);
      return { success: false };
  }
};