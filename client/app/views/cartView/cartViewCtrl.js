(function (app) {
	app.controller('cartViewCtrl', cartViewCtrl);

	function cartViewCtrl(data) {
		this.data = data;

	
	}


	cartViewCtrl.$inject = ['data'];
	
})(angular.module('ecomApp'));