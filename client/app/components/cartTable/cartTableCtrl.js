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