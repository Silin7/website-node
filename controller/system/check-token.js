/*
 * @Description: 判断是否登录
 * @Author: Silin7
 * @Date: 2022-08-27
 */

const generateToken = require("./generate-token");

// 根据请求头里面是否有"token"判断是否登录
module.exports = async function (parameter) {
  try {
    // 参数类型检查
    if (!parameter || typeof parameter !== 'object') {
      return false;
    }

    // 获取token
    let token = parameter.token;

    // 如果没有从参数中获取到token，尝试从headers中获取
    if (!token && parameter.headers) {
      token = parameter.headers['token'] || parameter.headers['authorization'];
    }

    // 如果token仍然为空，返回false
    if (!token) {
      return false;
    }

    // 验证token格式（基本检查）
    if (typeof token !== 'string' || !token.includes('.')) {
      return false;
    }

    // 解析token
    let decoded = await generateToken.verToken(token);

    if (!decoded) {
      return false;
    }

    return decoded.userId;
  } catch (error) {
    return false;
  }
};
