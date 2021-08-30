import paper from 'paper'
import React from 'react'

import { Modal, Button } from 'antd';

class InkExport extends React.Component {
    state = {
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
        this.setState({currentCanvasImageURL: dataString})
    }

    render() {
        return (
            <div>
                <Modal title="Export Your Artwork" visible={true} 
                onOk={this.handleOk} onCancel={this.props.onCancel}>
                <img src={this.state.currentCanvasImageURL} />
                </Modal>
            </div>
        );
    }
}
export default InkExport