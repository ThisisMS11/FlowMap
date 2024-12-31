import type { NodeData, NodeStyle } from '../types';
import { BaseDesign } from './BaseDesign';
import { brightColors } from 'utils/util';
import {
    TimelineEdge,
    TimelineConnector,
} from '../components/TimelineComponents';

export class TimelineDesign extends BaseDesign {
    id = 'timeline';
    name = 'Alternating Timeline';
    description = 'Nodes alternating above and below a timeline';
    category = 'linear' as const;
    thumbnailIcon = 'Timeline';

    calculateLayout(
        nodes: NodeData[],
        canvasWidth: number,
        canvasHeight: number
    ): any[] {
        const timelineY = canvasHeight / 2;
        const spacing = canvasWidth / (nodes.length + 1);
        const verticalOffset = 120;

        return nodes.map((node, index) => {
            const isTop = index % 2 === 0;
            return {
                ...node,
                position: {
                    x: spacing * (index + 1) - 75,
                    y:
                        timelineY +
                        (isTop ? -verticalOffset : verticalOffset) -
                        75,
                },
                data: {
                    ...node,
                    isTop,
                },
                type: 'customNode',
            };
        });
    }

    getNodeStyle(node: NodeData, index: number, totalNodes: number): NodeStyle {
        const baseColor = this.getBaseNodeStyle(node, index).backgroundColor;

        return {
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            position: 'relative',
            border: `2px solid ${baseColor}`,
            boxShadow: `0 0 20px ${baseColor}40,
                       inset 0 0 15px ${baseColor}40`,
            transition: 'all 0.3s ease-in-out',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: '500',
            gap: '10px',
            cursor: 'pointer',
            zIndex: '2',

            // Icon container
            '& .icon-container': {
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: baseColor,
                borderRadius: '50%',
                marginBottom: '8px',
            },

            // Icon styling
            '& svg': {
                width: '24px',
                height: '24px',
                color: '#fff',
            },

            // Hover effects
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: `0 0 30px ${baseColor}60,inset 0 0 20px ${baseColor}60`,
            },
        };
    }

    getEdges(nodes: NodeData[]): any[] {
        const timelineEdge = {
            id: 'timeline-line',
            source: nodes[0].id,
            target: nodes[nodes.length - 1].id,
            type: 'custom-timeline-edge',
            style: {
                stroke: '#666',
                strokeWidth: 2,
            },
            data: {
                isTimeline: true,
            },
        };

        const nodeConnections = nodes.map((node, index) => {
            const isTop = index % 2 === 0;
            return {
                id: `connector-${index}`,
                source: node.id,
                target: 'timeline-line',
                type: 'custom-timeline-connector',
                style: {
                    stroke: brightColors[index % brightColors.length],
                    strokeWidth: 2,
                },
                data: {
                    isConnector: true,
                    isTop,
                },
            };
        });

        return [timelineEdge, ...nodeConnections];
    }

    // Custom edge components for timeline and connectors
    customComponents = {
        'custom-timeline-edge': TimelineEdge,
        'custom-timeline-connector': TimelineConnector,
    };
}
