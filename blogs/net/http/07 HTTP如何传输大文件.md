---
title: 07 HTTP如何传输大文件
date: 2021-03-16
categories:
 - 网络协议
tags:
 - HTTP
---



对于资源比较大的文件，例如几 M 、几百 M 甚至上 G 的大文件，一口气传输过来是不现实的，并且带宽是有上限的。那么如何在有限的带宽下高速传输这些大文件就成了一大问题。

## 数据压缩

在实体数据那篇文章中，我们知道可以利用 Accept-Encoding 和 Content-Encoding 来实现数据压缩，将大文件缩小。

但是这个解决办法有缺点，这些压缩算法通常对文本文件有比较好的压缩率，然而对图片、视频这类本身就高度压缩的文件就无济于事了。



## 分块传输

分块传输时一种化整为零的思想，也就是将大文件拆分成一个个小块后逐个发送，最后拼接在一起便可以了。

在 HTTP 中对于分块传输有两种方式，一种是针对定长数据，一种是针对不定长数据，它们使用的头字段分别是 Content-Length 和 Transfer-Encoding。这两个响应头字段是互斥的，无法同时出现。

```js
Content-Length: 10

Transfer-Encoding: chunked
```



 ## 范围请求

仅仅有分块传输还不够，例如当我们看视频时，对进度条的拖动，这时仅仅只需要一个资源片段，那么就可以使用范围请求了。

当然前提需要服务器支持，所以服务器可以在响应头中设置字段，来明确告知客户端，服务端是支持范围请求的

```js
Accept-Ranges: bytes
```

那么客户端便可以设置请求头 Range 来请求资源片段，值是 `bytes=x-y`，其中 x, y 的判定如下

+ 0-99 表示从起点到第99个字节
+ 100- 表示从第99个字节到终点
+ -100 表示文件最后100个字节

```js
Range: bytes=0-99
```

当服务器收到 Range 字段后，便会进行如下处理

1. 检查范围是否合法，若范围越界，则返回**状态码416**
2. 若范围正确，则根据范围计算偏移量并读取文件片段，然后返回**状态码206**
3. 同时添加响应头字段 Content-Range，格式是 `bytes x-y/length`，该头字段根据请求头 Range 的不同也会有所不同，具体分为单段数据和多段数据

### 单段数据

单段数据的请求头

```js
Range: bytes=0-9
```

返回的响应

```http
HTTP/1.1 206 Partial Content
Content-Length: 10
Accept-Ranges: bytes
Content-Range: bytes 0-9/100

body xxxxx
```



### 多段数据

当涉及到多段数据传输时，Range 头使用多个 x-y 来获取多个片段

```js
Range: bytes=0-9, 30-39
```

响应头中会表明一个特殊的数据类型 multipart/byteranges 来表示报文 body 是由多段字节序列组成的，并且还会携带一个参数 `boundary=xxx` 来区分不同的片段

```http
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000000001
Content-Length: 189
Connection: keep-alive
Accept-Ranges: bytes


--00000000001
Content-Type: text/plain
Content-Range: bytes 0-9/100

body xxxxx
--00000000001
Content-Type: text/plain
Content-Range: bytes 30-39/100

body xxxxx
--00000000001--
```

