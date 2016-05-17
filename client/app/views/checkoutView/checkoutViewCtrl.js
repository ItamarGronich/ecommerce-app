(function (app) {
	app.controller('checkoutViewCtrl', checkoutViewCtrl);

	function checkoutViewCtrl(data, dataService, $location) {
		this.data = data;


		this.formData = {};


		function submitForm(formData) {
			function camelToHyphen(string){
				return string.replace(/[A-Z]/, function (A) {
					return '-' + A.toLowerCase();
				});
			}
			
			var body = '';

			for (var key in formData) {
				body = body + ' ' + camelToHyphen(key) + ': ' + formData[key] + '; ';
			}
			
			dataService.storePurchase(body)
				.then(function(){
				$location.path('/purchase-successful');
			});
			
		}

		this.submitForm = submitForm;
	}

	checkoutViewCtrl.$inject = ['data', 'dataService', '$location'];
	
	
})(angular.module('ecomApp'));