require('./cartTableCtrl.js');

(function (app) {
	app.directive('cartTable', function () {
		return {
			templateUrl: '/app/components/cartTable/cartTable.html',
			controller : 'cartTableCtrl as cart',
			scope: {
				cartData: '=cartData'
			}
		}
	})
})(angular.module('ecomApp'));