/*
 * @Description: 模板文本模块业务模型层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const db = require("../mySQL");

module.exports = {
  // 新增模板文本
  addTemplateText: async (textInfo) => {
    let sql = "INSERT INTO template_text(template_id, title, `desc`) VALUES(?, ?, ?)";
    try {
      const result = await db.query(sql, [
        textInfo.template_id,
        textInfo.title,
        textInfo.desc
      ]);
      return result;
    } catch (error) {
      console.error('新增模板文本失败:', error);
      throw error;
    }
  },

  // 修改模板文本信息
  updateTemplateText: async (textInfo) => {
    let sql = "UPDATE template_text SET template_id = ?, title = ?, `desc` = ? WHERE id = ? AND delflag = 0";
    try {
      const result = await db.query(sql, [
        textInfo.template_id,
        textInfo.title,
        textInfo.desc,
        textInfo.id
      ]);
      return result;
    } catch (error) {
      console.error('修改模板文本失败:', error);
      throw error;
    }
  },

  // 软删除模板文本
  deleteTemplateText: async (id) => {
    let sql = "UPDATE template_text SET delflag = 1 WHERE id = ?";
    try {
      const result = await db.query(sql, [id]);
      return result;
    } catch (error) {
      console.error('删除模板文本失败:', error);
      throw error;
    }
  },

  // 查询模板文本列表
  getTemplateTextList: async (template_id) => {
    let sql = "SELECT * FROM template_text WHERE delflag = 0";
    const params = [];
    if (template_id) {
      sql += " AND template_id = ?";
      params.push(template_id);
    }
    sql += " ORDER BY createtime DESC";
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      console.error('查询模板文本列表失败:', error);
      throw error;
    }
  },

  // 根据id查询模板文本详情
  getTemplateTextById: async (id) => {
    let sql = "SELECT * FROM template_text WHERE id = ? AND delflag = 0 LIMIT 1";
    try {
      const result = await db.query(sql, [id]);
      return result;
    } catch (error) {
      console.error('查询模板文本详情失败:', error);
      throw error;
    }
  }
};