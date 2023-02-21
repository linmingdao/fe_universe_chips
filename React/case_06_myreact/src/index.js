// import React from 'react';
// import ReactDOM from 'react-dom/client';
import React from './08_P10_class_component/react';
import ReactDOM from './08_P10_class_component/react-dom';

const style = { border: '3px solid red', margin: '10px', padding: '10px' };

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }

  onClick = () => {
    this.setState((state) => ({ number: state.number + 1 }));
  };

  render() {
    return (
      <div id="counter">
        <span>{this.state.number}</span>
        <button onClick={this.onClick}>+1</button>
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

ReactDOM.render(element, document.getElementById('root'));
