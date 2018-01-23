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
        let peer;
        for (let key in CHANNELS) {
            let channel = CHANNELS[key];
            if (channel.hasPeer(peerId)) {
                peer = channel.getPeer(peerId);
                channel.removePeer(peerId);
            }
        }
        for (let key in TOPOLOGY) {
            let topology = TOPOLOGY[key];
            let parentPeerIds = topology.deleteNode(peer);
            console.log(`delete node parentPeerIds [${parentPeerIds}]`);
            if (peer && parentPeerIds.length) {
                for (let node of peer.children) {
                    let parentPeerId = parentPeerIds.shift();
                    console.log(`connect ${node.peerId} to ${parentPeerId}`)
                    if (parentPeerId === 'root') continue;

                    let msg = {
                        action: 'connect',
                        to_peer_id: parentPeerId
                    };
                    node.send(msg);
                }
            }
            console.log(JSON.stringify(topology.getGraph(), null, 2));
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
        case 'transition':
            handleTransition(message, websocket);
            break

    }
}

function handleTransition(message, websocket) {
    const res = {
        action: 'transition',
        success: true
    }
    var channel = CHANNELS[message.channel];
    const peerId = websocket.peerId;
    channel.getPeer(peerId).send(res);
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
}

function enterChannel(message, websocket) {

    //允许进入频道
    var peerId = peerIdGenerator();
    let peer = new Peer(peerId, websocket, message);
    websocket.peerId = peerId;
    peer.send({
        action: 'accept',
        peer_id: peerId
    });

    var channel = CHANNELS[message.channel];

    if (channel){

        channel.addPeer(peer);


        let topology = TOPOLOGY[message.channel];
        let remotePeerId = topology.addNode(peer);
        console.log(`remotePeerId ${remotePeerId}`);
        if (remotePeerId === 'root') return;
        let msg = {
            action: 'connect',
            to_peer_id: remotePeerId
        };
        peer.send(msg);

        console.log(JSON.stringify(topology.getGraph(), null, 2));

    } else {

        let channel = new Channel(message.channel, 'live');

        channel.addPeer(peer);
        CHANNELS[message.channel] = channel;

        //构造二叉拓扑结构
        let topology = new Topology('BinaryTree');
        TOPOLOGY[message.channel] = topology;

        //虚拟一个root节点
        let root = new Peer('root', null, {});
        topology.addNode(root);

        topology.addNode(peer);
    }

}

app.listen(3389);

console.log('Please open NON-SSL URL: http://localhost:3389/');


