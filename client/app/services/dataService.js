(function (app) {
	app.service('dataService', dataService);

	function dataService($http) {
		
		
		var cart = [],
			items = [];

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
		
		function storeInCart(item) {
			if (!item.quantity) {
				item.quantity = 1;
				cart.push(item);
			} else {
				item.quantity += 1;
			}
		}

		function getInCart() {
			return cart;
		}

		this.getData = getData;
		
		this.storeInCart = storeInCart;
		
		this.getInCart = getInCart;
	}

	dataService.$inject = ['$http'];
})(angular.module('ecomApp'));