var route = {
	contents:[],
	detail:{},
	use:function(r,fn){
		var that = this;
		that.contents.push(r);
		if( that.detail[r] ) {
			that.detail[r].fn = fn;
		} else {
			that.detail[r] = {};
			that.detail[r].fn = fn;
		}
	}
};
module.exports = route;