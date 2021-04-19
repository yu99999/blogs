---
title: 04 如何高效操作DOM
date: 2021-4-6
categories:
 - 前端性能
tags:
 - 前端性能
---



## 为什么说操作DOM耗时

### 线程切换

首先我们需要知道浏览器是多进程架构的，可以认为每个页面就是一个渲染进程，而渲染进程又是多线程的，包含 JavaScript 引擎线程和渲染引擎线程等。

其中，渲染引擎线程和 JavaScript 引擎线程是互斥的，也就是说某个时刻下只有一个引擎线程在运行，另一个处于阻塞状态。并且在进行线程切换的时候需要保存上一个线程执行时的状态信息并读取下一个线程的状态信息，这就是**上下文切换**，这个操作是比较耗时的。

```js
const times = 1000000;
console.time('dom')
for(let i=0; i<times; i++){
  let temp = document.body	// 循环读取 body 元素
}
console.timeEnd('dom')		// dom: 25.093994140625 ms


console.time('object')
let obj = document.body		// 将 body 作为js变量保存起来
for(let i=0; i<times; i++){
  let temp = obj
}
console.timeEnd('object')	// object: 2.39892578125 ms
```

例如上面这段代码，第一个例子中每次循环读取都涉及到上下文切换，其所花费的时间要大于只涉及 JavaScript 引擎线程的第二个例子



### 重新渲染

在操作 DOM 时涉及到元素、样式的修改，就会引起渲染引擎重新渲染，也就有可能进行回流和重绘。具体可以看浏览器渲染篇的文章。现贴一下回流和重绘的定义

当我们引发 **DOM 的几何尺寸变化**的时候，就会发生回流过程。即若有以下操作的发生就会触发回流：

+ DOM 节点的增删或移动，例如 display
+ DOM 节点的几何属性发生修改，常见的几何属性包括 width、height、margin、padding、border、font-size
+ 读写 offset 族、client 族、scroll 族属性时，浏览器为获取准确的值会进行回流
+ 执行 window.getComputedStyle 方法

当我们引发了 DOM 节点样式的变化，但没有引起几何尺寸的变化时，会触发重绘。

+ 对颜色样式的修改，例如 color、border-style、backgro0und-color 等
+ 从样式上隐藏节点，但没有改变 DOM 结构，例如 visibility

#### 举个栗子

我们可以通过 Chrome 提供的性能分析工具来对渲染耗时进行分析，分析回流和重绘两种渲染耗时的区别

在第一个例子中，我们通过点击按钮后修改元素的边距来触发回流。

```js
const times = 100000;
let html = '<button id="btn">change</button>'
for(let i=0; i<times; i++){
  html += `<li>${i}</li>`
}
document.body.innerHTML = html;

const btn = document.getElementById('btn')
btn.addEventListener('click', () => {
  const lis = document.querySelectorAll('li')
  lis.forEach((item, index) => {
    item.style.margin = index % 2 ? '20px' : '5px'
  })
})
```

<img src="@img/image-20210329205711007.png" alt="image-20210329205711007" style="zoom:80%;" />

在第二个例子中，我们通过点击按钮后修改元素的颜色来触发重绘。

```js
const times = 100000;
let html = '<button id="btn">change</button>'
for(let i=0; i<times; i++){
  html += `<li>${i}</li>`
}
document.body.innerHTML = html;

const btn = document.getElementById('btn')
btn.addEventListener('click', () => {
  const lis = document.querySelectorAll('li')
  lis.forEach((item, index) => {
    item.style.color = index % 2 ? 'blue' : 'red'
  })
})
```

<img src="@img/image-20210329205728671.png" alt="image-20210329205728671" style="zoom:80%;" />

从两个结果可以看出，回流的渲染耗时（Rendering + Painting）要明显高于重绘



## 如何高效操作DOM

### 批量操作元素

将对元素的操作放在一起批量执行

```js
console.time('time')
let body = document.body
for(let i=0; i<3000; i++){
  body.innerHTML += `<div></div>`
}
console.timeEnd('time')		// time: 4684.2490234375 ms
```

例如创建 3000 个元素，可以利用变量先保存，最后将创建的所有元素批量更新到目标元素上

```js
console.time('time')
let html = ""
for(let i=0; i<3000; i++){
  html += `<div></div>`
}
document.body.innerHTML = html
console.timeEnd('time')		// time: 2.4091796875 ms
```

不过上面这种直接修改 innerHTML 的方式实在不妥，为此，最好的办法是先创建一个容器来存放这些要添加的元素，最好再将这个容器添加进目标元素。因此可以利用 DocumentFragment 来创建容器，它不是真实 DOM 的一部分，其变化不会触发 DOM 的重新渲染

```js
let content = document.createDocumentFragment()
for(let i=0; i<3000; i++){
  let cur = document.createElement('div')
  cur.innerText = i
  content.appendChild(cur)
}
document.body.appendChild(content)
```



### 缓存元素变量

所谓的缓存元素变量也就是前面所说的减少上下文切换。

```js
let html = ''
for(let i=0; i<10000; i++){
  html += `<div></div>`
}
document.body.innerHTML = html;

console.time('time')
for(let i=0; i<document.querySelectorAll('div').length; i++){
  document.querySelectorAll('div')[i].innerText = i
}
console.timeEnd('time')		// time: 3018.7900390625 ms
```

例如这个例子，每次循环都会去获取选择器。所以我们可以使用一个变量来缓存这些选择器

```js
let html = ''
for(let i=0; i<10000; i++){
  html += `<div></div>`
}
document.body.innerHTML = html;

console.time('time')
let query = document.querySelectorAll('div')
for(let i=0; i<query.length; i++){
  query[i].innerText = i
}
console.timeEnd('time')		// time: 7.298828125 ms
```



### 避免频繁使用 style

频繁使用 style 不仅涉及到频繁操作 DOM，在触发计算样式时的耗时也比使用 class 多。

下面这个就是频繁使用 style 的例子，同样的，我们利用 perform 来记录按下按钮后的性能

```js
let html = '<button id="btn">按钮</button>'
for(let i=0; i<100000; i++){
  html += `<div id="i${i}">${i}</div>`
}
document.body.innerHTML = html

document.getElementById('btn').addEventListener('click', function a(){
  for(let i=0; i<100000; i++){
    let cur = document.getElementById(`i${i}`)
    cur.style.height = '30px';
    cur.style.color = 'red';
    cur.style.border = '1px';
    cur.style.margin = '1px';
    cur.style.padding = '1px';
  }
})
```

<img src="@img/image-20210401123529535.png" alt="image-20210401123529535" style="zoom:80%;" />

<img src="@img/image-20210401123507115.png" alt="image-20210401123507115" style="zoom:80%;" />

这时我们使用 class 来代替操作 style，仔细观察性能区别。

```js
let html = '<button id="btn">按钮</button>'
for(let i=0; i<100000; i++){
  html += `<div id="i${i}">${i}</div>`
}
document.body.innerHTML = html

document.getElementById('btn').addEventListener('click', function a(){
  for(let i=0; i<100000; i++){
    document.getElementById(`i${i}`).className = 'cls'
  }
})
```

<img src="@img/image-20210401123849424.png" alt="image-20210401123849424" style="zoom:80%;" />

<img src="@img/image-20210401123900487.png" alt="image-20210401123900487" style="zoom:80%;" />

从上述的变化中我们可以看到 JavaScript 耗时和 Rendering 的耗时都有所减少。

特别是 Rendering 的耗时，减少的是计算样式的耗时，而对于布局和更新图层树的耗时没有差别。