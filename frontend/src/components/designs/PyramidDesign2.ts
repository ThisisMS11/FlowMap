import { type NodeData, type NodeStyle } from '@/app/types';
import { BaseDesign } from './BaseDesign';

export class PyramidDesign2 extends BaseDesign {
    id = 'pyramid';
    name = 'Pyramid';
    description = 'Hierarchical pyramid layout with levels';
    category = 'hierarchical' as const;
    thumbnailIcon = 'Triangle';

    calculateLayout(
        nodes: NodeData[],
        canvasWidth: number,
        _canvasHeight: number
    ): any[] {
        // const levels = nodes.length;
        const centerX = canvasWidth / 2;
        // const levelHeight = canvasHeight / levels;

        return nodes.map((node, index) => {
            // Calculate width of each level (wider at top, narrower at bottom)
            // const levelWidth = canvasWidth * ((levels - index) / levels);
            const x = centerX;
            const y = 85 * index;

            return {
                ...node,
                position: { x, y },
                type: 'customNodePyramid',
            };
        });
    }

    getNodeStyle(node: NodeData, index: number, totalNodes: number): NodeStyle {
        // Calculate level-based values
        // const baseWidth = 100 - (index / totalNodes) * 50; // Gets narrower towards bottom

        const baseStyle = this.getBaseNodeStyle(node, index);
        const baseColor = baseStyle.backgroundColor || '#000';
        const adjustedColor = this.adjustColor(baseColor, 15);

        const levelStyles = {
            0: { width: 100 },
            1: { width: 200 },
            2: { width: 300 },
            3: { width: 400 },
            4: { width: 500 },
        };

        const { width } = levelStyles[(index % 5) as keyof typeof levelStyles];

        return {
            ...baseStyle,
            // @ts-ignore,
            background: `linear-gradient(
                135deg,
                ${baseColor} 0%,
                ${adjustedColor} 100%
            )`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${width}px`,
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '4px',
            // @ts-ignore
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: `2px solid ${baseColor}`,
            transition: 'all 0.3s ease',
            margin: '0 auto',
            // Smooth transitions
            // @ts-ignore
            transition: 'all 0.3s ease-in-out',
        };
    }

    getEdges(nodes: NodeData[]): any[] {
        // return nodes.slice(1).map((_, index) => ({
        //     id: `e${index}-${index + 1}`,
        //     source: nodes[index].id,
        //     target: nodes[index + 1].id,
        //     type: 'smoothstep',
        // }));
        return [];
    }

    private adjustColor(color: string, amount: number): string {
        const clamp = (num: number) => Math.min(255, Math.max(0, num));

        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Adjust each channel dynamically based on the amount
        const adjust = (channel: number, factor: number) =>
            Math.floor(channel * (1 + factor));

        // Apply adjustment to each RGB channel with a dynamic factor (percentage adjustment)
        const adjustedR = clamp(adjust(r, amount));
        const adjustedG = clamp(adjust(g, amount));
        const adjustedB = clamp(adjust(b, amount));

        // Convert back to hex
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
    }
}
