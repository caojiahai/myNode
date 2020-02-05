//诗词名句网，数据抓取
const http = require('http');//https与http
const cheerio = require('cheerio');//将html转为类似jq一样的查询
var fs = require('fs'); //文件模块
var path = require('path'); //系统路径模块

let authorList = [];
let authorPageNo = 1;
let authorLen = 652;//作者页数
var getAuthorInfo = function (authorPageNo){//获取作者信息
	url = 'http://www.shicimingju.com/category/all__'+authorPageNo;
	http.get(url, function (res) {
	    let chunks = [], size = 0;
	    res.on('data', function (chunk) {
	        chunks.push(chunk);
	        size += chunk.length;
	    });
	    res.on('end', function () {
	        let data = Buffer.concat(chunks, size);
	        let html = data.toString();
	        let $ = cheerio.load(html);
	        $("#main_left").find('.card.zuozhe_card').each(function(i){
	        	let author = {}
	        	let authorStr = $("#main_left").find('.card.zuozhe_card').eq(i).find('h3').text();
	        	author.dynasty = authorStr.split("]")[0].substring(1,authorStr.split("]")[0].length);
	        	author.name = authorStr.split("]")[1];
	        	author.url = $("#main_left").find('.card.zuozhe_card').eq(i).find('h3 a').attr('href');
	        	authorList.push(author);
	        	console.log(author.name,'   ---   ',authorPageNo)
	        })
	        authorPageNo++;
	        if(authorPageNo <= authorLen){
	        	getAuthorInfo(authorPageNo)
	        }else{
	        	var content = JSON.stringify(authorList); 
				var file = path.join(__dirname, 'author.json'); 
				//写入文件
				fs.writeFile(file, content, function(err) {
				    if (err) {
				        return console.log(err);
				    }
				});	
				console.log('作者抓取成功!')
	        	getPoetryInfo(authorList[authorListLength].url,poetryPageNo)
	        }
	    });
	}).on('error', (e) => {
		getAuthorInfo(authorPageNo)
	});	
}

let authorListLength = 0;
let poetryPageNo = 1;
let poetryList = [];
let imgurl = "",desc = "";
let poetryLen
var getPoetryInfo = function(inputUrl,poetryPageNo){//获取当前诗人，所有诗集
	url = 'http://www.shicimingju.com'+inputUrl;
	url = url.split(".html")[0]+"_"+poetryPageNo+'.html';
	http.get(url, function (res) {
	    let chunks = [], size = 0;
	    res.on('data', function (chunk) {
	        chunks.push(chunk);
	        size += chunk.length;
	    });
	    res.on('end', function () {
	        let data = Buffer.concat(chunks, size);
	        let html = data.toString();
	        let $ = cheerio.load(html);
        	imgurl = $(".card.about_zuozhe").find('img').attr('src');
        	desc = $(".card.about_zuozhe").find('.des').text();
        	if(desc){
        		desc = desc.replace(/(^\s*)|(\s*$)|(\s+)/g,'');
        	}
	        poetryLen = $("#list_nav_all").find('a').length;
	        if(poetryLen === 0){
	        	poetryLen = $("#list_nav_part").find('a').length - 1;
	        }
	        $(".card.shici_card").find('.shici_list_main').each(function(i){
	        	let poetry = {}
	        	poetry.title = $(".card.shici_card").find('.shici_list_main').eq(i).find('h3').text();
	        	poetry.content = $(".card.shici_card").find('.shici_list_main').eq(i).find('.shici_content').text();
	        	poetry.content = poetry.content.replace(/(展开全文|收起|\n)/g,'')
	        	poetry.content = poetry.content.replace(/(^\s*)|(\s*$)|(\s+)/g,'')
	        	poetry.author = authorList[authorListLength].name;
	        	poetry.dynasty = authorList[authorListLength].dynasty;
	        	poetry.img = imgurl || "";
	        	poetry.desc = desc || "";
	        	if(poetry.title && poetry.author && poetry.dynasty && poetry.content){
	        		poetryList.push(poetry);
	        	}
	        })   
	        console.log(authorList[authorListLength].name,'   ---   ',poetryPageNo,'/',poetryLen,'   ---   ',authorListLength)
	        poetryPageNo++;
	        if(poetryPageNo <= poetryLen){
        		getPoetryInfo(authorList[authorListLength].url,poetryPageNo)
	        }else{
		        authorListLength++;
		        if(authorListLength < authorList.length){
		        	poetryPageNo = 1;
		        	getPoetryInfo(authorList[authorListLength].url,poetryPageNo)
		        }else{
		        	var content = JSON.stringify(poetryList); 
					var file = path.join(__dirname, 'data.json'); 
					//写入文件
					fs.writeFile(file, content, function(err) {
					    if (err) {
					        return console.log(err);
					    }
					});	
					console.log('全部抓取完毕')
		        }
	        }
	    });
	}).on('error', (e) => {
		var content = JSON.stringify(poetryList); 
		var file = path.join(__dirname, 'data.json'); 
		//写入文件
		fs.writeFile(file, content, function(err) {
		    if (err) {
		        return console.log(err);
		    }
		    console.log('文件写入成功！','---',authorPageNo)
		});	
		getPoetryInfo(authorList[authorListLength].url,poetryPageNo)
	});		
}

getAuthorInfo(authorPageNo)