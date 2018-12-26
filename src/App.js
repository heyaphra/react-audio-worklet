import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Menu, Dropdown, Icon, Button } from 'antd';



class App extends Component {
  constructor() {
    super();
    this.state = {
      current: 'Select a module'
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
      <Menu onClick={(e) => this.handleChange(e)} selectedKeys={[this.state.current]}>
        <Menu.Item key="Bypass Filter">
          Bypass Filter
        </Menu.Item>
        <Menu.Item key="One Pole Filter">
          One Pole Filter
        </Menu.Item>
        <Menu.Item key="Noise">
          Noise
        </Menu.Item>
        <Menu.Item key="Bitcrusher">
          Bitcrusher
        </Menu.Item>   
        <Menu.Item key="Message Port">
          Message Port
        </Menu.Item>  
      </Menu>
    );
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <span>React + AudioWorklet = ❤</span>
          <div style={{float:'left', width: '100%'}}>
            <Dropdown overlay={menu} size='small'>
              <a className="ant-dropdown-link" href="#">
                {this.state.current} <Icon type="down" />
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
