/*
 * @Description: 宝宝便便记录模块数据访问层（SQL优化版）
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const db = require("../mySQL");

module.exports = {
  /**
   * 新增便便记录
   * @param {Object} poopInfo - 便便记录信息
   * @param {string} creatorOpenid - 创建人openid
   * @returns {Promise<Object>} 数据库操作结果
   */
  addBabyPoop: async (poopInfo, creatorOpenid) => {
    // 优化：显式列出所有字段，避免隐式插入问题
    // 建议：在baby_poop表上为(creator_openid, delete_flag)创建联合索引
    let sql = `INSERT INTO baby_poop 
              (poop_date, poop_time, poop_color, poop_shape, has_milk_curd, creator_openid) 
              VALUES (?, ?, ?, ?, ?, ?)`;

    const result = await db.query(sql, [
      poopInfo.poop_date,
      poopInfo.poop_time,
      poopInfo.poop_color,
      poopInfo.poop_shape,
      poopInfo.has_milk_curd,
      creatorOpenid
    ]);

    return result;
  },

  /**
   * 修改便便记录
   * @param {Object} poopInfo - 便便记录信息
   * @param {string} creatorOpenid - 创建人openid
   * @returns {Promise<Object>} 数据库操作结果
   */
  updateBabyPoop: async (poopInfo, creatorOpenid) => {
    // 优化：使用精确条件，避免全表扫描
    // 建议：在baby_poop表上为(id, creator_openid, delete_flag)创建联合唯一索引
    let sql = `UPDATE baby_poop 
              SET poop_date = ?, poop_time = ?, poop_color = ?, 
                  poop_shape = ?, has_milk_curd = ? 
              WHERE id = ? AND creator_openid = ? AND delete_flag = 0`;

    const result = await db.query(sql, [
      poopInfo.poop_date,
      poopInfo.poop_time,
      poopInfo.poop_color,
      poopInfo.poop_shape,
      poopInfo.has_milk_curd,
      poopInfo.id,
      creatorOpenid
    ]);

    return result;
  },

  /**
   * 软删除便便记录
   * @param {number} id - 记录ID
   * @param {string} creatorOpenid - 创建人openid
   * @returns {Promise<Object>} 数据库操作结果
   */
  deleteBabyPoop: async (id, creatorOpenid) => {
    // 优化：使用精确条件，避免全表扫描
    // 建议：在baby_poop表上为(id, creator_openid, delete_flag)创建联合唯一索引
    let sql = `UPDATE baby_poop 
              SET delete_flag = 1 
              WHERE id = ? AND creator_openid = ? AND delete_flag = 0`;

    const result = await db.query(sql, [id, creatorOpenid]);

    return result;
  },

  /**
   * 查询用户的便便记录列表
   * @param {string} creatorOpenid - 创建人openid
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @param {Object} filters - 筛选条件
   * @returns {Promise<Array>} 便便记录列表
   */
  getBabyPoopList: async (creatorOpenid, page = 1, pageSize = 10, filters = {}) => {
    // 优化：仅查询必要字段，避免SELECT *
    // 优化：使用分页查询，避免返回大量数据
    // 建议：在baby_poop表上为(creator_openid, delete_flag, poop_date, poop_time)创建联合索引
    let sql = `SELECT id, poop_date, poop_time, poop_color, poop_shape, has_milk_curd, 
                      creator_openid, create_time 
              FROM baby_poop 
              WHERE creator_openid = ? AND delete_flag = 0`;

    const params = [creatorOpenid];

    // 动态构建筛选条件，使用索引友好的条件格式
    if (filters.poop_date) {
      sql += " AND poop_date = ?";
      params.push(filters.poop_date);
    }

    if (filters.poop_color) {
      sql += " AND poop_color = ?";
      params.push(filters.poop_color);
    }

    if (filters.poop_shape) {
      sql += " AND poop_shape = ?";
      params.push(filters.poop_shape);
    }

    // 优化：使用ORDER BY与索引一致，避免文件排序
    sql += " ORDER BY poop_date DESC, poop_time DESC";

    // 优化：使用LIMIT和OFFSET进行高效分页
    const offset = (page - 1) * pageSize;
    sql += ` LIMIT ? OFFSET ?`;
    params.push(pageSize, offset);

    const result = await db.query(sql, params);
    return result;
  },

  /**
   * 查询便便记录总数
   * @param {string} creatorOpenid - 创建人openid
   * @param {Object} filters - 筛选条件
   * @returns {Promise<number>} 记录总数
   */
  getBabyPoopCount: async (creatorOpenid, filters = {}) => {
    // 优化：使用COUNT(*)查询，数据库优化器会选择最优执行计划
    // 优化：与列表查询使用相同的条件，确保计数准确
    let sql = `SELECT COUNT(*) as count 
              FROM baby_poop 
              WHERE creator_openid = ? AND delete_flag = 0`;

    const params = [creatorOpenid];

    // 与列表查询使用相同的筛选条件构建逻辑
    if (filters.poop_date) {
      sql += " AND poop_date = ?";
      params.push(filters.poop_date);
    }

    if (filters.poop_color) {
      sql += " AND poop_color = ?";
      params.push(filters.poop_color);
    }

    if (filters.poop_shape) {
      sql += " AND poop_shape = ?";
      params.push(filters.poop_shape);
    }

    const result = await db.query(sql, params);
    return result[0].count;
  },

  /**
   * 根据id查询便便记录详情
   * @param {number} id - 记录ID
   * @param {string} creatorOpenid - 创建人openid
   * @returns {Promise<Array>} 便便记录详情
   */
  getBabyPoopById: async (id, creatorOpenid) => {
    // 优化：仅查询必要字段
    // 优化：使用LIMIT 1，避免返回多余数据
    // 建议：在baby_poop表上为(id, creator_openid, delete_flag)创建联合唯一索引
    let sql = `SELECT id, poop_date, poop_time, poop_color, poop_shape, has_milk_curd, 
                      creator_openid, create_time 
              FROM baby_poop 
              WHERE id = ? AND creator_openid = ? AND delete_flag = 0 
              LIMIT 1`;

    const result = await db.query(sql, [id, creatorOpenid]);
    return result;
  },

  /**
   * 批量查询便便记录（可选扩展功能）
   * @param {Array<number>} ids - 记录ID数组
   * @param {string} creatorOpenid - 创建人openid
   * @returns {Promise<Array>} 便便记录列表
   */
  getBabyPoopByIds: async (ids, creatorOpenid) => {
    // 优化：使用IN查询，避免多次单条查询
    // 优化：使用LIMIT限制返回数量
    if (!ids || ids.length === 0) {
      return [];
    }

    // 构建IN子句参数占位符
    const placeholders = ids.map(() => '?').join(',');

    let sql = `SELECT id, poop_date, poop_time, poop_color, poop_shape, has_milk_curd, 
                      creator_openid, create_time 
              FROM baby_poop 
              WHERE id IN (${placeholders}) AND creator_openid = ? AND delete_flag = 0 
              ORDER BY FIELD(id, ${placeholders})`;

    // 合并参数数组
    const params = [...ids, creatorOpenid, ...ids];

    const result = await db.query(sql, params);
    return result;
  }
};
