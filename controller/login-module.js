/*
 * @Description: 注册登录模块控制器层
 * @Author: Silin7
 * @Date: 2022-08-03
 */

const loginDao = require("../model/dao/login-dao");
const generateToken = require("./system/generate-token");
const checkToken = require("./system/check-token");
const { sendResponse, sendSuccess, handleError, validateParams, advancedValidate } = require("./utils/response-util");


// 根据账号检索用户信息
const basedAccount = async (req, res, next) => {
  try {
    const { account } = req.query;
    if (!advancedValidate(res, { account }, { account: { required: true } })) {
      return;
    }

    const result = await loginDao.basedAccount(account);
    sendSuccess(res, result[0] || {}, "操作成功");
  } catch (error) {
    handleError(res, error, "检索用户信息失败");
  }
};

// 登录
const signInster = async (req, res, next) => {
  try {
    const { account, password } = req.body;
    if (!advancedValidate(res, { account, password }, {
      account: { required: true },
      password: { required: true }
    })) {
      return;
    }

    const result = await loginDao.signInster(account, password);
    const userInfo = result[0] || null;

    if (userInfo) {
      const token = generateToken.setToken(account);
      sendSuccess(res, { token, userInfo }, "登录成功");
    } else {
      sendResponse(res, 401, false, "账号或密码错误");
    }
  } catch (error) {
    handleError(res, error, "登录失败");
  }
};

// 注册
const registerInster = async (req, res, next) => {
  try {
    const { username, account, password } = req.body;

    // 检查账号是否已存在
    const existingUser = await loginDao.basedAccount(account);

    if (existingUser.length > 0) {
      sendResponse(res, 400, false, "账号已存在");
      return;
    }

    // 注册用户
    await loginDao.registerInster(username, account, password);

    sendSuccess(res, null, "注册成功");
  } catch (error) {
    handleError(res, error, "注册失败");
  }
};

// 用户基本信息
const userInformation = async (req, res, next) => {
  try {
    const Authorization = await checkToken(req.headers);
    if (!Authorization) {
      return sendResponse(res, 401, false, "请登录后操作");
    }

    const { id } = req.query;
    if (!id) {
      sendResponse(res, 400, false, "缺少用户ID");
      return;
    }

    const result = await loginDao.userInformation(id);
    if (result.length > 0) {
      sendSuccess(res, result[0], "操作成功");
    } else {
      sendResponse(res, 404, false, "未查询到用户信息");
    }
  } catch (error) {
    handleError(res, error, "获取用户信息失败");
  }
};

// 更新用户信息
const updateUserInfo = async (req, res, next) => {
  try {
    const Authorization = await checkToken(req.headers);
    if (!Authorization) {
      return sendResponse(res, 401, false, "请登录后操作");
    }

    const params = req.body;
    if (!advancedValidate(res, params, {
      id: { required: true },
      username: { required: true },
      account: { required: true },
      password: { required: true }
    })) {
      return;
    }

    // 检查账号是否已存在（排除当前用户）
    const existingUser = await loginDao.basedAccount(params.account);
    if (existingUser.length > 0 && existingUser[0].id != params.id) {
      sendResponse(res, 400, false, "账号已存在");
      return;
    }

    await loginDao.updateUserInfo(params);
    sendSuccess(res, null, "操作成功");
  } catch (error) {
    handleError(res, error, "更新用户信息失败");
  }
};

// 检验token是否有效
const checkTokenFunc = async (req, res, next) => {
  try {
    const Authorization = await checkToken(req.headers);
    sendSuccess(res, Authorization ? true : false, "操作成功");
  } catch (error) {
    handleError(res, error, "检验token失败");
  }
};

module.exports = {
  basedAccount,
  signInster,
  registerInster,
  userInformation,
  updateUserInfo,
  checkTokenFunc,
};
