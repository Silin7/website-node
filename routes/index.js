/*
 * @Description: 汇总模块子路由
 * @Author: Silin7
 * @Date: 2022-08-03
 */

const express = require("express");
const Router = express.Router();

const babyRouter = require("./components/baby-router");
const familyRouter = require("./components/family-router");
const loginRouter = require("./components/login-router");
const systemRouter = require("./components/system-router");
const babyFeedingRouter = require("./components/baby-feeding-router");
const babyMedicationRouter = require("./components/baby-medication-router");
const babyPoopRouter = require("./components/baby-poop-router");
const babySleepRouter = require("./components/baby-sleep-router");
const babyTemperatureRouter = require("./components/baby-temperature-router");

Router
  .use(babyRouter)
  .use(familyRouter)
  .use(loginRouter)
  .use(systemRouter)
  .use(babyFeedingRouter)
  .use(babyMedicationRouter)
  .use(babyPoopRouter)
  .use(babySleepRouter)
  .use(babyTemperatureRouter)

module.exports = Router;
