var express = require('express'),
    app = express(),
    root = __dirname + '/../',
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    controllers = require('./controllers');


// assigning the listen port
app.set('port', (process.env.PORT || 8080));

app.use(express.static( root + 'client/'));

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(bodyParser.text());

// instantiate controllers with app * logger
controllers(app);



// initiate server on listen port
app.listen(app.get('port'), function (){
	console.log("server up on root: " + root.slice(0, -10) + " ; Listening on port: " + app.get('port') + ';');

});