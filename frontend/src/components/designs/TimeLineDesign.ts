import type { NodeData, NodeStyle } from '@/app/types';
import { BaseDesign } from './BaseDesign';
// import { brightColors } from '@/utils/util';
import {
    TimelineEdge,
    TimelineConnector,
} from '@/components/TimelineComponents';
import { MarkerType } from '@xyflow/react';
// import MyCircle from '@/app/assets/napkin-circle.png'
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
        const spacing = canvasWidth / (nodes.length - 1);
        const verticalOffset = 120;

        return nodes.map((node, index) => {
            const isTop = index % 2 === 0;
            return {
                ...node,
                position: {
                    x: spacing * (index + 1) - 35,
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

    getNodeStyle(
        node: NodeData,
        index: number,
        _totalNodes: number
    ): NodeStyle {
        const baseColor = this.getBaseNodeStyle(node, index).backgroundColor;

        return {
            width: '250px',
            height: 'fit-content',
            borderRadius: '10%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // @ts-ignore
            flexDirection: 'column', // @ts-ignore
            padding: '20px',
            position: 'relative',
            transition: 'all 0.3s ease-in-out',
            textAlign: 'center',
            gap: '10px',
            cursor: 'pointer',
            zIndex: '2',
        };
    }

    getEdges(nodes: NodeData[]): any[] {
        // return [timelineEdge, ...nodeConnections];
        return nodes.slice(1).map((_, index) => ({
            id: `e${index}-${index + 1}`,
            source: index % 2 == 0 ? nodes[index].id : nodes[index + 1].id,
            target: index % 2 == 0 ? nodes[index + 1].id : nodes[index].id,
            type: 'animatedDashedEdge',
            markerEnd: {
                type: MarkerType.Arrow,
            },
        }));
    }

    // Custom edge components for timeline and connectors
    customComponents = {
        'custom-timeline-edge': TimelineEdge,
        'custom-timeline-connector': TimelineConnector,
    };
}
