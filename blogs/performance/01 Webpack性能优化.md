---
title: 01 Webpack性能优化
date: 2021-1-22
categories:
 - 前端性能
tags:
 - 前端性能
---



Webpack 对项目的性能优化可以分两个方面

+ 提升打包速度，加速我们的开发
+ 减小打包体积，使用户请求资源的体积减小

当然，性能优化这种东西不能一概而论，当场景不同时，优化的效果也会不同，必须落实到项目中去，实际操作出来才能得出结论。例如多进程构建资源的 thread-loader 在文件资源量较小时使用反而会带来反效果。

## 打包速度优化

### 1.  速度分析插件

在开始对 Webpack 打包速度进行优化之前，我们需要一个参考值，即优化后打包速度是否真的有提升。那么我们可以利用 speed-measure-webpack-plugin 来对打包速度进行分析，方便对比

```js
//webpack.config.js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const config = {
    //...webpack配置
}

module.exports = smp.wrap(config);
```

另外 speed-measure-webpack-plugin 和 HotModuleReplacementPlugin 不能同时使用，否则会报错



### 2. 开启多进程/多实例构建资源并行解析

可以使用 **thread-loader** 来开启多进程构建。

使用时，需将此 loader 放置在其他 loader 之前。放置在此 loader 之后的 loader 会在一个独立的 worker 池中运行。

在 worker 池中运行的 loader 是受到限制的。例如：

- 这些 loader 不能生成新的文件。
- 这些 loader 不能使用自定义的 loader API（也就是说，不能通过插件来自定义）。
- 这些 loader 无法获取 webpack 的配置。

因此，像 MiniCssExtractPlugin.loader 等一些提取出单独文件的 loader 是不能使用 thread-loader 的。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: [
          "thread-loader",
          // 耗时的 loader （例如 babel-loader）
        ],
      },
    ],
  },
};
```

除了 thread-loader 之外，也可以使用 happypack，它的原理以及使用都与 thread-loader 类似。

基本原理：首先当使用 happyLoader 对模块执行编译时，happpLoader 会拦截调用 happyPlugin.compiler (钩子)的 run 方法之后，进程就会到达 HappyPack，HappyPack 会做一些初始化，初始化之后会创建一个线程池，线程池会将构建任务里面的模块进行一个分配，比如会将某个模块以及它的一些依赖分配给其中的一个新创建出来的 HappyPack 子进程实例，以此类推，那么一个 HappyPack 包括多个子进程实例，这时候每个子进程实例会各自去处理其中的模块以及它的依赖，处理完成之后会有一个通信的过程，会将处理好的资源传输给HappyPack 的一个主进程，完成整个的构建过程。



### 3. 多进程/多实例并行压缩

在代码构建完成之后输出之前有个代码压缩阶段，这个阶段也可以通过并行压缩来达到优化构建速度的目的，我们可以利用以下插件

- webpack-parallel-uglify-plugin
- uglifyjs-webpack-plugin
- terser-webpack-plugin **(webpack4.0推荐使用，支持压缩es6代码)**

```js
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        //代码压缩插件
        parallel: 4, //开启并行压缩
      }),
    ],
  },
```



### 4. 通过分包提升打包速度

在通常情况下，我们的代码可以分为业务代码和第三方库，第三方库的代码我们基本上都不会去改动的。然而我们每次打包构建时都需要把所有代码重新构建一次。

这个时候就可以采用 webpack 官方内置的插件 DllPlugin 进行分包，把复用性较高的第三方模块打包带动态链接库中，在不升级这些库的情况下，每次打包都只重新打包业务代码，动态库不需要重新打包。



### 5. 通过缓存提升二次打包速度

- babel-loader 开启缓存
- terser-webpack-plugin 开启缓存（webpack默认开启）
- 使用 cache-loader或者 hard-source-webpack-plugin 为各种模块提供中间缓存

设置babel-loader的cacheDirectory=true开启缓存

```js
"babel-loader?cacheDirectory=true"
```

设置terser-webpack-plugin插件的cache: true开启缓存

```js
new TerserPlugin({
    //代码压缩插件
    parallel: 4, //开启并行压缩
    cache: true,
}),
```

使用 cache-loader或者 hard-source-webpack-plugin 为各种模块提供中间缓存

```js
// cache-loader
module.exports = {
  module: {
    rules: [
        {
            test: /\.jsx?$/,
            use: ['cache-loader','babel-loader']
        }
    ]
  },
};

