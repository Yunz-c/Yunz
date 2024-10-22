// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const { code } = event

  // 调用微信登录接口，获取 openId 和 sessionKey
  const result = await cloud.callFunction({
    name: 'getOpenIdAndSessionKey',
    data: { code }
  })

  if (!result || !result.openid || !result.session_key) {
    return { error: '获取 openId 和 sessionKey 失败' }
  }

  // 将 openId 和 sessionKey 存储到数据库中
  const userCollection = db.collection('users')
  const user = {
    openId: result.openid,
    sessionKey: result.session_key
  }
  const res = await userCollection.add(user)

  return {
    openId: result.openid,
    sessionKey: result.session_key,
    userId: res._id
  }
}