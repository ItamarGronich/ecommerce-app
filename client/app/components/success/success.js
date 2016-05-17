require('./successCtrl.js')

(function (app) {
	app.directive('success', function () {
		return {
			restrict: 'AE',
			templateUrl: '/app/components/success/success.html',
			scope: {
				header: '=header',
				content: '=content',
				button: '=button'
			},
			controller: 'successCtrl'
		}
	})
})(angular.module('ecomApp'))  ;