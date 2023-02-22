// import React from 'react';
// import ReactDOM from 'react-dom/client';
import React from './08_P10_class_component/react';
import ReactDOM from './08_P10_class_component/react-dom';

const style = { border: '3px solid red', margin: '10px', padding: '10px' };
const buttonStyle = {
  border: '3px solid blue',
  borderRadius: '4px',
  margin: '10px',
  padding: '10px',
  cursor: 'pointer',
};

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: -1 };
  }

  onClick = () => {
    this.setState((state) => ({ number: state.number + 1 }));
  };

  render() {
    return (
      <div id="counter">
        <span>{this.state.number}</span>
        <button style={buttonStyle} onClick={this.onClick}>
          +1
        </button>
      </div>
    );
  }
}

let element = (
  <div id="A1" style={style}>
    A1
    <Counter />
    <div id="B1" style={style}>
      B1
      <div id="C1" style={style}>
        C1
      </div>
      <div id="C2" style={style}>
        C2
      </div>
    </div>
    <div id="B2" style={style}>
      B2
    </div>
  </div>
);
console.log('babel编译jsx生成的虚拟dom树：', element);

// ReactDOM.createRoot(document.getElementById('root')).render(element);
ReactDOM.render(element, document.getElementById('root'));

let render2 = document.getElementById('render2');
render2.addEventListener('click', function () {
  const style = { border: '2px solid green', margin: '10px', padding: '10px' };
  let element2 = (
    <div id="A1-new" style={style}>
      A1-new
      <div id="B1-new" style={style}>
        B1-new
        <div id="C1-new" style={style}>
          C1-new
        </div>
        <div id="C2-new" style={style}>
          C2-new
        </div>
      </div>
      <div id="B2-new" style={style}>
        B2-new
      </div>
      <div id="B3-new" style={style}>
        B3-new
      </div>
    </div>
  );

  ReactDOM.render(element2, document.getElementById('root'));
});

let render3 = document.getElementById('render3');
render3.addEventListener('click', function () {
  const style = { border: '1px solid blue', margin: '10px', padding: '10px' };
  let element3 = (
    <div id="A1-new2" style={style}>
      A1-new2
      <div id="B1-new2" style={style}>
        B1-new2
        <div id="C1-new2" style={style}>
          C1-new2
        </div>
        <div id="C2-new2" style={style}>
          C2-new2
        </div>
      </div>
      <div id="B2-new2" style={style}>
        B2-new2
      </div>
    </div>
  );

  ReactDOM.render(element3, document.getElementById('root'));
});
