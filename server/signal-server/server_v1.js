/**
 * Created by xieting on 2018/1/4.
 */

var fs = require('fs');

var _static = require('node-static');
var file = new _static.Server('./public');

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

// shared stuff

var CHANNELS = { };

function onRequest(socket) {
    var origin = socket.origin + socket.resource;

    var websocket = socket.accept(null, origin);

    websocket.on('message', function(message) {

        if (message.type === 'utf8') {
            console.log('on message: ' + message.utf8Data);
            onMessage(JSON.parse(message.utf8Data), websocket);
        }
    });

    // websocket.on('close', function() {
    //     truncateChannels(websocket);
    // });
}

function onMessage(message, websocket) {

    let action = message.action;

    switch (action) {

        case 'enter':
            websocket.peerId = message.peer_id;
            enterChannel(message, websocket);
            console.log("peer enter channel: " + message.channel);
            break;
        case 'signal':
            handleSignal(message);

    }

    // if (message.enter)
    // {
    //     enterChannel(message, websocket);
    //     console.log("peer enter channel: " + message.channel);
    // }
    // else if (message.open)
    // {
    //     onOpen(message, websocket);
    //     console.log("onOpen");
    // }
    // else
    // {
    //     sendMessage(message, websocket);
    //     //console.log("sendMessage");
    // }
}

function handleSignal(message) {
    var channel = CHANNELS[message.channel];
    for (var i = 0; i < channel.length; i++) {
        if (channel[i] && channel[i].peerId === message.to_peer_id) {
            try {
                //console.log('message.data' + message.data);
                // console.log("sendMessageToPeer");
                let msg = {
                    action: 'signal',
                    from_peer_id: message.peer_id,
                    data: message.data
                };
                channel[i].sendUTF(JSON.stringify(msg));
                break;
            } catch(e) {
            }
        }
    }
}

function enterChannel(message, websocket) {

    //允许进入频道
    websocket.sendUTF(JSON.stringify({
        action: 'accept'
    }));

    var channel = CHANNELS[message.channel];

    if (channel){

        CHANNELS[message.channel][channel.length] = websocket;

        //test
        channel[0].sendUTF(JSON.stringify({
            action: 'connect',
            to_peer_id: channel[1].peerId,
            initiator: false
        }));
        channel[1].sendUTF(JSON.stringify({
            action: 'connect',
            to_peer_id: channel[0].peerId,
            initiator: true
        }));

    } else {
        CHANNELS[message.channel] = [websocket];
    }

}

app.listen(12034);

console.log('Please open NON-SSL URL: http://localhost:12034/');

var topology = [
    []
]