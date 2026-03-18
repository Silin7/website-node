/*
 * @Description: 宝宝用药记录模块路由层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const express = require("express");
const path = require("path");
const babyMedicationModule = require("../../controller/baby-medication-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let babyMedicationRouter = express.Router();

// 为整个宝宝用药路由组添加前缀和认证中间件
babyMedicationRouter.use("/baby-medication", authMiddleware);

// 新增用药记录
babyMedicationRouter.post("/baby-medication/add", babyMedicationModule.addBabyMedication);
// 修改用药记录
babyMedicationRouter.post("/baby-medication/update", babyMedicationModule.updateBabyMedication);
// 删除用药记录
babyMedicationRouter.post("/baby-medication/delete", babyMedicationModule.deleteBabyMedication);
// 查询用药记录列表
babyMedicationRouter.get("/baby-medication/list", babyMedicationModule.getBabyMedicationList);
// 查询用药记录详情
babyMedicationRouter.get("/baby-medication/detail", babyMedicationModule.getBabyMedicationDetail);

module.exports = babyMedicationRouter;
