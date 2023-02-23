import React from 'react';
import ReactDOM from 'react-dom/client';

// JSX React 语法糖 描述UI界面
let element = (
  <div id="0" className="red">
    <div id="1">1</div>
    <div id="2">2</div>
  </div>
);
console.log(JSON.stringify(element, null, 2));
ReactDOM.createRoot(document.getElementById('root')).render(element);
