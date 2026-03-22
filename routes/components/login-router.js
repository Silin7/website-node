/*
 * @Description: 注册，登录模块路由层
 * @Author: Silin7
 * @Date: 2022-08-03
 */

const express = require("express");
const loginModule = require("../../controller/login-module");

let loginRouter = express.Router();

loginRouter
  .get("/login/based/account", loginModule.basedAccount)
  .post("/login/sign/in", loginModule.signInster)
  .post("/login/register/inster", loginModule.registerInster)
  .get("/login/user/information", loginModule.userInformation)
  .post("/login/update/userinfo", loginModule.updateUserInfo)
  .get("/login/check/token", loginModule.checkTokenFunc);

module.exports = loginRouter;
