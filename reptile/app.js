//古诗文网数据抓取
const https = require('https');
const cheerio = require('cheerio');
var fs = require('fs'); //文件模块
var path = require('path'); //系统路径模块

var pageNo = 0;
let result = [];
let arr = [];
let count = 0;

var getPoetryData = function (pageNo,count){
	let url,keyword = arr[count].url.substring(46,61);
	if(pageNo != 0){
		url = 'https://so.gushiwen.org/shiwen/default_'+keyword+pageNo+'.aspx';
	}else{
		url = 'https://so.gushiwen.org/shiwen/default_'+keyword+'1.aspx';
	}
	console.log(url)
	https.get(url, function (res) {
	    let chunks = [],
	        size = 0;
	    res.on('data', function (chunk) {
	        chunks.push(chunk);
	        size += chunk.length;
	    });
	
	    res.on('end', function () {
	        let data = Buffer.concat(chunks, size);
	        let html = data.toString();
	        let $ = cheerio.load(html);
	        $(".main3").find('.sons').each(i => {
	        	let map = {};
	        	map.title = $('.sons').eq(i).find('b').text();
	        	$('.sons').eq(i).find('.source a').each(j => {
	        		if(j === 0){
	        			map.dynasty = $('.sons').eq(i).find('.source a').eq(j).text()
	        		}
	        		if(j === 1){
	        			map.author = $('.sons').eq(i).find('.source a').eq(j).text()
	        		}
	        	});
	        	map.content = $('.sons').eq(i).find(".contson").text();
	        	if(map.title && map.author && map.content){
	        		result.push(map);
	        	}
	        })
	        if(result && pageNo <= 10){
	        	pageNo++;
	        	getPoetryData(pageNo,count)
	        }else{
	        	if(pageNo == 11){
	        		pageNo = 0;count++;
	        		console.log(count)
	        		if(count<arr.length){
	        			getPoetryData(pageNo,count)
	        		}else{
			        	var content = JSON.stringify(result); 
						var file = path.join(__dirname, 'poetry.json'); 
						//写入文件
						fs.writeFile(file, content, function(err) {
						    if (err) {
						        return console.log(err);
						    }
						    console.log('文件创建成功，地址：' + file);
						});		        			
	        		}
	        	}
	        }
	    });
	});	
}

var getData = function (){
	url = 'https://so.gushiwen.org/shiwen/';
	https.get(url, function (res) {
	    let chunks = [],
	        size = 0;
	    res.on('data', function (chunk) {
	        chunks.push(chunk);
	        size += chunk.length;
	    });
	
	    res.on('end', function () {
	        let data = Buffer.concat(chunks, size);
	        let html = data.toString();
	        let $ = cheerio.load(html);
	        $(".main3").find('.son2').each(i => {
	        	$('.son2').eq(i).find('a').each(j => {
	        		let map = {};
	        		map.url = 'https://so.gushiwen.org/shiwen'+$('.son2').eq(i).find('a').eq(j).attr('href');
	        		if(map.url){
	        			arr.push(map);
	        		}
	        	})
	        })
	        console.log(arr.length)
	        getPoetryData(pageNo,count)
	    });
	});	
}
getData()


