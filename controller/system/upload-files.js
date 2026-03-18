/*
 * cnpm install express-formidable
 * @Description: 上传文件
 * @Author: Silin7
 * @Date: 2022-11-12
 */

const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const { sendResponse, sendSuccess, handleError } = require("../utils/response-util");

/**
 * 上传文件
 */
const uploadFiles = async (req, res, next) => {
  try {
    const openid = req.headers.openid;
    const filepath = req.headers.filepath;

    // 验证必要的参数
    if (!openid || !filepath) {
      return sendResponse(res, 400, false, "缺少必要的参数：openid 或 filepath");
    }

    // 创建上传目录
    const uploadDir = path.join(
      __dirname,
      "../../../website-files",
      filepath,
      openid
    );

    // 使用同步方式创建目录（包括多级目录）
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 配置文件上传
    const form = new formidable.IncomingForm({
      uploadDir,
      keepExtensions: true, // 保留文件扩展名
      maxFileSize: 10 * 1024 * 1024 // 限制文件大小为10MB
    });

    // 解析表单数据
    form.parse(req, (err, fields, files) => {
      if (err) {
        return handleError(res, err, "文件上传失败");
      }

      // 检查是否有文件上传
      if (!files.file) {
        return sendResponse(res, 400, false, "未上传任何文件");
      }

      const file = files.file;
      // 随机生成文件名（防止重名）
      const randomName = Math.random().toString(36).substring(2, 12);
      // 提取文件原始扩展名
      const originalFileName = file.originalFilename;
      const lastDotIndex = originalFileName.lastIndexOf('.');
      const fileExtension = lastDotIndex !== -1 ? originalFileName.substring(lastDotIndex) : '';
      // 生成新的文件名（包含时间戳和随机数）
      const newFileName = `${Date.now()}-${randomName}${fileExtension}`;
      const renamedFilePath = path.join(uploadDir, newFileName);

      // 重命名文件
      fs.renameSync(file.filepath, renamedFilePath);

      // 构建返回的文件路径（使用相对路径，不包含完整系统路径）
      const returnPath = `/${filepath}/${openid}/${newFileName}`;

      // 返回成功响应
      sendSuccess(res, returnPath, "文件上传成功");

    });
  } catch (error) {
    handleError(res, error, "文件上传失败");
  }
};

module.exports = {
  uploadFiles,
};
