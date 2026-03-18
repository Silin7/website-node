/*
 * @Description: 宝宝用药记录模块控制器层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const babyMedicationDao = require("../model/dao/baby-medication-dao");
const { sendResponse, sendSuccess, handleError, advancedValidate } = require("./utils/response-util");

module.exports = {
  // 新增用药记录
  addBabyMedication: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { medication_date, medication_time, medication_name, dosage } = req.body;
        
        // 基础参数验证
        if (!advancedValidate(res, { medication_date, medication_time, medication_name, dosage }, {
          medication_date: { required: true },
          medication_time: { required: true },
          medication_name: { required: true, minLength: 1 },
          dosage: { required: true, minLength: 1 }
        })) return;
        
        try {
          const medicationInfo = {
            medication_date,
            medication_time,
            medication_name,
            dosage
          };

          const result = await babyMedicationDao.addBabyMedication(medicationInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, { id: result.insertId }, "用药记录新增成功");
          } else {
            sendResponse(res, 400, false, "用药记录新增失败");
          }
        } catch (error) {
          handleError(res, error, "用药记录新增失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 修改用药记录
  updateBabyMedication: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id, medication_date, medication_time, medication_name, dosage } = req.body;
        
        // 基础参数验证
        if (!advancedValidate(res, { id, medication_date, medication_time, medication_name, dosage }, {
          id: { required: true },
          medication_date: { required: true },
          medication_time: { required: true },
          medication_name: { required: true, minLength: 1 },
          dosage: { required: true, minLength: 1 }
        })) return;
        
        try {
          const medicationInfo = {
            id,
            medication_date,
            medication_time,
            medication_name,
            dosage
          };

          const result = await babyMedicationDao.updateBabyMedication(medicationInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "用药记录修改成功");
          } else {
            sendResponse(res, 400, false, "用药记录修改失败，记录不存在或已删除");
          }
        } catch (error) {
          handleError(res, error, "用药记录修改失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 软删除用药记录
  deleteBabyMedication: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.body;
        
        if (!advancedValidate(res, { id }, {
          id: { required: true }
        })) return;
        
        try {
          const result = await babyMedicationDao.deleteBabyMedication(id, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "用药记录删除成功");
          } else {
            sendResponse(res, 400, false, "用药记录删除失败，记录不存在或已删除");
          }
        } catch (error) {
          handleError(res, error, "用药记录删除失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询用药记录列表
  getBabyMedicationList: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        try {
          // 获取分页参数和筛选条件
          const page = parseInt(req.query.page) || 1;
          const pageSize = parseInt(req.query.pageSize) || 10;
          const filters = {
            medication_date: req.query.medication_date,
            medication_name: req.query.medication_name
          };
          
          // 查询列表数据
          const list = await babyMedicationDao.getBabyMedicationList(userId, page, pageSize, filters);
          // 查询总数
          const total = await babyMedicationDao.getBabyMedicationCount(userId, filters);
          
          sendSuccess(res, {
            list,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
          }, "用药记录列表查询成功");
        } catch (error) {
          handleError(res, error, "用药记录列表查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询用药记录详情
  getBabyMedicationDetail: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.query;
        
        if (!advancedValidate(res, { id }, {
          id: { required: true }
        })) return;
        
        try {
          const result = await babyMedicationDao.getBabyMedicationById(id, userId);
          if (result.length > 0) {
            sendSuccess(res, result[0], "用药记录详情查询成功");
          } else {
            sendResponse(res, 404, false, "未找到该用药记录");
          }
        } catch (error) {
          handleError(res, error, "用药记录详情查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};
