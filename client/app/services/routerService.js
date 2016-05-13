(function (app) {
	app.service('routerService', routerService);


	function routerService($location) {

		this.getCurrentPath = function () {
			return $location.path().split('/').filter(function (el) {
				return !!el;
			});
		};
		
		this.setCurrentPath = function (value) {
			if (typeof value === 'string') {
				return $location.path(value);
			} else if (Array.isArray(value)) {
				return $location.path('/' + value.join('/'));
			}
		};
		
	}
	
	routerService.$inject = ['$location'];
})(angular.module('ecomApp'));