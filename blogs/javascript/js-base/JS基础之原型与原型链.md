---
title: JS基础之原型与原型链
date: 2021-1-9
categories:
 - JavaScript
tags:
 - JS基础
---



从一个例子入手

```js
let person = new Person()
```

这时 person 对象的原型就是 Person 构造函数的 prototype，即原型是一个对象。

1. 每个对象实例都包含一个原型对象的指针
2. 每个构造函数都有一个原型对象
3. 每个原型对象都包含一个指向构造函数的指针
4. Object.prototype 是所有对象的爸爸，所有对象都可以通过 `__proto__` 找到它
5. Function.prototype 是所有函数的爸爸，所有函数都可以通过 `__proto__` 找到它
6. 对象实例的 `__proto__` 属性指向原型， `__proto__` 将对象实例和原型连接起来组成了原型链
7. 原型链就是多个对象通过 `__proto__` 的方式连接了起来

![1671d387e4189ec8](F:\Study_Document\笔记\image\1671d387e4189ec8.png)

