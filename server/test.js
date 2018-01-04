/*
 EventEmitter.listeners(event)   //返回指定事件的监听数组
 参数1：event  字符串，事件名
 */
var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();
var listener = function(foo,bar)
{
    console.log("第1个监听事件,参数foo=" + foo + ",bar="+bar );
}
var listener2= function(foo,bar)
{
    console.log("第2个监听事件,参数foo=" + foo + ",bar="+bar );
}
ee.on('some_events', listener);
ee.on('some_events', listener2);
ee.on('other_events',function(foo,bar)
{
    console.log("其它监听事件,参数foo=" + foo + ",bar="+bar );
});

var listenerEventsArr = ee.listeners('some_events');
console.log(listenerEventsArr.length)
for (var i = listenerEventsArr.length - 1; i >= 0; i--) {
    console.log(listenerEventsArr[i]);
};