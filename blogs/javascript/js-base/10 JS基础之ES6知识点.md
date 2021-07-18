---
title: 10 JS基础之ES6知识点
date: 2021-3-22
categories:
 - JavaScript
tags:
 - JS基础
---



在了解 ES6 特性时，我们可以借助 [Babel](https://www.babeljs.cn/repl) 来将我们的 ES6 代码编译为 ES5 代码，增强我们对 ES6 的理解。

## 1. var、let 和 const

JavaScript 在执行一段代码时会先为其初始化执行上下文，并为其创建变量对象、拷贝上级作用域与当前作用域形成作用域链，此时会对环境中的变量进行变量提升，给变量设置默认值 undefined。

那么来看看 **var 的特点**

+ 具有变量提升的特性
+ 不存在块级作用域
+ 在全局作用域声明变量时，会创建一个新的全局变量作为全局对象的属性
+ 可重复声明变量

```js
console.log(i)	// undefined
{
  var i = 1;
}
console.log(i)	// 1
```

与 var 不一样，当 JavaScript 引擎在对变量进行变量提升时，如果遇到 let 和 const 声明时，会将声明放在暂时性死区中，只要访问了暂时性死区中的变量就会触发运行时错误。我们通过与 var 特点的对比，来看看 **let 和 const 的共性**

+ 不具有变量提升（因为存在暂时性死区，在声明之前访问该变量会报错）
+ 存在块级作用域
+ 不绑定全局作用域
+ 不可重复声明变量

```js
console.log(i)	// 报错
{
  let i = 1;
}
console.log(i)	// 报错
```

而对于 **let 和 const 的区别**：const 声明的变量是常量，其值一旦设定将不再被修改，否则会报错。值得注意的是，这里是不能对值的修改，因此当我们利用 const 声明对象时，其值将指向对象的引用，只要引用不修改就不会报错，所以我们可以修改对象的属性。



## 2. 箭头函数

ES6 中的箭头函数具有以下特性：

1. 没有 this，所以需要通过查找作用域链来确定 this 指向
2. 没有 arguments
3. 没有原型，即 prototype 的值为 undefined
4. 无法通过 new 关键字创建对象

```js
var fn = () => {
  console.log(this)		// window 对象
}
console.log(fn.prototype)	// undefined
fn()
```



## 3. symbol

symbol 是一种基础数据类型，要创建 symbol 值需要使用 Symbol() 函数。它有那么几个特点：

1. 使用 typeof 检查数据类型，结果为 symbol。

2. 使用 instanceof 检查，值为 false，因为它是基础数据类型

   ```js
   Symbol(1) instanceof Symbol;	// false
   ```

3. 无法在 Symbol 函数前使用 new 关键字，因为生成的不是对象

4. 如果 Symbol 的参数是对象，会调用对象的 toString 方法转为字符串后才生成 symbol 值

5. symbol 无法与其他类型的值进行运算，会报错

   ```js
   var s1 = Symbol(1);
   ''+s1;		// 想尝试将其转为字符串，但是报错
   s1.toString();	// 转字符串的正确用法
   ```

6. Symbol 的参数只是对 Symbol 值的描述，相同参数返回的 symbol 值是不相等的

   ```js
   var s1 = Symbol(1);
   var s2 = Symbol(1);
   
   s1 == s2;	// false
   ```

7. 当 Symbol 作为对象的属性名时，它不会出现在 for...in、for...of 循环中，也不会被 Object.keys() 返回。想要获取对象的 symbol 属性名时，可以使用 Reflect.ownKeys 方法。

   ```js
   var obj = {
       a: 2, 
       b: 3, 
       [Symbol(1)]: 4
   }
   
   Object.keys(obj)	// ["a", "b"]
   Reflect.ownKeys(obj)	// ["a", "b", Symbol(1)]
   ```



## 4. 迭代器

迭代器就是一个具有 next() 方法的对象，每次调用 next 都会返回一个结果对象，对象含有两个属性，value 表示当前值，done 表示是否结束。

JavaScript 中的某些数据结构只要具有 Symbol.iterator 属性，也就是原生就具备 Iterator 接口，就会认为是可迭代的，执行该属性会返回一个迭代器对象。原生具备 Iterator 接口的数据结构如下：

1. 数组
2. Set
3. Map
4. 字符串
5. 类数组对象，即 arguments、HTMLCollection、NodeList
6. Generator 对象

对于这些具有迭代器接口的数据结构，我们可以利用 for...of 来遍历它们。for...of 内部会调用 Symbol.iterator 方法获取迭代器对象。而当我们使用 for...of 遍历其他数据时就会抛出错误。

```js
let obj = {a: 1}
for (const val of obj) {
  console.log(val)	// Uncaught TypeError: obj is not iterable
}
```

当然我们也可以自己创建 Iterator 接口，并设配迭代器对象

```js
function createIterator(items){
  let i = 0;
  return {
    next: function(){
      let done = i >= items.length;
      let value = !done ? items[i++] : undefined
      return {value, done}
    }
  }
}

let obj = {a: 1}
obj[Symbol.iterator] = function(){
  return createIterator([1,2,3])
}

for (const val of obj) {
  console.log(val)	// 1 2 3
}
```



## 5. class

可以把 class 看作是一个语法糖，目的是为了让对象原型写法更加清晰。

相比于 ES5 的构造函数，ES6 的 class 有这么几个特点：

1. **只能通过 new 命令调用**，无法直接执行
2. class 内部定义的方法都是不可枚举的
3. constructor 相当于构造函数
4. 能够定义静态属性以及静态方法，也就是只能被类所调用，只需加上 static 关键字
5. 不具有变量提升的特性
6. 拥有 get 和 set 关键字，对某个属性设置存值函数和取值函数，拦截对该属性的操作行为

我们可以看看 class 被编译后的结果

```js
class Person{
  constructor(name){
    this.name = name;
  }
}

const p = new Person('a');
```

```js
"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {	// 查找实例的原型是否由构造函数创建
        throw new TypeError("Cannot call a class as a function"); 
    } 
}

var Person = function Person(name) {
  _classCallCheck(this, Person);	// 只能通过 new 关键字调用的逻辑

  this.name = name;
};

var p = new Person('a');
```



## 6. Proxy 与 Object.defineProperty

Vue.js 中有一个核心机制就是**响应式**，本质是当数据变化后会自动执行某个函数，映射到组件上，从而触发组件的重新渲染。而实现响应式的核心 API 就是 Object.defineProperty（Vue2.0）和 Proxy（Vue3.0）

### Object.defineProperty

Object.defineProperty 的语法如下，可以在一个对象上定义一个新属性或修改某个现有属性

```js
Object.defineProperty(obj, prop, descriptor)
```

descriptor 属性描述符有以下几个可选键值，其中 value、writable 和 get、set 两对互斥（只能同时出现一对）

+ configurable：当值为 ture 时，该属性描述符才能被改变，也能被删除。默认为 false
+ enumerable：当值为 true 时，该属性描述符才能出现在对象的枚举属性中。默认为 false
+ value：属性对应的值。默认为 undefined
+ writable：当值为 true 时，值才能被改变。默认为 false
+ get：当访问该属性时，会调用此函数，函数的返回值会用作属性值。默认为 undefined
+ set：当属性值被修改时，会调用此函数，方法接受一个参数。默认为 undefined

```js
let value = 1;
const obj = {};
Object.defineProperty(obj, 'a', {
  configurable: true,
  enumerable: true,
  get(){
    return value
  },
  set(v){
    console.log('set')
    value = v
  }
})
```

Object.defineProperty 缺点在于只能重新定义属性的读取和设置行为


### Proxy

相比于 Object.defineProperty，Proxy 提供了更多的行为。Proxy 的语法如下，用于创建一个对象的代理，从而实现基本操作的拦截和自定义

```js
const p = new Proxy(target, handler)
```

handle 参数是一个对象，用来定制拦截行为，包含有 Proxy 的各个拦截器，多达13种，下面举出几个常见拦截器

+ get：属性读取操作的拦截器
+ set：属性设置操作的拦截器
+ deleteProperty：delete 操作符的拦截器

```js
const b = {a: 1}
const obj = new Proxy(b, {
  get(target, prop){
    return target[prop]
  },
  set(target, prop, value){
    console.log('set')
    target[prop] = value;
  },
  deleteProperty(target, prop){
    console.log('delete')
    delete target[prop]
    return true;
  }
})
```

可以发现，Proxy 能够监听新属性的添加以及属性的删除，而 Object.defineProperty 不能。