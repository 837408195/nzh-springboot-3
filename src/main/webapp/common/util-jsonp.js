Util = {
	/**
	 * 取消事件冒泡
	 * @param {Object}
	 *            e 事件对象
	 */
	stopBubble : function(e) {
		if (e && e.stopPropagation) {
			e.stopPropagation();
		} else {
			// ie
			window.event.cancelBubble = true;
		}
	}
};
/**
 * 日期时间处理工具
 * 
 * @namespace Util
 * @class date
 */
Util.date = {
	/**
	 * 格式化日期时间字符串
	 * 
	 * @method dateTime2str
	 * @param {Date}
	 *            dt 日期对象
	 * @param {String}
	 *            fmt 格式化字符串，如：'yyyy-MM-dd hh:mm:ss'
	 * @return {String} 格式化后的日期时间字符串
	 */
	dateTime2str : function(dt, fmt) {
		var z = {
			M : dt.getMonth() + 1,
			d : dt.getDate(),
			h : dt.getHours(),
			m : dt.getMinutes(),
			s : dt.getSeconds()
		};
		fmt = fmt.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
			return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1)))
					.slice(-2);
		});
		return fmt.replace(/(y+)/g, function(v) {
			return dt.getFullYear().toString().slice(-v.length);
		});
	},
	/**
	 * 
	 * @param str 2017年10月15日
	 * @return {String} 格式化后的日期时间字符串20171015
	 */
	fromFmtToStr: function(str) {
		return str.replace('年','')
		          .replace('月','')
		          .replace('日','');
	},
	/**
	 * 
	 * @param str 20171015
	 * @return {String} 格式化后的日期时间字符串 2017年10月15日
	 */
	fromStrToFmt: function(str) {
		return str.substr(0,4) + "年"
		       + str.substr(4,2) + "月"
		       + str.substr(6,2) + "日";
	},
	/**
	 * 根据日期时间格式获取获取当前日期时间
	 * 
	 * @method dateTimeWrapper
	 * @param {String}
	 *            fmt 日期时间格式，如："yyyy-MM-dd hh:mm:ss";
	 * @return {String} 格式化后的日期时间字符串
	 */
	dateTimeWrapper : function(fmt) {
		if (arguments[0])
			fmt = arguments[0];
		return this.dateTime2str(new Date(), fmt);
	},
	/**
	 * 获取当前日期时间
	 * 
	 * @method getDatetime
	 * @param {String}
	 *            fmt [optional,default='yyyy-MM-dd hh:mm:ss'] 日期时间格式。
	 * @return {String} 格式化后的日期时间字符串
	 */
	getDatetime : function(fmt) {
		return this.dateTimeWrapper(fmt || 'yyyy-MM-dd hh:mm:ss');
	},
	/**
	 * 获取当前日期时间+毫秒
	 * 
	 * @method getDatetimes
	 * @param {String}
	 *            fmt [optional,default='yyyy-MM-dd hh:mm:ss'] 日期时间格式。
	 * @return {String} 格式化后的日期时间字符串
	 */
	getDatetimes : function(fmt) {
		var dt = new Date();
		return this.dateTime2str(dt, fmt || 'yyyy-MM-dd hh:mm:ss') + '.'
				+ dt.getMilliseconds();
	},
	/**
	 * 获取当前日期（年-月-日）
	 * 
	 * @method getDate
	 * @param {String}
	 *            fmt [optional,default='yyyy-MM-dd'] 日期格式。
	 * @return {String} 格式化后的日期字符串
	 */
	getDate : function(fmt) {
		return this.dateTimeWrapper(fmt || 'yyyy-MM-dd');
	},
	/**
	 * 获取当前时间（时:分:秒）
	 * 
	 * @method getTime
	 * @param {String}
	 *            fmt [optional,default='hh:mm:ss'] 日期格式。
	 * @return {String} 格式化后的时间字符串
	 */
	getTime : function(fmt) {
		return this.dateTimeWrapper(fmt || 'hh:mm:ss');
	}
};
/**
 * 通过 HTTP 请求加载远程数据，底层依赖jQuery的AJAX实现。当前接口实现了对jQuery AJAX接口的进一步封装。
 */
