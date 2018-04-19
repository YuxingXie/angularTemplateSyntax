# AngularTemplateSyntax

本研究项目用于研究angular模板语法，技术资料参见angular中文官网。一般概念仅在此列出，难点详细研究。

# 知识点
## 插值表达式
```angular2html
    <h3>
      {{title}}
      <img src="{{heroImageUrl}}" style="height:30px">
    </h3>
```
* 插值表达式可以把计算后的字符串插入到 HTML 元素标签内的文本或对标签的属性进行赋值。    
* 一般来说，括号间的素材是一个`模板表达式`，Angular 先对它求值，再把它转换成字符串。
* 表达式可以调用宿主组件的方法。
* 插值表达式是一个特殊的语法，Angular 把它转换成了`属性绑定`（将会详细研究）。
## 模板表达式(Template expressions)
* 模板表达式产生一个值。 Angular 执行这个表达式，并把它赋值给绑定目标的属性，这个绑定目标可能是 HTML 元素、组件或指令。
```angular2html
{{1 + 1}} //模板表达式是 1 + 1
[property]="expression" //属性绑定
```
JavaScript 中那些具有或可能引发副作用的表达式是被禁止的，包括：
* 赋值 (=, +=, -=, ...)
* new 运算符
* 使用 ; 或 , 的链式表达式
* 自增和自减运算符：++ 和 --

和 JavaScript 语 法的其它显著不同包括：
* 不支持位运算 | 和 &
* 具有新的模板表达式运算符，比如 |(管道操作符)、?.(安全导航操作符) 和 !(非空断言操作符)。

