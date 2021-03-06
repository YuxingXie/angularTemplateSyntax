# AngularTemplateSyntax

本研究项目用于研究angular模板语法，技术资料参见angular中文官网。因为知识点多为概念理解，所以编码较少。

# 知识点
## 插值表达式
```html
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
```html
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
```html
    {{title}}
    <span [hidden]="isUnchanged">changed</span>
```
* 表达式的上下文可以包括组件之外的对象。 比如模板输入变量 (let hero)和模板引用变量(#heroInput)就是备选的上下文对象之一。<br>

`src/app/app.component.html`
```html
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
模板表达式除了目标属性的值以外，不应该改变应用的任何状态<font color="blue">(注：不可赋值，不可自增自减基本保证了其无副作用）</font>。<br>

这条规则是 Angular “单向数据流”策略的基础。 永远不用担心读取组件值可能改变另外的显示值。在一次单独的渲染过程中，视图应该总是稳定的。<br>
<font color="blue">(注：与react理念一致)</font>
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
```html
<button (click)="deleteHero()">Delete hero</button>
```
模板语句有副作用。 这是事件处理的关键。因为你要根据用户的输入更新应用状态。 

响应事件是Angular中“`单向数据流`”的另一面。在一次事件循环中，可以随意改变任何地方的任何东西。

和模板表达式一样，模板语句使用的语言也像JavaScript。模板语句解析器和模板表达式解析器有所不同，特别之处在于它支持基本赋值(=)和表达式链(;和,)<font color="blue">(注：相当于代码块)</font>。 

然而，某些 JavaScript 语法仍然是不允许的： 
* new 运算符
* 自增和自减运算符：++ 和 --
* 操作并赋值，例如 += 和 -=<font color="blue">(注：++和--特例）</font>。 
* 位操作符 | 和 &
* 模板表达式运算符<font color="blue">(注：即管道操作符、安全导航操作符和非空断言操作符） </font>。 

<font color="blue">(注：既然接受用户输入那为什么不可以自增自减new等操作？大概是angular认为这些操作应该放在组件而非模板中，模板仅仅充当视图而组件充当控制器）</font>。 
### 语句上下文
和表达式中一样，语句只能引用语句上下文中 —— 通常是`正在绑定事件的那个组件实例`。 

典型的语句上下文就是当前组件的实例。 (click)="deleteHero()" 中的 deleteHero 就是这个数据绑定`组件上的一个方法`。

`src/app/app.component.html`
```html
<button (click)="deleteHero()">Delete hero</button>
```
语句上下文可以`引用`<font color="blue">(注：所谓引用一般说来是充当方法参数)模板自身上下文中的属性<font color="blue">(注：$event应该是一个内置变量，模板输入变量和模板引用变量类似于模板内声明的变量）</font>。在下面的例子中，就把模板的$event对象(稍后研究)、模板输入变量(let hero)和模板引用变量(#heroForm)传给了组件中的一个事件处理器方法。 

`src/app/app.component.html`
```html
<button (click)="onSave($event)">Save</button>
<button *ngFor="let hero of heroes" (click)="deleteHero(hero)">{{hero.name}}</button>
<form #heroForm (ngSubmit)="onSubmit(heroForm)"> ... </form>
```
模板上下文中的变量名的优先级高于组件上下文中的变量名。在上面的 deleteHero(hero) 中，hero 是一个模板输入变量，而不是组件中的 hero 属性。 

模板语句不能引用全局命名空间的任何东西。比如不能引用 window 或 document，也不能调用 console.log 或 Math.max。
###语句指南
和表达式一样，避免写复杂的模板语句。 常规是函数调用或者属性赋值。

现在，对模板表达式和语句有了一点感觉了吧。除插值表达式外，还有各种各样的数据绑定语法，是学习它们是时候了。

## 绑定语法：概览
数据绑定是一种机制，用来协调用户所见和应用数据。虽然你能往HTML推送值或者从HTML拉取值，但如果把这些琐事交给数据绑定框架处理，应用会更容易编写、阅读和维护。只要简单地在绑定源和目标HTML元素之间声明绑定，框架就会完成这项工作。 

<font color="blue">(注：理解上面这段话是很有意义的，绑定到底干什么用的，绑定的目标和数据源具体表现是什么，概念都应该在研究中逐渐清晰) </font>

Angular 提供了各种各样的数据绑定，本章将逐一讨论。先从高层视角来看看Angular数据绑定及其语法。
绑定的类型可以根据数据流的方向分成三类： 从数据源到视图、从视图到数据源以及双向的从视图到数据源再到视图。


<table width='100%'>
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
        样式
      </td>
  </tr>
  <tr>
      <td>从视图到数据源的单向绑定</td>
      <td>
      (target)="statement" <br>
      on-target="statement"
      </td>
      <td>
     事件
        </td>
    </tr>
    <tr>
        <td>双向</td>
        <td>
        [(target)]="expression"<br>
        bindon-target="expression"
        </td>
        <td>
       双向
          </td>
      </tr>
</table>
  
    译注：由于 HTML attribute 和 DOM property 在中文中都被翻译成了“属性”，无法区分， 而接下来的部分重点是对它们进行比较。

    我们无法改变历史，因此，在本章的翻译中，保留了它们的英文形式，不加翻译，以免混淆。 本章中，如果提到“属性”的地方，一定是指 property，因为在 Angular 中，实际上很少涉及 attribute。
    
    但在其它章节中，为简单起见，凡是能通过上下文明显区分开的，就仍统一译为“属性”， 区分不明显的，会加注英文。

除了插值表达式之外的绑定类型，在等号左边是目标名， 无论是包在括号中 ([]、()) 还是用前缀形式 (bind-、on-、bindon-) 。
###新的思维模型
数据绑定的威力和允许用自定义标记扩展HTML词汇的能力会让你把模板HTML当成HTML+。

它其实就是HTML+。但它也跟你曾使用的HTM有着显著的不同。这里需要一种新的思维模型。

在正常的HTML开发过程中，你使用HTML元素来创建视觉结构，通过把字符串常量设置到元素的attribute来修改那些元素。
`src/app/app.component.html`
```html
<div class="special">Mental Model</div>
<img src="assets/images/hero.png">
<button disabled>Save</button>
```
在 Angular模板中，你仍使用同样的方式创建结构和初始化attribute值。

然后，用封装了 HTML 的组件创建新元素，并把它们当作原生 HTML元素在模板中使用。

`src/app/app.component.html`
```html
<!-- Normal HTML -->
<div class="special">Mental Model</div>
<!-- Wow! A new element! -->
<app-hero-detail></app-hero-detail>
```
这就是 HTML+。

现在开始学习数据绑定。你碰到的第一种数据绑定是这样的：

`src/app/app.component.html`
```html
<!-- Bind button disabled state to `isUnchanged` property -->
<button [disabled]="isUnchanged">Save</button>
```

过会儿再认识那个怪异的方括号记法。直觉告诉你，你正在绑定按钮的disabled attribute。并把它设置为组件的isUnchanged属性的当前值。

但你的`直觉是错的`！日常的 HTML 思维模式在误导着你。实际上，`一旦开始数据绑定，就不再跟HTML attribute打交道了`。这里不是设置attribute，而是设置DOM元素、组件和指令的property。 


### HTML attribute 与 DOM property 的对比

>要想理解 Angular 绑定如何工作，重点是搞清 HTML attribute 和 DOM property 之间的区别。
>
>attribute 是由 HTML 定义的。property 是由 DOM (Document Object Model) 定义的。
>
>少量 HTML attribute 和 property 之间有着 1:1 的映射，如 id。
> 
> 有些 HTML attribute 没有对应的 property，如 colspan。
>
> 有些 DOM property 没有对应的 attribute，如 textContent。
> 
> 大量 HTML attribute 看起来映射到了 property…… 但却不像你想的那样！
> 
> 最后一类尤其让人困惑…… 除非你能理解这个普遍原则：
> 
> attribute 初始化DOM property，然后它们的任务就完成了。property的值可以改变；attribute的值不能改变。
> 
> 例如，当浏览器渲染 &lt; input type="text" value="Bob"> 时，它将创建相应 DOM节点，它的value这个 property被初始化为 “Bob”。
> 
> 当用户在输入框中输入 “Sally” 时，DOM 元素的 value 这个 property 变成了 “Sally”。 但是该 HTML 的 value 这个 attribute 保持不变。如果你读取 input 元素的 attribute，就会发现确实没变： input.getAttribute('value') // 返回 "Bob"。
> 
> HTML 的 value 这个 attribute 指定了初始值；DOM 的 value 这个 property 是当前值。
> 
> disabled 这个 attribute 是另一种特例。按钮的 disabled 这个 property 是 false，因为默认情况下按钮是可用的。 当你添加 disabled 这个 attribute 时，只要它出现了按钮的 disabled 这个 property 就初始化为 true，于是按钮就被禁用了。
> 
> 添加或删除 disabled 这个 attribute 会禁用或启用这个按钮。但 attribute 的值无关紧要，这就是你为什么没法通过 &lt;button disabled="false">仍被禁用</button> 这种写法来启用按钮。
> 
> 设置按钮的 disabled 这个 property（如，通过 Angular 绑定）可以禁用或启用这个按钮。 这就是 property 的价值。
> 
> 就算名字相同，HTML attribute和DOM property也不是同一样东西。 

这句话值得再强调一次： `模板绑定是通过 property 和事件来工作的，而不是 attribute`。 

`没有 ATTRIBUTE 的世界` 

    在 Angular 的世界中，attribute 唯一的作用是用来初始化元素和指令的状态。 当进行数据绑定时，只是在与元素和指令的 property 和事件打交道，而 attribute 就完全靠边站了。 

把这个思维模型牢牢的印在脑子里，接下来，学习什么是绑定目标。

###绑定目标
`数据绑定的目标`是 DOM 中的某些东西。这个目标可能（元素 | 组件| 指令的property、（元素 | 组件 | 指令的）事件，或(极少数情况下) attribute 名。 下面是的汇总表：

<table>
  <tr>
  <th>绑定类型</th>
  <th>目标</th>
  <th>范例</th>
  </tr>
<tr>
    <td>属性(Property)</td>
    <td>元素的 property<br>
        组件的 property<br>
        指令的 property</td>
<td>
      src/app/app.component.html<br>
    
      <img [src]="heroImageUrl">
      <app-hero-detail [hero]="currentHero"></app-hero-detail>
      <div [ngClass]="{'special': isSpecial}"></div>
</td>
</tr>
<tr>
    <td>事件（Event)</td>
    <td>元素的事件<br>
        组件的事件<br>
        指令的事件</td>
<td>
      src/app/app.component.html<br>
    
      <button (click)="onSave()">Save</button>
      <app-hero-detail (deleteRequest)="deleteHero()"></app-hero-detail>
      <div (myClick)="clicked=$event" clickable>click me</div>
</td>
</tr>
<tr>
    <td>双向</td>
    <td>事件与 property</td>
<td>
      src/app/app.component.html
      
      <input [(ngModel)]="name">
</td>
</tr>
<tr>
    <td>Attribute</td>
    <td>attribute（例外情况）</td>
<td>
      src/app/app.component.html
      
      <button [attr.aria-label]="help">help</button>
</td>
</tr>
<tr>
    <td>CSS 类</td>
    <td>class property</td>
<td>
      src/app/app.component.html
      
      <div [class.special]="isSpecial">Special</div>
</td>
</tr>
<tr>
    <td>样式</td>
    <td>style property</td>
<td>
      src/app/app.component.html
      
      <button [style.color]="isSpecial ? 'red' : 'green'">
</td>
</tr>
</table>

<font color="blue">(注：class,attr,style这3个绑定形式上有些类似，而事件则需要深入研究) </font>

放开眼界，来看看每种绑定类型的具体情况。 


## 属性绑定 
当要把视图元素的属性(property)设置为模板表达式时，就要写模板的`属性(property)绑定`。

最常用的属性绑定是把元素属性设置为组件属性的值。 下面这个例子中，image 元素的 src 属性会被绑定到组件的 heroImageUrl 属性上：

<font color="blue">(注：从面向对象的概念看，组件是一个类，组件的属性值就是类的属性值) </font>

`src/app/app.component.html`
```html
<img [src]="heroImageUrl">
```
另一个例子是当组件说它 isUnchanged（未改变）时禁用按钮： 
`src/app/app.component.html`
```html
<button [disabled]="isUnchanged">Cancel is disabled</button>
```
另一个例子是设置指令的属性：

 `src/app/app.component.html`

```html
<div [ngClass]="classes">[ngClass] binding to the classes property</div>
<font color="blue">(注：[ngClass]绑定到组件的classes属性)</font>
```
还有另一个例子是设置自定义组件的模型属性（这是父子组件之间通讯的重要途径）： 

<font color="blue">(注：仅从表现形式上看，自定义组件和普通html元素的属性绑定没什么不一样)</font>

`src/app/app.component.html`
```html
<app-hero-detail [hero]="currentHero"></app-hero-detail> 

```

### 单向输入 

人们经常把属性绑定描述成单向数据绑定，因为值的流动是单向的，从组件的数据属性流动到目标元素的属性。

>不能使用属性绑定来从目标元素拉取值，也不能绑定到目标元素的属性来读取它。只能设置它。
也不能使用属性绑定来调用目标元素上的方法。
>
>如果这个元素触发了事件，可以通过事件绑定来监听它们。
>
>如果必须读取目标元素上的属性或调用它的某个方法，得用另一种技术。 参见 API 参考手册中的 ViewChild 和 ContentChild。 

<font color="blue">(注：重点：1单向,只读，2不能调用方法，3事件监听)</font>

### 绑定目标 
包裹在方括号中的元素属性名标记着目标属性。下列代码中的目标属性是image元素的src属性。

`src/app/app.component.html` 
```html
<img [src]="heroImageUrl">
```
有些人喜欢用 bind- 前缀的可选形式，并称之为规范形式：

`src/app/app.component.html`
```html
<img bind-src="heroImageUrl">

```
目标的名字总是 property 的名字。即使它看起来和别的名字一样。 看到 src 时，可能会把它当做 attribute。不！它不是！它是 image 元素的 property 名。

元素属性可能是最常见的绑定目标，但 Angular 会先去看这个名字是否是某个已知指令的属性名，就像下面的例子中一样：

`src/app/app.component.html`
```html

<div [ngClass]="classes">[ngClass] binding to the classes property</div>
```


>严格来说，Angular 正在匹配指令的输入属性的名字。 这个名字是指令的 inputs 数组中所列的名字，或者是带有 @Input() 装饰器的属性。 这些输入属性被映射为指令自己的属性。 

<font color="blue">(注：所以，ngClass是某个指令的属性名，严格说叫输入属性名)</font>

如果名字没有匹配上已知指令或元素的属性，Angular 就会报告“未知指令”的错误。

### 消除副作用 

正如以前讨论过的，模板表达式的计算不能有可见的副作用。表达式语言本身可以提供一部分安全保障。 不能在属性绑定表达式中对任何东西赋值，也不能使用自增、自减运算符。

当然，表达式可能会调用具有副作用的属性或方法。但Angular没法知道这一点，也没法阻止你。

表达式中可以调用像getFoo()这样的方法。只有你知道getFoo()干了什么。如果getFoo()改变了某个东西，恰好又绑定到个这个东西，你就可能把自己坑了。Angular可能显示也可能不显示变化后的值。Angular还可能检测到变化，并抛出警告型错误。一般建议是，只绑定数据属性和那些只返回值而不做其它事情的方法。

<font color="blue">(注：`单向输入`小节所讲的`不能使用属性绑定来调用目标元素上的方法`和这里所讲的`表达式中调用方法`是不一样的)</font>

### 返回恰当的类型 

模板表达式应该返回目标属性所需类型的值。如果目标属性想要个字符串，就返回字符串。如果目标属性想要个数字，就返回数字。如果目标属性想要个对象，就返回对象。 

<font color="blue">(注：对于html属性，一般只会要求字符串或数字，而对于自定义组件属性，则有可能是一个对象)  </font>

HeroDetail 组件的 hero 属性想要一个 Hero 对象，那就在属性绑定中精确地给它一个 Hero 对象：

`src/app/app.component.html`
```html
<app-hero-detail [hero]="currentHero"></app-hero-detail>
```
### 一次性字符串初始化 

当满足下列条件时，应该省略括号：

* 目标属性接受字符串值。
* 字符串是个固定值，可以直接合并到模块中。
* 这个初始值永不改变。

你经常这样在标准HTML中用这种方式初始化attribute，这种方式也可以用在初始化指令和组件的属性。下面这个例子把HeroDetailComponent的prefix属性初始化为固定的字符串，而不是模板表达式。Angular设置它，然后忘记它。 

`src/app/app.component.html`
```html
<app-hero-detail prefix="You are my" [hero]="currentHero"></app-hero-detail>
```
<font color="blue">(注：就像使用普通html属性一样) </font>

作为对比，[hero] 绑定是组件的 currentHero 属性的活绑定，它会一直随着更新。

### 属性绑定还是插值表达式？ 

你通常得在插值表达式和属性绑定之间做出选择。 下列这几对绑定做的事情完全相同：

`src/app/app.component.html`
```html
<p><img src="{{heroImageUrl}}"> is the <i>interpolated</i> image.</p>
<p><img [src]="heroImageUrl"> is the <i>property bound</i> image.</p>

<p><span>"{{title}}" is the <i>interpolated</i> title.</span></p>
<p>"<span [innerHTML]="title"></span>" is the <i>property bound</i> title.</p>
```
在多数情况下，插值表达式是更方便的备选项。 实际上，在渲染视图之前，Angular 把这些插值表达式翻译成相应的属性绑定。

当要渲染的数据类型是字符串时，没有技术上的理由证明哪种形式更好。 你倾向于可读性，所以倾向于插值表达式。 建议建立代码风格规则，选择一种形式， 这样，既遵循了规则，又能让手头的任务做起来更自然。

但数据类型不是字符串时，就必须使用属性绑定了。
#### 内容安全 
假设下面的恶意内容

`src/app/app.component.ts`
```html
evilTitle = 'Template <script>alert("evil never sleeps")</script>Syntax';
```

幸运的是，Angular 数据绑定对危险 HTML 有防备。在显示它们之前，它对内容先进行消毒。不管是插值表达式还是属性绑定，都不会允许带有script标签的 HTML泄漏到浏览器中。

`src/app/app.component.html`
```html
<!--
  Angular generates warnings for these two lines as it sanitizes them
  WARNING: sanitizing HTML stripped some content (see http://g.co/ng/security#xss).
 -->
<p><span>"{{evilTitle}}" is the <i>interpolated</i> evil title.</span></p>
<p>"<span [innerHTML]="evilTitle"></span>" is the <i>property bound</i> evil title.</p>
```

插值表达式处理script标签与属性绑定有所不同，但是二者都只渲染没有危害的内容。 

![](https://github.com/YuxingXie/angularTemplateSyntax/raw/master/evil-title.png) 

## attribute、class 和 style 绑定 
模板语法为那些不太适合使用属性绑定的场景提供了专门的单向数据绑定形式。 

### attribute 绑定 

可以通过attribute 绑定来直接设置 attribute 的值。
>这是“绑定到目标属性 (property)”这条规则中唯一的例外。这是唯一的能创建和设置 attribute 的绑定形式。

本章中，通篇都在说通过属性绑定来设置元素的属性(property)总是好于用字符串设置 attribute。为什么 Angular 还提供了 attribute 绑定呢？

因为当元素没有属性可绑的时候，就必须使用 attribute 绑定。 

考虑 ARIA， SVG 和 table 中的 colspan/rowspan 等 attribute。 它们是纯粹的 attribute，没有对应的属性可供绑定。

如果想写出类似下面这样的东西，就会暴露出痛点了： 
```html
    <tr><td colspan="{{1 + 1}}">Three-Four</td></tr>
```
会得到这个错误：
```text
Template parse errors:
Can't bind to 'colspan' since it isn't a known native property
```
正如提示中所说，<td> 元素没有 colspan 属性。 但是插值表达式和属性绑定只能设置属性，不能设置 attribute。

你需要 attribute 绑定来创建和绑定到这样的 attribute。

attribute 绑定的语法与属性绑定类似。 但方括号中的部分不是元素的属性名，而是由attr前缀，一个点 (.) 和 attribute 的名字组成。 可以通过值为字符串的表达式来设置 attribute 的值。

这里把 [attr.colspan] 绑定到一个计算值：

`src/app/app.component.html`
```html
<table border=1>
  <!--  expression calculates colspan=2 -->
  <tr><td [attr.colspan]="1 + 1">One-Two</td></tr>

  <!-- ERROR: There is no `colspan` property to set!
    <tr><td colspan="{{1 + 1}}">Three-Four</td></tr>
  -->

  <tr><td>Five</td><td>Six</td></tr>
</table>
```
这里是表格渲染出来的样子：

<table border=1>
  <tr><td colspan="2">One-Two</td></tr>
  <tr><td>Five</td><td>Six</td></tr>
</table>

attribute 绑定的主要用例之一是设置 ARIA attribute（译注：ARIA 指可访问性，用于给残障人士访问互联网提供便利）， 就像这个例子中一样：

`src/app/app.component.html`
```html
<!-- create and set an aria attribute for assistive technology -->
<button [attr.aria-label]="actionName">{{actionName}} with Aria</button>
```
### CSS 类绑定 
借助 CSS 类绑定，可以从元素的 class attribute 上添加和移除 CSS 类名。

CSS 类绑定绑定的语法与属性绑定类似。 但方括号中的部分不是元素的属性名，而是由class前缀，一个点 (.)和 CSS 类的名字组成， 其中后两部分是可选的。形如：[class.class-name]。

下列例子示范了如何通过 CSS 类绑定来添加和移除应用的 "special" 类。不用绑定直接设置 attribute 时是这样的：

`src/app/app.component.html`
```html
<!-- standard class attribute setting  -->
<div class="bad curly special">Bad curly special</div>
```
可以把它改写为绑定到所需 CSS 类名的绑定；这是一个或者全有或者全无的替换型绑定。 （译注：即当 badCurly 有值时 class 这个 attribute 设置的内容会被完全覆盖）

`src/app/app.component.html`
```html
<!-- reset/override all class names with a binding  -->
<div class="bad curly special"
     [class]="badCurly">Bad curly</div>
```
最后，可以绑定到特定的类名。 当模板表达式的求值结果是真值时，Angular 会添加这个类，反之则移除它。 

`src/app/app.component.html`
```html
<!-- toggle the "special" class on/off with a property -->
<div [class.special]="isSpecial">The class binding is special</div>

<!-- binding to `class.special` trumps the class attribute -->
<div class="special"
     [class.special]="!isSpecial">This one is not so special</div>
```
>虽然这是切换单一类名的好办法，但人们通常更喜欢使用 NgClass 指令 来同时管理多个类名。

### 样式绑定 
通过样式绑定，可以设置内联样式。

样式绑定的语法与属性绑定类似。 但方括号中的部分不是元素的属性名，而由style前缀，一个点 (.)和 CSS 样式的属性名组成。 形如：[style.style-property]。 

`src/app/app.component.html`
```html
<button [style.color]="isSpecial ? 'red': 'green'">Red</button>
<button [style.background-color]="canSave ? 'cyan': 'grey'" >Save</button>
```

有些样式绑定中的样式带有单位。在这里，以根据条件用 “em” 和 “%” 来设置字体大小的单位。 

`src/app/app.component.html`
```html
<button [style.font-size.em]="isSpecial ? 3 : 1" >Big</button>
<button [style.font-size.%]="!isSpecial ? 150 : 50" >Small</button>
```
>虽然这是设置单一样式的好办法，但人们通常更喜欢使用 NgStyle 指令 来同时设置多个内联样式。

>注意，样式属性命名方法可以用中线命名法，像上面的一样 也可以用驼峰式命名法，如 fontSize。

## 事件绑定 ( (事件名) ) 
前面遇到的绑定的数据流都是单向的：从组件到元素。 

但用户不会只盯着屏幕看。他们会在输入框中输入文本。他们会从列表中选取条目。 他们会点击按钮。这类用户动作可能导致反向的数据流：从元素到组件。 

知道用户动作的唯一方式是监听某些事件，如按键、鼠标移动、点击和触摸屏幕。 可以通过 Angular 事件绑定来声明对哪些用户动作感兴趣。

事件绑定语法由等号左侧带圆括号的目标事件和右侧引号中的模板语句组成。 下面事件绑定监听按钮的点击事件。每当点击发生时，都会调用组件的 onSave() 方法。

`src/app/app.component.html`
```html
<button (click)="onSave()">Save</button>
```
### 目标事件 
<font color="blue">(注：开始事件绑定研究之前，先回顾一下属性绑定做的是什么？它用数据渲染了组件，是单向数据流中的流出，而事件绑定则是流入。属性绑定使用模板表达式，事件绑定使用模板语句。) </font>

圆括号中的名称 —— 比如 (click) —— 标记出目标事件。在下面例子中，目标是按钮的 click 事件。

`src/app/app.component.html`
```html
<button (click)="onSave()">Save</button>

```
有些人更喜欢带 on- 前缀的备选形式，称之为规范形式：

`src/app/app.component.html`
```html
<button on-click="onSave()">On Save</button>

```
元素事件可能是更常见的目标，但 Angular 会先看这个名字是否能匹配上已知指令的事件属性，就像下面这个例子：

`src/app/app.component.html`
```html
<!-- `myClick` is an event on the custom `ClickDirective` -->
<div (myClick)="clickMessage=$event" clickable>click with myClick</div>
```

>更多关于该 myClick 指令的解释，见给输入/输出属性起别名。

如果这个名字没能匹配到元素事件或已知指令的输出属性，Angular 就会报“未知指令”错误。

### $event 和事件处理语句 
在事件绑定中，Angular 会为目标事件设置事件处理器。

当事件发生时，这个处理器会执行模板语句。典型的模板语句通常涉及到响应事件执行动作的接收器，例如从HTML控件中取得值，并存入模型。

绑定会通过名叫$event的事件对象传递关于此事件的信息（包括数据值）。

事件对象的形态取决于目标事件。如果目标事件是原生DOM元素事件，$event就是DOM事件对象，它有像target和target.value这样的属性。

考虑这个范例：
`src/app/app.component.html`
```html
<input [value]="currentHero.name"
       (input)="currentHero.name=$event.target.value" >
```
要更新 firstName 属性，就要通过路径 $event.target.value 来获取更改后的值。

如果事件属于指令（回想一下，组件是指令的一种），那么 $event 具体是什么由指令决定。

### 使用 EventEmitter 实现自定义事件 
通常，指令使用 Angular EventEmitter 来触发自定义事件。指令创建一个 EventEmitter 实例<font color="blue">(注：泛型实例)</font>，并且把它作为属性暴露出来。 指令调用 EventEmitter.emit(payload) 来触发事件，可以传入任何东西作为消息载荷。 父指令通过绑定到这个属性来监听事件，并通过 $event 对象来访问载荷。

假设 HeroDetailComponent 用于显示英雄的信息，并响应用户的动作。 虽然 HeroDetailComponent 包含删除按钮，但它自己并不知道该如何删除这个英雄<font color="blue">(注：因为删除的方法定义在父组件中)</font>。 最好的做法是触发事件来报告“删除用户”的请求。

下面的代码节选自 HeroDetailComponent：

`src/app/hero-detail.component.ts (template)`
```html
template: `
<div>
  <img src="{{heroImageUrl}}">
  <span [style.text-decoration]="lineThrough">
    {{prefix}} {{hero?.name}}
  </span>
  <button (click)="delete()">Delete</button>
</div>`
```
`src/app/hero-detail.component.ts (deleteRequest)`
```Java
// This component makes a request but it can't actually delete a hero.
deleteRequest = new EventEmitter<Hero>();

delete() {
  this.deleteRequest.emit(this.hero);
}
```
<font color="blue">(注：delete方法看起来是要从英雄列表数组中删除该项，然而HeroDetailComponent并不持有该数组，所以需要它的父组件去真正执行从数组删除数据项这件事，类似于给父组件发个通知吧)</font>

组件定义了 deleteRequest 属性，它是 EventEmitter 实例。 当用户点击删除时，组件会调用 delete() 方法，让 EventEmitter 发出一个 Hero 对象。

现在，假设有个宿主的父组件，它绑定了 HeroDetailComponent 的 deleteRequest 事件。 

`src/app/app.component.html (event-binding-to-component)`
```html
<app-hero-detail (deleteRequest)="deleteHero($event)" [hero]="currentHero"></app-hero-detail>
```
当deleteRequest事件触发时，Angular调用父组件的deleteHero方法，在$event变量中传入要删除的英雄（来自HeroDetail）。

><font color="blue">(注：app-hero-detail组件绑定了自定义的deleteRequest属性，初略的理解是，这个属性表明点击该组件会传播一个Hero对象到父组件，</font>
父组件的deleteHero方法通过参数$event接受这个Hero对象，具体如何取得这个值，通过试验，代码如下：)

`app.component.ts` 
```javascript
    //组件中(deleteRequest)="deleteHero($event)"绑定方法deleteHero($event)的实现如下：
    deleteHero(hero: Hero) {
        console.log(hero.name);//it works，表明$event就是子组件传递过来的那个Hero对象
    }
```
`hero-detail.component.ts`
```javascript
  @Output() deleteRequest: EventEmitter<Hero> = new EventEmitter<Hero>();
  @Input() hero: Hero;
  delete() {
    console.log('HeroDetailComponent.delete method invoke');
    this.deleteRequest.emit(this.hero);
  }
```
### 模板语句有副作用 

deleteHero 方法有副作用：它删除了一个英雄。 模板语句的副作用不仅没问题，反而正是所期望的。

删除这个英雄会更新模型，还可能触发其它修改，包括向远端服务器的查询和保存。这些变更通过系统进行扩散，并最终显示到当前以及其它视图中。

## 双向数据绑定 ( [(...)] ) 

你经常需要显示数据属性，并在用户作出更改时更新该属性。

在元素层面上，既要设置元素属性，又要监听元素事件变化。

Angular 为此提供一种特殊的双向数据绑定语法：[(x)]。 [(x)] 语法结合了属性绑定的方括号 [x] 和事件绑定的圆括号 (x)。

    [( )] = 盒子里的香蕉
    想象盒子里的香蕉来记住方括号套圆括号。 

当一个元素拥有可以设置的属性 x 和对应的事件 xChange 时，解释 [(x)] 语法就容易多了。 下面的 SizerComponent 符合这个模式。它有`size属性和配套的sizeChange事件`：

`src/app/sizer.component.ts`

```typescript
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sizer',
  template: `
  <div>
    <button (click)="dec()" title="smaller">-</button>
    <button (click)="inc()" title="bigger">+</button>
    <label [style.font-size.px]="size">FontSize: {{size}}px</label>
  </div>`
})
export class SizerComponent {
  @Input()  size: number | string;
  @Output() sizeChange = new EventEmitter<number>();

