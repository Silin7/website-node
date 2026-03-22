/*
 * @Description: 汇总模块子路由
 * @Author: Silin7
 * @Date: 2022-08-03
 */

const express = require("express");
const Router = express.Router();

const loginRouter = require("./components/login-router");
const systemRouter = require("./components/system-router");
const websitePagesRouter = require("./components/website-pages-router");
const websiteTemplateRouter = require("./components/website-template-router");

Router
  .use(loginRouter)
  .use(systemRouter)
  .use("/website-pages", websitePagesRouter)
  .use("/website-template", websiteTemplateRouter)

module.exports = Router;
