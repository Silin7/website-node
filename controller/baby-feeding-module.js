/*
 * @Description: 宝宝喂养记录模块控制器层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const babyFeedingDao = require("../model/dao/baby-feeding-dao");
const { sendResponse, sendSuccess, handleError } = require("./utils/response-util");

module.exports = {
  // 新增喂养记录
  addBabyFeeding: async (req, res) => {
    try {
      let userId = req.user_id;

      if (userId) {
        const { baby_id, feed_date, feed_time, feed_type, feed_left, feed_right, milk_volume } = req.body;

        try {
          const feedingInfo = {
            baby_id,
            feed_date,
            feed_time,
            feed_type,
            feed_left,
            feed_right,
            milk_volume,
          };

          const result = await babyFeedingDao.addBabyFeeding(feedingInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, { id: result.insertId }, "喂养记录新增成功");
          } else {
            sendResponse(res, 400, false, "喂养记录新增失败");
          }
        } catch (error) {
          handleError(res, error, "喂养记录新增失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 修改喂养记录
  updateBabyFeeding: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id, baby_id, feed_date, feed_time, feed_type, feed_left, feed_right, milk_volume } = req.body;

        try {
          const feedingInfo = {
            id,
            baby_id,
            feed_date,
            feed_time,
            feed_type,
            feed_left,
            feed_right,
            milk_volume,
          };

          const result = await babyFeedingDao.updateBabyFeeding(feedingInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "喂养记录修改成功");
          } else {
            sendResponse(res, 400, false, "喂养记录修改失败，记录不存在或已删除");
          }
        } catch (error) {
          handleError(res, error, "喂养记录修改失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 软删除喂养记录
  deleteBabyFeeding: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.body;
        try {
          const result = await babyFeedingDao.deleteBabyFeeding(id, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "喂养记录删除成功");
          } else {
            sendResponse(res, 400, false, "喂养记录删除失败，记录不存在或已删除");
          }
        } catch (error) {
          handleError(res, error, "喂养记录删除失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询喂养记录列表
  getBabyFeedingList: async (req, res) => {
    try {
      let userId = req.user_id;

      if (userId) {
        try {
          // 获取分页参数和筛选条件
          const filters = {
            baby_id: req.query.baby_id,
            feed_date: req.query.feed_date,
          };

          // 查询列表数据
          const list = await babyFeedingDao.getBabyFeedingList(filters);

          sendSuccess(res, list, "喂养记录列表查询成功");
        } catch (error) {
          handleError(res, error, "喂养记录列表查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询近7天或近30天喂养记录
  getBabyFeedingByDateRange: async (req, res) => {
    try {
      let userId = req.user_id;

      if (userId) {
        try {
          const { baby_id, days } = req.query;

          // 验证参数
          if (!baby_id) {
            return handleError(res, new Error("baby_id参数不能为空"), "baby_id参数不能为空", "PARAM_ERROR");
          }

          if (days !== '7' && days !== '30') {
            return handleError(res, new Error("days参数只能是7或30"), "days参数只能是7或30", "PARAM_ERROR");
          }

          // 计算日期范围
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(startDate.getDate() - parseInt(days));

          // 格式化日期为YYYY-MM-DD格式
          const formatDate = (date) => {
            return date.toISOString().split('T')[0];
          };

          const startDateStr = formatDate(startDate);
          const endDateStr = formatDate(endDate);

          // 构建筛选条件
          const filters = {
            baby_id: baby_id,
            start_date: startDateStr,
            end_date: endDateStr
          };

          // 查询数据
          const list = await babyFeedingDao.getBabyFeedingList(filters);
          
          // 处理数据：按日期分组并格式化
          try {
            // 1. 验证所有记录都包含有效日期
            for (const record of list) {
              if (!record.feed_date) {
                throw new Error(`记录ID ${record.id} 缺少feed_date字段`);
              }
              // 验证日期格式有效性
              const dateObj = new Date(record.feed_date);
              if (isNaN(dateObj.getTime())) {
                throw new Error(`记录ID ${record.id} 的feed_date格式无效: ${record.feed_date}`);
              }
            }

            // 2. 使用reduce方法按feed_date字段分组记录
            const groupedData = list.reduce((acc, record) => {
              const date = record.feed_date;
              // 如果该日期不存在于累加器中，则初始化
              if (!acc[date]) {
                acc[date] = {
                  date: date,          // 日期字符串（保持原有YYYY-MM-DD格式）
                  records: []          // 该日期的记录数组
                };
              }
              // 将当前记录添加到对应日期的records数组中
              acc[date].records.push(record);
              return acc;
            }, {});

            // 3. 将分组对象转换为数组，并按日期降序排序
            const formattedList = Object.values(groupedData).sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });

            // 4. 返回格式化后的数组作为响应
            sendSuccess(res, formattedList, `近${days}天喂养记录查询成功`);
          } catch (formatError) {
            // 5. 处理数据格式化过程中的错误
            handleError(res, formatError, "喂养记录格式化失败");
          }
        } catch (error) {
          handleError(res, error, "喂养记录查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询喂养记录详情
  getBabyFeedingDetail: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.query;
        try {
          const result = await babyFeedingDao.getBabyFeedingById(id);
          if (result.length > 0) {
            sendSuccess(res, result[0], "喂养记录详情查询成功");
          } else {
            sendResponse(res, 404, false, "未找到该喂养记录");
          }
        } catch (error) {
          handleError(res, error, "喂养记录详情查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};
