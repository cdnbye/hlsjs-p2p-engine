/**
 * Created by xieting on 2018/1/18.
 */

/*
    type: BinaryTree Chain
    limit: 最大层数
 */

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
        for (let [level, layer] of this.hierarchy.entries()) {             //遍历整棵树，如果有子节点没满的则加进去
            console.log(`iterate level ${level} nods ${layer.length}`);
            for (let node of layer) {
                if(node === peer) {

                    peer.children.map(child => {
                        child.parents.splice(child.parents.findIndex(item => item.peerId === peer.peerId), 1);
                    });
                    peer.children = [];

                    node.parents.map(parent => {
                        parent.children.splice(parent.children.findIndex(item => item.peerId === peer.peerId), 1);
                    });
                    node.parents = [];

                    layer.splice(layer.findIndex(item => item === peer), 1);
                    break
                }
            }
        }
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
//
// console.log(t.addNode(p1));
// console.log(t.addNode(p2));
// console.log(t.addNode(p3));
// console.log(t.addNode(p4));
// console.log(t.addNode(p5));
// console.log(t.addNode(p6));