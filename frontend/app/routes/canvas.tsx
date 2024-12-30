import React, { useCallback, useState, useEffect, useMemo } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Position,
    Handle,
    Background,
    Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { sampleOutput } from 'utils/sampleOutput';
import DynamicLucidIcon from '~/components/dynamic-lucid';
import designTemplates from 'utils/DesignTemplates';
import { brightColors } from 'utils/util';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import { Sidebar, SidebarMenuItem } from '~/components/ui/sidebar';

function CustomNode({ data }: any) {
    return (
        <div style={{ ...data.style, backgroundColor: data.color }}>
            <div className="flex items-center">
                {data.icon && (
                    <div className="mr-4">
                        <DynamicLucidIcon iconName={data.icon} />
                    </div>
                )}
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
    const [selectedDesign, setSelectedDesign] =
        useState<string>('verticalTimeline');
    const [inputText, setInputText] = useState('');

    const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

    useEffect(() => {
        // @ts-ignore
        const design = designTemplates[selectedDesign];
        const generatedNodes = design.layout(
            sampleOutput.map((step, index) => ({
                id: `${index}`,
                type: 'customNode',
                data: {
                    title: step.title,
                    icon: step.icon,
                    style: design.style,
                    color: brightColors[index % brightColors.length],
                },
            }))
        );

        const generatedEdges = sampleOutput.slice(1).map((_, index) => ({
            id: `e${index}-${index + 1}`,
            source: `${index}`,
            target: `${index + 1}`,
        }));

        setNodes(generatedNodes);
        // @ts-ignore
        setEdges(generatedEdges);
    }, [selectedDesign]);

    const onConnect = useCallback(
        // @ts-ignore
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const handleGenerate = () => {
        console.log('Input text submitted:', inputText);
        // Logic to generate flowchart based on inputText can be added here
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar className="w-1/4 border-r">
                <SidebarMenuItem className="p-4">
                    <h2 className="text-lg font-semibold mb-4">
                        Generate Flow
                    </h2>
                    <Textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter your text here..."
                        className="mb-4"
                    />
                    <Button onClick={handleGenerate} className="w-full">
                        Generate
                    </Button>
                </SidebarMenuItem>
            </Sidebar>

            {/* ReactFlow Container */}
            <div className="flex-1">
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
                    className="absolute top-4 right-4 z-10 bg-white border rounded p-2"
                >
                    <option value="horizontal">Horizontal Flow</option>
                    <option value="verticalTimeline">Vertical Timeline</option>
                    <option value="circularFlow">Circular Flow</option>
                </select>
            </div>
        </div>
    );
}
