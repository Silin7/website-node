// 获取小程序全局唯一后台接口调用凭据（access_token）。调用绝大多数后台接口时都需使用 access_token，开发者需要进行妥善保存。
const getAccessToken = (query, request) => {
  return request(
    "GET",
    `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${query.appid}&secret=${query.secret}`,
    {}
  );
};

// 调用微信接口，给用户发送消息
const sendMessage = (requestData, access_token, request) => {
  return request(
    "POST",
    `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${access_token}`,
    requestData
  );
};

module.exports = {
  getAccessToken,
  sendMessage,
};
