let code = 0;//code默认0失败
const error = (code, msg) => {
	let obj = { code:'',msg:'' }
	obj.code = code;
	obj.msg = msg;
	return obj;
}
module.exports = error;
var mysql = require('mysql');//引入数据库mysql

const connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : '123456',
  database : 'mydb'
});

//连接数据库
//connection.connect()

//connection.query('SELECT * FROM user where id=1', function (error, results, fields) {
//if (error) throw error;
//console.log('The solution is: ', results);
//});

module.exports = connection;


var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var cnt = require('./../mysql/index');//引入mysql

//登录
router.get('/login', function(req, res) {
    console.log(req.body)
	let data = {
		code:999,
		data:{
			name:"cjh",
			pwd:"123456"
		}
	}
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify(data));
});

router.post('/login', function(req, res) {
    var body = '';     
    req.on('data', function(chunk){    
        body += chunk;
    });
 	
    req.on('end', function(){
    	body = querystring.parse(body);
    	console.log(body)
    })
	let data = {
		code:999,
		data:{
			name:"cjh",
			pwd:"654321"
		}
	}
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify(data));
});

//id
router.post('/getUser',function(req,res){
	console.log(req.body)
	cnt.connect();
	let sql = 'select * from user where id='+req.body.id;
	cnt.query(sql,function(error,result){
		if (error) throw error;
		res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(result[0]));
	})
	cnt.end();
})

module.exports = router;