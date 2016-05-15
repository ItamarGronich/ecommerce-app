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