/*
 * @Description: 登录注册模块业务模型层
 * @Author: Silin7
 * @Date: 2022-08-03
 */

const db = require("../mySQL");

module.exports = {
  // 根据账号检索用户信息
  basedAccount: async (account) => {
    let sql = "SELECT * FROM sys_user WHERE account = ?";
    const result = await db.query(sql, [account]);
    return result;
  },

  // 登录
  signInster: async (account, password) => {
    let sql = "SELECT * FROM sys_user WHERE account = ? AND `password` = ?";
    return await db.query(sql, [account, password]);
  },

  // 注册
  registerInster: async (username, account, password) => {
    let sql = "INSERT INTO sys_user (username, account, `password`) VALUES (?, ?, ?)";
    const result = await db.query(sql, [username, account, password]);
    return result;
  },

  // 获取用户基本信息
  userInformation: async (id) => {
    let sql = "SELECT * FROM sys_user WHERE id = ?";
    const result = await db.query(sql, [id]);
    return result;
  },

  // 更新用户信息
  updateUserInfo: async (userInfo) => {
    let sql = "UPDATE sys_user SET username = ?, account = ?, `password` = ? WHERE id = ?";
    const result = await db.query(sql, [userInfo.username, userInfo.account, userInfo.password, userInfo.id]);
    return result;
  },

  // 获取用户列表
  getUserList: async () => {
    let sql = "SELECT * FROM sys_user";
    const result = await db.query(sql);
    return result;
  },
};
