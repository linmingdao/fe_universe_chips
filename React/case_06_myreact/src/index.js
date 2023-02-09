// import React from 'react';
// import ReactDOM from 'react-dom/client';
import React from './02_P04_mount_beginWork/react';
import ReactDOM from './02_P04_mount_beginWork/react-dom';

const style = { border: '3px solid red', margin: '10px', padding: '10px' };

// jsx
let element = (
  <div id="A1" style={style}>
    A1
    <div id="B1" style={style}>
      B1
      <div id="C1" style={style}>
        C1
      </div>
      <div id="C1" style={style}>
        C2
      </div>
    </div>
    <div id="B2" style={style}>
      B2
    </div>
  </div>
);
// console.log(element);

// babel将jsx编译成如下代码，createElement返回虚拟dom
// React.createElement("div", {id: "A1"},
//   React.createElement("div", {
//        id: "B1"
//    },B1文本,React.createElement("div", {
//        id: "C1"
//    },C1文本),React.createElement("div", {
//        id: "C2"
//    },C2文本)),React.createElement("div", {
//        id: "B2"
//    }));

// ReactDOM.createRoot(document.getElementById('root')).render(element);
ReactDOM.render(element, document.getElementById('root'));
