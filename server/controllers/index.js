/**
 *require All controllers here and instantiate them in the function below
 *
 */

var dbCtrl = require('./dbCtrl.js');


module.exports = function(app){
	dbCtrl(app)
};