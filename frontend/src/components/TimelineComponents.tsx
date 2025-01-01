import React from 'react';

export const TimelineEdge: React.FC<any> = ({ style }) => (
    <div
        style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '2px',
            backgroundColor: '#666',
            zIndex: 1,
        }}
    >
        <div
            style={{
                position: 'absolute',
                right: '-10px',
                top: '-4px',
                width: '0',
                height: '0',
                borderTop: '5px solid transparent',
                borderBottom: '5px solid transparent',
                borderLeft: '10px solid #666',
            }}
        />
    </div>
);

export const TimelineConnector: React.FC<any> = ({ style, data }) => (
    <div
        style={{
            position: 'absolute',
            width: '2px',
            height: '60px',
            backgroundColor: style.stroke,
            left: '50%',
            top: data.isTop ? '100%' : '0',
            transform: 'translateX(-50%)',
            zIndex: 1,
        }}
    />
);
