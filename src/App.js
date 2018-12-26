import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Menu, Dropdown, Icon, Button } from 'antd';



class App extends Component {
  constructor() {
    super();
    this.state = {
      value: ''
    }
    this.actx = new AudioContext();
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    console.log('click ', e.key);
    this.setState({
      current: e.key,
    });
  }
  render() {
    const menu = (
      <Menu onClick={(e) => this.handleChange(e)}>
        <Menu.Item key="bypass">
          Bypass Filter
        </Menu.Item>
        <Menu.Item key="filter">
          One Pole Filter
        </Menu.Item>
        <Menu.Item key="noise">
          Noise
        </Menu.Item>
        <Menu.Item key="bitcrusher">
          Bitcrusher
        </Menu.Item>   
        <Menu.Item key="messageport">
          Message Port
        </Menu.Item>  
      </Menu>
    );
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          React + AudioWorklet = ❤
          <div style={{float:'left', width: '100%'}}>
            <Dropdown overlay={menu} size='small'>
              <a className="ant-dropdown-link" href="#">
                Select a module <Icon type="down" />
              </a>
            </Dropdown>
            <Button ghost style={{marginLeft:'1%'}}>Start</Button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
