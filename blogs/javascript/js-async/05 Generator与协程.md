---
title: 05 Generator与协程
date: 2021-2-27
categories:
 - JavaScript
tags:
 - JS 异步
---



## Generator

Generator 是一个能够暂停执行和恢复执行的函数，它有如下几个特征：

1. Generator 函数的 function 与函数名之间有一个星号
2. 执行 Generator 函数会返回一个**迭代器对象**
3. Generator 函数通过 yield 和 next() 来暂停执行和恢复执行
4. yield 后面的表达式会作为 next 方法调用的返回值
5. next 方法的参数会作为上一个 yield 表达式的返回值

```js
function* gen(){
  console.log(1)
  yield 2;
  console.log(3);
  const value = yield 4
  console.log(value)
  return 'done'
}

const g = gen();
console.log(5);
console.log(g.next().value)
console.log(6);
console.log(g.next().value)
console.log(g.next(7))

// 5
// 1
// 2
// 6
// 3
// 4
// 7
// {value: "done", done: true}
```

那么为什么 Generator 函数能够暂停执行和恢复执行呢？这其中涉及到一种协程的概念



## 协程

协程是一种比线程更加轻量级的，可以将协程看成是跑在线程上的任务，一个线程可以存在多个协程，但一个线程只能同时执行一个协程。所以本质上还是单线程运行的，但是它不受操作系统的控制，完全由用户自定义切换，因此没有进程/线程上下文切换的性能开销。

那么协程是如何执行的呢，还是以上面的代码为例，它的执行经过了以下几个步骤：

```js
function* gen(){
  console.log(1)
  yield 2;
  console.log(3);
  const value = yield 4
  console.log(value)
  return 'done'
}

const g = gen();
console.log(5);
console.log(g.next().value)
console.log(6);
console.log(g.next().value)
console.log(g.next(7))
```

1. 通过调用 Generator 函数创建了一个协程 g，创建之后，g协程并没有立即执行，而是顺序执行代码打印 5
2. 通过 g.next() 让协程执行，打印1，然后遇到 yield 表达式来暂停 g 协程的执行，并返回信息 2 给父（主）协程
3. 按照上述步骤执行到 g.next(7) 恢复 g 协程的执行，并将参数赋值给 value
4. 最后 return，那么 JS 会结束当前协程，并将 return 结果返回给父协程

值得注意的是上面协程切换时调用栈的切换

+ 当在父协程中调用 g.next() 时，JS 引擎会保存当前的调用栈信息，并恢复 g 协程的调用栈信息
+ 当在 g 协程中遇到 yield 时，JS 引擎会保存当前的调用栈信息，并恢复父协程的调用栈信息