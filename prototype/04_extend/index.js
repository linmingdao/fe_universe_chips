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

// 5、如果更改了构造函数的原型，记得同时提供该原型的构造函数(constructor)

// Object 是对象的构造方法，是方法，所以有 prototype
console.log(Object.prototype);
console.log(Object.prototype.__proto__); // null
`
{
  constructor: f Object()
  // ...其他公共的实例方法
  __proto__: null
}
`;

// Object 是由 Function 创建出来的函数对象，所以也有 __proto__
console.log(Object.__proto__);
// 对象的 __proto__ 指向其构造函数的 prototype
console.log(Object.__proto__ === Function.prototype); // true

console.log(Function.prototype);
console.log(Function.__proto__);
console.log(Function.prototype.__proto__);
console.log(Function.prototype.__proto__ === Object.prototype); // true
console.log(Function.prototype === Function.__proto__); // true
