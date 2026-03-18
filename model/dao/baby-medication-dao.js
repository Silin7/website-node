/*
 * @Description: 宝宝用药记录模块数据访问层
 * @Author: Silin7
 * @Date: 2025-12-16
 */

const db = require("../mySQL");

module.exports = {
  // 新增用药记录
  addBabyMedication: async (medicationInfo, creatorOpenid) => {
    let sql = "INSERT INTO baby_medication(medication_date, medication_time, medication_name, dosage, " +
      "creator_openid) VALUES(?, ?, ?, ?, ?)";
    const result = await db.query(sql, [
      medicationInfo.medication_date,
      medicationInfo.medication_time,
      medicationInfo.medication_name,
      medicationInfo.dosage,
      creatorOpenid
    ]);

    return result;
  },

  // 修改用药记录
  updateBabyMedication: async (medicationInfo, creatorOpenid) => {
    let sql = "UPDATE baby_medication SET medication_date = ?, medication_time = ?, medication_name = ?, " +
      "dosage = ? WHERE id = ? AND " +
      "creator_openid = ? AND delete_flag = 0";
    const result = await db.query(sql, [
      medicationInfo.medication_date,
      medicationInfo.medication_time,
      medicationInfo.medication_name,
      medicationInfo.dosage,
      medicationInfo.id,
      creatorOpenid
    ]);

    return result;
  },

  // 软删除用药记录
  deleteBabyMedication: async (id, creatorOpenid) => {
    let sql = "UPDATE baby_medication SET delete_flag = 1 WHERE id = ? AND creator_openid = ? AND delete_flag = 0";
    const result = await db.query(sql, [id, creatorOpenid]);

    return result;
  },

  // 查询用户的用药记录列表（支持分页）
  getBabyMedicationList: async (creatorOpenid, page = 1, pageSize = 10, filters = {}) => {
    let sql = "SELECT id, medication_date, medication_time, medication_name, dosage, " +
      "creator_openid, create_time FROM baby_medication WHERE " +
      "creator_openid = ? AND delete_flag = 0";
    
    const params = [creatorOpenid];
    
    // 添加筛选条件
    if (filters.medication_date) {
      sql += " AND medication_date = ?";
      params.push(filters.medication_date);
    }
    
    if (filters.medication_name) {
      sql += " AND medication_name LIKE ?";
      params.push(`%${filters.medication_name}%`);
    }
    
    // 分页
    const offset = (page - 1) * pageSize;
    sql += " ORDER BY medication_date DESC, medication_time DESC LIMIT ? OFFSET ?";
    params.push(pageSize, offset);
    
    const result = await db.query(sql, params);
    return result;
  },

  // 查询用药记录总数（用于分页）
  getBabyMedicationCount: async (creatorOpenid, filters = {}) => {
    let sql = "SELECT COUNT(*) as count FROM baby_medication WHERE " +
      "creator_openid = ? AND delete_flag = 0";
    
    const params = [creatorOpenid];
    
    // 添加筛选条件
    if (filters.medication_date) {
      sql += " AND medication_date = ?";
      params.push(filters.medication_date);
    }
    
    if (filters.medication_name) {
      sql += " AND medication_name LIKE ?";
      params.push(`%${filters.medication_name}%`);
    }
    
    const result = await db.query(sql, params);
    return result[0].count;
  },

  // 根据id查询用药记录详情
  getBabyMedicationById: async (id, creatorOpenid) => {
    let sql = "SELECT id, medication_date, medication_time, medication_name, dosage, " +
      "creator_openid, create_time FROM baby_medication WHERE " +
      "id = ? AND creator_openid = ? AND delete_flag = 0 LIMIT 1";
    const result = await db.query(sql, [id, creatorOpenid]);
    
    return result;
  }
};
