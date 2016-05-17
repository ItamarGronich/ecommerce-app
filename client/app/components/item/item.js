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