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