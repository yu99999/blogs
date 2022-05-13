---
title: 01 CSS基础
date: 2021-03-04
categories:
 - CSS
tags:
 - CSS基础
---



## 1. 盒子模型

盒子模型由内容宽度 content、padding、border、margin 组成

+ 标准盒子模型：width = content
+ 怪异盒子模型：width = content + padding + border

### box-sizing 属性

用来控制元素盒子模型的解析模式，默认为 content-box

+ content-box：标准盒子模型

+ border-box：怪异盒子模型



## 2. CSS选择器

常见选择器如下

+ 元素选择器 div{}
+ ID选择器 #id{}
+ 类选择器 .class{}
+ 伪元素选择器 ::before{}
+ 伪类选择器 :hover{}
+ 属性选择器 [type=radio]{}
+ 通配符选择器 *{}

### 权重

1. !important
2. 内联样式
3. ID选择器（100）
4. 类选择器、属性选择器（10）
5. 元素选择器、伪元素选择器（1）
6. 通配符选择器（0）

### 伪元素和伪类的区别

伪元素是一个实际上存在的元素，能够为指定元素添加文本和样式。

伪类不是一个存在的元素，其用于已有元素处于某种状态时为其添加样式，这个状态时根据用户行为动态变化的。



## 3. 定位

常见的定位如下，所谓的文档流是指 HTML 中每个盒模型安装顺序依次排列而形成的一种结构。

1. 静态定位（static）：默认值，遵循文档流
2. 相对定位（relative）：相对于其正常位置进行定位，遵循文档流
3. 绝对定位（absolute）：相对于**最近的有定位的父级元素**定位，脱离文档流
4. 固定定位（fixed）：相对于**浏览器窗口**的固定位置，脱离文档流
5. 粘性定位（sticky）：基于用户的滚动位置进行定位，在相对定位和固定定位中切换，不脱离文档流。当页面滚动超出目标区域时，会表现为固定定位，固定到目标位置。

脱离文档流是指该元素不再在文档流中占据空间，而是浮动在文档流的上方。





## 4. 浮动

浮动元素脱离文档流，无法撑起父元素，所以会造成父元素的高度塌陷，但是不脱离文本流，在图文混排时能够让文字进行环绕。

当元素浮动后会尽量地向上和向左或向右靠，并且形成一个 BFC，它有着块级元素的一些性质，能够设置宽高。

### 解决高度塌陷

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>test</title>
  <style>
    .a{
      border: 10px solid red;
    }
    .b{
      background-color: aquamarine;
      float: left;
      width: 100px;
      height: 100px;
    }
  </style>
</head>
<body>
  <div class="a">
    <div class="b"></div>
  </div>
</body>
</html>
```

例如上面代码，由于子元素是浮动元素，父元素无法撑起高度，导致高度塌陷

<img src="@img/image-20210320161435012.png" alt="image-20210320161435012" style="zoom:80%;" />

为解决这种问题，我们有几种办法可以实现

1. 让兄弟元素清除浮动

```html
<div class="a">
    <div class="b"></div>
    <div style="clear: both;"></div>
</div>
```

2. 给父元素一个伪元素，让伪元素清除浮动

```css
.a::after{
    content: "";
    clear: both;
    display: block;
}
```

3. 给父元素创建 BFC

```css
.a{
    overflow: hidden;
}
```



## 5. 解决 inline-block 的间隙问题

当元素使用 inline-block 布局时，可以将元素想象成文字，如果元素和元素之间若有空格或回车符，那么它们之间就会有间隙。例如下面这个例子

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>test</title>
  <style>
    *{margin: 0; padding: 0;}
    .container{
      width: 800px;
      height: 200px;
    }
    .left{
      width: 200px;
      height: 200px;
      display: inline-block;
      background-color: aquamarine;
    }
    .right{
      width: 500px;
      height: 200px;
      display: inline-block;
      background-color: brown;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="left">左</div>
    <div class="right">右</div>
  </div>
</body>
</html>
```

<img src="@img/image-20210411194753680.png" alt="image-20210411194753680" style="zoom:80%;" />

可以看到左右两个盒子间有一条间隙，造成这条间隙的原因就是两个元素间的回车符。那么解决问题也很简单，有下面这几种方法

1. 删除回车符
2. 将父元素的字体大小 font-size 设置为0，然后重新设置子元素的字体大小。



## 6. flex 属性

flex 属性是 flex-grow、flex-shrink 和 flex-basis 的简写。

```css
/* 相当于 flex: 1 1 0; */
/* 也就是 flex-grow: 1 */
flex: 1;

/* flex-basis: 10px; */
flex: 10px;

/* 两个值: flex-grow | flex-shrink */
flex: 2 2;
```



## 7. 溢出行用省略号表示

单行文本超出使用省略号表示，不过前提是需要已知宽度。

```css
p{
    width: 200px;
    text-overflow: ellipsis;    /* 文本超出使用省略号表示 */
    white-space: nowrap;        /* 强制文本不换行 */
    overflow: hidden;           /* 元素超出部分隐藏 */
}
```

多行文本溢出使用省略号表示

```css
p{
    display: -webkit-box;         /* 弹性伸缩盒子模型 */
    -webkit-box-orient: vertical; /* 设置伸缩盒子内子元素的排列顺序 */
    -webkit-line-clamp: 3;        /* 限制显示的行数 */
    overflow: hidden;
}
```



