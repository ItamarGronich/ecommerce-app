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

},{"./components/item-board/item-board.js":2,"./components/item/item.js":3,"./components/navbar/navbar.js":4,"./services/dataService.js":6,"./services/routerService.js":7,"./views/homeViewCtrl.js":8}],2:[function(require,module,exports){
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
			templateUrl: 'app/components/item/item.html'
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

		this.getData = getData;
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
	app.controller('homeViewCtrl', homeViewCtrl);

	function homeViewCtrl(data) {
		
		this.data = data
		
	}
	
	homeViewCtrl.$inject = ['data'];
})(angular.module('ecomApp'));
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvYXBwL2FwcC5qcyIsImNsaWVudC9hcHAvY29tcG9uZW50cy9pdGVtLWJvYXJkL2l0ZW0tYm9hcmQuanMiLCJjbGllbnQvYXBwL2NvbXBvbmVudHMvaXRlbS9pdGVtLmpzIiwiY2xpZW50L2FwcC9jb21wb25lbnRzL25hdmJhci9uYXZiYXIuanMiLCJjbGllbnQvYXBwL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhckN0cmwuanMiLCJjbGllbnQvYXBwL3NlcnZpY2VzL2RhdGFTZXJ2aWNlLmpzIiwiY2xpZW50L2FwcC9zZXJ2aWNlcy9yb3V0ZXJTZXJ2aWNlLmpzIiwiY2xpZW50L2FwcC92aWV3cy9ob21lVmlld0N0cmwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChhbmd1bGFyKSB7XG5cblx0ZnVuY3Rpb24gY29uZmlnQXBwKCRyb3V0ZVByb3ZpZGVyLCAkcHJvdmlkZSkge1xuXHRcdFxuXHRcdCRwcm92aWRlLmRlY29yYXRvcignJHJvb3RTY29wZScsIFsnJGRlbGVnYXRlJywgZnVuY3Rpb24gKCRkZWxlZ2F0ZSkge1xuXG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoJGRlbGVnYXRlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJyRvblJvb3RTY29wZScsIHtcblx0XHRcdFx0dmFsdWU6IGZ1bmN0aW9uKG5hbWUsIGxpc3RlbmVyKXtcblx0XHRcdFx0XHR2YXIgdW5zdWJzY3JpYmUgPSAkZGVsZWdhdGUuJG9uKG5hbWUsIGxpc3RlbmVyKTtcblx0XHRcdFx0XHR0aGlzLiRvbignJGRlc3Ryb3knLCB1bnN1YnNjcmliZSk7XG5cblx0XHRcdFx0XHRyZXR1cm4gdW5zdWJzY3JpYmU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGVudW1lcmFibGU6IGZhbHNlXG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuICRkZWxlZ2F0ZTtcblx0XHR9XSk7XG5cdFx0XG5cdFx0JHJvdXRlUHJvdmlkZXJcblx0XHRcdC53aGVuKCcvJywge1xuXHRcdFx0XHRyZWRpcmVjdFRvOiAnL2hvbWUvJ1xuXHRcdFx0fSlcblx0XHRcdC53aGVuKCcvaG9tZS8nLCB7XG5cdFx0XHRcdHRlbXBsYXRlVXJsOiAnL2FwcC92aWV3cy9ob21lVmlldy5odG1sJyxcblx0XHRcdFx0cmVzb2x2ZToge1xuXHRcdFx0XHRcdGRhdGE6IGZ1bmN0aW9uIChkYXRhU2VydmljZSkge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGRhdGFTZXJ2aWNlLmdldERhdGEoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGNvbnRyb2xsZXI6ICdob21lVmlld0N0cmwgYXMgaG9tZSdcblx0XHRcdH0pXG5cdH1cblx0XG5cdGNvbmZpZ0FwcC4kaW5qZWN0ID0gWyckcm91dGVQcm92aWRlcicsICckcHJvdmlkZSddO1xuXHRcblx0YW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnLCBbJ25nUm91dGUnXSlcblx0XHQuY29uZmlnKGNvbmZpZ0FwcCk7XG59KShhbmd1bGFyKTtcblxucmVxdWlyZSgnLi9zZXJ2aWNlcy9yb3V0ZXJTZXJ2aWNlLmpzJyk7XG5yZXF1aXJlKCcuL3NlcnZpY2VzL2RhdGFTZXJ2aWNlLmpzJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvbmF2YmFyL25hdmJhci5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2l0ZW0vaXRlbS5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2l0ZW0tYm9hcmQvaXRlbS1ib2FyZC5qcycpO1xucmVxdWlyZSgnLi92aWV3cy9ob21lVmlld0N0cmwuanMnKTtcbiIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdFxuXHRhcHAuZGlyZWN0aXZlKCdpdGVtQm9hcmQnLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvaXRlbS1ib2FyZC9pdGVtLWJvYXJkLmh0bWwnXG5cdFx0fVxuXHR9KVxuXHRcblx0XG59KShhbmd1bGFyLm1vZHVsZSgnZWNvbUFwcCcpKTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXG5cdGFwcC5kaXJlY3RpdmUoJ2l0ZW0nLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRlbXBsYXRlVXJsOiAnYXBwL2NvbXBvbmVudHMvaXRlbS9pdGVtLmh0bWwnXG5cdFx0fVxuXHR9KVxuXG5cbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsInJlcXVpcmUoJy4vbmF2YmFyQ3RybC5qcycpO1xuXG4oZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuZGlyZWN0aXZlKCduYXZCYXInLCBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHRlbXBsYXRlVXJsOiAnL2FwcC9jb21wb25lbnRzL25hdmJhci9uYXZiYXIuaHRtbCcsXG5cdFx0XHRjb250cm9sbGVyIDogJ25hdmJhckN0cmwgYXMgbmF2J1xuXHRcdH1cblx0fSlcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwLCAkKSB7XG5cblxuXHRhcHAuY29udHJvbGxlcignbmF2YmFyQ3RybCcsIG5hdmJhckNvbnRyb2xsZXIpO1xuXG5cdGZ1bmN0aW9uIG5hdmJhckNvbnRyb2xsZXIocm91dGVyU2VydmljZSwgJHJvb3RTY29wZSkge1xuXG5cdFx0dmFyICRsaW5rcyA9ICQoICcjbmF2YmFyTGlua3MnKS5maW5kKCdhJyk7XG5cblx0XHQkcm9vdFNjb3BlLiRvblJvb3RTY29wZSgnJHJvdXRlQ2hhbmdlU3RhcnQnLCByZW5kZXJTdGF0ZSk7XG5cblx0XHRmdW5jdGlvbiByZW5kZXJTdGF0ZSgpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdGSVJFRCcpO1xuXHRcdFx0XG5cdFx0XHR2YXIgcGF0aCA9IHJvdXRlclNlcnZpY2UuZ2V0Q3VycmVudFBhdGgoKVswXTtcblxuXG5cdFx0XHQkbGlua3MuZWFjaChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHZhciAkZWwgPSAkKCB0aGlzICksXG5cdFx0XHRcdCAgICBpc0VsZW1lbnQgPSAkZWwudGV4dCgpLnRvTG93ZXJDYXNlKCkgPT09IHBhdGg7XG5cblxuXHRcdFx0XHQkZWwucGFyZW50KCkudG9nZ2xlQ2xhc3MoJ2FjdGl2ZScsIGlzRWxlbWVudCk7XG5cblx0XHRcdH0pO1xuXG5cblx0XHR9XG5cblxuXG5cdFx0ZnVuY3Rpb24gY2hhbmdlVGFicyhldmVudCkge1xuXHRcdFx0cm91dGVyU2VydmljZS5zZXRDdXJyZW50UGF0aCgnLycgKyBldmVudC50YXJnZXQudGV4dENvbnRlbnQudG9Mb3dlckNhc2UoKSArICcvJyk7XG5cdFx0fVxuXG5cdFx0dGhpcy5jaGFuZ2VUYWJzID0gY2hhbmdlVGFicztcblxuXG5cblx0fVxuXG5cdG5hdmJhckNvbnRyb2xsZXIuJGluamVjdCA9IFsncm91dGVyU2VydmljZScsICckcm9vdFNjb3BlJ107XG5cblxufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSwgalF1ZXJ5KTsiLCIoZnVuY3Rpb24gKGFwcCkge1xuXHRhcHAuc2VydmljZSgnZGF0YVNlcnZpY2UnLCBkYXRhU2VydmljZSk7XG5cblx0ZnVuY3Rpb24gZGF0YVNlcnZpY2UoJGh0dHApIHtcblxuXHRcdGZ1bmN0aW9uIGdldERhdGEoKSB7XG5cdFx0XHRyZXR1cm4gW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0dGl0bGU6ICdHb2xkIFBsYXRlZCBUb290aCBCcnVzaCcsXG5cdFx0XHRcdFx0cHJpY2U6IDEwMDAwMDAsXG5cdFx0XHRcdFx0aW1nVXJsOiAnaHR0cHM6Ly9pLnl0aW1nLmNvbS92aS90bnRPQ0drZ3Q5OC9tYXhyZXNkZWZhdWx0LmpwZycsXG5cdFx0XHRcdFx0ZGVzY3JpcHRpb246ICdQcmVtaXVtIDI0IGNhcmF0IGdvbGQgcGxhdGVkIHRvb3RoIGJydXNoLiBIaWdoIHF1YWxpdHkgaG9yc2UgdGFpbCBmaWJlcnMuIEFwcHJvdmVkIGJ5IGRlbnRpc3RzIGFyb3VuZCB0aGUgd29ybGQuJ1xuXHRcdFx0XHR9XG5cdFx0XHRdXG5cblx0XHR9XG5cblx0XHR0aGlzLmdldERhdGEgPSBnZXREYXRhO1xuXHR9XG5cblx0ZGF0YVNlcnZpY2UuJGluamVjdCA9IFsnJGh0dHAnXTtcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5zZXJ2aWNlKCdyb3V0ZXJTZXJ2aWNlJywgcm91dGVyU2VydmljZSk7XG5cblxuXHRmdW5jdGlvbiByb3V0ZXJTZXJ2aWNlKCRsb2NhdGlvbikge1xuXG5cdFx0dGhpcy5nZXRDdXJyZW50UGF0aCA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiAkbG9jYXRpb24ucGF0aCgpLnNwbGl0KCcvJykuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuXHRcdFx0XHRyZXR1cm4gISFlbDtcblx0XHRcdH0pO1xuXHRcdH07XG5cdFx0XG5cdFx0dGhpcy5zZXRDdXJyZW50UGF0aCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0aWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0cmV0dXJuICRsb2NhdGlvbi5wYXRoKHZhbHVlKTtcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcblx0XHRcdFx0cmV0dXJuICRsb2NhdGlvbi5wYXRoKCcvJyArIHZhbHVlLmpvaW4oJy8nKSk7XG5cdFx0XHR9XG5cdFx0fTtcblx0XHRcblx0fVxuXHRcblx0cm91dGVyU2VydmljZS4kaW5qZWN0ID0gWyckbG9jYXRpb24nXTtcbn0pKGFuZ3VsYXIubW9kdWxlKCdlY29tQXBwJykpOyIsIihmdW5jdGlvbiAoYXBwKSB7XG5cdGFwcC5jb250cm9sbGVyKCdob21lVmlld0N0cmwnLCBob21lVmlld0N0cmwpO1xuXG5cdGZ1bmN0aW9uIGhvbWVWaWV3Q3RybChkYXRhKSB7XG5cdFx0XG5cdFx0dGhpcy5kYXRhID0gZGF0YVxuXHRcdFxuXHR9XG5cdFxuXHRob21lVmlld0N0cmwuJGluamVjdCA9IFsnZGF0YSddO1xufSkoYW5ndWxhci5tb2R1bGUoJ2Vjb21BcHAnKSk7Il19
