import React from 'react';
import { type EdgeProps, getBezierPath } from '@xyflow/react';

const AnimatedDashedEdge: React.FC<EdgeProps> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
    });

    return (
        <g>
            <path
                id={id}
                style={{
                    ...style,
                    strokeDasharray: '5, 5',
                    animation: 'dashAnimation 1s linear infinite',
                }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
            <style>
                {`
                    @keyframes dashAnimation {
                        to {
                            stroke-dashoffset: -10;
                        }
                    }
                `}
            </style>
        </g>
    );
};

export default AnimatedDashedEdge;
