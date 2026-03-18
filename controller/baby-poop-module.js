/*
 * @Description: 宝宝便便记录模块控制器层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const babyPoopDao = require("../model/dao/baby-poop-dao");
const { sendResponse, sendSuccess, handleError, advancedValidate } = require("./utils/response-util");

module.exports = {
  // 新增便便记录
  addBabyPoop: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { poop_date, poop_time, poop_color, poop_shape, has_milk_curd } = req.body;
        
        // 基础参数验证
        if (!advancedValidate(res, { poop_date, poop_time, poop_color, poop_shape, has_milk_curd }, {
          poop_date: { required: true },
          poop_time: { required: true },
          poop_color: { required: true, minLength: 1 },
          poop_shape: { required: true, minLength: 1 },
          has_milk_curd: { required: true, type: "number" }
        })) return;
        
        // 业务规则验证
        if (has_milk_curd !== 0 && has_milk_curd !== 1) {
          handleError(res, new Error("奶瓣状态值无效"), "奶瓣状态值必须为0或1", "PARAM_ERROR");
          return;
        }
        
        try {
          const poopInfo = {
            poop_date,
            poop_time,
            poop_color,
            poop_shape,
            has_milk_curd
          };

          const result = await babyPoopDao.addBabyPoop(poopInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, { id: result.insertId }, "便便记录新增成功");
          } else {
            sendResponse(res, 400, false, "便便记录新增失败");
          }
        } catch (error) {
          handleError(res, error, "便便记录新增失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 修改便便记录
  updateBabyPoop: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id, poop_date, poop_time, poop_color, poop_shape, has_milk_curd } = req.body;
        
        // 基础参数验证
        if (!advancedValidate(res, { id, poop_date, poop_time, poop_color, poop_shape, has_milk_curd }, {
          id: { required: true },
          poop_date: { required: true },
          poop_time: { required: true },
          poop_color: { required: true, minLength: 1 },
          poop_shape: { required: true, minLength: 1 },
          has_milk_curd: { required: true, type: "number" }
        })) return;
        
        // 业务规则验证
        if (has_milk_curd !== 0 && has_milk_curd !== 1) {
          handleError(res, new Error("奶瓣状态值无效"), "奶瓣状态值必须为0或1", "PARAM_ERROR");
          return;
        }
        
        try {
          const poopInfo = {
            id,
            poop_date,
            poop_time,
            poop_color,
            poop_shape,
            has_milk_curd
          };

          const result = await babyPoopDao.updateBabyPoop(poopInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "便便记录修改成功");
          } else {
            sendResponse(res, 400, false, "便便记录修改失败，记录不存在或已删除");
          }
        } catch (error) {
          handleError(res, error, "便便记录修改失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 软删除便便记录
  deleteBabyPoop: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.body;
        
        if (!advancedValidate(res, { id }, {
          id: { required: true }
        })) return;
        
        try {
          const result = await babyPoopDao.deleteBabyPoop(id, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "便便记录删除成功");
          } else {
            sendResponse(res, 400, false, "便便记录删除失败，记录不存在或已删除");
          }
        } catch (error) {
          handleError(res, error, "便便记录删除失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询便便记录列表
  getBabyPoopList: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        try {
          // 获取分页参数和筛选条件
          const page = parseInt(req.query.page) || 1;
          const pageSize = parseInt(req.query.pageSize) || 10;
          const filters = {
            poop_date: req.query.poop_date,
            poop_color: req.query.poop_color,
            poop_shape: req.query.poop_shape
          };
          
          // 查询列表数据
          const list = await babyPoopDao.getBabyPoopList(userId, page, pageSize, filters);
          // 查询总数
          const total = await babyPoopDao.getBabyPoopCount(userId, filters);
          
          sendSuccess(res, {
            list,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
          }, "便便记录列表查询成功");
        } catch (error) {
          handleError(res, error, "便便记录列表查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询便便记录详情
  getBabyPoopDetail: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.query;
        
        if (!advancedValidate(res, { id }, {
          id: { required: true }
        })) return;
        
        try {
          const result = await babyPoopDao.getBabyPoopById(id, userId);
          if (result.length > 0) {
            sendSuccess(res, result[0], "便便记录详情查询成功");
          } else {
            sendResponse(res, 404, false, "未找到该便便记录");
          }
        } catch (error) {
          handleError(res, error, "便便记录详情查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};
