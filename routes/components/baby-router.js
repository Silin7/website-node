/*
 * @Description: 宝宝信息模块路由层
 * @Author: Silin7
 * @Date: 2025-04-07
 */

const express = require("express");
const path = require("path");
const babyModule = require("../../controller/baby-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let babyRouter = express.Router();

// 为整个宝宝路由组添加前缀和认证中间件
babyRouter.use("/baby", authMiddleware);

babyRouter.post("/baby/add", babyModule.addBaby);
babyRouter.post("/baby/update", babyModule.updateBaby);
babyRouter.post("/baby/delete", babyModule.deleteBaby);
babyRouter.get("/baby/list", babyModule.getBabyList);
babyRouter.get("/baby/detail", babyModule.getBabyDetail);

module.exports = babyRouter;
