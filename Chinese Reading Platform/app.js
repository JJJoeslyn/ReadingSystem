var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var mongoose = require('mongoose'); 
var TodoModel = mongoose.model('user');
var URL = require('url'); // 引入URL中间件，获取req中的参数需要

// 引用 handlebars模块
var hbs = require('express-handlebars')

// 引入 Cookie
var cookieParser = require('cookie-parser');

// 引入 session
var session = require('express-session');

// 生成一个 express实例 app
var app = express();

// 设置端口
app.set('port', process.env.PORT || 3000);

// 设置模板引擎
app.set('view engine', 'hbs')

// 设置静态资源目录
app.set('views', path.join(__dirname, 'views'))

// 设置 handlebars参数
app.engine( '.hbs', hbs( {
    extname: '.hbs',
    defaultLayout: 'default',
    layoutsDir:  __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
}));

// 解析 application/json
app.use(bodyParser.json()); 

// 解析 url编码
app.use(bodyParser.urlencoded({ extended: true })); 

// 解析 multipart/form-data
app.use(express.static('public'));

// 加载日志中间件
app.use(logger('dev'));

// 加载解析cookie的中间件
app.use(cookieParser());

// 设置public文件夹为存放静态文件的目录
app.use(express.static('public'))
routes(app);

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});