---
title: Node中的EventLoop
date: 2021-2-4
categories:
 - JavaScript
tags:
 - JS引擎
---



## 事件循环机制的六大阶段

Node.js 中的事件循环与浏览器中的是不一样的东西，它具体分为了六大阶段：

<img src="F:\Study_Document\笔记\image\image-20210205221532876.png" alt="image-20210205221532876" style="zoom:80%;" />

事件循环机制会按照上图的顺序进入每个阶段，其中各个阶段都有一个队列用来存放和执行回调函数。当事件循环进入特定的阶段时，它将执行该阶段队列的回调，直到队列为空或最大回调数已执行。当队列为空或最大回调数已执行时，它将移入下个阶段。

+ timers 阶段：执行已经被 setTimeout 和 setInterval 的调度回调函数。定时器的时间不是回调函数执行的时间，而是回调函数添加到 timers 队列的时间。
+ pending callbacks 阶段：执行一些系统操作的回调。比如TCP错误。
+ idle，prepare阶段：仅系统内部使用。
+ poll 阶段：负责检索新的 I/O 事件，执行与 I/O 相关的回调。进入该阶段会执行 poll 队列内的所有任务，直至队列为空。当队列为空时会发生以下情况：
  + 如果有 setImmediate 调度，将结束 poll 阶段，进入 check 阶段，执行 check 队列中的任务
  + 如果没有 setImmediate 调度，将检查是否有已到达时间的定时器，如果有的话会绕回 timer 阶段去执行
  + 如果没有 setImmediate，也没有已到达时间的定时器任务，此时将进入阻塞，等待事件的回调添加到队列中
+ check 阶段：setImmediate 回调会在 check 队列中排队，该阶段会在 poll 阶段结束后立即执行



## process.nextTick()

> process.nextTick 回调会保存一个单独的队列中

可以将 process.nextTick 与 promise 联系起来，它们都属于微任务，都会在**每个阶段执行完成后处理其队列**，不过 process.nextTick 优先与 promise 执行。这里注意不能递归 process.nextTick 调用，否则会饿死 I/O。

```js
setTimeout(() => {
  console.log('timeout');
}, 0);

function func(){
  process.nextTick(() => {
    func()
  })
}
func()
```

这段代码中的 setTimeout 永远都不会执行，因为主线程一直在处理 process.nextTick 任务，不会进行 timer 阶段。

> 注意：在 node 版本 >= 11 的情况下，微任务执行时机是在每个宏任务执行完成后执行，也就和浏览器一样；而在小于 11 的版本中，执行时机是在每个阶段结束后执行

## 案例演示

```js
const fs = require('fs');

setTimeout(() => {
  console.log('timeout')
}, 500)

setImmediate(() => {
  console.log('immediate')
})

fs.readFile(__dirname + '/test.txt', (err, res) => {
  console.log('poll')
})

console.log('script')

Promise.resolve().then(() => console.log('promise'))
process.nextTick(() => {
  console.log('nextTick')
})

// script
// nextTick
// promise
// immediate
// poll
// timeout
```

+ 首先 Node.js 启动，它会初始化事件循环，处理脚本。打印 "script"，将 promise 和 nextTick 放入队列中。同步代码执行完成
+ 取出微任务队列任务并执行，由于 nextTick 优先执行，所以依次打印 "nextTick" 和 "promise"。接着正式进入事件循环
+ 由于 timers 队列为空，事件循环来到 poll 阶段，发现poll队列也为空，但有 immediate 调度，结束poll阶段，打印"immediate"
+ 第二轮事件循环阻塞在 poll 阶段，等待回调任务。然后文件读取完毕执行回调打印 "poll"，接着又阻塞在 poll 阶段
+ 发现有定时器任务回调，进入 timer 阶段执行打印 "timeout"