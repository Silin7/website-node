/*
 * @Description: 家庭模块路由层
 * @Author: Silin7
 * @Date: 2024-09-27
 */

const express = require("express");
const path = require("path");
const familyModule = require("../../controller/family-module");
// 引入认证中间件
const { authMiddleware } = require(path.join(__dirname, "../../controller/system/auth-middleware"));

let familyRouter = express.Router();

// 为整个家庭路由组添加前缀和认证中间件
familyRouter.use(["/family", "/familymember"], authMiddleware);

familyRouter.post("/family/add", familyModule.familyAdd);
familyRouter.get("/family/del", familyModule.familyDel);
familyRouter.get("/family/detail", familyModule.familyDetail);
familyRouter.get("/family/edit", familyModule.familyEdit);
familyRouter.get("/family/member/query", familyModule.familymemberQuery);
familyRouter.get("/family/member/add", familyModule.familymemberAdd);
familyRouter.get("/family/member/del", familyModule.familymemberDel);
familyRouter.get("/family/member/list", familyModule.familymemberList);
familyRouter.get("/family/member/edit", familyModule.familymemberEdit);

module.exports = familyRouter;