  dec() { this.resize(-1); }
  inc() { this.resize(+1); }

  resize(delta: number) {
    this.size = Math.min(40, Math.max(8, +this.size + delta));
    this.sizeChange.emit(this.size);
  }
}
```
size 的初始值是一个输入值，来自属性绑定。（译注：注意 size 前面的 @Input） 点击按钮，在最小/最大值范围限制内增加或者减少 size。 然后用调整后的 size 触发 sizeChange 事件。

下面的例子中，AppComponent.fontSize 被双向绑定到 SizerComponent：
`src/app/app.component.html (two-way-1)`
```html
<app-sizer [(size)]="fontSizePx"></app-sizer>
<div [style.font-size.px]="fontSizePx">Resizable Text</div>
```
SizerComponent.size 初始值是 AppComponent.fontSizePx。点击按钮时，通过双向绑定更新 AppComponent.fontSizePx。被修改的AppComponent.fontSizePx通过样式绑定，改变文本的显示大小。

双向绑定语法实际上是`属性绑定和事件绑定的语法糖`。Angular将SizerComponent的绑定分解成这样：

`src/app/app.component.html (two-way-2)`
```html
<app-sizer [size]="fontSizePx" (sizeChange)="fontSizePx=$event"></app-sizer>
```
$event 变量包含了 SizerComponent.sizeChange 事件的荷载。 当用户点击按钮时，Angular 将 $event 赋值给 AppComponent.fontSizePx。

显然，比起单独绑定属性和事件，双向数据绑定语法显得非常方便。

如果能在像 &lt;input> 和 &lt;select> 这样的 HTML 元素上使用双向数据绑定就更好了。可惜，原生HTML元素不遵循x值和xChange事件的模式。

幸运的是，Angular以NgModel指令为桥梁，允许在表单元素上使用双向数据绑定。

## 内置指令 

上一版本的 Angular 中包含了超过 70 个内置指令。 社区贡献了更多，这还没算为内部应用而创建的无数私有指令。

在新版的 Angular 中不需要那么多指令。 使用更强大、更富有表现力的 Angular 绑定系统，其实可以达到同样的效果。 如果能用简单的绑定达到目的，为什么还要创建指令来处理点击事件呢？

`src/app/app.component.html`
```html
<button (click)="onSave()">Save</button>
```
你仍然可以从简化复杂任务的指令中获益。 Angular 发布时仍然带有内置指令，只是没那么多了。 你仍会写自己的指令，只是没那么多了。

下面来看一下那些最常用的内置指令。它们可分为属性型指令 或 结构型指令。

## 内置属性型指令 
属性型指令会监听和修改其它 HTML 元素或组件的行为、元素属性（Attribute）、DOM 属性（Property）。 它们通常会作为HTML属性的名称而应用在元素上。

更多的细节参见属性型指令一章。 很多 Angular 模块，比如RouterModule和FormsModule都定义了自己的属性型指令。 本节将会介绍几个最常用的属性型指令：

* NgClass - 添加或移除一组 CSS 类
* NgStyle - 添加或移除一组 CSS 样式
* NgModel - 双向绑定到 HTML 表单元素 

### NgClass

你经常用动态添加或删除 CSS 类的方式来控制元素如何显示。 通过绑定到 NgClass，可以同时添加或移除多个类。

CSS 类绑定 是添加或删除单个类的最佳途径。

`src/app/app.component.html`
```html
<!-- toggle the "special" class on/off with a property -->
<div [class.special]="isSpecial">The class binding is special</div>
```

当想要同时添加或移除多个 CSS 类时，NgClass 指令可能是更好的选择。

试试把 ngClass 绑定到一个 key:value 形式的控制对象。这个对象中的每个 key 都是一个 CSS 类名，如果它的 value 是 true，这个类就会被加上，否则就会被移除。

组件方法 setCurrentClasses 可以把组件的属性 currentClasses 设置为一个对象，它将会根据三个其它组件的状态为 true 或 false 而添加或移除三个类。

`src/app/app.component.ts`
```html
currentClasses: {};
setCurrentClasses() {
  // CSS classes: added/removed per current state of component properties
  this.currentClasses =  {
    'saveable': this.canSave,
    'modified': !this.isUnchanged,
    'special':  this.isSpecial
  };
}
```

把 NgClass 属性绑定到 currentClasses，根据它来设置此元素的 CSS 类：

`src/app/app.component.html`
```html
<div [ngClass]="currentClasses">This div is initially saveable, unchanged, and special</div>

