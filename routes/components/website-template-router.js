/*
 * @Description: 网站模板模块路由层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const express = require("express");
const path = require("path");
const websiteTemplateModule = require("../../controller/website-template-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let websiteTemplateRouter = express.Router();

// 为整个网站模板路由组添加前缀和认证中间件
websiteTemplateRouter.use("/", authMiddleware);

websiteTemplateRouter.post("/add", websiteTemplateModule.addTemplate);
websiteTemplateRouter.post("/update", websiteTemplateModule.updateTemplate);
websiteTemplateRouter.post("/delete", websiteTemplateModule.deleteTemplate);
websiteTemplateRouter.get("/list", websiteTemplateModule.getTemplateList);
websiteTemplateRouter.get("/detail", websiteTemplateModule.getTemplateDetail);

module.exports = websiteTemplateRouter;