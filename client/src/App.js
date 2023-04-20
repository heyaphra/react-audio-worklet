import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Dropdown, Space, Button, message } from "antd";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import { Bypasser, onePoleFilter, noiseGenerator, bitCrusher } from "./Demos";

class App extends Component {
  menuItems = [
    {
      key: 0,
      processor: { label: "Bypass Filter", name: "bypass-processor", cb: () => Bypasser },
      label: <a onClick={(e) => e.preventDefault()}>Bypass Filter</a>,
    },
    {
      key: 1,
      label: <a onClick={(e) => e.preventDefault()}>One Pole Filter</a>,
      processor: { label: "Noise", name: "noise-generator", cb: noiseGenerator },
    },
    {
      key: 2,
      label: <a onClick={(e) => e.preventDefault()}>Noise</a>,
      processor: { label: "One Pole Filter", name: "one-pole-processor", cb: onePoleFilter },
    },
    {
      key: 3,
      label: <a onClick={(e) => e.preventDefault()}>Bitcrusher</a>,
      processor: { label: "Bitcrusher", name: "bit-crusher-processor", cb: bitCrusher },
    },
  ];
  constructor() {
    super();
    this.state = {
      isPlaying: false /* Is audio currently playing? (Boolean) */,
      processor: null /* Object containing processor name, callback, and menu item name */,
      node: null /* Current AudioWorkletNode (AudioWorkletNode)*/,
      moduleLoaded: false /* Has the selected AudioWorkletProcessor finished loading? (Boolean)*/,
      status: null /* Load status message (String) */,
    };
  }
  /* loadModule: given a module's name, adds it to the audioWorklet */
  async loadModule() {
    const { state, actx } = this;
    try {
      await actx.audioWorklet.addModule(`worklet/${state.processor.module}.js`);
      this.setState({ moduleLoaded: true, status: null });
      console.log(`loaded module ${state.processor.module}`);
    } catch (e) {
      this.setState({ moduleLoaded: false });
      console.log(`Failed to load module ${state.processor.module}`);
    }
  }
  /* handleSelect: loads modules when selected from dropdown menu.
     It also handles instantiating an AudioContext since it's likely the first user gesture.*/
  handleSelect(name, processor) {
    if (this.state.isPlaying) return;
    this.setState({ processor: { name, module: processor.name, cb: processor.cb }, moduleLoaded: false, status: "Loading module, please wait..." }, () => {
      if (!this.actx) {
        try {
          console.log("New context instantiated");
          this.actx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
          console.log(`Sorry, but your browser doesn't support the Web Audio API!`, e);
        }
      }
      this.loadModule();
    });
  }
  /* toggleNode: starts and stops audio by sending a boolean via the AudioWorkletProcessor's message port.*/
  toggleNode() {
    const { state } = this;
    if (state.isPlaying) {
      console.log(`stopping ${state.processor.module}`);
      state.node.port.postMessage(false);
    } else {
      console.log(`playing ${state.processor.module}`);
      const node = state.processor.cb(this);
      this.setState({ node }, () => {
        node.port.postMessage(true);
      });
    }
    this.setState({ isPlaying: !state.isPlaying });
  }
  render() {
    const { state, menuItems } = this;

    const onClick = ({ key }) => {
      const { processor } = this.menuItems[key];

      this.handleSelect(processor.label, processor);
      // const
    };
    /* Menu is an overlay for the Ant Design dropdown component, passed in via props. */
    // const menu = (

    // <Dropdown
    //   // onClick={(e) => this.handleSelect(e.item.props.name, e.item.props.processor)}
    //   // selectedKeys={[this.state.current]}
    //   menu={menuItems}
    // >
    //   <a onClick={(e) => e.preventDefault()}>
    //     <Space>
    //       Hover me
    //       <DownOutlined />
    //     </Space>
    //   </a>
    //   {/* <Menu.Item name="Bypass Filter" processor={{name: 'bypass-processor', cb: Bypasser}}>
    //     Bypass Filter
    //   </Menu.Item>
    //   <Menu.Item name="One Pole Filter" processor={{name: 'one-pole-processor', cb: onePoleFilter}}>
    //     One Pole Filter
    //   </Menu.Item>
    //   <Menu.Item name="Noise"  processor={{name: 'noise-generator', cb: noiseGenerator}}>
    //     Noise
    //   </Menu.Item>
    //   <Menu.Item name="Bitcrusher" processor={{name: 'bit-crusher-processor', cb: bitCrusher}}>
    //     Bitcrusher
    //   </Menu.Item>    */}
    // </Dropdown>
    // );
    return (
      <>
        <img decoding="async" loading="lazy" width="149" height="149" src="https://github.blog/wp-content/uploads/2008/12/forkme_left_orange_ff7600.png?resize=149%2C149" className="attachment-full size-full" alt="Fork me on GitHub" data-recalc-dims="1" />
        <div className="App">
          <a href="https://github.com/heyaphra/react-audio-worklet-example"></a>
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <span>React + AudioWorklet = ❤</span>
            <div>
              {/* <Menu overlay={items} size="small">
                <a className="ant-dropdown-link" href="#">
                  {state.processor ? state.processor.name : "Select a module"} <DownOutlined type="down" />
                </a>
              </Menu> */}
              <Dropdown
                menu={{
                  items: menuItems,
                  onClick,
                }}
              >
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    {state.processor ? state.processor.name : "Select a module"}
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>

              <Button ghost disabled={!state.moduleLoaded} onClick={() => this.toggleNode()} style={{ marginLeft: "1%" }}>
                {state.isPlaying ? "Stop" : "Start"}
              </Button>
              <br />
              <small>{state.status}</small>
            </div>
          </header>
        </div>
      </>
    );
  }
}

export default App;
