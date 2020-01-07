/*
 * @auther 曹加海
 * @email 1041630444@qq.com
 * @date 2019/12/13 16:00:00
 * @version 1.0.0
 * @description 简单CTool.js库，自用
 * 
 */

(function(w) {
	var CTool = function(selector) {
		return new CTool.fn.init(selector);
	};
	var dom;
	CTool.fn = CTool.prototype;
	CTool.fn = {
		cTool: "1.0.0",
		constructor: CTool,
		init: function(selector) {
			dom = document.querySelector(selector);
			if(dom) 
				return dom;
			else
				return this;
		}
	};
	CTool.fn.init.prototype = CTool.fn;
	
	/*
	 * @desc cTool外部自定义扩展
	 */
	CTool.extend = CTool.fn.extend = function(obj){
		for (key in obj) {
			this[key] = obj[key];
		}
	}
	
	/*
	 * @desc cTool扩展
	 */
	CTool.fn.extend({
		hide: function(){
			if(!dom) return;
			dom.style.display = "none";
		},
		show: function(){
			if(!dom) return;
			dom.style.display = "block";
		}
	})
	
	/*
	 * @method isPhone
	 * @for Ctool
	 * @param String
	 * @return Boolean
	 * @desc 检测是否是手机号
	 */
	CTool.isPhone = function(str) {
		var pattern = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/;
		return pattern.test(str);
	};

	/*
	 * @method ajax
	 * @for Ctool
	 * @param Object
	 * @return function
	 * @desc ajax请求
	 */
	CTool.ajax = function(options) {
		if(!options){
			return;
		};
		var req = new ajaxObject(), config = {
			method: options.method || "GET",
			url: options.url || "",
			async: options.async || true,
			data: options.data || "",
			headers: options.headers || "",
			withCredentials: options.withCredentials || false,
			timeout: options.timeout || 0
		};
		req.timeout = config.timeout;
		req.open(config.method, config.url, config.async);
		req.setRequestHeader(config.headers || "Content-Type", "application/json");
		req.withCredentials = config.withCredentials;
		req.onreadystatechange = function() {
			if(req.readyState == 4) {
				var status = req.status, val;
				switch (status){
					case 200:
						val = isJSON(req.response) ? JSON.parse(req.response) : req.response;
						options.success(val); 
						break;
					case 400:	
						val = "客户端请求的语法错误，服务器无法理解!";
						options.error(val);
						break;
					case 401:	
						val = "未登录!";
						options.error(val);
						break;
					case 404:
						val = "当前接口资源不存在!";
						options.error(val);
						break;
					case 405:
						val = "客户端请求中的方法错误！";
						options.error(val);
						break;
					case 500:
						val = "服务器内部错误，无法完成请求！";
						options.error(val);
						break;
				}
			}
		};
		req.send(config.data);
	};

	/*
	 * @method getDom
	 * @for Ctool
	 * @param String
	 * @return element
	 * @desc 获取元素
	 */
	CTool.getDom = function(val){
		if(!val) return;
		var d = document.querySelector(val);
		if(d)
			return d;
		else
			return;
	};
	
	/*
	 * @method delDom
	 * @for Ctool
	 * @param String
	 * @desc 删除元素
	 */
	CTool.delDom = function(val){
		if(!val) return;
		var d = document.querySelector(val);
		if(d){
			d.parentNode.removeChild(d);
		}
	};
	
	/*
	 * @method insertAfter
	 * @for Ctool
	 * @param newNode,existingNode
	 * @desc 插入节点
	 */
	CTool.insertAfter = function (newNode, existingNode) {
		var parent = existingNode.parentNode;
		if(parent.lastChild === existingNode) {
			parent.appendChild(newNode);
		} else {
			parent.insertBefore(newNode, existingNode.nextSibling);
		}
	};
	
	/*
	 * @method getStringImg
	 * @for CTool
	 * @param Sting
	 * @desc 获取字符串中图片链接，或者base64
	 */
	CTool.getStringImg = function(val){
		var out = [];
		val.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match,capture){
		　　	out.push(capture);
		});
		return out;
	};

	/*
	 * @method dateCus
	 * @for CTool
	 * @param Sting,String
	 * @desc 格式化时间戳
	 */
	CTool.dateCus = function(date,fmt){
		return formatDate(date, fmt);
	};

	/*
	 * @method isFullscreen
	 * @for CTool
	 * @desc 判断是否为全面屏
	 */
	CTool.isFullscreen = function() {
		let result = false;
		const rate = window.screen.height / window.screen.width;    
		let limit =  window.screen.height == window.screen.availHeight ? 1.8 : 1.65;
		if (rate > limit) {
			result = true;
		}
		return result;
	};
	
	/*
	 * @method setScrollY
	 * @for CTool
	 * @param Number
	 * @desc 滚动屏幕
	 */
	CTool.setScrollY = function(top) {
        if (top || Number(top) == 0) {
            if (self.pageYOffset) {
                self.pageYOffset = Number(top);
            }
            if (document.documentElement && document.documentElement.scrollTop) {
                document.documentElement.scrollTop = Number(top);
            }
            if (document.body) {
                document.body.scrollTop = Number(top);
            }
            return true;
        } else {
            var yScroll;
            if (self.pageYOffset) {
                yScroll = self.pageYOffset;
            } else if (document.documentElement && document.documentElement.scrollTop) {
                yScroll = document.documentElement.scrollTop;
            } else if (document.body) {
                yScroll = document.body.scrollTop;
            }
            return yScroll;
        }
    };
    
    /*
	 * @method parseURL
	 * @for CTool
	 * @param String
	 * @desc 解析URL
	 */
    CTool.parseURL = function(url) {
	    var a =  document.createElement('a');
	    a.href = url;
	    return {
	        source: url,
	        protocol: a.protocol.replace(':',''),
	        host: a.hostname,
	        port: a.port,
	        query: a.search,
	        params: (function(){
	            var ret = {},
	                seg = a.search.replace(/^\?/,'').split('&'),
	                len = seg.length, i = 0, s;
	            for (;i<len;i++) {
	                if (!seg[i]) { continue; }
	                s = seg[i].split('=');
	                ret[s[0]] = s[1];
	            }
	            return ret;
	        })(),
	        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
	        hash: a.hash.replace('#',''),
	        path: a.pathname.replace(/^([^\/])/,'/$1'),
	        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
	        segments: a.pathname.replace(/^\//,'').split('/')
	    };
	};
    
    /*
	 * @method createRandomStr
	 * @for CTool
	 * @param Number
	 * @desc 生成随机字符串
     */
    CTool.createRandomStr = function(len) {
	    var rdmString = "";
	    for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
	    return rdmString.substr(0, len);
	};
	
	/*
	 * @method getQueryString
	 * @for CTool
	 * @param String
	 * @desc 获取url传过来的参数
     */
	CTool.getQueryString = function(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) 
            return unescape(r[2]); 
        return null; 
    };
    
    
    /*
	 * @method urlEnCode
	 * @for CTool
	 * @param String
	 * @desc url转码
     */
    CTool.urlEnCode = function(url) {
        url = (url + '').toString();
        return encodeURIComponent(url).replace(/!/g, '%21')
            .replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29')
            .replace(/\*/g, '%2A').replace(/%20/g, '+');
    };
    
    /*
	 * @method trim
	 * @for CTool
	 * @param String
	 * @desc 去掉首尾空格
     */
    CTool.trim = function(str){   
	    return str.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'');   
	};
	
	function formatDate(date, fmt) {
		if(!date){
			return;
		}
		var str = date + '';
		if(str.length==10){
			date = new Date(Number(date)*1000);
		}else{
			date = new Date(Number(date));
		}
		if(!fmt) {
			fmt = 'yyyy年MM月dd日';
		}
		if(/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		let o = {
			'M+': date.getMonth() + 1,
			'd+': date.getDate(),
			'h+': date.getHours(),
			'm+': date.getMinutes(),
			's+': date.getSeconds()
		};
		for(let k in o) {
			if(new RegExp(`(${k})`).test(fmt)) {
				let str = o[k] + '';
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
			}
		}
		return fmt;
	};

	function padLeftZero(str) {
		return ('00' + str).substr(str.length);
	};

	function ajaxObject() {
		var xmlHttp;
		try {
			xmlHttp = new XMLHttpRequest();
		} catch(e) {
			try {
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				try {
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {
					alert("您的浏览器不支持AJAX！");
					return false;
				}
			}
		}
		return xmlHttp;
	};

	function isJSON(val) {
		if(typeof val == 'string') {
			try {
				JSON.parse(val);
				return true;
			} catch(e) {
				return false;
			}
		}else{
			return false;
		}
	};

	w.CTool = w.$ = CTool; 
	
})(window,undefined);