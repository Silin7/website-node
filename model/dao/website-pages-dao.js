/*
 * @Description: 网站页面模块业务模型层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const db = require("../mySQL");

module.exports = {
  // 新增页面
  addPage: async (pageInfo) => {
    let sql = "INSERT INTO website_pages(page_name, file_name) VALUES(?, ?)";
    try {
      const result = await db.query(sql, [
        pageInfo.page_name,
        pageInfo.file_name
      ]);
      return result;
    } catch (error) {
      console.error('新增页面失败:', error);
      throw error;
    }
  },

  // 修改页面信息
  updatePage: async (pageInfo) => {
    let sql = "UPDATE website_pages SET page_name = ?, file_name = ? WHERE id = ? AND delflag = 0";
    const result = await db.query(sql, [
      pageInfo.page_name,
      pageInfo.file_name,
      pageInfo.id
    ]);

    return result;
  },

  // 软删除页面
  deletePage: async (id) => {
    let sql = "UPDATE website_pages SET delflag = 1 WHERE id = ?";
    const result = await db.query(sql, [id]);

    return result;
  },

  // 查询页面列表
  getPageList: async () => {
    let sql = "SELECT * FROM website_pages WHERE delflag = 0 ORDER BY createtime DESC";
    const result = await db.query(sql);
    return result;
  },

  // 根据id查询页面详情
  getPageById: async (id) => {
    let sql = "SELECT * FROM website_pages WHERE id = ? AND delflag = 0 LIMIT 1";
    const result = await db.query(sql, [id]);
    return result;
  }
};