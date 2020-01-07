var express = require('express');
var router = express.Router();
 
router.get('/demo', function (req, res) {
    let data = {
		code:999,
		data:{
			name:"demo",
			pwd:"123456"
		}
	}
	res.writeHead(200, {"Content-Type": "application/json"});
	res.end(JSON.stringify(data));
});
 
module.exports = router;