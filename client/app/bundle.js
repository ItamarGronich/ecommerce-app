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

},{"./components/cartTable/cartTable.js":2,"./components/item-board/item-board.js":4,"./components/item/item.js":5,"./components/navbar/navbar.js":6,"./services/dataService.js":8,"./services/routerService.js":9,"./views/cartView/cartViewCtrl.js":10,"./views/checkoutView/checkoutViewCtrl.js":11,"./views/homeView/homeViewCtrl.js":12}],2:[function(require,module,exports){
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
},{"./cartTableCtrl.js":3}],3:[function(require,module,exports){
(function (app) {
	
	app.controller('cartTableCtrl', cartTableCtrl);


	function cartTableCtrl($scope, dataService) {

		this.data = $scope.cartData;
		var cart = this.data;

		function totalPrice() {
			var count = 0;
			cart.forEach(function (e) {
				count += e.price * e.quantity;
			});
			return count;
		}

		function removeItem(item){
			dataService
				.removeFromCart(item)
				.then(function(){
					var index = cart.findIndex(function(el){
						return el.id == item.id;
					});
					
					cart.splice(index,1);
				});
		}

		this.totalPrice = totalPrice;

		this.removeItem = removeItem;
	}
	
	cartTableCtrl.$inject = ['$scope', 'dataService'];

})(angular.module('ecomApp'));
},{}],4:[function(require,module,exports){
(function (app) {
	
	app.directive('itemBoard', function () {
		return {
			templateUrl: 'app/components/item-board/item-board.html'
		}
	})
	
	
})(angular.module('ecomApp'));
},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
require('./navbarCtrl.js');

(function (app) {
	app.directive('navBar', function () {
		return {
			templateUrl: '/app/components/navbar/navbar.html',
			controller : 'navbarCtrl as nav'
		}
	})
})(angular.module('ecomApp'));
},{"./navbarCtrl.js":7}],7:[function(require,module,exports){
(function (app, $) {


	app.controller('navbarCtrl', navbarController);

	function navbarController(routerService, $rootScope) {

		var $links = $( '#navbarLinks').find('a');


		$rootScope.$onRootScope('$routeChangeSuccess', renderState);

		function renderState() {
			
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
},{}],8:[function(require,module,exports){
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

		function removeFromCart(item) {
			return $http.delete('/cart/' + item.id);
		}

		this.getData = getData;
		
		this.storeInCart = storeInCart;
		
		this.getInCart = getInCart;

		this.removeFromCart = removeFromCart;
	}

	dataService.$inject = ['$http'];
})(angular.module('ecomApp'));
},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
(function (app) {
	app.controller('cartViewCtrl', cartViewCtrl);

	function cartViewCtrl(data) {
		this.data = data;

	
	}


	cartViewCtrl.$inject = ['data'];
	
})(angular.module('ecomApp'));
},{}],11:[function(require,module,exports){
(function (app) {
	app.controller('checkoutViewCtrl', checkoutViewCtrl);

	function checkoutViewCtrl(data) {
		this.data = data;

	}

	checkoutViewCtrl.$inject = ['data'];
	
	
})(angular.module('ecomApp'));
},{}],12:[function(require,module,exports){
(function (app) {
	app.controller('homeViewCtrl', homeViewCtrl);

	function homeViewCtrl(data) {
		
		this.data = data;
		
	}
	
	homeViewCtrl.$inject = ['data'];
})(angular.module('ecomApp'));
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvYXBwL2FwcC5qcyIsImNsaWVudC9hcHAvY29tcG9uZW50cy9jYXJ0VGFibGUvY2FydFRhYmxlLmpzIiwiY2xpZW50L2FwcC9jb21wb25lbnRzL2NhcnRUYWJsZS9jYXJ0VGFibGVDdHJsLmpzIiwiY2xpZW50L2FwcC9jb21wb25lbnRzL2l0ZW0tYm9hcmQvaXRlbS1ib2FyZC5qcyIsImNsaWVudC9hcHAvY29tcG9uZW50cy9pdGVtL2l0ZW0uanMiLCJjbGllbnQvYXBwL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhci5qcyIsImNsaWVudC9hcHAvY29tcG9uZW50cy9uYXZiYXIvbmF2YmFyQ3RybC5qcyIsImNsaWVudC9hcHAvc2VydmljZXMvZGF0YVNlcnZpY2UuanMiLCJjbGllbnQvYXBwL3NlcnZpY2VzL3JvdXRlclNlcnZpY2UuanMiLCJjbGllbnQvYXBwL3ZpZXdzL2NhcnRWaWV3L2NhcnRWaWV3Q3RybC5qcyIsImNsaWVudC9hcHAvdmlld3MvY2hlY2tvdXRWaWV3L2NoZWNrb3V0Vmlld0N0cmwuanMiLCJjbGllbnQvYXBwL3ZpZXdzL2hvbWVWaWV3L2hvbWVWaWV3Q3RybC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoYW5ndWxhcikge1xuXG5cdGZ1bmN0aW9uIGNvbmZpZ0FwcCgkcm91dGVQcm92aWRlciwgJHByb3ZpZGUpIHtcblx0XHRcblx0XHQkcHJvdmlkZS5kZWNvcmF0b3IoJyRyb290U2NvcGUnLCBbJyRkZWxlZ2F0ZScsIGZ1bmN0aW9uICgkZGVsZWdhdGUpIHtcblxuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KCRkZWxlZ2F0ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsICckb25Sb290U2NvcGUnLCB7XG5cdFx0XHRcdHZhbHVlOiBmdW5jdGlvbihuYW1lLCBsaXN0ZW5lcil7XG5cdFx0XHRcdFx0dmFyIHVuc3Vic2NyaWJlID0gJGRlbGVnYXRlLiRvbihuYW1lLCBsaXN0ZW5lcik7XG5cdFx0XHRcdFx0dGhpcy4kb24oJyRkZXN0cm95JywgdW5zdWJzY3JpYmUpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHVuc3Vic2NyaWJlO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlbnVtZXJhYmxlOiBmYWxzZVxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiAkZGVsZWdhdGU7XG5cdFx0fV0pO1xuXHRcdFxuXHRcdCRyb3V0ZVByb3ZpZGVyXG5cdFx0XHQud2hlbignLycsIHtcblx0XHRcdFx0cmVkaXJlY3RUbzogJy9ob21lLydcblx0XHRcdH0pXG5cdFx0XHQud2hlbignL2hvbWUvJywge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJy9hcHAvdmlld3MvaG9tZVZpZXcvaG9tZVZpZXcuaHRtbCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRkYXRhOiBbJ2RhdGFTZXJ2aWNlJyxmdW5jdGlvbiAoZGF0YVNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGFTZXJ2aWNlLmdldERhdGEoKVxuXHRcdFx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzb2x2ZSkge3JldHVybiByZXNvbHZlLmRhdGE7fSk7XG5cdFx0XHRcdFx0fV1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udHJvbGxlcjogJ2hvbWVWaWV3Q3RybCBhcyBob21lJ1xuXHRcdFx0fSlcblx0XHRcdC53aGVuKCcvY2FydC8nLCB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL3ZpZXdzL2NhcnRWaWV3L2NhcnRWaWV3Lmh0bWwnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0ZGF0YTogWydkYXRhU2VydmljZScsIGZ1bmN0aW9uIChkYXRhU2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGFTZXJ2aWNlLmdldEluQ2FydCgpXG5cdFx0XHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXNvbHZlKSB7cmV0dXJuIHJlc29sdmUuZGF0YTt9KTtcblx0XHRcdFx0XHR9XVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb250cm9sbGVyOiAnY2FydFZpZXdDdHJsIGFzIGNhcnQnXG5cdFx0XHR9KVxuXHRcdFx0LndoZW4oJy9jaGVja291dC8nLCB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL3ZpZXdzL2NoZWNrb3V0Vmlldy9jaGVja291dFZpZXcuaHRtbCcsXG5cdFx0XHRcdHJlc29sdmU6IHtcblx0XHRcdFx0XHRkYXRhOiBbJ2RhdGFTZXJ2aWNlJywgZnVuY3Rpb24gKGRhdGFTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZGF0YVNlcnZpY2UuZ2V0SW5DYXJ0KClcblx0XHRcdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlc29sdmUpIHtyZXR1cm4gcmVzb2x2ZS5kYXRhO30pO1xuXHRcdFx0XHRcdH1dXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdjaGVja291dFZpZXdDdHJsIGFzIGNoZWNrb3V0J1xuXHRcdFx0fSlcblx0fVxuXHRcblx0Y29uZmlnQXBwLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJywgJyRwcm92aWRlJ107XG5cdFxuXHRhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcsIFsnbmdSb3V0ZSddKVxuXHRcdC5jb25maWcoY29uZmlnQXBwKTtcbn0pKGFuZ3VsYXIpO1xuXG5cbi8qXG4gKiBTZXJ2aWNlc1xuICoqL1xucmVxdWlyZSgnLi9zZXJ2aWNlcy9yb3V0ZXJTZXJ2aWNlLmpzJyk7XG5yZXF1aXJlKCcuL3NlcnZpY2VzL2RhdGFTZXJ2aWNlLmpzJyk7XG5cbi8qXG4gKiBDb21wb25lbnRzXG4gKiovXG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhci5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2l0ZW0vaXRlbS5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2l0ZW0tYm9hcmQvaXRlbS1ib2FyZC5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2NhcnRUYWJsZS9jYXJ0VGFibGUuanMnKTtcblxuLypcbiAqIFZpZXdzXG4gKiovXG5yZXF1aXJlKCcuL3ZpZXdzL2hvbWVWaWV3L2hvbWVWaWV3Q3RybC5qcycpO1xucmVxdWlyZSgnLi92aWV3cy9jYXJ0Vmlldy9jYXJ0Vmlld0N0cmwuanMnKTtcbnJlcXVpcmUoJy4vdmlld3MvY2hlY2tvdXRWaWV3L2NoZWNrb3V0Vmlld0N0cmwuanMnKTtcbiIsInJlcXVpcmUoJy4vY2FydFRhYmxlQ3RybC5qcycpO1xuXG4oZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuZGlyZWN0aXZlKCdjYXJ0VGFibGUnLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRlbXBsYXRlVXJsOiAnL2FwcC9jb21wb25lbnRzL2NhcnRUYWJsZS9jYXJ0VGFibGUuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyIDogJ2NhcnRUYWJsZUN0cmwgYXMgY2FydCcsXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRjYXJ0RGF0YTogJz1jYXJ0RGF0YSdcblx0XHRcdH1cblx0XHR9XG5cdH0pXG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRcblx0YXBwLmNvbnRyb2xsZXIoJ2NhcnRUYWJsZUN0cmwnLCBjYXJ0VGFibGVDdHJsKTtcblxuXG5cdGZ1bmN0aW9uIGNhcnRUYWJsZUN0cmwoJHNjb3BlLCBkYXRhU2VydmljZSkge1xuXG5cdFx0dGhpcy5kYXRhID0gJHNjb3BlLmNhcnREYXRhO1xuXHRcdHZhciBjYXJ0ID0gdGhpcy5kYXRhO1xuXG5cdFx0ZnVuY3Rpb24gdG90YWxQcmljZSgpIHtcblx0XHRcdHZhciBjb3VudCA9IDA7XG5cdFx0XHRjYXJ0LmZvckVhY2goZnVuY3Rpb24gKGUpIHtcblx0XHRcdFx0Y291bnQgKz0gZS5wcmljZSAqIGUucXVhbnRpdHk7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBjb3VudDtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiByZW1vdmVJdGVtKGl0ZW0pe1xuXHRcdFx0ZGF0YVNlcnZpY2Vcblx0XHRcdFx0LnJlbW92ZUZyb21DYXJ0KGl0ZW0pXG5cdFx0XHRcdC50aGVuKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0dmFyIGluZGV4ID0gY2FydC5maW5kSW5kZXgoZnVuY3Rpb24oZWwpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIGVsLmlkID09IGl0ZW0uaWQ7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Y2FydC5zcGxpY2UoaW5kZXgsMSk7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHRoaXMudG90YWxQcmljZSA9IHRvdGFsUHJpY2U7XG5cblx0XHR0aGlzLnJlbW92ZUl0ZW0gPSByZW1vdmVJdGVtO1xuXHR9XG5cdFxuXHRjYXJ0VGFibGVDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICdkYXRhU2VydmljZSddO1xuXG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRcblx0YXBwLmRpcmVjdGl2ZSgnaXRlbUJvYXJkJywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0ZW1wbGF0ZVVybDogJ2FwcC9jb21wb25lbnRzL2l0ZW0tYm9hcmQvaXRlbS1ib2FyZC5odG1sJ1xuXHRcdH1cblx0fSlcblx0XG5cdFxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblxuXHRhcHAuZGlyZWN0aXZlKCdpdGVtJywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDonQUUnLFxuXHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9pdGVtL2l0ZW0uaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyOiBbJ2RhdGFTZXJ2aWNlJywgJyRzY29wZScgLCBmdW5jdGlvbiAoZGF0YVNlcnZpY2UsICRzY29wZSkge1xuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdCRzY29wZS5hZGRUb0NhcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKGl0ZW0pO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGRhdGFTZXJ2aWNlLnN0b3JlSW5DYXJ0KGl0ZW0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRcblx0XHRcdH1dXG5cdFx0fVxuXHR9KVxuXG5cbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsInJlcXVpcmUoJy4vbmF2YmFyQ3RybC5qcycpO1xuXG4oZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuZGlyZWN0aXZlKCduYXZCYXInLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRlbXBsYXRlVXJsOiAnL2FwcC9jb21wb25lbnRzL25hdmJhci9uYXZiYXIuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyIDogJ25hdmJhckN0cmwgYXMgbmF2J1xuXHRcdH1cblx0fSlcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwLCAkKSB7XG5cblxuXHRhcHAuY29udHJvbGxlcignbmF2YmFyQ3RybCcsIG5hdmJhckNvbnRyb2xsZXIpO1xuXG5cdGZ1bmN0aW9uIG5hdmJhckNvbnRyb2xsZXIocm91dGVyU2VydmljZSwgJHJvb3RTY29wZSkge1xuXG5cdFx0dmFyICRsaW5rcyA9ICQoICcjbmF2YmFyTGlua3MnKS5maW5kKCdhJyk7XG5cblxuXHRcdCRyb290U2NvcGUuJG9uUm9vdFNjb3BlKCckcm91dGVDaGFuZ2VTdWNjZXNzJywgcmVuZGVyU3RhdGUpO1xuXG5cdFx0ZnVuY3Rpb24gcmVuZGVyU3RhdGUoKSB7XG5cdFx0XHRcblx0XHRcdHZhciBwYXRoID0gcm91dGVyU2VydmljZS5nZXRDdXJyZW50UGF0aCgpWzBdO1xuXG5cblx0XHRcdCRsaW5rcy5lYWNoKGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0dmFyICRlbCA9ICQoIHRoaXMgKSxcblx0XHRcdFx0ICAgIGlzRWxlbWVudCA9ICRlbC50ZXh0KCkudG9Mb3dlckNhc2UoKSA9PT0gcGF0aDtcblxuXG5cdFx0XHRcdCRlbC5wYXJlbnQoKS50b2dnbGVDbGFzcygnYWN0aXZlJywgaXNFbGVtZW50KTtcblxuXHRcdFx0fSk7XG5cblxuXHRcdH1cblxuXG5cblx0XHRmdW5jdGlvbiBjaGFuZ2VUYWJzKGV2ZW50KSB7XG5cdFx0XHRyb3V0ZXJTZXJ2aWNlLnNldEN1cnJlbnRQYXRoKCcvJyArIGV2ZW50LnRhcmdldC50ZXh0Q29udGVudC50b0xvd2VyQ2FzZSgpICsgJy8nKTtcblx0XHR9XG5cblx0XHR0aGlzLmNoYW5nZVRhYnMgPSBjaGFuZ2VUYWJzO1xuXG5cblxuXHR9XG5cblx0bmF2YmFyQ29udHJvbGxlci4kaW5qZWN0ID0gWydyb3V0ZXJTZXJ2aWNlJywgJyRyb290U2NvcGUnXTtcblxuXG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpLCBqUXVlcnkpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5zZXJ2aWNlKCdkYXRhU2VydmljZScsIGRhdGFTZXJ2aWNlKTtcblxuXHRmdW5jdGlvbiBkYXRhU2VydmljZSgkaHR0cCkge1xuXHRcdFxuXHRcdFxuXHRcdHZhciBjYXJ0ID0gW10sXG5cdFx0XHRpdGVtcyA9IFtdO1xuXG5cdFx0ZnVuY3Rpb24gZ2V0RGF0YSgpIHtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9pdGVtcycpO1xuXHRcdH1cblx0XHRcblx0XHRmdW5jdGlvbiBzdG9yZUluQ2FydChpdGVtKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL2NhcnQnLCBpdGVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldEluQ2FydCgpIHtcblx0XHRcdHJldHVybiAkaHR0cC5nZXQoJy9jYXJ0Jyk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVtb3ZlRnJvbUNhcnQoaXRlbSkge1xuXHRcdFx0cmV0dXJuICRodHRwLmRlbGV0ZSgnL2NhcnQvJyArIGl0ZW0uaWQpO1xuXHRcdH1cblxuXHRcdHRoaXMuZ2V0RGF0YSA9IGdldERhdGE7XG5cdFx0XG5cdFx0dGhpcy5zdG9yZUluQ2FydCA9IHN0b3JlSW5DYXJ0O1xuXHRcdFxuXHRcdHRoaXMuZ2V0SW5DYXJ0ID0gZ2V0SW5DYXJ0O1xuXG5cdFx0dGhpcy5yZW1vdmVGcm9tQ2FydCA9IHJlbW92ZUZyb21DYXJ0O1xuXHR9XG5cblx0ZGF0YVNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnXTtcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5zZXJ2aWNlKCdyb3V0ZXJTZXJ2aWNlJywgcm91dGVyU2VydmljZSk7XG5cblxuXHRmdW5jdGlvbiByb3V0ZXJTZXJ2aWNlKCRsb2NhdGlvbikge1xuXG5cdFx0dGhpcy5nZXRDdXJyZW50UGF0aCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiAkbG9jYXRpb24ucGF0aCgpLnNwbGl0KCcvJykuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuXHRcdFx0XHRyZXR1cm4gISFlbDtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0XG5cdFx0dGhpcy5zZXRDdXJyZW50UGF0aCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0cmV0dXJuICRsb2NhdGlvbi5wYXRoKHZhbHVlKTtcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0cmV0dXJuICRsb2NhdGlvbi5wYXRoKCcvJyArIHZhbHVlLmpvaW4oJy8nKSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcblx0fVxuXHRcblx0cm91dGVyU2VydmljZS4kaW5qZWN0ID0gWyckbG9jYXRpb24nXTtcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5jb250cm9sbGVyKCdjYXJ0Vmlld0N0cmwnLCBjYXJ0Vmlld0N0cmwpO1xuXG5cdGZ1bmN0aW9uIGNhcnRWaWV3Q3RybChkYXRhKSB7XG5cdFx0dGhpcy5kYXRhID0gZGF0YTtcblxuXHRcblx0fVxuXG5cblx0Y2FydFZpZXdDdHJsLiRpbmplY3QgPSBbJ2RhdGEnXTtcblx0XG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuY29udHJvbGxlcignY2hlY2tvdXRWaWV3Q3RybCcsIGNoZWNrb3V0Vmlld0N0cmwpO1xuXG5cdGZ1bmN0aW9uIGNoZWNrb3V0Vmlld0N0cmwoZGF0YSkge1xuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cblx0fVxuXG5cdGNoZWNrb3V0Vmlld0N0cmwuJGluamVjdCA9IFsnZGF0YSddO1xuXHRcblx0XG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuY29udHJvbGxlcignaG9tZVZpZXdDdHJsJywgaG9tZVZpZXdDdHJsKTtcblxuXHRmdW5jdGlvbiBob21lVmlld0N0cmwoZGF0YSkge1xuXHRcdFxuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cdFx0XG5cdH1cblx0XG5cdGhvbWVWaWV3Q3RybC4kaW5qZWN0ID0gWydkYXRhJ107XG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiXX0=
