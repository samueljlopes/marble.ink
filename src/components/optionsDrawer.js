import React, { Component } from 'react';
import './inkWindow.css';
import { Radio } from "antd";
import 'antd/dist/antd.css';
import paper from 'paper';

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
                <Radio.Button style={radioStyle} value={0}>
                    No Tine Lines
          </Radio.Button>
                <Radio.Button style={radioStyle} value={1}>
                    Straight Tine Lines
          </Radio.Button>
                <Radio.Button style={radioStyle} value={2}>
                    Curved Tine Lines
          </Radio.Button>
                <Radio.Button style={radioStyle} value={3}>
                    Circular Tine Lines
          </Radio.Button>
            </Radio.Group>
        );
    }
}
export default OptionsDrawer