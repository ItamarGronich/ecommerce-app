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