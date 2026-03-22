/*
 * @Description: 模板文本模块控制器层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const templateTextDao = require("../model/dao/template-text-dao");
const { sendResponse, sendSuccess, handleError, advancedValidate } = require("./utils/response-util");

module.exports = {
  // 新增模板文本
  addTemplateText: async (req, res) => {
    try {
      const { template_id, title, desc } = req.body;
      if (!advancedValidate(res, { template_id }, {
        template_id: { required: true }
      })) return;

      try {
        const textInfo = {
          template_id,
          title,
          desc
        };

        const result = await templateTextDao.addTemplateText(textInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, { id: result.insertId }, "模板文本新增成功");
        } else {
          sendResponse(res, 400, false, "模板文本新增失败");
        }
      } catch (error) {
        handleError(res, error, "模板文本新增失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 修改模板文本信息
  updateTemplateText: async (req, res) => {
    try {
      const { id, template_id, title, desc } = req.body;
      if (!advancedValidate(res, { id, template_id }, {
        id: { required: true },
        template_id: { required: true }
      })) return;

      try {
        const textInfo = {
          id,
          template_id,
          title,
          desc
        };

        const result = await templateTextDao.updateTemplateText(textInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "模板文本修改成功");
        } else {
          sendResponse(res, 400, false, "模板文本修改失败");
        }
      } catch (error) {
        handleError(res, error, "模板文本修改失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 软删除模板文本
  deleteTemplateText: async (req, res) => {
    try {
      const { id } = req.body;
      if (!advancedValidate(res, { id }, {
        id: { required: true }
      })) return;

      try {
        const result = await templateTextDao.deleteTemplateText(id);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "模板文本删除成功");
        } else {
          sendResponse(res, 400, false, "模板文本删除失败");
        }
      } catch (error) {
        handleError(res, error, "模板文本删除失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询模板文本列表
  getTemplateTextList: async (req, res) => {
    try {
      const { template_id } = req.query;

      try {
        const result = await templateTextDao.getTemplateTextList(template_id);
        sendSuccess(res, result, "模板文本列表查询成功");
      } catch (error) {
        handleError(res, error, "模板文本列表查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询模板文本详情
  getTemplateTextDetail: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        sendResponse(res, 400, false, "缺少模板文本ID");
        return;
      }

      try {
        const result = await templateTextDao.getTemplateTextById(id);
        if (result.length > 0) {
          sendSuccess(res, result[0], "模板文本详情查询成功");
        } else {
          sendResponse(res, 404, false, "未找到该模板文本");
        }
      } catch (error) {
        handleError(res, error, "模板文本详情查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};