---
title: 06 实现数组push、pop方法
date: 2021-2-3
categories:
 - JavaScript
tags:
 - JS API原理
---



## push 实现

根据 [ECMA 中规定的 push 标准](https://tc39.es/ecma262/#sec-array.prototype.push)，以及 [V8 push 源码](https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/array.js#L414)。我们便可以实现数组中的 push 方法

<img src="@img/image-20210220002954067.png" alt="image-20210220002954067" style="zoom:80%;" />

```js
Array.prototype._push = function(){
  var arr = Object(this);           // 1.转为对象
  var len = arr.length >>> 0;       // 2.获取数组长度
  var argCount = arguments.length;  // 3.获取参数长度

  if(len + argCount > 2**53-1){     // 4.超出最大限度
    throw new TypeError("The number of array is over the max value restricted!")
  }

  for(var i=0; i<argCount; i++){    // 5.将参数添加到数组中
    arr[len + i] = arguments[i];
  }
  var newLength = len + argCount;
  arr.length = newLength;           // 6.更新数组长度
  return newLength;   // 7.返回数组长度
}
```



## pop 实现

根据 [ECMA 中规定的 pop 标准](https://tc39.es/ecma262/#sec-array.prototype.pop)，以及 [V8 pop 源码](https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/array.js#L394)。我们也可以实现数组中的 pop 方法

<img src="@img/image-20210220005502959.png" alt="image-20210220005502959" style="zoom:80%;" />

```js
Array.prototype._pop = function(){
  var arr = Object(this);           // 1.转为对象
  var len = arr.length >>> 0;       // 2.获取数组长度
  if(len === 0){    				// 3.如果长度为0不做改动
    arr.length = len
    return;
  }

  len--;
  var value = arr[len];
  delete arr[len];
  arr.length = len;
  return value;    					// 4.返回被删除元素
}
```

