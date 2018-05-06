# this乱侃
## 关于class
因为面向过程描述复杂概念不够给力，所以提出了面向对象。这种想法非常符合直觉，我们可以给待处理的事物分类，然后被分到同一类的事物可以使用相同的处理方法，处理不同的数据。这样可以少写很多冗余代码，可以少加班多泡妞，走向人生巅峰。
## 类的方法（不同实例指向同一个方法）
比如下面被各种书写烂的类似代码：
```javascript
// es6
class Car {
  run () {}
}

class Benz extends Car {}
class BMW extends Car {}

const car1 = new Benz('GLK')
const car2 = new BMW('530')

car1.run('50mph')
car2.run('50mph')
```

显然给所有的car写一个通用的`run`方法就行了，他们跑起来是靠同一套热力学定律，同一套机械学定律，同一套化学原理。如果为每一个原子写一套物理定律，肯定要吃屎。

所以很自然的，这个表达式一定为`true`：`car1.run === car2.run`，你可以在`console`里做如下尝试：
```javascript
// es6
// 对于非基本类型（非Number，String，Boolean这种），
// 如果其内存地址是指向同一处，那么三等于号（===）返回true，否则返回false。
// 以下全是true
[1,2,3].map === [1,2,3,4].map
[1,2,3].map === [5,6,7].map
[1,2,3].map === Array.prototype.map // prototype这个臭傻逼等下说。
// 关于prototype可以暂时理解为这样的操作：Array.getClassObjectItself()，获取真正干活的那个家伙、那个类
```

> 结论：类的某个方法，比如`run`，`map`，都是指向内存中同一块代码地址。

## this（动态的变量，被系统*偷偷*赋值）
考察以下我们自己实现面向对象要怎么做，首先我们需要一个变量来指代你预想中的一辆`Car`，比如叫self吧，我们可以把`run`方法写成如下形式：
```javascript
Car.run = function run (self, speed) {
  let fuelVolumn = self.getFuelVol(speed) // 根据形式速度计算燃料需求量
  self.pumpFuel() // 泵送燃料
  self.ignite() // 点火
  self.doWork() // 做功
  self.transmission() // 传动
  // ...
}

run(car1, '50mph')
run(car2, '100mph')
```

所以很自然地，我们会想到在`console`中能不能这么写：`Array.prototype.map([1,2,3], x => x+1)`，然后期望返回`[2,3,4]`。很遗憾这么写会吃屎，`Array.prototype.map`只接受一个参数，这个参数是你要map的方式（此处就是`x => x+1`)。这个console会报错说参数[1,2,3]是Array而不是Function。

实际上，js的最初作者可能为了早点下班去泡妞，所以做了个非常水逼的实现面向对象的架构（大雾）。如果你熟悉`python`的话，在上面的思想是正确的，python中可以这么写：

```python
>>> 'abcde'.startswith('abc')
True
>>> str.startswith('abcde', 'abc')
True
```

下面回到javascript，我们平时的惯用写法是这样子的：
```javascript
car1.run('100mph')
car2.run('100mph')

// or
[1,2,3,4].map(x => x + 1) // return [2,3,4,5]
[4,5,6].map(x => x + 1) // return [5,6,7]
```

那么问题来了，既然`[1,2,3,4].map === [4,5,6].map`是true，那按照推理，同一个函数，传入相同的参数应该返回相同的值，除非他有副作用（他不是纯函数），他*偷偷*改变了环境中的某个变量。

显然，傻叉都知道，map方法中，解释器*偷偷*改变了this。`python`中，是你自己改变了`self`：`str.startswith('abcde', 'abc')`，其中第一个参数就是self。而javascript是*偷偷*改变的，解释器实际上*偷偷*调用了`bind`函数。

你可以在console中做如下尝试：
```javascript
Array.prototype.map.bind([1,2,3], x => x+1) // return [2,3,4]
Array.prototype.map.bind([4,5,6,7], x => x+1) // return [5,6,7,8]
// 记住，prototype，就相当于获得那个真正干活的：getTrueClassItself
// 可以理解为：TrueArrayClass.map.bind([1,2,3], x => x+1)
```
这样的话，基本就和`python`一致了，毕竟编译器的套路都差不多的。

