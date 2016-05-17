(function (app) {
	app.controller('purchaseSuccessfulCtrl', purchaseSuccessfulCtrl);

	function purchaseSuccessfulCtrl(data) {
		this.data = data;

		this.authorizationCode = function () {
			return Math.round( Math.random() * Math.pow(10, 12) );
		}
	}

	purchaseSuccessfulCtrl.$inject = ['data'];
	
	
})(angular.module('ecomApp'));