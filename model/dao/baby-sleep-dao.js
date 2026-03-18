/*
 * @Description: 宝宝睡眠记录模块数据访问层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const db = require("../mySQL");

module.exports = {
  /**
   * 新增睡眠记录
   * @param {Object} sleepInfo - 睡眠记录信息
   * @param {string} creatorOpenid - 创建人openid
   * @returns {Promise<Object>} 数据库操作结果
   */
  addBabySleep: async (sleepInfo, creatorOpenid) => {
    // 优化：显式列出所有字段，避免隐式插入问题
    // 建议：在baby_sleep表上为(creator_openid, delete_flag, sleep_date)创建联合索引
    let sql = `INSERT INTO baby_sleep 
              (sleep_date, sleep_start_time, sleep_end_time, creator_openid) 
              VALUES (?, ?, ?, ?)`;
    
    const result = await db.query(sql, [
      sleepInfo.sleep_date,
      sleepInfo.sleep_start_time,
      sleepInfo.sleep_end_time,
      creatorOpenid
    ]);

    return result;
  },

  /**
   * 修改睡眠记录
   * @param {Object} sleepInfo - 睡眠记录信息
   * @param {string} creatorOpenid - 创建人openid
   * @returns {Promise<Object>} 数据库操作结果
   */
  updateBabySleep: async (sleepInfo, creatorOpenid) => {
    // 优化：使用精确条件，避免全表扫描
    // 建议：在baby_sleep表上为(id, creator_openid, delete_flag)创建联合唯一索引
    let sql = `UPDATE baby_sleep 
              SET sleep_date = ?, sleep_start_time = ?, sleep_end_time = ? 
              WHERE id = ? AND creator_openid = ? AND delete_flag = 0`;
    
    const result = await db.query(sql, [
      sleepInfo.sleep_date,
      sleepInfo.sleep_start_time,
      sleepInfo.sleep_end_time,
      sleepInfo.id,
      creatorOpenid
    ]);

    return result;
  },

  /**
   * 软删除睡眠记录
   * @param {number} id - 记录ID
   * @param {string} creatorOpenid - 创建人openid
   * @returns {Promise<Object>} 数据库操作结果
   */
  deleteBabySleep: async (id, creatorOpenid) => {
    // 优化：使用精确条件，避免全表扫描
    // 建议：在baby_sleep表上为(id, creator_openid, delete_flag)创建联合唯一索引
    let sql = `UPDATE baby_sleep 
              SET delete_flag = 1 
              WHERE id = ? AND creator_openid = ? AND delete_flag = 0`;
    
    const result = await db.query(sql, [id, creatorOpenid]);

    return result;
  },

  /**
   * 查询用户的睡眠记录列表
   * @param {string} creatorOpenid - 创建人openid
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @param {Object} filters - 筛选条件
   * @returns {Promise<Array>} 睡眠记录列表
   */
  getBabySleepList: async (creatorOpenid, page = 1, pageSize = 10, filters = {}) => {
    // 优化：仅查询必要字段，避免SELECT *
    // 优化：使用分页查询，避免返回大量数据
    // 建议：在baby_sleep表上为(creator_openid, delete_flag, sleep_date, sleep_start_time)创建联合索引
    let sql = `SELECT id, sleep_date, sleep_start_time, sleep_end_time, 
                      creator_openid, create_time 
              FROM baby_sleep 
              WHERE creator_openid = ? AND delete_flag = 0`;
    
    const params = [creatorOpenid];
    
    // 动态构建筛选条件
    if (filters.sleep_date) {
      sql += " AND sleep_date = ?";
      params.push(filters.sleep_date);
    }
    
    // 优化：使用ORDER BY与索引一致，避免文件排序
    sql += " ORDER BY sleep_date DESC, sleep_start_time DESC";
    
    // 优化：使用LIMIT和OFFSET进行高效分页
    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);
    
    const result = await db.query(sql, params);
    return result;
  },

  /**
   * 查询睡眠记录总数
   * @param {string} creatorOpenid - 创建人openid
   * @param {Object} filters - 筛选条件
   * @returns {Promise<number>} 记录总数
   */
  getBabySleepCount: async (creatorOpenid, filters = {}) => {
    // 优化：使用COUNT(*)查询，数据库优化器会选择最优执行计划
    // 优化：与列表查询使用相同的条件，确保计数准确
    let sql = `SELECT COUNT(*) as count 
              FROM baby_sleep 
              WHERE creator_openid = ? AND delete_flag = 0`;
    
    const params = [creatorOpenid];
    
    // 与列表查询使用相同的筛选条件构建逻辑
    if (filters.sleep_date) {
      sql += " AND sleep_date = ?";
      params.push(filters.sleep_date);
    }
    
    const result = await db.query(sql, params);
    return result[0].count;
  },

  /**
   * 根据id查询睡眠记录详情
   * @param {number} id - 记录ID
   * @param {string} creatorOpenid - 创建人openid
   * @returns {Promise<Array>} 睡眠记录详情
   */
  getBabySleepById: async (id, creatorOpenid) => {
    // 优化：仅查询必要字段
    // 优化：使用LIMIT 1，避免返回多余数据
    // 建议：在baby_sleep表上为(id, creator_openid, delete_flag)创建联合唯一索引
    let sql = `SELECT id, sleep_date, sleep_start_time, sleep_end_time, 
                      creator_openid, create_time 
              FROM baby_sleep 
              WHERE id = ? AND creator_openid = ? AND delete_flag = 0 
              LIMIT 1`;
    
    const result = await db.query(sql, [id, creatorOpenid]);
    return result;
  }
};
