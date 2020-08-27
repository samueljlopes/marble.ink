import React, { Component } from 'react';
import paper from 'paper'
import './App.css';
import InkCanvas from './core/ink'

class App extends Component {
  componentDidMount() 
  {
    paper.setup('canvas')
    //This sets up the canvas which will then be drawn on
  } 

  render() {
    return (
      <div>
        <canvas id="canvas" resize="true"></canvas>
        <InkCanvas/>
      </div>
    ); //The canvas is returned as a DOM element
  }
}

export default App;