```
>你既可以在初始化时调用 setCurrentClassess()，也可以在所依赖的属性变化时调用。 

### NgStyle 

你可以根据组件的状态动态设置内联样式。 NgStyle 绑定可以同时设置多个内联样式。

样式绑定是设置单一样式值的简单方式。

`src/app/app.component.html`
```html

<div [style.font-size]="isSpecial ? 'x-large' : 'smaller'" >
  This div is x-large or smaller.
</div>
```

如果要同时设置多个内联样式，NgStyle 指令可能是更好的选择。

NgStyle 需要绑定到一个 key:value 控制对象。 对象的每个 key 是样式名，它的 value 是能用于这个样式的任何值。

来看看组件的 setCurrentStyles 方法，它会根据另外三个属性的状态把组件的 currentStyles 属性设置为一个定义了三个样式的对象：

`src/app/app.component.ts`
```html
currentStyles: {};
setCurrentStyles() {
  // CSS styles: set per current state of component properties
  this.currentStyles = {
    'font-style':  this.canSave      ? 'italic' : 'normal',
    'font-weight': !this.isUnchanged ? 'bold'   : 'normal',
    'font-size':   this.isSpecial    ? '24px'   : '12px'
  };
}
```

把 NgStyle 属性绑定到 currentStyles，以据此设置此元素的样式：

`src/app/app.component.html`
```html
<div [ngStyle]="currentStyles">
  This div is initially italic, normal weight, and extra large (24px).
