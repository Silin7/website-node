/*
 * @Description: 宝宝喂养记录模块路由层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const express = require("express");
const path = require("path");
const babyFeedingModule = require("../../controller/baby-feeding-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let babyFeedingRouter = express.Router();

// 为整个宝宝喂养路由组添加前缀和认证中间件
babyFeedingRouter.use("/baby-feeding", authMiddleware);

// 新增喂养记录
babyFeedingRouter.post("/baby-feeding/add", babyFeedingModule.addBabyFeeding);
// 修改喂养记录
babyFeedingRouter.post("/baby-feeding/update", babyFeedingModule.updateBabyFeeding);
// 删除喂养记录
babyFeedingRouter.post("/baby-feeding/delete", babyFeedingModule.deleteBabyFeeding);
// 查询喂养记录列表
babyFeedingRouter.get("/baby-feeding/list", babyFeedingModule.getBabyFeedingList);
// 查询喂养记录详情
babyFeedingRouter.get("/baby-feeding/detail", babyFeedingModule.getBabyFeedingDetail);

// 查询近7天或近30天喂养记录
babyFeedingRouter.get("/baby-feeding/history", babyFeedingModule.getBabyFeedingByDateRange);

module.exports = babyFeedingRouter;
