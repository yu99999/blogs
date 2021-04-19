---
title: 09 实现数组reduce方法
date: 2021-02-05
categories:
 - JavaScript
tags:
 - JS API原理
---



根据 [ECMA 中规定的 reduce 标准](https://tc39.es/ecma262/#sec-array.prototype.reduce)，以及 [V8 reduce 源码](https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/typedarray.js#L546)。我们便可以实现数组中的 reduce 方法

<img src="@img/image-20210220125208342.png" alt="image-20210220125208342" style="zoom:80%;" />

关于 reduce，有几个关键点需要注意

1. 初始值不传的时候，会将初始值设置为数组的第一个值
2. 累加器和 callback 的传值处理

```js
Array.prototype._reduce = function(callback, initialValue){
  // 处理数组类型异常
  if(this === null || this === undefined){
    throw new TypeError("Cannot read property 'map' of null");
  }
  var arr = Object(this);
  var len = arr.length >>> 0;
  // 处理回调函数异常
  if(Object.prototype.toString.call(callback) !== "[object Function]"){
    throw new TypeError(callbackfn + " is not a function");
  }
  var accumulator = initialValue;
  var i = 0;
  findInital: if(accumulator === undefined){  // 初始值不传，将初始值设置为数组的第一个值
    for(; i<len; i++){
      if(i in arr){
        accumulator = arr[i++];
        break findInital;
      }
    }
    // 若数组为空，抛出错误
    throw new Error('Reduce of empty array with no initial value');
  }

  for(; i<len; i++){
    // 依次传入 累加值、当前值、下标、数组
    accumulator = callback(accumulator, arr[i], i, arr);
  }
  return accumulator;
}
```

