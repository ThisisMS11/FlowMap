import { type NodeData, type NodeStyle } from '@/app/types';
import { BaseDesign } from './BaseDesign';
import { MarkerType } from '@xyflow/react';

export class CircularDesign2 extends BaseDesign {
    id = 'circular';
    name = 'Circular Flow';
    description = 'Nodes arranged in a circular pattern';
    category = 'circular' as const;
    thumbnailIcon = 'Circle';

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
                type: 'customCircularNode',
            };
        });
    }

    getNodeStyle(
        node: NodeData,
        index: number,
        _totalNodes: number
    ): NodeStyle {
        return {
            ...this.getBaseNodeStyle(node, index),
            display: 'flex',
            // @ts-ignore
            display: 'flex',
            // @ts-ignore
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // @ts-ignore
            transition: 'all 0.3s ease-in-out',
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
}
