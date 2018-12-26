import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Menu, Dropdown, Icon, Button } from 'antd';



class App extends Component {
  constructor() {
    super();
    this.state = {
      selected: null,
      modulesLoaded: false,
      isPlaying: false
    }
    this.menu = (
      <Menu onClick={(e) => this.handleSelect(e)} selectedKeys={[this.state.current]}>
        <Menu.Item key="Bypass Filter" custom='prop'>
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
    this.bypassProcessor = this.bypassProcessor.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClick = this.handleClick.bind(this);

  }
  async loadModules() {
    const { actx } = this;    
    await actx.audioWorklet.addModule(
        `${process.env.PUBLIC_URL}/worklet/bypass-processor.js`
    );
    this.setState({modulesLoaded: true})
    console.log('loaded modules!')
  }
  bypassProcessor() {
    const { actx } = this;
    const bypasser = new AudioWorkletNode(actx, 'bypass-processor');
    this.oscillator = new OscillatorNode(actx);                
    this.oscillator.connect(bypasser).connect(actx.destination);
    this.oscillator.start();
  }
  handleSelect(e) {
    this.setState({selected: e.key});
  }
  async handleClick() {
    const { state } = this;

    if(state.selected) {
      this.setState({isPlaying: !state.isPlaying});    
    }    
    
    if(!this.actx) {
      try {
        console.log('New context instantiated')
        this.actx = new (window.AudioContext || window.webkitAudioContext)();
        await this.loadModules();
      } catch(e) {
        console.log(`Sorry, but your browser doesn't support the Web Audio API!`);
      }
    }

    switch (state.selected) {
      case 'Bypass Filter':
        if(state.isPlaying) {
          this.oscillator.stop();
        } else {
          this.bypassProcessor();
        }
      break;
      case 'One Pole Filter':
        console.log('pole');
      break;
      case 'Noise':
        console.log('noise')
      break;
      case 'Bitcrusher':
        console.log('crushit');
      break;
      case 'Message Port':
        console.log('postin')
      break;
    }
    

  }
  render() {
    const { state, menu } = this;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <span>React + AudioWorklet = ❤</span>
          <div style={{float:'left', width: '100%'}}>
            <Dropdown overlay={menu} size='small'>
              <a className="ant-dropdown-link" href="#">
                {state.selected ? state.selected : 'Select a module'} <Icon type="down" />
              </a>
            </Dropdown>
            <Button ghost onClick={() => this.handleClick()} style={{marginLeft:'1%'}}>{state.isPlaying ? 'Stop' : 'Start'}</Button>
          </div>
        </header>
      </div>
    );
  }
}

export default App;