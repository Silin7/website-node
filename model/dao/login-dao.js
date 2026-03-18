/*
 * @Description: 登录注册模块业务模型层
 * @Author: Silin7
 * @Date: 2022-08-03
 */

const db = require("../mySQL");

module.exports = {
  // 根据openid检索用户信息
  basedOpenid: async (openid) => {
    let sql = "SELECT * FROM user_info WHERE openid = ?";
    const result = await db.query(sql, [openid]);
    return result;
  },

  // 登录
  signInster: async (openid, phone) => {
    let sql = "SELECT * FROM user_info WHERE openid = ? AND phone = ?";
    return await db.query(sql, [openid, phone]);
  },

  // 注册
  registerInster: async (openid, phone, nickname, avatar) => {
    let sql = "INSERT INTO user_info (openid, phone, nickname, avatar) VALUES (?, ?, ?, ?)";
    const result = await db.query(sql, [openid, phone, nickname, avatar]);
    return result;
  },

  // 获取用户基本信息
  userInformation: async (openid) => {
    // let sql = "SELECT user_info.*, family_member.familyid FROM user_info JOIN family_member ON user_info.openid = family_member.member WHERE user_info.openid = ?";
    let sql = "SELECT * FROM user_info WHERE openid = ?";
    const result = await db.query(sql, [openid]);
    return result;
  },

  // 更新用户信息
  updateUserInfo: async (userInfo) => {
    let sql = "UPDATE user_info SET phone = ?, nickname = ?, avatar = ? WHERE user_info.id = ?";
    const result = await db.query(sql, [userInfo.phone, userInfo.nickname, userInfo.avatar, userInfo.id]);
    return result;
  },

  // 获取用户列表
  getUserList: async () => {
    let sql = "SELECT * FROM user_info";
    const result = await db.query(sql);
    return result;
  },
};
