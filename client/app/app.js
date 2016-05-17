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
				templateUrl: '/app/views/homeView/homeView.html',
				resolve: {
					data: ['dataService',function (dataService) {
						
						return dataService.getData()
							.then(function (resolve) {return resolve.data;});
					}]
				},
				controller: 'homeViewCtrl as home'
			})
			.when('/cart/', {
				templateUrl: 'app/views/cartView/cartView.html',
				resolve: {
					data: ['dataService', function (dataService) {
						return dataService.getInCart()
							.then(function (resolve) {return resolve.data;});
					}]
				},
				controller: 'cartViewCtrl as cart'
			})
			.when('/checkout/', {
				templateUrl: 'app/views/checkoutView/checkoutView.html',
				resolve: {
					data: ['dataService', function (dataService) {
						return dataService.getInCart()
							.then(function (resolve) {return resolve.data;});
					}]
				},
				controller: 'checkoutViewCtrl as checkout'
			})
	}
	
	configApp.$inject = ['$routeProvider', '$provide'];
	
	angular.module('ecomApp', ['ngRoute'])
		.config(configApp);
})(angular);


/*
 * Services
 **/
require('./services/routerService.js');
require('./services/dataService.js');

/*
 * Components
 **/
require('./components/navbar/navbar.js');
require('./components/item/item.js');
require('./components/item-board/item-board.js');
require('./components/cartTable/cartTable.js');

/*
 * Views
 **/
require('./views/homeView/homeViewCtrl.js');
require('./views/cartView/cartViewCtrl.js');
require('./views/checkoutView/checkoutViewCtrl.js');
