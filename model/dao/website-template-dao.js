/*
 * @Description: 网站模板模块业务模型层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const db = require("../mySQL");

module.exports = {
  // 新增模板
  addTemplate: async (templateInfo) => {
    let sql = "INSERT INTO website_template(page_id, template_name, title, `desc`) VALUES(?, ?, ?, ?)";
    try {
      const result = await db.query(sql, [
        templateInfo.page_id,
        templateInfo.template_name,
        templateInfo.title,
        templateInfo.desc
      ]);
      return result;
    } catch (error) {
      console.error('新增模板失败:', error);
      throw error;
    }
  },

  // 修改模板信息
  updateTemplate: async (templateInfo) => {
    let sql = "UPDATE website_template SET page_id = ?, template_name = ?, title = ?, `desc` = ? WHERE id = ? AND delflag = 0";
    try {
      const result = await db.query(sql, [
        templateInfo.page_id,
        templateInfo.template_name,
        templateInfo.title,
        templateInfo.desc,
        templateInfo.id
      ]);
      return result;
    } catch (error) {
      console.error('修改模板失败:', error);
      throw error;
    }
  },

  // 软删除模板
  deleteTemplate: async (id) => {
    let sql = "UPDATE website_template SET delflag = 1 WHERE id = ?";
    try {
      const result = await db.query(sql, [id]);
      return result;
    } catch (error) {
      console.error('删除模板失败:', error);
      throw error;
    }
  },

  // 查询模板列表
  getTemplateList: async (page_id) => {
    let sql = "SELECT * FROM website_template WHERE delflag = 0";
    const params = [];
    if (page_id) {
      sql += " AND page_id = ?";
      params.push(page_id);
    }
    sql += " ORDER BY createtime DESC";
    try {
      const result = await db.query(sql, params);
      return result;
    } catch (error) {
      console.error('查询模板列表失败:', error);
      throw error;
    }
  },

  // 根据id查询模板详情
  getTemplateById: async (id) => {
    let sql = "SELECT * FROM website_template WHERE id = ? AND delflag = 0 LIMIT 1";
    try {
      const result = await db.query(sql, [id]);
      return result;
    } catch (error) {
      console.error('查询模板详情失败:', error);
      throw error;
    }
  }
};