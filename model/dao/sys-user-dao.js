/*
 * @Description: 系统用户模块业务模型层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const db = require("../mySQL");

module.exports = {
  // 新增用户
  addUser: async (userInfo) => {
    let sql = "INSERT INTO sys_user(username, account, password) VALUES(?, ?, ?)";
    try {
      const result = await db.query(sql, [
        userInfo.username,
        userInfo.account,
        userInfo.password
      ]);
      return result;
    } catch (error) {
      console.error('新增用户失败:', error);
      throw error;
    }
  },

  // 修改用户信息
  updateUser: async (userInfo) => {
    let sql = "UPDATE sys_user SET username = ?, account = ?, password = ? WHERE id = ?";
    try {
      const result = await db.query(sql, [
        userInfo.username,
        userInfo.account,
        userInfo.password,
        userInfo.id
      ]);
      return result;
    } catch (error) {
      console.error('修改用户失败:', error);
      throw error;
    }
  },

  // 删除用户
  deleteUser: async (id) => {
    let sql = "DELETE FROM sys_user WHERE id = ?";
    try {
      const result = await db.query(sql, [id]);
      return result;
    } catch (error) {
      console.error('删除用户失败:', error);
      throw error;
    }
  },

  // 查询用户列表
  getUserList: async () => {
    let sql = "SELECT * FROM sys_user ORDER BY id DESC";
    try {
      const result = await db.query(sql);
      return result;
    } catch (error) {
      console.error('查询用户列表失败:', error);
      throw error;
    }
  },

  // 根据id查询用户详情
  getUserById: async (id) => {
    let sql = "SELECT * FROM sys_user WHERE id = ? LIMIT 1";
    try {
      const result = await db.query(sql, [id]);
      return result;
    } catch (error) {
      console.error('查询用户详情失败:', error);
      throw error;
    }
  },

  // 根据账号查询用户
  getUserByAccount: async (account) => {
    let sql = "SELECT * FROM sys_user WHERE account = ? LIMIT 1";
    try {
      const result = await db.query(sql, [account]);
      return result;
    } catch (error) {
      console.error('根据账号查询用户失败:', error);
      throw error;
    }
  }
};