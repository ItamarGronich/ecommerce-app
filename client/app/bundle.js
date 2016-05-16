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
			return $http.get('/items');
		}
		
		function storeInCart(item) {
			return
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvYXBwL2FwcC5qcyIsImNsaWVudC9hcHAvY29tcG9uZW50cy9pdGVtLWJvYXJkL2l0ZW0tYm9hcmQuanMiLCJjbGllbnQvYXBwL2NvbXBvbmVudHMvaXRlbS9pdGVtLmpzIiwiY2xpZW50L2FwcC9jb21wb25lbnRzL25hdmJhci9uYXZiYXIuanMiLCJjbGllbnQvYXBwL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhckN0cmwuanMiLCJjbGllbnQvYXBwL3NlcnZpY2VzL2RhdGFTZXJ2aWNlLmpzIiwiY2xpZW50L2FwcC9zZXJ2aWNlcy9yb3V0ZXJTZXJ2aWNlLmpzIiwiY2xpZW50L2FwcC92aWV3cy9jYXJ0Vmlldy9jYXJ0Vmlld0N0cmwuanMiLCJjbGllbnQvYXBwL3ZpZXdzL2NoZWNrb3V0Vmlldy9jaGVja291dFZpZXdDdHJsLmpzIiwiY2xpZW50L2FwcC92aWV3cy9ob21lVmlldy9ob21lVmlld0N0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuXG5cdGZ1bmN0aW9uIGNvbmZpZ0FwcCgkcm91dGVQcm92aWRlciwgJHByb3ZpZGUpIHtcblx0XHRcblx0XHQkcHJvdmlkZS5kZWNvcmF0b3IoJyRyb290U2NvcGUnLCBbJyRkZWxlZ2F0ZScsIGZ1bmN0aW9uICgkZGVsZWdhdGUpIHtcblxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCRkZWxlZ2F0ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICckb25Sb290U2NvcGUnLCB7XG5cdFx0XHRcdHZhbHVlOiBmdW5jdGlvbihuYW1lLCBsaXN0ZW5lcil7XG5cdFx0XHRcdFx0dmFyIHVuc3Vic2NyaWJlID0gJGRlbGVnYXRlLiRvbihuYW1lLCBsaXN0ZW5lcik7XG5cdFx0XHRcdFx0dGhpcy4kb24oJyRkZXN0cm95JywgdW5zdWJzY3JpYmUpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHVuc3Vic2NyaWJlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlbnVtZXJhYmxlOiBmYWxzZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiAkZGVsZWdhdGU7XG5cdFx0fV0pO1xuXHRcdFxuXHRcdCRyb3V0ZVByb3ZpZGVyXG5cdFx0XHQud2hlbignLycsIHtcblx0XHRcdFx0cmVkaXJlY3RUbzogJy9ob21lLydcblx0XHRcdH0pXG5cdFx0XHQud2hlbignL2hvbWUvJywge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9hcHAvdmlld3MvaG9tZVZpZXcvaG9tZVZpZXcuaHRtbCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRkYXRhOiBbJ2RhdGFTZXJ2aWNlJyxmdW5jdGlvbiAoZGF0YVNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGFTZXJ2aWNlLmdldERhdGEoKVxuXHRcdFx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzb2x2ZSkge3JldHVybiByZXNvbHZlLmRhdGE7fSk7XG5cdFx0XHRcdFx0fV1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udHJvbGxlcjogJ2hvbWVWaWV3Q3RybCBhcyBob21lJ1xuXHRcdFx0fSlcblx0XHRcdC53aGVuKCcvY2FydC8nLCB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL3ZpZXdzL2NhcnRWaWV3L2NhcnRWaWV3Lmh0bWwnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0ZGF0YTogWydkYXRhU2VydmljZScsIGZ1bmN0aW9uIChkYXRhU2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGFTZXJ2aWNlLmdldEluQ2FydCgpXG5cdFx0XHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXNvbHZlKSB7cmV0dXJuIHJlc29sdmUuZGF0YTt9KTtcblx0XHRcdFx0XHR9XVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb250cm9sbGVyOiAnY2FydFZpZXdDdHJsIGFzIGNhcnQnXG5cdFx0XHR9KVxuXHRcdFx0LndoZW4oJy9jaGVja291dC8nLCB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL3ZpZXdzL2NoZWNrb3V0Vmlldy9jaGVja291dFZpZXcuaHRtbCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRkYXRhOiBbJ2RhdGFTZXJ2aWNlJywgZnVuY3Rpb24gKGRhdGFTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YVNlcnZpY2UuZ2V0SW5DYXJ0KClcblx0XHRcdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlc29sdmUpIHtyZXR1cm4gcmVzb2x2ZS5kYXRhO30pO1xuXHRcdFx0XHRcdH1dXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdjaGVja291dFZpZXdDdHJsIGFzIGNoZWNrb3V0J1xuXHRcdFx0fSlcblx0fVxuXHRcblx0Y29uZmlnQXBwLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJywgJyRwcm92aWRlJ107XG5cdFxuXHRhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcsIFsnbmdSb3V0ZSddKVxuXHRcdC5jb25maWcoY29uZmlnQXBwKTtcbn0pKGFuZ3VsYXIpO1xuXG5yZXF1aXJlKCcuL3NlcnZpY2VzL3JvdXRlclNlcnZpY2UuanMnKTtcbnJlcXVpcmUoJy4vc2VydmljZXMvZGF0YVNlcnZpY2UuanMnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9uYXZiYXIvbmF2YmFyLmpzJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvaXRlbS9pdGVtLmpzJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvaXRlbS1ib2FyZC9pdGVtLWJvYXJkLmpzJyk7XG5yZXF1aXJlKCcuL3ZpZXdzL2hvbWVWaWV3L2hvbWVWaWV3Q3RybC5qcycpO1xucmVxdWlyZSgnLi92aWV3cy9jYXJ0Vmlldy9jYXJ0Vmlld0N0cmwuanMnKTtcbnJlcXVpcmUoJy4vdmlld3MvY2hlY2tvdXRWaWV3L2NoZWNrb3V0Vmlld0N0cmwuanMnKTtcbiIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdFxuXHRhcHAuZGlyZWN0aXZlKCdpdGVtQm9hcmQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvaXRlbS1ib2FyZC9pdGVtLWJvYXJkLmh0bWwnXG5cdFx0fVxuXHR9KVxuXHRcblx0XG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXG5cdGFwcC5kaXJlY3RpdmUoJ2l0ZW0nLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHJlc3RyaWN0OidBRScsXG5cdFx0XHR0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL2l0ZW0vaXRlbS5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXI6IFsnZGF0YVNlcnZpY2UnLCAnJHNjb3BlJyAsIGZ1bmN0aW9uIChkYXRhU2VydmljZSwgJHNjb3BlKSB7XG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdFx0JHNjb3BlLmFkZFRvQ2FydCA9IGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coaXRlbSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0ZGF0YVNlcnZpY2Uuc3RvcmVJbkNhcnQoaXRlbSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0fV1cblx0XHR9XG5cdH0pXG5cblxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwicmVxdWlyZSgnLi9uYXZiYXJDdHJsLmpzJyk7XG5cbihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5kaXJlY3RpdmUoJ25hdkJhcicsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGVtcGxhdGVVcmw6ICcvYXBwL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhci5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXIgOiAnbmF2YmFyQ3RybCBhcyBuYXYnXG5cdFx0fVxuXHR9KVxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHAsICQpIHtcblxuXG5cdGFwcC5jb250cm9sbGVyKCduYXZiYXJDdHJsJywgbmF2YmFyQ29udHJvbGxlcik7XG5cblx0ZnVuY3Rpb24gbmF2YmFyQ29udHJvbGxlcihyb3V0ZXJTZXJ2aWNlLCAkcm9vdFNjb3BlKSB7XG5cblx0XHR2YXIgJGxpbmtzID0gJCggJyNuYXZiYXJMaW5rcycpLmZpbmQoJ2EnKTtcblxuXHRcdCRyb290U2NvcGUuJG9uUm9vdFNjb3BlKCckcm91dGVDaGFuZ2VTdGFydCcsIHJlbmRlclN0YXRlKTtcblxuXHRcdGZ1bmN0aW9uIHJlbmRlclN0YXRlKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ0ZJUkVEJyk7XG5cdFx0XHRcblx0XHRcdHZhciBwYXRoID0gcm91dGVyU2VydmljZS5nZXRDdXJyZW50UGF0aCgpWzBdO1xuXG5cblx0XHRcdCRsaW5rcy5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyICRlbCA9ICQoIHRoaXMgKSxcblx0XHRcdFx0ICAgIGlzRWxlbWVudCA9ICRlbC50ZXh0KCkudG9Mb3dlckNhc2UoKSA9PT0gcGF0aDtcblxuXG5cdFx0XHRcdCRlbC5wYXJlbnQoKS50b2dnbGVDbGFzcygnYWN0aXZlJywgaXNFbGVtZW50KTtcblxuXHRcdFx0fSk7XG5cblxuXHRcdH1cblxuXG5cblx0XHRmdW5jdGlvbiBjaGFuZ2VUYWJzKGV2ZW50KSB7XG5cdFx0XHRyb3V0ZXJTZXJ2aWNlLnNldEN1cnJlbnRQYXRoKCcvJyArIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpICsgJy8nKTtcblx0XHR9XG5cblx0XHR0aGlzLmNoYW5nZVRhYnMgPSBjaGFuZ2VUYWJzO1xuXG5cblxuXHR9XG5cblx0bmF2YmFyQ29udHJvbGxlci4kaW5qZWN0ID0gWydyb3V0ZXJTZXJ2aWNlJywgJyRyb290U2NvcGUnXTtcblxuXG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpLCBqUXVlcnkpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5zZXJ2aWNlKCdkYXRhU2VydmljZScsIGRhdGFTZXJ2aWNlKTtcblxuXHRmdW5jdGlvbiBkYXRhU2VydmljZSgkaHR0cCkge1xuXHRcdFxuXHRcdFxuXHRcdHZhciBjYXJ0ID0gW10sXG5cdFx0XHRpdGVtcyA9IFtdO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0RGF0YSgpIHtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9pdGVtcycpO1xuXHRcdH1cblx0XHRcblx0XHRmdW5jdGlvbiBzdG9yZUluQ2FydChpdGVtKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRJbkNhcnQoKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvY2FydCcpO1xuXHRcdH1cblxuXHRcdHRoaXMuZ2V0RGF0YSA9IGdldERhdGE7XG5cdFx0XG5cdFx0dGhpcy5zdG9yZUluQ2FydCA9IHN0b3JlSW5DYXJ0O1xuXHRcdFxuXHRcdHRoaXMuZ2V0SW5DYXJ0ID0gZ2V0SW5DYXJ0O1xuXHR9XG5cblx0ZGF0YVNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnXTtcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5zZXJ2aWNlKCdyb3V0ZXJTZXJ2aWNlJywgcm91dGVyU2VydmljZSk7XG5cblxuXHRmdW5jdGlvbiByb3V0ZXJTZXJ2aWNlKCRsb2NhdGlvbikge1xuXG5cdFx0dGhpcy5nZXRDdXJyZW50UGF0aCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiAkbG9jYXRpb24ucGF0aCgpLnNwbGl0KCcvJykuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuXHRcdFx0XHRyZXR1cm4gISFlbDtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0XG5cdFx0dGhpcy5zZXRDdXJyZW50UGF0aCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0cmV0dXJuICRsb2NhdGlvbi5wYXRoKHZhbHVlKTtcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0cmV0dXJuICRsb2NhdGlvbi5wYXRoKCcvJyArIHZhbHVlLmpvaW4oJy8nKSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcblx0fVxuXHRcblx0cm91dGVyU2VydmljZS4kaW5qZWN0ID0gWyckbG9jYXRpb24nXTtcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5jb250cm9sbGVyKCdjYXJ0Vmlld0N0cmwnLCBjYXJ0Vmlld0N0cmwpO1xuXG5cdGZ1bmN0aW9uIGNhcnRWaWV3Q3RybChkYXRhKSB7XG5cdFx0dGhpcy5kYXRhID0gZGF0YTtcblxuXHRcdGZ1bmN0aW9uIHRvdGFsUHJpY2UoKSB7XG5cdFx0XHR2YXIgY291bnQgPSAwO1xuXHRcdFx0ZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGNvdW50ICs9IGUucHJpY2UgKiBlLnF1YW50aXR5O1xuXHRcdFx0XHRjb25zb2xlLmxvZygncXVhbnRpdHkgJyArIGUucXVhbnRpdHkpO1xuXHRcdFx0XHRcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGNvdW50O1xuXHRcdH1cblxuXHRcdHRoaXMudG90YWxQcmljZSA9IHRvdGFsUHJpY2U7XG5cdH1cblxuXG5cdGNhcnRWaWV3Q3RybC4kaW5qZWN0ID0gWydkYXRhJ107XG5cdFxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLmNvbnRyb2xsZXIoJ2NoZWNrb3V0Vmlld0N0cmwnLCBjaGVja291dFZpZXdDdHJsKTtcblxuXHRmdW5jdGlvbiBjaGVja291dFZpZXdDdHJsKGRhdGEpIHtcblx0XHRjb25zb2xlLmxvZyhkYXRhKTtcblx0XHRcblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xuXG5cblx0XHRmdW5jdGlvbiB0b3RhbFByaWNlKCkge1xuXHRcdFx0dmFyIGNvdW50ID0gMDtcblx0XHRcdGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuXHRcdFx0XHRjb3VudCArPSBlLnByaWNlICogZS5xdWFudGl0eTtcblx0XHRcdFx0Y29uc29sZS5sb2coJ3F1YW50aXR5ICcgKyBlLnF1YW50aXR5KTtcblxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY291bnQ7XG5cdFx0fVxuXG5cdFx0dGhpcy50b3RhbFByaWNlID0gdG90YWxQcmljZTtcblxuXHR9XG5cblx0Y2hlY2tvdXRWaWV3Q3RybC4kaW5qZWN0ID0gWydkYXRhJ107XG5cdFxuXHRcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5jb250cm9sbGVyKCdob21lVmlld0N0cmwnLCBob21lVmlld0N0cmwpO1xuXG5cdGZ1bmN0aW9uIGhvbWVWaWV3Q3RybChkYXRhKSB7XG5cdFx0XG5cdFx0dGhpcy5kYXRhID0gZGF0YTtcblx0XHRcblx0fVxuXHRcblx0aG9tZVZpZXdDdHJsLiRpbmplY3QgPSBbJ2RhdGEnXTtcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyJdfQ==
