// get the levelDB setup function
var level = require('level'),

    // create a new DB / get existing DB in path: '/server/db'
	db = level('./db', { valueEncoding: 'json'}),

    // get access to file system
	fs = require('fs'),

    // retrieve the 'items' array from items.json
	items =  fs.readFileSync('./server/seed/items.json', 'utf8');

// output colors to the console
var colors = require('colors/safe');




// input items array in DB
db.put('items', items, function (err) {
	
	if (err) {
		console.log(colors.red('problem putting items Array in DB', err));
		return err;
	} else {

		new Promise(function(res, rej){
			db.get('items', function (err, items) {
				res(items);
			})
		}).then(function(items){
			console.log(
				colors.green('successfully seeded DB with items Array:'),
				items

			);
		});

	}
});



// input Cart as an empty array in DB
db.put('cart', [], function (err) {

	if (err) {
		console.log(colors.red('problem putting cart Array in DB', err));
		return err;
	} else {


		new Promise(function(res, rej){
			db.get('cart', function (err, cart) {
				res(cart);
			})
		}).then(function(cart){
			console.log(
				colors.green('successfully seeded DB with cart Array:'),
				cart

			);
		});

	}
});
