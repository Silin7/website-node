/*
 * @Description: 宝宝喂养记录模块数据访问层
 * @Author: Silin7
 * @Date: 2025-12-16
 * @Updated: 2025-12-20: 重命名feed_duration为feed_left，新增feed_right字段
 */

const db = require("../mySQL");

module.exports = {
  // 新增喂养记录
  addBabyFeeding: async (feedingInfo, creatorOpenid) => {
    let sql = "INSERT INTO baby_feeding(baby_id, feed_date, feed_time, feed_type, feed_left, feed_right, milk_volume, " +
      "creator_openid) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
    const result = await db.query(sql, [
      feedingInfo.baby_id,
      feedingInfo.feed_date,
      feedingInfo.feed_time,
      feedingInfo.feed_type,
      feedingInfo.feed_left,
      feedingInfo.feed_right,
      feedingInfo.milk_volume,
      creatorOpenid
    ]);

    return result;
  },

  // 修改喂养记录
  updateBabyFeeding: async (feedingInfo) => {
    let sql = "UPDATE baby_feeding SET baby_id = ?, feed_date = ?, feed_time = ?, feed_type = ?, feed_left = ?, feed_right = ?, milk_volume = ? WHERE id = ? AND delete_flag = 0";
    const result = await db.query(sql, [
      feedingInfo.baby_id,
      feedingInfo.feed_date,
      feedingInfo.feed_time,
      feedingInfo.feed_type,
      feedingInfo.feed_left,
      feedingInfo.feed_right,
      feedingInfo.milk_volume,
      feedingInfo.id,
    ]);

    return result;
  },

  // 软删除喂养记录
  deleteBabyFeeding: async (id) => {
    let sql = "UPDATE baby_feeding SET delete_flag = 1 WHERE id = ? AND delete_flag = 0";
    const result = await db.query(sql, [id]);

    return result;
  },

  // 查询用户的喂养记录列表（支持分页）
  getBabyFeedingList: async (filters = {}) => {
    // 查询时同时返回feed_left、feed_right和feed_duration（用于向后兼容）
    let sql = "SELECT *, (COALESCE(feed_left, 0) + COALESCE(feed_right, 0)) as feed_duration FROM baby_feeding WHERE delete_flag = 0";

    const params = [];

    // 添加宝宝id筛选条件
    if (filters.baby_id) {
      sql += " AND baby_id = ?";
      params.push(filters.baby_id);
    }

    // 添加筛选条件
    if (filters.feed_date) {
      sql += " AND feed_date = ?";
      params.push(filters.feed_date);
    }

    // 添加日期范围筛选
    if (filters.start_date && filters.end_date) {
      sql += " AND feed_date BETWEEN ? AND ?";
      params.push(filters.start_date, filters.end_date);
    }

    // 排序
    sql += " ORDER BY feed_date DESC, feed_time DESC";

    const result = await db.query(sql, params);

    return result;
  },

  // 根据id查询喂养记录详情
  getBabyFeedingById: async (id) => {
    // 查询时同时返回feed_left、feed_right和feed_duration（用于向后兼容）
    let sql = "SELECT * FROM baby_feeding WHERE id = ? AND delete_flag = 0 LIMIT 1";
    const result = await db.query(sql, [id]);

    return result;
  }
};
