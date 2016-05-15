(function (app) {
	app.controller('checkoutViewCtrl', checkoutViewCtrl);

	function checkoutViewCtrl(data) {
		console.log(data);
		
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

	checkoutViewCtrl.$inject = ['data'];
	
	
})(angular.module('ecomApp'));