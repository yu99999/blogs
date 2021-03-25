---
title: 02 实现instanceof
date: 2021-1-19
categories:
 - JavaScript
tags:
 - JS API原理
---



1. 首先获得对象的原型
2. 然后获取构造函数的原型
3. 然后一直循环判断对象的原型是否等于类型的原型，直到对象原型为 `null`，因为原型链最终为 `null`

```js
function _instanceof(left, right){
  // 判断如果是基础类型直接返回false
  if((typeof left !== 'object' || left === null) && typeof left !== 'function')
    return false;
  // 获取对象的原型
  let leftProto = Object.getPrototypeOf(left);
  // 获取构造函数原型
  const rightProto = right.prototype;
  // 沿着原型链进行查找，原型链的顶端是null
  while(leftProto){
    if(leftProto === rightProto) 
      return true;
    leftProto = Object.getPrototypeOf(leftProto);
  }
  return false;
}
```

