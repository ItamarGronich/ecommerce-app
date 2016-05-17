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
	app.post('/items', function (req, res) {

		
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



	// when store cart is called
	app.post('/cart', function (req, res) {
		
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

	// when delte item from cart is called
	app.delete('/cart/:itemId', function (req, res) {
		var itemId = req.params.itemId;

		//delete from cart
		dbModel.deleteFromCart(itemId)
			.then(
				function(cart){
					res.send(cart);
				},
				function (err) {
					res.status(500).send(err);
				});
	});


	// when store purchaseRecords is called
	app.post('/purchase-records/', function (req, res) {
		console.log('body: ' , req.body);
		
		//store cart
		dbModel
			.purchaseRecords
			.storeInPurchases(req.body)
			.then(
				function(success){
					res.send(success);
				},
				function (err) {
					res.status(500).send(err);
				});
	});

	// when get purchaseRecords is called
	app.get('/purchase-records', function (req, res) {

		//get items
		dbModel
			.purchaseRecords
			.getPurchaseRecords()
			.then(
				// on resolve - send success message
				function(purchaseRecords){
					res.send(purchaseRecords);
				},
				// on error send status code 500 and the error
				function (err) {
					res.sendStatus(500);
				});
	});

};


