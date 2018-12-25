import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import MessengerWorkletNode from './messenger-node';

class App extends Component {
  constructor() {
    super();
    this.actx = new AudioContext();
  }
  componentDidMount() {

  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            AudioWorklet meets React
          </p>
        </header>
      </div>
    );
  }
}

export default App;
