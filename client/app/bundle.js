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
			.when('/admin/', {
				templateUrl: 'app/views/adminView/adminView.html',
				resolve: {
					data: ['dataService', function (dataService) {
						return dataService.getPurchaseRecords()
							.then(function (resolved) {return resolved.data;});
					}]
				},
				controller: 'adminViewCtrl as admin'
			})
			.when('/purchase-successful/', {
				templateUrl: 'app/views/purchaseSuccessful/purchaseSuccessful.html',
				resolve: {
					data: ['dataService', function (dataService) {
						return dataService.getInCart()
							.then(function (resolve) {return resolve.data;});
					}]
				},
				controller: 'purchaseSuccessfulCtrl as summary'
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
require('./components/listGroup/listGroup.js');
require('./components/success/success.js');

/*
 * Views controllers
 **/
require('./views/homeView/homeViewCtrl.js');
require('./views/cartView/cartViewCtrl.js');
require('./views/checkoutView/checkoutViewCtrl.js');
require('./views/adminView/adminViewCtrl.js');
require('./views/purchaseSuccessful/purchaseSuccessfulCtrl.js');

},{"./components/cartTable/cartTable.js":2,"./components/item-board/item-board.js":4,"./components/item/item.js":5,"./components/listGroup/listGroup.js":6,"./components/navbar/navbar.js":8,"./components/success/success.js":10,"./services/dataService.js":11,"./services/routerService.js":12,"./views/adminView/adminViewCtrl.js":13,"./views/cartView/cartViewCtrl.js":14,"./views/checkoutView/checkoutViewCtrl.js":15,"./views/homeView/homeViewCtrl.js":16,"./views/purchaseSuccessful/purchaseSuccessfulCtrl.js":17}],2:[function(require,module,exports){
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
			controller: ['dataService', '$scope', '$rootScope' , function (dataService, $scope, $rootScope) {
				
				
				$scope.addToCart = function (item) {
					
					dataService.storeInCart(item)
						.then(function(){
							
							$rootScope.$emit('addedtocart');
						});

				}
				
				
			}]
		}
	})


})(angular.module('ecomApp'));
},{}],6:[function(require,module,exports){
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
},{"./listGroupCtrl.js":7}],7:[function(require,module,exports){
(function (app) {

	app.controller('listGroupCtrl', listGroupCtrl);


	function listGroupCtrl($scope) {

		this.data = $scope.data;
		
	}

	listGroupCtrl.$inject = ['$scope'];

})(angular.module('ecomApp'));
},{}],8:[function(require,module,exports){
require('./navbarCtrl.js');

(function (app) {
	app.directive('navBar', function () {
		return {
			templateUrl: '/app/components/navbar/navbar.html',
			controller : 'navbarCtrl as nav'
		}
	})
})(angular.module('ecomApp'));
},{"./navbarCtrl.js":9}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
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
			controller: ['$scope', function ($scope) {
				var state = true;
				
				function close() {
					state = false;
					console.log(state);
					
				}
				
				
				$scope.isShown = function (){
					return state;
				};

				$scope.close = close;
			}]
		}
	})
})(angular.module('ecomApp'))  ;
},{}],11:[function(require,module,exports){
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

		function getPurchaseRecords() {
			return $http.get('/purchase-records');
		}

		function storePurchase(string) {
			return $http.post('/purchase-records', string, {
				headers: {
					"Content-Type": "text/plain"
				}
			})
		}

		this.getData = getData;
		
		this.storeInCart = storeInCart;
		
		this.getInCart = getInCart;

		this.removeFromCart = removeFromCart;
		
		this.getPurchaseRecords = getPurchaseRecords;
		
		this.storePurchase = storePurchase;
	}

	dataService.$inject = ['$http'];
})(angular.module('ecomApp'));
},{}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
(function (app) {
	app.controller('adminViewCtrl', adminViewCtrl);

	function adminViewCtrl(data) {
		this.data = data;
		console.log(data);
		
	}


	adminViewCtrl.$inject = ['data'];

})(angular.module('ecomApp'));
},{}],14:[function(require,module,exports){
(function (app) {
	app.controller('cartViewCtrl', cartViewCtrl);

	function cartViewCtrl(data) {
		this.data = data;

	}


	cartViewCtrl.$inject = ['data'];

})(angular.module('ecomApp'));
},{}],15:[function(require,module,exports){
(function (app) {
	app.controller('checkoutViewCtrl', checkoutViewCtrl);

	function checkoutViewCtrl(data, dataService, $location) {
		this.data = data;


		this.formData = {};


		function submitForm(formData) {
			function camelToHyphen(string){
				return string.replace(/[A-Z]/, function (A) {
					return '-' + A.toLowerCase();
				});
			}
			
			var body = '';

			for (var key in formData) {
				body = body + ' ' + camelToHyphen(key) + ': ' + formData[key] + '; ';
			}
			
			dataService.storePurchase(body)
				.then(function(){
				$location.path('/purchase-successful');
			});
			
		}

		this.submitForm = submitForm;
	}

	checkoutViewCtrl.$inject = ['data', 'dataService', '$location'];
	
	
})(angular.module('ecomApp'));
},{}],16:[function(require,module,exports){
(function (app) {
	app.controller('homeViewCtrl', homeViewCtrl);

	function homeViewCtrl(data) {
		
		this.data = data;
		
	}
	
	homeViewCtrl.$inject = ['data'];
})(angular.module('ecomApp'));
},{}],17:[function(require,module,exports){
(function (app) {
	app.controller('purchaseSuccessfulCtrl', purchaseSuccessfulCtrl);

	function purchaseSuccessfulCtrl(data) {
		this.data = data;

		this.authorizationCode = function () {
			return Math.round( Math.random() * Math.pow(10, 12) );
		}
	}

	purchaseSuccessfulCtrl.$inject = ['data'];
	
	
})(angular.module('ecomApp'));
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvYXBwL2FwcC5qcyIsImNsaWVudC9hcHAvY29tcG9uZW50cy9jYXJ0VGFibGUvY2FydFRhYmxlLmpzIiwiY2xpZW50L2FwcC9jb21wb25lbnRzL2NhcnRUYWJsZS9jYXJ0VGFibGVDdHJsLmpzIiwiY2xpZW50L2FwcC9jb21wb25lbnRzL2l0ZW0tYm9hcmQvaXRlbS1ib2FyZC5qcyIsImNsaWVudC9hcHAvY29tcG9uZW50cy9pdGVtL2l0ZW0uanMiLCJjbGllbnQvYXBwL2NvbXBvbmVudHMvbGlzdEdyb3VwL2xpc3RHcm91cC5qcyIsImNsaWVudC9hcHAvY29tcG9uZW50cy9saXN0R3JvdXAvbGlzdEdyb3VwQ3RybC5qcyIsImNsaWVudC9hcHAvY29tcG9uZW50cy9uYXZiYXIvbmF2YmFyLmpzIiwiY2xpZW50L2FwcC9jb21wb25lbnRzL25hdmJhci9uYXZiYXJDdHJsLmpzIiwiY2xpZW50L2FwcC9jb21wb25lbnRzL3N1Y2Nlc3Mvc3VjY2Vzcy5qcyIsImNsaWVudC9hcHAvc2VydmljZXMvZGF0YVNlcnZpY2UuanMiLCJjbGllbnQvYXBwL3NlcnZpY2VzL3JvdXRlclNlcnZpY2UuanMiLCJjbGllbnQvYXBwL3ZpZXdzL2FkbWluVmlldy9hZG1pblZpZXdDdHJsLmpzIiwiY2xpZW50L2FwcC92aWV3cy9jYXJ0Vmlldy9jYXJ0Vmlld0N0cmwuanMiLCJjbGllbnQvYXBwL3ZpZXdzL2NoZWNrb3V0Vmlldy9jaGVja291dFZpZXdDdHJsLmpzIiwiY2xpZW50L2FwcC92aWV3cy9ob21lVmlldy9ob21lVmlld0N0cmwuanMiLCJjbGllbnQvYXBwL3ZpZXdzL3B1cmNoYXNlU3VjY2Vzc2Z1bC9wdXJjaGFzZVN1Y2Nlc3NmdWxDdHJsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGFuZ3VsYXIpIHtcblxuXHRmdW5jdGlvbiBjb25maWdBcHAoJHJvdXRlUHJvdmlkZXIsICRwcm92aWRlKSB7XG5cdFx0XG5cdFx0JHByb3ZpZGUuZGVjb3JhdG9yKCckcm9vdFNjb3BlJywgWyckZGVsZWdhdGUnLCBmdW5jdGlvbiAoJGRlbGVnYXRlKSB7XG5cblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkZGVsZWdhdGUuY29uc3RydWN0b3IucHJvdG90eXBlLCAnJG9uUm9vdFNjb3BlJywge1xuXHRcdFx0XHR2YWx1ZTogZnVuY3Rpb24obmFtZSwgbGlzdGVuZXIpe1xuXHRcdFx0XHRcdHZhciB1bnN1YnNjcmliZSA9ICRkZWxlZ2F0ZS4kb24obmFtZSwgbGlzdGVuZXIpO1xuXHRcdFx0XHRcdHRoaXMuJG9uKCckZGVzdHJveScsIHVuc3Vic2NyaWJlKTtcblxuXHRcdFx0XHRcdHJldHVybiB1bnN1YnNjcmliZTtcblx0XHRcdFx0fSxcblx0XHRcdFx0ZW51bWVyYWJsZTogZmFsc2Vcblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gJGRlbGVnYXRlO1xuXHRcdH1dKTtcblx0XHRcblx0XHQkcm91dGVQcm92aWRlclxuXHRcdFx0LndoZW4oJy8nLCB7XG5cdFx0XHRcdHJlZGlyZWN0VG86ICcvaG9tZS8nXG5cdFx0XHR9KVxuXHRcdFx0LndoZW4oJy9ob21lLycsIHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICcvYXBwL3ZpZXdzL2hvbWVWaWV3L2hvbWVWaWV3Lmh0bWwnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0ZGF0YTogWydkYXRhU2VydmljZScsZnVuY3Rpb24gKGRhdGFTZXJ2aWNlKSB7XG5cdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhU2VydmljZS5nZXREYXRhKClcblx0XHRcdFx0XHRcdFx0LnRoZW4oZnVuY3Rpb24gKHJlc29sdmUpIHtyZXR1cm4gcmVzb2x2ZS5kYXRhO30pO1xuXHRcdFx0XHRcdH1dXG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdob21lVmlld0N0cmwgYXMgaG9tZSdcblx0XHRcdH0pXG5cdFx0XHQud2hlbignL2NhcnQvJywge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2FwcC92aWV3cy9jYXJ0Vmlldy9jYXJ0Vmlldy5odG1sJyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGRhdGE6IFsnZGF0YVNlcnZpY2UnLCBmdW5jdGlvbiAoZGF0YVNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhU2VydmljZS5nZXRJbkNhcnQoKVxuXHRcdFx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzb2x2ZSkge3JldHVybiByZXNvbHZlLmRhdGE7fSk7XG5cdFx0XHRcdFx0fV1cblx0XHRcdFx0fSxcblx0XHRcdFx0Y29udHJvbGxlcjogJ2NhcnRWaWV3Q3RybCBhcyBjYXJ0J1xuXHRcdFx0fSlcblx0XHRcdC53aGVuKCcvY2hlY2tvdXQvJywge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2FwcC92aWV3cy9jaGVja291dFZpZXcvY2hlY2tvdXRWaWV3Lmh0bWwnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0ZGF0YTogWydkYXRhU2VydmljZScsIGZ1bmN0aW9uIChkYXRhU2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGFTZXJ2aWNlLmdldEluQ2FydCgpXG5cdFx0XHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXNvbHZlKSB7cmV0dXJuIHJlc29sdmUuZGF0YTt9KTtcblx0XHRcdFx0XHR9XVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb250cm9sbGVyOiAnY2hlY2tvdXRWaWV3Q3RybCBhcyBjaGVja291dCdcblx0XHRcdH0pXG5cdFx0XHQud2hlbignL2FkbWluLycsIHtcblx0XHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvdmlld3MvYWRtaW5WaWV3L2FkbWluVmlldy5odG1sJyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGRhdGE6IFsnZGF0YVNlcnZpY2UnLCBmdW5jdGlvbiAoZGF0YVNlcnZpY2UpIHtcblx0XHRcdFx0XHRcdHJldHVybiBkYXRhU2VydmljZS5nZXRQdXJjaGFzZVJlY29yZHMoKVxuXHRcdFx0XHRcdFx0XHQudGhlbihmdW5jdGlvbiAocmVzb2x2ZWQpIHtyZXR1cm4gcmVzb2x2ZWQuZGF0YTt9KTtcblx0XHRcdFx0XHR9XVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb250cm9sbGVyOiAnYWRtaW5WaWV3Q3RybCBhcyBhZG1pbidcblx0XHRcdH0pXG5cdFx0XHQud2hlbignL3B1cmNoYXNlLXN1Y2Nlc3NmdWwvJywge1xuXHRcdFx0XHR0ZW1wbGF0ZVVybDogJ2FwcC92aWV3cy9wdXJjaGFzZVN1Y2Nlc3NmdWwvcHVyY2hhc2VTdWNjZXNzZnVsLmh0bWwnLFxuXHRcdFx0XHRyZXNvbHZlOiB7XG5cdFx0XHRcdFx0ZGF0YTogWydkYXRhU2VydmljZScsIGZ1bmN0aW9uIChkYXRhU2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGFTZXJ2aWNlLmdldEluQ2FydCgpXG5cdFx0XHRcdFx0XHRcdC50aGVuKGZ1bmN0aW9uIChyZXNvbHZlKSB7cmV0dXJuIHJlc29sdmUuZGF0YTt9KTtcblx0XHRcdFx0XHR9XVxuXHRcdFx0XHR9LFxuXHRcdFx0XHRjb250cm9sbGVyOiAncHVyY2hhc2VTdWNjZXNzZnVsQ3RybCBhcyBzdW1tYXJ5J1xuXHRcdFx0fSlcblx0fVxuXHRcblx0Y29uZmlnQXBwLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJywgJyRwcm92aWRlJ107XG5cdFxuXHRhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcsIFsnbmdSb3V0ZSddKVxuXHRcdC5jb25maWcoY29uZmlnQXBwKTtcbn0pKGFuZ3VsYXIpO1xuXG5cbi8qXG4gKiBTZXJ2aWNlc1xuICoqL1xucmVxdWlyZSgnLi9zZXJ2aWNlcy9yb3V0ZXJTZXJ2aWNlLmpzJyk7XG5yZXF1aXJlKCcuL3NlcnZpY2VzL2RhdGFTZXJ2aWNlLmpzJyk7XG5cbi8qXG4gKiBDb21wb25lbnRzXG4gKiovXG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhci5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2l0ZW0vaXRlbS5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2l0ZW0tYm9hcmQvaXRlbS1ib2FyZC5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2NhcnRUYWJsZS9jYXJ0VGFibGUuanMnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9saXN0R3JvdXAvbGlzdEdyb3VwLmpzJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvc3VjY2Vzcy9zdWNjZXNzLmpzJyk7XG5cbi8qXG4gKiBWaWV3cyBjb250cm9sbGVyc1xuICoqL1xucmVxdWlyZSgnLi92aWV3cy9ob21lVmlldy9ob21lVmlld0N0cmwuanMnKTtcbnJlcXVpcmUoJy4vdmlld3MvY2FydFZpZXcvY2FydFZpZXdDdHJsLmpzJyk7XG5yZXF1aXJlKCcuL3ZpZXdzL2NoZWNrb3V0Vmlldy9jaGVja291dFZpZXdDdHJsLmpzJyk7XG5yZXF1aXJlKCcuL3ZpZXdzL2FkbWluVmlldy9hZG1pblZpZXdDdHJsLmpzJyk7XG5yZXF1aXJlKCcuL3ZpZXdzL3B1cmNoYXNlU3VjY2Vzc2Z1bC9wdXJjaGFzZVN1Y2Nlc3NmdWxDdHJsLmpzJyk7XG4iLCJyZXF1aXJlKCcuL2NhcnRUYWJsZUN0cmwuanMnKTtcblxuKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLmRpcmVjdGl2ZSgnY2FydFRhYmxlJywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0ZW1wbGF0ZVVybDogJy9hcHAvY29tcG9uZW50cy9jYXJ0VGFibGUvY2FydFRhYmxlLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlciA6ICdjYXJ0VGFibGVDdHJsIGFzIGNhcnQnLFxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0Y2FydERhdGE6ICc9Y2FydERhdGEnXG5cdFx0XHR9XG5cdFx0fVxuXHR9KVxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0XG5cdGFwcC5jb250cm9sbGVyKCdjYXJ0VGFibGVDdHJsJywgY2FydFRhYmxlQ3RybCk7XG5cblxuXHRmdW5jdGlvbiBjYXJ0VGFibGVDdHJsKCRzY29wZSwgZGF0YVNlcnZpY2UpIHtcblxuXHRcdHRoaXMuZGF0YSA9ICRzY29wZS5jYXJ0RGF0YTtcblx0XHR2YXIgY2FydCA9IHRoaXMuZGF0YTtcblxuXHRcdGZ1bmN0aW9uIHRvdGFsUHJpY2UoKSB7XG5cdFx0XHR2YXIgY291bnQgPSAwO1xuXHRcdFx0Y2FydC5mb3JFYWNoKGZ1bmN0aW9uIChlKSB7XG5cdFx0XHRcdGNvdW50ICs9IGUucHJpY2UgKiBlLnF1YW50aXR5O1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gY291bnQ7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gcmVtb3ZlSXRlbShpdGVtKXtcblx0XHRcdGRhdGFTZXJ2aWNlXG5cdFx0XHRcdC5yZW1vdmVGcm9tQ2FydChpdGVtKVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhciBpbmRleCA9IGNhcnQuZmluZEluZGV4KGZ1bmN0aW9uKGVsKXtcblx0XHRcdFx0XHRcdHJldHVybiBlbC5pZCA9PSBpdGVtLmlkO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGNhcnQuc3BsaWNlKGluZGV4LDEpO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cblx0XHR0aGlzLnRvdGFsUHJpY2UgPSB0b3RhbFByaWNlO1xuXG5cdFx0dGhpcy5yZW1vdmVJdGVtID0gcmVtb3ZlSXRlbTtcblx0fVxuXHRcblx0Y2FydFRhYmxlQ3RybC4kaW5qZWN0ID0gWyckc2NvcGUnLCAnZGF0YVNlcnZpY2UnXTtcblxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0XG5cdGFwcC5kaXJlY3RpdmUoJ2l0ZW1Cb2FyZCcsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGVtcGxhdGVVcmw6ICdhcHAvY29tcG9uZW50cy9pdGVtLWJvYXJkL2l0ZW0tYm9hcmQuaHRtbCdcblx0XHR9XG5cdH0pXG5cdFxuXHRcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cblx0YXBwLmRpcmVjdGl2ZSgnaXRlbScsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0cmVzdHJpY3Q6J0FFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvaXRlbS9pdGVtLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlcjogWydkYXRhU2VydmljZScsICckc2NvcGUnLCAnJHJvb3RTY29wZScgLCBmdW5jdGlvbiAoZGF0YVNlcnZpY2UsICRzY29wZSwgJHJvb3RTY29wZSkge1xuXHRcdFx0XHRcblx0XHRcdFx0XG5cdFx0XHRcdCRzY29wZS5hZGRUb0NhcnQgPSBmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGRhdGFTZXJ2aWNlLnN0b3JlSW5DYXJ0KGl0ZW0pXG5cdFx0XHRcdFx0XHQudGhlbihmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0JHJvb3RTY29wZS4kZW1pdCgnYWRkZWR0b2NhcnQnKTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0fV1cblx0XHR9XG5cdH0pXG5cblxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwicmVxdWlyZSgnLi9saXN0R3JvdXBDdHJsLmpzJyk7XG5cbihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5kaXJlY3RpdmUoJ2xpc3RHcm91cCcsIGZ1bmN0aW9uICgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0dGVtcGxhdGVVcmw6ICcvYXBwL2NvbXBvbmVudHMvbGlzdEdyb3VwL2xpc3RHcm91cC5odG1sJyxcblx0XHRcdGNvbnRyb2xsZXIgOiAnbGlzdEdyb3VwQ3RybCBhcyBsaXN0Jyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGRhdGE6ICc9aW5mbydcblx0XHRcdH1cblx0XHR9XG5cdH0pXG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXG5cdGFwcC5jb250cm9sbGVyKCdsaXN0R3JvdXBDdHJsJywgbGlzdEdyb3VwQ3RybCk7XG5cblxuXHRmdW5jdGlvbiBsaXN0R3JvdXBDdHJsKCRzY29wZSkge1xuXG5cdFx0dGhpcy5kYXRhID0gJHNjb3BlLmRhdGE7XG5cdFx0XG5cdH1cblxuXHRsaXN0R3JvdXBDdHJsLiRpbmplY3QgPSBbJyRzY29wZSddO1xuXG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCJyZXF1aXJlKCcuL25hdmJhckN0cmwuanMnKTtcblxuKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLmRpcmVjdGl2ZSgnbmF2QmFyJywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHR0ZW1wbGF0ZVVybDogJy9hcHAvY29tcG9uZW50cy9uYXZiYXIvbmF2YmFyLmh0bWwnLFxuXHRcdFx0Y29udHJvbGxlciA6ICduYXZiYXJDdHJsIGFzIG5hdidcblx0XHR9XG5cdH0pXG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCwgJCkge1xuXG5cblx0YXBwLmNvbnRyb2xsZXIoJ25hdmJhckN0cmwnLCBuYXZiYXJDb250cm9sbGVyKTtcblxuXHRmdW5jdGlvbiBuYXZiYXJDb250cm9sbGVyKHJvdXRlclNlcnZpY2UsICRyb290U2NvcGUpIHtcblxuXHRcdHZhciAkbGlua3MgPSAkKCAnI25hdmJhckxpbmtzJykuZmluZCgnYScpO1xuXG5cblx0XHQkcm9vdFNjb3BlLiRvblJvb3RTY29wZSgnJHJvdXRlQ2hhbmdlU3VjY2VzcycsIHJlbmRlclN0YXRlKTtcblxuXHRcdGZ1bmN0aW9uIHJlbmRlclN0YXRlKCkge1xuXHRcdFx0XG5cdFx0XHR2YXIgcGF0aCA9IHJvdXRlclNlcnZpY2UuZ2V0Q3VycmVudFBhdGgoKVswXTtcblxuXG5cdFx0XHQkbGlua3MuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciAkZWwgPSAkKCB0aGlzICksXG5cdFx0XHRcdCAgICBpc0VsZW1lbnQgPSAkZWwudGV4dCgpLnRvTG93ZXJDYXNlKCkgPT09IHBhdGg7XG5cblxuXHRcdFx0XHQkZWwucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScsIGlzRWxlbWVudCk7XG5cblx0XHRcdH0pO1xuXG5cblx0XHR9XG5cblxuXG5cdFx0ZnVuY3Rpb24gY2hhbmdlVGFicyhldmVudCkge1xuXHRcdFx0cm91dGVyU2VydmljZS5zZXRDdXJyZW50UGF0aCgnLycgKyBldmVudC50YXJnZXQudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSArICcvJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5jaGFuZ2VUYWJzID0gY2hhbmdlVGFicztcblxuXG5cblx0fVxuXG5cdG5hdmJhckNvbnRyb2xsZXIuJGluamVjdCA9IFsncm91dGVyU2VydmljZScsICckcm9vdFNjb3BlJ107XG5cblxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSwgalF1ZXJ5KTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuZGlyZWN0aXZlKCdzdWNjZXNzJywgZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRyZXN0cmljdDogJ0FFJyxcblx0XHRcdHRlbXBsYXRlVXJsOiAnL2FwcC9jb21wb25lbnRzL3N1Y2Nlc3Mvc3VjY2Vzcy5odG1sJyxcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGhlYWRlcjogJz1oZWFkZXInLFxuXHRcdFx0XHRjb250ZW50OiAnPWNvbnRlbnQnLFxuXHRcdFx0XHRidXR0b246ICc9YnV0dG9uJ1xuXHRcdFx0fSxcblx0XHRcdGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgZnVuY3Rpb24gKCRzY29wZSkge1xuXHRcdFx0XHR2YXIgc3RhdGUgPSB0cnVlO1xuXHRcdFx0XHRcblx0XHRcdFx0ZnVuY3Rpb24gY2xvc2UoKSB7XG5cdFx0XHRcdFx0c3RhdGUgPSBmYWxzZTtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhzdGF0ZSk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdFxuXHRcdFx0XHQkc2NvcGUuaXNTaG93biA9IGZ1bmN0aW9uICgpe1xuXHRcdFx0XHRcdHJldHVybiBzdGF0ZTtcblx0XHRcdFx0fTtcblxuXHRcdFx0XHQkc2NvcGUuY2xvc2UgPSBjbG9zZTtcblx0XHRcdH1dXG5cdFx0fVxuXHR9KVxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSkgIDsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuc2VydmljZSgnZGF0YVNlcnZpY2UnLCBkYXRhU2VydmljZSk7XG5cblx0ZnVuY3Rpb24gZGF0YVNlcnZpY2UoJGh0dHApIHtcblx0XHRcblx0XHRcblx0XHR2YXIgY2FydCA9IFtdLFxuXHRcdFx0aXRlbXMgPSBbXTtcblxuXHRcdGZ1bmN0aW9uIGdldERhdGEoKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvaXRlbXMnKTtcblx0XHR9XG5cdFx0XG5cdFx0ZnVuY3Rpb24gc3RvcmVJbkNhcnQoaXRlbSkge1xuXHRcdFx0cmV0dXJuICRodHRwLnBvc3QoJy9jYXJ0JywgaXRlbSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRJbkNhcnQoKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvY2FydCcpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHJlbW92ZUZyb21DYXJ0KGl0ZW0pIHtcblx0XHRcdHJldHVybiAkaHR0cC5kZWxldGUoJy9jYXJ0LycgKyBpdGVtLmlkKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBnZXRQdXJjaGFzZVJlY29yZHMoKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAuZ2V0KCcvcHVyY2hhc2UtcmVjb3JkcycpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHN0b3JlUHVyY2hhc2Uoc3RyaW5nKSB7XG5cdFx0XHRyZXR1cm4gJGh0dHAucG9zdCgnL3B1cmNoYXNlLXJlY29yZHMnLCBzdHJpbmcsIHtcblx0XHRcdFx0aGVhZGVyczoge1xuXHRcdFx0XHRcdFwiQ29udGVudC1UeXBlXCI6IFwidGV4dC9wbGFpblwiXG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0fVxuXG5cdFx0dGhpcy5nZXREYXRhID0gZ2V0RGF0YTtcblx0XHRcblx0XHR0aGlzLnN0b3JlSW5DYXJ0ID0gc3RvcmVJbkNhcnQ7XG5cdFx0XG5cdFx0dGhpcy5nZXRJbkNhcnQgPSBnZXRJbkNhcnQ7XG5cblx0XHR0aGlzLnJlbW92ZUZyb21DYXJ0ID0gcmVtb3ZlRnJvbUNhcnQ7XG5cdFx0XG5cdFx0dGhpcy5nZXRQdXJjaGFzZVJlY29yZHMgPSBnZXRQdXJjaGFzZVJlY29yZHM7XG5cdFx0XG5cdFx0dGhpcy5zdG9yZVB1cmNoYXNlID0gc3RvcmVQdXJjaGFzZTtcblx0fVxuXG5cdGRhdGFTZXJ2aWNlLiRpbmplY3QgPSBbJyRodHRwJ107XG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuc2VydmljZSgncm91dGVyU2VydmljZScsIHJvdXRlclNlcnZpY2UpO1xuXG5cblx0ZnVuY3Rpb24gcm91dGVyU2VydmljZSgkbG9jYXRpb24pIHtcblxuXHRcdHRoaXMuZ2V0Q3VycmVudFBhdGggPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gJGxvY2F0aW9uLnBhdGgoKS5zcGxpdCgnLycpLmZpbHRlcihmdW5jdGlvbiAoZWwpIHtcblx0XHRcdFx0cmV0dXJuICEhZWw7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHRcdFxuXHRcdHRoaXMuc2V0Q3VycmVudFBhdGggPSBmdW5jdGlvbiAodmFsdWUpIHtcblx0XHRcdGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHJldHVybiAkbG9jYXRpb24ucGF0aCh2YWx1ZSk7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XG5cdFx0XHRcdHJldHVybiAkbG9jYXRpb24ucGF0aCgnLycgKyB2YWx1ZS5qb2luKCcvJykpO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0XG5cdH1cblx0XG5cdHJvdXRlclNlcnZpY2UuJGluamVjdCA9IFsnJGxvY2F0aW9uJ107XG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuY29udHJvbGxlcignYWRtaW5WaWV3Q3RybCcsIGFkbWluVmlld0N0cmwpO1xuXG5cdGZ1bmN0aW9uIGFkbWluVmlld0N0cmwoZGF0YSkge1xuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cdFx0Y29uc29sZS5sb2coZGF0YSk7XG5cdFx0XG5cdH1cblxuXG5cdGFkbWluVmlld0N0cmwuJGluamVjdCA9IFsnZGF0YSddO1xuXG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuY29udHJvbGxlcignY2FydFZpZXdDdHJsJywgY2FydFZpZXdDdHJsKTtcblxuXHRmdW5jdGlvbiBjYXJ0Vmlld0N0cmwoZGF0YSkge1xuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XG5cblx0fVxuXG5cblx0Y2FydFZpZXdDdHJsLiRpbmplY3QgPSBbJ2RhdGEnXTtcblxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLmNvbnRyb2xsZXIoJ2NoZWNrb3V0Vmlld0N0cmwnLCBjaGVja291dFZpZXdDdHJsKTtcblxuXHRmdW5jdGlvbiBjaGVja291dFZpZXdDdHJsKGRhdGEsIGRhdGFTZXJ2aWNlLCAkbG9jYXRpb24pIHtcblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xuXG5cblx0XHR0aGlzLmZvcm1EYXRhID0ge307XG5cblxuXHRcdGZ1bmN0aW9uIHN1Ym1pdEZvcm0oZm9ybURhdGEpIHtcblx0XHRcdGZ1bmN0aW9uIGNhbWVsVG9IeXBoZW4oc3RyaW5nKXtcblx0XHRcdFx0cmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bQS1aXS8sIGZ1bmN0aW9uIChBKSB7XG5cdFx0XHRcdFx0cmV0dXJuICctJyArIEEudG9Mb3dlckNhc2UoKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdHZhciBib2R5ID0gJyc7XG5cblx0XHRcdGZvciAodmFyIGtleSBpbiBmb3JtRGF0YSkge1xuXHRcdFx0XHRib2R5ID0gYm9keSArICcgJyArIGNhbWVsVG9IeXBoZW4oa2V5KSArICc6ICcgKyBmb3JtRGF0YVtrZXldICsgJzsgJztcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0ZGF0YVNlcnZpY2Uuc3RvcmVQdXJjaGFzZShib2R5KVxuXHRcdFx0XHQudGhlbihmdW5jdGlvbigpe1xuXHRcdFx0XHQkbG9jYXRpb24ucGF0aCgnL3B1cmNoYXNlLXN1Y2Nlc3NmdWwnKTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0fVxuXG5cdFx0dGhpcy5zdWJtaXRGb3JtID0gc3VibWl0Rm9ybTtcblx0fVxuXG5cdGNoZWNrb3V0Vmlld0N0cmwuJGluamVjdCA9IFsnZGF0YScsICdkYXRhU2VydmljZScsICckbG9jYXRpb24nXTtcblx0XG5cdFxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLmNvbnRyb2xsZXIoJ2hvbWVWaWV3Q3RybCcsIGhvbWVWaWV3Q3RybCk7XG5cblx0ZnVuY3Rpb24gaG9tZVZpZXdDdHJsKGRhdGEpIHtcblx0XHRcblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xuXHRcdFxuXHR9XG5cdFxuXHRob21lVmlld0N0cmwuJGluamVjdCA9IFsnZGF0YSddO1xufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7IiwiKGZ1bmN0aW9uIChhcHApIHtcblx0YXBwLmNvbnRyb2xsZXIoJ3B1cmNoYXNlU3VjY2Vzc2Z1bEN0cmwnLCBwdXJjaGFzZVN1Y2Nlc3NmdWxDdHJsKTtcblxuXHRmdW5jdGlvbiBwdXJjaGFzZVN1Y2Nlc3NmdWxDdHJsKGRhdGEpIHtcblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xuXG5cdFx0dGhpcy5hdXRob3JpemF0aW9uQ29kZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBNYXRoLnJvdW5kKCBNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMTAsIDEyKSApO1xuXHRcdH1cblx0fVxuXG5cdHB1cmNoYXNlU3VjY2Vzc2Z1bEN0cmwuJGluamVjdCA9IFsnZGF0YSddO1xuXHRcblx0XG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiXX0=
