---
title: 02 CSRF攻击
date: 2021-2-21
categories:
 - 浏览器
tags:
 - 浏览器安全
---



## CSRF 攻击

CSRF 称为跨站请求伪造，即**黑客利用用户的登录态，并通过第三方站点来达成目的**。通常是指用户在存在登录状态的情况下，黑客诱导用户打开黑客的网站，在黑客的网站中，利用用户的登录状态来发起跨站请求。

CSRF 攻击与 XSS 攻击最大的不同便是：**CSRF 攻击不需要将恶意代码注入到用户的页面中，仅仅是利用了服务器的漏洞以及用户的登录状态来发起攻击**。

假设用户在拥有 xxx.com 登录状态的情况下打开了黑客的网站，那么黑客有以下三种方式来实施 CSRF 攻击

### 1. 自动发起 GET 请求

黑客的网站中可能会有下面这样的代码

```html
<img src="http://xxx.com/info?user=hhh&comment=hhh"></img>
```

在这段代码中，黑客将请求隐藏在 img 标签中，当页面被加载时，浏览器会自动发起 img 的资源请求，这个请求会自动带上 xxx.com 上的 cookie 信息，如果服务器没有对请求进行判断的话，那么服务器会自动认为这是正常用户的请求，然后就会进行相应的操作，比如增加一条评论什么的。

### 2. 自动发起 POST 请求

黑客的网站中可能会有一个隐藏的表单，并写了一段自动提交的脚本

```html
<form id='test' action="http://xxx.com/info" method="POST">
  <input type="hidden" name="user" value="hhh" />
  <input type="hidden" name="comment" value="hhh" />
</form>
<script>document.getElementById('test').submit();</script>
```

这个请求同样会带上 cookie 信息

### 3. 诱导点击

黑客的网站中可能会有下面这一条链接来诱导你点击

```html
<a href="http://xxx.com/info?user=hhh&comment=hhh" taget="_blank">点击下载美女照片</a>
```

点击后会便会发起请求，与上述的自动发起 GET 请求一样



## 防范措施

由于 CSRF 攻击就是利用了用户的登录态来实现的，所以我们在登录状态做防护和验证即可

### 1. 利用 Cookie 的 SameSite 属性

大多数登录状态的维护是通过 cookie 的，而 cookie 又是随着域名附带在请求上的，所以我们可以利用 Cookie 的 SameSite 属性，这个属性能限制第三方站点发送请求时携带 cookie。SameSite 有三个值：

+ Strict：完全禁止第三方 cookie，只有当前站点与请求目标站点一致时才会携带上 cookie
+ Lax：从第三方站点打开链接、从第三方站点提交 GET 表单以及预加载这三种方式会携带 Cookie。其他请求不会携带。
+ None：任何情况下都会发送 cookie

### 2. 验证请求的来源站点

在服务端验证请求的来源站点，这需要利用到 HTTP 请求头中的 Referer 和 Origin 属性。

Referer 记录了请求的来源地址（包括具体的路径），而 Origin 只记录了域名信息。

### 3. CSRF Token

在浏览器向服务器请求时，服务器生成一个 token，这个 token 通常由 cookie 经过加密算法得到，并将该 token 植入到返回的页面中。

```html
<form id='test' action="http://xxx.com/info" method="POST">
  <input type="hidden" name="token" value="LT-99351-Kb3wWGEy5KqOCbaydzLVCUEfr7dYTE1614259782269-5g9E-cas" />
  <input type="hidden" name="user" value="hhh" />
  <input type="hidden" name="comment" value="hhh" />
  <input type="submit" />
</form>
```

当发起请求时会将该 token 自动带上，服务端便能够通过 token 验证用户的身份