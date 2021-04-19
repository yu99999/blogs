---
title: 06 async运行机制
date: 2021-2-28
categories:
 - JavaScript
tags:
 - JS 异步
---



## async

async 函数是一个通过异步执行并隐式返回 Promise 作为结果的函数。

```js
async function a(){
  return 2
}
console.log(a())  // Promise {<fulfilled>: 2}
```

async 实际上是 Generator 和 Promise 的语法糖，它的运行过程包含微任务和协程



## 运行机制

```js
async function a(){
  console.log(1)
  let b = await 2;
  console.log(b);
  console.log(3)
}

console.log(4)
a()
console.log(5)

// 4
// 1
// 5
// 2
// 3
```

看一下上面这段代码，让我们来分析一下它的运行发生了什么

1. 首先打印 4，然后执行 a 函数，由于 a 函数有 async 关键字，所以会创建一个 a 协程，此时保存当前调用栈信息，并切换到 a 协程

2. 打印 1 后遇到 await 关键字，默认会创建一个 Promise 对象，因此 resolve(2) 将进入微任务队列中，此时线程的控制权交给主协程，并将创建的 Promise 返回给主协程

   ```js
   let p = new Promise((resolve, reject) => {
     resolve(2)
   })
   ```

3. 切换到主协程后，会调用 then 方法来监听返回的这个 Promise 的变化，随后打印5。主线程宏任务执行完成

   ```js
   p.then((value) => {
       // 回调函数被执行时，线程的控制权将再次交给 a 协程，并将 value 传递过去
   })
   ```

4. 检查并执行微任务队列中的微任务，随后执行 resolve(2) 触发回调函数，这时线程的控制权将再次交给 a 协程，并将值传递过去

5. 接着执行后续语句，最后将控制权交换给主协程

