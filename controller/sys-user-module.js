/*
 * @Description: 系统用户模块控制器层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const sysUserDao = require("../model/dao/sys-user-dao");
const { sendResponse, sendSuccess, handleError, advancedValidate } = require("./utils/response-util");

module.exports = {
  // 新增用户
  addUser: async (req, res) => {
    try {
      const { username, account, password } = req.body;
      if (!advancedValidate(res, { username, account, password }, {
        username: { required: true },
        account: { required: true },
        password: { required: true }
      })) return;

      try {
        // 检查账号是否已存在
        const existingUser = await sysUserDao.getUserByAccount(account);
        if (existingUser.length > 0) {
          sendResponse(res, 400, false, "账号已存在");
          return;
        }

        const userInfo = {
          username,
          account,
          password
        };

        const result = await sysUserDao.addUser(userInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, { id: result.insertId }, "用户新增成功");
        } else {
          sendResponse(res, 400, false, "用户新增失败");
        }
      } catch (error) {
        handleError(res, error, "用户新增失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 修改用户信息
  updateUser: async (req, res) => {
    try {
      const { id, username, account, password } = req.body;
      if (!advancedValidate(res, { id, username, account, password }, {
        id: { required: true },
        username: { required: true },
        account: { required: true },
        password: { required: true }
      })) return;

      try {
        // 检查账号是否已存在（排除当前用户）
        const existingUser = await sysUserDao.getUserByAccount(account);
        if (existingUser.length > 0 && existingUser[0].id != id) {
          sendResponse(res, 400, false, "账号已存在");
          return;
        }

        const userInfo = {
          id,
          username,
          account,
          password
        };

        const result = await sysUserDao.updateUser(userInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "用户修改成功");
        } else {
          sendResponse(res, 400, false, "用户修改失败");
        }
      } catch (error) {
        handleError(res, error, "用户修改失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 删除用户
  deleteUser: async (req, res) => {
    try {
      const { id } = req.body;
      if (!advancedValidate(res, { id }, {
        id: { required: true }
      })) return;

      try {
        const result = await sysUserDao.deleteUser(id);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "用户删除成功");
        } else {
          sendResponse(res, 400, false, "用户删除失败");
        }
      } catch (error) {
        handleError(res, error, "用户删除失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询用户列表
  getUserList: async (req, res) => {
    try {
      try {
        const result = await sysUserDao.getUserList();
        sendSuccess(res, result, "用户列表查询成功");
      } catch (error) {
        handleError(res, error, "用户列表查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询用户详情
  getUserDetail: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        sendResponse(res, 400, false, "缺少用户ID");
        return;
      }

      try {
        const result = await sysUserDao.getUserById(id);
        if (result.length > 0) {
          sendSuccess(res, result[0], "用户详情查询成功");
        } else {
          sendResponse(res, 404, false, "未找到该用户");
        }
      } catch (error) {
        handleError(res, error, "用户详情查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};