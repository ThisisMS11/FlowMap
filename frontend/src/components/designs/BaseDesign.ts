import type { NodeStyle, DesignConfig, NodeData } from '@/app/types';
import { brightColors } from '@/utils/util';

export abstract class BaseDesign implements Partial<DesignConfig> {
    abstract id: string;
    abstract name: string;
    abstract description: string;
    abstract category: 'hierarchical' | 'linear' | 'circular' | 'custom';
    abstract thumbnailIcon: string;

    protected baseNodeStyle: NodeStyle = {
        fontSize: '44px',
        padding: '16px 24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        color: '#1a202c',
    };

    protected getBaseNodeStyle(node: NodeData, index: number): NodeStyle {
        return {
            ...this.baseNodeStyle,
            backgroundColor: brightColors[index % brightColors.length],
        };
    }

    abstract calculateLayout(
        nodes: NodeData[],
        canvasWidth: number,
        canvasHeight: number
    ): any[];

    abstract getEdges(nodes: NodeData[]): any[];

    abstract getNodeStyle(
        node: NodeData,
        index: number,
        totalNodes: number
    ): NodeStyle;
}
