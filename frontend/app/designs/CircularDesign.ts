import { type NodeData, type NodeStyle } from '../types';
import { BaseDesign } from './BaseDesign';

export class CircularDesign extends BaseDesign {
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
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        const radius = Math.min(canvasWidth, canvasHeight) * 0.5;

        return nodes.map((node, index) => {
            const angle = (index / nodes.length - 1) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            return {
                ...node,
                position: { x, y },
                type: 'customNode',
            };
        });
    }

    getNodeStyle(node: NodeData, index: number, totalNodes: number): NodeStyle {
        return {
            ...this.getBaseNodeStyle(node, index),
            borderRadius: '50%',
            // @ts-ignore 
            background: `linear-gradient(135deg, #f8fafc, #e2e8f0)`,
            width: 'fit-content',
            height: '120px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease-in-out',
            boxShadow:
                '0px 4px 10px rgba(0, 0, 0, 0.25), 0px 1px 3px rgba(0, 0, 0, 0.15)',
        };
    }

    getEdges(nodes: NodeData[]): any[] {
        const edges = [];
        for (let i = 0; i < nodes.length; i++) {
            const nextIndex = (i + 1) % nodes.length;
            edges.push({
                id: `e${i}-${nextIndex}`,
                source: nodes[i].id,
                target: nodes[nextIndex].id,
                type: 'smoothstep',
            });
        }
        return edges;
    }
}
