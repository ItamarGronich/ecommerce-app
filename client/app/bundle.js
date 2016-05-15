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
						return dataService.getData();
					}]
				},
				controller: 'homeViewCtrl as home'
			})
			.when('/cart/', {
				templateUrl: 'app/views/cartView/cartView.html',
				resolve: {
					data: ['dataService', function (dataService) {
						return dataService.getInCart();
					}]
				},
				controller: 'cartViewCtrl as cart'
			})
			.when('/checkout/', {
				templateUrl: 'app/views/checkoutView/checkoutView.html',
				resolve: {
					data: ['dataService', function (dataService) {
						return dataService.getInCart();
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

		$rootScope.$onRootScope('$routeChangeStart', renderState);

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
			return [
				{
					title: 'Gold Plated Tooth Brush',
					price: 1000000,
					imgUrl: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
					description: 'Premium 24 carat gold plated tooth brush. High quality horse tail fibers. Approved by dentists around the world.'
				},
				{
					title: 'Gold Plated Tooth Brush',
					price: 1000000,
					imgUrl: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
					description: 'Premium 24 carat gold plated tooth brush. High quality horse tail fibers. Approved by dentists around the world.'
				},
				{
					title: 'Gold Plated Tooth Brush',
					price: 1000000,
					imgUrl: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
					description: 'Premium 24 carat gold plated tooth brush. High quality horse tail fibers. Approved by dentists around the world.'
				},
				{
					title: 'Gold Plated Tooth Brush',
					price: 1000000,
					imgUrl: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
					description: 'Premium 24 carat gold plated tooth brush. High quality horse tail fibers. Approved by dentists around the world.'
				},
				{
					title: 'Gold Plated Tooth Brush',
					price: 1000000,
					imgUrl: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
					description: 'Premium 24 carat gold plated tooth brush. High quality horse tail fibers. Approved by dentists around the world.'
				},
				{
					title: 'Gold Plated Tooth Brush',
					price: 1000000,
					imgUrl: 'https://i.ytimg.com/vi/tntOCGkgt98/maxresdefault.jpg',
					description: 'Premium 24 carat gold plated tooth brush. High quality horse tail fibers. Approved by dentists around the world.'
				}
			]

		}
		
		function storeInCart(item) {
			if (!item.quantity) {
				item.quantity = 1;
				cart.push(item);
			} else {
				item.quantity += 1;
			}
		}

		function getInCart() {
			return cart;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvYXBwL2FwcC5qcyIsImNsaWVudC9hcHAvY29tcG9uZW50cy9pdGVtLWJvYXJkL2l0ZW0tYm9hcmQuanMiLCJjbGllbnQvYXBwL2NvbXBvbmVudHMvaXRlbS9pdGVtLmpzIiwiY2xpZW50L2FwcC9jb21wb25lbnRzL25hdmJhci9uYXZiYXIuanMiLCJjbGllbnQvYXBwL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhckN0cmwuanMiLCJjbGllbnQvYXBwL3NlcnZpY2VzL2RhdGFTZXJ2aWNlLmpzIiwiY2xpZW50L2FwcC9zZXJ2aWNlcy9yb3V0ZXJTZXJ2aWNlLmpzIiwiY2xpZW50L2FwcC92aWV3cy9jYXJ0Vmlldy9jYXJ0Vmlld0N0cmwuanMiLCJjbGllbnQvYXBwL3ZpZXdzL2NoZWNrb3V0Vmlldy9jaGVja291dFZpZXdDdHJsLmpzIiwiY2xpZW50L2FwcC92aWV3cy9ob21lVmlldy9ob21lVmlld0N0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuXG5cdGZ1bmN0aW9uIGNvbmZpZ0FwcCgkcm91dGVQcm92aWRlciwgJHByb3ZpZGUpIHtcblx0XHRcblx0XHQkcHJvdmlkZS5kZWNvcmF0b3IoJyRyb290U2NvcGUnLCBbJyRkZWxlZ2F0ZScsIGZ1bmN0aW9uICgkZGVsZWdhdGUpIHtcblxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCRkZWxlZ2F0ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICckb25Sb290U2NvcGUnLCB7XG5cdFx0XHRcdHZhbHVlOiBmdW5jdGlvbihuYW1lLCBsaXN0ZW5lcil7XG5cdFx0XHRcdFx0dmFyIHVuc3Vic2NyaWJlID0gJGRlbGVnYXRlLiRvbihuYW1lLCBsaXN0ZW5lcik7XG5cdFx0XHRcdFx0dGhpcy4kb24oJyRkZXN0cm95JywgdW5zdWJzY3JpYmUpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHVuc3Vic2NyaWJlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlbnVtZXJhYmxlOiBmYWxzZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiAkZGVsZWdhdGU7XG5cdFx0fV0pO1xuXHRcdFxuXHRcdCRyb3V0ZVByb3ZpZGVyXG5cdFx0XHQud2hlbignLycsIHtcblx0XHRcdFx0cmVkaXJlY3RUbzogJy9ob21lLydcblx0XHRcdH0pXG5cdFx0XHQud2hlbignL2hvbWUvJywge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9hcHAvdmlld3MvaG9tZVZpZXcvaG9tZVZpZXcuaHRtbCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRkYXRhOiBbJ2RhdGFTZXJ2aWNlJyxmdW5jdGlvbiAoZGF0YVNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhU2VydmljZS5nZXREYXRhKCk7XG5cdFx0XHRcdFx0fV1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udHJvbGxlcjogJ2hvbWVWaWV3Q3RybCBhcyBob21lJ1xuXHRcdFx0fSlcblx0XHRcdC53aGVuKCcvY2FydC8nLCB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL3ZpZXdzL2NhcnRWaWV3L2NhcnRWaWV3Lmh0bWwnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0ZGF0YTogWydkYXRhU2VydmljZScsIGZ1bmN0aW9uIChkYXRhU2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGFTZXJ2aWNlLmdldEluQ2FydCgpO1xuXHRcdFx0XHRcdH1dXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdjYXJ0Vmlld0N0cmwgYXMgY2FydCdcblx0XHRcdH0pXG5cdFx0XHQud2hlbignL2NoZWNrb3V0LycsIHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvdmlld3MvY2hlY2tvdXRWaWV3L2NoZWNrb3V0Vmlldy5odG1sJyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGRhdGE6IFsnZGF0YVNlcnZpY2UnLCBmdW5jdGlvbiAoZGF0YVNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhU2VydmljZS5nZXRJbkNhcnQoKTtcblx0XHRcdFx0XHR9XVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb250cm9sbGVyOiAnY2hlY2tvdXRWaWV3Q3RybCBhcyBjaGVja291dCdcblx0XHRcdH0pXG5cdH1cblx0XG5cdGNvbmZpZ0FwcC4kaW5qZWN0ID0gWyckcm91dGVQcm92aWRlcicsICckcHJvdmlkZSddO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnLCBbJ25nUm91dGUnXSlcblx0XHQuY29uZmlnKGNvbmZpZ0FwcCk7XG59KShhbmd1bGFyKTtcblxucmVxdWlyZSgnLi9zZXJ2aWNlcy9yb3V0ZXJTZXJ2aWNlLmpzJyk7XG5yZXF1aXJlKCcuL3NlcnZpY2VzL2RhdGFTZXJ2aWNlLmpzJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhci5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2l0ZW0vaXRlbS5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2l0ZW0tYm9hcmQvaXRlbS1ib2FyZC5qcycpO1xucmVxdWlyZSgnLi92aWV3cy9ob21lVmlldy9ob21lVmlld0N0cmwuanMnKTtcbnJlcXVpcmUoJy4vdmlld3MvY2FydFZpZXcvY2FydFZpZXdDdHJsLmpzJyk7XG5yZXF1aXJlKCcuL3ZpZXdzL2NoZWNrb3V0Vmlldy9jaGVja291dFZpZXdDdHJsLmpzJyk7XG4iLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRcblx0YXBwLmRpcmVjdGl2ZSgnaXRlbUJvYXJkJywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL2l0ZW0tYm9hcmQvaXRlbS1ib2FyZC5odG1sJ1xuXHRcdH1cblx0fSlcblx0XG5cdFxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblxuXHRhcHAuZGlyZWN0aXZlKCdpdGVtJywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDonQUUnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9pdGVtL2l0ZW0uaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiBbJ2RhdGFTZXJ2aWNlJywgJyRzY29wZScgLCBmdW5jdGlvbiAoZGF0YVNlcnZpY2UsICRzY29wZSkge1xuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdCRzY29wZS5hZGRUb0NhcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW0pO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGRhdGFTZXJ2aWNlLnN0b3JlSW5DYXJ0KGl0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdH1dXG5cdFx0fVxuXHR9KVxuXG5cbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsInJlcXVpcmUoJy4vbmF2YmFyQ3RybC5qcycpO1xuXG4oZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuZGlyZWN0aXZlKCduYXZCYXInLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRlbXBsYXRlVXJsOiAnL2FwcC9jb21wb25lbnRzL25hdmJhci9uYXZiYXIuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyIDogJ25hdmJhckN0cmwgYXMgbmF2J1xuXHRcdH1cblx0fSlcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwLCAkKSB7XG5cblxuXHRhcHAuY29udHJvbGxlcignbmF2YmFyQ3RybCcsIG5hdmJhckNvbnRyb2xsZXIpO1xuXG5cdGZ1bmN0aW9uIG5hdmJhckNvbnRyb2xsZXIocm91dGVyU2VydmljZSwgJHJvb3RTY29wZSkge1xuXG5cdFx0dmFyICRsaW5rcyA9ICQoICcjbmF2YmFyTGlua3MnKS5maW5kKCdhJyk7XG5cblx0XHQkcm9vdFNjb3BlLiRvblJvb3RTY29wZSgnJHJvdXRlQ2hhbmdlU3RhcnQnLCByZW5kZXJTdGF0ZSk7XG5cblx0XHRmdW5jdGlvbiByZW5kZXJTdGF0ZSgpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdGSVJFRCcpO1xuXHRcdFx0XG5cdFx0XHR2YXIgcGF0aCA9IHJvdXRlclNlcnZpY2UuZ2V0Q3VycmVudFBhdGgoKVswXTtcblxuXG5cdFx0XHQkbGlua3MuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciAkZWwgPSAkKCB0aGlzICksXG5cdFx0XHRcdCAgICBpc0VsZW1lbnQgPSAkZWwudGV4dCgpLnRvTG93ZXJDYXNlKCkgPT09IHBhdGg7XG5cblxuXHRcdFx0XHQkZWwucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScsIGlzRWxlbWVudCk7XG5cblx0XHRcdH0pO1xuXG5cblx0XHR9XG5cblxuXG5cdFx0ZnVuY3Rpb24gY2hhbmdlVGFicyhldmVudCkge1xuXHRcdFx0cm91dGVyU2VydmljZS5zZXRDdXJyZW50UGF0aCgnLycgKyBldmVudC50YXJnZXQudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSArICcvJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5jaGFuZ2VUYWJzID0gY2hhbmdlVGFicztcblxuXG5cblx0fVxuXG5cdG5hdmJhckNvbnRyb2xsZXIuJGluamVjdCA9IFsncm91dGVyU2VydmljZScsICckcm9vdFNjb3BlJ107XG5cblxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSwgalF1ZXJ5KTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuc2VydmljZSgnZGF0YVNlcnZpY2UnLCBkYXRhU2VydmljZSk7XG5cblx0ZnVuY3Rpb24gZGF0YVNlcnZpY2UoJGh0dHApIHtcblx0XHRcblx0XHRcblx0XHR2YXIgY2FydCA9IFtdLFxuXHRcdFx0aXRlbXMgPSBbXTtcblxuXHRcdGZ1bmN0aW9uIGdldERhdGEoKSB7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9XG5cdFx0XHRdXG5cblx0XHR9XG5cdFx0XG5cdFx0ZnVuY3Rpb24gc3RvcmVJbkNhcnQoaXRlbSkge1xuXHRcdFx0aWYgKCFpdGVtLnF1YW50aXR5KSB7XG5cdFx0XHRcdGl0ZW0ucXVhbnRpdHkgPSAxO1xuXHRcdFx0XHRjYXJ0LnB1c2goaXRlbSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpdGVtLnF1YW50aXR5ICs9IDE7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0SW5DYXJ0KCkge1xuXHRcdFx0cmV0dXJuIGNhcnQ7XG5cdFx0fVxuXG5cdFx0dGhpcy5nZXREYXRhID0gZ2V0RGF0YTtcblx0XHRcblx0XHR0aGlzLnN0b3JlSW5DYXJ0ID0gc3RvcmVJbkNhcnQ7XG5cdFx0XG5cdFx0dGhpcy5nZXRJbkNhcnQgPSBnZXRJbkNhcnQ7XG5cdH1cblxuXHRkYXRhU2VydmljZS4kaW5qZWN0ID0gWyckaHR0cCddO1xufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLnNlcnZpY2UoJ3JvdXRlclNlcnZpY2UnLCByb3V0ZXJTZXJ2aWNlKTtcblxuXG5cdGZ1bmN0aW9uIHJvdXRlclNlcnZpY2UoJGxvY2F0aW9uKSB7XG5cblx0XHR0aGlzLmdldEN1cnJlbnRQYXRoID0gZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuICRsb2NhdGlvbi5wYXRoKCkuc3BsaXQoJy8nKS5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XG5cdFx0XHRcdHJldHVybiAhIWVsO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0XHRcblx0XHR0aGlzLnNldEN1cnJlbnRQYXRoID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRyZXR1cm4gJGxvY2F0aW9uLnBhdGgodmFsdWUpO1xuXHRcdFx0fSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuXHRcdFx0XHRyZXR1cm4gJGxvY2F0aW9uLnBhdGgoJy8nICsgdmFsdWUuam9pbignLycpKTtcblx0XHRcdH1cblx0XHR9O1xuXHRcdFxuXHR9XG5cdFxuXHRyb3V0ZXJTZXJ2aWNlLiRpbmplY3QgPSBbJyRsb2NhdGlvbiddO1xufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLmNvbnRyb2xsZXIoJ2NhcnRWaWV3Q3RybCcsIGNhcnRWaWV3Q3RybCk7XG5cblx0ZnVuY3Rpb24gY2FydFZpZXdDdHJsKGRhdGEpIHtcblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xuXG5cdFx0ZnVuY3Rpb24gdG90YWxQcmljZSgpIHtcblx0XHRcdHZhciBjb3VudCA9IDA7XG5cdFx0XHRkYXRhLmZvckVhY2goZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Y291bnQgKz0gZS5wcmljZSAqIGUucXVhbnRpdHk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdxdWFudGl0eSAnICsgZS5xdWFudGl0eSk7XG5cdFx0XHRcdFxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY291bnQ7XG5cdFx0fVxuXG5cdFx0dGhpcy50b3RhbFByaWNlID0gdG90YWxQcmljZTtcblx0fVxuXG5cblx0Y2FydFZpZXdDdHJsLiRpbmplY3QgPSBbJ2RhdGEnXTtcblx0XG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuY29udHJvbGxlcignY2hlY2tvdXRWaWV3Q3RybCcsIGNoZWNrb3V0Vmlld0N0cmwpO1xuXG5cdGZ1bmN0aW9uIGNoZWNrb3V0Vmlld0N0cmwoZGF0YSkge1xuXHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdFxuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cblxuXHRcdGZ1bmN0aW9uIHRvdGFsUHJpY2UoKSB7XG5cdFx0XHR2YXIgY291bnQgPSAwO1xuXHRcdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGNvdW50ICs9IGUucHJpY2UgKiBlLnF1YW50aXR5O1xuXHRcdFx0XHRjb25zb2xlLmxvZygncXVhbnRpdHkgJyArIGUucXVhbnRpdHkpO1xuXG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjb3VudDtcblx0XHR9XG5cblx0XHR0aGlzLnRvdGFsUHJpY2UgPSB0b3RhbFByaWNlO1xuXG5cdH1cblxuXHRjaGVja291dFZpZXdDdHJsLiRpbmplY3QgPSBbJ2RhdGEnXTtcblx0XG5cdFxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLmNvbnRyb2xsZXIoJ2hvbWVWaWV3Q3RybCcsIGhvbWVWaWV3Q3RybCk7XG5cblx0ZnVuY3Rpb24gaG9tZVZpZXdDdHJsKGRhdGEpIHtcblx0XHRcblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xuXHRcdFxuXHR9XG5cdFxuXHRob21lVmlld0N0cmwuJGluamVjdCA9IFsnZGF0YSddO1xufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7Il19