Util.ajax = {
	/**
	 * 请求状态码
	 * 
	 * @type {Object}
	 */
	reqCode : {
		/**
		 * 成功返回码 0000
		 * 
		 * @type {Number} 1
		 * @property SUCC
		 */
		SUCC : 0
	},
	/**
	 * 请求的数据类型
	 * 
	 * @type {Object}
	 * @class reqDataType
	 */
	dataType : {
		/**
		 * 返回html类型
		 * 
		 * @type {String}
		 * @property HTML
		 */
		HTML : "html",
		/**
		 * 返回json类型
		 * 
		 * @type {Object}
		 * @property JSON
		 */
		JSON : "json",
		/**
		 * 返回text字符串类型
		 * 
		 * @type {String}
		 * @property TEXT
		 */
		TEXT : "text",
		JSONP : "jsonp"
	},
	/**
	 * 超时,默认超时 30000ms
	 * 
	 * @type {Number} 10000ms
	 * @property TIME_OUT
	 */
	TIME_OUT : 30000,
//	TIME_OUT : 7000,  //防缓慢的DOS攻击,调整超时时间
	/**
	 * 显示请求成功信息
	 * 
	 * @type {Boolean} false
	 * @property SHOW_SUCC_INFO
	 */
	SHOW_SUCC_INFO : false,
	/**
	 * 显示请求失败信息
	 * 
	 * @type {Boolean} false
	 * @property SHOW_ERROR_INFO
	 */
	SHOW_ERROR_INFO : false,
	/**
	 * GetJson是对Util.ajax的封装,为创建 "GET" 请求方式返回 "JSON"(text) 数据类型
	 * @param {String}
	 *            url HTTP(GET)请求地址
	 * @param {Object}
	 *            cmd json对象参数
	 * @param {Function}
	 *            callback [optional,default=undefined] GET请求成功回调函数
	 */
	getJson : function(url, cmd, callback) {
		if (arguments.length !== 3)
			callback = cmd, cmd = '';
		//dataType = this.dataType.TEXT;
        dataType = this.dataType.JSONP;
		// var _this = this;
		// setTimeout( function(){_this.ajax(url, 'GET', cmd, dataType,
		// callback)},1000);
		this.ajax(url, 'GET', cmd, dataType, callback);
	},
	/**
	 * PostJsonAsync是对Util.ajax的封装,为创建 "POST" 请求方式返回 "JSON"(text) 数据类型,
	 * 采用同步阻塞的方式调用ajax
	 * @param {String}
	 *            url HTTP(POST)请求地址
	 * @param {Object}
	 *            cmd json对象参数
	 * @param {Function}
	 *            callback [optional,default=undefined] POST请求成功回调函数
	 */
	postJsonSync : function(url, cmd, callback) {
		dataType = this.dataType.JSONP;
		this.ajax(url, 'POST', cmd, dataType, callback, false);
	},
	/**
	 * PostJson是对Util.ajax的封装,为创建 "POST" 请求方式返回 "JSON"(text) 数据类型
	 * @param {String}
	 *            url HTTP(POST)请求地址
	 * @param {Object}
	 *            cmd json对象参数
	 * @param {Function}
	 *            callback [optional,default=undefined] POST请求成功回调函数
	 */
	postJson : function(url, cmd, callback,flag) {
        // if(!flag){Util.loading.showLoading();}
		//dataType = this.dataType.TEXT;
		dataType = this.dataType.JSONP;
		// var _this = this;
		// setTimeout( function(){_this.ajax(url, 'POST', cmd, dataType,
		// callback)},1000);
		this.ajax(url, 'POST', cmd, dataType, callback,'',flag);
	},

	/**
	 * loadHtml是对Ajax load的封装,为载入远程 HTML 文件代码并插入至 DOM 中
	 * @param {Object}
	 *            obj Dom对象
	 * @param {String}
	 *            url HTML 网页网址
	 * @param {Function}
	 *            callback [optional,default=undefined] 载入成功时回调函数
	 */
	loadHtml : function(obj, url, data, callback) {
		$(obj).load(url, data, function(response, status, xhr) {
			callback = callback ? callback : function() {
			};
			status == "success" ? callback(true) : callback(false);
		});
	},
	/**
	 * loadTemp是对handlebars 的封装,请求模版加载数据
	 * @param {Object}
	 *            obj Dom对象
	 * @param {Object}
	 *            temp 模版
	 * @param {Object}
	 *            data 数据
	 */
	loadTemp : function(obj, temp, data, callback) {
		
		//注册索引+1的helper
		var handleHelper = Handlebars.registerHelper("addOne",function(index){
		//返回+1之后的结果
		return index+1;
		});
		
		var template = Handlebars.compile((temp instanceof jQuery)?temp.html():temp);
		obj = (obj instanceof jQuery)?obj:$(obj);
		
		try {
			obj.html(template(data));
		} catch (e) {
			obj.html("");
		}
		
		
		
		if (callback) {
			callback(data);
		}
	},
	/**
	 * loadTemp是对handlebars 的封装,请求模版加载数据
	 * @param {Object}
	 *            obj Dom对象
	 * @param {Object}
	 *            temp 模版
	 * @param {Object}
	 *            data 数据
	 */
	appendTemp : function(obj, temp, data) {
		
		//注册索引+1的helper
		var handleHelper = Handlebars.registerHelper("addOne",function(index){
		//返回+1之后的结果
		return index+1;
		});
		
		var template = Handlebars.compile((temp instanceof jQuery)?temp.html():temp);
		obj = (obj instanceof jQuery)?obj:$(obj);
		obj.append(template(data));
	},
	/**
	 * afterTemp是对handlebars 的封装,请求模版加载数据并将模板加到指定div之后
	 * @param {Object}
	 *            obj Dom对象
	 * @param {Object}
	 *            temp 模版
	 * @param {Object}
	 *            data 数据
	 */
	afterTemp : function(obj, temp, data) {
		
		//注册索引+1的helper
		var handleHelper = Handlebars.registerHelper("addOne",function(index){
		//返回+1之后的结果
		return index+1;
		});
		
		var template = Handlebars.compile((temp instanceof jQuery)?temp.html():temp);
		obj = (obj instanceof jQuery)?obj:$(obj);
		$(obj).after(template(data));
	},
	/**
	 * GetHtml是对Util.ajax的封装,为创建 "GET" 请求方式返回 "hmtl" 数据类型
	 * @param {String}
	 *            url HTTP(GET)请求地址
	 * @param {Object}
	 *            cmd json对象参数
	 * @param {Function}
	 *            callback [optional,default=undefined] GET请求成功回调函数
	 */
	getHtml : function(url, cmd, callback) {
		if (arguments.length !== 3)
			callback = cmd, cmd = '';
		dataType = this.dataType.HTML;
		this.ajax(url, 'GET', cmd, dataType, callback);
	},
	/**
	 * GetHtmlSync是对Util.ajax的封装,为创建 "GET" 请求方式返回 "hmtl" 数据类型
	 * 采用同步阻塞的方式调用ajax
	 * @param {String}
	 *            url HTTP(GET)请求地址
	 * @param {Object}
	 *            cmd json对象参数
	 * @param {Function}
	 *            callback [optional,default=undefined] GET请求成功回调函数
	 */
	getHtmlSync : function(url, cmd, callback) {
		if (arguments.length !== 3)
			callback = cmd, cmd = '';
		dataType = this.dataType.HTML;
		this.ajax(url, 'GET', cmd, dataType, callback,true);
	},
	/**
	 * 基于jQuery ajax的封装，可配置化
	 * 
	 * @method ajax
	 * @param {String}
	 *            url HTTP(POST/GET)请求地址
	 * @param {String}
	 *            type POST/GET
	 * @param {Object}
	 *            cmd json参数命令和数据
	 * @param {String}
	 *            dataType 返回的数据类型
	 * @param {Function}
	 *            callback [optional,default=undefined] 请求成功回调函数,返回数据data和isSuc
	 */
	ajax : function(url, type, cmd, dataType, callback, sync,flag) {
		var param = "";
		/*if (typeof (cmd) == "object"){
			param = JSON.stringify(cmd);
		}else if(typeof(cmd)=="string"){
			param = cmd;
		}*/
		//cmd = this.jsonToUrl(cmd);
		async = sync ? false : true;
		var thiz = Util.ajax;
		var cache = (dataType == "html") ? true : false;
		
		// if(top.$.beginLoading) {
		// 	top.$.beginLoading();//打开遮罩加载层
		// }

		$.ajax({
			url : url,
			type : type,
            crossDomain: true,
			data : cmd,
			// data : encodeURI(cmd),
			/*processData: false,  	// 告诉jQuery不要去处理发送的数据
			contentType: false,		// 告诉jQuery不要去设置Content-Type请求头*/
			cache : cache,
			dataType : dataType,
            jsonp:'callback', //指定一个查询参数名称来覆盖默认的 jsonp 回调参数名 callback
            //jsonpCallback:"?",
			//contentType: "application/jsonp; charset=utf-8",
			async : async,
			timeout : thiz.TIME_OUT,
			success : function(data) {
				// if(top.$.endLoading) {
            	// 	top.$.endLoading();//关闭遮罩加载层
            	// }
				if (!data) {
					return;
				}
				if (dataType == "html") {
					callback(data, true);
					return;
				}
				try {
					if(dataType=="json"){
                        data = eval('(' + data + ')');
					}
					if (data.returnCode=='BUSIOPER=RELOGIN') {
						var postId = Util.cookie.get('postId');
						if (postId=='13' || postId=='14' || postId=='15') {
							if (top) {
				                top.document.location.href = '../../login86.html';
				            }else{
				                window.location.href = '../../login86.html';
				            }
						}else{
							if (top) {
				                top.document.location.href = '../../login.html';
				            }else{
				                window.location.href = '../../login.html';
				            }
						}
						return;
					}
				} catch (e) {
					alert("JSON Format Error:" + e.toString());
				}
				var isSuc = thiz.printReqInfo(data);
				if (callback && data) {
					callback(data || {}, isSuc);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
				// if(top.$.endLoading) {
            	// 	top.$.endLoading();//关闭遮罩加载层
            	// }
			    var retErr ={};
			    retErr['returnCode']="404";
			    retErr['returnMessage']="网络异常或超时，请稍后重试！"; 
			    if(XMLHttpRequest.status == "401"){
			    	retErr['returnCode'] = XMLHttpRequest.status;
			    	retErr['returnMessage']="您的登录状态已失效，请重新登录！";
				    $.messager.alert('提示',retErr['returnMessage'],'info',function(){
				    	top.window.location.href="../../../dev/module/index/index.html";
				    	return;
				    });
			    }else{
			    	callback(retErr, false);
			    }
			},
            complete:function(){
                //if(!flag){Util.loading.hideLoading();}
            }
		});
	},
	/**
	 * 打开请求返回代码和信息
	 * 
	 * @method printRegInfo
	 * @param {Object}
	 *            data 请求返回JSON数据
	 * @return {Boolean} true-成功; false-失败
	 */
	printReqInfo : function(data) {
		if (!data)
			return false;
		var code = data.returnCode, msg = data.returnMessage, succ = this.reqCode.SUCC;
		if (code == succ) {
			if (this.SHOW_SUCC_INFO) {
				// Util.msg.infoCorrect([ msg, ' [', code, ']' ].join(''));
				Util.msg.infoCorrect(msg);
			}
		} else {
			// Util.msg.infoAlert([ msg, ' [', code, ']' ].join(''));
			if (this.SHOW_ERROR_INFO) {
				Util.dialog.tips(msg);
			}
		}
		return !!(code == succ);
	},
	/**
	 * JSON对象转换URL参数
	 * 
	 * @method printRegInfo
	 * @param {Object}
	 *            json 需要转换的json数据
	 * @return {String} url参数字符串
	 */
	jsonToUrl : function(json) {
		var temp = [];
		for ( var key in json) {
			if (json.hasOwnProperty(key)) {
				var _key = json[key] + "";
				_key = _key.replace(/\+/g, "%2B");
				_key = _key.replace(/\&/g, "%26");
				temp.push(key + '=' + _key);
			}
		}
		return temp.join("&");
	},
	msg : {
		"suc" : function(obj, text) {
			var _text = text || "数据提交成功！";
			$(obj).html(
					'<div class="msg-hint">' + '<h3 title=' + _text
							+ '><i class="hint-icon hint-suc-s"></i>' + _text
							+ '</h3>' + '</div>').show();
		},
		"war" : function(obj, text) {
			var _text = text || "数据异常，请稍后尝试!";
			$(obj).html(
					'<div class="msg-hint">' + '<h3 title=' + _text
							+ '><i class="hint-icon hint-war-s"></i>' + _text
							+ '</h3>' + '</div>').show();
		},
		"err" : function(obj, text) {
			var _text = text || "数据提交失败!";
			$(obj).html(
					'<div class="msg-hint">' + '<h3 title=' + _text
							+ '><i class="hint-icon hint-err-s"></i>' + _text
							+ '</h3>' + '</div>').show();
		},
		"load" : function(obj, text) {
			var _text = text || "正在加载中，请稍候...";
			$(obj).html(
					'<div class="msg-hint">' + '<h3 title=' + _text
							+ '><i class="hint-loader"></i>' + _text + '</h3>'
							+ '</div>').show();
		},
		"inf" : function(obj, text) {
			var _text = text || "数据提交中，请稍等...";
			$(obj).html(
					'<div class="msg-hint">' + '<h3 title=' + _text
							+ '><i class="hint-icon hint-inf-s"></i>' + _text
							+ '</h3>' + '</div>').show();
		},
		"errorInfo" : function(obj, text) {
			var _text = text || "数据提交失败!";
			$(obj)
					.html(
							'<div class="ui-tiptext-container ui-tiptext-container-message"><p class="ui-tiptext ui-tiptext-message">'
									+ '<i class="ui-tiptext-icon icon-message" title="阻止"></i>'
									+ _text + '</p>' + '</div>').show();
		}
	}
};
var D_index=0;
Util.create = {
		/**
		*@wm
		*获取table滚动事件，标题的ID 
		*scrollwrap是滚动容器div的ID
		*title是标题table的ID
		*/
		tablescroll : function(params){
			var scrollObj , titleObj;
			D_index++;
			if(params.scroll instanceof jQuery){
				scrollObj = params.scrollwrap;
			}else{
				scrollObj = $(params.scrollwrap);
			}
			if(params.title instanceof jQuery){
				titleObj = params.title;
			}else{
				titleObj = $(params.title);
			}
			scrollObj.scroll(function(){
				titleObj.css({"top":($(this).scrollTop())})
			});
	        resetColumnWidth(titleObj);
	        if(params.height){
	        	scrollObj.height(params.height)
	        }
	        scrollObj.wrap('<div id="wrap-tab'+D_index+'"></div>');
	        //showColumns
	        if(params.showColumns){
	        	scrollObj.before(function(n){
	        		var $html='<div class="fn-clear relative"><div class="list-down"><button type="button" class="icon-btn"><span class="iconfont">&#xe699;</span><i class="iconfont">&#xe6a6;</i></button></div><div class="list-down-wrap  fn-hide"></div></div>'
	        		return $html;
	        	});
	        	var scrollwrapH = (parseInt(scrollObj.height())/2+80)+"px";
	        	$('.list-down-wrap').height(scrollwrapH);
	        	$(document).on("click",function(e){
				    $('.list-down-wrap').hide();
				});
	        	    $('.list-down',$('#wrap-tab'+D_index)).find("button").on("click",function(e){
				        Util.stopBubble(e);
				        var eventObj=e.currentTarget;
				        var display=$(eventObj).parents(".list-down").next(".list-down-wrap").css("display");
				        if(display == "none"){
				           $(eventObj).parents(".list-down").next(".list-down-wrap").show();
				        }else{
				          $(eventObj).parents(".list-down").next(".list-down-wrap").hide();
				        }
				    });
				     var $html="";
					    $.each(titleObj.find('tr th'),function(i){
					        var currentObj=$(this);
					        $html+='<li><input type="checkbox" checked="checked"  id="index_'+D_index+i+'"/><label for="index_'+D_index+i+'">'+currentObj.text()+'</label></li>'
					    });
					        if($html){
						        $('.list-down-wrap',$('#wrap-tab'+D_index)).append("<ul>"+$html+"</ul>");
						          $.each($('.list-down-wrap',$('#wrap-tab'+D_index)).find("ul li"),function(i){
						            var currentObj=$(this);
						            currentObj.on("click",function(e){
						              Util.stopBubble(e);
						               if(!currentObj.find("input[type=checkbox]").is(":checked")){
						                titleObj.find('tr th').eq(i).hide();
						                titleObj.next("table:eq(0)").find("tr").each(function(){
						                  $(this).find("td").eq(i).hide();
						                });
						                resetColumnWidth(titleObj);
						              }else{
						                titleObj.find('tr th').eq(i).show();
						                titleObj.next("table:eq(0)").find("tr").each(function(){
						                  $(this).find("td").eq(i).show();
						                })
						                resetColumnWidth(titleObj);
						              }
						            });
						          });
						        }
	        }
	 	}
	}
	//重置列宽
	var resetColumnWidth = function (obj) {
		$.each($(obj).find("tr th"),function(i){
			$(obj).next("table").find("tr td").eq(i).width($(this).width());
		})
	}
Util.browser = {
	/**
	 * 获取URL地址栏参数值
	 * name 参数名
	 * url [optional,default=当前URL]URL地址
	 * @return {String} 参数值
	 */
	getParameter : function(name, url) {
		var paramStr = url || window.location.search;
		paramStr = paramStr.split('?')[1];
		if ((!paramStr)||paramStr.length == 0) {return null;}
		var params = paramStr.split('&');
		for ( var i = 0; i < params.length; i++) {
			var parts = params[i].split('=', 2);
			if (parts[0] == name) {
				if (parts.length < 2 || typeof (parts[1]) === "undefined"
						|| parts[1] == "undefined" || parts[1] == "null")
					return '';
				return parts[1];
			}
		}
		return null;
	}
};
/**
 * 常用正则表达式
 */
Util.validate = {
	/**
	 * 格式校验方法
	 * 
	 * @method Check
	 * @param {String}
	 *            type 验证类型
	 * @param {String}
	 *            value 验证值
	 */
	Check : function(type, value) {
		var _reg = this.regexp[type];
		if (_reg == undefined) {
			alert("Type " + type + " is not in the data");
			return false;
		}
		var reg;
		if (typeof _reg == "string") {
			reg = new RegExp(_reg);
		} else if ((typeof _reg) == "function") {
			return _reg(value);
		} else {
			reg = _reg[type];
		}
		return reg.test(value);
	}
};
Util.sms = {};
Util.sms.formatStr = function(value) {
    if (value) {	
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                value = value.replace(new RegExp("\\{" + (i - 1) + "\\}", 'g'), arguments[i]);
            }
        }
    }
    return value;
};

