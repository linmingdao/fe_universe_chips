// import React from 'react';
// import ReactDOM from 'react-dom/client';
import React from './P11_funcComponent_hooks_useState/react';
import ReactDOM from './P11_funcComponent_hooks_useState/react-dom';

const style = { border: '3px solid red', margin: '10px', padding: '10px' };
const buttonStyle = {
  border: '3px solid blue',
  borderRadius: '4px',
  margin: '10px',
  padding: '10px',
  cursor: 'pointer',
};

class ClassCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: -1 };
  }

  onClick = () => {
    this.setState((state) => ({ number: state.number + 1 }));
  };

  render() {
    return (
      <div id="class_counter">
        类组件：
        <span>{this.state.number}</span>
        <button style={buttonStyle} onClick={this.onClick}>
          +1（class counter）
        </button>
      </div>
    );
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return { count: state.count + 1 };
    default:
      return state;
  }
}

function FuncCounter(props) {
  const [countState, dispatch] = React.useReducer(reducer, { count: 0 });
  const [numberState, setNumber] = React.useState({ number: 1 });

  return (
    <div id="func_counter" style={style}>
      函数组件：
      <div>
        hook1：<span>{countState.count}</span>
        <button style={buttonStyle} onClick={() => dispatch({ type: 'ADD' })}>
          +1（func counter）
        </button>
      </div>
      <div>
        useState：<span>{numberState.number}</span>
        <button
          style={buttonStyle}
          onClick={() => setNumber({ number: numberState.number + 1 })}
        >
          +1（func counter）
        </button>
      </div>
    </div>
  );
}

let element = (
  <div id="A1" style={style}>
    A1
    <ClassCounter />
    <FuncCounter />
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
