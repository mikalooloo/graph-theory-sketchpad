import '../aesthetic/sketchpadLayout.css';

import React from 'react';
import { ThemeContext } from '../aesthetic/theme';

import Sketchpad from './sketchpad';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

import { GithubPicker } from 'react-color';

/*
 * Organizes the various components of the sketchpad layout
 */
export default function SketchpadLayout() {
    const theme = React.useContext(ThemeContext).theme;

    const [mode, setMode] = React.useState("vertex");
    const [color, setColor] = React.useState("#FFF");

    const [vertexCount, setVertexCount] = React.useState(0);
    const [edgeCount, setEdgeCount] = React.useState(0);

    const userSelectColor = (selectedColor) => {
        setColor(selectedColor.hex);
    }

    React.useEffect(() => {
        console.log(mode);
    }, [mode]);

    const onKeyDown = (e) => {
        switch (e.key) {
            case 'v':
                setMode("vertex");
                break;
            case 'e':
                setMode("edge");
                break;
            case 'c':
                setMode("color");
                break;
            case 'w':
                setColor('#FFFFFF');
                break;
            case 'b':
                setColor('#000000');
                break;
            case 'r':
                setColor('#B80000');
                break;
            case 'o':
                setColor('#DB3E00');
                break;
            case 'y':
                setColor('#FCCB00');
                break;
            case 'g':
                setColor('#008B02');
                break;
            case 'l':
                setColor('#1273DE');
                break;
            case 'p':
                setColor('#5300EB');
                break;
            default:
                break;
        }
    };

    return (
        <div tabIndex={0} onKeyDown={onKeyDown}>
            <Container className={theme}>
                <Row>
                    <Col><div style={{ "fontSize": "35px", "padding": "1%" }}>Graph Theorist's Sketchpad</div></Col>
                </Row>
                <Row>
                    <Col>
                        <Stack gap={3} style={{ "padding": "10%" }} vertical="true">
                            <Button id="vertex" onClick={(e) => setMode(e.target.id)} variant={theme === "dark" ? "light" : "dark"} active={mode === "vertex"}>Vertex Mode (v)</Button>
                            <Button id="edge" onClick={(e) => setMode(e.target.id)} variant={theme === "dark" ? "light" : "dark"} active={mode === "edge"}>Edge Mode (e)</Button>
                            <Button id="color" onClick={(e) => setMode(e.target.id)} variant={theme === "dark" ? "light" : "dark"} active={mode === "color"}>Recolor Mode (c)</Button>
                            <div style={{ "margin": "auto" }}>
                                <GithubPicker onChangeComplete={userSelectColor} width={'240px'} triangle={'hide'}
                                    color={color}
                                    colors={['#FFFFFF', '#B80000', '#DB3E00', '#FCCB00', '#008B02', '#006B76', '#1273DE', '#004DCF', '#5300EB', '#000000', '#EB9694', '#FAD0C3', '#FEF3BD', '#C1E1C5', '#BEDADC', '#C4DEF6', '#BED3F3', '#D4C4FB']} />
                            </div>
                        </Stack>
                    </Col>
                    <Col><Sketchpad mode={mode} color={color} setVertexCount={setVertexCount} setEdgeCount={setEdgeCount} height={window.innerHeight / 1.5} width={window.innerWidth / 2} /></Col>
                    <Col>
                        <Stack vertical="true">
                            <h3>Stats</h3>
                            <p style={{ "marginBottom": "1%" }}>Vertex Count: {vertexCount}</p>
                            <p>Edge Count: {edgeCount}</p>
                        </Stack>
                    </Col>
                </Row>
                <Row>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    )
}