## 表达式上下文 (Expression context)
* 典型的表达式上下文就是这个组件实例，它是各种绑定值的来源。 在下面的代码片段中，双花括号中的 title 和引号中的 isUnchanged 所引用的都是 AppComponent 中的属性。<br>  
`src/app/app.component.html`
```angular2html
    {{title}}
    <span [hidden]="isUnchanged">changed</span>
```
* 表达式的上下文可以包括组件之外的对象。 比如模板输入变量 (let hero)和模板引用变量(#heroInput)就是备选的上下文对象之一。<br>

`src/app/app.component.html`
```angular2html
//模板输入变量和模板引用变量概念稍后深入，现在可以理解为声明了2个变量hero和heroInput
<div *ngFor="let hero of heroes">{{hero.name}}</div>
<input #heroInput> {{heroInput.value}}
```
* 表达式中的上下文变量是由模板变量、指令的上下文变量（如果有）和组件的成员叠加而成的。如果你要引用的变量名存在于一个以上的命名空间中，那么，模板变量是最优先的，其次是指令的上下文变量，最后是组件的成员。<br>
* 上一个例子中就体现了这种命名冲突。组件具有一个名叫 hero 的属性，而 *ngFor 声明了一个也叫 hero 的模板变量。 在 {{hero.name}} 表达式中的 hero 实际引用的是模板变量，而不是组件的属性。
注：无论如何我们也应该避免命名冲突，即便没有产生副作用
* 模板表达式不能引用全局命名空间中的任何东西，比如 `window` 或 `document`。它们也不能调用 `console.log` 或 `Math.max`。 它们只能引用表达式上下文中的成员。
## 表达式指南
模板表达式能成就或毁掉一个应用。请遵循下列指南：
* 没有可见的副作用
* 执行迅速 
* 非常简单
* 幂等性

超出上面指南外的情况应该只出现在那些你确信自己已经彻底理解的特定场景中。
### 没有可见的副作用
模板表达式除了目标属性的值以外，不应该改变应用的任何状态（注：不可赋值，不可自增自减基本保证了其无副作用）。<br>

这条规则是 Angular “单向数据流”策略的基础。 永远不用担心读取组件值可能改变另外的显示值。在一次单独的渲染过程中，视图应该总是稳定的。<br>
(注：与react理念一致)
### 执行迅速
Angular 会在每个变更检测周期后执行模板表达式。 它们可能在每一次按键或鼠标移动后被调用。

表达式应该快速结束，否则用户就会感到拖沓，特别是在较慢的设备上。 当计算代价较高时，应该考虑缓存那些从其它值计算得出的值。
### 非常简单
虽然也可以写出相当复杂的模板表达式，但不要那么写。

常规是属性名或方法调用。偶尔的逻辑取反 (!) 也还凑合。 其它情况下，应在组件中实现应用和业务逻辑，使开发和测试变得更容易。
### 幂等性
最好使用幂等的表达式，因为它没有副作用，并且能提升 Angular 变更检测的性能。
在 Angular 的术语中，幂等的表达式应该总是返回完全相同的东西，直到某个依赖值发生改变。

在单独的一次事件循环中，被依赖的值不应该改变。 如果幂等的表达式返回一个字符串或数字，连续调用它两次，也应该返回相同的字符串或数字。 如果幂等的表达式返回一个对象（包括 Date 或 Array），连续调用它两次，也应该返回同一个对象的引用。
##模板语句
模板语句用来响应由绑定目标（如 HTML 元素、组件或指令）触发的事件。 模板语句将在事件绑定一节看到，它出现在 = 号右侧的引号中，就像这样：(event)="statement"。<br>

`src/app/app.component.html`
```angular2html
<button (click)="deleteHero()">Delete hero</button>
```
模板语句有副作用。 这是事件处理的关键。因为你要根据用户的输入更新应用状态。 

响应事件是Angular中“`单向数据流`”的另一面。在一次事件循环中，可以随意改变任何地方的任何东西。

和模板表达式一样，模板语句使用的语言也像JavaScript。模板语句解析器和模板表达式解析器有所不同，特别之处在于它支持基本赋值(=)和表达式链(;和,)(注：相当于代码块)。 

然而，某些 JavaScript 语法仍然是不允许的： 
* new 运算符
* 自增和自减运算符：++ 和 --
* 操作并赋值，例如 += 和 -=（注：++和--特例）
* 位操作符 | 和 &
* 模板表达式运算符（注：即管道操作符、安全导航操作符和非空断言操作符） 

（注：既然接受用户输入那为什么不可以自增自减new等操作？大概是angular认为这些操作应该放在组件而非模板中，模板仅仅充当视图而组件充当控制器）
### 语句上下文
和表达式中一样，语句只能引用语句上下文中 —— 通常是`正在绑定事件的那个组件实例`。 

典型的语句上下文就是当前组件的实例。 (click)="deleteHero()" 中的 deleteHero 就是这个数据绑定`组件上的一个方法`。

`src/app/app.component.html`
```angular2html
<button (click)="deleteHero()">Delete hero</button>
```
语句上下文可以`引用`(注：所谓引用一般说来是充当方法参数)模板自身上下文中的属性（注：$event应该是一个内置变量，模板输入变量和模板引用变量类似于模板内声明的变量）。在下面的例子中，就把模板的$event对象(稍后研究)、模板输入变量(let hero)和模板引用变量(#heroForm)传给了组件中的一个事件处理器方法。 

`src/app/app.component.html`
```angular2html
<button (click)="onSave($event)">Save</button>
<button *ngFor="let hero of heroes" (click)="deleteHero(hero)">{{hero.name}}</button>
<form #heroForm (ngSubmit)="onSubmit(heroForm)"> ... </form>
```
模板上下文中的变量名的优先级高于组件上下文中的变量名。在上面的 deleteHero(hero) 中，hero 是一个模板输入变量，而不是组件中的 hero 属性。 

模板语句不能引用全局命名空间的任何东西。比如不能引用 window 或 document，也不能调用 console.log 或 Math.max。
###语句指南
和表达式一样，避免写复杂的模板语句。 常规是函数调用或者属性赋值。

现在，对模板表达式和语句有了一点感觉了吧。除插值表达式外，还有各种各样的数据绑定语法，是学习它们是时候了。

## 绑定语法
数据绑定是一种机制，用来协调用户所见和应用数据。虽然你能往HTML推送值或者从HTML拉取值，但如果把这些琐事交给数据绑定框架处理，应用会更容易编写、阅读和维护。只要简单地在绑定源和目标HTML元素之间声明绑定，框架就会完成这项工作。 

(注：理解上面这段话是很有意义的，绑定到底干什么用的，绑定的目标和数据源具体表现是什么，概念都应该在研究中逐渐清晰) 

Angular 提供了各种各样的数据绑定，本章将逐一讨论。先从高层视角来看看Angular数据绑定及其语法。
绑定的类型可以根据数据流的方向分成三类： 从数据源到视图、从视图到数据源以及双向的从视图到数据源再到视图。


<table>
<tr>
<th>数据方向  </th><th> 语法 </th><th> 绑定类型 </th>
</tr> 
<tr>
<td>单向 从数据源到视图</td>
<td>
{{expression}} <br>
[target]="expression" <br>
bind-target="expression" <br>
</td>
<td>
插值表达式<br>
    属性<br>
    Attribute<br>
    CSS 类<br>
    样式</td><br>
    </tr>
</table>
  


