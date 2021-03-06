// 记载配置项
var setting = require('./config/setting');
// 加载express
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// session模块
var session = require('express-session');
// redis session
var RedisStore = require('connect-redis')(session);
var router = require('./router');
var visits = require('./middleware/visits');
var render = require('./middleware/render');
var error = require('./middleware/error');
var log = require("./common/logger");

// 生成app对象
var app = express();

// 设置模板
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// 定义icon图标
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(favicon());

if (setting.debug) {
    // 渲染时间
    app.use(render.render);
}

// 定义数据解析器，将client提交过来的post请求放入request.body中
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// 设置 cookie
app.use(cookieParser("kiss618"));
// 定义静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// 定义日志和输出级别
app.use(logger('dev'));

// 加载redis的配置
var redisConfig = require('./config/redis');
var rs = new RedisStore({
    port: redisConfig.redis_port,
    host: redisConfig.redis_host,
    pass: redisConfig.redis_auth,
    no_ready_check: true,
    prefix: 'kiss:'
});
// 设置 Session
app.use(session({
    name: 'kiss618',
    secret: redisConfig.redis_auth,
    store: rs,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * setting.expires,
        expires: new Date(Date.now() + 1000 * 60 * 60 * setting.expires)
    }
}));
// 使用路由
router(app);
// 404错误处理
app.use(error.errorPage);
// 开发环境，500错误处理和错误堆栈跟踪
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        log.error("系统异常(开发环境)", err.message);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// 生产环境，500错误处理
app.use(function (err, req, res, next) {
    log.error("系统异常", err.message);
    res.statusCode = err.status || 500;
    res.statusMessage = "服务器又调皮了！";
    res.render('error', {
        message: "悟空，你又调皮了",
        error: {}
    });
});

// 输出模型app
module.exports = app;
