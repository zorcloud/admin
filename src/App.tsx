import './App.less';

import React, { useState } from 'react';

import { Button } from 'antd';

// import _ from 'lodash';
function App() {
  const [value, setValue] = useState(0);
  const add = () => {
    setValue(value + 1);
  };
  const sub = () => {
    setValue(value - 1);
  };
  const oddAdd = () => {
    if (value % 2 !== 0) {
      setValue(value + 1);
    }
  };
  const asyncAdd = () => {
    setTimeout(() => {
      setValue(value + 1);
    }, 500);
  };
  return (
    <div className="App">
      <div className="l">123456</div>
      <div className="q-primary">primary</div>
      <div className="q-secondary">secondary</div>
      <div className="q-success">success</div>
      <div className="l-1">primary</div>
      <div className="l-2">secondary</div>
      <div className="l-3">success</div>
      <hr />
      <p>{value}</p>
      <Button type="primary" onClick={add}>
        +
      </Button>
      <Button onClick={sub}>-</Button>
      <Button onClick={oddAdd}>odd+</Button>
      <Button onClick={asyncAdd}>async+</Button>
    </div>
  );
}

export default App;
