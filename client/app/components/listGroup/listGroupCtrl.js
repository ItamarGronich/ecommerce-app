(function (app) {

	app.controller('listGroupCtrl', listGroupCtrl);


	function listGroupCtrl($scope) {

		this.data = $scope.data;
		
	}

	listGroupCtrl.$inject = ['$scope'];

})(angular.module('ecomApp'));