/*
*	表格分页
*/
Util.pagination = function( pindex , onepage , obj , formStr ){
    Util.loading.create('.tablewidth');//添加loading提示
    var pageIndex = pindex;
    var pageParams = obj;
    var str = formStr; //form序列化的数据 
	pageParams.page_index = pindex;   //弹出窗口修改数据后，刷新当前页的数据需要用到这些数据.
	pageParams.page_params = formStr;
    Util.ajax.postJson( pageParams.url ,'start='+(pageIndex*pageParams.items_per_page)+'&limit='+pageParams.items_per_page+'&'+str , function(json,state){
		if (pageParams.pagination instanceof jQuery) {
			var _page = pageParams.pagination;
		}else{
			var _page = $("#"+pageParams.pagination);
		}
    	var _jcontrol = $("#J_table_control");
		if(state){
			if (pageParams.tablewrap instanceof jQuery) {
				if (typeof(pageParams.tabletpl) == 'function'){
					var template = pageParams.tabletpl;
					pageParams.tablewrap.html(template(json));
				}else{
					var template = Handlebars.compile(pageParams.tabletpl.html());
					pageParams.tablewrap.html(template(json));
				}
			}else{
	            Util.ajax.loadTemp('#'+pageParams.tablewrap,$('#'+pageParams.tabletpl),json);//加载模板
			}
            //触发回调函数
            if (typeof obj.pageCallback == 'function') {
                obj.pageCallback.call(_page, json);
            }
			//分页调用-只初始化一次  
	        if( onepage ){
	    		if(json.bean.total<1){
	    			_jcontrol.hide();
	    			_page.html('<p class="ui-tiptext ui-tiptext-warning">'+
							    '<i class="ui-tiptext-icon" title="警告"></i>'+
							    '没有查询到数据,请更换查询条件!'+
								'</p>');
	    			_page.next().hide();
                    _page.prev().hide();
	    		}else{
	    			_jcontrol.show();
		            _page.pagination( json.bean.total , {
		                'items_per_page'      : pageParams.items_per_page,
		                'current_page': pageIndex ,
		                'num_display_entries' : 3,
		                'num_edge_entries'    : 1,  
		                'link_to': '#tradeRecordsIndex' ,
		                'prev_text'           : "<",  
		                'next_text'           : ">",  
		                'call_callback_at_once' : false,  //控制分页控件第一次不触发callback.
		                'callback'            : function(page_index, jq){  
													Util.pagination(page_index , false , pageParams , str );  
												}  
		            });
		            _page.next().text("共"+json.bean.total+"条").show();

		            if(_page.prev().length<1){
                        /*var $bf = $('<div class="fn-right fn-pt5 fn-pr10">'+
                            '每页<input type="text" class="element text" style="width:24px;" id="J_pagenum" title="输入数量后,请按回车" />条'+
                        '</div>');
			            _page.before($bf);
			            $bf.find("input").keyup(function(e){
                            var _self = $(this);
                            var newVal = _self.val().replace(/[^\d]/g,'');
                            //newVal = (newVal<1) ? 10 : newVal;
                            newVal = (newVal>500) ? 500 : newVal ;
                            _self.val(newVal);
                        }).keypress(function(e){
			                if(e.which==13){
                                var _self = $(this);
                                if(_self.val()<10){
                                    _self.val(10);
                                }
			                	pageParams.items_per_page = _self.val();
			                	$("#J_search").click();
			                }
			            });*/
		            }else{
                        _page.prev().show();
                    }
	    		}
	        }
		}else{
			var _errorMsg = json.returnMessage ? ('查询数据失败！原因：'+json.returnMessage) : '加载数据失败,请稍后再试!' ;
			_page.html('<p class="ui-tiptext ui-tiptext-warning">'+
				    '<i class="ui-tiptext-icon" title="警告"></i>'+
				    ''+_errorMsg+
					'</p>');
			_jcontrol.hide();
			_page.next().hide();
            _page.prev().hide();
            var nothingHtml = '<div class="ui-loading"><h1>暂时没有数据!</h1></div>';
            if (pageParams.tablewrap instanceof jQuery) {
				pageParams.tablewrap.html(nothingHtml);
			}else{
				$('#'+pageParams.tablewrap).html(nothingHtml);
			}
		}
        Util.loading.close('.tablewidth'); //隐藏loading提示
	});
};

