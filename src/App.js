import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Menu, Dropdown, Icon, Button } from 'antd';

class App extends Component {
  constructor() {
    super();
    this.state = {
      selected: null, /* Which module has been selected from the menu */
      moduleLoaded: false, /* Has the current selected module finished loading? */
      isPlaying: false /* Is a module currently playing? */
    }
    /* Menu is an overlay for the Ant Design dropdown component, passed in via props. */
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
  /* The function below takes module name as an arg and adds it to the AudioContext's audioWorklet */
  async loadModule(moduleName) {
    const { actx } = this;   
    try {
      await actx.audioWorklet.addModule(
        `${process.env.PUBLIC_URL}/worklet/${moduleName}.js`,
      );
      this.setState({moduleLoaded: true})
      console.log(`loaded module ${moduleName}`);
    } catch(e) {
      this.setState({moduleLoaded: false})
      console.log(`Failed to load module ${moduleName}`);
    }
  }
  /* The function below creates an AudioWorkletNode, connects it to our AudioContext,
     connects an oscillator to it, and starts the oscillator */
  bypassProcessor() {
    const { actx } = this;
    this.bypasserNode = new AudioWorkletNode(actx, 'bypass-processor');
    this.oscillator = actx.createOscillator();
    this.oscillator.connect(this.bypasserNode).connect(actx.destination);
    this.oscillator.start();
  }
/* The example below initially demonstrated a one-off scheduled event. I've modified it to play
    based on the AudioContext's currentTime so that it can be replayed at the press of a button. 
    It creates a new AudioWorkletNode and a new oscillator, connects the new oscillator to the 
    node, starts the oscillator, schedules it's termination, and fiddles with the node's frequency
    parameter during playback. */
    onePoleProcessor() {
      const { actx } = this;

      const beginning = actx.currentTime;
      const middle = actx.currentTime + 4;
      const end = actx.currentTime + 8;

      this.filterNode = new AudioWorkletNode(actx, 'one-pole-processor');
      this.oscillator = actx.createOscillator();
      this.oscillator.connect(this.filterNode).connect(actx.destination);
      this.oscillator.start();

      const frequencyParam = this.filterNode.parameters.get('frequency');
      frequencyParam
          .setValueAtTime(0.01, beginning)
          .exponentialRampToValueAtTime(actx.sampleRate * 0.5, middle)
          .exponentialRampToValueAtTime(0.01, end);

      // This implementation of osc.onended is glitchy because the beginning, middle, and end must be managed in state.
      // this.oscillator.onended = () => {
      //     this.setState({ isPlaying: false })
      // }
    }
    bitCrusherProcessor() {
      const { actx } = this;
      this.oscillator = actx.createOscillator();
      this.bitCrusherNode = new AudioWorkletNode(actx, 'bit-crusher-processor');
      const paramBitDepth = this.bitCrusherNode.parameters.get('bitDepth');
      const paramReduction = this.bitCrusherNode.parameters.get('frequencyReduction');
      this.oscillator.type = 'sawtooth';
      this.oscillator.frequency.value = 5000;
      paramBitDepth.setValueAtTime(1, 0);
      this.oscillator.connect(this.bitCrusherNode).connect(actx.destination);
      // |frequencyReduction| parameters will be automated and changing over
      // time. Thus its parameter array will have 128 values.
      paramReduction.setValueAtTime(0.01, 0);
      paramReduction.linearRampToValueAtTime(0.1, 4);
      paramReduction.exponentialRampToValueAtTime(0.01, 8);
      // Play the tone for 8 seconds.
      this.oscillator.start();
      this.oscillator.stop(8);
    }
  /* The function below loads modules when selected from the dropdown menu. */
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
      case 'Bitcrusher':
        this.loadModule('bit-crusher-processor')
        break;
    }
  }
  /* The function below handles the starting and stopping of the currently loaded module.  */
  handleClick() {
    const { state } = this;
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
        case 'Bitcrusher':
        if(state.isPlaying) {
          console.log(`stopping ${state.selected}`)
          this.bitCrusherNode.port.postMessage(false);          
        } else {
          console.log(`playing ${state.selected}`)
          this.bitCrusherProcessor();
          this.bitCrusherNode.port.postMessage(true);          
        }
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