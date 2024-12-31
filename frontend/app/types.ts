export interface NodeStyle {
    backgroundColor?: string;
    borderRadius?: string;
    padding?: string;
    boxShadow?: string;
    border?: string;
    color?: string;
    width?: number | string;
    height?: number | string;
    fontSize?: string;
    display?: string;
    alignItems?: string;
    justifyContent?: string;
}

export interface NodeData {
    id: string;
    title: string;
    icon?: string;
    children?: NodeData[];
    style?: NodeStyle;
}

export interface DesignConfig {
    id: string;
    name: string;
    description: string;
    category: 'hierarchical' | 'linear' | 'circular' | 'custom';
    thumbnailIcon: string; // Lucide icon name
    supportedNodeCount?: {
        min: number;
        max: number;
    };
    calculateLayout: (
        nodes: NodeData[],
        canvasWidth: number,
        canvasHeight: number
    ) => any[];
    getNodeStyle: (
        node: NodeData,
        index: number,
        totalNodes: number
    ) => NodeStyle;
    getEdges: (nodes: NodeData[]) => any[];
    customComponents?: {
        node?: React.ComponentType<any>;
        edge?: React.ComponentType<any>;
    };
}
