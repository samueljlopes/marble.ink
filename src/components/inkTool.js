import React from 'react'; 
import paper from 'paper';
import * as ToolComponents from './core'

const components = {
  0: 'InkPhysics',
  1: 'InkTineLines',
  2: 'InkCurvedTineLines',
  3: 'InkCircularTineLines'
};
const animationTime = 2000

class InkTool extends React.Component {

  //Abstraction of animation (and perhaps lighting) functionality is now possible.
  //This method can be called from any tool.
  animate(startObject, endObject) {
    //This assumes that both objects are path objects. 
    let startState = startObject.clone({ insert: false })
    endObject.visible = false;

    var tween = startObject.tween({
      duration: animationTime,
      easing: 'easeOutCubic'
    });
    tween.onUpdate = function(event) {
      startObject.interpolate(startState, endObject, event.factor)
    };
    tween.then(function() 
    {
      endObject.remove();
    })
  }

  render() {
    const SelectedTool = ToolComponents[components[this.props.type]];
    console.log(this.props.allItems)

    let specificProps = {}
    if (this.props.type == 0) //Special case for when user originally adds ink blots
    {
      specificProps.expansionRate = 1;
    }
    else
    {
      specificProps.alpha = 80
      specificProps.lambda = 8
    }

    return(
      <div>
        <SelectedTool animate={this.animate.bind(this)} 
        {...specificProps} {...this.props}></SelectedTool>
      </div>
    )
  }
};
export default InkTool
//This is now a container component as opposed to a HOC. The problem with HOCs is that they cannot be applied
//at runtime due to React's render tree algorithm. A container component can, however, so I'll use this to store some
//more common code that is applied uniformily across tool components.

//See this explanation from Stack Overflow:
/* Higher-Order Components (HOC) and Container Components are different. They have different use cases and solve similar, but different problems.
HOC are like mixins. They are used to compose functionality that the decorated component is aware of. This is opposed to Container Components that wrap children and allow the children to be dumb (or not aware of the Container's decorated functionality).
It is true when transferring props, that Containers can add functionality to their children. But, this is usually in the form of props being passed down to the children. In Containers, this is also awkward because of the limitation that you cannot simply add props to an already created Element:
So, if you wanted to add a new prop to a child from this.props.children, you would have to use cloneElement. This is not as efficient because it means you have to re-create the elements.
Also, HOC is simply a way (factory) for creating Components. So, this can happen outside the render. */