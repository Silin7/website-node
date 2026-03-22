/*
 * @Description: 模板图片模块控制器层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const templateImageDao = require("../model/dao/template-image-dao");
const { sendResponse, sendSuccess, handleError, advancedValidate } = require("./utils/response-util");

module.exports = {
  // 新增模板图片
  addTemplateImage: async (req, res) => {
    try {
      const { template_id, title, image, desc } = req.body;
      if (!advancedValidate(res, { template_id }, {
        template_id: { required: true }
      })) return;

      try {
        const imageInfo = {
          template_id,
          title,
          image,
          desc
        };

        const result = await templateImageDao.addTemplateImage(imageInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, { id: result.insertId }, "模板图片新增成功");
        } else {
          sendResponse(res, 400, false, "模板图片新增失败");
        }
      } catch (error) {
        handleError(res, error, "模板图片新增失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 修改模板图片信息
  updateTemplateImage: async (req, res) => {
    try {
      const { id, template_id, title, image, desc } = req.body;
      if (!advancedValidate(res, { id, template_id }, {
        id: { required: true },
        template_id: { required: true }
      })) return;

      try {
        const imageInfo = {
          id,
          template_id,
          title,
          image,
          desc
        };

        const result = await templateImageDao.updateTemplateImage(imageInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "模板图片修改成功");
        } else {
          sendResponse(res, 400, false, "模板图片修改失败");
        }
      } catch (error) {
        handleError(res, error, "模板图片修改失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 软删除模板图片
  deleteTemplateImage: async (req, res) => {
    try {
      const { id } = req.body;
      if (!advancedValidate(res, { id }, {
        id: { required: true }
      })) return;

      try {
        const result = await templateImageDao.deleteTemplateImage(id);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "模板图片删除成功");
        } else {
          sendResponse(res, 400, false, "模板图片删除失败");
        }
      } catch (error) {
        handleError(res, error, "模板图片删除失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询模板图片列表
  getTemplateImageList: async (req, res) => {
    try {
      const { template_id } = req.query;

      try {
        const result = await templateImageDao.getTemplateImageList(template_id);
        sendSuccess(res, result, "模板图片列表查询成功");
      } catch (error) {
        handleError(res, error, "模板图片列表查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询模板图片详情
  getTemplateImageDetail: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        sendResponse(res, 400, false, "缺少模板图片ID");
        return;
      }

      try {
        const result = await templateImageDao.getTemplateImageById(id);
        if (result.length > 0) {
          sendSuccess(res, result[0], "模板图片详情查询成功");
        } else {
          sendResponse(res, 404, false, "未找到该模板图片");
        }
      } catch (error) {
        handleError(res, error, "模板图片详情查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};