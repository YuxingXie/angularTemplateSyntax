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
