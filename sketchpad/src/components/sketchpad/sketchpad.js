import '../aesthetic/sketchpad.css';

import React from 'react';
import { ThemeContext } from '../aesthetic/theme';

import { Stage, Layer, Group, Circle, Rect, Line } from 'react-konva';

/*
 * Sketchpad where vertices and edges can be fiddled with
 */
export default function Sketchpad({ mode, height, width }) {
    // Theme and background
    const theme = React.useContext(ThemeContext).theme;

    const Background = ({ color }) => {
        return <Rect
            x={0}
            y={0}
            height={height}
            width={width}
            fill={color}
            onMouseDown={onVertexCreate}
        />
    }

    // Vertices
    const [vertices, setVertices] = React.useState([]);
    const [idCounter, setIDCounter] = React.useState(0);

    const onVertexDragStart = (e) => {
        const id = e.target.id();
        setVertices(
            vertices.map((vertex) => {
                return {
                    ...vertex,
                    isDragging: vertex.id === id,
                };
            })
        );
    };

    const onVertexDragEnd = (e) => {
        setVertices(
            vertices.map((vertex) => {
                return {
                    ...vertex,
                    isDragging: false,
                };
            })
        );
    };

    const onVertexCreate = (e) => {
        var pos = e.target.getStage().getPointerPosition();
        setVertices(
            [...vertices, { id: idCounter.toString(), x: pos.x, y: pos.y, radius: 50, color: "red", isDragging: false }]
        );

        setIDCounter(idCounter + 1);
    }

    // Edges
    const [edges, setEdges] = React.useState([]);
    const [firstPos, setFirstPos] = React.useState({ x: -1, y: -1 });

    const onEdgeCreate = (e) => {
        // if negative one, then set this as the beginning of the line
        if (firstPos.x == -1) {
            var pos = e.target.getStage().getPointerPosition();
            setFirstPos(pos);
        }
        else {

            setFirstPos({ x: -1, y: -1 });
        }
    }

    return (
        <div className={theme + "-sketchpad"} style={{ "width": width, "height": height }}>
            <Stage
                height={height}
                width={width}
            >
                <Layer>
                    <Background color={theme === "dark" ? "rgb(100, 100, 100)" : "white"} />
                </Layer>
                <Layer>
                    {edges.length != 0 ? edges.map((edge) => (
                        <Line
                            points={edge.points}
                            stroke={edge.color}
                            strokeWidth={edge.width}
                        />
                    )) : <Group />}

                    {vertices.length != 0 ? vertices.map((vertex) => (
                        <Circle
                            key={vertex.id}
                            id={vertex.id}
                            x={vertex.x}
                            y={vertex.y}
                            radius={vertex.radius}
                            fill={vertex.color}
                            draggable
                            onDragStart={onVertexDragStart}
                            onDragEnd={onVertexDragEnd}
                            scaleX={vertex.isDragging ? 1.2 : 1}
                            scaleY={vertex.isDragging ? 1.2 : 1}
                        />
                    )) : <Group />}
                </Layer>
            </Stage>
        </div>
    )
}