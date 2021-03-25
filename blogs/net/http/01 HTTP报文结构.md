---
title: 01 HTTP报文结构
date: 2021-03-10
categories:
 - 网络协议
tags:
 - HTTP
---



HTTP协议的请求报文和响应报文结构都由以下部分组成：

+ 起始行
+ 头部
+ 空行
+ 实体

### 起始行

对于请求报文，起始行也叫**请求行**，具体由三部分组成，即 **请求方法 + 请求目标路径 + HTTP版本号**

```http
GET / HTTP/1.1
```

对于响应报文，起始行也叫**响应行**，具体也由三部分组成，即 **版本号 + 响应状态码 + 原因**

```http
HTTP/1.1 200 OK
```

### 头部

请求头和响应头的结构是基本一样的，它们在 HTTP 报文中的位置也一样。

<img src="@img/image-20210301131344664.png" alt="image-20210301131344664" style="zoom:80%;" />

<img src="@img/image-20210301131402963.png" alt="image-20210301131402963" style="zoom:80%;" />

请求头和响应头都是由一个个**头部字段**来组成的，头部字段是 key: value 的形式，key 和 value 之间用 `:` 分隔，最后用 CRLF 换行表示字段结束。HTTP 有各种各样的头字段，不仅能够使用标准里规定的字段，也可以添加自定义头字段，不过它们都遵循着下面的格式：

1. 字段名不区分大小写
2. 字段名不允许出现空格，可以使用 `-` 来连接字符，但不能使用 `_`
3. 字段名后必须紧跟着 `:`，不能有空格，而 `:` 后的字段值前可以有多个空格

```http
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

### 空行

空行是用来区分开头部和实体的。

如果在头部中间增加一个空行的话，那么空行后的内容都将被视为实体

### 实体

即具体的数据 body。请求报文为**请求体**，响应报文为**响应体**。