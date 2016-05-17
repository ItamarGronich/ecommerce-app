(function (app) {
	app.controller('adminViewCtrl', adminViewCtrl);

	function adminViewCtrl(data) {
		this.data = data;
		console.log(data);
		
	}


	adminViewCtrl.$inject = ['data'];

})(angular.module('ecomApp'));