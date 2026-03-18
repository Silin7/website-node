/*
 * @Description: 统一响应处理工具
 * @Author: Silin7
 * @Date: 2024-09-27
 */

// 错误类型枚举
const ErrorTypes = {
  PARAM_ERROR: '参数错误',
  BUSINESS_ERROR: '业务错误',
  DATABASE_ERROR: '数据库错误',
  NETWORK_ERROR: '网络错误',
  AUTH_ERROR: '认证错误',
  SYSTEM_ERROR: '系统错误'
};

// 统一响应处理
const sendResponse = (res, statusCode, success, message, data = null, metadata = null) => {
  const response = {
    code: success ? 0 : -1,
    message,
    data
  };

  // 如果有元数据（如分页信息），则添加到响应中
  if (metadata) {
    response.metadata = metadata;
  }

  // 明确设置Content-Type为UTF-8
  res.status(statusCode).json(response);
};

// 成功响应
const sendSuccess = (res, data = null, message = "操作成功") => {
  sendResponse(res, 200, true, message, data);
};

// 分页响应
const sendPagination = (res, data, total, page, pageSize, message = "操作成功") => {
  const metadata = {
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
  sendResponse(res, 200, true, message, data, metadata);
};

// 统一错误处理
const handleError = (res, error, message = "操作失败", errorType = ErrorTypes.BUSINESS_ERROR) => {
  // 根据错误类型设置状态码
  let statusCode = 500;
  switch (errorType) {
    case ErrorTypes.PARAM_ERROR:
      statusCode = 400;
      break;
    case ErrorTypes.AUTH_ERROR:
      statusCode = 401;
      break;
    case ErrorTypes.BUSINESS_ERROR:
      statusCode = 403;
      break;
    case ErrorTypes.NETWORK_ERROR:
      statusCode = 502;
      break;
    default:
      statusCode = 500;
  }

  sendResponse(res, statusCode, false, message);
};

// 参数验证
const validateParams = (res, params) => {
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      handleError(res, new Error(`${key}参数缺失`), `${key}参数缺失！`, ErrorTypes.PARAM_ERROR);
      return false;
    }
  }
  return true;
};

// 高级参数验证
const advancedValidate = (res, params, rules) => {
  for (const [key, rule] of Object.entries(rules)) {
    const value = params[key];

    // 检查必填项
    if (rule.required && (value === undefined || value === null || value === '')) {
      handleError(res, new Error(`${key}参数缺失`), `${key}参数缺失！`, ErrorTypes.PARAM_ERROR);
      return false;
    }

    // 如果参数不存在且不是必填项，则跳过后续验证
    if (value === undefined || value === null) continue;

    // 类型检查
    if (rule.type && typeof value !== rule.type) {
      handleError(res, new Error(`${key}参数类型错误`), `${key}参数类型错误，期望${rule.type}！`, ErrorTypes.PARAM_ERROR);
      return false;
    }

    // 长度检查
    if (rule.minLength && value.length < rule.minLength) {
      handleError(res, new Error(`${key}参数长度不足`), `${key}参数长度不能少于${rule.minLength}！`, ErrorTypes.PARAM_ERROR);
      return false;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      handleError(res, new Error(`${key}参数长度过长`), `${key}参数长度不能超过${rule.maxLength}！`, ErrorTypes.PARAM_ERROR);
      return false;
    }

    // 正则表达式验证
    if (rule.pattern && !rule.pattern.test(value)) {
      handleError(res, new Error(`${key}参数格式错误`), `${key}参数格式错误！`, ErrorTypes.PARAM_ERROR);
      return false;
    }
  }

  return true;
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendPagination,
  handleError,
  validateParams,
  advancedValidate,
  ErrorTypes
};
