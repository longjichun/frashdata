const http = require("http");
const fs = require("fs");
const url = require("url");

const __staticFileName = 'public';

var route = require('./server/route');
/*--------------------------------添加接口路由 start--------------------------------*/

route.use('test',function(innerReq,innerRes){
	innerRes.writeHead(200,{'Content-Type':'text/event-stream'});
	var n = x = 0;
	n = parseInt(Math.random()*2) ? 10 : 1;
	setTimeout(function(){
		n++
		x++;
		innerRes.write("data: " + JSON.stringify({"heart":x}) + '\n\n');
		innerRes.write("data: "+JSON.stringify({"data":n}) + '\n\n');
		var returnFn = arguments.callee;
		setTimeout(returnFn,2000);
	},2000)
});	

/*--------------------------------添加接口路由 end--------------------------------*/



/*--------------------------------加载静态文件 start------------------------------*/
function getStaticFn(res,pathname){
	var fileurl = './'+__staticFileName+pathname;
	fs.stat(fileurl,function(err,stats){
		if( err ) {
			res.writeHead(404);
			res.end('404:'+fileurl+'is not found');
		} else {
			var readerStream = fs.createReadStream(fileurl);
			readerStream.pipe(res);
		}
	});
}
/*--------------------------------加载静态文件 end------------------------------*/

/*--------------------------------创建服务 start--------------------------------*/
http.createServer(function(req,res){

	var urlObj = url.parse(req.url,true);
	var pathname = urlObj.pathname;
	var reqAccept = req.headers.accept;

	if( ~route.contents.indexOf( pathname.replace("/","") ) ) {
		//处理非静态文件的接口
		route.detail[ pathname.replace("/","") ].fn(req,res);

	} else { 
		getStaticFn(res,pathname)	
	}

}).listen(4283)
/*--------------------------------创建服务 end--------------------------------*/
