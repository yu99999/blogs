---
title: 05 CSS画图形
date: 2021-08-22
categories:
 - CSS
tags:
 - CSS基础
---



## 画三角形



```css
.triangle{
  width: 0;
  height: 0;
  border-top: 100px solid red;
  border-bottom: 100px solid transparent;
  border-left: 100px solid transparent;
  border-right: 100px solid transparent;
}
```



https://www.jianshu.com/p/9a463d50e441





## 一个盒子一半红一半蓝

如下图这样，实现一个盒子一半红一半蓝。

<img src="@img/image-20210827162225385.png" alt="image-20210827162225385" style="zoom:80%;" />

### 1. 两边 border

因为 border 能够单独设置颜色，那么设置两边的边框即可。由于默认情况下 width 的值为 100%，所以要让 width 为 0

```css
.box{
    width: 0;
    height: 200px;
    border-left: 200px solid red;
    border-right: 200px solid blue;
}
```

### 2. border + width

盒子内容一种颜色，边框一种颜色即可。

```css
.box{
    width: 200px;
    height: 200px;
    border-right: 200px solid blue;
    background-color: red;
}
```

### 3. border + padding

由于背景颜色能显示 padding 所撑开的内容宽度，所以设置 padding 的长度即可，当然前提要让 width 为 0

```css
.box{
    width: 0;
    padding-left: 200px;
    height: 200px;
    border-right: 200px solid blue;
    background-color: red;
}
```

### 4. 渐变函数 linear-gradient

利用 linear-gradient 渐变函数也可以简单完成

```css
.box{
    width: 400px;
    height: 200px;
    background: linear-gradient(to right, red 0%, red 50%, blue 50%, blue 100%);
}
```

