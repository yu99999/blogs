---
title: 03 BFC
date: 2021-03-06
categories:
 - CSS
tags:
 - CSS
---



## BFC

> 浮动元素和绝对定位元素，非块级盒子的块级容器，例如 inline-blocks、table-cells、table-captions，以及 overflow 的值不为 visible 的元素，都会为其创建一个新的BFC（Block Fromatting Context，即块级格式化上下文）

上面的引述几乎总结了一个 BFC 是怎样形成的，即一个 HTML 元素要创建 BFC，需要满足以下任意一个或多个条件即可：

+ 根元素
+ 浮动元素，float 为 left 或 right
+ 绝对定位元素，position 为 absolute 或 fixed
+ 行内块元素，display 为 inline-block
+ 表格元素，display 为 table-cells、table-captions、table
+ 弹性元素，display 为 flex 或 inline-flex
+ 网格元素，display 为 grid 或 inline-grid
+ overflow 不为 visible 的元素



## BFC的渲染规则

1. 在同一个 BFC 内元素垂直方向边距重叠
2. 计算 BFC 高度时，浮动元素也会参与计算
3. BFC 是一个独立的容器，外面的元素不会影响里面的元素



## 应用场景

### 1. 解决高度塌陷

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

上面结果会造成父元素的高度塌陷，解决办法只需给父元素创建一个 BFC 即可

```css
.a{
    overflow: hidden;
}
```



### 2. 解决边距重叠

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>test</title>
  <style>
    *{margin: 0; padding: 0;}
    .a{
      border: 10px solid red;
    }
    .b{
      height: 10px;
      margin: 10px;
      background-color: aquamarine;
    }
  </style>
</head>
<body>
  <div class="a">
    <div class="b"></div>
    <div class="b"></div>
    <div class="b"></div>
  </div>

</body>
</html>
```

如图，内部元素在垂直方向的边距塌陷了

<img src="@img/image-20210320164907250.png" alt="image-20210320164907250" style="zoom:80%;" />

产生上面现象的原因是在同一个 BFC 内元素垂直方向边距重叠，所以我们让内部元素不在同一个 BFC 内即可，例如下面这样，让中间元素存在在另外一个 BFC 中

```html
<div class="a">
    <div class="b"></div>
    <div style="overflow: auto;">
        <div class="b"></div>
    </div>
    <div class="b"></div>
</div>
```



### 3. 解决文字环绕

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
    <p>这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本这是文本</p>
  </div>
</body>
</html>
```

由于浮动元素脱离文档流但不脱离文本流，所以会产生文本环绕的效果

<img src="@img/image-20210320164211889.png" alt="image-20210320164211889" style="zoom: 50%;" />

要解决这种问题很简单，只需将让文本成为 BFC 即可，让外部元素无法影响内部元素

```css
p{
    overflow: auto;
}
```

当然也能给文本元素一个左边距

```css
p{
    margin-left: 100px;
}
```

