/*
 * @Description: 宝宝体温记录模块路由层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const express = require("express");
const path = require("path");
const babyTemperatureModule = require("../../controller/baby-temperature-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let babyTemperatureRouter = express.Router();

// 为整个宝宝体温路由组添加前缀和认证中间件
babyTemperatureRouter.use("/baby-temperature", authMiddleware);

// 新增体温记录
babyTemperatureRouter.post("/baby-temperature/add", babyTemperatureModule.addBabyTemperature);
// 修改体温记录
babyTemperatureRouter.post("/baby-temperature/update", babyTemperatureModule.updateBabyTemperature);
// 删除体温记录
babyTemperatureRouter.post("/baby-temperature/delete", babyTemperatureModule.deleteBabyTemperature);
// 查询体温记录列表
babyTemperatureRouter.get("/baby-temperature/list", babyTemperatureModule.getBabyTemperatureList);
// 查询体温记录详情
babyTemperatureRouter.get("/baby-temperature/detail", babyTemperatureModule.getBabyTemperatureDetail);

module.exports = babyTemperatureRouter;
