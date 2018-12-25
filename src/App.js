import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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
          React + AudioWorklet = ❤
          <p>
          <select>
            <option value="bypasser">Bypasser</option>
            <option value="filter">One Pole Filter</option>
            <option value="noise">Noise Generator</option>
            <option value="bitcrusher">Bit Crusher</option>
            <option value="message">Message Port</option>
          </select>
          </p>
        </header>
      </div>
    );
  }
}

export default App;
