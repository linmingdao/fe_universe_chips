// 1、对应名称
// prototype：原型
// __proto__：原型链（链接点）

// 2、从属关系
// prototype：是函数的一个属性，本身是一个对象 {}
// __proto__：是对象Object的一个属性，本身是一个对象 {}

// 3、何为原型链：
// 对象的__proto__属性保存着该对象的构造函数的prototype

function Test() {}
console.log(Test.prototype);

const test = new Test();
console.log(test.__proto__);
console.log(Test.prototype === test.__proto__); // true

console.log(Test.prototype.__proto__);
console.log(Test.prototype.__proto__ === Object.prototype); // true

// console.log(Object); // Object是JS提供的一个函数（用于创建对象）
console.log(Object.prototype);
console.log(Object.prototype.__proto__); // null，也就是说原型链，到了Object就是到顶了

console.log();

// const o = Object.create(null);
// console.log(o);
// console.log(o.prototype); // undefined

// console.log({});

// 函数本身也是由 Function 创建出来的，所以也可以理解为 Test 函数 是 Function 的实例（对象）
console.log(Test.__proto__);
console.log(Test.__proto__ === Function.prototype); // true
// const Test = new Function();

console.log(Function.__proto__);
console.log(Function.prototype);
console.log(Function.__proto__ === Function.prototype); // true

// const obj = {}; --> const obj = new Object(); // function

console.log(typeof Object);
console.log(Object.__proto__ === Function.prototype);
console.log(Object.__proto__ === Function.__proto__);

// 最终结论：

// 1、对应名称
// prototype：原型
// __proto__：原型链（链接点）

// 2、从属关系
// prototype：是函数的一个属性，本身是一个对象 {}
// __proto__：是对象Object的一个属性，本身是一个对象 {}

// 3、何为原型链：
// 对象的__proto__属性保存着该对象的构造函数的prototype

// 4、最最最最顶层的是 Function ，Object 是 Function 创建出来的一个函数（即 Object 是 Function 的实例）
