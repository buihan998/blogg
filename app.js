var express = require('express');
var config = require('config');
var bodyParser = require('body-parser');
var session = require('express-session');
var socketio = require('socket.io');

var app = express();
var http = require('http').Server(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('trust proxy', 1);
app.use(session({
    secret: config.get('secret_key'),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.set('views', __dirname + "/apps/views");
app.set('view engine', 'ejs');

//satic folder
app.use('/static', express.static(__dirname + '/public'));

var controllerss = require(__dirname + '/apps/controllers');

app.use(controllerss);

var host = config.get('server.host');
var port = config.get('server.post');

var server = app.listen(port, host, function() {
    console.log("server is running on port: ", port);
});

var io = socketio(server);

var socketcontrol = require("./apps/common/socketcontrol")(io);

// http.listen(3000, function() {
//     console.log('listening on *:3000');
// });