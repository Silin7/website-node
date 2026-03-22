/*
 * @Description: 模板文本模块路由层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const express = require("express");
const path = require("path");
const templateTextModule = require("../../controller/template-text-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let templateTextRouter = express.Router();

// 为整个模板文本路由组添加前缀和认证中间件
templateTextRouter.use("/", authMiddleware);

templateTextRouter.post("/add", templateTextModule.addTemplateText);
templateTextRouter.post("/update", templateTextModule.updateTemplateText);
templateTextRouter.post("/delete", templateTextModule.deleteTemplateText);
templateTextRouter.get("/list", templateTextModule.getTemplateTextList);
templateTextRouter.get("/detail", templateTextModule.getTemplateTextDetail);

module.exports = templateTextRouter;