/*
 *	Loading
 */
Util.loading = {
//	common:function(times){
//		var html="";
//		html+='<div id="Loading" style="position:absolute;z-index:1000;top:0px;left:0px;width:100%;height:100%;font-size:15px;background-color:#eeeeee;';
//		html+='opacity: 1;   text-align:center;padding-top: 20%;">';
//		html+='<image src="../../assets/images/common/loading.gif" />';
//		html+='<font color="#15428B">正在努力加载中···</font> ';
//		html+='</div>';
//		$("body").append(html);
//		setTimeout("$('#Loading').remove()",times);
//	},
	create:function(obj,text){
		text = text?text:'正在加载中，请稍候...';
		if(top.$(obj).length){
			this.loading(top.$(obj),text);
		};
		this.loading($(obj),text);
	},
	loading:function(obj,text){
		obj.block({
            message: '<div class="fn-loading">'+text+'</div>', 
            css: { border:'1px solid #DDD', padding:"10px 20px",textAlign:"left",width:'20%'},
            overlayCSS:{
                backgroundColor: '#333', 
                opacity:  0.2, 
                cursor: 'wait' 
            }
        });
	},
	close:function(obj){
		if(top.$(obj).length){
			top.$(obj).unblock();	
		}
		$(obj).unblock();	
	}
};


