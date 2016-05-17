require('./listGroupCtrl.js');

(function (app) {
	app.directive('listGroup', function () {
		return {
			templateUrl: '/app/components/listGroup/listGroup.html',
			controller : 'listGroupCtrl as list',
			scope: {
				data: '=info'
			}
		}
	})
})(angular.module('ecomApp'));