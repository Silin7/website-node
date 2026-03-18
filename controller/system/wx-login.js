/*
 * @Description: 登录凭证校验
 * @Author: Silin7
 * @Date: 2022-08-27
 */

const api = require("../../model/system_api/login");
const request = require("../../model/request");
const { appid, secret } = require("../../config");
const { handleError } = require("../utils/response-util");

// 登录凭证校验
const wxLogin = async (req, res) => {
  try {
    const query = Object.assign(
      {
        appid,
        secret,
        grant_type: "authorization_code",
      },
      req.query
    );
    const answer = await api.wxLogin(query, request);
    res.status(answer.status).send(answer.body);
  } catch (answer) {
    handleError(res, answer, "登录凭证校验失败");
  }
};

module.exports = {
  wxLogin,
};
