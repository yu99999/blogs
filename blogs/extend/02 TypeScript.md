---
title: 02 TypeScript
date: 2021-06-17
categories:
 - 扩展
tags:
 - 扩展
---



## 什么是 TypeScript

[TypeScript](https://www.tslang.cn/index.html)是 JavaScript 的超集，它可以编译成纯 JavaScript，本质上是向 JavaScript 添加了可选的静态类型和基于类的面向对象编程。

TypeScript 有这下面这些特点：

1. 一般用于解决大型项目的代码复杂度
2. 在编写代码时，ts 会帮助你发现潜在的问题，能够在编译期间发现并纠正错误
3. 支持静态和动态类型（JavaScript 是动态类型）
4. 更好的语法提示

可以在全局安装 ts 以及 ts-node 来帮助我们开发

```js
npm install -g typescript
npm install -g ts-node
// 无法使用 node xxx.ts 来直接运行 ts 文件，所以安装 ts-node后可用 ts-node xxx.ts 来直接运行 ts 文件
```

安装后可使用 tsc 命令将 ts 文件编译为 js 文件

```
tsc index.ts
// index.ts -> index.js
```



## TypeScript 类型

### 基础类型

1. Boolean 类型
2. Number 类型
3. String 类型
4. Null 类型和 Undefined 类型：所有类型的子类型，可以把 null 和 undefined 赋值给其他类型的变量
5. Array 类型
6. Any 类型：表示可声明为任意类型
7. Tuple 类型：元组类型，定义数组中每个变量存储不同的类型
8. Void 类型：当一个函数没有返回值时可设置类型为 void
9. Never 类型：永不存在值的类型，表示那些总是会抛出异常或无法到达终点的函数表达式的返回值类型
10. Enum 类型：定义带名称的常量，默认会从 0 开始自动增长
11. 手动赋值

```ts
// 1. Boolean 类型
let flag: boolean = false;

// 2. Number 类型
let num: number = 1;

// 3. String 类型
let str: string = 'abc';

// 4. Null 类型和 Undefined 类型
let u: undefined = undefined;
let n: null = null;

// 5. Array 类型
let arr: number[] = [1, 2, 3];  // 数组只能包含数字类型
let arr2: Array<number> = [1, 2, 3];  // 泛型语法
let arr3: (number | string)[] = [1, 2, '3']   // 数组可包含数字和字符串

// 6. Any 类型
let val: any = 123;
val = 'abc';  // 可声明为任意类型

// 7. Tuple 类型
let list: [string, string, number] = ['1', '2', 3];   // 严格按照定义的类型

// 8. Void 类型
const fn = function(): void{}
const fn1: () => void = () => {}

// 9. Never 类型
const fn2 = function(): never{
  throw new Error('error...')
}
const fn3 = function(): never{
  while(true){}
}

// 10. Enum 类型
enum Status {
  FIRST,
  SECOND,
  THIRD
}

// 11. 手动赋值
const a: 'a' = 'a'
const b: 'abb' | 'abc' = 'abc'
```



### 对象类型 -- 类

#### 接口

接口是对行为的抽象，具体如何是通过类去实现的。

```ts
interface Person{
  name: string,
  readonly sex: string,   // 只读
  say(): void,    // 方法
  age?: number,   // ? 表示选填
  [propName: string]: any   // 可接受其他任意参数
}

interface Teacher extends Person{   // 继承接口属性
  teach(): string
}

class User implements Person{   // 把类使用接口去约束
  name = 'a';
  sex = 'male';
  say(){};
  constructor(){
    console.log(this.name)
  }
}

const teacher: Teacher = {
  name: 'a',
  sex: 'men',
  say(){},
  teach(){
    return '语文'
  }
}
```

#### public、protected、private

+ public：允许在类内和类外调用
+ protected：允许在类内以及继承的子类中调用
+ private：只允许在类内调用

```ts
class Person {
  public name: string;
  protected phone: string;
  private age: number;
  constructor(name: string, phone: string, age: number){
    this.name = name;
    this.phone = phone;
    this.age = age;
    console.log(this.age)
  }
}

// 以下是上面的简化写法
// class Person {
//   constructor(public name: string, protected phone: string, private age: number){
//     console.log(this.age)
//   }
// }

class Teacher extends Person{
  constructor(name: string, phone: string, age: number){
    super(name, phone, age);
    console.log(this.phone);
  }
}

const teacher: Teacher = new Teacher('a', '110', 18);
console.log(teacher.name)
```

public、protected、private 只是 ts 在帮你检查语法时会有提示，当你实际将 ts 编译成 js 后，其实都是 public，即外部都能够访问

#### 访问器

我们可以通过 getter 和 setter 方法实现数据的封装来保护类内部的私有变量

```ts
class Person {
  constructor(private _name: string){}
  get name(){
    return '马' + this._name
  }
  set name(name: string){
    this._name = name;
  }
}

const person = new Person('化腾')
console.log(person.name)
person.name = '云'
console.log(person.name)
```



## 类型保护

类型保护是可执行运行检测的一种表达式，用于确保该类型在一定的范围内。简单来说，我们通过某种方式确保某个变量一定属于某种类型，比如确保字符串一定是字符串。类型保护一般用于联合类型（变量可以是多种类型）

我们可以使用多种方式实现类型保护。

### 1. 断言

我们比 TypeScript 更加清楚某个变量的类型，但此时没有类型检查和语法提示，这时可以利用断言来确保变量的类型

```ts
let str: any = 'abc'
let len: number = (str as string).length;
// 还有下面这种写法
// let len: number = (<string>str).length;
```

### 2. in 关键字

```ts
interface Bird{
  eat: string,
  fly: () => void
}
interface Dog{
  eat: string,
  run: () => void
}

function trainAnimal(animal: Bird | Dog){
  if('fly' in animal){
    animal.fly()
  }else{
    animal.run()
  }
}
```

### 3. typeof 关键字 

```ts
function add(first: number | string, second: number | string){
  if(typeof first === 'string' || typeof second === 'string'){
    return `${first}${second}`;
  }
  return first + second;
}
```

### 4. instanceof 关键字

```ts
class NumObj{
  count: number;
  constructor(count: number){
    this.count = count;
  }
}
function add(first: object | NumObj, second: object | NumObj){
  if(first instanceof NumObj && second instanceof NumObj){
    return first.count + second.count;
  }
  return 0
}
```

## 泛型

泛型是允许同一个函数接受不同类型参数的一种模板。比 any 类型比起来，使用泛型创建可复用的组件要更好

### 1. 函数泛型

```ts
function add<T, P>(first: T, second: P){
  return first + '' + second
}
add<string, number>('1', 2);


interface Info{
  name: string
}
function map<T>(data: T[]): Array<T>{
  return data;
}
map<Info>([{name: '2'}])
```

### 2. 类的泛型

```ts
interface Item{
  id: number
}
class Manager<T extends Item>{
  constructor(private data: T[]){}
  getItem(index: number): T{
    return this.data[index];
  }
}

const data = new Manager([{id: 2}]);
data.getItem(0)
```

### 3. 接口泛型

```ts
interface Data<T>{
  list: T[],
  date: Date
}
```

### 4. 泛型工具 keyof

keyof 操作符可以用来表示一个对象中的所有 key 值

```ts
interface Info {
  name: string,
  age: number,
  sex: string
}

class Teacher{
  constructor(private info: Info){}
  // 这里的泛型 T 代表 Info 的所有 key 值，即 name、age、sex
  getInfo<T extends keyof Info>(key: T): Info[T]{
    return this.info[key]
  }
}

const teacher = new Teacher({
  name: 'ab',
  age: 18,
  sex: 'man'
})
const age = teacher.getInfo('age')
```



## 装饰器

装饰器本身是一个函数，顾名思义，是用来对类、方法、属性等进行装饰用的。装饰器目前仍属于实验性的语法，若想使用需要在 tsconfig.json 中配置以下选项。

```json
/* tsconfig.json */
{
  "compilerOptions": {
    /* 实验性选项 */
    "experimentalDecorators": true,        /* 启用ES7装饰器 */
    "emitDecoratorMetadata": true,         /* 为装饰器提供元数据支持 */
  }
}
```

装饰器有以下几种分类

```ts
// 类装饰器
declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
// 属性装饰器
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
// 方法装饰器
declare type MethodDecorator = <T>(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
// 参数装饰器
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol, parameterIndex: number) => void;
```

### 1. 类装饰器

类装饰器接收一个目标类的参数，它会在类创建之前执行

```ts
function testDecorator(greeting: string){
  return function(target: Function){
    target.prototype.greet = function(){
      console.log(greeting)
    }
  }
}

@testDecorator('hello')
class Test{}

(new Test() as any).greet()
```

### 2. 属性装饰器

```ts
function nameDecorator(target: Object, key: string){
  console.log(target, key)
  let _name: string = '';
  Object.defineProperty(target, key, {
    get(){
      return _name
    },
    set(name){
      _name = '马' + name
    }
  })
}

class Test{
  @nameDecorator
  name = '云';    // 属性装饰器会先执行，后再进行赋值
}
```

### 3. 方法装饰器

```ts
// target: 类的 prototype，key: 方法的 key，descriptor: 方法的修饰符
function catchError(msg: string){
  return function(target: object, key: string, desc: TypedPropertyDescriptor<(...args: any[]) => any>){
    if(desc.value === undefined) return;
    const fn = desc.value;
    desc.writable = true;
    desc.value = (...args: any[]) => {
      try {
        fn(...args)
      } catch (e) {
        console.log(msg)
      }
    }
  }
}

const info: any = undefined
class Test{
  @catchError('name 不存在')
  getName(lastName: string){
    return info.name + lastName
  }

  @catchError('age 不存在')
  getAge(){
    return info.age
  }
}
```

### 4. 参数装饰器

```ts
function paramDecorator(target: object, key: string, index: number){
  console.log(target, key, index)
}

class Test{
  name: string = 'a';
  getName(@paramDecorator name: string){
    return this.name
  }
}
```



## tsconfig.json

tsconfig.json 用于标识项目的根目录，即如果一个目录下存在 tsconfig.json 文件，那么意味着这个目录是 TypeScript 项目的根目录。另外，tsconfig.json 文件中指定了用来编译这个项目的根文件和编译选项。

tsconfig.json 有几个重要的字段：

+ files：指定要编译的文件名称
+ include：指定需要进行编译的文件
+ exclude：指定无需进行编译的文件
+ compilerOptions：设置编译流程的相关选项，最为重要的选项

其中 compilerOptions 字段中的具体配置可以参考 [TS官方文档](https://www.tslang.cn/docs/handbook/compiler-options.html)











