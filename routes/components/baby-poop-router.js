/*
 * @Description: 宝宝便便记录模块路由层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const express = require("express");
const path = require("path");
const babyPoopModule = require("../../controller/baby-poop-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let babyPoopRouter = express.Router();

// 为整个宝宝便便路由组添加前缀和认证中间件
babyPoopRouter.use("/baby-poop", authMiddleware);

// 新增便便记录
babyPoopRouter.post("/baby-poop/add", babyPoopModule.addBabyPoop);
// 修改便便记录
babyPoopRouter.post("/baby-poop/update", babyPoopModule.updateBabyPoop);
// 删除便便记录
babyPoopRouter.post("/baby-poop/delete", babyPoopModule.deleteBabyPoop);
// 查询便便记录列表
babyPoopRouter.get("/baby-poop/list", babyPoopModule.getBabyPoopList);
// 查询便便记录详情
babyPoopRouter.get("/baby-poop/detail", babyPoopModule.getBabyPoopDetail);

module.exports = babyPoopRouter;
