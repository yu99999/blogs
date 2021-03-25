---
title: 03 实现Promise的resolve、reject和finally方法
date: 2021-2-26
categories:
 - JavaScript
tags:
 - JS 异步
---



## 实现 Promise.resolve

实现 Promise.resolve 需要考虑几个点：

1. 当参数为一个 Promise 时，直接返回它。否则创建一个 Promise
2. 当参数为一个 thenable 对象时，Promise 的状态由参数决定
3. 其他情况一律返回一个成功态的 Promise

```js
MyPromise.resolve = function(value){
  if(value instanceof MyPromise) return value;
  return new MyPromise((resolve, reject) => {
    if(value && typeof value.then === 'function'){
      value.then(resolve, reject)
    }else{
      resolve(value)
    }
  })
}
```



## 实现 Promise.reject

返回一个失败态的 Promise

```js
MyPromise.reject = function(reason){
  return new MyPromise((resolve, reject) => {
    reject(reason)
  })
}
```



## 实现 Promise.finally

无论当前 Promise 的状态是成功还是失败，都会调用 finally 传入的函数，将值直接传递给下一个

```js
MyPromise.prototype.finally = function(callback){
  this.then(
    value => MyPromise.resolve(callback()).then(() => value),
    err => MyPromise.resolve(callback()).then(() => {throw err}),
  )
}
```

