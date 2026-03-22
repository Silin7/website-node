/*
 * @Description: 模板轮播模块业务模型层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const db = require("../mySQL");

module.exports = {
  // 新增模板轮播
  addTemplateCarousel: async (carouselInfo) => {
    let sql = "INSERT INTO template_carousel(template_id, images, height, autoplay, `interval`) VALUES(?, ?, ?, ?, ?)";
    try {
      const result = await db.query(sql, [
        carouselInfo.template_id,
        carouselInfo.images,
        carouselInfo.height,
        carouselInfo.autoplay,
        carouselInfo.interval
      ]);
      return result;
    } catch (error) {
      console.error('新增模板轮播失败:', error);
      throw error;
    }
  },

  // 修改模板轮播信息
  updateTemplateCarousel: async (carouselInfo) => {
    let sql = "UPDATE template_carousel SET template_id = ?, images = ?, height = ?, autoplay = ?, `interval` = ? WHERE id = ? AND delflag = 0";
    try {
      const result = await db.query(sql, [
        carouselInfo.template_id,
        carouselInfo.images,
        carouselInfo.height,
        carouselInfo.autoplay,
        carouselInfo.interval,
        carouselInfo.id
      ]);
      return result;
    } catch (error) {
      console.error('修改模板轮播失败:', error);
      throw error;
    }
  },

  // 软删除模板轮播
  deleteTemplateCarousel: async (id) => {
    let sql = "UPDATE template_carousel SET delflag = 1 WHERE id = ?";
    try {
      const result = await db.query(sql, [id]);
      return result;
    } catch (error) {
      console.error('删除模板轮播失败:', error);
      throw error;
    }
  },

  // 查询模板轮播列表
  getTemplateCarouselList: async (template_id) => {
    let sql = "SELECT * FROM template_carousel WHERE delflag = 0";
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
      console.error('查询模板轮播列表失败:', error);
      throw error;
    }
  },

  // 根据id查询模板轮播详情
  getTemplateCarouselById: async (id) => {
    let sql = "SELECT * FROM template_carousel WHERE id = ? AND delflag = 0 LIMIT 1";
    try {
      const result = await db.query(sql, [id]);
      return result;
    } catch (error) {
      console.error('查询模板轮播详情失败:', error);
      throw error;
    }
  }
};