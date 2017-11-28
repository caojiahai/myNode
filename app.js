var express = require('express');//用于管理路由
var bodyParser = require('body-parser');//获取post请求body数据
var routes = require('./src/routes/index');//引入路由
var error = require('./src/error/index');//引入报错文件

var app = express();

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
