/**
 * Created by xieting on 2018/1/4.
 *
 * 二叉树拓扑结构
 *
 *
 */



var fs = require('fs');
var peerIdGenerator = require('./lib/peerid-generator');
var _static = require('node-static');
var file = new _static.Server('./public');

let Channel = require('./lib/channel');
let Peer = require('./lib/peer');
let Topology = require('./lib/topology');

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
var TOPOLOGY = { };

function onRequest(socket) {
    var origin = socket.origin + socket.resource;

    var websocket = socket.accept(null, origin);

    websocket.on('message', function(message) {

        if (message.type === 'utf8') {
            var msg = JSON.parse(message.utf8Data);
            if (msg.action !== 'signal') console.log('on message: ' + message.utf8Data);          //不打印signal
            onMessage(msg, websocket);
        }
    });

    websocket.on('close', function() {
        console.log('delete node: ' + websocket.peerId);
        // truncateChannels(websocket);                                 //将该节点从频道中删除
        let peerId = websocket.peerId;
        for (let key in CHANNELS) {
            let channel = CHANNELS[key];
            if (channel.hasPeer(peerId)) {
                channel.removePeer(peerId);
            }
        }
        for (let key in TOPOLOGY) {
            let topology = TOPOLOGY[key];
            topology.deleteNode(peerId);
        }
    });
}

function onMessage(message, websocket) {

    let action = message.action;

    switch (action) {

        case 'enter':
            enterChannel(message, websocket);
            console.log("peer enter channel: " + message.channel);
            break;
        case 'signal':
            handleSignal(message);
            break;

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
    if (channel.hasPeer(message.to_peer_id)) {
        let remotePeer = channel.getPeer(message.to_peer_id);
        let msg = {
            action: 'signal',
            from_peer_id: message.peer_id,
            data: message.data
        };
        remotePeer.send(msg);
    }
    // for (var i = 0; i < channel.length; i++) {
    //     if (channel[i] && channel[i].peerId === message.to_peer_id) {
    //         try {
    //             //console.log('message.data' + message.data);
    //             // console.log("sendMessageToPeer");
    //             let msg = {
    //                 action: 'signal',
    //                 from_peer_id: message.peer_id,
    //                 data: message.data
    //             };
    //             channel[i].sendUTF(JSON.stringify(msg));
    //             break;
    //         } catch(e) {
    //         }
    //     }
    // }
}

function enterChannel(message, websocket) {

    //允许进入频道
    var peerId = peerIdGenerator();
    let peer = new Peer(peerId, websocket, message);
    websocket.peerId = peerId;
    websocket.sendUTF(JSON.stringify({
        action: 'accept',
        peer_id: peerId
    }));

    var channel = CHANNELS[message.channel];

    if (channel){

        channel.addPeer(peer);

        //构造二叉拓扑结构
        let topology = TOPOLOGY[message.channel];
        let remotePeerId = topology.addNode(peer);
        console.log(`remotePeerId ${remotePeerId}`);
        let msg = {
            action: 'connect',
            to_peer_id: remotePeerId
        };
        peer.send(msg);

        // let length = channel.peerNum;
        // if (length === 2) {
        //     channel[0].sendUTF(JSON.stringify({
        //         action: 'connect',
        //         to_peer_id: channel[1].peerId,
        //         initiator: false
        //     }));
        //     channel[1].sendUTF(JSON.stringify({
        //         action: 'connect',
        //         to_peer_id: channel[0].peerId,
        //         initiator: true
        //     }));
        // }
        // if (length === 3) {
        //     channel[0].sendUTF(JSON.stringify({
        //         action: 'connect',
        //         to_peer_id: channel[2].peerId,
        //         initiator: false
        //     }));
        //     channel[2].sendUTF(JSON.stringify({
        //         action: 'connect',
        //         to_peer_id: channel[0].peerId,
        //         initiator: true
        //     }));
        // }


    } else {

        let channel = new Channel(message.channel, 'live');

        channel.addPeer(peer);
        CHANNELS[message.channel] = channel;

        let topology = new Topology();
        TOPOLOGY[message.channel] = topology;
        topology.addNode(peer);
    }

}

function swapArray(arr) {
    var swapped = [],
        length = arr.length;
    for (var i = 0; i < length; i++) {
        if (arr[i])
            swapped[swapped.length] = arr[i];
    }
    return swapped;
}

function truncateChannels(websocket) {
    for (var channel in CHANNELS) {
        var _channel = CHANNELS[channel];
        for (var i = 0; i < _channel.length; i++) {
            if (_channel[i] == websocket)
                delete _channel[i];
        }
        CHANNELS[channel] = swapArray(_channel);
        if (CHANNELS && CHANNELS[channel] && !CHANNELS[channel].length)
            delete CHANNELS[channel];
    }
}

app.listen(3389);

console.log('Please open NON-SSL URL: http://localhost:3389/');


