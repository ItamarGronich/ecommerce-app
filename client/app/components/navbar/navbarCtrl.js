(function (app, $) {


	app.controller('navbarCtrl', navbarController);

	function navbarController(routerService, $rootScope) {

		var $links = $( '#navbarLinks').find('a');

		$rootScope.$onRootScope('$routeChangeStart', renderState);

		function renderState() {
			console.log('FIRED');
			
			var path = routerService.getCurrentPath()[0];


			$links.each(function () {
				var $el = $( this ),
				    isElement = $el.text().toLowerCase() === path;


				$el.parent().toggleClass('active', isElement);

			});


		}



		function changeTabs(event) {
			routerService.setCurrentPath('/' + event.target.textContent.toLowerCase() + '/');
		}

		this.changeTabs = changeTabs;



	}

	navbarController.$inject = ['routerService', '$rootScope'];


})(angular.module('ecomApp'), jQuery);