var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var url = require('url');//获取url参数
var error = require('./../error/index');//引入报错文件
 
router.get('/getSearch', function (req, res) {
    let data = {
		code: 1,
		data: ["李白","杜甫"]
	}
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify(data));
});

router.post('/search', function(req, res) {
    let body = req.body,data; 
    if(body && body.searchData){
    	if(body.searchData == "李白"){//有结果
    		data = {
				code: 1,
				data: [{
					id: 0,
					title: "黄鹤楼送孟浩然之广陵",
					author: "李白",
					content:　"故人西辞黄鹤楼，烟花三月下扬州。孤帆远影碧空尽，唯见长江天际流。",
					inputTime: 1578388488865,
				}]
			}
    	}else{//无结果
    		data = {
				code: 1,
				data: []
			}
    	}
    }else{
    	//未输入搜索关键词
    	data = {
			code: 0,
			data: {},
			message: "未输入搜索关键词!"
		}
    }
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify(data));
});
 
module.exports = router;