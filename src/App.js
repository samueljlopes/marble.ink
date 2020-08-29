import React, { Component } from 'react';
import './App.css';
import InkCanvas from './components/ink.js'

class App extends Component {
  componentDidMount() 
  {
  } 

  render() {
    return (
      <div>
        <InkCanvas expansionRate="1"></InkCanvas>
      </div>
    ); //The canvas is returned as a DOM element
  }
}

export default App;
