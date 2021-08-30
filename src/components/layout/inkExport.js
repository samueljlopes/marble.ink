import paper from 'paper'
import React from 'react'

import { Modal, Button } from 'antd';
import './styles/inkExport.css'

class InkExport extends React.Component {
    state = {
        currentCanvasImage: paper.Raster,
        currentCanvasImageURL : ""
    }

    componentDidMount() 
    {
        this.rasteriseActiveLayer();
    }

    rasteriseActiveLayer() 
    {
        var tempImg = paper.project.activeLayer.rasterize();
        var dataString = tempImg.toDataURL();

        this.setState({currentCanvasImage: tempImg})
        this.setState({currentCanvasImageURL: dataString})
    }

    render() {
        return (
            <div>
                <Modal title="Export Your Artwork" visible={true} 
                onOk={this.handleOk} onCancel={this.props.onCancel}>
                    <img src={this.state.currentCanvasImageURL} id='canvasImage'/>
                    <p>You can share your creation on a number of social media platforms, including Instagram.</p>
                </Modal>
            </div>
        );
    }

    componentWillUnmount() 
    {
        this.state.currentCanvasImage.remove();
    }
}
export default InkExport