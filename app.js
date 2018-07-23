var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var renderer = require('./routes/index');
var login_render = require('./routes/login_route');
var user_render = require('./routes/user_route');
var store_render = require('./routes/store_route');
var barang_render = require('./routes/barang_route');
var cors = require('cors');

app.use(cors());
app.use(compress()); 
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', renderer);
app.use('/api/login', login_render);
app.use('/api/user', user_render);
app.use('/api/store', store_render);
app.use('/api/barang', barang_render);

app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    var html = '<!DOCTYPE html>';
    html+= '<html>';
    html+= '  <head>';
    html+= '    <title></title>';
    html+= '  </head>';
    html+= '  <body>';
    html+= '    <h1>'+err.message+'</h1>';
    html+= '    <h2>'+err.status+'</h2>';
    html+= '    <h2>More information: ahendroo1@gmail.com</h2>';
    html+= '    <pre>'+err.stack+'</pre>';
    html+= '  </body>';
    html+= '</html>';
    res.send(html);
}); 

module.exports = app;
