/*
 * @Description: 汇总模块子路由
 * @Author: Silin7
 * @Date: 2022-08-03
 */

const express = require("express");
const Router = express.Router();

const loginRouter = require("./components/login-router");
const websitePagesRouter = require("./components/website-pages-router");
const websiteTemplateRouter = require("./components/website-template-router");
const templateTextRouter = require("./components/template-text-router");
const templateImageRouter = require("./components/template-image-router");
const templateCarouselRouter = require("./components/template-carousel-router");

Router
  .use(loginRouter)
  .use(websitePagesRouter)
  .use(websiteTemplateRouter)
  .use(templateTextRouter)
  .use(templateImageRouter)
  .use(templateCarouselRouter)

module.exports = Router;
