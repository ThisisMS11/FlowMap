import { type NodeData, type NodeStyle } from '@/app/types';
import { BaseDesign } from './BaseDesign';

export class GearDesign extends BaseDesign {
    id = 'gear';
    name = 'Gear Flow';
    description = 'Nodes arranged in a Gear pattern';
    category = 'circular' as const;
    thumbnailIcon = 'Circle';

    calculateLayout(
        nodes: NodeData[],
        canvasWidth: number,
        canvasHeight: number
    ): any[] {
        const timelineY = canvasHeight / 2;
        const spacing = canvasWidth / Math.max(1, nodes.length);
        const verticalOffset = 10;
        const sizes = [450, 300, 250, 400, 200]; // Predefined sizes for gears

        return nodes.map((node, index) => {
            const isTop = index % 2 === 0;
            const randomOffset = Math.random() * 50 - 25;
            const size = sizes[index % sizes.length];

            return {
                ...node,
                position: {
                    x: spacing * (index + 2),
                    y:
                        timelineY +
                        (isTop ? -verticalOffset : verticalOffset) +
                        randomOffset,
                },
                data: {
                    ...node,
                    isTop,
                },
                type: 'gearNode',
                size: size,
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent',
            transition: 'all 0.3s ease-in-out',
        };
    }

    getEdges(nodes: NodeData[]): any[] {
        return [];
    }
}
