require('./navbarCtrl.js');

(function (app) {
	app.directive('navBar', function () {
		return {
			templateUrl: '/app/components/navbar/navbar.html',
			controller : 'navbarCtrl as nav'
		}
	})
})(angular.module('ecomApp'));