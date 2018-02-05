var express = require('express');//用于管理路由
var bodyParser = require('body-parser');//获取post请求body数据
var routes = require('./src/routes/index');//引入路由
var error = require('./src/error/index');//引入报错文件

var app = express();

app.all('*', function(req, res, next) {
	//设置跨域访问
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1');
	res.header("Content-Type", "application/json;charset=utf-8");
	/*让options请求快速返回*/
    if (req.method == 'OPTIONS') {
        res.send(200);
    }else {
    	/*防止异步造成多次响应，出现错误*/
        var _send = res.send;
        var sent = false;
        res.send = function (data) {
            if (sent) return;
            _send.bind(res)(data);
            sent = true;
        };
        next();
    }
});

app.use(bodyParser.json()); //application/json
app.use('/',routes)

//处理请求不存在的路径
app.use(function(req, res, next) {
	let data = error(404,'当前请求路由不存在!')
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify(data));
});

app.listen(9999);//监听9999端口
console.log('start success!')
module.exports = app;
