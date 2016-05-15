(function (app) {
	app.controller('cartViewCtrl', cartViewCtrl);

	function cartViewCtrl(data) {
		this.data = data;

		function totalPrice() {
			var count = 0;
			data.forEach(function (e) {
				count += e.price * e.quantity;
				console.log('quantity ' + e.quantity);
				
			});
			return count;
		}

		this.totalPrice = totalPrice;
	}


	cartViewCtrl.$inject = ['data'];
	
})(angular.module('ecomApp'));