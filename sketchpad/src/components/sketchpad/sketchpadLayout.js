import '../aesthetic/sketchpadLayout.css';
import React from 'react';
import { ThemeContext } from '../aesthetic/theme';
import Sketchpad from './sketchpad';

/*
 * Organizes the various components of the sketchpad layout
 */
export default function SketchpadLayout() {
    const theme = React.useContext(ThemeContext).theme;

    return (
        <div className={theme}>
            <Sketchpad />
        </div>
    )
}