/*
*	窗口控制
*	如果在页面嵌入的iframe中打开dialog，需要在params中传入top
*	top: 顶层页面
*/
Util.dialog = {
	openDiv: function(params){
		if (params.top) {
			if (top.dialog.get(params.id)) {
				top.dialog.get(params.id).remove();
			};
			var d = params.top.dialog({
				id:params.id,
				fixed: true,
				// quickClose: true,	//点击空白处弹出框消失
			    title: params.title,
			    content: params.content,
			    okValue: params.okVal,
		        ok: params.okCallback,
		        cancelValue: params.cancelVal,
		        cancel: params.cancelCallback,
		        onclose: params.closeCallback	//关闭对话框回调函数
			});
		}else{
			var d = dialog({
				id:params.id,
				fixed: true,
				// quickClose: true,	//点击空白处弹出框消失
			    title: params.title,
			    content: params.content,
			    okValue: params.okVal,
		        ok: params.okCallback,
		        cancelValue: params.cancelVal,
		        cancel: params.cancelCallback,
		        onclose: params.closeCallback	//关闭对话框回调函数
			});
		}
		d.width(params.width);
		d.height(params.height);
		if (params.modal) {
			d.showModal();
		}else{
			d.show();
		}
		return d;
	},
	tips: function(content,top, delay){
		if (top) {
			var d = top.dialog({
				fixed: true,
				quickClose: true,	//点击空白处弹出框消失
			    content: content
			});
		}else{
			var d = dialog({
				fixed: true,
				quickClose: true,	//点击空白处弹出框消失
			    content: content
			});
		}
		d.show();
		setTimeout(function () {
		    d.close().remove();
		}, delay || 2000);
	},
	confirm: function(params){
		if (params.top) {
			var d = params.top.dialog({
				id:'D_confirm',
	        	title: '提示',
				fixed: true,
			    content: params.content,
			    okValue: params.okVal?params.okVal:'确认',
		        ok: params.okCallback,
		        cancelValue: params.cancelVal?params.cancelVal:'取消',
		        cancel :function(){
		            return;
		        }
			});	
		}else{
			var d = dialog({
				id:'D_confirm',
	        	title: '提示',
				fixed: true,
			    content: params.content,
			    okValue: params.okVal?params.okVal:'确认',
		        ok: params.okCallback,
		        cancelValue: params.cancelVal?params.cancelVal:'取消',
		        cancel :function(){
		            return;
		        }
			});	
		}
		d.showModal();
	},
	close: function(id,top){
		if (top) {
	        top.dialog.get(id).close();
		}else{
            dialog.get(id).close();
		}
	}, 
	bubble:function(arguments){
		//console.log(typeof(arguments));
		/* var d = dialog({
		    content: 'Hello World!',
		    quickClose: true// 点击空白处快速关闭
		}); */
		var d = null;
		if (typeof(arguments) === 'object' && arguments.element){
			arguments.content = arguments.content || '没有内容';
			arguments.quickClose = arguments.quickClose == null ? true : arguments.quickClose ;
			d = dialog(arguments);
			d.show(arguments.element.length ? arguments.element[0] :arguments.element);
		}else{
			d.show();
		}
		
	}
};


