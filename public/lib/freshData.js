/*
 * 实时刷新数据的几种方法
 * comet 利用EventSource 对象
 *
 */
(function(window){
	var freshData = {};
	window.freshData = freshData;

	freshData.comet = function(config){
		this.source =  new EventSource(config.url);
	}

	freshData.comet.prototype = {
		constructor:freshData.comet,
		init:function(){
			var self = this;
			self.inited = true;
			self.bindOpen();
			self.bindMessage();
			self.bindError();
		},
		bindOpen:function(){
			var self = this;
			self.source.addEventListener('open',function(d){
				self.openfn(d);
			});
		},
		bindError:function(){
			var self = this;
			self.source.addEventListener('error',function(err){
				self.unlinkfn(err);
			});
		},
		bindMessage:function(){
			var self = this;
			self.source.addEventListener("message",function(d){
				var obj = JSON.parse(d.data);
				if(obj && obj.heart != undefined) {
					self.heartbeatfn(obj.heart);
				}
				if(obj && obj.data != undefined) {
					self.messagefn(obj.data);
				}

			});
		},
		bindfn:function(name,fn){
			var self = this;
			var n = 0;
			var functions = ['message','open','unlink','heartbeat'];
			if( !~functions.indexOf(name) ) {
				//不允许绑定的函数
				console.error(name+" is not exists");
				return false;
			}

			if( Object.prototype.toString.call(fn) !== "[object Function]") {
				console.error('The second argument is not a function');
				return false;
			}

			self[name+'fn'] = fn;

			if( self["openfn"] && self["messagefn"] && !self.inited ) {
				//当open 和 message都绑定之后，初始化连接
				self.init();
			}
		}
	}
}(window))