(function (app) {
	app.controller('checkoutViewCtrl', checkoutViewCtrl);

	function checkoutViewCtrl(data) {
		this.data = data;

	}

	checkoutViewCtrl.$inject = ['data'];
	
	
})(angular.module('ecomApp'));