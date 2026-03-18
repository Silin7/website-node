/*
 * @Description: 宝宝体温记录模块控制器层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const babyTemperatureDao = require("../model/dao/baby-temperature-dao");
const { sendResponse, sendSuccess, handleError, advancedValidate } = require("./utils/response-util");

module.exports = {
  /**
   * 新增体温记录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  addBabyTemperature: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { record_date, record_time, temperature } = req.body;
        
        // 基础参数验证
        if (!advancedValidate(res, { record_date, record_time, temperature }, {
          record_date: { required: true },
          record_time: { required: true },
          temperature: { required: true, type: "number" }
        })) return;
        
        // 业务规则验证
        let validationError = null;
        
        // 体温范围验证（正常人体温范围：35.0°C - 42.0°C）
        if (temperature < 35.0 || temperature > 42.0) {
          validationError = "体温值超出正常范围（35.0°C - 42.0°C）";
        }
        
        if (validationError) {
          handleError(res, new Error(validationError), validationError, "PARAM_ERROR");
          return;
        }
        
        try {
          const temperatureInfo = {
            record_date,
            record_time,
            temperature
          };

          const result = await babyTemperatureDao.addBabyTemperature(temperatureInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, { id: result.insertId }, "体温记录新增成功");
          } else {
            sendResponse(res, 400, false, "体温记录新增失败");
          }
        } catch (error) {
          handleError(res, error, "体温记录新增失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  /**
   * 修改体温记录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  updateBabyTemperature: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id, record_date, record_time, temperature } = req.body;
        
        // 基础参数验证
        if (!advancedValidate(res, { id, record_date, record_time, temperature }, {
          id: { required: true },
          record_date: { required: true },
          record_time: { required: true },
          temperature: { required: true, type: "number" }
        })) return;
        
        // 业务规则验证
        let validationError = null;
        
        // 体温范围验证（正常人体温范围：35.0°C - 42.0°C）
        if (temperature < 35.0 || temperature > 42.0) {
          validationError = "体温值超出正常范围（35.0°C - 42.0°C）";
        }
        
        if (validationError) {
          handleError(res, new Error(validationError), validationError, "PARAM_ERROR");
          return;
        }
        
        try {
          const temperatureInfo = {
            id,
            record_date,
            record_time,
            temperature
          };

          const result = await babyTemperatureDao.updateBabyTemperature(temperatureInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "体温记录修改成功");
          } else {
            sendResponse(res, 400, false, "体温记录修改失败，记录不存在或已删除");
          }
        } catch (error) {
          handleError(res, error, "体温记录修改失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  /**
   * 软删除体温记录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  deleteBabyTemperature: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.body;
        
        if (!advancedValidate(res, { id }, {
          id: { required: true }
        })) return;
        
        try {
          const result = await babyTemperatureDao.deleteBabyTemperature(id, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "体温记录删除成功");
          } else {
            sendResponse(res, 400, false, "体温记录删除失败，记录不存在或已删除");
          }
        } catch (error) {
          handleError(res, error, "体温记录删除失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  /**
   * 查询体温记录列表
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  getBabyTemperatureList: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        try {
          // 获取分页参数和筛选条件
          const page = parseInt(req.query.page) || 1;
          const pageSize = parseInt(req.query.pageSize) || 10;
          const filters = {
            record_date: req.query.record_date,
            min_temperature: req.query.min_temperature ? parseFloat(req.query.min_temperature) : null,
            max_temperature: req.query.max_temperature ? parseFloat(req.query.max_temperature) : null
          };
          
          // 查询列表数据
          const list = await babyTemperatureDao.getBabyTemperatureList(userId, page, pageSize, filters);
          // 查询总数
          const total = await babyTemperatureDao.getBabyTemperatureCount(userId, filters);
          
          // 添加体温状态（正常、发热等）
          const formattedList = list.map(item => {
            let temperatureStatus = "正常";
            if (item.temperature >= 37.3 && item.temperature < 38.0) {
              temperatureStatus = "低热";
            } else if (item.temperature >= 38.0 && item.temperature < 39.0) {
              temperatureStatus = "中等热";
            } else if (item.temperature >= 39.0 && item.temperature < 41.0) {
              temperatureStatus = "高热";
            } else if (item.temperature >= 41.0) {
              temperatureStatus = "超高热";
            } else if (item.temperature < 36.0) {
              temperatureStatus = "体温偏低";
            }
            
            return {
              ...item,
              temperature_status: temperatureStatus
            };
          });
          
          sendSuccess(res, {
            list: formattedList,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
          }, "体温记录列表查询成功");
        } catch (error) {
          handleError(res, error, "体温记录列表查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  /**
   * 查询体温记录详情
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  getBabyTemperatureDetail: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.query;
        
        if (!advancedValidate(res, { id }, {
          id: { required: true }
        })) return;
        
        try {
          const result = await babyTemperatureDao.getBabyTemperatureById(id, userId);
          if (result.length > 0) {
            const item = result[0];
            
            // 添加体温状态
            let temperatureStatus = "正常";
            if (item.temperature >= 37.3 && item.temperature < 38.0) {
              temperatureStatus = "低热";
            } else if (item.temperature >= 38.0 && item.temperature < 39.0) {
              temperatureStatus = "中等热";
            } else if (item.temperature >= 39.0 && item.temperature < 41.0) {
              temperatureStatus = "高热";
            } else if (item.temperature >= 41.0) {
              temperatureStatus = "超高热";
            } else if (item.temperature < 36.0) {
              temperatureStatus = "体温偏低";
            }
            
            const formattedItem = {
              ...item,
              temperature_status: temperatureStatus
            };
            
            sendSuccess(res, formattedItem, "体温记录详情查询成功");
          } else {
            sendResponse(res, 404, false, "未找到该体温记录");
          }
        } catch (error) {
          handleError(res, error, "体温记录详情查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};
