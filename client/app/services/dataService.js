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