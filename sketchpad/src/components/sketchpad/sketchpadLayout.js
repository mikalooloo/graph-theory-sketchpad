import '../aesthetic/sketchpadLayout.css';

import React from 'react';
import { ThemeContext } from '../aesthetic/theme';

import Sketchpad from './sketchpad';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';

/*
 * Organizes the various components of the sketchpad layout
 */
export default function SketchpadLayout() {
    const theme = React.useContext(ThemeContext).theme;

    const [mode, setMode] = React.useState("vertex");

    return (
        <Container className={theme}>
            <Row>
                <Col><div style={{ "fontSize": "35px", "padding": "1%" }}>Graph Theorist's Sketchpad</div></Col>
            </Row>
            <Row>
                <Col>
                    <Stack gap={3} style={{ "padding": "10%" }} vertical="true">
                        <Button id="vertex" onChange={(e) => setMode(e.target.id)} variant={theme === "dark" ? "light" : "dark"}>Vertex Mode (v)</Button>
                        <Button id="edge" onChange={(e) => setMode(e.target.id)} variant={theme === "dark" ? "light" : "dark"}>Edge Mode (e)</Button>
                    </Stack>
                </Col>
                <Col><Sketchpad mode={mode} height={window.innerHeight / 1.5} width={window.innerWidth / 2} /></Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
            </Row>
        </Container>
    )
}