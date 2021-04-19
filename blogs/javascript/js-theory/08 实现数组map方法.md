---
title: 08 实现数组map方法
date: 2021-2-4
categories:
 - JavaScript
tags:
 - JS API原理
---



根据 [ECMA 中规定的 map 标准](https://tc39.es/ecma262/#sec-array.prototype.map)，以及 [V8 map 源码](https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/array.js#L1036)。我们便可以实现数组中的 map 方法

<img src="@img/image-20210220010508872.png" alt="image-20210220010508872" style="zoom:80%;" />

```js
Array.prototype._map = function(callback, thisArg){
  // 处理数组类型异常
  if(this === null || this === undefined){
    throw new TypeError("Cannot read property 'map' of null");
  }
  var arr = Object(this);           // 1.转为对象
  var len = arr.length >>> 0;       // 2.获取数组长度
  // 3.处理回调函数异常
  if(Object.prototype.toString.call(callback) !== "[object Function]"){
    throw new TypeError(callbackfn + " is not a function");
  }

  var result = new Array(len);      // 4.创建新数组
  for(let i=0; i<len; i++){         // 5.设置下标
    // 即使元素在原型链上也能查找
    if(i in arr){
      var ele = arr[i];
      // 6.依次传入this, 当前项，当前索引，整个数组
      var mapVal = callback.call(thisArg, ele, i, arr);
      result[i] = mapVal
    }
  }

  return result;  // 7.返回新数组
}
```

