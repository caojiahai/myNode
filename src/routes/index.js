var express = require('express');
var router = express.Router();
var querystring = require('querystring');
//var cnt = require('./../mysql/index');//引入mysql
var url = require('url');//获取url参数
var error = require('./../error/index');//引入报错文件

//根据parentID查询children
router.get('/getLocations',(req,res)=>{
	var arg = url.parse(req.url).query; 
	var parentId = querystring.parse(arg).parentId; 
	if(parentId){
		let sql = 'SELECT * FROM location where parent_id="'+parentId+'" order by sequence asc';
		cnt.query(sql,function(error,result){
			if (error) throw error;
			res.writeHead(200, {"Content-Type": "application/json"});
			res.end(JSON.stringify(result));
		})			
	}else{
		let data = error(400,'请求参数有误!')
		res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(data));
	}
})


//登录
router.get('/login', function(req, res) {
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
//	cnt.connect();
	let sql = 'SELECT * FROM location where parent_id="59bfa2be-5dac-41d2-ac9e-37fcb0a99f61" order by sequence asc';
	cnt.query(sql,function(error,result){
		if (error) throw error;
		res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(result));
	})
//	cnt.end();
})

module.exports = router;