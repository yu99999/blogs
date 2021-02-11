---
title: JS引擎之EventLoop
date: 2021-1-29
categories:
 - JavaScript
tags:
 - JS引擎
---

## 任务队列与事件循环

我们知道，JS 代码是运行在 JS 引擎线程上的，不过除了要执行 JS 脚本，还要处理各种输入事件、请求回调任务等等。既然要让这么多不同类型的任务有条不紊地运行在 JS 引擎线程上，就需要一个系统来进行任务的调度，这个调度系统就是任务队列和事件循环。

### 任务队列

事件触发线程管理着一个任务队列，只要异步任务有了运行结果，就会往任务队列中推入一个任务，排队等待 JS 引擎线程来执行。

任务队列当中又分为**宏任务队列和微任务队列**，对于每个宏任务当中都包含有一个微任务队列。

+ 常见的宏任务有：整体 script 代码、setTimeout、setInterval

+ 常见的微任务有：Promise

这时候那可能会问了，为什么要有微任务呢？设想一下，如果只采用宏任务一种任务队列，那么执行异步回调的时机是等待前面的所有宏任务执行完成才会执行这个回调，倘若这个回调是个高优先级的，那么就会影响到我们想要的结果了。

所以微任务的引入其实是为了解决任务队列优先级的问题。在每个宏任务中增加一个微任务队列，当宏任务执行完后会依次执行微任务队列中的任务，直至微任务队列为空，再去执行下一个宏任务。

### 事件循环（Event Loop）

JS 引擎会维护一个**执行栈**（也就是函数调用栈），当从任务队列中取出任务并执行时，会默认创建一个全局执行上下文压入执行栈中，当有函数被执行时也会创建函数执行上下文压入执行栈，执行完毕时会从栈中弹出。当执行栈为空时，就会到任务队列中去读取下一个任务来执行，如此反复循环执行下去。

```js
function b(){
  debugger
}
function a(){
  b()
  Promise.resolve(1).then(function c(){
    b()
  })
}
a()
```

如果我们在浏览器中执行上面这段代码时，打开 Source 面板后我们也能看到两次执行 b 函数时调用栈的不同。

第二次的执行栈中的栈底是 c 函数执行上下文，不是全局执行上下文。

![image-20210202235344534](F:\Study_Document\笔记\image\image-20210202235344534.png)

![image-20210202235354951](F:\Study_Document\笔记\image\image-20210202235354951.png)



## JS代码的执行顺序

先来看下面这一段代码，想想看执行结果是怎么样的

```js
setTimeout(function() {
  console.log('setTimeout');
}, 0)

console.log('console 1')

new Promise(function(resolve) {
  console.log('promise');
  resolve()
}).then(function() {
  console.log('then 1');
}).then(function() {
  console.log('then 2');
})

console.log('console 2');
```

让我们来分析一下：

1. 刚开始整个script脚本作为第一个宏任务来执行，将全局执行上下文压入执行栈，顺序执行代码
2. setTimeout 交由定时器线程来负责计时，当计时时间到后，将回调函数放入宏任务队列中
3. 依次打印 "console 1"、"promise"、"console 2"，Promise.then作为微任务放入微任务队列
4. 本次宏任务执行完成，检查微任务队列，发现一个Promise.then，执行打印 "then 1"，紧接着将第二个Promise.then作为微任务放入微任务队列
5. 再次检查微任务队列，又发现一个Promise.then，执行打印 "then 2"。
6. 再次检查微任务队列，发现为空，执行下一个宏任务 setTimeout，执行回调函数打印 "setTimeout"

因此执行打印的结果为

```
console 1
promise
console 2
then 1
then 2
setTimeout
```

