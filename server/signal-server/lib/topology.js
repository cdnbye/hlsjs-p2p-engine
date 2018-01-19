/**
 * Created by xieting on 2018/1/18.
 */

/*
    type: BinaryTree Chain
    limit: 最大层数
 */

const log = console.log;

class Topology {
    constructor(type, limit) {

        this.hierarchy = new Map();              //<class, Array<Peer>>
        // this.currLevel = 0;                      //目前最大层数
    }

    addNode(peer) {
        if (this.hierarchy.get(0) && this.hierarchy.get(0).length > 0) {              //如果第一层有节点
            for (let [level, layer] of this.hierarchy.entries()) {             //遍历整棵树，如果有子节点没满的则加进去
                // console.log(`iterate level ${level} nodes ${layer.length}`);
                for (let node of layer) {
                    log(`node ${node.peerId} childNum ${node.childNum} parentNum ${node.parentNum} class ${node.class}`);
                    if(node.childNum < 2) {
                        node.childNum ++;                                      //先在网络中占位
                        node.children.push(peer);
                        peer.parentNum ++;
                        peer.parents.push(node);
                        peer.class = level+1;
                        let newLayer = this.hierarchy.get(level+1);
                        if (!newLayer) {
                            newLayer = [peer];
                            this.hierarchy.set(level+1, newLayer);
                        } else {
                            newLayer.push(peer);
                        }
                        return node.peerId;                                  //返回父节点的id
                    }
                }
            }
        } else {
            let layer = [peer];
            peer.class = 0;
            peer.parentNum = 0;
            peer.childNum = 0;
            this.hierarchy.set(0, layer);
            return false;
        }

    }

    deleteNode(peer) {
        let parentIds = [];
        for (let [level, layer] of this.hierarchy.entries()) {             //遍历整棵树，如果有子节点没满的则加进去
            // console.log(`iterate level ${level} nods ${layer.length}`);
            for (let node of layer) {
                if(node === peer) {

                    peer.parents.map(parent => {
                        parent.children.splice(parent.children.findIndex(item => item.peerId === peer.peerId), 1);
                        parent.childNum --;
                    });

                    peer.children.map(child => {
                        child.parents.splice(child.parents.findIndex(item => item.peerId === peer.peerId), 1);
                        child.parentNum --;
                        // log(`layer ${level} splice ${child.peerId}`)
                        let nextLayer = this.hierarchy.get(level+1);
                        nextLayer.splice(nextLayer.findIndex(item => item.peerId === child.peerId), 1);
                        parentIds.push(this.addNode(child));
                        // child.parents.push(peer.parents[0]);
                        // peer.parents[0].children.push(child);
                        // peer.parents[0].childNum ++;
                    });
                    // peer.children = [];


                    // peer.parents = [];

                    layer.splice(layer.findIndex(item => item === peer), 1);
                    return parentIds;                                           //返回可以连接的父节点的id数组
                }
            }
        }
        return parentIds;
    }

    getGraph() {
        let graph = [];
        for (let [level, layer] of this.hierarchy.entries()) {             //遍历整棵树，如果有子节点没满的则加进去
            // console.log(`iterate level ${level} nodes ${layer.length}`);
            graph[level] = [];
            for (let node of layer) {
                // log(`node ${node.peerId} childNum ${node.childNum} parentNum ${node.parentNum} class ${node.class}`);
                let peerObject = {
                    peerId: node.peerId,
                    childNum: node.childNum,
                    parentNum: node.parentNum,
                    class: node.class,

                };
                graph[level].push(peerObject);
            }
        }
        return graph;
    }
}

module.exports = Topology;

// var t = new Topology();
//
// let p1 = {
//     peerId : '1',
//
//
//     class : 0,
//     parentNum : 0,
//     childNum : 0,
//     parents : [],
//     children : [],
//
//     level : 0
// }
// let p2 = {
//     peerId : '2',
//
//
//     class : 0,
//     parentNum : 0,
//     childNum : 0,
//     parents : [],
//     children : [],
//
//     level : 0
// }
// let p3 = {
//     peerId : '3',
//
//
//     class : 0,
//     parentNum : 0,
//     childNum : 0,
//     parents : [],
//     children : [],
//
//     level : 0
// }
// let p4 = {
//     peerId : '4',
//
//
//     class : 0,
//     parentNum : 0,
//     childNum : 0,
//     parents : [],
//     children : [],
//
//     level : 0
// }
// let p5 = {
//     peerId : '5',
//
//
//     class : 0,
//     parentNum : 0,
//     childNum : 0,
//     parents : [],
//     children : [],
//
//     level : 0
// }
// let p6 = {
//     peerId : '6',
//
//
//     class : 0,
//     parentNum : 0,
//     childNum : 0,
//     parents : [],
//     children : [],
//
//     level : 0
// }
// let p7 = {
//     peerId : '7',
//
//
//     class : 0,
//     parentNum : 0,
//     childNum : 0,
//     parents : [],
//     children : [],
//
//     level : 0
// }
// let p8= {
//     peerId : '8',
//
//
//     class : 0,
//     parentNum : 0,
//     childNum : 0,
//     parents : [],
//     children : [],
//
//     level : 0
// }
// let p9 = {
//     peerId : '9',
//
//
//     class : 0,
//     parentNum : 0,
//     childNum : 0,
//     parents : [],
//     children : [],
//
//     level : 0
// }
//
// console.log(`${p1.peerId} 父节点 ${t.addNode(p1)}`);
// console.log(`${p2.peerId} 父节点 ${t.addNode(p2)}`);
// console.log(`${p3.peerId} 父节点 ${t.addNode(p3)}`);
// console.log(`${p4.peerId} 父节点 ${t.addNode(p4)}`);
// console.log(`${p5.peerId} 父节点 ${t.addNode(p5)}`);
// console.log(`${p2.peerId} 删除后 父节点 ${t.deleteNode(p2)}`);
// console.log(`${p3.peerId} 删除后 父节点 ${t.deleteNode(p3)}`);
// console.log(`${p6.peerId} 父节点 ${t.addNode(p6)}`);
// console.log(`${p7.peerId} 父节点 ${t.addNode(p7)}`);
// console.log(`${p8.peerId} 父节点 ${t.addNode(p8)}`);
// console.log(`${p1.peerId} 删除后 父节点 ${t.deleteNode(p1)}`);
// console.log(`${p9.peerId} 父节点 ${t.addNode(p9)}`);