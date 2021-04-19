---
title: 02 实现Promise
date: 2021-2-24
categories:
 - JavaScript
tags:
 - JS 异步
---



## 简易版 Promise

可以把 Promise 理解为一个状态机，它存在三种状态

+ PENDING（等待态）
+ FULFILLED（成功态）
+ REJECTED（失败态）

值得注意的是，状态的改变是**不可逆的**

```js
const pending = 'pending'
const fulfilled = 'fulfilled'
const rejected = 'rejected'

function MyPromise(executor){
  const that = this;
  that.state = pending;
  that.value = null;
  that.resolvedCallbacks = [];   // resolve 的回调函数集合
  that.rejectedCallbacks = [];   // reject 的回调函数集合
  try{
    executor(resolve, reject)
  }catch(err){
    reject(err)
  }

  function resolve(value){
    if(that.state === pending){
      that.state = fulfilled;
      that.value = value;
      that.resolvedCallbacks.forEach(item => item(value))
    }
  }
  function reject(value){
    if(that.state === pending){
      that.state = rejected;
      that.value = value;
      that.rejectedCallbacks.forEach(item => item(value))
    }
  }

}
MyPromise.prototype.then = function(onFulfilled, onRejected){
  if(this.state === pending){
    this.resolvedCallbacks.push(onFulfilled);
    this.rejectedCallbacks.push(onRejected);
  }else if(this.state === fulfilled){
    onFulfilled(this.value)
  }else{
    onRejected(this.value)
  }
}
```



## 补充

上面简易版的 Promise 还是有很多问题的，没有实现链式调用、没有实现错误捕获、延迟执行

+ then 返回的是一个 Promise，所以内部需要使用 Promise 包裹起来
+ 还需要考虑返回值是一个 Promise 的情况，将 Promise 进行拆解
+ 错误捕获 catch 本身就是 then 的语法糖
+ 延迟执行使用 setTimeout 模仿

```js
const pending = 'pending'
const fulfilled = 'fulfilled'
const rejected = 'rejected'

function MyPromise(executor){
  const self = this;
  self.state = pending;
  self.value = undefined;
  self.resolvedCallback = [];   // resolve 的回调函数集合
  self.rejectedCallback = [];   // reject 的回调函数集合
  try{
    executor(resolve, reject)   
  }catch(e){
    reject(e)
  }

  function resolve(value){
    setTimeout(() => {
      if(self.state === pending){
        self.state = fulfilled;
        self.value = value;
        self.resolvedCallback.forEach(item => item(self.value))
      }
    })
  }
  function reject(value){
    setTimeout(() => {
      if(self.state === pending){
        self.state = rejected;
        self.value = value;
        self.rejectedCallback.forEach(item => item(self.value))
      }
    })
  }
}
function resolvePromise(promise2, x, resolve, reject){
  if(x instanceof MyPromise){ // 若返回值是一个 promise 分解这个 promise，直到返回值不是 promise
    if(x.state === pending){
      x.then(res => {
        resolvePromise(promise2, res, resolve, reject);   // 递归分解 promise
      }, err => {
        reject(err)
      })
    }else{
      x.then(resolve, reject)
    }
  }else{
    resolve(x)  // 非promise 直接 resolve
  }
}
MyPromise.prototype.then = function(onFulfilled, onRejected){
  let promise2;
  // 若参数不是函数则忽略它
  onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : function(v){return v}
  onRejected = typeof onRejected === 'function' ? onRejected : function(v){throw v}

  if(this.state === pending){   // Promise 中一般是异步操作，执行到 then 时状态一般都还是 pending
    return promise2 = new MyPromise((resolve, reject) => {
      // 这里无需异步，因为这些函数必然会被 resolve或reject调用，而resolve和reject已经是异步的了
      this.resolvedCallback.push((value) => {
        try{
          let x = onFulfilled(value)
          resolvePromise(promise2, x, resolve, reject)
        }catch(e){
          reject(e)
        }
      });
      this.rejectedCallback.push((value) => {
        try{
          let x = onRejected(value)
          resolvePromise(promise2, x, resolve, reject)
        }catch(e){
          reject(e)
        }
      });
    })
  }else if(this.state === fulfilled){
    return promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try{
          let x = onFulfilled(this.value)   // 状态不是 pending 能够获取到 value
          resolvePromise(promise2, x, resolve, reject)
        }catch(e){
          reject(e)
        }
      })
    })
  }else{
    return promise2 = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try{
          let x = onRejected(this.value)
          resolvePromise(promise2, x, resolve, reject)
        }catch(e){
          reject(e)
        }
      })
    })
  }
}
MyPromise.prototype.catch = function(onRejected){
  return this.then(null, onRejected)
}
```

