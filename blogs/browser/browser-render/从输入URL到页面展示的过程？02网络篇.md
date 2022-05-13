---
title: 从输入URL到页面展示的过程？02网络篇
date: 2021-2-13
categories:
 - 浏览器
tags:
 - 浏览器渲染
---



## 1. 构建 URL

当用户在地址栏输入一个查询关键字时，地址栏会判断输入的关键字是搜索内容还是请求URL。

+ 如果是搜索内容，地址栏会使用浏览器默认的搜索引擎去合成URL
+ 如果是请求URL，例如 `www.baidu.com`，那么地址栏会给这段 URL 加上协议，合成为完整的URL `https://www.baidu.com`

完整的 URL 主要由：**协议、主机、端口、路径、查询参数**构成



## 2. 查找强缓存

**浏览器进程**会通过进程间通信（IPC）把 URL 发送给**网络进程**，网络进程接收到 URL 并不会马上发送请求，它会先尝试查找本地缓存

+ 如果有缓存资源，那么直接将缓存资源返回给浏览器进程。
+ 如果没有缓存，那么进入网络请求流程。



## 3. DNS 解析

由于我们输入的一般是域名，而数据包是通过 IP 地址传给对方的。因此我们需要得到域名对应的 IP 地址。这个过程就需要用到 **DNS 域名解析系统**。

另外，浏览器提供了**DNS缓存功能**，如果一个域名已经解析过了，那么浏览器会将解析结果缓存起来，下次处理时直接从缓存中拿取数据，不需要经过 DNS 解析。

整个 DNS 查询过程如下：

1. 首先查找浏览器 **DNS 缓存**，如果有，则域名解析流程结束；否则进入下一步
2. 读取操作系统的 **hosts 文件**查找是否有对应的映射关系，有的话流程结束；否则进入下一步
3. 查找**本地域名服务器**，有的话流程结束；否则进入下一步
4. 向**根域名服务器**查询顶级域（例如 .com）的 IP 地址，然后在向**顶级域名服务器**查询二级域名（例如 baidu.com）的 IP 地址，最后向**权威域名服务器**查询完整域名的 IP 地址。



## 4. 建立 TCP 连接

由于 HTTP 请求是建立在 TCP/IP 之上的，所以需要先建立 TCP 连接。

对于 TCP 建立连接的过程，是通过三次握手进行协商建立的，具体如下。

<img src="@img/image-20210214003229256.png" alt="image-20210214003229256" style="zoom: 67%;" />



## 5. 建立 TLS 连接

如果此时发现请求协议是 HTTPS，那么还需要建立 TLS 连接。

TLS 握手是为了证明服务器的真实性以及协商出会话密钥

<img src="@img/image-20210226143555245.png" alt="image-20210226143555245" style="zoom:80%;" />



## 6. 发送 HTTP 请求

完成 TCP 连接之后，浏览器可以与服务器开始通信了，也就可以发送 HTTP 请求。浏览器会构建请求报文，而请求报文一般由**请求行**、**请求头**、**请求体**等信息组成。

**请求行**的格式如下，其中  GET 为请求方法，路径为根路径，HTTP 协议版本为 1.1

```http
GET / HTTP/1.1
```

**请求头**的格式如下，另外对于 **Cache-Control**、**If-Modified-Since**、**If-None-Match** 都有可能会放入请求头信息中去向服务器询问缓存的情况。当然也有其他请求头，例如紧跟域名的 Cookie

```
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cache-Control: max-age=0
Connection: keep-alive
Cookie: cookie
Host: www.baidu.com
sec-ch-ua: "Google Chrome";v="87", " Not;A Brand";v="99", "Chromium";v="87"
sec-ch-ua-mobile: ?0
Sec-Fetch-Dest: document
Sec-Fetch-Mode: navigate
Sec-Fetch-Site: none
Sec-Fetch-User: ?1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36
```

对于**请求体**的话，请求体存在于 POST 方法中。



## 7. 响应 HTTP 请求

对于 HTTP 响应报文，它同样由**响应行**、**响应头**、**响应体**构成。

响应行格式：由 HTTP 协议版本、状态码和状态描述组成

```http
HTTP/1.1 200 OK
```

响应头类似下面这样，对于 **Cache-Control**、**Expires**、**Last-Modified**、**ETag** 都有可能会放入响应头信息中通知浏览器如何缓存这些资源。当然还有很多其他头信息，例如 Set-Cookie 来设置 Cookie 信息。

```
Bdpagetype: 2
Bdqid: 0xed681f84001f87c9
Cache-Control: private
Connection: keep-alive
Content-Encoding: gzip
Content-Type: text/html;charset=utf-8
Date: Fri, 12 Feb 2021 17:16:00 GMT
Expires: Fri, 12 Feb 2021 17:16:00 GMT
Server: BWS/1.1
Set-Cookie: H_PS_PSSID=33423_33429_33272_31660; path=/; domain=.baidu.com
Strict-Transport-Security: max-age=172800
Traceid: 1613150160034475034617106957836365039561
Transfer-Encoding: chunked
X-Ua-Compatible: IE=Edge,chrome=1
```

响应头信息中还有一个重要的字段 **Content-Type**，它告诉浏览器服务器返回的响应体数据是什么类型。如果 Content-Type 的值为 **text-html**，那么会通知浏览器进程准备渲染进程准备渲染。

另外，如果状态码是301或302，那么会进行重定向，从 Location 字段读取新的URL，然后重新发起请求。



