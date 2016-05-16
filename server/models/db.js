var level = require('level');
var  db = level('./db', { valueEncoding: 'json'});

function generateQuantity(item){
	if (!item.quantity) {
		item.quantity = 1;
	} else {
		item.quantity += 1;
	}

}
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
function storeItems(item){
	return new Promise(function(res, rej){

		// if items object is not [Object object] - reject with error.
		if (typeof item === 'object' && item !== null && Object.prototype.toString(item) === '[Object object]') {
			rej({err: new TypeError('item object supplied should be an [Object object]')})
		}
		var items = null;


		db.put('items', items, function (err, items) {
			
			if (err) { 
				rej({failed: 'Could not get items Array', err: err})
			}
			
			res('items stored');
		});
	})
}

/**
 * @param cart {Array} - Array of cart objects
 * @returns {Promise | Array} .then if resolved returns cart Array
 */
function storeCart(item){
	
	return new Promise(function(res, rej){

		// if cart object is not [Object object] - reject with error.
		if (typeof item === 'object' && item !== null && Object.prototype.toString(item) === '[Object object]') {
			rej({err: new TypeError('item object supplied should be an [Object object]')})
		}

		function putFinalObjInCart(cart) {
			db.put('cart', cart, function (err, cart) {

				if (err) {
					rej({failed: 'Could not get cart Array', err: err})
				}
				
				res('cart stored');
			});
		}


		db.get('cart', function(err, cart){

			
			var index = cart.findIndex(function (el){
				return el.id === item.id;
			});
			
			if (index > -1) {
				generateQuantity(cart[index])
			} else {
				cart.push(item);
			}
			
			putFinalObjInCart(cart);
		});


	})
}




module.exports = {
	getItems: getItems,
	getCart: getCart,
	storeItems: storeItems,
	storeCart: storeCart
};
