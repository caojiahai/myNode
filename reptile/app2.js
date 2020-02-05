var fs = require('fs'); //文件模块
let j = require("./data.json")
var path = require('path'); //系统路径模块
let len = Math.ceil(j.length/5000);

for(let i=0;i<len;i++){
	fs.writeFile("data/data"+i+".json", 'Learn Node FS module', function (err) {
	  	if (err) throw err;
	}); 
}

let arr = [],count = 1;
j.forEach((a,a_i) => {
	arr.push(a)
	if(a_i == count*5000){
		console.log(count)
		var content = JSON.stringify(arr); 
		var file = path.join(__dirname, "data/data"+(count-1)+".json"); 
		//写入文件
		fs.writeFile(file, content, function(err) {
		    if (err) {
		        return console.log(err);
		    }
		});	
		count++;
		arr = [];
	}
	
})


