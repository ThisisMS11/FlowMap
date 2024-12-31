import { type NodeData, type NodeStyle } from '../types';
import { BaseDesign } from './BaseDesign';

export class PyramidDesign extends BaseDesign {
    id = 'pyramid';
    name = 'Pyramid';
    description = 'Hierarchical pyramid layout with levels';
    category = 'hierarchical' as const;
    thumbnailIcon = 'Triangle';

    calculateLayout(
        nodes: NodeData[],
        canvasWidth: number,
        canvasHeight: number
    ): any[] {
        const levels = nodes.length;
        const centerX = canvasWidth / 2;
        const levelHeight = canvasHeight / levels;

        return nodes.map((node, index) => {
            // Calculate width of each level (wider at top, narrower at bottom)
            const levelWidth = canvasWidth * ((levels - index) / levels);
            const x = centerX;
            const y = 100 * index;

            return {
                ...node,
                position: { x, y },
                type: 'customNode',
            };
        });
    }

    getNodeStyle(node: NodeData, index: number, totalNodes: number): NodeStyle {
        // Calculate level-based values
        const levelDepth = 1 - index / totalNodes; // 1 at top, smaller towards bottom
        const baseWidth = 100 - (index / totalNodes) * 50; // Gets narrower towards bottom

        return {
            ...this.getBaseNodeStyle(node, index),
            // Sizing
            // width: `${baseWidth}%`,
            // minHeight: '80px',

            background: `linear-gradient(
                135deg,
                ${this.getBaseNodeStyle(node, index).backgroundColor} 0%,
                ${this.adjustColor(this.getBaseNodeStyle(node, index).backgroundColor, -20)} 100%
            )`,

            border: 'none',
            outline: `1px solid rgba(255, 255, 255, ${0.3 + levelDepth * 0.4})`,

            boxShadow: `
                0 ${4 + levelDepth * 4}px ${8 + levelDepth * 8}px rgba(0, 0, 0, 0.1),
                0 ${2 + levelDepth * 2}px ${4 + levelDepth * 4}px rgba(0, 0, 0, 0.05),
                inset 0 -2px 0 rgba(0, 0, 0, 0.1),
                inset 0 2px 0 rgba(255, 255, 255, 0.1)
            `,

            textAlign: 'center' as const,
            letterSpacing: '0.3px',

            // Padding that scales with level
            padding: `${16 + levelDepth * 8}px ${24 + levelDepth * 12}px`,

            // Modern rounded corners
            borderRadius: '16px',

            // Smooth transitions
            transition: 'all 0.3s ease-in-out',

            display: 'flex',
            flexDirection: 'column' as const,
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',

            // Icon styling
            '& svg': {
                width: `${20 + levelDepth * 4}px`,
                height: `${20 + levelDepth * 4}px`,
                opacity: 0.9,
            },

            // Hover state
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `
                    0 ${6 + levelDepth * 6}px ${12 + levelDepth * 12}px rgba(0, 0, 0, 0.15),
                    0 ${3 + levelDepth * 3}px ${6 + levelDepth * 6}px rgba(0, 0, 0, 0.1),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.15),
                    inset 0 2px 0 rgba(255, 255, 255, 0.15)
                `,
            },
        };
    }

    getEdges(nodes: NodeData[]): any[] {
        return nodes.slice(1).map((_, index) => ({
            id: `e${index}-${index + 1}`,
            source: nodes[index].id,
            target: nodes[index + 1].id,
            type: 'smoothstep',
        }));
    }

    // Helper function to adjust color brightness
    private adjustColor(color: string, amount: number): string {
        const clamp = (num: number) => Math.min(255, Math.max(0, num));

        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Adjust each channel
        const adjustedR = clamp(r + amount);
        const adjustedG = clamp(g + amount);
        const adjustedB = clamp(b + amount);

        // Convert back to hex
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
    }
}
