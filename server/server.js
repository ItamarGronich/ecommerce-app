var express = require('express'),
    app = express(),
    root = __dirname + '/../';


app.set('port', (process.env.PORT || 8080));

app.use(express.static( root + 'client/'));

app.listen(app.get('port'), function () {
	console.log('server listening on port ' + app.get('port'));
});