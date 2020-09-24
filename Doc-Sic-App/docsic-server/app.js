var createError = require('http-errors');
var express = require('express');
var path = require('path');
const template = require('art-template');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//注册一个过滤器 通过处理时间戳 转为日期格式
template.defaults.imports.getDate = dateTime =>{
  const datetime = new Date(dateTime)

  const year = datetime.getFullYear()
  const month = ("0" + (datetime.getMonth() + 1)).slice(-2)
  const date = ("0" + datetime.getDate()).slice(-2)
  const hour = ("0" + datetime.getHours()).slice(-2)
  const minute = ("0" + datetime.getMinutes()).slice(-2)

  return  year + "-"+ month +"-"+ date +" "+ hour +":"+ minute
}

module.exports = app;
