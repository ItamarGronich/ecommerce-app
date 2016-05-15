(function (app) {
	app.controller('homeViewCtrl', homeViewCtrl);

	function homeViewCtrl(data) {
		
		this.data = data;
		
	}
	
	homeViewCtrl.$inject = ['data'];
})(angular.module('ecomApp'));