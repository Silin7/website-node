/*
 * @Description: 模板轮播模块控制器层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const templateCarouselDao = require("../model/dao/template-carousel-dao");
const { sendResponse, sendSuccess, handleError, advancedValidate } = require("./utils/response-util");

module.exports = {
  // 新增模板轮播
  addTemplateCarousel: async (req, res) => {
    try {
      const { template_id, images, height, autoplay, interval } = req.body;

      try {
        const carouselInfo = {
          template_id,
          images,
          height,
          autoplay: autoplay !== undefined ? autoplay : 1,
          interval: interval || 3000
        };

        const result = await templateCarouselDao.addTemplateCarousel(carouselInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, { id: result.insertId }, "模板轮播新增成功");
        } else {
          sendResponse(res, 400, false, "模板轮播新增失败");
        }
      } catch (error) {
        handleError(res, error, "模板轮播新增失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 修改模板轮播信息
  updateTemplateCarousel: async (req, res) => {
    try {
      const { id, template_id, images, height, autoplay, interval } = req.body;
      if (!advancedValidate(res, { id }, {
        id: { required: true }
      })) return;

      try {
        const carouselInfo = {
          id,
          template_id,
          images,
          height,
          autoplay: autoplay !== undefined ? autoplay : 1,
          interval: interval || 3000
        };

        const result = await templateCarouselDao.updateTemplateCarousel(carouselInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "模板轮播修改成功");
        } else {
          sendResponse(res, 400, false, "模板轮播修改失败");
        }
      } catch (error) {
        handleError(res, error, "模板轮播修改失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 软删除模板轮播
  deleteTemplateCarousel: async (req, res) => {
    try {
      const { id } = req.body;
      if (!advancedValidate(res, { id }, {
        id: { required: true }
      })) return;

      try {
        const result = await templateCarouselDao.deleteTemplateCarousel(id);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "模板轮播删除成功");
        } else {
          sendResponse(res, 400, false, "模板轮播删除失败");
        }
      } catch (error) {
        handleError(res, error, "模板轮播删除失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询模板轮播列表
  getTemplateCarouselList: async (req, res) => {
    try {
      const { template_id } = req.query;

      try {
        const result = await templateCarouselDao.getTemplateCarouselList(template_id);
        sendSuccess(res, result, "模板轮播列表查询成功");
      } catch (error) {
        handleError(res, error, "模板轮播列表查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询模板轮播详情
  getTemplateCarouselDetail: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        sendResponse(res, 400, false, "缺少模板轮播ID");
        return;
      }

      try {
        const result = await templateCarouselDao.getTemplateCarouselById(id);
        if (result.length > 0) {
          sendSuccess(res, result[0], "模板轮播详情查询成功");
        } else {
          sendResponse(res, 404, false, "未找到该模板轮播");
        }
      } catch (error) {
        handleError(res, error, "模板轮播详情查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};