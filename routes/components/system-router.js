/*
 * @Description: 系统模块路由层
 * @Author: Silin7
 * @Date: 2022-08-03
 */

const express = require("express");
const wxLogin = require("../../controller/system/wx-login");
const pushMessage = require("../../controller/system/push-message");
const uploadFiles = require("../../controller/system/upload-files");

let systemRouter = express.Router();

systemRouter
  .get("/system/wx/login", wxLogin.wxLogin)
  .post("/system/wx/push/message", pushMessage.pushMessage)
  .post("/system/upload/files", uploadFiles.uploadFiles);

module.exports = systemRouter;
