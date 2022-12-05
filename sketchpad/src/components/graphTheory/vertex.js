import '../aesthetic/vertex.css';
import React from 'react';
import { Circle } from 'react-konva';

export default function Vertex(props) {

    return (
        <Circle
            x={0}
            y={0}
            radius={50}
            fill={props.color}
        />
    )
}