/*
 * 功能:删除数组元素.
 * 返回:在原数组上删除后的数组
 */
Util.Arrays = {
	// 参数:dx删除元素的下标.
	removeByIndex : function(arrays , dx){
		if(isNaN(dx)||dx>arrays.length){return false;}
		for(var i=0,n=0;i<arrays.length;i++){
			if(arrays[i]!=arrays[dx]){
				arrays[n++]=arrays[i]
			}
		}
		arrays.length-=1
		return arrays;
	},
	//删除指定的item,根据数组中的值
	removeByValue : function(arrays, item ){
		for( var i = 0 ; i < arrays.length ; i++ ){
			if( item == arrays[i] ){
				break;
			}
		}
		if( i == arrays.length ){return;}
		for( var j = i ; j < arrays.length - 1 ; j++ ){
			arrays[ j ] = arrays[ j + 1 ];
		}
		arrays.length--;
		return arrays;
	}
};

/**
 * cookie 操作，设置，取出，删除
 *
 * @namespace Rose
 * @class string
 */
Util.cookie = {
	/**
	 * 显示当前对象名称路径
	 * 
	 * @method toString
	 * @return {String} 'Rose.string'
	 */
	toString : function() {
		return 'Rose.cookie';
	},  
    /**
	 * 设置一个cookie
	 * @method set
	 * @param {String} name cookie名称
	 * @param {String} value cookie值
	 * @param {String} path 所在路径
	 * @param {Number} expires 存活时间，单位:小时
	 * @param {String} domain 所在域名
	 * @return {Boolean} 是否成功
	 */
    set : function(name, value, expires, path, domain) {
       	var str = name + "=" + encodeURIComponent(value);
   		if (expires != undefined && expires != null && expires != '') {
   			if (expires == 0) {expires = 100*365*24*60;}
   			var exp = new Date();
   			exp.setTime(exp.getTime() + expires*60*1000);
   			str += "; expires=" + exp.toGMTString();
   		}
   		if (path) {
   			str += "; path=" + path;
   		} else {
   			str += "; path=/";
   		}
   		if (domain) {str += "; domain=" + domain;}
   		document.cookie = str;
    },
    /**
	 * 获取指定名称的cookie值
	 * @method get
	 * @param {String} name cookie名称
	 * @return {String} 获取到的cookie值
	 */
	get : function(name) {
		var v = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
		return v ? decodeURIComponent(v[1]) : null;
	},
	/**
	 * 删除指定cookie,复写为过期
	 * @method remove 
	 * @param {String} name cookie名称
	 * @param {String} path 所在路径
	 * @param {String} domain 所在域
	 */
	remove : function(name, path, domain) {
		document.cookie = name + "=" +
			((path) ? "; path=" + path : "") +
			((domain) ? "; domain=" + domain : "") +
			"; expires=Thu, 01-Jan-70 00:00:01 GMT";
	}
};

