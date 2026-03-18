// 登录凭证校验。通过 wx.login 接口获得临时登录凭证 code 后传到开发者服务器调用此接口完成登录流程。
const wxLogin = (query, request) => {
  return request(
    "GET",
    `https://api.weixin.qq.com/sns/jscode2session?appid=${query.appid}&secret=${query.secret}&js_code=${query.code}&grant_type=${query.grant_type}`,
    {}
  );
};

module.exports = {
  wxLogin,
};
