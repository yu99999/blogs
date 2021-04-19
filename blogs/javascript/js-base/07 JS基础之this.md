---
title: 07 JS基础之this
date: 2021-1-15
categories:
 - JavaScript
tags:
 - JS基础
---



this 机制诞生的目的是为了**使在对象内部的方法能够访问对象内部的属性**。它与作用域链是两套不同的系统，它们之间没有太多的联系，所以在学习的过程中要把它们区别开来。

当 javascript 引擎在执行一段可执行代码时，会创建对应的执行上下文并推入执行栈中，每个执行上下文中都包含有三个重要的属性：

+ 变量对象
+ 作用域链
+ this

当查找变量时，是通过作用域链的每个作用域来找到对应的变量的，而作用域是**词法作用域**，也就是说作用域链在代码阶段就已经确定了的。但是 this 是完全不一样的，this 的绑定是在执行时绑定（除箭头函数外）。

对于 this 绑定有以下几种场景：

## 1. 显示绑定

```js
var obj = { a: 1 }

function func(){
  console.log(this.a)
}
func.call(obj)	// 1
```



## 2. 对象调用方法

通过对象来调用其内部的一个方法，其 this 指向对象本身

```js
var obj = {
  a: function(){
    console.log(this)
  }
}

obj.a()		// obj 对象
```



## 3. 普通函数 this 默认指向全局对象 window

在默认情况下调用一个普通函数，其执行上下文的 this 默认指向的是 window，当在严格模式下是指向 undefined。

```js
var obj = {
  a: function(){
    console.log(this)
  }
}

var func = obj.a;
func()		// window 对象
```

> setTimeout 回调函数也是指向 window 的



## 4. DOM 事件绑定

addEventerListener 回调函数中的 this 默认指向绑定事件的元素。



## 5. 构造函数绑定

通过 new 关键字执行的构造函数的 this 指向创建出来的对象



## 6. 箭头函数

ES6 中的箭头函数具有以下特性：

1. **没有 this，所以需要通过查找作用域链来确定 this 指向**
2. 没有 arguments
3. 没有原型，即 prototype 的值为 undefined
4. 无法通过 new 关键字创建对象

这意味着如果箭头函数被非箭头函数包裹，this 绑定的就是最近一层非箭头函数的 this

```js
var obj = {
  a: function(){
    var b = () => {
      console.log(this)
    }
    b()	// obj 对象
  }
}

obj.a()
```

