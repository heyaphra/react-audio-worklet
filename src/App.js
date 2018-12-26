import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Menu, Dropdown, Icon, Button } from 'antd';



class App extends Component {
  constructor() {
    super();
    this.state = {
      selected: null,
      moduleLoaded: false,
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
  }
  async loadModule(moduleName) {
    const { actx } = this;   
    try {
      await actx.audioWorklet.addModule(
        `${process.env.PUBLIC_URL}/worklet/${moduleName}.js`,
      );
      this.setState({moduleLoaded: true})
      console.log(`loaded module ${moduleName}`);
    } catch(e) {
      console.log(`Failed to load module ${moduleName}`);
      this.setState({moduleLoaded: false})
    }
  }
  bypassProcessor() {
    const { actx } = this;
    this.bypasserNode = new AudioWorkletNode(actx, 'bypass-processor');
    this.oscillator = actx.createOscillator();
    this.oscillator.connect(this.bypasserNode).connect(actx.destination);
    this.oscillator.start();
  }
  onePoleProcessor() {
    const { actx } = this;
    const beginning = actx.currentTime;
    const middle = actx.currentTime + 4;
    const end = actx.currentTime + 8;
    this.oscillator = actx.createOscillator();
    this.filterNode = new AudioWorkletNode(actx, 'one-pole-processor');
    const frequencyParam = this.filterNode.parameters.get('frequency');
    this.oscillator.connect(this.filterNode).connect(actx.destination);
    this.oscillator.start();
    this.oscillator.stop(end)
    
    frequencyParam
        .setValueAtTime(0.01, beginning)
        .exponentialRampToValueAtTime(actx.sampleRate * 0.5, middle)
        .exponentialRampToValueAtTime(0.01, end);

    this.oscillator.onended = () => {
        this.setState({isPlaying: false})
    }

  }
  handleSelect(e) {
    this.setState({selected: e.key, moduleLoaded: false});

    /* If no AudioContext, instantiate one and load modules */
    if(!this.actx) {
      try {
        console.log('New context instantiated')
        this.actx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) {
          console.log(`Sorry, but your browser doesn't support the Web Audio API!`, e);
      }
    } 

    switch(e.key) {
      default:
        return;
      break;
      case 'Bypass Filter':
        this.loadModule('bypass-processor')
      break;
      case 'One Pole Filter':
        this.loadModule('one-pole-processor')
      break;
    }
  }
  async handleClick() {
    const { state } = this;
    console.log(this.state)

    /* isPlaying is true only if a module has been selected */
    if(state.selected) {
      this.setState({isPlaying: !state.isPlaying});    
    }    

    switch(state.selected) {
      case 'Bypass Filter':
        if(state.isPlaying) {
          console.log(`stopping ${state.selected}`)
          this.bypasserNode.port.postMessage(false)
        } else {
          console.log(`playing ${state.selected}`)
          this.bypassProcessor();
          this.bypasserNode.port.postMessage(true);          
        }
      break;
      case 'One Pole Filter':
      if(state.isPlaying) {
        console.log(`stopping ${state.selected}`)
        this.filterNode.port.postMessage(false);          
      } else {
        console.log(`playing ${state.selected}`)
        this.onePoleProcessor();
        this.filterNode.port.postMessage(true);          
      }
    break;

    }

      // if(state.isPlaying) {
      //   this.filterNode.port.postMessage(false);          
      // } else {
      //   this.onePoleProcessor();
      //   this.filterNode.port.postMessage(true);          
      // }
    



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