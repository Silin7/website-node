/*
 * @Description: 网站模板模块控制器层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const websiteTemplateDao = require("../model/dao/website-template-dao");
const { sendResponse, sendSuccess, handleError, advancedValidate } = require("./utils/response-util");

module.exports = {
  // 新增模板
  addTemplate: async (req, res) => {
    try {
      const { page_id, template_name, title, desc } = req.body;
      if (!advancedValidate(res, { page_id, template_name }, {
        page_id: { required: true },
        template_name: { required: true }
      })) return;

      try {
        const templateInfo = {
          page_id,
          template_name,
          title,
          desc
        };

        const result = await websiteTemplateDao.addTemplate(templateInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, { id: result.insertId }, "模板新增成功");
        } else {
          sendResponse(res, 400, false, "模板新增失败");
        }
      } catch (error) {
        handleError(res, error, "模板新增失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 修改模板信息
  updateTemplate: async (req, res) => {
    try {
      const { id, page_id, template_name, title, desc } = req.body;
      if (!advancedValidate(res, { id, page_id, template_name }, {
        id: { required: true },
        page_id: { required: true },
        template_name: { required: true }
      })) return;

      try {
        const templateInfo = {
          id,
          page_id,
          template_name,
          title,
          desc
        };

        const result = await websiteTemplateDao.updateTemplate(templateInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "模板修改成功");
        } else {
          sendResponse(res, 400, false, "模板修改失败");
        }
      } catch (error) {
        handleError(res, error, "模板修改失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 软删除模板
  deleteTemplate: async (req, res) => {
    try {
      const { id } = req.body;
      if (!advancedValidate(res, { id }, {
        id: { required: true }
      })) return;

      try {
        const result = await websiteTemplateDao.deleteTemplate(id);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "模板删除成功");
        } else {
          sendResponse(res, 400, false, "模板删除失败");
        }
      } catch (error) {
        handleError(res, error, "模板删除失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询模板列表
  getTemplateList: async (req, res) => {
    try {
      const { page_id } = req.query;

      try {
        const result = await websiteTemplateDao.getTemplateList(page_id);
        sendSuccess(res, result, "模板列表查询成功");
      } catch (error) {
        handleError(res, error, "模板列表查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询模板详情
  getTemplateDetail: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        sendResponse(res, 400, false, "缺少模板ID");
        return;
      }

      try {
        const result = await websiteTemplateDao.getTemplateById(id);
        if (result.length > 0) {
          sendSuccess(res, result[0], "模板详情查询成功");
        } else {
          sendResponse(res, 404, false, "未找到该模板");
        }
      } catch (error) {
        handleError(res, error, "模板详情查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};