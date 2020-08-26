import React, { Component } from 'react';
import paper from 'paper'
import './App.css';

class App extends Component {
  componentDidMount() 
  {
    paper.setup('canvas') //This sets up the canvas which will then be drawn on
    require("./core/ink.js")
  } 

  render() {
    return (
      <div>
        <canvas id="canvas"></canvas>
      </div>
    ); //The canvas is returned as a DOM element
  }
}

export default App;
