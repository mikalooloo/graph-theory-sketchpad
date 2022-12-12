import '../aesthetic/sketchpad.css';

import React from 'react';
import { ThemeContext } from '../aesthetic/theme';

import { Stage, Layer, Group, Circle, Rect, Line } from 'react-konva';

/*
 * Sketchpad where vertices and edges can be fiddled with
 */
export default function Sketchpad({ mode, color, setVertexCount, setEdgeCount, height, width }) {
    // Theme and background
    const theme = React.useContext(ThemeContext).theme;

    const Background = ({ bgColor }) => {
        // height and width are minus six because for some reason it gets drawn over the border instead of underneath if not done
        return <Rect
            x={0}
            y={0}
            height={height - 6}
            width={width - 6}
            fill={bgColor}
            onMouseDown={onCanvasClick}
        />
    }

    const [bgColor, setBGColor] = React.useState(theme === "dark" ? "rgb(100, 100, 100)" : "white");

    const onCanvasClick = (e) => {
        switch (mode) {
            case "vertex":
                if (e.evt.button === 0) {
                    onVertexCreate(e);
                }
                break;
            case "color":
                setBGColor(color);
                break;
            default:
                break;
        }
    }

    const onVertexClick = (e) => {
        switch (mode) {
            case "vertex":
                if (e.evt.button === 1) {
                    onVertexDelete(e);
                }
                break;
            case "edge":
                if (e.evt.button === 0) {
                    onEdgeCreate(e);
                }
                break;
            case "color":
                if (e.evt.button === 0) {
                    onVertexRecolor(e, false);
                }
                else if (e.evt.button === 1) {
                    onVertexRecolor(e, true);
                }
                break;
            default:
                break;
        }
    }

    const onEdgeClick = (e) => {
        switch (mode) {
            case "edge":
                if (e.evt.button === 1) {
                    onEdgeDelete(e);
                }
                break;
            case "color":
                if (e.evt.button === 0) {
                    onEdgeRecolor(e, false);
                }
                else if (e.evt.button === 1) {
                    onEdgeRecolor(e, true);
                }
                break;
            default:
                break;
        }
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

    const onVertexDragMove = (e) => {
        const vertexMoving = vertices.filter((vertex) => {
            return vertex.isDragging === true;
        })[0];

        if (vertexMoving !== undefined) {
            setEdges(
                edges.map((edge) => {
                    if (vertexMoving.adjacencies.includes(edge.id)) {
                        // if loop (edge starts ane ends at itself)
                        if (edge.adjacencies[0] === edge.adjacencies[1]) {
                            return {
                                ...edge,
                                points: [e.target.position().x + edge.offset[0], e.target.position().y + edge.offset[1],
                                e.target.position().x + edge.offset[4], e.target.position().y + edge.offset[5],
                                e.target.position().x + edge.offset[2], e.target.position().y + edge.offset[3]]
                            };
                        }
                        // else if not a loop, which end are we moving?
                        else if (vertexMoving.id === edge.adjacencies[0]) {
                            return {
                                ...edge,
                                points: [e.target.position().x + edge.offset[0], e.target.position().y + edge.offset[1], edge.points[2], edge.points[3]]
                            };
                        }
                        else {
                            return {
                                ...edge,
                                points: [edge.points[0], edge.points[1], e.target.position().x + edge.offset[2], e.target.position().y + edge.offset[3]]
                            };
                        }
                    }
                    else {
                        return { ...edge };
                    }
                })
            );
        }
    }

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
            [...vertices, {
                id: idCounter.toString(),
                x: pos.x,
                y: pos.y,
                radius: 45,
                color: color,
                textColor: 'black',
                isDragging: false,
                adjacencies: [],
            }]
        );

        setIDCounter(idCounter + 1);
    }

    const onVertexDelete = (e) => {
        // get the vertex you're wanting to delete
        const vertexToDelete = vertices.filter((vertex) => {
            return vertex.id === e.target.id();
        })[0];

        // remove edges connected to vertex we're about to delete
        setEdges(
            edges.filter((edge) => {
                return !vertexToDelete.adjacencies.includes(edge.id);
            })
        );
        // then delete vertex
        setVertices(
            vertices.filter((vertex) => {
                return vertex.id !== e.target.id();
            })
        );
    }

    const onVertexRecolor = (e, reset) => {
        setVertices(
            vertices.map((vertex) => {
                if (vertex.id === e.target.id()) {
                    if (e.target.attrs.name === "text") {
                        return { ...vertex, textColor: reset ? '#000000' : color };
                    }
                    else {
                        return { ...vertex, color: reset ? '#FFFFFF' : color };
                    }
                }
                else {
                    return { ...vertex };
                }
            })
        );
    }

    // update vertex count
    React.useEffect(() => {
        setVertexCount(vertices.length);
    }, [setVertexCount, vertices.length]);

    // Edges
    const [edges, setEdges] = React.useState([]);
    const [firstPos, setFirstPos] = React.useState({ x: -1, y: -1, offsetx: -1, offsety: -1, id: -1 });

    const onEdgeCreate = (e) => {
        var currentPos = e.target.getStage().getPointerPosition();

        // if negative one, then set this as the beginning of the line
        if (firstPos.x === -1) {
            setFirstPos({ x: currentPos.x, y: currentPos.y, offsetx: currentPos.x - e.target.position().x, offsety: currentPos.y - e.target.position().y, id: e.target.id() });
            setVertices(
                vertices.map((vertex) => {
                    if (vertex.id === e.target.id()) {
                        return {
                            ...vertex,
                            adjacencies: [...vertex.adjacencies, idCounter.toString()],
                        }
                    }
                    else {
                        return { ...vertex };
                    }
                })
            );
        }
        // otherwise, create a new edge and add it
        else {
            var sameVertex = firstPos.id === e.target.id();
            var sameVertexPoints = null;
            if (sameVertex) {
                sameVertexPoints = createEdgeLoop(currentPos, e.target.position());
            }
            setEdges(
                [...edges, {
                    id: idCounter.toString(),
                    points: sameVertex ? sameVertexPoints : [firstPos.x, firstPos.y, currentPos.x, currentPos.y],
                    tension: sameVertex ? 1 : 0,
                    color: color,
                    width: 10,
                    adjacencies: [firstPos.id, e.target.id()],
                    offset: sameVertex ?
                        [firstPos.offsetx, firstPos.offsety, currentPos.x - e.target.position().x, currentPos.y - e.target.position().y,
                        sameVertexPoints[2] - e.target.position().x, sameVertexPoints[3] - e.target.position().y] :
                        [firstPos.offsetx, firstPos.offsety, currentPos.x - e.target.position().x, currentPos.y - e.target.position().y],
                }]
            );
            setVertices(
                vertices.map((vertex) => {
                    if (vertex.id === e.target.id()) {
                        return {
                            ...vertex,
                            adjacencies: [...vertex.adjacencies, idCounter.toString()],
                        }
                    }
                    else {
                        return { ...vertex };
                    }
                })
            );

            setIDCounter(idCounter + 1);
            // reset pos so we can create a new edge in future
            setFirstPos({ x: -1, y: -1, offsetx: -1, offsety: -1, id: -1 });
        }
    }

    const onEdgeDelete = (e) => {
        const edgeToDelete = edges.filter((edge) => {
            return edge.id === e.target.id();
        })[0];

        setVertices(
            vertices.map((vertex) => {
                return {
                    ...vertex,
                    adjacencies: vertex.adjacencies.filter(edgeID => edgeID !== edgeToDelete.id)
                };
            })
        );
        setEdges(
            edges.filter((edge) => {
                return edgeToDelete.id !== edge.id;
            })
        );
    }

    const createEdgeLoop = (currentPos, centerPos) => {
        var xDif = currentPos.x - centerPos.x;
        var yDif = currentPos.y - centerPos.y;
        var offsetX = xDif > 30 ? xDif : (xDif > 0 ? 5 : xDif - 10);
        var offsetY = yDif > 30 ? yDif : (yDif > 0 ? 0 : yDif);

        return [firstPos.x, firstPos.y, (firstPos.x + currentPos.x) / 2 + offsetX, (firstPos.y + currentPos.y) / 2 + offsetY, currentPos.x, currentPos.y];
    }

    const onEdgeRecolor = (e, reset) => {
        setEdges(
            edges.map((edge) => {
                if (edge.id === e.target.id()) {
                    return { ...edge, color: reset ? '#FFFFFF' : color };
                }
                else {
                    return { ...edge };
                }
            })
        );
    }

    // update edge count
    React.useEffect(() => {
        setEdgeCount(edges.length);
    }, [setEdgeCount, edges.length]);


    return (
        <div className={theme + "-sketchpad"} style={{ "width": width, "height": height }}>
            <Stage
                height={height}
                width={width}
            >
                <Layer>
                    <Background color={bgColor} />
                </Layer>
                <Layer>
                    {edges.length !== 0 ? edges.map((edge) => (
                        <Line
                            key={edge.id}
                            id={edge.id}
                            points={edge.points}
                            stroke={edge.color}
                            strokeWidth={edge.width}
                            tension={edge.tension}
                            onMouseDown={onEdgeClick}
                            perfectDrawEnabled={false}
                        />
                    )) : <Group />}

                    {vertices.length !== 0 ? vertices.map((vertex) => (
                        <Circle
                            key={vertex.id}
                            id={vertex.id}
                            name={"vertex"}
                            x={vertex.x}
                            y={vertex.y}
                            radius={vertex.radius}
                            fill={vertex.color}
                            scaleX={vertex.isDragging ? 1.2 : 1}
                            scaleY={vertex.isDragging ? 1.2 : 1}
                            perfectDrawEnabled={false}
                            draggable
                            onDragStart={onVertexDragStart}
                            onDragEnd={onVertexDragEnd}
                            onDragMove={onVertexDragMove}
                            onMouseDown={onVertexClick}
                        />
                    )) : <Group />}
                </Layer>
            </Stage>
        </div>
    )
}