//  hard-source-webpack-plugin 
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
    //...
    plugins: [
        new HardSourceWebpackPlugin()
    ]
}
```



### 6. 缩小构建目标

- 优化 resolve.modules 配置（减少模块搜索层级，例如babel-loader不解析 node_modules）
- 优化 resolve.mainFields 配置（例如只搜索 index 名文件）
- 优化 resolve.extensions 配置（例如只搜索 .js 或.jsx 文件）



### 7. 选择合适的 map

+ eval：使用eval包裹模块代码

+ source map：生成 .map 文件
+ inline：Source Map内容通过base64放在js文件中引入。
+ cheap：这个关键字用于指定调试信息的完整性。不包含列信息，源码是进过loader处理过的
+ cheap-module：不包含列信息，源码是开发时的代码

| devtool                      | 构建情况                                    |
| ---------------------------- | ------------------------------------------- |
| none                         | 默认，打包后的代码                          |
| eval                         | webpack + loader处理后的代码                |
| source-map                   | 将原代码映射出来生成一个.map文件，性能最差  |
| eval-source-map              | 源码，且包含列信息                          |
| eval-cheap-source-map        | loader处理后的代码，但webpack还没有进行处理 |
| eval-cheap-module-source-map | 源码，不包含列信息                          |

具体哪个环境下用哪个 source map 要由实际情况而论，对于网上的最佳实践是这个样子的

+ 开发环境：`cheap-module-eval-source-map` 源代码映射后使用 eval 包裹
+ 生产环境：`cheap-module-source-map` 将原代码映射到单独的 .map 文件



## 打包体积优化

### 1. 打包体积分析插件

与优化打包速度一样，我们需要对比优化前后的效果，而体积分析的插件可以使用 webpack-bundle-analyzer

```javascript
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
}
```



### 2. 压缩代码体积

+ terser-webpack-plugin 压缩js文件
+ optimize-css-assets-webpack-plugin 压缩css文件
+ html-webpack-plugin 压缩html文件



### 3. tree-shaking

如果使用ES6的 import 语法，那么在生产环境下，会自动移除没有使用到的代码。

原理：Tree Shaking 是在编译时进行无用代码消除的，因此需要在编译时确定依赖关系，进而确定哪些代码可以被摇掉，这就是 ESM 的优势。反观 CommonJS，由于它是在执行代码才能动态确定依赖，所以不具有 Tree Shaking 的能力。

对于副作用模块，可以在 package.json 进行配置

```json
{
    "sideEffects": ["*.css"]	// 所有css文件模块都有副作用
}
```



### 4. scope hosting 作用域提升

Webpack4 中的生产环境下已默认启用 scope hosting

不使用 scope hosting 的缺点：

+ 产生大量函数闭包包裹代码，导致体积增大
+ 运行代码时创建的函数作用域变多，内存开销变大



### 5. IgnorePlugin

webpack 的内置插件，作用是忽略第三方包指定目录。

例如: moment (2.24.0版本) 会将所有本地化内容和核心功能一起打包，我们就可以使用 IgnorePlugin 在打包时忽略本地化内容。

```js
//webpack.config.js
module.exports = { 
    //...
    plugins: [
        //忽略 moment 下的 ./locale 目录
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
}
```

在使用的时候，如果我们需要指定语言，那么需要我们手动的去引入语言包，例如，引入中文语言包:

```js
import moment from 'moment';
import 'moment/locale/zh-cn';// 手动引入
```



## 其他优化

### 提取文件或代码分割

提取文件并且利用文件的 hash 值能够有效地利用浏览器缓存，减少请求次数，其中有以下几种方式让我们

+ optimization.runtimeChunk 提取 runtime 文件
+ optimization.splitChunks 代码分割
+ mini-css-extract-plugin 代替 style-loader 提取css文件 或者 extract-text-webpack-plugin

``` js
module.exports = { 
    optimization: {
        splitChunks: {
          chunks: 'all'
        },
        runtimeChunk: {   // 将 runtime 文件提取出来
          name: entrypoint => `runtime~${entrypoint.name}`
        }
    }
}

```

当使用 style-loader 时，是将 css 放置在 style 标签并插入到head中。

而 mini-css-extract-plugin 插件是将 css 提取为一个单独的 css 文件，并且能增加 hash 功能来代替 style-loader



### 预拉取和预加载模块

+ webpackPrefetch ：预拉取，会在浏览器空闲时间拉取内容
+ webpackPreloading ：预加载，会在与目标文件一同加载

```js
btn.onclick = () => {
    // 利用魔法注释进行声明
  import(/* webpackPrefetch: true, webpackChunkName: "chunk" */'./chunk').then(({default: func}) => {
    func()
  })
}
```

