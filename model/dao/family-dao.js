/*
 * @Description: 家庭模块业务模型层
 * @Author: Silin7
 * @Date: 2024-09-27
 */

const db = require("../mySQL");

module.exports = {
  // 校验家庭验证码是否存在
  familyCheck: async (familycode) => {
    let sql = "SELECT * FROM family WHERE familycode = ? AND delflag = '0'";
    const result = await db.query(sql, [familycode]);
    return result;
  },

  // 新增家庭
  addFamily: async (userId, familyInfo) => {
    let sql = "INSERT INTO family (familycode, familyname, creator) VALUES (?, ?, ?)";
    const result = await db.query(sql, [familyInfo.familycode, familyInfo.familyname, userId]);
    return result;
  },

  // 删除家庭
  deleteFamily: async (userId, familyCode) => {
    let sql = "UPDATE family SET delflag = '1' WHERE familycode = ? AND creator = ?";
    const result = await db.query(sql, [familyCode, userId]);
    return result;
  },

  // 家庭详情
  getFamilyDetail: async (userId) => {
    let sql = "SELECT family.*, user_info.phone, user_info.nickname, user_info.avatar FROM family LEFT JOIN family_member ON family.familycode = family_member.familycode LEFT JOIN user_info ON family.creator = user_info.openid WHERE family_member.member = ? AND family.delflag = 0";
    const result = await db.query(sql, [userId]);
    return result;
  },

  // 家庭修改
  familyEdit: async (id, familyname, familycode) => {
    let sql = "UPDATE family SET familyname = ? WHERE familycode = ? AND id = ?";
    const result = await db.query(sql, [familyname, familycode, id]);
    return result;
  },

  // 查询家庭成员
  getFamilyMember: async (member) => {
    let sql = "SELECT family_member.*  FROM family_member INNER JOIN family ON family_member.familycode = family.familycode WHERE family_member.member = ? AND family_member.delflag = '0' AND family.delflag = '0'";
    const result = await db.query(sql, [member]);
    return result;
  },

  // 新增家庭成员
  addFamilyMember: async (userId, familyCode) => {
    let sql = `INSERT INTO family_member (familyid, familycode, member) SELECT id, '${familyCode}', '${userId}' FROM family WHERE familycode = '${familyCode}' AND delflag = '0'`;
    const result = await db.query(sql);
    return result;
  },

  // 家庭成员列表
  getFamilyMemberList: async (userId) => {
    let sql = "SELECT user_info.* FROM family_member LEFT JOIN user_info ON family_member.member = user_info.openid WHERE family_member.delflag = '0' AND family_member.familycode IN( SELECT familycode FROM family_member WHERE member = ? AND delflag = '0')";
    const result = await db.query(sql, [userId]);
    return result;
  },

  // 删除家庭成员（按家庭码）
  deleteFamilyMember: async (member) => {
    let sql = "UPDATE family_member SET delflag = '1' WHERE member = ?";
    const result = await db.query(sql, [member]);
    // 无法确定具体用户，不删除用户相关缓存
    return result;
  },

  // 修改家庭成员
  updateFamilyMember: async (member, feedingRole) => {
    let sql = "UPDATE family_member SET feeding_role = ? WHERE member = ?";
    const result = await db.query(sql, [feedingRole, member]);
    return result;
  },
};
