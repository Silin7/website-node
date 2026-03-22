/*
 * @Description: 模板图片模块业务模型层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const db = require("../mySQL");

module.exports = {
  // 新增模板图片
  addTemplateImage: async (imageInfo) => {
    let sql = "INSERT INTO template_image(template_id, title, image, `desc`) VALUES(?, ?, ?, ?)";
    try {
      const result = await db.query(sql, [
        imageInfo.template_id,
        imageInfo.title,
        imageInfo.image,
        imageInfo.desc
      ]);
      return result;
    } catch (error) {
      console.error('新增模板图片失败:', error);
      throw error;
    }
  },

  // 修改模板图片信息
  updateTemplateImage: async (imageInfo) => {
    let sql = "UPDATE template_image SET template_id = ?, title = ?, image = ?, `desc` = ? WHERE id = ? AND delflag = 0";
    try {
      const result = await db.query(sql, [
        imageInfo.template_id,
        imageInfo.title,
        imageInfo.image,
        imageInfo.desc,
        imageInfo.id
      ]);
      return result;
    } catch (error) {
      console.error('修改模板图片失败:', error);
      throw error;
    }
  },

  // 软删除模板图片
  deleteTemplateImage: async (id) => {
    let sql = "UPDATE template_image SET delflag = 1 WHERE id = ?";
    try {
      const result = await db.query(sql, [id]);
      return result;
    } catch (error) {
      console.error('删除模板图片失败:', error);
      throw error;
    }
  },

  // 查询模板图片列表
  getTemplateImageList: async (template_id) => {
    let sql = "SELECT * FROM template_image WHERE delflag = 0";
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
      console.error('查询模板图片列表失败:', error);
      throw error;
    }
  },

  // 根据id查询模板图片详情
  getTemplateImageById: async (id) => {
    let sql = "SELECT * FROM template_image WHERE id = ? AND delflag = 0 LIMIT 1";
    try {
      const result = await db.query(sql, [id]);
      return result;
    } catch (error) {
      console.error('查询模板图片详情失败:', error);
      throw error;
    }
  }
};