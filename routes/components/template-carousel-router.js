/*
 * @Description: 模板轮播模块路由层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const express = require("express");
const path = require("path");
const templateCarouselModule = require("../../controller/template-carousel-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let templateCarouselRouter = express.Router();

// 为整个模板轮播路由组添加前缀和认证中间件
templateCarouselRouter.use("/", authMiddleware);

templateCarouselRouter.post("/add", templateCarouselModule.addTemplateCarousel);
templateCarouselRouter.post("/update", templateCarouselModule.updateTemplateCarousel);
templateCarouselRouter.post("/delete", templateCarouselModule.deleteTemplateCarousel);
templateCarouselRouter.get("/list", templateCarouselModule.getTemplateCarouselList);
templateCarouselRouter.get("/detail", templateCarouselModule.getTemplateCarouselDetail);

module.exports = templateCarouselRouter;