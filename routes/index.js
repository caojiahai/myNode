var express = require('express');
var router = express.Router();
var querystring = require('querystring');
//var handle = require('./account/loginCtrl')
var connection = require('./../mysql/index');//引入mysql

//console.log(handle)

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
	connection.connect();
	let sql = 'select * from user where id='+req.body.id;
	connection.query(sql,function(error,result){
		if (error) throw error;
		res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(result[0]));
	})
	connection.end();
})

module.exports = router;