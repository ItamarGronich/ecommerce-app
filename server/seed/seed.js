// get the levelDB setup function
var level = require('level'),

    // create a new DB / get existing DB in path: '/server/db'
	db = level('../db', { valueEncoding: 'json'}),

    // get access to file system
	fs = require('fs'),

    // retrieve the 'items' array from items.json
	items = fs.readFile('./items.json', 'json', function (err, items) {
		if (err) { console.log('problem reading items.json', err); return err;}

		return items;
	});


// input items array in DB
db.put('items', items, function (err) {
	
	if (err) {
		console.log('problem putting items Array in DB', err);
		return err;
	} else {
		
		console.log(
			'successfully seeded DB with items Array:', 
			JSON.stringify(
				db.get('items', function (err, items) {
					return items;
				})
			)
		);
		
		return db.get('items', function (err, items) {
			return items;
		});
	}
});



// input Cart as an empty array in DB
db.put('cart', [], function (err) {

	if (err) {
		console.log('problem putting cart Array in DB', err);
		return err;
	} else {

		console.log(
			'successfully seeded DB with empty cart Array:',
			JSON.stringify(
				db.get('cart', function (err, cart) {
					return cart;
				})
			)
		);

		return db.get('cart', function (err, cart) {
			return cart;
		});
	}
});