Util.token = {
		formatUrl : function(url) {
			if (userInfoSession) {
				if (url.indexOf("?") > 0) {
					return url + "&token=" + userInfoSession.token;
				} else {
					return url + "?token=" + userInfoSession.token;
				}
			}
			return url;
		},
		formatReportUrl: function(reportCode, url, callback) {
/*			srvMap.add('reportToken', '','front/sh/login!initAuthToken?uid=t001');
			callback = callback ? callback : function() {};
			Util.ajax.postJson(srvMap.get('reportToken'), {'reportCode':reportCode}, function(json, status) {
				if(url)
				{
					var formatUrl = url;
					if (json.bean.token) {
						if (url.indexOf("?") > 0) {
							formatUrl = url + "&token=" + json.bean.token;
						} else {
							formatUrl = url + "?token=" + json.bean.token;
						}
					} else {
						alert("报表 token获取失败！");
					}
					
					callback(formatUrl);
				}
			});*/
			var formaturl = "";
			if (userInfoSession) {
				if (url.indexOf("?") > 0) {
					formaturl =  url + "&token=" + userInfoSession.token;
				} else {
					formaturl = url + "?token=" + userInfoSession.token;
				}
			}
			callback(formaturl);
		}
};
/**
 * * 对Date的扩展，将 Date 转化为指定格式的String *
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符 * 年(y)可以用 1-4
 * 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new Date()).pattern("yyyy-MM-dd
 * hh:mm:ss.S")==> 2006-07-02 08:09:04.423 (new Date()).pattern("yyyy-MM-dd E
 * HH:mm:ss") ==> 2009-03-10 二 20:09:04 (new Date()).pattern("yyyy-MM-dd EE
 * hh:mm:ss") ==> 2009-03-10 周二 08:09:04 (new Date()).pattern("yyyy-MM-dd EEE
 * hh:mm:ss") ==> 2009-03-10 星期二 08:09:04 (new Date()).pattern("yyyy-M-d
 * h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.Format = function(fmt) {
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
		"H+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	var week = {
		"0" : "/u65e5",
		"1" : "/u4e00",
		"2" : "/u4e8c",
		"3" : "/u4e09",
		"4" : "/u56db",
		"5" : "/u4e94",
		"6" : "/u516d"
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	if (/(E+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1,((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f": "/u5468"): "")+ week[this.getDay() + ""]);
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};
String.prototype.gblength = function() {
	var len = 0;
	for (var i = 0; i < this.length; i++) {
		if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
			//db2:+3 oracle:+2
			len += 3;
		} else {
			len++;
		}
	}
	return len;
}
// 将Util对象注册为符合AMD规范的模块，可使用requireJS模块化加载
if (typeof define === "function" && define.amd) {
    define('Util',[], function () {
    	return Util;
    });
}

/*
    NiceSelect ： 获取下拉框
    参数设置：
    {
        url:"添加",
        datas:"",
        id : "J_form_add",
        name : "J_form_add",
        handler:function(){
          //do...
        }
    }
    eg:
    {
        url:"business?service=ajax&page=Common&listener=getStaticData",
        datas:"codeType="+codeType,
        id:"testId",
        name:"testId"
    }
*/
(function($){
    $.fn.extend({
        "NiceSelect":function(options){
            var _self = this;
            options = $.extend({
                url:"../../data/selectDatas.json",
                datas:"codeType=test",
                id:"testId",
                name:"testId",
                key :"value",
                value:"text",
                defaultValue:"",
                allJson:"",
                all:false, //是否显示"所有",值是"" 。 默认显示"请选择"，值是"" 
                allVal:"",
                handler:function(){ //onchange事件
                }, 
                callback:function(){ //回调事件
                }
            },options);
            sendAjax();
            function sendAjax(){
                Util.ajax.postJson(options.url, options.datas , ajaxCallback);
            }
            function errorAjax(){
                var $a = $('<a href="javascript:;">重新加载数据</a>')
                .bind("click",function(){
                    sendAjax();
                });
                _self.html($a);
            }
            function ajaxCallback(json,state){
                //判断状态,是否成功
                if(state){
                    var ops = '<select class="element text" id="'+options.id+'" name="'+options.name+'" >';
                    if(json.beans.length!=1){
                        if( (typeof options.all=="boolean")&&(options.all.constructor==Boolean) ){
                            if(options.all){
                                ops += '<option value="">所有</option>'; 
                            }else{
                                ops += '<option value="">请选择</option>';
                            }
                        }else{
                            if(options.all!=""){
                                ops += '<option value="'+options.allVal+'">'+options.all+'</option>';
                            }else{
                                ops += '';
                            }
                        }
                    }else{
                    	ops += '<option value="">请选择</option>';
                    }


                    for(var i=0;i<json.beans.length;i++){
                    	//添加设置默认值
                    	var sel = "", allJson= '';
                    	if(options.defaultValue){
                    		sel = (json.beans[i][options.key]==options.defaultValue) ? "selected='selected'" :"" ;
                    	}
                    	if (options.allJson) {
                    		allJson = "alljson='"+JSON.stringify(json.beans[i])+"'";
                    	};
                    	ops += '<option value="'+json.beans[i][options.key]+'" '+sel+' '+allJson+' >'+json.beans[i][options.value]+'</option>';
                    }
                    ops += '</select>';
                    _self.html( $(ops).bind("change",options.handler) );
                    //触发回调函数
                    if (typeof options.callback == 'function') {
                    	options.callback.call(_self.find("select")[0]);
                    }
                	if(options.muti){
                	}else{
                        //把下拉框变成可以输入的下拉框
                        //_self.find("select").combobox();
                	}
                }else{
                    errorAjax();
                }
            }
            _self.setValue = function(val){
            	var $select = $('select', _self);
            	$select.val(val);
            }
            return this;
        }
    });
})(jQuery);



