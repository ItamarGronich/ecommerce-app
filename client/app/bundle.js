(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

require('./services/routerService.js');
require('./services/dataService.js');
require('./components/navbar/navbar.js');
require('./components/item/item.js');
require('./components/item-board/item-board.js');
require('./views/homeView/homeViewCtrl.js');
require('./views/cartView/cartViewCtrl.js');
require('./views/checkoutView/checkoutViewCtrl.js');

},{"./components/item-board/item-board.js":2,"./components/item/item.js":3,"./components/navbar/navbar.js":4,"./services/dataService.js":6,"./services/routerService.js":7,"./views/cartView/cartViewCtrl.js":8,"./views/checkoutView/checkoutViewCtrl.js":9,"./views/homeView/homeViewCtrl.js":10}],2:[function(require,module,exports){
(function (app) {
	
	app.directive('itemBoard', function () {
		return {
			templateUrl: 'app/components/item-board/item-board.html'
		}
	})
	
	
})(angular.module('ecomApp'));
},{}],3:[function(require,module,exports){
(function (app) {

	app.directive('item', function () {
		return {
			restrict:'AE',
			templateUrl: 'app/components/item/item.html',
			controller: ['dataService', '$scope' , function (dataService, $scope) {
				
				
				$scope.addToCart = function (item) {
					console.log(item);
					
					dataService.storeInCart(item);
				}
				
				
			}]
		}
	})


})(angular.module('ecomApp'));
},{}],4:[function(require,module,exports){
require('./navbarCtrl.js');

(function (app) {
	app.directive('navBar', function () {
		return {
			templateUrl: '/app/components/navbar/navbar.html',
			controller : 'navbarCtrl as nav'
		}
	})
})(angular.module('ecomApp'));
},{"./navbarCtrl.js":5}],5:[function(require,module,exports){
(function (app, $) {


	app.controller('navbarCtrl', navbarController);

	function navbarController(routerService, $rootScope) {

		var $links = $( '#navbarLinks').find('a');


		$rootScope.$onRootScope('$routeChangeSuccess', renderState);

		function renderState() {
			console.log('FIRED');
			
			var path = routerService.getCurrentPath()[0];


			$links.each(function () {
				var $el = $( this ),
				    isElement = $el.text().toLowerCase() === path;


				$el.parent().toggleClass('active', isElement);

			});


		}



		function changeTabs(event) {
			routerService.setCurrentPath('/' + event.target.textContent.toLowerCase() + '/');
		}

		this.changeTabs = changeTabs;



	}

	navbarController.$inject = ['routerService', '$rootScope'];


})(angular.module('ecomApp'), jQuery);
},{}],6:[function(require,module,exports){
(function (app) {
	app.service('dataService', dataService);

	function dataService($http) {
		
		
		var cart = [],
			items = [];

		function getData() {
			return $http.get('/items');
		}
		
		function storeInCart(item) {
			return $http.post('/cart', item)
		}

		function getInCart() {
			return $http.get('/cart');
		}

		this.getData = getData;
		
		this.storeInCart = storeInCart;
		
		this.getInCart = getInCart;
	}

	dataService.$inject = ['$http'];
})(angular.module('ecomApp'));
},{}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
(function (app) {
	app.controller('cartViewCtrl', cartViewCtrl);

	function cartViewCtrl(data) {
		this.data = data;

		function totalPrice() {
			var count = 0;
			data.forEach(function (e) {
				count += e.price * e.quantity;
				console.log('quantity ' + e.quantity);
				
			});
			return count;
		}

		this.totalPrice = totalPrice;
	}


	cartViewCtrl.$inject = ['data'];
	
})(angular.module('ecomApp'));
},{}],9:[function(require,module,exports){
(function (app) {
	app.controller('checkoutViewCtrl', checkoutViewCtrl);

	function checkoutViewCtrl(data) {
		console.log(data);
		
		this.data = data;


		function totalPrice() {
			var count = 0;
			data.forEach(function (e) {
				count += e.price * e.quantity;
				console.log('quantity ' + e.quantity);

			});
			return count;
		}

		this.totalPrice = totalPrice;

	}

	checkoutViewCtrl.$inject = ['data'];
	
	
})(angular.module('ecomApp'));
},{}],10:[function(require,module,exports){
(function (app) {
	app.controller('homeViewCtrl', homeViewCtrl);

	function homeViewCtrl(data) {
		
		this.data = data;
		
	}
	
	homeViewCtrl.$inject = ['data'];
})(angular.module('ecomApp'));
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvYXBwL2FwcC5qcyIsImNsaWVudC9hcHAvY29tcG9uZW50cy9pdGVtLWJvYXJkL2l0ZW0tYm9hcmQuanMiLCJjbGllbnQvYXBwL2NvbXBvbmVudHMvaXRlbS9pdGVtLmpzIiwiY2xpZW50L2FwcC9jb21wb25lbnRzL25hdmJhci9uYXZiYXIuanMiLCJjbGllbnQvYXBwL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhckN0cmwuanMiLCJjbGllbnQvYXBwL3NlcnZpY2VzL2RhdGFTZXJ2aWNlLmpzIiwiY2xpZW50L2FwcC9zZXJ2aWNlcy9yb3V0ZXJTZXJ2aWNlLmpzIiwiY2xpZW50L2FwcC92aWV3cy9jYXJ0Vmlldy9jYXJ0Vmlld0N0cmwuanMiLCJjbGllbnQvYXBwL3ZpZXdzL2NoZWNrb3V0Vmlldy9jaGVja291dFZpZXdDdHJsLmpzIiwiY2xpZW50L2FwcC92aWV3cy9ob21lVmlldy9ob21lVmlld0N0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG5cblx0ZnVuY3Rpb24gY29uZmlnQXBwKCRyb3V0ZVByb3ZpZGVyLCAkcHJvdmlkZSkge1xuXHRcdFxuXHRcdCRwcm92aWRlLmRlY29yYXRvcignJHJvb3RTY29wZScsIFsnJGRlbGVnYXRlJywgZnVuY3Rpb24gKCRkZWxlZ2F0ZSkge1xuXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoJGRlbGVnYXRlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJyRvblJvb3RTY29wZScsIHtcblx0XHRcdFx0dmFsdWU6IGZ1bmN0aW9uKG5hbWUsIGxpc3RlbmVyKXtcblx0XHRcdFx0XHR2YXIgdW5zdWJzY3JpYmUgPSAkZGVsZWdhdGUuJG9uKG5hbWUsIGxpc3RlbmVyKTtcblx0XHRcdFx0XHR0aGlzLiRvbignJGRlc3Ryb3knLCB1bnN1YnNjcmliZSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gdW5zdWJzY3JpYmU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuICRkZWxlZ2F0ZTtcblx0XHR9XSk7XG5cdFx0XG5cdFx0JHJvdXRlUHJvdmlkZXJcblx0XHRcdC53aGVuKCcvJywge1xuXHRcdFx0XHRyZWRpcmVjdFRvOiAnL2hvbWUvJ1xuXHRcdFx0fSlcblx0XHRcdC53aGVuKCcvaG9tZS8nLCB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL2FwcC92aWV3cy9ob21lVmlldy9ob21lVmlldy5odG1sJyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGRhdGE6IFsnZGF0YVNlcnZpY2UnLGZ1bmN0aW9uIChkYXRhU2VydmljZSkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YVNlcnZpY2UuZ2V0RGF0YSgpXG5cdFx0XHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXNvbHZlKSB7cmV0dXJuIHJlc29sdmUuZGF0YTt9KTtcblx0XHRcdFx0XHR9XVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb250cm9sbGVyOiAnaG9tZVZpZXdDdHJsIGFzIGhvbWUnXG5cdFx0XHR9KVxuXHRcdFx0LndoZW4oJy9jYXJ0LycsIHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvdmlld3MvY2FydFZpZXcvY2FydFZpZXcuaHRtbCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRkYXRhOiBbJ2RhdGFTZXJ2aWNlJywgZnVuY3Rpb24gKGRhdGFTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YVNlcnZpY2UuZ2V0SW5DYXJ0KClcblx0XHRcdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlc29sdmUpIHtyZXR1cm4gcmVzb2x2ZS5kYXRhO30pO1xuXHRcdFx0XHRcdH1dXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdjYXJ0Vmlld0N0cmwgYXMgY2FydCdcblx0XHRcdH0pXG5cdFx0XHQud2hlbignL2NoZWNrb3V0LycsIHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvdmlld3MvY2hlY2tvdXRWaWV3L2NoZWNrb3V0Vmlldy5odG1sJyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGRhdGE6IFsnZGF0YVNlcnZpY2UnLCBmdW5jdGlvbiAoZGF0YVNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhU2VydmljZS5nZXRJbkNhcnQoKVxuXHRcdFx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzb2x2ZSkge3JldHVybiByZXNvbHZlLmRhdGE7fSk7XG5cdFx0XHRcdFx0fV1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udHJvbGxlcjogJ2NoZWNrb3V0Vmlld0N0cmwgYXMgY2hlY2tvdXQnXG5cdFx0XHR9KVxuXHR9XG5cdFxuXHRjb25maWdBcHAuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInLCAnJHByb3ZpZGUnXTtcblx0XG5cdGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJywgWyduZ1JvdXRlJ10pXG5cdFx0LmNvbmZpZyhjb25maWdBcHApO1xufSkoYW5ndWxhcik7XG5cbnJlcXVpcmUoJy4vc2VydmljZXMvcm91dGVyU2VydmljZS5qcycpO1xucmVxdWlyZSgnLi9zZXJ2aWNlcy9kYXRhU2VydmljZS5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL25hdmJhci9uYXZiYXIuanMnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9pdGVtL2l0ZW0uanMnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9pdGVtLWJvYXJkL2l0ZW0tYm9hcmQuanMnKTtcbnJlcXVpcmUoJy4vdmlld3MvaG9tZVZpZXcvaG9tZVZpZXdDdHJsLmpzJyk7XG5yZXF1aXJlKCcuL3ZpZXdzL2NhcnRWaWV3L2NhcnRWaWV3Q3RybC5qcycpO1xucmVxdWlyZSgnLi92aWV3cy9jaGVja291dFZpZXcvY2hlY2tvdXRWaWV3Q3RybC5qcycpO1xuIiwiKGZ1bmN0aW9uIChhcHApIHtcblx0XG5cdGFwcC5kaXJlY3RpdmUoJ2l0ZW1Cb2FyZCcsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9pdGVtLWJvYXJkL2l0ZW0tYm9hcmQuaHRtbCdcblx0XHR9XG5cdH0pXG5cdFxuXHRcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cblx0YXBwLmRpcmVjdGl2ZSgnaXRlbScsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6J0FFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvaXRlbS9pdGVtLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogWydkYXRhU2VydmljZScsICckc2NvcGUnICwgZnVuY3Rpb24gKGRhdGFTZXJ2aWNlLCAkc2NvcGUpIHtcblx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0XHQkc2NvcGUuYWRkVG9DYXJ0ID0gZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhpdGVtKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRkYXRhU2VydmljZS5zdG9yZUluQ2FydChpdGVtKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHR9XVxuXHRcdH1cblx0fSlcblxuXG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCJyZXF1aXJlKCcuL25hdmJhckN0cmwuanMnKTtcblxuKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLmRpcmVjdGl2ZSgnbmF2QmFyJywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0ZW1wbGF0ZVVybDogJy9hcHAvY29tcG9uZW50cy9uYXZiYXIvbmF2YmFyLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlciA6ICduYXZiYXJDdHJsIGFzIG5hdidcblx0XHR9XG5cdH0pXG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCwgJCkge1xuXG5cblx0YXBwLmNvbnRyb2xsZXIoJ25hdmJhckN0cmwnLCBuYXZiYXJDb250cm9sbGVyKTtcblxuXHRmdW5jdGlvbiBuYXZiYXJDb250cm9sbGVyKHJvdXRlclNlcnZpY2UsICRyb290U2NvcGUpIHtcblxuXHRcdHZhciAkbGlua3MgPSAkKCAnI25hdmJhckxpbmtzJykuZmluZCgnYScpO1xuXG5cblx0XHQkcm9vdFNjb3BlLiRvblJvb3RTY29wZSgnJHJvdXRlQ2hhbmdlU3VjY2VzcycsIHJlbmRlclN0YXRlKTtcblxuXHRcdGZ1bmN0aW9uIHJlbmRlclN0YXRlKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ0ZJUkVEJyk7XG5cdFx0XHRcblx0XHRcdHZhciBwYXRoID0gcm91dGVyU2VydmljZS5nZXRDdXJyZW50UGF0aCgpWzBdO1xuXG5cblx0XHRcdCRsaW5rcy5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyICRlbCA9ICQoIHRoaXMgKSxcblx0XHRcdFx0ICAgIGlzRWxlbWVudCA9ICRlbC50ZXh0KCkudG9Mb3dlckNhc2UoKSA9PT0gcGF0aDtcblxuXG5cdFx0XHRcdCRlbC5wYXJlbnQoKS50b2dnbGVDbGFzcygnYWN0aXZlJywgaXNFbGVtZW50KTtcblxuXHRcdFx0fSk7XG5cblxuXHRcdH1cblxuXG5cblx0XHRmdW5jdGlvbiBjaGFuZ2VUYWJzKGV2ZW50KSB7XG5cdFx0XHRyb3V0ZXJTZXJ2aWNlLnNldEN1cnJlbnRQYXRoKCcvJyArIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpICsgJy8nKTtcblx0XHR9XG5cblx0XHR0aGlzLmNoYW5nZVRhYnMgPSBjaGFuZ2VUYWJzO1xuXG5cblxuXHR9XG5cblx0bmF2YmFyQ29udHJvbGxlci4kaW5qZWN0ID0gWydyb3V0ZXJTZXJ2aWNlJywgJyRyb290U2NvcGUnXTtcblxuXG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpLCBqUXVlcnkpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5zZXJ2aWNlKCdkYXRhU2VydmljZScsIGRhdGFTZXJ2aWNlKTtcblxuXHRmdW5jdGlvbiBkYXRhU2VydmljZSgkaHR0cCkge1xuXHRcdFxuXHRcdFxuXHRcdHZhciBjYXJ0ID0gW10sXG5cdFx0XHRpdGVtcyA9IFtdO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0RGF0YSgpIHtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9pdGVtcycpO1xuXHRcdH1cblx0XHRcblx0XHRmdW5jdGlvbiBzdG9yZUluQ2FydChpdGVtKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2NhcnQnLCBpdGVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldEluQ2FydCgpIHtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9jYXJ0Jyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5nZXREYXRhID0gZ2V0RGF0YTtcblx0XHRcblx0XHR0aGlzLnN0b3JlSW5DYXJ0ID0gc3RvcmVJbkNhcnQ7XG5cdFx0XG5cdFx0dGhpcy5nZXRJbkNhcnQgPSBnZXRJbkNhcnQ7XG5cdH1cblxuXHRkYXRhU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddO1xufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLnNlcnZpY2UoJ3JvdXRlclNlcnZpY2UnLCByb3V0ZXJTZXJ2aWNlKTtcblxuXG5cdGZ1bmN0aW9uIHJvdXRlclNlcnZpY2UoJGxvY2F0aW9uKSB7XG5cblx0XHR0aGlzLmdldEN1cnJlbnRQYXRoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuICRsb2NhdGlvbi5wYXRoKCkuc3BsaXQoJy8nKS5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XG5cdFx0XHRcdHJldHVybiAhIWVsO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRcblx0XHR0aGlzLnNldEN1cnJlbnRQYXRoID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRyZXR1cm4gJGxvY2F0aW9uLnBhdGgodmFsdWUpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRyZXR1cm4gJGxvY2F0aW9uLnBhdGgoJy8nICsgdmFsdWUuam9pbignLycpKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHR9XG5cdFxuXHRyb3V0ZXJTZXJ2aWNlLiRpbmplY3QgPSBbJyRsb2NhdGlvbiddO1xufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLmNvbnRyb2xsZXIoJ2NhcnRWaWV3Q3RybCcsIGNhcnRWaWV3Q3RybCk7XG5cblx0ZnVuY3Rpb24gY2FydFZpZXdDdHJsKGRhdGEpIHtcblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xuXG5cdFx0ZnVuY3Rpb24gdG90YWxQcmljZSgpIHtcblx0XHRcdHZhciBjb3VudCA9IDA7XG5cdFx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Y291bnQgKz0gZS5wcmljZSAqIGUucXVhbnRpdHk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdxdWFudGl0eSAnICsgZS5xdWFudGl0eSk7XG5cdFx0XHRcdFxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY291bnQ7XG5cdFx0fVxuXG5cdFx0dGhpcy50b3RhbFByaWNlID0gdG90YWxQcmljZTtcblx0fVxuXG5cblx0Y2FydFZpZXdDdHJsLiRpbmplY3QgPSBbJ2RhdGEnXTtcblx0XG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuY29udHJvbGxlcignY2hlY2tvdXRWaWV3Q3RybCcsIGNoZWNrb3V0Vmlld0N0cmwpO1xuXG5cdGZ1bmN0aW9uIGNoZWNrb3V0Vmlld0N0cmwoZGF0YSkge1xuXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdFxuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cblxuXHRcdGZ1bmN0aW9uIHRvdGFsUHJpY2UoKSB7XG5cdFx0XHR2YXIgY291bnQgPSAwO1xuXHRcdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGNvdW50ICs9IGUucHJpY2UgKiBlLnF1YW50aXR5O1xuXHRcdFx0XHRjb25zb2xlLmxvZygncXVhbnRpdHkgJyArIGUucXVhbnRpdHkpO1xuXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjb3VudDtcblx0XHR9XG5cblx0XHR0aGlzLnRvdGFsUHJpY2UgPSB0b3RhbFByaWNlO1xuXG5cdH1cblxuXHRjaGVja291dFZpZXdDdHJsLiRpbmplY3QgPSBbJ2RhdGEnXTtcblx0XG5cdFxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLmNvbnRyb2xsZXIoJ2hvbWVWaWV3Q3RybCcsIGhvbWVWaWV3Q3RybCk7XG5cblx0ZnVuY3Rpb24gaG9tZVZpZXdDdHJsKGRhdGEpIHtcblx0XHRcblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xuXHRcdFxuXHR9XG5cdFxuXHRob21lVmlld0N0cmwuJGluamVjdCA9IFsnZGF0YSddO1xufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7Il19
