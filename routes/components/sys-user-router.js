/*
 * @Description: 系统用户模块路由层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const express = require("express");
const sysUserModule = require("../../controller/sys-user-module");

let sysUserRouter = express.Router();

sysUserRouter.post("/add", sysUserModule.addUser);
sysUserRouter.post("/update", sysUserModule.updateUser);
sysUserRouter.post("/delete", sysUserModule.deleteUser);
sysUserRouter.get("/list", sysUserModule.getUserList);
sysUserRouter.get("/detail", sysUserModule.getUserDetail);

module.exports = sysUserRouter;