let code = 0;//code默认0失败
const error = (code, msg) => {
	let obj = { code:'',msg:'' }
	obj.code = code;
	obj.msg = msg;
	return obj;
}
module.exports = error;