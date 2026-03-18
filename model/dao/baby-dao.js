/*
 * @Description: 宝宝信息模块业务模型层
 * @Author: Silin7
 * @Date: 2025-04-07
 */

const db = require("../mySQL");

module.exports = {
  // 新增宝宝
  addBaby: async (babyInfo, creatorOpenid) => {
    let sql = "INSERT INTO baby_info(family_id, baby_avatar, baby_name, baby_gender, birth_date, " +
      "creator_openid) VALUES(?, ?, ?, ?, ?, ?)";
    const result = await db.query(sql, [
      babyInfo.family_id,
      babyInfo.baby_avatar,
      babyInfo.baby_name,
      babyInfo.baby_gender,
      babyInfo.birth_date,
      creatorOpenid
    ]);

    return result;
  },

  // 修改宝宝信息
  updateBaby: async (babyInfo, creatorOpenid) => {
    let sql = "UPDATE baby_info SET baby_avatar = ?, baby_name = ?, " +
      "baby_gender = ?, birth_date = ? WHERE id = ? AND " +
      "creator_openid = ? AND delete_flag = 0";
    const result = await db.query(sql, [
      babyInfo.baby_avatar,
      babyInfo.baby_name,
      babyInfo.baby_gender,
      babyInfo.birth_date,
      babyInfo.id,
      creatorOpenid
    ]);

    return result;
  },

  // 软删除单个宝宝
  deleteBaby: async (id) => {
    let sql = "UPDATE baby_info SET delete_flag = 1 WHERE id = ?";
    const result = await db.query(sql, [id]);

    return result;
  },

  // 查询某个用户的所有宝宝列表
  getBabyList: async (family_id) => {
    let sql = "SELECT * FROM baby_info WHERE family_id = ? AND delete_flag = 0 ORDER BY create_time DESC";
    const result = await db.query(sql, [family_id]);
    return result;
  },

  // 根据id查询宝宝详情
  getBabyById: async (id) => {
    let sql = "SELECT * FROM baby_info WHERE id = ? AND delete_flag = 0 LIMIT 1";
    const result = await db.query(sql, [id]);
    return result;
  }
};