所以实例使用点号"."获取成员函数**并且调用**了它，就会隐式地使用`bind`来绑定`this`，换言之，`[1,2,3].map`仅仅返回了那个通用的map函数，this没有被绑定，它指向`global`或者`window`，但是如果map后面带括号，那么就是**调用了函数**，编译器在此时会*偷偷*使用`bind`来把前面用了点号"."的那个家伙绑定给this，谁点出来的，就偷偷绑定谁，前提是要带括号调用了函数。

那么现在你应该了解了，`setTimeout(car1.run, 1000)`这样的写法会吃屎了吧，1秒后car1是不会动的，不管你传给`setTimeout`的是啥，`car2.run`也好，`car3.run`也好，都没卵用，你传的都是`Car.prototype.run`，并且`this`没有被绑定（那就是默认绑定了`global`或者`window`，然后因为`run`中调用了`this.getFuelVol`，而`window.getFuelVol`是`undefined`，那么相当于`undefined('50mph')`，就会报错`undefined is not a function`这种狗屎一般的错误提示）

所以，就算你在setTimeout之前加上`var that = this`，`let shit = this`，`const fuck = this`，都是没有任何卵用的，你必须使用`setTimeout(car1.run.bind(car1), 1000)`，或者`setTimeout(Car.prototype.run.bind(car1), 1000)`才行。

具体的，你可以在console中尝试如下代码：
```javascript
// es6
// 建议手动键入console，直接copy，貌似会有奇怪的符号输入console
Array.prototype.log = (x) => console.log('传入参数:', x, '\nthis 指向了:', this)
// es5
Array.prototype.log = function (x) {
  console.log('传入参数:', x, '\nthis 指向了:', this)
}

// test
[1,2,3].log('arg1')
Array.prototype.log.bind([4,5,6])('asdf')

// 下面要吃屎
setTimeout([4,5,6].log, 1000, 'xxx')

// 下面都可以，第二个是因为满足了之前提到的两个条件1: 实例点出方法；2：方法被调用（后面有一对括号）
setTimeout(Array.prototype.log.bind(['a', 'b']), 500, 'bind is OK!')
setTimeout(function () {
  ['c', 'd'].log('function warp is OK!')
}, 2000)
```

*注：`bind`是纯的绑定this操作，仅仅“传入”this指针，额外参数要后面另外开个括号传入，比如上面那个`Array.prototype.log.bind([4,5,6])('asdf')`。如果用call，那么可以一次传入所有参数：`Array.prototype.log.call([4,5,6], 'asdf')`，至于`apply`，其实就是call的马甲，call第一个参数是传入实例（然后被绑定到this）后面是其他参数，`apply`第一个参数同`call`，但是后面第二个参数必须是数组，数组里放剩余的所有参数。如果你熟悉es6的数组展开式，那么`apply(self, argArr)` 相当于 `call(self, ...argArr)`，其中`argArr`是一个数组*

> 结论：既然`[1,2,3].map`就是`[4,5].map`就是`Array.prototype.map`，那么就要有一个地方让`this`给绑定到具体的[1,2,3]或者[4,5]等等，这个过程发生在`实例.方法()`上，就是说，要用实例点出来方法，并且有一对括号调用了该方法。想想上面setTimeout的例子吧。

## 箭头函数就是解释器替你写：`var that = this`
前面说过，要自动绑定（或者说让解释器*偷偷*绑定）this，必须满足两个条件：
1. 实例点出方法
2. 方法后面要有一对括号，就是方法要被调用

this被绑定的正确示例：
```javascript
car1.run('50mph') // 点出并调用，OK
Car.prototype.run.bind(car2)('100mph') // 用bind强制绑定，OK
setTimeout(() => car1.run('50mph'), 1000) // 点出并调用，OK
```

this绑定错误示例：
```javascript
let car1Run = car1.run; car1Run('50mph') // 没有括号调用，你的run就是我的run，大家run，无主的run
setTimeout(car2.run, 1000, '50mph') // 吃屎不解释
```

但是很多时候，我们要传入一个回调函数（或者高阶函数，比如map之类的），而不是传入函数后立即调用它（也就是说，我本来就是不想加括号啊喂！！！），比如下面的某个方法内部（为了清晰说明，没有使用匿名函数）：
```javascript
// in a certain class
Array.prototype.log2 = function () {
  // ...
  const noBoundCB = function () {
    console.log('no bound callback:')
    console.log('"this" => pointed to:', this)
  }
  const boundCB = function () {
    console.log('bound callback:')
    console.log('"this" => pointed to:', this)
  }.bind(this)
  
  setTimeout(noBoundCB, 1000)
  setTimeout(boundCB, 2000)
};

[4,5,6].log2();
[1,2].log2();
```

