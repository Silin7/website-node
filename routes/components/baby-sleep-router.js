/*
 * @Description: 宝宝睡眠记录模块路由层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const express = require("express");
const path = require("path");
const babySleepModule = require("../../controller/baby-sleep-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let babySleepRouter = express.Router();

// 为整个宝宝睡眠路由组添加前缀和认证中间件
babySleepRouter.use("/baby-sleep", authMiddleware);

// 新增睡眠记录
babySleepRouter.post("/baby-sleep/add", babySleepModule.addBabySleep);
// 修改睡眠记录
babySleepRouter.post("/baby-sleep/update", babySleepModule.updateBabySleep);
// 删除睡眠记录
babySleepRouter.post("/baby-sleep/delete", babySleepModule.deleteBabySleep);
// 查询睡眠记录列表
babySleepRouter.get("/baby-sleep/list", babySleepModule.getBabySleepList);
// 查询睡眠记录详情
babySleepRouter.get("/baby-sleep/detail", babySleepModule.getBabySleepDetail);

module.exports = babySleepRouter;
