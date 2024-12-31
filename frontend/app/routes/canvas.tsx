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
import DynamicLucidIcon from '~/components/dynamic-lucid';
import designTemplates from 'utils/DesignTemplates';
import { brightColors } from 'utils/util';
import { Button } from '~/components/ui/button';
import { Textarea } from '~/components/ui/textarea';
import {
    Sidebar,
    SidebarMenuItem,
    SidebarTrigger,
    SidebarHeader,
    SidebarContent,
} from '~/components/ui/sidebar';
import { MultiStepLoader } from '~/components/ui/multi-loader';
import DownloadButton from '~/components/download-button';

const CustomNode = ({ data }: any) => {
    return (
        <div
            style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                ...data.style,
                backgroundColor: data.color || '#ccc',
                minWidth: '150px',
                minHeight: '50px',
            }}
        >
            <div className="flex items-center">
                {data.icon && (
                    <div className="mr-4">
                        <DynamicLucidIcon iconName={data.icon} />
                    </div>
                )}
                <p className="text-sm font-bold">{data.title || 'Untitled'}</p>
            </div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentState, setCurrentState] = useState(0);
    const [generatedResults, setGeneratedResults] = useState([]);
    const [selectedDesign, setSelectedDesign] = useState('verticalTimeline');
    const [inputText, setInputText] = useState('');

    const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

    useEffect(() => {
        if (!generatedResults.length) return;

        // @ts-ignore
        const design = designTemplates[selectedDesign];
        if (!design) {
            console.error(
                'Selected design template not found:',
                selectedDesign
            );
            return;
        }

        try {
            const generatedNodes = design.layout(
                generatedResults.map((step, index) => ({
                    id: `${index}`,
                    type: 'customNode',
                    data: {
                        title: step.title,
                        icon: step.icon,
                        style: design.style,
                        index,
                        color: brightColors[index % brightColors.length],
                    },
                }))
            );

            const generatedEdges = generatedResults
                .slice(1)
                .map((_, index) => ({
                    id: `e${index}-${index + 1}`,
                    source: `${index}`,
                    target: `${index + 1}`,
                    type: 'smoothstep',
                }));

            setNodes(generatedNodes);
            setEdges(generatedEdges);
        } catch (error) {
            console.error('Error generating flow:', error);
        }
    }, [generatedResults, selectedDesign]);

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const loadingStates = [
        { text: 'Parsing Text' },
        { text: 'Structuring Results' },
        { text: 'Creating flow Chart' },
    ];

    const handleGenerate = async () => {
        setIsGenerating(true);
        setCurrentState(0);

        try {
            const results = await fetch(
                'http://localhost:8000/api/v1/model/generate',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: inputText }),
                }
            );

            setCurrentState(1);
            const data = await results.json();

            if (data?.data?.steps) {
                setGeneratedResults(data.data.steps);
            } else {
                console.error('Unexpected API response format:', data);
            }
        } catch (error) {
            console.error('Error generating results:', error);
        }

        setCurrentState(2);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsGenerating(false);
    };

    return (
        <div className="flex h-screen w-full">
            <SidebarTrigger />

            <div className="flex-1 w-3/4 relative">
                {isGenerating ? (
                    <MultiStepLoader
                        loading={isGenerating}
                        loadingStates={loadingStates}
                        currentState={currentState}
                    />
                ) : generatedResults.length > 0 ? (
                    <div className="w-full h-full">
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            nodeTypes={nodeTypes}
                            fitView
                        >
                            <Background />
                            <Controls />
                            <DownloadButton />
                        </ReactFlow>
                        <select
                            value={selectedDesign}
                            onChange={(e) => setSelectedDesign(e.target.value)}
                            className="absolute top-4 right-4 z-10 bg-white border rounded p-2"
                        >
                            <option value="horizontal">Horizontal Flow</option>
                            <option value="verticalTimeline">
                                Vertical Timeline
                            </option>
                            <option value="circularFlow">Circular Flow</option>
                        </select>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        No results to display. Enter input and click "Generate".
                    </div>
                )}
            </div>
        </div>
    );
}
