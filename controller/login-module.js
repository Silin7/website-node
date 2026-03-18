/*
 * @Description: 注册登录模块控制器层
 * @Author: Silin7
 * @Date: 2022-08-03
 */

const loginDao = require("../model/dao/login-dao");
const generateToken = require("./system/generate-token");
const checkToken = require("./system/check-token");
const { sendResponse, sendSuccess, handleError, validateParams, advancedValidate } = require("./utils/response-util");


// 根据openid检索用户信息
const basedOpenid = async (req, res, next) => {
  try {
    const { openid } = req.query;
    if (!advancedValidate(res, { openid }, { openid: { required: true } })) {
      return;
    }

    const result = await loginDao.basedOpenid(openid);
    sendSuccess(res, result[0] || {}, "操作成功");
  } catch (error) {
    handleError(res, error, "检索用户信息失败");
  }
};

// 登录
const signInster = async (req, res, next) => {
  try {
    const { openid, phone } = req.body;
    if (!advancedValidate(res, { openid, phone }, {
      openid: { required: true },
      phone: { required: true }
    })) {
      return;
    }

    const result = await loginDao.signInster(openid, phone);
    const userInfo = result[0] || null;

    if (userInfo) {
      const token = generateToken.setToken(openid);
      sendSuccess(res, { token, userInfo }, "登录成功");
    } else {
      sendResponse(res, 401, false, "未查询到用户信息");
    }
  } catch (error) {
    handleError(res, error, "登录失败");
  }
};

// 注册
const registerInster = async (req, res, next) => {
  try {
    const { openid, phone, nickname, avatar } = req.body;
    if (!advancedValidate(res, { openid, phone, nickname, avatar }, {
      openid: { required: true },
      phone: { required: true },
      nickname: { required: true },
      avatar: { required: false }
    })) {
      return;
    }

    // 注册用户
    await loginDao.registerInster(openid, phone, nickname, avatar);

    const token = generateToken.setToken(openid);
    sendSuccess(res, { token }, "注册成功");
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

    const { openid } = req.query;
    const targetOpenid = openid || Authorization;

    const result = await loginDao.userInformation(targetOpenid);
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
      phone: { required: true },
      nickname: { required: true },
      avatar: { required: true }
    })) {
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
  basedOpenid,
  signInster,
  registerInster,
  userInformation,
  updateUserInfo,
  checkTokenFunc,
};
