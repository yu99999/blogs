---
title: 10 实现数组sort方法
date: 2021-02-06
categories:
 - JavaScript
tags:
 - JS API原理
---



## 基本语法

sort 方法的语法如下

```js
arr.sort([compareFunction])
```

+ 如果没有指明 compareFunction，默认会将元素转为字符串，然后按照诸个字符的Unicode位点进行排序。
+ 如果指明 compareFunction，数组会按照调用该函数的返回值排序。假设 a 和 b 是两个比较的元素
  + 如果返回值小于 0，那么 a 会排在 b 的前面
  + 如果返回值等于 0，那么位置不变
  + 如果返回值大于 0，那么 a 会排在 b 的后面

```js
arr = [1,5,13,22,3]

arr.sort()				// [1, 13, 22, 3, 5]

arr.sort(() => -1)		// [3, 22, 13, 5, 1]

arr.sort((a, b) => a-b)	// [1, 3, 5, 13, 22]

arr.sort((a, b) => b-a)	// [22, 13, 5, 3, 1]
```



## 手写思路

对于 [V8 sort 源码](https://github.com/v8/v8/blob/98d735069d0937f367852ed968a33210ceb527c2/src/js/array.js#L709) 的思路，有以下结论，假设要排序的元素个数是 n 的时候：

+ 当 n <= 10，采用**插入排序**
+ 当 n > 10，采用**三路快速排序**
+ 当 10<n<=1000，采用中位数作为哨兵元素
+ 当 n > 1000，每隔 200~215 个元素就挑出一个元素放入新数组中，对新数组进行排序后，选取中间位置元素作为哨兵元素

```js
Array.prototype._sort = function(comparefn){
  const arr = Object(this);			// 先转为对象
  let length = arr.length >>> 0;	// 数组长度处理
  return InnerArraySort(arr, length, comparefn)
}

function InnerArraySort(arr, length, comparefn){
  // 没有传入比较函数的话，将值转为字符串再比较
  if(Object.prototype.toString.call(comparefn) !== "[object Function]"){
    comparefn = function(x, y){
      if(x === y) return 0;
      x = x.toString();
      y = y.toString();
      if(x === y) 
        return 0;
      else
        return x < y ? -1 : 1;
    }
  }

  function InsertionSort(arr, from, to){
    for(let i=from+1; i<to; i++){
      let ele = arr[i];
      let j;
      for(j=i-1; j>=from && comparefn(arr[j], ele)>0; j--){
        arr[j+1] = arr[j];
      }
      arr[j+1] = ele;
    }
    return arr
  }

  // 每隔 200~215 个元素就挑出一个元素放入新数组中，对新数组进行排序后，选取中间位置元素作为哨兵元素
  function GetThirdIndex(arr, from, to){
    // 递增量，处于 200~215之间
    let increment = 200 + ((to-from)&15);
    from++; to--;   // 去掉首尾，因为后续会使用到

    let tempArr = [];
    for(let i=from, j=0; i<to; i+=increment, j++){
      tempArr[j] = [i, arr[i]];
    }
    tempArr._sort((a, b) => a[1]-b[1]);
    // 返回中间元素，确保哨兵的值接近平均位置
    return tempArr[tempArr.length >> 1][0];
  }
  
  function QuickSort(arr, from, to){
    // 使用循环减少递归次数
    while(true){
      // 元素个数小于等于10使用插入排序
      if((to - from) <= 10){
        InsertionSort(arr, from, to)
        return;
      }

      // 哨兵元素
      let thirdIndex;
      if((to - from) > 1000){
        thirdIndex = GetThirdIndex(arr, from, to)
      }else{
        thirdIndex = from + ((to-from) >> 1)
      }
      
      // 将首、尾和中间位置排序
      let v0 = arr[from], v1 = arr[to-1], v2 = arr[thirdIndex]
      let tempArr = InsertionSort([v0, v1, v2], 0, 3);
      arr[from] = tempArr[0]; arr[thirdIndex] = tempArr[1]; arr[to-1] = tempArr[2];

      // thirdIndex 上的值为真正的哨兵元素
      let pivot = arr[thirdIndex];
      // 哨兵位置移至 from+1
      let lowEnd = from+1, highStart = to-1;
      [arr[lowEnd], arr[thirdIndex]] = [arr[thirdIndex], arr[lowEnd]]

      // [from...lowEnd) 是比基准值小的元素
      // [lowEnd...i) 是与基准值相等的元素
      // [hightStart...to) 是比基准值大的元素
      // [i...hightStart) 是需要处理的元素
      for(let i=lowEnd+1; i<highStart; i++){
        let ele = arr[i];
        let order = comparefn(pivot, ele);
        if(order > 0){
          arr[i] = arr[lowEnd]
          arr[lowEnd] = ele;
          lowEnd++;
        }else if(order < 0){
          do{
            highStart--;
            if(highStart === i) break;
            order = comparefn(pivot, arr[highStart]);
          }while(order < 0);
          arr[i] = arr[highStart];
          arr[highStart] = ele;
          if(order > 0){
            ele = arr[i];
            arr[i] = arr[lowEnd]
            arr[lowEnd] = ele;
            lowEnd++;
          }
        }
      }

      // 将 [from...lowEnd), [hightStart...to) 排序
      // 优先切割大区间，减少递归开销
      if(lowEnd-from > to-highStart){
        // 递归切割小区间
        QuickSort(arr, highStart, to)
        to = lowEnd;  // 切割大区间
      }else{
        QuickSort(arr, from, lowEnd)
        from = highStart;
      }
    }
  }
  
  QuickSort(arr, 0, length)
  return arr;
}
```



