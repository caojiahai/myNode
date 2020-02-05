var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var url = require('url');//获取url参数
var error = require('./../error/index');//引入报错文件
let MongoClient = require('mongodb').MongoClient;//MongoClient
let poetry = 'mongodb://localhost:27017/poetry';//连接poetry本地数据库
var utility = require("utility");//md5加密

router.post('/register',function(req, res){
	let body = req.body;
	if(body && body.account && body.password){
		var selectData = function(db, callback){
			var collection = db.collection('user');
			var whereStr = { name: body.account };
			collection.find(whereStr).toArray(function(err,result){
				if(result && result.length > 0){
					data = {
						code: 0,
						message: "当前用户名已存在!"
					}
			    	res.writeHead(200, {"Content-Type": "application/json"});
					res.end(JSON.stringify(data));
				}else{
					data = { name: body.account, pwd: body.password, time: new Date().getTime() }
					collection.insert(data,function(err1,result){
						data = {
							code: 1,
							message: "注册成功!"
						}
				    	res.writeHead(200, {"Content-Type": "application/json"});
						res.end(JSON.stringify(data));
					})
				}
			})
		}
		MongoClient.connect(poetry,function(err,db){
			selectData(db,function(result){
				db.close()
			})
		})
	}else{
		data = {
			code: 0,
			message: "请输入正确的用户名或密码!"
		}
    	res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(data));
	}
})

router.post('/login', function (req, res) {
	let body = req.body;
	if(body && body.account && body.password){
		var selectData = function (db, callback) {
		    //连接到表
		    var collection = db.collection('user');
		    //查询数据
		    var whereStr = { name: body.account, pwd: body.password};
		    collection.find(whereStr).toArray(function (err, result) {
		        if(result && result.length > 0){
					collection = db.collection('token');
					whereStr = { name: body.account };//查询当前用户是否存在token
					collection.find(whereStr).toArray(function (err1, result1) {
				        if(result1 && result1.length > 0){//直接返回用户信息以及token标识
							data = {
								code: 1,
								data: result[0]
							}
							data.data['token'] = result1[0].token
					    	res.writeHead(200, {"Content-Type": "application/json"});
							res.end(JSON.stringify(data));
				        }else{//先生成token再把用户信息以及token一起返回
				        	let strMD5 = body.account + "-" + new Date().getTime() + "-" + body.password;
				        	data = { name: body.account, token: utility.md5(strMD5), time: new Date().getTime() }
				        	collection.insert(data,function(error2, result2){
							    data = {
									code: 1,
									data: result[0]
								}
							    data.data['token'] = result2.ops[0].token
						    	res.writeHead(200, {"Content-Type": "application/json"});
								res.end(JSON.stringify(data));
						  	});
				        }
				    });	
		        }else{
		        	data = {
						code: 0,
						data: {},
						message: "用户名或密码错误!"
					}
			    	res.writeHead(200, {"Content-Type": "application/json"});
					res.end(JSON.stringify(data));
		        }
		    });		
		}
	
		MongoClient.connect(poetry, function (err, db) {
		  	selectData(db, function (result) {
		      	db.close();
		  	});
		});		
	}else{
		data = {
			code: 0,
			data: {},
			message: "请输入正确的用户名或密码!"
		}
    	res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(data));
	}
})

router.get('/getSearch', function (req, res) {
	var selectData = function (db, callback) {
	    var collection = db.collection('author');
	    collection.find().count().then(function(count){
	    	collection.find().limit(10).toArray(function (err, result) {
		    	data = {
					code: 1,
					data: result,
					count: count
				}
		    	res.writeHead(200, {"Content-Type": "application/json"});
				res.end(JSON.stringify(data));
		    });	
	    });
	}
	MongoClient.connect(poetry, function (err, db) {
	  	selectData(db, function (result) {
	      	db.close();
	  	});
	});
});