</div>
```

>你既可以在初始化时调用 setCurrentStyles()，也可以在所依赖的属性变化时调用。 

### NgModel - 使用[(ngModel)]双向绑定到表单元素 

当开发数据输入表单时，你通常都要既显示数据属性又根据用户的更改去修改那个属性。

使用 NgModel 指令进行双向数据绑定可以简化这种工作。例子如下：

`src/app/app.component.html (NgModel-1)`
```html
<input [(ngModel)]="currentHero.name">
```
#### 使用 ngModel 时需要 FormsModule 
在使用 ngModel 指令进行双向数据绑定之前，你必须导入 FormsModule 并把它添加到 Angular 模块的 imports 列表中。 要了解 FormsModule 和 ngModel 的更多知识，参见表单一章。

导入 FormsModule 并让 [(ngModel)] 可用的代码如下： 

`src/app/app.module.ts (FormsModule import)`
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <--- JavaScript import from Angular

/* Other imports */

@NgModule({
  imports: [
    BrowserModule,
    FormsModule  // <--- import into the NgModule
  ],
  /* Other module metadata */
})
export class AppModule { }
```
#### [(ngModel)]内幕 
回头看看 name 绑定，注意，你可以通过分别绑定到 &LT;input> 元素的 value 属性和 input 事件来达到同样的效果。