(function(jQuery) {
	//require(["../assets/css/loading.css"]);
	
	jQuery.extend({
		_loadingEnable : true,
		_loadingCounter : 0,
		_loadingId : false,
		enableLoading : function() {
			jQuery._loadingEnable = true;
			jQuery.clearLoading();
		},
		disableLoading : function() {
			jQuery._loadingEnable = false;
			jQuery.clearLoading();
		},
		beginLoading : function(msg) {
			if (!jQuery._loadingEnable) {
				return;
			}

			if (!msg) {
				msg = "载入中...";
			}
			// layer.load(msg);
			// top.layer.msg
			if (jQuery._loadingCounter == 0 && !jQuery._loadingId) {
				jQuery._loadingId = layer.loading();
			}
			jQuery._loadingCounter++;
		},
		endLoading : function() {
			if (!jQuery._loadingEnable) {
				return;
			}
			--jQuery._loadingCounter;
			if (jQuery._loadingCounter < 0 || !jQuery._loadingId) {
				jQuery._loadingCounter = 0;
				jQuery._loadingId = false;
				return;
			}
			if (jQuery._loadingCounter === 0) {
				layer.close(jQuery._loadingId);
				jQuery._loadingId = false;
			}
		},
		clearLoading : function() {
			jQuery._loadingCounter = 0;
			layer.closeAll();
		}
	});
	

	var layer = {
			zIndex : 100000,
			index : 10000,
	};
	
	jQuery.extend(layer, {
		loading : function() {
			var index = layer.index++;
			//遮罩
			var shade = $('<div class="s-loading-shade" id="s-loading-shade' + index + '" ' + 
					'style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background-color: #fff;opacity: 0.2;"></div>');
			shade.css("z-index", layer.zIndex).data("_loading_index_", index).appendTo($("body"));
			//主体
			var content = $('<div class="s-loading" id="s-loading' + index + '" ' + 
					'style="position: fixed;border-radius: 100%;background: 0 0;box-shadow: none;border: none;">' + 
					'<div class="s-loading-content" style="width: 37px;height: 37px;position: relative;">' + 
					'</div></div>');
			//主体位置
			var top = ($(window).height() - content.outerHeight()) / 2;
			var left = ($(window).width() - content.outerWidth()) / 2;
			content.css("top", top).css("left", left).css("background", "url(/dmc/dev/assets/images/loading.gif) no-repeat").css("z-index", layer.zIndex + 1).data("_loading_index_", index).appendTo($("body"));
			return index;
		},

		close : function(index) {
			$("#s-loading" + index).remove();
			$("#s-loading-shade" + index).remove();
		},

		closeAll : function() {
			$(".s-loading").remove();
			$(".s-loading-shade").remove();
		}
	});
})(jQuery);