router.post('/search', function(req, res) {
    let body = req.body,data,limit = 10,page = 0; 
    if(body && body.searchData){
    	var selectData = function (db, callback) {
		    //连接到表
		    var collection = db.collection('poetry');
		    
		    //查询数据
		    var whereStr = { "author": body.searchData };
		    collection.find(whereStr).count().then(function(count){
		    	collection.find(whereStr).limit(limit).skip(page).toArray(function (err, result) {
			    	data = {
						code: 1,
						data: result,
						count: count
					}
			    	res.writeHead(200, {"Content-Type": "application/json"});
					res.end(JSON.stringify(data));
			    });	
		    });
		}

		MongoClient.connect(poetry, function (err, db) {
		  	selectData(db, function (result) {
		      	db.close();
		  	});
		});
    }else{
    	//未输入搜索关键词
    	data = {
			code: 0,
			data: {},
			message: "未输入搜索关键词!"
		}
    	res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(data));
    }
	
});

router.get('/getDynasty', function (req, res) {
	
	var selectData = function (db, callback) {
	    //连接到表
	    var collection = db.collection('dynasty');
	    collection.find().toArray(function (err, result) {
	        data = {
				code: 1,
				data: result
			}
	    	res.writeHead(200, {"Content-Type": "application/json"});
			res.end(JSON.stringify(data));
	    });		
	}

	MongoClient.connect(poetry, function (err, db) {
	  	selectData(db, function (result) {
	      	db.close();
	  	});
	});
})

router.post('/addPoetry', function (req, res) {
	let body = req.body,data; 
    if(body && body.author && body.title && body.content && body.dynasty){
		var inserttData = function (db, callback) {//添加诗词
		    //连接到表
		    var collection = db.collection('author');
		    //查询数据
		    var whereStr = { "name": body.author };
		    collection.find(whereStr).toArray(function (err, result) {
		    	var data = {};
		    	if(result && result.length > 0){//当前作者已存在，新增诗词
		    		data = {
				    	author: body.author,
				    	title: body.title,
				    	content: body.content,
				    	inputTime: new Date().getTime(),
				    	dynasty: body.dynasty,
				    	headImg: body.img,
				    	desc: body.desc
			    	}
		    		collection = db.collection('poetry');
			  		collection.insert(data,function(error, result){
					    data = {
							code: 1,
							data: {},
							message: "添加成功!"
						}
				    	res.writeHead(200, {"Content-Type": "application/json"});
						res.end(JSON.stringify(data));
				  	});
		    	}else{//当前作者不存在存在，新增作者以及诗词
		    		data = { name: body.author };
		    		collection.insert(data,function(error, result){
		    			console.log("author add success")
					    data = {
					    	author: body.author,
					    	title: body.title,
					    	content: body.content,
					    	inputTime: new Date().getTime(),
					    	dynasty: body.dynasty,
					    	headImg: body.img,
					    	desc: body.desc
				    	}
			    		collection = db.collection('poetry');
				  		collection.insert(data,function(error, result){
						    data = {
								code: 1,
								data: {},
								message: "添加成功!"
							}
					    	res.writeHead(200, {"Content-Type": "application/json"});
							res.end(JSON.stringify(data));
					  	});
				  	});
		    	}
		    });	
		    
		}
		
		var selectData = function (db, callback) {
//		    //连接到表
//		    var collection = db.collection('poetry');
//		    //查询数据
//		    var whereStr = { "author": body.author, "title": body.title };
//		    collection.find(whereStr).toArray(function (err, result) {
//		    	if(result && result.length > 0){
//		    		data = {
//						code: 0,
//						data: {},
//						message: "当前诗词，已经存在!"
//					}
//			    	res.writeHead(200, {"Content-Type": "application/json"});
//					res.end(JSON.stringify(data));
//					db.close();
//		    	}else{
		    		inserttData(db, function (result) {
				      	db.close();
				  	});
//		    	}
//		    });		
		}
	
		MongoClient.connect(poetry, function (err, db) {
		  	selectData(db, function (result) {})
		});    	
    }else{
    	data = {
			code: 0,
			data: {},
			message: "诗词不完整，请检查后，再提交!"
		}
    	res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(data));
    }

})
 
module.exports = router;