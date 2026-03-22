/*
 * @Description: 模板图片模块路由层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const express = require("express");
const path = require("path");
const templateImageModule = require("../../controller/template-image-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let templateImageRouter = express.Router();

// 为整个模板图片路由组添加前缀和认证中间件
templateImageRouter.use("/", authMiddleware);

templateImageRouter.post("/add", templateImageModule.addTemplateImage);
templateImageRouter.post("/update", templateImageModule.updateTemplateImage);
templateImageRouter.post("/delete", templateImageModule.deleteTemplateImage);
templateImageRouter.get("/list", templateImageModule.getTemplateImageList);
templateImageRouter.get("/detail", templateImageModule.getTemplateImageDetail);

module.exports = templateImageRouter;