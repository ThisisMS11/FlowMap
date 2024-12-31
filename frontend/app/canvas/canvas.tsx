import React, {
    useCallback,
    useState,
    useEffect,
    useMemo,
    useRef,
} from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Position,
    Handle,
    Background,
    Controls,
    ReactFlowProvider,
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
import designs, { getDesignById } from '../designs';

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);

    const [selectedDesignId, setSelectedDesignId] = useState(designs[0].id);
    const containerRef = useRef<HTMLDivElement>(null);
    const [generatedResults, setGeneratedResults] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentState, setCurrentState] = useState(0);

    useEffect(() => {
        if (!generatedResults.length || !containerRef.current) return;

        const design = getDesignById(selectedDesignId);
        const { width, height } = containerRef.current.getBoundingClientRect();

        try {
            const nodeData = generatedResults.map((step, index) => ({
                id: `${index}`,
                title: step.title,
                icon: step.icon,
            }));

            // Calculate layout based on container size
            const generatedNodes = design.calculateLayout(
                nodeData,
                width,
                height
            );

            // Apply design-specific styles
            generatedNodes.forEach((node, index) => {
                node.data = {
                    ...node,
                    style: design.getNodeStyle(
                        node,
                        index,
                        generatedNodes.length
                    ),
                };
            });

            // Generate edges according to design
            const generatedEdges = design.getEdges(generatedNodes);

            setNodes(generatedNodes);
            setEdges(generatedEdges);
        } catch (error) {
            console.error('Error generating flow:', error);
        }
    }, [generatedResults, selectedDesignId, containerRef]);

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

    const loadingStates = [
        { text: 'Parsing Text' },
        { text: 'Structuring Results' },
        { text: 'Creating flow Chart' },
    ];

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar code remains the same */}
            <Sidebar>
                <SidebarHeader className="text-3xl">
                    Generate Flow
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenuItem className="p-4">
                        <Textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter your text here..."
                            className="mb-4 bg-white text-xl"
                        />
                        <Button
                            onClick={handleGenerate}
                            className="w-full bg-blue-400 hover:bg-blue-600"
                        >
                            Generate
                        </Button>
                    </SidebarMenuItem>
                </SidebarContent>
            </Sidebar>

            <SidebarTrigger />

            <div className="flex-1 w-3/4 relative" ref={containerRef}>
                {isGenerating ? (
                    <MultiStepLoader
                        loading={isGenerating}
                        loadingStates={loadingStates}
                        currentState={currentState}
                    />
                ) : generatedResults.length > 0 ? (
                    <div className="w-full h-full">
                        <ReactFlowProvider>
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
                        </ReactFlowProvider>

                        {/* Updated design selector */}
                        <div className="absolute top-4 right-4 z-10">
                            <select
                                value={selectedDesignId}
                                onChange={(e) =>
                                    setSelectedDesignId(e.target.value)
                                }
                                className="bg-white border rounded p-2"
                            >
                                {designs.map((design) => (
                                    <option key={design.id} value={design.id}>
                                        {design.name}
                                    </option>
                                ))}
                            </select>
                        </div>
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
