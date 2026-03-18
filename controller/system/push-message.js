/*
 * @Description: 订阅消息推送
 * @Author: Silin7
 * @Date: 2022-09-27
 */

const api = require("../../model/system_api/pmsg");
const request = require("../../model/request");
const { appid, secret } = require("../../config");
const { sendResponse, sendSuccess, handleError } = require("../utils/response-util");

// 登录凭证校验
const pushMessage = async (req, res) => {
  try {
    // 消息主体
    const requestData = req.body;

    // 调用微信接口 获取 access_token
    const getAccessToken = await api.getAccessToken(
      {
        appid,
        secret,
      },
      request
    );
    const accessToken = JSON.parse(getAccessToken.body).access_token;

    // 发送消息 三个参数 (消息主体; access_token; request;)
    let sendRes = await api.sendMessage(requestData, accessToken, request);
    sendRes = JSON.parse(sendRes.body);

    if (sendRes.errmsg === "ok") {
      sendSuccess(res, sendRes.errmsg, "消息推送成功");
    } else {
      sendResponse(res, 400, false, sendRes.errmsg, null);
    }
  } catch (error) {
    handleError(res, error, "消息推送失败");
  }
};

module.exports = {
  pushMessage,
};
