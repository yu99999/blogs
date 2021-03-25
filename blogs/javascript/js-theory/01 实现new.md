---
title: 01 实现new
date: 2021-1-18
categories:
 - JavaScript
tags:
 - JS API原理
---



在实现一个new之前要先了解到一点，如果构造函数有返回值并且返回值是一个引用数据类型的话，new创建出来的是构造函数的返回值，而不是实例对象。如下面这样

```js
function Parent(){
  return {a: 1}
}

console.log(new Parent())	// {a: 1}
```

根据这点，我们可以用下面的方式实现 new：

1. 生成一个新对象
2. 链接原型
3. 修改构造函数this指向，并执行构造函数
4. 返回函数的返回值或新创建的对象

```js
function _new(Ctor, ...args){
  if(typeof Ctor !== 'function')
    throw new Error('这不是函数')

  function isObjectType(target){
    return (typeof target === 'object' && target !== null) || typeof target === 'function'
  }

  const obj = {};
  obj.__proto__ = Ctor.prototype;
  const res = Ctor.apply(obj, args);
  return isObjectType(res) ? res : obj;
}
```

