---
title: 01 XSS攻击
date: 2021-2-20
categories:
 - 浏览器
tags:
 - 浏览器安全
---



## XSS 攻击

XSS 的全程是 Cross Site Scripting，即跨站脚本。通常指的是，**网站未对用户输入的数据进行有效过滤，攻击者可以将恶意脚本注入到网站页面中，以达到执行恶意代码的目的**。攻击者只需诱导受害者打开特定的网站，就可以在受害者的浏览器中执行被注入的恶意代码。

攻击者一般能够做以下这些事情：

1. 窃取 cookie
2. 修改 DOM 伪造登录表单
3. 监听用户行为，比如输入账号密码后发送给攻击者服务器

XSS 攻击分为三种：**存储型 XSS 攻击**、**反射型 XSS 攻击**和**基于 DOM 的 XSS 攻击**

### 1. 存储型 XSS 攻击

存储型 XSS 攻击大致经过这些步骤：**攻击者将恶意代码存储到存在漏洞的服务器上，当用户访问到含有该恶意代码的网站时即可触发**。常见于一些能够发表评论的地方，比如论坛，博客。



### 2. 反射型 XSS 攻击

反射型 XSS 指的是恶意代码放在 URL 参数中，而不是存储在服务器上，因此需要诱导用户打开才能触发攻击。

比如用户打开：

```
http://xxx.com?xss=<script>alert('你被XSS攻击了')</script>
```

这样服务器获取到 URL 中的 xss 参数，然后将内容返回给浏览器，浏览器将此内容作为 HTML 解析的一部分，这样该脚本就被执行了。

和存储型不同的是，反射型是通过 URL 的参数，经过服务器，然后再反射到 HTML 上，过程中并没有存储到服务器上。



### 3. 基于 DOM 的 XSS 攻击

基于 DOM 的 XSS 攻击是利用了 JS 能够访问以及修改浏览器 DOM 的特性，因此 JS 能够确定如何处理当前页面的 URL，比如获取 URL 中的相关数据进行处理，并动态更新到页面上。

它与前两种攻击方式最大的不同就是它不经过服务器，可以绕过服务端的检测功能。



## 防范措施

### 1. 利用 Cookie 的 HttpOnly 属性

很多 XSS 攻击的目的都是为了窃取用户的 cookie，而 cookie 的读取可以通过 document.cookie 来实现。

所以我们可以利用 cookie 的 **HttpOnly 属性**来禁止 JS 引擎使用 document.cookie 来访问。

### 2. 利用 CSP

CSP 内容安全策略，也叫白名单机制，告诉浏览器可以加载和执行哪些外部资源，这样能够防止被一些第三方的恶意脚本注入。

可以通过两种方式来开启 CSP：

1. 设置 HTTP 头信息中的 Content-Security-Policy 字段

2. 通过 `<meta>` 标签来配置

   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*;">
   ```

具体的配置可以查看[文档](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSPhttps://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)

### 3. 输入检查

永远不信任用户的输入，即对输入的内容进行检查过滤

```html
<script>alert(1)</script>
```

进行转义过滤后就变成

```html
&lt;script&gt;alert(1)&lt;&#x2F;script&gt;
```