`src/app/app.component.html`
```html
<input [value]="currentHero.name"
       (input)="currentHero.name=$event.target.value" >
```

那样显得很笨重，谁会记得该设置哪个元素属性以及当用户修改时触发哪个事件？你该如何提取输入框中的文本并且更新数据属性？谁会希望每次都去查资料来确定这些？

ngModel 指令通过自己的输入属性 ngModel 和输出属性 ngModelChange 隐藏了那些细节。

`src/app/app.component.html`
```html
<input
  [ngModel]="currentHero.name"
  (ngModelChange)="currentHero.name=$event">
```

>ngModel 输入属性会设置该元素的值，并通过 ngModelChange 的输出属性来监听元素值的变化。
>各种元素都有很多特有的处理细节，因此 NgModel 指令只支持实现了ControlValueAccessor的元素， 它们能让元素适配本协议。 &lt;input> 输入框正是其中之一。 Angular 为所有的基础 HTML 表单都提供了值访问器（Value accessor），表单一章展示了如何绑定它们。
> 
>你不能把 [(ngModel)] 用到非表单类的原生元素或第三方自定义组件上，除非写一个合适的值访问器，这种技巧超出了本章的范围。
> 
>你自己写的 Angular 组件不需要值访问器，因为你可以让值和事件的属性名适应 Angular 基本的双向绑定语法，而不使用 NgModel。 前面看过的 sizer就是使用这种技巧的例子。

使用独立的 ngModel 绑定优于绑定到该元素的原生属性，你可以做得更好。

你不用被迫两次引用这个数据属性，Angular 可以捕获该元素的数据属性，并且通过一个简单的声明来设置它，这样它就可以使用 [(ngModel)] 语法了。

`src/app/app.component.html`
```html
<input [(ngModel)]="currentHero.name">
```
[(ngModel)] 就是你需要的一切吗？有没有什么理由回退到它的展开形式？

[(ngModel)] 语法只能设置数据绑定属性。 如果要做更多或者做点不一样的事，也可以写它的展开形式。

下面这个生造的例子强制输入框的内容变成大写：

`src/app/app.component.html`
```html
<input
  [ngModel]="currentHero.name"
  (ngModelChange)="setUppercaseName($event)">
```

