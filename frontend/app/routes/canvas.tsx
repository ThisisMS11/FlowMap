import React, { useCallback, useState, useEffect, useMemo } from 'react';
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
import designTemplates from 'utils/DesignTemplates';
import { cn } from 'utils/cn';
import { brightColors } from 'utils/util';

function CustomNode({ data }: any) {
    // data.style =  "rounded-sm bg-red-500"
    return (
        <div style={{ ...data.style ,backgroundColor : data.color}}>
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
    const [selectedDesign, setSelectedDesign] = useState('verticalTimeline');

    const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

    useEffect(() => {

        const design = designTemplates[selectedDesign];
        const generatedNodes = design.layout(
            sampleOutput.map((step, index) => ({
                id: `${index}`,
                type: 'customNode',
                data: {
                    title: step.title,
                    icon: step.icon,
                    style: design.style,
                    color: brightColors[index % brightColors.length]
                }
            }))
        );

        const generatedEdges = sampleOutput
            .slice(1)
            .map((_, index) => ({
                id: `e${index}-${index + 1}`,
                source: `${index}`,
                target: `${index + 1}`,
            }));

        setNodes(generatedNodes);
        setEdges(generatedEdges)
    }, [selectedDesign]);

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
            <select
                value={selectedDesign}
                onChange={(e) => setSelectedDesign(e.target.value)}
                className="absolute top-4 right-4 z-10"
            >
                <option value="horizontal">Horizontal Flow</option>
                <option value="verticalTimeline"> Vertical Timeline</option>
                <option value="circularFlow">Circular Flow</option>
            </select>
        </div>
    );
}
