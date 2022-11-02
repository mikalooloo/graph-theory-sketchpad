import React from 'react';
import { ThemeContext } from '../aesthetic/theme';

/*
 * Sketchpad where vertices and edges can be fiddled with
 */
export default function Sketchpad() {
    const theme = React.useContext(ThemeContext).theme;

    return (
        <div>
            {theme}
        </div>
    )
}