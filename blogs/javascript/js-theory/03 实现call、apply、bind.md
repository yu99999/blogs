---
title: 03 实现call、apply、bind
date: 2021-1-21
categories:
 - JavaScript
tags:
 - JS API原理
---



## call 和 apply 的实现

call 和 apply 在实现上基本一致，只是参数在接收上有所不同。

```js
Function.prototype._call = function(context, ...args){
  context = context || window;  // 如果没有传入上下文，默认window
  context.fn = this;    // 将函数绑定到上下文
  
  const res = context.fn(...args)   // 执行函数

  delete context.fn;    // 将函数从上下文解绑
  return res;
}

Function.prototype._apply = function(context, args){
  context = context || window;  // 如果没有传入上下文，默认window
  context.fn = this;    // 将函数绑定到上下文
  
  const res = context.fn(...args)   // 执行函数
  
  delete context.fn;    // 将函数从上下文解绑
  return res;
}
```



## bind 的实现

> `bind()` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。--- MDN

因为要返回一个函数，所以我们可以在返回的函数内修改 this 指向。不过在实现 bind 前要先注意一点，当 bind 返回的函数作为构造函数的时候，bind 绑定的 this 将会失效，但传入的参数有效。

```js
function Parent(name, values){
  this.name = name
  this.values = values
}

let a = {b: 20}
let fn = Parent.bind(a, 1)

console.log(new fn([1,2,3]))  // {name: 1, values: [1,2,3]}
console.log(a)  // {b: 20}

console.log(fn([1,2,3]))  // undefined
console.log(a)  // {b: 20, name: 1, values: [1,2,3]}
```

我们知道，在 new 的时候会创建一个新的对象，链接原型后将构造函数的 this 绑定到这个对象上，也就是在这样，我们需要判断 this 指向，以免将 new 过程的 this 给覆盖了。具体看下面的代码吧。

```js
Function.prototype._bind = function(context, ...args){
  context = context || window;
  const self = this;  // 保存函数
  const funcBack = function(){
    // new创建的对象会有构造函数的原型对象
    // 如果是构造函数不修改this，否则将this指向修改为上下文
    self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)))
  }
  // 修改返回函数的原型
  funcBack.prototype = Object.create(this.prototype);
  return funcBack;
}
```

