/*
 * @Description: 认证中间件
 * @Author: Silin7
 * @Date: 2025-12-11
 */

const checkToken = require('./check-token');
const { sendResponse } = require('../utils/response-util');

/**
 * 认证中间件
 * @param {express.Request} req - Express请求对象
 * @param {express.Response} res - Express响应对象
 * @param {function} next - 中间件链的下一个函数
 */
const authMiddleware = async (req, res, next) => {
  try {
    // 从请求头或查询参数中获取token，处理Bearer前缀
    const tokenFromHeader = req.headers['authorization'] ? req.headers['authorization'].replace(/^Bearer\s+/i, '') : undefined;
    const token = req.headers['token'] || tokenFromHeader || req.query.token;

    // 验证token
    const userId = await checkToken({ token });

    if (userId) {
      // 将用户ID添加到请求对象中，方便后续使用
      req.user_id = userId;
      req.openid = userId; // 保持与现有代码的兼容性
      next();
    } else {
      // 认证失败
      sendResponse(res, 401, false, '请登录后操作');
    }
  } catch (error) {
    sendResponse(res, 500, false, '服务器内部错误');
  }
};

/**
 * 可选认证中间件 - 不强制要求认证，但如果提供了有效token则会解析
 * @param {express.Request} req - Express请求对象
 * @param {express.Response} res - Express响应对象
 * @param {function} next - 中间件链的下一个函数
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    // 从请求头或查询参数中获取token
    const token = req.headers['token'] || req.headers['authorization'] || req.query.token;

    if (token) {
      // 验证token
      const userId = await checkToken({ token });

      if (userId) {
        // 将用户ID添加到请求对象中
        req.user_id = userId;
        req.openid = userId;
      }
    }

    // 无论是否有token，都继续执行后续中间件
    next();
  } catch (error) {
    // 发生错误时也继续执行后续中间件
    next();
  }
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware
};
