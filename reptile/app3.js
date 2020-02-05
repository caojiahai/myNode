const http = require('http'); //https与http
const cheerio = require('cheerio'); //将html转为类似jq一样的查询
var fs = require('fs'); //文件模块
var path = require('path'); //系统路径模块
var querystring = require('querystring');

let j = require("./data.json")
let count = 0;

var addPoetry = function(val){
	let data = {
		title: val.title,
		author: val.author,
		dynasty: val.dynasty,
		content: val.content,
		img: val.img,
		desc: val.desc
	};
	data.content = data.content.replace(/\n/g,'');
	data.content = '<p>' + data.content.replace(/。/g,'。</p><p>'); 
	data.content = data.content.substring(0,data.content.length-4)
	
	const postData = querystring.stringify(data);
	
	console.log(Buffer.byteLength(postData))
	
	const options = {
		host: '127.0.0.1',
		port: '9527',
		path: 'home/addPoetry',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(postData)
		}
	};
	const req = http.request(options, (res) => {
		console.log(`状态码: ${res.statusCode}`);
  		console.log(`响应头: ${JSON.stringify(res.headers)}`);
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
//			count++;
//			addPoetry(j[count])
			console.log(`响应主体: ${chunk}`);
		});
		res.on('end', () => {
			console.log('响应中已无数据。');
		});
	});
	
	req.on('error', (e) => {
		console.error(`请求遇到问题: ${e.message}`);
	});
	
	// 写入数据到请求主体
	req.write(postData);
	req.end();	
}

addPoetry(j[count])

