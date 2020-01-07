var express = require('express');//用于管理路由
var bodyParser = require('body-parser');//获取post请求body数据
var error = require('./src/error/index');//引入报错文件
var app = express();
var fs = require('fs');//文件相关操作

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
app.use('/index', require('./src/routes/index'));
app.use('/demo', require('./src/routes/demo'));

//处理请求不存在的路径
app.use(function(req, res, next) {
	let url = req.url;//获取网页请求url
	if(url === "/"){
		//首页
		res.writeHead(200,{'Content-Type':'html'});
		fs.readFile('./src/www/index.html','utf-8',function(err,data){
			if(err){
				throw err ;
			}
			res.end(data);
		});
	}else{
		//404
		res.writeHead(200,{'Content-Type':'html'});
		fs.readFile('./src/www/404.html','utf-8',function(err,data){
			if(err){
				throw err ;
			}
			res.end(data);
		});	
	}
});

app.listen(9527);//监听9527端口
console.log('server start success!')
module.exports = app;
