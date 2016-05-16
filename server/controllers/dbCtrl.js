module.exports = function (app) {
	
	// the database model. each method returns a promise
	var dbModel = require('../models').db;
	
	// when get items is called
	app.get('/items', function (req, res) {
		
		//get items
		dbModel.getItems()
			.then(
				// on resolve - send success message
			function(items){
				res.send(items);
			},
				// on error send status code 500 and the error
			function (err) {
				res.status(500).send(err);
			});
	});

	// when get cart is called
	app.get('/cart', function (req, res) {
		dbModel.getCart()
			.then(
				function(cart){
					res.send(cart);
				},
				function (err) {
					res.status(500).send(err);
				});
	});


	// when store items is called
	app.put('/items', function (req, res) {
		
		//store items
		dbModel.storeItems(req.body)
			.then(
				// on resolve - send success message
				function(success){
					res.send(success);
				},
				// on error send status code 500 and the error
				function (err) {
					res.status(500).send(err);
				});
	});



	// when store items is called
	app.put('/cart', function (req, res) {

		//store cart
		dbModel.storeCart(req.body)
			.then(
				function(success){
					res.send(success);
				},
				function (err) {
					res.status(500).send(err);
				});
	});


};