这里是所有这些变体的动画，包括这个大写转换的版本：
![](https://github.com/YuxingXie/angularTemplateSyntax/raw/master/ng-model-anim.gif) 

## 内置结构型指令 

结构型指令的职责是 HTML 布局。 它们塑造或重塑 DOM 的结构，这通常是通过添加、移除和操纵它们所附加到的宿主元素来实现的。

关于结构型指令的详情参见结构型指令一章，在那里你将学到：

* 为什么要给结构型指令的名字加上(*)前缀？
* 当没有合适的宿主元素放置指令时，可用 &lt;ng-container> 对元素进行分组。
* 如何写自己的结构型指令<font color="blue">(注：我要写一个责任链模式数据展示指令)</font>。
* 你只能往一个元素上应用一个结构型指令。

本节是对常见结构型指令的简介：

* NgIf - 根据条件把一个元素添加到 DOM 中或从 DOM 移除
* NgSwitch 一组指令，用来在多个可选视图之间切换。
* NgForOf - 对列表中的每个条目重复套用同一个模板

### NgIf 
通过把 NgIf 指令应用到元素上（称为宿主元素），你可以往 DOM 中添加或从 DOM 中移除这个元素。 在下面的例子中，该指令绑定到了类似于 isActive 这样的条件表达式。

`src/app/app.component.html`
```html
<app-hero-detail *ngIf="isActive"></app-hero-detail>
```
>
>别忘了 ngIf 前面的星号(*)。
>

当 isActive 表达式返回真值时，NgIf 把 HeroDetailComponent 添加到 DOM 中；为假时，NgIf 会从 DOM 中移除 HeroDetailComponent，并销毁该组件及其所有子组件。

#### 这和显示/隐藏不是一回事 
你也可以通过类绑定或样式绑定来显示或隐藏一个元素。

`src/app/app.component.html`
```html
<!-- isSpecial is true -->
<div [class.hidden]="!isSpecial">Show with class</div>
<div [class.hidden]="isSpecial">Hide with class</div>

<!-- HeroDetail is in the DOM but hidden -->
<app-hero-detail [class.hidden]="isSpecial"></app-hero-detail>

<div [style.display]="isSpecial ? 'block' : 'none'">Show with style</div>
<div [style.display]="isSpecial ? 'none'  : 'block'">Hide with style</div>
```
但隐藏子树和用 NgIf 排除子树是截然不同的。

当隐藏子树时，它仍然留在 DOM 中。 子树中的组件及其状态仍然保留着。 即使对于不可见属性，Angular 也会继续检查变更。 子树可能占用相当可观的内存和运算资源。

当 NgIf 为 false 时，Angular 从 DOM 中物理地移除了这个元素子树。 它销毁了子树中的组件及其状态，也潜在释放了可观的资源，最终让用户体验到更好的性能。

显示/隐藏的技术对于只有少量子元素的元素是很好用的，但要当心别试图隐藏大型组件树。相比之下，NgIf 则是个更安全的选择。

#### 防范空指针错误 

ngIf 指令通常会用来防范空指针错误。 而显示/隐藏的方式是无法防范的，当一个表达式尝试访问空值的属性时，Angular 就会抛出一个异常。

这里我们用 NgIf 来保护了两个 <div> 防范空指针错误。 currentHero 的名字只有当存在 currentHero 时才会显示出来。 而 nullHero 永远不会显示。

`src/app/app.component.html`
```html
<div *ngIf="currentHero">Hello, {{currentHero.name}}</div>
<div *ngIf="nullHero">Hello, {{nullHero.name}}</div>
```
>
>参见稍后的安全导航操作符部分。
>
### NgForOf 

NgFor 是一个重复器指令 —— 自定义数据显示的一种方式。 你的目标是展示一个由多个条目组成的列表。首先定义了一个 HTML 块，它规定了单个条目应该如何显示。 再告诉 Angular 把这个块当做模板，渲染列表中的每个条目。

下例中，NgFor 应用在一个简单的 <div> 上：

`src/app/app.component.html`
```html
<div *ngFor="let hero of heroes">{{hero.name}}</div>

```
也可以把 NgFor 应用在一个组件元素上，就下例这样：

`src/app/app.component.html`
```html
<app-hero-detail *ngFor="let hero of heroes" [hero]="hero"></app-hero-detail>

```
>不要忘了 ngFor 前面的星号 (*)。

赋值给 *ngFor 的文本是用于指导重复器如何工作的指令<font color="blue">(注：instruction非directive)</font>。
#### NgFor 微语法 
赋值给 *ngFor 的字符串不是模板表达式。 它是一个微语法 —— 由 Angular 自己解释的小型语言。在这个例子中，字符串 "let hero of heroes" 的含义是：

<b>取出 heroes 数组中的每个英雄，把它存入局部变量 hero 中，并在每次迭代时对模板 HTML 可用</b>

Angular 把这个指令翻译成了一个 <ng-template> 包裹的宿主元素，然后使用这个模板重复创建出一组新元素，并且绑定到列表中的每一个 hero。

要了解微语法的更多知识，参见结构型指令一章。

### 模板输入变量 
hero 前的 let 关键字创建了一个名叫 hero 的模板输入变量。 ngFor 指令在由父组件的 heroes 属性返回的 heroes 数组上迭代，每次迭代都从数组中把当前元素赋值给 hero 变量。

你可以在 ngFor 的宿主元素（及其子元素）中引用模板输入变量 hero，从而访问该英雄的属性。 这里它首先在一个插值表达式中被引用到，然后通过一个绑定把它传给了 <hero-detail> 组件的 hero 属性。

`src/app/app.component.html`
```html
<div *ngFor="let hero of heroes">{{hero.name}}</div>
<app-hero-detail *ngFor="let hero of heroes" [hero]="hero"></app-hero-detail>
```
要了解更多模板输入变量的知识，参见结构型指令一章。
#### 带索引的 *ngFor 
NgFor 指令上下文中的 index 属性返回一个从零开始的索引，表示当前条目在迭代中的顺序。 你可以通过模板输入变量捕获这个 index 值，并把它用在模板中。

下面这个例子把 index 捕获到了 i 变量中，并且把它显示在英雄名字的前面。

<font color="blue">(注：有时候需要索引的奇偶数做些样式或逻辑判断，angularjs似乎一直没解决的问题，在angular中解决了)</font>

`src/app/app.component.html`
```html
<div *ngFor="let hero of heroes; let i=index">{{i + 1}} - {{hero.name}}</div>
```
>要学习更多的类似 index 的值，例如 last、even 和 odd，请参阅 NgFor API 参考。 

#### 带 trackBy 的 *ngFor
ngFor 指令有时候会性能较差，特别是在大型列表中。 对一个条目的一丁点改动、移除或添加，都会导致级联的 DOM 操作。

例如，重新从服务器查询可以刷新包括所有新英雄在内的英雄列表。

他们中的绝大多数（如果不是所有的话）都是以前显示过的英雄。你知道这一点，是因为每个英雄的 id 没有变化。 但在 Angular 看来，它只是一个由新的对象引用构成的新列表， 它没有选择，只能清理旧列表、舍弃那些 DOM 元素，并且用新的 DOM 元素来重建一个新列表。

如果给它指定一个 trackBy，Angular 就可以避免这种折腾。 往组件中添加一个方法，它会返回 NgFor应该追踪的值。 在这里，这个值就是英雄的 id。

<font color="blue">(注：说句后端java程序员才懂的行话，trackBy类似于jpa的持久化上下文)</font>

`src/app/app.component.ts`
```html
trackByHeroes(index: number, hero: Hero): number { return hero.id; }
```
在微语法中，把 trackBy 设置为该方法。

`src/app/app.component.html`
```html
<div *ngFor="let hero of heroes; trackBy: trackByHeroes">
  ({{hero.id}}) {{hero.name}}
</div>
```
<font color="blue">(注：个人认为这个特性是提高前端性能的重要手段)</font>

这里展示了 trackBy 的效果。 "Reset heroes"会创建一个具有相同 hero.id 的新英雄。 "Change ids"则会创建一个具有新 hero.id 的新英雄。

* 如果没有 trackBy，这些按钮都会触发完全的 DOM 元素替换。
* 有了 trackBy，则只有修改了 id 的按钮才会触发元素替换。
![](https://github.com/YuxingXie/angularTemplateSyntax/raw/master/ng-for-track-by-anim.gif) 

### NgSwitch 指令 
NgSwitch 指令类似于 JavaScript 的 switch 语句。 它可以从多个可能的元素中根据switch 条件来显示某一个。 Angular 只会把选中的元素放进 DOM 中。

NgSwitch 实际上包括三个相互协作的指令：NgSwitch、NgSwitchCase 和 NgSwitchDefault，例子如下：

`src/app/app.component.html`
```html
<div [ngSwitch]="currentHero.emotion">
  <app-happy-hero    *ngSwitchCase="'happy'"    [hero]="currentHero"></app-happy-hero>
  <app-sad-hero      *ngSwitchCase="'sad'"      [hero]="currentHero"></app-sad-hero>
  <app-confused-hero *ngSwitchCase="'confused'" [hero]="currentHero"></app-confused-hero>
  <app-unknown-hero  *ngSwitchDefault           [hero]="currentHero"></app-unknown-hero>
</div>
```
![](https://github.com/YuxingXie/angularTemplateSyntax/raw/master/switch-anim.gif) 

NgSwitch 是主控指令，要把它绑定到一个返回候选值的表达式。 本例子中的 emotion 是个字符串，但实际上这个候选值可以是任意类型。

绑定到 [ngSwitch]。如果试图用 *ngSwitch 的形式使用它就会报错，这是因为 NgSwitch 是一个属性型指令，而不是结构型指令。 它要修改的是所在元素的行为，而不会直接接触 DOM 结构。

绑定到 *ngSwitchCase 和 *ngSwitchDefault NgSwitchCase 和 NgSwitchDefault 指令都是结构型指令，因为它们会从 DOM 中添加或移除元素。

* NgSwitchCase 会在它绑定到的值等于候选值时，把它所在的元素加入到 DOM 中。
* NgSwitchDefault 会在没有任何一个 NgSwitchCase 被选中时把它所在的元素加入 DOM 中。

这组指令在要添加或移除组件元素时会非常有用。 这个例子会在 hero-switch.components.ts 中定义的四个“感人英雄”组件之间选择。 每个组件都有一个输入属性hero，它绑定到父组件的 currentHero 上。

这组指令在原生元素和Web Component上都可以正常工作。 比如，你可以把 <confused-hero> 分支改成这样：

`src/app/app.component.html`
```html
<div *ngSwitchCase="'confused'">Are you as confused as {{currentHero.name}}?</div>

```
## 模板引用变量 ( #var ) 

模板引用变量通常用来引用模板中的某个 DOM 元素，它还可以引用 Angular 组件或指令或Web Component。

使用井号 (#) 来声明引用变量。 #phone 的意思就是声明一个名叫 phone 的变量来引用 &lt;input> 元素。

src/app/app.component.html
```html
<input #phone placeholder="phone number">

```

你可以在模板中的任何地方引用模板引用变量。 比如声明在 &lt;input> 上的 phone 变量就是在模板另一侧的 &lt;button> 上使用的。

`src/app/app.component.html`
```html
<input #phone placeholder="phone number">

<!-- lots of other elements -->

<!-- phone refers to the input element; pass its `value` to an event handler -->
<button (click)="callPhone(phone.value)">Call</button>
```
### 模板引用变量怎么得到它的值？

大多数情况下，Angular 会把模板引用变量的值设置为声明它的那个元素。 在上一个例子中，phone 引用的是表示电话号码的&lt;input> 框。 "拨号"按钮的点击事件处理器把这个 input 值传给了组件的 callPhone 方法。 不过，指令也可以修改这种行为，让这个值引用到别处，比如它自身。 NgForm 指令就是这么做的。

下面是表单一章中表单范例的简化版。

`src/app/hero-form.component.html`
```html
<form (ngSubmit)="onSubmit(heroForm)" #heroForm="ngForm">
  <div class="form-group">
    <label for="name">Name
      <input class="form-control" name="name" required [(ngModel)]="hero.name">
    </label>
  </div>
  <button type="submit" [disabled]="!heroForm.form.valid">Submit</button>
</form>
<div [hidden]="!heroForm.form.valid">
  {{submitMessage}}
</div>
```
#### 关于模板引用变量的注意事项 

模板引用变量 (#phone) 和*ngFor部分看到过的模板输入变量 (let phone) 是不同的。 要了解详情，参见结构型指令一章。

模板引用变量的作用范围是整个模板。 不要在同一个模板中多次定义同一个变量名，否则它在运行期间的值是无法确定的。

你也可以用 ref- 前缀代替 #。 下面的例子中就用把 fax 变量声明成了 ref-fax 而不是 #fax。

`src/app/app.component.html`
```html
<input ref-fax placeholder="fax number">
<button (click)="callFax(fax.value)">Fax</button>
```
## 输入和输出属性 

输入属性是一个带有 @Input 装饰器的可设置属性。当它通过属性绑定的形式被绑定时，值会“流入”这个属性。

输出属性是一个带有 @Output 装饰器的可观察对象型的属性。 这个属性`几乎总是返回 Angular 的EventEmitter`。 当它通过事件绑定的形式被绑定时，值会“流出”这个属性。

你只能通过它的输入和输出属性将其绑定到其它组件。

> 记住，所有的组件都是指令。
> 
> 为简洁起见，以下讨论会涉及到组件，因为这个主题主要是组件作者所关心的问题。

#### 讨论 

在下面的例子中，iconUrl 和 onSave 是组件的成员，它们在 = 右侧引号语法中被引用了。

`src/app/app.component.html`
```html
<img [src]="iconUrl"/>
<button (click)="onSave()">Save</button>
```

iconUrl 和 onSave 是 AppComponent 类的成员。但它们并没有带 @Input() 或 @Output() 装饰器。 Angular 不在乎。

你总是可以在组件自己的模板中绑定到组件的公共属性，而不用管它们是否输入（Input）属性或输出（Output）属性。

这是因为组件类和模板是紧耦合的，它们是同一个东西的两个部分，合起来构成组件。 组件类及其模板之间的交互属于实现细节。

### 绑定到其它组件 

你也可以绑定到其它组件的属性。 这种绑定形式下，其它组件的属性位于等号（=）的左侧。

下面的例子中，AppComponent 的模板把 AppComponent 类的成员绑定到了 HeroDetailComponent（选择器为 'app-hero-detail'） 的属性上。

`src/app/app.component.html`
```html
<app-hero-detail [hero]="currentHero" (deleteRequest)="deleteHero($event)">
</app-hero-detail>
```
Angular 的编译器可能会对这些绑定报错，就像这样： 

    Uncaught Error: Template parse errors:
    Can't bind to 'hero' since it isn't a known property of 'app-hero-detail' 

<font color="blue">(注：因为没有在HeroDetailComponent的属性上加上@Input()注解)</font>
    
你自己知道 HeroDetailComponent 有两个属性 hero 和 detectRequest，但 Angular 编译器并不知道。

Angular 编译器不会绑定到其它组件的属性上 —— 除非这些属性是输入或输出属性。

这条规则是有充分理由的。

组件绑定到它自己的属性当然没问题。 该组件的作者对这些绑定有完全的控制权。

但是，其它组件不应该进行这种毫无限制的访问。 如果任何人都可以绑定到你的组件的任何属性上，那么这个组件就很难维护。 所以，外部组件应该只能绑定到组件的公共（允许绑定） API 上。

Angular要求你显式声明那些API。它让你可以自己决定哪些属性是可以被外部组件绑定的。

#### typeScript 的 public 是没用的 

<font color="blue">(注：javaer注意了)</font>

你不能用TypeScript的public和private访问控制符来标明组件的公共 API。

>所有数据绑定属性必须是TypeScript的公共属性，Angular永远不会绑定到TypeScript中的私有属性。

因此，Angular需要一些其它方式来标记出那些允许被外部组件绑定到的属性。这种其它方式，就是@Input()和@Output()装饰器。

### 声明输入与输出属性 

在本章的例子中，绑定到 HeroDetailComponent 不会失败，这是因为这些要进行数据绑定的属性都带有 @Input() 和 @Output() 装饰器。

`src/app/hero-detail.component.ts`
```html
@Input()  hero: Hero;
@Output() deleteRequest = new EventEmitter<Hero>();
```
另外，还可以在指令元数据的 inputs 或 outputs 数组中标记出这些成员。比如这个例子：

`src/app/hero-detail.component.ts`
```html
@Component({
  inputs: ['hero'],
  outputs: ['deleteRequest'],
})
```
### 输入还是输出？ 

输入属性通常接收数据值。 输出属性暴露事件生产者，如 EventEmitter 对象。

输入和输出这两个词是从目标指令的角度来说的。

![](https://github.com/YuxingXie/angularTemplateSyntax/raw/master/input-output.png) 

从 HeroDetailComponent 角度来看，HeroDetailComponent.hero 是个输入属性， 因为数据流从模板绑定表达式流入那个属性。

从 HeroDetailComponent 角度来看，HeroDetailComponent.deleteRequest 是个输出属性， 因为事件从那个属性流出，流向模板绑定语句中的处理器。

### 给输入/输出属性起别名 

有时需要让输入/输出属性的公共名字不同于内部名字。

这是使用 attribute 指令时的常见情况。 指令的使用者期望绑定到指令名。例如，在 <div> 上用 myClick 选择器应用指令时， 希望绑定的事件属性也叫 myClick。

`src/app/app.component.html`
```html
<div (myClick)="clickMessage=$event" clickable>click with myClick</div>
```
然而，在指令类中，直接用指令名作为自己的属性名通常都不是好的选择。 指令名很少能描述这个属性是干嘛的。 myClick 这个指令名对于用来发出 click 消息的属性就算不上一个好名字。

幸运的是，可以使用约定俗成的公共名字，同时在内部使用不同的名字。 在上面例子中，实际上是把 myClick 这个别名指向了指令自己的 clicks 属性。

把别名传进@Input/@Output 装饰器，就可以为属性指定别名，就像这样：

`src/app/click.directive.ts`
```html
@Output('myClick') clicks = new EventEmitter<string>(); //  @Output(alias) propertyName = ...
```
也可在 inputs 和 outputs 数组中为属性指定别名。 可以写一个冒号 (:) 分隔的字符串，左侧是指令中的属性名，右侧则是公共别名。

`src/app/click.directive.ts`
```typescript
@Directive({
  outputs: ['clicks:myClick']  // propertyName:alias
})
```
## 模板表达式操作符 
模板表达式语言使用了 JavaScript 语法的子集，并补充了几个用于特定场景的特殊操作符。 下面介绍其中的两个：管道和安全导航操作符。

### 管道操作符 ( | ) 

在绑定之前，表达式的结果可能需要一些转换。例如，可能希望把数字显示成金额、强制文本变成大写，或者过滤列表以及进行排序。

Angular 管道对像这样的小型转换来说是个明智的选择。 管道是一个简单的函数，它接受一个输入值，并返回转换结果。 它们很容易用于模板表达式中，只要使用管道操作符 (|) 就行了。

`src/app/app.component.html`
```html
<div>Title through uppercase pipe: {{title | uppercase}}</div>

```
管道操作符会把它左侧的表达式结果传给它右侧的管道函数。

还可以通过多个管道串联表达式：

`src/app/app.component.html`
```html
<!-- Pipe chaining: convert title to uppercase, then to lowercase -->
<div>
  Title through a pipe chain:
  {{title | uppercase | lowercase}}
</div>
```

还能对它们使用参数：

`src/app/app.component.html`
```html
<!-- pipe with configuration argument => "February 25, 1970" -->
<div>Birthdate: {{currentHero?.birthdate | date:'longDate'}}</div>
```

json 管道对调试绑定特别有用：

`src/app/app.component.html (pipes-json)`
```html
<div>{{currentHero | json}}</div>
```

它生成的输出是这样的：

```json
{ "id": 0, "name": "Hercules", "emotion": "happy",
  "birthdate": "1970-02-25T08:00:00.000Z",
  "url": "http://www.imdb.com/title/tt0065832/",
  "rate": 325 }

```
### 安全导航操作符 ( ?. ) 和空属性路径 

Angular 的安全导航操作符 (?.) 是一种流畅而便利的方式，用来保护出现在属性路径中 null 和 undefined 值。 下例中，当 currentHero 为空时，保护视图渲染器，让它免于失败。

`src/app/app.component.html`
```html
The current hero's name is {{currentHero?.name}}

```
如果下列数据绑定中 title 属性为空，会发生什么？

`src/app/app.component.html`
```html
The title is {{title}}

```
这个视图仍然被渲染出来，但是显示的值是空；只能看到 “The title is”，它后面却没有任何东西。 这是合理的行为。至少应用没有崩溃。

假设模板表达式涉及属性路径，在下例中，显示一个空 (null) 英雄的 firstName。

```html
The null hero's name is {{nullHero.name}}
```

JavaScript 抛出了空引用错误，Angular 也是如此：


>TypeError: Cannot read property 'name' of null in [null].

晕，整个视图都不见了。

如果确信 hero 属性永远不可能为空，可以声称这是合理的行为。 如果它必须不能为空，但它仍然是空值，实际上是制造了一个编程错误，它应该被捕获和修复。 这种情况应该抛出异常。

另一方面，属性路径中的空值可能会时常发生，特别是数据目前为空但最终会出现。

当等待数据的时候，视图渲染器不应该抱怨，而应该把这个空属性路径显示为空白，就像上面 title 属性那样。

不幸的是，当 currentHero 为空的时候，应用崩溃了。

可以通过用NgIf代码环绕它来解决这个问题。

`src/app/app.component.html`
```html
<!--No hero, div not displayed, no error -->
<div *ngIf="nullHero">The null hero's name is {{nullHero.name}}</div>
```
或者可以尝试通过 && 来把属性路径的各部分串起来，让它在遇到第一个空值的时候，就返回空。

`src/app/app.component.html`
```html
The null hero's name is {{nullHero && nullHero.name}}

```
这些方法都有价值，但是会显得笨重，特别是当这个属性路径非常长的时候。 想象一下在一个很长的属性路径（如 a.b.c.d）中对空值提供保护。

Angular 安全导航操作符 (?.) 是在属性路径中保护空值的更加流畅、便利的方式。 表达式会在它遇到第一个空值的时候跳出。 显示是空的，但应用正常工作，而没有发生错误。

`src/app/app.component.html`
```html
<!-- No hero, no problem! -->
The null hero's name is {{nullHero?.name}}
```
在像 `a?.b?.c?.d` 这样的`长属性路径中，它工作得很完美`。

### 非空断言操作符（!）

在 TypeScript 2.0 中，你可以使用 --strictNullChecks 标志强制开启严格空值检查。TypeScript 就会确保不存在意料之外的 null 或 undefined。

在这种模式下，有类型的变量默认是不允许 null 或 undefined 值的，如果有未赋值的变量，或者试图把 null 或 undefined 赋值给不允许为空的变量，类型检查器就会抛出一个错误。

如果类型检查器在运行期间无法确定一个变量是 null 或 undefined，那么它也会抛出一个错误。 你自己可能知道它不会为空，但类型检查器不知道。 所以你要告诉类型检查器，它不会为空，这时就要用到非空断言操作符。

Angular 模板中的**非空断言操作符（!）也是同样的用途。

例如，在用*ngIf来检查过 hero 是已定义的之后，就可以断言 hero 属性一定是已定义的。

`src/app/app.component.html`
```html
<!--No hero, no text -->
<div *ngIf="hero">
  The hero's name is {{hero!.name}}
</div>
```
在 Angular 编译器把你的模板转换成 TypeScript 代码时，这个操作符会防止 TypeScript 报告 "hero.name 可能为 null 或 undefined"的错误。

与安全导航操作符不同的是，非空断言操作符不会防止出现 null 或 undefined。 它只是告诉 TypeScript 的类型检查器对特定的属性表达式，不做 "严格空值检测"。

如果你打开了严格控制检测，那就要用到这个模板操作符，而其它情况下则是可选的。

## 类型转换函数 $any （$any( <表达式> )）
 
有时候，绑定表达式可能会报类型错误，并且它不能或很难指定类型。要消除这种报错，你可以使用 $any 转换函数来把表达式转换成 any 类型。

`src/app/app.component.html`
```html
<!-- Accessing an undeclared member -->
<div>
  The hero's marker is {{$any(hero).marker}}
</div>
```
在这个例子中，当 Angular 编译器把模板转换成 TypeScript 代码时，$any 表达式可以防止 TypeScript 编译器报错说 marker 不是 Hero 接口的成员。

$any 转换函数可以和 this 联合使用，以便访问组件中未声明过的成员。

`src/app/app.component.html`
```html
<!-- Accessing an undeclared member -->
<div>
  Undeclared members is {{$any(this).member}}
</div>
```
$any 转换函数可以在`绑定表达式中任何可以进行方法调用的地方`使用。

## 小结

你完成了模板语法的概述。现在，该把如何写组件和指令的知识投入到实际工作当中了。 

(注：我将在新研究项目中完成一个链式数据展示自定义指令)
