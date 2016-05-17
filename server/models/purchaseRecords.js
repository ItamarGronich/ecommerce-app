module.exports = function (db) {
	
	function getPurchaseRecords(){
		return new Promise(function (resolve, reject) {
			db.get('purchaseRecords', function(err, entry){
				console.log('entry: ', entry);
				
				if (err) { reject(err) }

				resolve(entry);
			});
		});
	}

	function storeInPurchases(data) {
		console.log('data recieved by store in p', data);
		
		return getPurchaseRecords()
			.then(function (purchaseRecords) {
				console.log('got from db: ',purchaseRecords);
				
				purchaseRecords.push(data);
				return purchaseRecords;
			})
			.then(function (newPurchaseRecords) {

				console.log('new data to be put: ', newPurchaseRecords);
				
				return new Promise(function (resolve, reject) {
					db.put('purchaseRecords', newPurchaseRecords, function (err) {
						if (err) { reject(err) }
						
						resolve();
					})
				})
			})
			.then(getPurchaseRecords);
	}


	return {
		storeInPurchases: storeInPurchases,
		getPurchaseRecords: getPurchaseRecords
	}
};