/*
 EventEmitter.listeners(event)   //返回指定事件的监听数组
 参数1：event  字符串，事件名
 */
// var EventEmitter = require('events').EventEmitter;
// var ee = new EventEmitter();
// var listener = function(foo,bar)
// {
//     console.log("第1个监听事件,参数foo=" + foo + ",bar="+bar );
// }
// var listener2= function(foo,bar)
// {
//     console.log("第2个监听事件,参数foo=" + foo + ",bar="+bar );
// }
// ee.on('some_events', listener);
// ee.on('some_events', listener2);
// ee.on('other_events',function(foo,bar)
// {
//     console.log("其它监听事件,参数foo=" + foo + ",bar="+bar );
// });
//
// var listenerEventsArr = ee.listeners('some_events');
// console.log(listenerEventsArr.length)
// for (var i = listenerEventsArr.length - 1; i >= 0; i--) {
//     console.log(listenerEventsArr[i]);
// };
//
// let a=[1,2,3, 4, 5];
// [a[0], a[0]]=[a[0], a[0]];
//
// console.log(a)

// var a = 5;
// var b = 0;
//
// function ff() {
//     let i = 5;
//     let t = 0;
//     setInterval(function () {
//         b = t/i;
//         t = 0;
//     }, i*1000);
//     return v => {
//         t += v;
//     }
// }
//
// let fff = ff();
// fff(10)
// setTimeout(function () {
//     fff(2)
// },2000)
// setTimeout(function () {
//     console.log(b)
//     fff(10)
//     setTimeout(function () {
//         console.log(b)
//     },6000)
// },6000)

// let a = {
//     i:1
// },
//     b = {i:2};
// let channel = a;
// this.downstreamers = [a,b];
//
//
// // for (let i=0;i<this.downstreamers.length;++i){
// //     if (this.downstreamers[i] === channel) {
// //         this.downstreamers.splice(i, 1);
// //     }
// // }
//
// this.downstreamers = this.downstreamers.filter(i=>i!==channel)
//
// console.log(this.downstreamers)
//
// var sha1 = require('simple-sha1')
// console.log(sha1.sync('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8'))
//
// console.log('123'+`456`)

var BitSet = require('bitset');
//
// var bs = new BitSet;
// bs.setRange(1, 18, 1); //
// console.log(bs.toString()); // Print out a hex dump with one bit set
// bs.setRange(19, 19, 1); //
// console.log(bs.toString()); // Print out a hex dump with one bit set
// var bs2 = BitSet.fromHexString('ffffe');
// console.log(bs2.toString());
// console.log(bs2.cardinality());              //累加
// console.log(bs2.get(1))
//
// var bs3 = new BitSet;
// bs3.set(10,1);
// bs3.set(11,1);
// console.log(bs3.toString());

// var bs4 = new BitSet;
// bs4.set(3,1);
// bs4.set(1,1);
// // bs4.flip(0,bs4.msb());
// console.log(bs4.toString());
// var bs5 = new BitSet;
// bs5.set(0,1);
// bs5.set(2,1);
// bs5.set(3,1);
// console.log(bs5.toString());
// // var bs6 = bs4.xor(bs5);
// // console.log(bs6.toString());
// // console.log(bs6.get(3));
//
// var self = BitSet.fromBinaryString('10010111');
// var peer = BitSet.fromBinaryString('01011001');
//
// function difference(selfBs, peerBs) {                        //!!!!!!!!!!!!
//     var xor = selfBs.xor(peerBs);
//     var flip = selfBs.flip(0,selfBs.msb());
//     return xor.and(flip);
// }
//
// console.log(difference(self,peer).toString());
//
//
// var FastBitSet = require('fastbitset');
// var b = new FastBitSet();// initially empty
// b.add(1);// add the value "1"
// b.has(1); // check that the value is present! (will return true)
// b.add(2);
// b.add(4);
// console.log(b.toString());// should display {1,2}
// var c = new FastBitSet([15, 1,2,3,10]); // create bitset initialized with values 1,2,3,10
// c.difference(b); // from c, remove elements that are in b
// c.trim();
// console.log(c.array());// should display {1,2}
// console.log(c.has(9));// should display {1,2}

let m = new Map();
m.set(2,8);
m.set(0,7);
m.set(3,0);
console.log([...m.entries()].slice(0,6))
console.log([1,3].includes(2))