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
    Background,
    Controls,
    type Connection,
    type Edge,
    type Node,
    ReactFlowProvider,
    reconnectEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import DynamicLucidIcon from '~/components/dynamic-lucid';
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
import type { NodeData, DesignConfig } from '../types';
import { sampleOutput } from 'utils/sampleOutput';
import CustomNode from '~/components/custom-node';
import AnimatedDashedEdge from '~/components/custom-dashed-animated-edge';

interface CanvasProps {
    onSave?: (nodes: Node[], edges: Edge[]) => void;
    initialData?: {
        nodes: Node[];
        edges: Edge[];
    };
}

interface GeneratedStep {
    title: string;
    icon?: string;
}

const Canvas: React.FC<CanvasProps> = ({ onSave, initialData }) => {
    // State management
    const [nodes, setNodes, onNodesChange] = useNodesState(
        initialData?.nodes || []
    );
    const [edges, setEdges, onEdgesChange] = useEdgesState(
        initialData?.edges || []
    );
    const [isGenerating, setIsGenerating] = useState(false);
    const [currentState, setCurrentState] = useState(0);
    const [generatedResults, setGeneratedResults] =
        useState<GeneratedStep[]>(sampleOutput);
    const [selectedDesignId, setSelectedDesignId] = useState('pyramid');
    const [inputText, setInputText] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Memoized values
    const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);
    const edgeTypes = useMemo(
        () => ({ animatedDashedEdge: AnimatedDashedEdge }),
        []
    );

    const currentDesign = useMemo(
        () => getDesignById(selectedDesignId),
        [selectedDesignId]
    );

    // Loading states for the multi-step loader
    const loadingStates = [
        { text: 'Parsing Text' },
        { text: 'Structuring Results' },
        { text: 'Creating Flow Chart' },
    ];

    // Handle new connections between nodes
    const edgeReconnectSuccessful = useRef(true);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const onReconnect = useCallback((oldEdge: Edge, newConnection: any) => {
        edgeReconnectSuccessful.current = true;
        setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
    }, []);

    const onReconnectEnd = useCallback((_: any, edge: Edge) => {
        if (!edgeReconnectSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }
        edgeReconnectSuccessful.current = true;
    }, []);

    // Update layout when design changes or new results are generated
    useEffect(() => {
        if (!generatedResults.length || !containerRef.current) return;

        const { width, height } = containerRef.current.getBoundingClientRect();

        try {
            // Prepare node data
            console.log('line no 134 : ', { generatedResults });
            const nodeData: NodeData[] = generatedResults.map(
                (step, index) => ({
                    id: `${index}`,
                    title: step.title,
                    icon: step.icon,
                })
            );

            // Get layout from current design
            const generatedNodes = currentDesign.calculateLayout(
                nodeData,
                width,
                height
            );

            // Apply design-specific styles
            const styledNodes = generatedNodes.map((node, index) => ({
                ...node,
                data: {
                    ...node,
                    style: currentDesign.getNodeStyle(
                        node,
                        index,
                        generatedNodes.length
                    ),
                },
            }));

            // Generate edges according to design
            const generatedEdges = currentDesign.getEdges(styledNodes);

            setNodes(styledNodes);
            setEdges(generatedEdges);

            // Call onSave callback if provided
            onSave?.(styledNodes, generatedEdges);
        } catch (error) {
            console.error('Error generating flow:', error);
        }
    }, [
        generatedResults,
        selectedDesignId,
        currentDesign,
        containerRef,
        onSave,
    ]);

    // Handle generation of new flow
    const handleGenerate = async () => {
        setIsGenerating(true);
        setCurrentState(0);

        try {
            // Call to backend API
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

    // Handle design changes
    const handleDesignChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedDesignId(event.target.value);
    };

    return (
        <div className="flex h-screen w-full">
            {/* Sidebar */}
            <Sidebar className="bg-gray-100 shadow-lg ">
                <SidebarHeader className="text-lg font-semibold text-gray-800 px-4 py-3 border-b border-gray-300">
                    Generate Flow
                </SidebarHeader>
                <SidebarContent className="p-4">
                    <SidebarMenuItem className="space-y-4">
                        <Textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter your text here..."
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Button
                            onClick={handleGenerate}
                            className="w-full py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
                        >
                            Generate
                        </Button>
                    </SidebarMenuItem>
                </SidebarContent>
            </Sidebar>

            <SidebarTrigger />

            {/* Main Canvas Area */}
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
                                edgeTypes={edgeTypes}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                nodeTypes={nodeTypes}
                                onReconnect={onReconnect}
                                onReconnectStart={onReconnectStart}
                                onReconnectEnd={onReconnectEnd}
                                fitView
                                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                            >
                                <Background />
                                <Controls />
                                <DownloadButton />
                            </ReactFlow>
                        </ReactFlowProvider>

                        {/* Design Selector */}
                        <div className="absolute top-4 right-4 z-10">
                            <select
                                value={selectedDesignId}
                                onChange={handleDesignChange}
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
};

export default Canvas;
