// TextEncoder/TextDecoder polyfill for Node.js compatibility
require('./polyfills/text-encoder-polyfill');

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morganLogger = require('morgan');
/* post方法 */
const bodyParser = require('body-parser');

// 引入接口路由
const mainRouter = require('./routes');
const {
  json
} = require('body-parser');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(morganLogger('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({
  extended: false,
  limit: '10mb'
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 添加json解析并设置字符编码
app.use(bodyParser.json({ charset: 'utf-8' }));
app.use(bodyParser.urlencoded({
  extended: false,
  charset: 'utf-8'
}));

// 设置默认字符编码
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// 允许跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS');
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 处理/favicon.ico请求，不校验认证
app.get('/favicon.ico', (req, res) => res.status(204));

// node上传文件，拿到图片链接
app.use(express.static('upload'))

app.use('/websiteapi', mainRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// /* 定时推送消息 */
// const nodeSchedule = require('./controller/system/node-schedule');
// nodeSchedule.pushMessageSchedule()

console.info('服务器启动成功')

module.exports = app;