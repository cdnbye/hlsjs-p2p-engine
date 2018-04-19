/**
 * Created by xieting on 2018/4/17.
 */
var fs = require('fs');
var _static = require('node-static');
var file = new _static.Server('./public');
const url = require("url");

// HTTP server
var app = require('http').createServer(function(request, response) {
    request.addListener('end', function() {
        file.serve(request, response);
    }).resume();
});

var WebSocketServer = require('websocket').server;

new WebSocketServer({
    httpServer: app,
    autoAcceptConnections: false
}).on('request', onRequest);

function onRequest(socket) {
    var origin = socket.origin + socket.resource;
    console.log(origin);
    var websocket = socket.accept(null, origin);

    //在websocket加上room属性
    websocket.room = url.parse(origin, true).query.info_hash;
    websocket.room = url.parse(websocket.room).hostname;

    websocket.on('message', function(message) {

        if (message.type === 'utf8') {
            var msg = `ip ${socket.remoteAddress} ` + message.utf8Data;
            onMessage(msg, websocket);
        }
    });

    websocket.on('close', function() {
        console.log('delete node: ' + websocket.peerId);
    });
}

app.listen(3389);

console.log('Please open NON-SSL URL: http://localhost:3389/');

function onMessage(message, websocket) {

    console.log(`onMessage ${message}`);
    const room = websocket.room ? websocket.room : 'others';
    const filename = `./logs/${room}`;
    fs.appendFileSync(filename, message + '\n');
}