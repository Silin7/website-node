/*
 * @Description: Token模块
 * @Author: Silin7
 * @Date: 2022-05-07
 */

// 导入jsonwebtoken
const jwt = require("jsonwebtoken");
// 本地的密钥，随便定义
const PRIVATE_KEY = "Silin7";
// token过期时间（7天）
const TOKEN_EXPIRATION_TIME = 60 * 60 * 12 * 7;

// 生成token
const setToken = (userId) => {
  // 要生成token的主题信息
  let content = {
    userId,
  };
  // 加密的key（密钥）
  let privateKey = PRIVATE_KEY;
  let token = jwt.sign(content, privateKey, {
    // 过期时间
    expiresIn: TOKEN_EXPIRATION_TIME,
  });

  return token;
};

// 解析token
const verToken = (token) => {
  return new Promise((resolve, reject) => {
    // 加密的key（密钥)
    let privateKey = PRIVATE_KEY;
    jwt.verify(token, privateKey, (err, decode) => {
      if (err) {
        // 验证不通过（token过期或错误）
        resolve(false);
      } else {
        // 验证通过，decode包含主题信息、token过期时间
        resolve(decode);
      }
    });
  });
};

module.exports = {
  setToken,
  verToken,
};
