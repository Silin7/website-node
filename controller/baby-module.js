/*
 * @Description: 宝宝信息模块控制器层
 * @Author: Silin7
 * @Date: 2025-04-07
 */

const babyDao = require("../model/dao/baby-dao");
const { sendResponse, sendSuccess, handleError, advancedValidate } = require("./utils/response-util");

module.exports = {
  // 新增宝宝
  addBaby: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { family_id, baby_avatar, baby_name, baby_gender, birth_date } = req.body;
        try {
          const babyInfo = {
            family_id,
            baby_avatar,
            baby_name,
            baby_gender,
            birth_date
          };

          const result = await babyDao.addBaby(babyInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, { id: result.insertId }, "宝宝信息新增成功");
          } else {
            sendResponse(res, 400, false, "宝宝信息新增失败");
          }
        } catch (error) {
          handleError(res, error, "宝宝信息新增失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 修改宝宝信息
  updateBaby: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id, baby_avatar, baby_name, baby_gender, birth_date } = req.body;
        if (!advancedValidate(res, { id, baby_avatar, baby_name, baby_gender, birth_date }, {
          id: { required: true },
          baby_avatar: { required: true },
          baby_name: { required: true },
          baby_gender: { required: true },
          birth_date: { required: true }
        })) return;

        try {
          const babyInfo = {
            id,
            baby_avatar,
            baby_name,
            baby_gender,
            birth_date
          };

          const result = await babyDao.updateBaby(babyInfo, userId);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "宝宝信息修改成功");
          } else {
            sendResponse(res, 400, false, "宝宝信息修改失败");
          }
        } catch (error) {
          handleError(res, error, "宝宝信息修改失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 软删除宝宝
  deleteBaby: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.body;
        try {
          const result = await babyDao.deleteBaby(id);
          if (result.affectedRows > 0) {
            sendSuccess(res, {}, "宝宝信息删除成功");
          } else {
            sendResponse(res, 400, false, "宝宝信息删除失败");
          }
        } catch (error) {
          handleError(res, error, "宝宝信息删除失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询宝宝列表
  getBabyList: async (req, res) => {
    try {
      let familyid = req.query.familyid;

      if (familyid) {
        try {
          const result = await babyDao.getBabyList(familyid);
          sendSuccess(res, result, "宝宝列表查询成功");
        } catch (error) {
          handleError(res, error, "宝宝列表查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  },

  // 查询宝宝详情
  getBabyDetail: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { id } = req.query;
        try {
          const result = await babyDao.getBabyById(id);
          if (result.length > 0) {
            // 验证宝宝是否属于当前用户
            if (result[0].creator_openid === userId) {
              sendSuccess(res, result[0], "宝宝详情查询成功");
            } else {
              sendResponse(res, 403, false, "无访问权限");
            }
          } else {
            sendResponse(res, 404, false, "未找到该宝宝");
          }
        } catch (error) {
          handleError(res, error, "宝宝详情查询失败");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error, "系统错误");
    }
  }
};
