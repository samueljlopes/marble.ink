import React from 'react'; 
import paper, {Group} from 'paper';
import * as ToolComponents from './core'

const components = {
  0: 'InkPhysics',
  1: 'InkTineLines'
};

class InkTool extends React.Component {
  shouldComponentUpdate(){
    return false;
}

  render() {
    const SelectedTool = ToolComponents[components[this.props.type]];
    console.log(this.props.allItems)

    return(
      <div>
        <SelectedTool {...this.props}></SelectedTool>
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