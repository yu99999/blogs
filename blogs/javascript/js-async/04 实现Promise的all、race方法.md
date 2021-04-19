---
title: 04 实现Promise的all、race方法
date: 2021-2-26
categories:
 - JavaScript
tags:
 - JS 异步
---



## Promsie.all

Promise.all 的用法如下

```js
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(111)
  }, 2000)
})
var p2 = Promise.resolve(1)

Promise.all([p1, p2]).then((val) => {
  console.log(val)  // [111, 1]
})
```

具体而言，它有以下几个特点，也是我们要实现的功能

1. 方法接收一个可迭代对象作为参数，返回一个 Promise 实例
2. 如果参数中有一个 promise 为失败态，那么返回的 Promise 实例也是失败态
3. Promise.all 在成功态时返回的结果是一个数组

```js
Promise.all = function(promises){
  return new Promise((resolve, reject) => {
    let count = 0;
    const res = [];
    function handle(val, index){
      count++;		// 记录已经成功态的 promise 个数
      res[index] = val;
      if(count === promises.length)
        resolve(res)
    }

    for (let i = 0; i < promises.length; i++) {
      const element = promises[i];
      element.then(val => {
        handle(val, i)
      }, err => {
        reject(err)
      })
    }
  })
}
```



## Promise.race

Promise.race 的用法如下

```js
var p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(111)
  }, 2000)
})
var p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 500)
})

Promise.race([p1, p2]).then((val) => {
  console.log(val)  // 1
})
```

Promise.race 与 Promsie.all 一样都是接收一个 promise 数组，不同的是只要其中一个 promise 为成功态那么返回的 promise 实例就会转为成功态。

```js
Promise.race = function(promises){
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      const element = promises[i];
      element.then(val => {
        resolve(val)
      }, err => {
        reject(err)
      })
    }
  })
}
```

