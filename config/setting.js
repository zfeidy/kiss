var path = require('path');

var config = {
    // debug 为 true 时，用于本地调试
    debug: true,
    groupsize: 1000,
    number: 4, //一次出现图片的张数
    expires: 24, // cookie过期时间。默认配置【0永久，1（小时），6（小时），12（小时），24（小时），48（小时），72（小时），168（小时）,360(小时),720(小时)】
    use_mongo: false, // 是否使用mongodb做存储
    log_path: path.join(__dirname, '../log'),
    // 程序运行的端口
    port: 3000,
    admin: "admin",
    password: "admin",
    upload: {
        path: path.join(__dirname, '../public/upload/'),
        url: 'public/upload/'
    },
    cache: {
        path: path.join(__dirname, '../public/cache/'),
        url: 'public/cache/'
    },
    redisAp: {
        "hostname": "aps.jimdb.jd.local",
        "host": "aps.jimdb.jd.local",
        "path": "/get",
        "method": "get",
        "port": 80
    },
    use_cluster: true,
    reloadAp: true
};

module.exports = config;
