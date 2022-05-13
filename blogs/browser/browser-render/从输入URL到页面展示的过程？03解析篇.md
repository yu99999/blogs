---
title: 从输入URL到页面展示的过程？03解析篇
date: 2021-2-14
categories:
 - 浏览器
tags:
 - 浏览器渲染
---



当接收到的 Content-Type 为 html 类型时，接下来就是由渲染进程来负责**解析**和**渲染**工作了。

对于解析的流程，主要分为以下几个步骤：

+ 解析 HTML 构建 DOM 树
+ 解析 CSS 进行样式计算

## 1. 解析 HTML

渲染引擎内部有一个 **HTML 解析器(HTMLParser)** 的模块，它负责 HTML 的解析。

对于 HTML 解析算法，具体分为两个过程：

1. Token 化（词法分析）
2. 构建 DOM 树（语法分析）

### Token 化

简单来说，Token 化的过程就是**将 HTML 文本分解为一个个 Token**，Token 即 HTML 标记。其过程使用了一种类似状态机的算法

```html
<html>
  <body>
    Hello World
  </body>
</html>
```

例如上面的例子，整个标记的过程：

1. 匹配到 `<`，状态切换为**标签打开状态**
2. 匹配 `[a-z]` 的字符，状态切换为**标签名称状态**。这个状态会一直保持，直到匹配到 `>`
3. 匹配到 `>`，表示标签名称记录完成，状态切换为**数据状态**
4. 接下来遇到 body 标签也是同样的处理，最后来到 `>`，状态为**数据状态**
5. 保持数据状态接收字符串 Hello World
6. 匹配到 `<`，状态切换为标签打开状态，匹配到 `/`，状态切换为**结束标签打开状态**
7. 后续过程与上面一样，直至完成

最终生成的 Token 如下

```
StartTag html
	StartTag body
    	Hello World
    EndTag body
EndTag html
```

### 构建 DOM 树

在上述的 Token 化过程中产生的每个 Token 都会被传输到**树构建器**中进行处理，树构建器会利用一个**开放元素栈**，进而为 Token 生成一个 DOM 节点，以便有序地插入到 DOM 树中。

```html
StartTag html
	StartTag body
    	Hello World
    EndTag body
EndTag html
```

1. 在开始工作之前，会默认创建一个以 `document` 为根的空 DOM 结构，同时会维护一个 Token 栈
2. 当树构建器接收到 `StartTag html` 时，会为该 Token 生成一个 html 节点并插入到 document 节点上，同时将该 Token 压入栈
3. 接着收到 `StartTag body`，由于没有接收到 `head` 的 Token，所以会自动创建一个 head 节点。
4. 收到 `StartTag body` 后，生成 body 节点插入到父节点（父节点就是**栈顶节点**）同时压入栈中
5. 收到文本 Token `Hello World`，将文本节点插入父节点中，但是不用压栈
6. 收到 `EndTag body`，将栈顶弹出，表示 body 元素解析完成
7. 收到 `EndTag html`，将栈顶弹出，此时解析过程结束

DOM 树是一颗以 `document` 为根节点的多叉树。在 JS 中可使用  `document` 查看



## 2. 解析 CSS 并计算样式

关于 CSS 的来源，主要来自以下三种：

1. 通过 link 引用的 css 文件
2. style 标签内的 css
3. 元素的内嵌 style 属性

### 格式化样式表

与 HTML 一样，浏览器也是无法理解 CSS 文本内容的，所以当解析 HTML 的过程中遇到 CSS 时，会去解析 CSS 转换为浏览器能够理解的结构，即 styleSheets。

我们可以通过在控制台输入 `document.styleSheets` 进行查看，这个结构就包含了上面三种 CSS

### 标准化样式属性

有一些 CSS 属性，如 1em、blue、bold，这些数值不被理解，所以需要将这些值转为渲染引擎能够理解的，标准化的值，如 `16px`、`rgb(0, 0, 255)`、`700`

### 计算样式

接下来计算每个 DOM 节点的样式属性，其中涉及到 CSS 的**继承**规则和**层叠**规则

CSS 具有**继承**特性，也就是会继承父节点样式作为当前样式，然后再进行覆盖。每个节点的样式中还包含有浏览器提供的默认样式。

关于**层叠**特性，它是一个定义了如何合并来自多个源的属性值，即最终的样式取决于各个属性共同作用的效果。

最终会计算出每个 DOM 节点的样式属性，这个我们可以打开开发者工具的 element -> Computed 面板进行查看



## 题外话：阻塞

从上面的解析过程中我们知道解析html构建DOM树，在解析的过程中难免会遇到 css 和 js，那么我们思考这个问题

>  css、js 会阻塞 html 的解析，也就是 DOM 的生成吗？会阻塞页面的渲染吗？

+ css 在部分情况下也会阻塞DOM的生成
+ js会阻塞DOM生成
+ css、js 都会阻塞页面渲染

由于 js 内部经常会获取 DOM 节点和样式，所以在解析 html 的过程中如果遇到 js 文件会暂停解析，将控制权交由 js 引擎线程，并等待其下载和执行完成后再继续解析。如果有引用css文件，js文件不会立即执行，而是等css文件解析完构建CSSOM之后才执行。

**所以css在部分情况下也会阻塞DOM的生成，js会阻塞DOM生成，两者都会阻塞页面渲染**。

### 优化

浏览器在解析 html 构建 DOM 树时，这个过程占用了主线程。

浏览器针对下载阶段进行优化，渲染引擎中有**预加载扫描器**，当接收到 html 文件时，扫描器会对文件进行扫描，并找到关键资源（如 css, js）去下载，下载过程中不会占用主线程，减少阻塞时间。

另外，我们经常把css文件放在head，而js文件放在body底部，避免 js 执行时 css 还未解析完成。

或者通过 async 和 defer 来标记 js 文件，从而避免下载过程阻塞DOM生成

+ async：js文件异步下载，下载完成立即执行。
+ defer：推迟下载，等到 DOMContentLoaded 事件之后执行。

### 关于 DOMContentLoaded 和 load

+ DOMContentLoaded 事件：当纯HTML被完全加载以及解析时，DOMContentLoaded 事件会被触发，而不必等待样式表，图片或者子框架完成加载。也就是 jQuery 中的 $(document).ready(function() { });
+ load 事件：等所有资源加载完成之后（需要等待样式表，图片或者子框架等资源完成加载），load 事件才会被触发。

关于上面这两者的区别，我们可以点击进入[这个站点来观察一下](https://testdrive-archive.azurewebsites.net/HTML5/DOMContentLoaded/Default.html)

另外，我们可以打开 NetWork 面板来查看这两者执行的具体时刻，如下图，蓝色的线是 DOMContentLoaded 执行时刻，红色的线是 load 执行时刻。

<img src="@img/image-20210802005909948.png" alt="image-20210802005909948" style="zoom:80%;" />

