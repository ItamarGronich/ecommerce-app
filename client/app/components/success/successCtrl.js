(function (app) {
	app.controller('successCtrl', successCtrl);


	function successCtrl($scope, $rootScope, $timeout) {
		var state = true;

		function close() {
			state = false;
		}

		function open(){
			state = true;
		}

		function isShown(){
			return state;
		}


		$scope.isShown = isShown;

		$scope.close = close;
	}


	successCtrl.$inject = ['$scope', '$rootScope', '$timeout'];
})(angular.module('ecomApp'));