前面说了，`bind`其实就是把实例传入this，其实就是传参数，什么*动态绑定*啊之类的说法，纯粹就是装逼，听着好像很吊的样子。它就是把诸如`[1,2,3]`之类的传入`log`方法。所以你当然可以用一个普通的变量，通过闭包的方式弄到回调函数里面，这就是`var that = this`了
```javascript
// in a certain class
Array.prototype.log3 = function () {
  // ...
  var that = this
  const callback = function () {
    console.log('"this" => pointed to:', this) // this会动态改变，代码真正运行到此处时，你不知道this被谁草了，换了谁的孩子。
    console.log('"that" => pointed to:', that) // 相反，that作用域就在这个方法内，就被你草过，你非常清楚，非常可控。
  }
  setTimeout(callback, 1000)
};

[4,3,2].log3();
[6,7,8].log3();
```

说到**作用域**，javascript里有两种，就是*动态作用域*和*词法作用域*，听起来好像很吊很装逼（特别后面那个），其实前者就是说的`this`这种，特殊变量，**鸡**一般存在，不知道什么时候被谁草过；后者就是指普通的比如`that`这种变量，之所以叫*词法*作用域，是因为它只跟*代码上文*提到时的情景有关，而箭头函数，就是把`this`变成词法作用域，变成*良民*。如下所示：
```javascript
// in a certain class
Array.prototype.log4 = function () {
  // ...
  // console.log(this) // 在箭头函数前this指向谁，箭头函数里的this就指向谁
  const callback = () => {
    console.log('"this" => pointed to:', this)
  }
  setTimeout(callback, 1000)
};

[4,3,2].log4();
[6,7,8].log4();
```

其内部机理就是，箭头函数暂时改变了this的作用域类型，变成了词法作用域，上面console一句中，this还在普通function中，所以它指向动态的this，*对于此例，[1,2,3].log4()，被实例点出，同时被调用，this绑定了[1,2,3]*。所以如果你好奇，比如log5直接用箭头函数会怎样，那么如你所愿：

```javascript
// in a certain class
Array.prototype.log5 = () => {
  // ...
  // console.log(this) // 在箭头函数前this指向谁，箭头函数里的this就指向谁
  const callback = () => {
    console.log('"this" => pointed to:', this)
  }
  setTimeout(callback, 1000)
};

[4,3,2].log4();
[6,7,8].log4();
```

其实箭头函数会忠实地使用它代码上文环境中的this指针，此处是window。如果你把log5定义在其他this环境中并且通过比如return的方式给到Array.prototype，那么它就会使用那个this。假设log5定义在Car的run方法里，那么`[1,2,3].log5()`就可能会打印出car1，car2等。当然如果你不觉得这个this很混乱很乱伦，也可以理解为这种机制很*灵活*

*注：如果箭头函数中又有function，那么this的作用域又会变回动态作用域*

> 这个this，可以这么理解：在箭头函数之前写个this，这个this指向谁，他就在箭头函数里指向谁，如上面的注释。

## function和箭头函数比较
处了以上区别，箭头函数没有arguments！

另外，动态作用域也并非完全吃屎，箭头函数也不是完全能替代function。比如：
1. 在类方法定义中，你首先要有动态作用域获得this，然后才能在里面愉快地使用箭头函数。
2. 在Vue等等有各种神奇功能的库中，你传入Vue构造器的那个Object，里面的computed，methods等等，最好别用箭头函数，Vue会给你调教好的this（当然你理解为强X也行，强制绑定），用起来才会倍儿爽，令人印象深刻技艺高超的this。

## 扩展阅读
可以把this这个动态作用域理解成自然语言中的代词，比如“你”、“我”、“它”这种，假设有一句话叫“你就是个傻叉”，这话在我口中对你说，和在你口中对她说，意思是完全不一样的，这句话在被真正说出来之前，后果是不那么好预料的。“你”这个词，具体指代谁是会变的，除非像写`var that = this`一样，把指代写死：“此处‘你’指代XXX；你就是个傻叉”

# --END--
