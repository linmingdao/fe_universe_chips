// 1、对应名称
// prototype：原型
// __proto__：原型链（链接点）

// 2、从属关系
// prototype：是函数的一个属性，本身是一个对象 {}
// __proto__：是对象Object的一个属性，本身是一个对象 {}

// 3、何为原型链：
// 对象的__proto__属性保存着该对象的构造函数的prototype

// 4、js分为函数对象和普通对象，每个对象都有__proto__属性，但是只有函数对象才有prototype属性
// Object、Function都是js内置的函数, 类似的还有我们常用到的Array、RegExp、Date、Boolean、Number、String

function Foo() {
  this.a = 1;
}

// 原型被重写的情况
Foo.prototype = {
  constructor: Foo,
  say() {},
}; // 底层本质是 new Object 生成的一个对象

const foo = new Foo();

console.log(foo.__proto__ === Foo.prototype); // true
console.log(foo.__proto__.__proto__ === Object.prototype); // true
console.log(foo.__proto__.__proto__.__proto__); // null
console.log(foo);
`
{
    a: 1,
    __proto__: { // 对象的 __proto__ 指向自己构造函数的 prototype
        constructor: f Foo()
        say: f say()
        __proto__: { // 我们复写了构造函数的prototype(new Object)，指向 Object 的 prototype
            constructor: f Object()
            hasOwnProperty: f hasOwnProperty()
            __proto__: null
        }
    }
}
`;

// 原型链上属性的可访问性，in 和 hasOwnProperty
// console.log(foo.hasOwnProperty('a')); // true
// console.log(foo.hasOwnProperty('say')); // false
// console.log('say' in foo); // true

// for (let k in foo) {
//   // 1、验证了 in 操作符 确实可能会遍历到原型链上的可枚举的属性： a、constructor、say
//   // 2、如果 Foo 原型没有被重写的话，那么不会被遍历到 constructor，原因应该是js底层配置了不可枚举
//   // 3、而且 最顶层 Object.protorype 的属性都没有被遍历到，说明他的原型上的方法都是不可枚举的
//   console.log(k);
// }
// for (let k in Object.prototype) {
//   // 最顶层 Object.protorype 的属性都没有被遍历到，说明他的原型上的方法都是不可枚举的
//   console.log(k);
// }
// console.log(Object.prototype.propertyIsEnumerable('hasOwnProperty')); // false

// 创建对象的技巧
// Object.create 的用法，Object.create(null) => 表示创建一个纯净的对象，没有继承任何东西，create的入参表示继承的原型链
