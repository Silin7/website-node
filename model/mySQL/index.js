const mysql = require("mysql2");

const { dbConfig } = require("../../config");

// 创建连接池
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,  // 等待可用连接
  queueLimit: 0  // 连接池排队限制
});

// 连接池错误处理
pool.on('error', (err) => {
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
  }
});

const db = {};

/**
 * 数据库查询方法
 * @param {string} sql - SQL语句
 * @param {Array} params - 参数数组
 * @returns {Promise} 查询结果
 */
db.query = async (sql, params = []) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(new Error('数据库连接失败'));
      }

      connection.query(sql, params, (error, results, fields) => {
        // 无论成功与否都释放连接
        connection.release();

        if (error) {
          return reject(new Error('数据库查询失败'));
        }

        resolve(results);
      });
    });
  });
};

/**
 * 数据库事务处理
 * @param {Function} callback - 事务回调函数
 * @returns {Promise} 事务结果
 */
db.transaction = (callback) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }

      // 开始事务
      connection.beginTransaction(async (beginErr) => {
        if (beginErr) {
          connection.release();
          return reject(beginErr);
        }

        try {
          // 执行回调中的事务操作
          const result = await callback(connection);

          // 提交事务
          connection.commit((commitErr) => {
            connection.release();
            if (commitErr) {
              return reject(commitErr);
            }
            resolve(result);
          });
        } catch (error) {
          // 回滚事务
          connection.rollback(() => {
            connection.release();
            reject(error);
          });
        }
      });
    });
  });
};

module.exports = db;
