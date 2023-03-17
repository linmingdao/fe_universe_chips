// 1、对应名称
// prototype：原型
// __proto__：原型链（链接点）

// 2、从属关系
// prototype：是函数的一个属性，本身是一个对象 {}
// __proto__：是对象Object的一个属性，本身是一个对象 {}

// js分为函数对象和普通对象，每个对象都有__proto__属性，但是只有函数对象才有prototype属性
// Object、Function都是js内置的函数, 类似的还有我们常用到的Array、RegExp、Date、Boolean、Number、String

// 3、何为原型链：
// 对象的__proto__属性保存着该对象的构造函数的prototype

function Test() {}
console.log(Test.prototype);

const test = new Test();
console.log(test.__proto__);
console.log(Test.prototype === test.__proto__); // true

console.log(Test.prototype.__proto__);
console.log(Test.prototype.__proto__ === Object.prototype); // true

console.log(Object); // Object是JS提供的一个函数（用于创建对象）
console.log(Object.prototype);
console.log(Object.prototype.__proto__); // null，也就是说原型链，到了Object就是到顶了

console.log(Function); // Function是JS提供的一个函数（用于创建函数）
console.log(Function.prototype);
console.log(Function.prototype.__proto__);
console.log(Function.prototype.__proto__ === Object.prototype); // true
