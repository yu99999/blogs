---
title: 02 HTTP请求方法
date: 2021-03-11
categories:
 - 网络协议
tags:
 - HTTP
---



## HTTP 请求方法

HTTP 规定了九种方法：

1. GET：获取资源
2. HEAD：获取资源的头部信息，该方法的请求和响应不包含实体
3. POST：提交数据给服务器
4. PUT：替换目标资源
5. DELETE：删除资源
6. CONNECT：要求服务器为客户端和另一台远程服务器建立连接隧道，服务器充当代理角色
7. OPTIONS：获取目的资源所支持的操作方法，常见于跨域资源共享中的非简单请求
8. TRACE：追踪从请求到响应的传输路径
9. PATCH：对资源进行部分修改



## URI

URI 统一资源标识符，它包含有 URL 和 URN。在 HTTP 中的网址便是 URL。它的结构为下面这样

<img src="@img/image-20210302111944777.png" alt="image-20210302111944777" style="zoom:80%;" />

+ scheme 表示协议名称，比如 http、https、file 等等。后面需要和 :// 连接
+ user:passwd@ 表示登录主机时的用户信息，由于把敏感信息使用明文暴露出来，不推荐使用
+ host:port 表示主机和端口号，常见形式为域名加默认端口 80 或 443
+ path 表示请求路径
+ query 表示查询参数，用 `?` 代表开始，参数由 `key=value` 组成，并通过 `&` 拼接
+ fragment 表示 URI 定位资源内部的锚点，浏览器可以在获取资源后直接跳转到它指示的位置。浏览器不会将该片段发送给服务器

以下面 URI 为例

```js
https://www.google.com/search?q=URI&oq=URI
```

+ `https` 为 `scheme` 部分
+ `www.google.com` 为 `host:port` 部分（http 和 https 的默认端口为 80 和 443）
+ `/search` 为 `path` 部分
+ `?q=URI&oq=URI` 为 `query` 部分



### URI 编码

由于 URI 只能使用 ASCII 码，所以要对 ASCII 码以外的字符集和特殊字符进行编码操作，即转义

例如 `哈哈哈` 将被转义为 `%E5%93%88%E5%93%88%E5%93%88`

不过在浏览器的地址栏中我们不会看到转义后的乱码，可打开开发者工具的 network 面板查看。

