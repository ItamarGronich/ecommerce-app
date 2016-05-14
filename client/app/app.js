(function (angular) {

	function configApp($routeProvider, $provide) {
		
		$provide.decorator('$rootScope', ['$delegate', function ($delegate) {

			Object.defineProperty($delegate.constructor.prototype, '$onRootScope', {
				value: function(name, listener){
					var unsubscribe = $delegate.$on(name, listener);
					this.$on('$destroy', unsubscribe);

					return unsubscribe;
				},
				enumerable: false
			});

			return $delegate;
		}]);
		
		$routeProvider
			.when('/', {
				redirectTo: '/home/'
			})
			.when('/home/', {
				templateUrl: '/app/views/homeView.html',
				resolve: {
					data: function (dataService) {
						return dataService.getData();
					}
				},
				controller: 'homeViewCtrl as home'
			})
	}
	
	configApp.$inject = ['$routeProvider', '$provide'];
	
	angular.module('ecomApp', ['ngRoute'])
		.config(configApp);
})(angular);

require('./services/routerService.js');
require('./services/dataService.js');
require('./components/navbar/navbar.js');
require('./components/item/item.js');
require('./components/item-board/item-board.js');
require('./views/homeViewCtrl.js');
