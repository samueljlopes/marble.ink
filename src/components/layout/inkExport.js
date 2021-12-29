import paper from 'paper'
import React from 'react'

import { Modal, Button } from 'antd';
import './styles/inkExport.css'
import { DownloadOutlined } from '@ant-design/icons';

class InkExport extends React.Component {
    state = {
        currentCanvasImage: paper.Raster,
        currentCanvasImageURL : "",
        numberOfBlots: 0
    }

    componentDidMount() 
    {
        this.rasteriseActiveLayer();
    }

    rasteriseActiveLayer() 
    {
        for (let i = 0; i < paper.project.activeLayer.children.length; i++)
        {
            if (paper.project.activeLayer.children[i].isTool == true)
            {
                paper.project.activeLayer.children[i].visible = false;
            }
        }
        var tempImg = paper.project.activeLayer.rasterize();
        for (let i = 0; i < paper.project.activeLayer.children.length; i++)
        {
            if (paper.project.activeLayer.children[i].isTool == true)
            {
                paper.project.activeLayer.children[i].visible = true;
            }
        }
        var dataString = tempImg.toDataURL();

        this.setState({currentCanvasImage: tempImg})
        this.setState({currentCanvasImageURL: dataString})
    }

    downloadImage() 
    {
        var element = document.createElement("a");
        element.href = this.state.currentCanvasImageURL;
        element.download = "image.jpg";
        element.click();
    }

    render() {
        const blotNumber = paper.project.activeLayer.children.length; //Potential edge case with tool lines
        return (
            <div>
                <Modal title="Export Your Artwork" visible={true} 
                onCancel={this.props.onCancel}
                footer={[
                    <Button type="primary" icon={<DownloadOutlined />} onClick={this.downloadImage.bind(this)}>
                        Download Canvas
                    </Button>
                ]}
                >
                    {blotNumber >= 1 &&
                        <img src={this.state.currentCanvasImageURL} id='canvasImage'/>
                    }
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