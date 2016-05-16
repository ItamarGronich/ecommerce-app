var level = require('level'),
    db = level('../db', { valueEncoding: 'json'});


/**
 * 
 * @returns {Promise | Array} .then if resolved returns items Array
 */
function getItems(){
	return new Promise(function(res, rej){
		db.get('items', function (err, items) {
			
			if (err) { 
				rej({failed: 'Could not get items Array', err: err})
			}
			
			res(items);
		});
	})
}

/**
 *
 * @returns {Promise | Array} .then if resolved returns cart Array
 */
function getCart(){
	return new Promise(function(res, rej){
		db.get('cart', function (err, cart) {
			
			if (err) { 
				rej({failed: 'Could not get cart Array', err: err})
			}
			
			res(cart);
		});
	})
}


/**
 * @param items {Array} - Array of item objects
 * @returns {Promise | Array} .then if resolved returns items Array
 */
function storeItems(items){

	// if items object is not array - reject with error.
	if (!Array.isArray(items)) {rej({err: new TypeError('items object supplied should be an array')})}
	
	
	return new Promise(function(res, rej){
		db.put('items', items, function (err, items) {
			
			if (err) { 
				rej({failed: 'Could not get items Array', err: err})
			}
			
			res(items);
		});
	})
}

/**
 * @param cart {Array} - Array of cart objects
 * @returns {Promise | Array} .then if resolved returns cart Array
 */
function storeCart(cart){
	return new Promise(function(res, rej){
		
		// if cart object is not array - reject with error.
		if (!Array.isArray(cart)) {rej({err: new TypeError('cart object supplied should be an array')})}
		
		db.put('cart', cart, function (err, cart) {
			
			if (err) { 
				rej({failed: 'Could not get cart Array', err: err})
			}
			
			res(cart);
		});
	})
}




module.exports = {
	getItems: getItems,
	getCart: getCart,
	storeItems: getItems,
	storeCart: getCart
};
