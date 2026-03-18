/*
 * @Description: 定时任务
 * @Author: Silin7
 * @Date: 2022-10-17
 */
const schedule = require("node-schedule");
const loginDao = require("../../model/dao/login-dao");
const pushMessage = require("./push-message");
// 引入日志工具
const logger = require('../utils/logger');

// 定时推送记账提醒
const pushMessageSchedule = () => {
  logger.info('定时推送记账提醒任务已启动，每天20:00执行');

  schedule.scheduleJob("0 0 20 * * *", () => {
    logger.info('开始执行每日记账提醒推送');

    loginDao.getUserList().then((userList) => {
      logger.info(`获取到${userList.length}个用户需要推送提醒`);

      userList.forEach((element) => {
        if (element.openid) {
          logger.debug('向用户推送记账提醒', { openid: element.openid });

          pushMessage.pushMessage({
            query: {
              openid: element.openid,
            },
          }).catch(error => {
            logger.error('推送记账提醒失败', { openid: element.openid, error: error.message });
          });
        }
      });

      logger.info('每日记账提醒推送完成');
    }).catch(error => {
      logger.error('获取用户列表失败', { error: error.message });
    });
  });
};

module.exports = {
  pushMessageSchedule,
};
