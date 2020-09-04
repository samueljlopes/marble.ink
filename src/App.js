import React, { Component } from 'react';
import './App.css';
import InkCanvas from './components/ink.js'
import { Radio } from "antd";

class App extends Component {
  state = { optionsDrawerValue: 0 }

  onChangeOptionsDrawerValue = (val) => {
    this.setState({ optionsDrawerValue: val.target.value })
  }

  render() {
    console.log(this.state.optionsDrawerValue);
    return (
      <div>
        <OptionsDrawer value={this.state.optionsDrawerValue} onChange={this.onChangeOptionsDrawerValue}></OptionsDrawer>
        <div>
          <InkCanvas expansionRate="1"></InkCanvas>
        </div>
      </div>
    );
  }
}

class OptionsDrawer extends React.Component {
  render() {
    const { value, onChange } = this.props;
    const radioStyle = {
      display: "block",
      height: "30px",
      lineHeight: "30px"
    };

    return (
      <Radio.Group onChange={onChange} value={value}>
        <Radio style={radioStyle} value={1}>
          Tine Lines
        </Radio>
        <Radio style={radioStyle} value={2}>
          No Tine Lines
        </Radio>
      </Radio.Group>
    );
  }
}


export default App;
