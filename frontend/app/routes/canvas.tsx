import React, { useCallback, useEffect, useMemo } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Position,
    Handle,
    Background,
    Controls
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

import { sampleOutput } from 'utils/sampleOutput';
import DynamicLucidIcon from 'components/dynamic-lucid';

function CustomNode({ data }: any) {
    return (
        <div className="custom-node bg-gray-100 p-4 border rounded-lg shadow-md"
            style={{ backgroundColor: data.color }}>
            <div className="flex  items-center">
                {data.icon && <div className='mr-4'><DynamicLucidIcon iconName={data.icon} /></div>}
                <p className="text-sm font-bold mt-2">{data.title}</p>
            </div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

    const brightColors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC733",
        "#33FFF3", "#A133FF", "#FF7B33", "#33FF8C", "#FF3333",
    ];

    useEffect(() => {
        // Generate nodes dynamically from sampleOutput
        const generatedNodes = sampleOutput.map((step, index) => ({
            id: `${index}`,
            type: 'customNode',
            position: { x: 200, y: index * 100 },
            data: { title: step.title, icon: step.icon, color: brightColors[index % brightColors.length] },
        }));

        const generatedEdges = sampleOutput
            .slice(1)
            .map((_, index) => ({
                id: `e${index}-${index + 1}`,
                source: `${index}`,
                target: `${index + 1}`,
            }));

        setNodes(generatedNodes);
        setEdges(generatedEdges);
    }, []);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    return (
        <div className="h-[100vh] w-[100vw] bb">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}
