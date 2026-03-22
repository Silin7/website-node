/*
 * @Description: 全局配置信息
 * @Author: Silin7
 * @Date: 2022-08-15
 */

const path = require("path");

module.exports = {
  port: 3001, // 启动端口
  appid: "wxa8d13ccd82489844",
  secret: "fd896241ff293154871f7b208705a9cc",
  staticDir: path.resolve("./public"), // 静态资源路径
  uploadDir: path.join(__dirname, path.resolve("public/")), // 上传文件路径
  dbConfig: {
    // 数据库连接设置
    connectionLimit: 10,
    host: "39.106.44.146",
    user: "website-sql",
    password: "wsl6714785",
    database: "website-sql",
    timezone: "+08:00",
  },
};
