//This is a higher-order component that includes all the shared code between the tools components. 
//If React wants me to use composition, then by all means. All hail composition. 
import React, { Component } from 'react';
import paper, { Path, Point } from 'paper'

function inkTool(ToolComponent) {
    // ...and returns another component...
    return class extends React.Component {
        constructor(props) {
            super(props);
        }
        
        componentDidUpdate(prevProps) { //Logging to figure out how often React notices things change on the
            //paper.js end
            console.log('Current props: ', this.props);
            console.log('Previous props: ', prevProps);
        }

        componentWillUnmount() { //Removes mouse listeners whilst preserving view and project.
            //This sort of cleanup needs to be done regardless of tool, so it goes in the HOC
            paper.view.off('mousedown'); 
            paper.view.off('mouseup');
            paper.view.off('mousedrag');
        }

        render() {
            // ... and renders the wrapped component with the fresh data!
            // Notice that we pass through any additional props
            return <ToolComponent data={this.state.data} {...this.props} />;
          }
    };
}