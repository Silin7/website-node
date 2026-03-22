/*
 * @Description: 网站页面模块路由层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const express = require("express");
const path = require("path");
const websitePagesModule = require("../../controller/website-pages-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let websitePagesRouter = express.Router();

// 为整个网站页面路由组添加前缀和认证中间件
websitePagesRouter.use("/", authMiddleware);

websitePagesRouter.post("/add", websitePagesModule.addPage);
websitePagesRouter.post("/update", websitePagesModule.updatePage);
websitePagesRouter.post("/delete", websitePagesModule.deletePage);
websitePagesRouter.get("/list", websitePagesModule.getPageList);
websitePagesRouter.get("/detail", websitePagesModule.getPageDetail);

module.exports = websitePagesRouter;