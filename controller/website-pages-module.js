/*
 * @Description: 网站页面模块控制器层
 * @Author: Silin7
 * @Date: 2026-03-22
 */

const websitePagesDao = require("../model/dao/website-pages-dao");
const { sendResponse, sendSuccess, handleError, advancedValidate } = require("./utils/response-util");

module.exports = {
  // 新增页面
  addPage: async (req, res) => {
    try {
      const { page_name, file_name } = req.body;
      if (!advancedValidate(res, { page_name, file_name }, {
        page_name: { required: true },
        file_name: { required: true }
      })) return;

      try {
        const pageInfo = {
          page_name,
          file_name
        };

        const result = await websitePagesDao.addPage(pageInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, { id: result.insertId }, "页面新增成功");
        } else {
          sendResponse(res, 400, false, "页面新增失败");
        }
      } catch (error) {
        handleError(res, error, "页面新增失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 修改页面信息
  updatePage: async (req, res) => {
    try {
      const { id, page_name, file_name } = req.body;
      if (!advancedValidate(res, { id, page_name, file_name }, {
        id: { required: true },
        page_name: { required: true },
        file_name: { required: true }
      })) return;

      try {
        const pageInfo = {
          id,
          page_name,
          file_name
        };

        const result = await websitePagesDao.updatePage(pageInfo);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "页面修改成功");
        } else {
          sendResponse(res, 400, false, "页面修改失败");
        }
      } catch (error) {
        handleError(res, error, "页面修改失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 软删除页面
  deletePage: async (req, res) => {
    try {
      const { id } = req.body;
      if (!advancedValidate(res, { id }, {
        id: { required: true }
      })) return;

      try {
        const result = await websitePagesDao.deletePage(id);
        if (result.affectedRows > 0) {
          sendSuccess(res, {}, "页面删除成功");
        } else {
          sendResponse(res, 400, false, "页面删除失败");
        }
      } catch (error) {
        handleError(res, error, "页面删除失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询页面列表
  getPageList: async (req, res) => {
    try {
      try {
        const result = await websitePagesDao.getPageList();
        sendSuccess(res, result, "页面列表查询成功");
      } catch (error) {
        handleError(res, error, "页面列表查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询页面详情
  getPageDetail: async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        sendResponse(res, 400, false, "缺少页面ID");
        return;
      }

      try {
        const result = await websitePagesDao.getPageById(id);
        if (result.length > 0) {
          sendSuccess(res, result[0], "页面详情查询成功");
        } else {
          sendResponse(res, 404, false, "未找到该页面");
        }
      } catch (error) {
        handleError(res, error, "页面详情查询失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};