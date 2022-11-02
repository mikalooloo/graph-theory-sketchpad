import React from 'react';
import { toPng } from 'html-to-image';
import format from 'date-fns/format';
import Button from 'react-bootstrap/Button';

/*
 * When clicked, will download a PNG of a component
 * props:
 *   downloadRef - what component to download
 */
export default function DownloadButton(props) {
    const getFileName = (fileType) => `${format(new Date(), "'GraphTheorySketchpad-'HH-mm-ss")}.${fileType}`;

    const downloadPng = React.useCallback(() => {
        if (props.downloadRef.current == null) {
            return;
        }

        toPng(props.downloadRef.current, { cacheBust: true })
        .then((dataURL) => {
            const link = document.createElement('a');
            link.download = `${getFileName('png')}`;
            link.href = dataURL;
            link.click();
        })
        .catch((err) => {
            console.log(err);
        });
    }, [props.downloadRef]);

    return (
        <div name="downloadButton">
            <Button onClick={downloadPng}>Download PNG</Button>
        </div>
    )
}