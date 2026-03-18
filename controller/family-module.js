/*
 * @Description: 家庭模块控制器层
 * @Author: Silin7
 * @Date: 2024-09-27
 */

const familyDao = require("../model/dao/family-dao");
const { sendResponse, sendSuccess, handleError, validateParams, advancedValidate } = require("./utils/response-util");

module.exports = {
  // 新增家庭
  familyAdd: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { familycode, familyname } = req.body;
        if (!advancedValidate(res, { familycode, familyname }, {
          familycode: { required: true },
          familyname: { required: true }
        })) return;

        try {
          // 校验家庭码是否存在
          const familyCheckResult = await familyDao.familyCheck(familycode);
          if (familyCheckResult.length > 0) {
            sendResponse(res, 400, false, "家庭码已存在！");
            return;
          }

          // 校验用户是否已在家庭中
          const memberCheckResult = await familyDao.getFamilyMember(userId);
          if (memberCheckResult.length > 0) {
            sendResponse(res, 400, false, "您已在家庭中！");
            return;
          }

          // 新增家庭
          const familyAddResult = await familyDao.addFamily(userId, { familycode, familyname });
          if (familyAddResult.affectedRows > 0) {
            // 新增家庭成员
            const memberAddResult = await familyDao.addFamilyMember(userId, familycode);
            if (memberAddResult.affectedRows > 0) {
              sendSuccess(res, null, "新增家庭成功！");
              return;
            } else {
              sendResponse(res, 500, false, "新增家庭成员失败！");
              return;
            }
          } else {
            sendResponse(res, 500, false, "新增家庭失败！");
            return;
          }
        } catch (error) {
          handleError(res, error, "新增家庭失败！");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  // 删除家庭
  familyDel: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { familycode, member } = req.query;
        try {
          // 删除家庭
          const familyDelResult = await familyDao.deleteFamily(userId, familycode);
          if (familyDelResult.affectedRows > 0) {
            // 删除家庭成员
            const memberDelResult = await familyDao.deleteFamilyMember(member);
            if (memberDelResult.affectedRows > 0) {
              sendSuccess(res, null, "删除家庭成功！");
              return;
            } else {
              sendResponse(res, 500, false, "删除家庭成员失败！");
              return;
            }
          } else {
            sendResponse(res, 500, false, "删除家庭失败！");
            return;
          }
        } catch (error) {
          handleError(res, error, "删除家庭失败！");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  // 家庭详情
  familyDetail: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        try {
          // 查询家庭详情
          const detailResult = await familyDao.getFamilyDetail(userId);
          if (detailResult.length > 0) {
            sendSuccess(res, detailResult[0] || {}, "查询家庭详情成功！");
            return;
          } else {
            sendResponse(res, 404, false, "未找到家庭详情！");
            return;
          }
        } catch (error) {
          handleError(res, error, "查询家庭详情失败！");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  // 家庭修改
  familyEdit: async (req, res) => {
    try {
      let Authorization = req.user_id;
      if (Authorization) {
        const { id, familyname, familycode } = req.query;
        if (!advancedValidate(res, { id, familyname, familycode }, {
          id: { required: true },
          familyname: { required: true },
          familycode: { required: true }
        })) return;

        try {
          // 修改家庭信息
          const editResult = await familyDao.familyEdit(id, familyname, familycode);
          if (editResult.affectedRows > 0) {
            sendSuccess(res, null, "修改家庭信息成功！");
            return;
          } else {
            sendResponse(res, 500, false, "修改家庭信息失败！");
            return;
          }
        } catch (error) {
          handleError(res, error, "修改家庭信息失败！");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  // 查询家庭成员
  familymemberQuery: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        try {
          const member = req.query.member;
          // 查询家庭成员
          const memberQueryResult = await familyDao.getFamilyMember(member);
          if (memberQueryResult.length > 0) {
            sendSuccess(res, memberQueryResult[0] || {}, "查询家庭成员成功！");
            return;
          } else {
            sendResponse(res, 404, false, "未找到家庭成员！");
            return;
          }
        } catch (error) {
          handleError(res, error, "查询家庭成员失败！");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  // 新增家庭成员
  familymemberAdd: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { familycode } = req.query;
        if (!advancedValidate(res, { familycode }, { familycode: { required: true } })) return;

        try {
          // 校验家庭码是否存在
          const familyCheckResult = await familyDao.familyCheck(familycode);
          if (familyCheckResult.length > 0) {
            // 校验用户是否已在家庭中
            const memberCheckResult = await familyDao.getFamilyMember(userId);
            if (memberCheckResult.length > 0) {
              sendResponse(res, 400, false, "您已在家庭中！");
              return;
            }

            // 新增家庭成员
            const memberAddResult = await familyDao.addFamilyMember(userId, familycode);
            if (memberAddResult.affectedRows > 0) {
              sendSuccess(res, null, "加入家庭成功！");
              return;
            } else {
              sendResponse(res, 500, false, "加入家庭失败！");
              return;
            }
          } else {
            sendResponse(res, 404, false, "家庭不存在！");
            return;
          }
        } catch (error) {
          handleError(res, error, "加入家庭失败！");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  // 删除家庭成员
  familymemberDel: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { member } = req.query;
        // 删除家庭成员
        const memberDelResult = await familyDao.deleteFamilyMember(member);
        if (memberDelResult.affectedRows > 0) {
          sendSuccess(res, null, "删除家庭成员成功！");
          return;
        } else {
          sendResponse(res, 500, false, "删除家庭成员失败！");
          return;
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  // 家庭成员列表
  familymemberList: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        try {
          // 查询家庭成员列表
          const memberListResult = await familyDao.getFamilyMemberList(userId);
          if (memberListResult.length > 0) {
            sendSuccess(res, memberListResult, "查询家庭成员列表成功！");
            return;
          } else {
            sendResponse(res, 404, false, "未找到家庭成员列表！");
            return;
          }
        } catch (error) {
          handleError(res, error, "查询家庭成员列表失败！");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error);
    }
  },

  // 修改家庭成员
  familymemberEdit: async (req, res) => {
    try {
      let userId = req.user_id;
      if (userId) {
        const { member, feedingRole } = req.query;
        try {
          // 修改家庭成员
          const memberEditResult = await familyDao.updateFamilyMember(member, feedingRole);
          if (memberEditResult.affectedRows > 0) {
            sendSuccess(res, null, "修改家庭成员成功！");
            return;
          } else {
            sendResponse(res, 500, false, "修改家庭成员失败！");
            return;
          }
        } catch (error) {
          handleError(res, error, "修改家庭成员失败！");
        }
      } else {
        sendResponse(res, 401, false, "身份验证失败");
      }
    } catch (error) {
      handleError(res, error);
    }
  }
};
