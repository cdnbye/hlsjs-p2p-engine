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

var a = 5;
var b = 0;

function ff() {
    let i = 5;
    let t = 0;
    setInterval(function () {
        b = t/i;
        t = 0;
    }, i*1000);
    return v => {
        t += v;
    }
}

let fff = ff();
fff(10)
setTimeout(function () {
    fff(2)
},2000)
setTimeout(function () {
    console.log(b)
    fff(10)
    setTimeout(function () {
        console.log(b)
    },6000)
},6000)