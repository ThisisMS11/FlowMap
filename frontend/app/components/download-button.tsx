import React from 'react';
import {
    Panel,
    useReactFlow,
    getNodesBounds,
    getViewportForBounds,
} from '@xyflow/react';
import { toPng } from 'html-to-image';

function downloadImage(dataUrl : string) {
    const a = document.createElement('a');

    a.setAttribute('download', 'reactflow.png');
    a.setAttribute('href', dataUrl);
    a.click();
}

const imageWidth = 1048;
const imageHeight = 768;

function DownloadButton() {
    const { getNodes } = useReactFlow();
    const onClick = () => {
        const nodesBounds = getNodesBounds(getNodes());
        const viewport = getViewportForBounds(
            nodesBounds,
            imageWidth,
            imageHeight,
            0.5,
            2,
        );

        toPng(document.querySelector('.react-flow__viewport'), {
            backgroundColor: '#fffff',
            width: imageWidth,
            height: imageHeight,
            style: {
                width: imageWidth,
                height: imageHeight,
                transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
            },
        }).then(downloadImage);
    };

    return (
        <Panel position="bottom-right">
            <button className="download-btn" onClick={onClick}>
                Download Image
            </button>
        </Panel>
    );
}

export default DownloadButton;