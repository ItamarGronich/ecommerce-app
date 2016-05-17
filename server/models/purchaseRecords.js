module.exports = function (db) {
	
	function getPurchaseRecords(){
		return new Promise(function (resolve, reject) {
			db.get('purchaseRecords', function(err, entry){
				
				if (err) { reject(err) }

				resolve(entry);
			});
		});
	}

	function storeInPurchases(data) {
		return getPurchaseRecords()
			.then(function (purchaseRecords) {
				var now = new Date().toUTCString();
				purchaseRecords.push('time: ' + now + '; ' + data);
				return purchaseRecords;
			})
			.then(function (newPurchaseRecords) {

				return new Promise(function (resolve, reject) {
					db.put('purchaseRecords', newPurchaseRecords, function (err) {
						if (err) { reject(err) }
						
						resolve();
					})
				})
			})
			.then(function () {
				 return getPurchaseRecords()
					 .then(function (arr) {
						 return arr[ (arr.length -1 ) ];
					 });
				
				
			});
	}


	return {
		storeInPurchases: storeInPurchases,
		getPurchaseRecords: getPurchaseRecords
	}
};