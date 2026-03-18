/*
 * @Description: 宝宝睡眠记录模块控制器层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const babySleepDao = require("../model/dao/baby-sleep-dao");
const { sendResponse, sendSuccess, handleError, advancedValidate } = require("./utils/response-util");

module.exports = {
  /**
   * 新增睡眠记录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  addBabySleep: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { sleep_date, sleep_start_time, sleep_end_time } = req.body;
        
        // 基础参数验证
        if (!advancedValidate(res, { sleep_date, sleep_start_time }, {
          sleep_date: { required: true },
          sleep_start_time: { required: true }
        })) return;
        
        // 业务规则验证
        let validationError = null;
        
        // 验证时间格式和逻辑关系
        if (sleep_end_time) {
          // 如果有结束时间，必须晚于开始时间
          const startTime = new Date(`${sleep_date} ${sleep_start_time}`);
          const endTime = new Date(`${sleep_date} ${sleep_end_time}`);
          
          // 处理跨天睡眠情况
          if (endTime < startTime) {
            // 结束时间在第二天，构造正确的结束时间
            const nextDay = new Date(startTime);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextDayStr = nextDay.toISOString().split('T')[0];
            const endTimeNextDay = new Date(`${nextDayStr} ${sleep_end_time}`);
            
            if (endTimeNextDay < startTime) {
              validationError = "结束时间必须晚于开始时间";
            }
          } else if (endTime <= startTime) {
            validationError = "结束时间必须晚于开始时间";
          }
        }
        
        if (validationError) {
          handleError(res, new Error(validationError), validationError, "PARAM_ERROR");
          return;
        }
        
        try {
          const sleepInfo = {
            sleep_date,
            sleep_start_time,
            sleep_end_time
          };

          const result = await babySleepDao.addBabySleep(sleepInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, { id: result.insertId }, "睡眠记录新增成功");
          } else {
            sendResponse(res, 400, false, "睡眠记录新增失败");
          }
        } catch (error) {
          handleError(res, error, "睡眠记录新增失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  /**
   * 修改睡眠记录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  updateBabySleep: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id, sleep_date, sleep_start_time, sleep_end_time } = req.body;
        
        // 基础参数验证
        if (!advancedValidate(res, { id, sleep_date, sleep_start_time }, {
          id: { required: true },
          sleep_date: { required: true },
          sleep_start_time: { required: true }
        })) return;
        
        // 业务规则验证
        let validationError = null;
        
        // 验证时间格式和逻辑关系
        if (sleep_end_time) {
          // 如果有结束时间，必须晚于开始时间
          const startTime = new Date(`${sleep_date} ${sleep_start_time}`);
          const endTime = new Date(`${sleep_date} ${sleep_end_time}`);
          
          // 处理跨天睡眠情况
          if (endTime < startTime) {
            // 结束时间在第二天，构造正确的结束时间
            const nextDay = new Date(startTime);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextDayStr = nextDay.toISOString().split('T')[0];
            const endTimeNextDay = new Date(`${nextDayStr} ${sleep_end_time}`);
            
            if (endTimeNextDay < startTime) {
              validationError = "结束时间必须晚于开始时间";
            }
          } else if (endTime <= startTime) {
            validationError = "结束时间必须晚于开始时间";
          }
        }
        
        if (validationError) {
          handleError(res, new Error(validationError), validationError, "PARAM_ERROR");
          return;
        }
        
        try {
          const sleepInfo = {
            id,
            sleep_date,
            sleep_start_time,
            sleep_end_time
          };

          const result = await babySleepDao.updateBabySleep(sleepInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "睡眠记录修改成功");
          } else {
            sendResponse(res, 400, false, "睡眠记录修改失败，记录不存在或已删除");
          }
        } catch (error) {
          handleError(res, error, "睡眠记录修改失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  /**
   * 软删除睡眠记录
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  deleteBabySleep: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.body;
        
        if (!advancedValidate(res, { id }, {
          id: { required: true }
        })) return;
        
        try {
          const result = await babySleepDao.deleteBabySleep(id, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "睡眠记录删除成功");
          } else {
            sendResponse(res, 400, false, "睡眠记录删除失败，记录不存在或已删除");
          }
        } catch (error) {
          handleError(res, error, "睡眠记录删除失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  /**
   * 查询睡眠记录列表
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  getBabySleepList: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        try {
          // 获取分页参数和筛选条件
          const page = parseInt(req.query.page) || 1;
          const pageSize = parseInt(req.query.pageSize) || 10;
          const filters = {
            sleep_date: req.query.sleep_date
          };
          
          // 查询列表数据
          const list = await babySleepDao.getBabySleepList(userId, page, pageSize, filters);
          // 查询总数
          const total = await babySleepDao.getBabySleepCount(userId, filters);
          
          // 计算睡眠时长（可选：在前端计算更高效，这里仅作示例）
          const formattedList = list.map(item => {
            let sleepDuration = null;
            if (item.sleep_end_time) {
              const startTime = new Date(`${item.sleep_date} ${item.sleep_start_time}`);
              let endTime = new Date(`${item.sleep_date} ${item.sleep_end_time}`);
              
              // 处理跨天睡眠情况
              if (endTime < startTime) {
                const nextDay = new Date(startTime);
                nextDay.setDate(nextDay.getDate() + 1);
                const nextDayStr = nextDay.toISOString().split('T')[0];
                endTime = new Date(`${nextDayStr} ${item.sleep_end_time}`);
              }
              
              // 计算分钟数
              sleepDuration = Math.round((endTime - startTime) / (1000 * 60));
            }
            
            return {
              ...item,
              sleep_duration: sleepDuration
            };
          });
          
          sendSuccess(res, {
            list: formattedList,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize)
          }, "睡眠记录列表查询成功");
        } catch (error) {
          handleError(res, error, "睡眠记录列表查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  /**
   * 查询睡眠记录详情
   * @param {Object} req - 请求对象
   * @param {Object} res - 响应对象
   */
  getBabySleepDetail: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.query;
        
        if (!advancedValidate(res, { id }, {
          id: { required: true }
        })) return;
        
        try {
          const result = await babySleepDao.getBabySleepById(id, userId);
          if (result.length > 0) {
            const item = result[0];
            let sleepDuration = null;
            
            // 计算睡眠时长
            if (item.sleep_end_time) {
              const startTime = new Date(`${item.sleep_date} ${item.sleep_start_time}`);
              let endTime = new Date(`${item.sleep_date} ${item.sleep_end_time}`);
              
              // 处理跨天睡眠情况
              if (endTime < startTime) {
                const nextDay = new Date(startTime);
                nextDay.setDate(nextDay.getDate() + 1);
                const nextDayStr = nextDay.toISOString().split('T')[0];
                endTime = new Date(`${nextDayStr} ${item.sleep_end_time}`);
              }
              
              // 计算分钟数
              sleepDuration = Math.round((endTime - startTime) / (1000 * 60));
            }
            
            const formattedItem = {
              ...item,
              sleep_duration: sleepDuration
            };
            
            sendSuccess(res, formattedItem, "睡眠记录详情查询成功");
          } else {
            sendResponse(res, 404, false, "未找到该睡眠记录");
          }
        } catch (error) {
          handleError(res, error, "睡眠记录详情查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};
