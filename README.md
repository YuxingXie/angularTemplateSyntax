# AngularTemplateSyntax

本研究项目用于研究angular模板语法，技术资料参见angular中文官网。一般概念仅在此列出，难点详细研究。

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
```html
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
```html
<button (click)="deleteHero()">Delete hero</button>
```
语句上下文可以`引用`(注：所谓引用一般说来是充当方法参数)模板自身上下文中的属性（注：$event应该是一个内置变量，模板输入变量和模板引用变量类似于模板内声明的变量）。在下面的例子中，就把模板的$event对象(稍后研究)、模板输入变量(let hero)和模板引用变量(#heroForm)传给了组件中的一个事件处理器方法。 

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

(注：理解上面这段话是很有意义的，绑定到底干什么用的，绑定的目标和数据源具体表现是什么，概念都应该在研究中逐渐清晰) 

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

(注：class,attr,style这3个绑定形式上有些类似，而事件则需要深入研究) 

放开眼界，来看看每种绑定类型的具体情况。 


## 属性绑定 
当要把视图元素的属性(property)设置为模板表达式时，就要写模板的`属性(property)绑定`。

最常用的属性绑定是把元素属性设置为组件属性的值。 下面这个例子中，image 元素的 src 属性会被绑定到组件的 heroImageUrl 属性上：

(注：从面向对象的概念看，组件是一个类，组件的属性值就是类的属性值) 

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
(注：[ngClass]绑定到组件的classes属性)
```
还有另一个例子是设置自定义组件的模型属性（这是父子组件之间通讯的重要途径）： 

(注：仅从表现形式上看，自定义组件和普通html元素的属性绑定没什么不一样)

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

(注：重点：1单向,只读，2不能调用方法，3事件监听)

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

(注：所以，ngClass是某个指令的属性名，严格说叫输入属性名)

如果名字没有匹配上已知指令或元素的属性，Angular 就会报告“未知指令”的错误。

### 消除副作用 

正如以前讨论过的，模板表达式的计算不能有可见的副作用。表达式语言本身可以提供一部分安全保障。 不能在属性绑定表达式中对任何东西赋值，也不能使用自增、自减运算符。

当然，表达式可能会调用具有副作用的属性或方法。但Angular没法知道这一点，也没法阻止你。

表达式中可以调用像getFoo()这样的方法。只有你知道getFoo()干了什么。如果getFoo()改变了某个东西，恰好又绑定到个这个东西，你就可能把自己坑了。Angular可能显示也可能不显示变化后的值。Angular还可能检测到变化，并抛出警告型错误。一般建议是，只绑定数据属性和那些只返回值而不做其它事情的方法。

(注：`单向输入`小节所讲的`不能使用属性绑定来调用目标元素上的方法`和这里所讲的`表达式中调用方法`是不一样的)

### 返回恰当的类型 

模板表达式应该返回目标属性所需类型的值。如果目标属性想要个字符串，就返回字符串。如果目标属性想要个数字，就返回数字。如果目标属性想要个对象，就返回对象。 

(注：对于html属性，一般只会要求字符串或数字，而对于自定义组件属性，则有可能是一个对象)  

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
(注：就像使用普通html属性一样) 

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
![](https://www.angular.cn/generated/images/guide/template-syntax/evil-title.png) 

