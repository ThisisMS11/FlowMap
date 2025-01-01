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
import { HexColorPicker } from 'react-colorful';
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
        useState<GeneratedStep[]>([]);
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
            const url = `${import.meta.env.SERVER_URL}/api/v1/model/generate`
            const results = await fetch(
                url,
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

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCurrentState(2);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsGenerating(false);
    };

    // Handle design changes
    const handleDesignChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedDesignId(event.target.value);
    };

    const [bgColor, setBgColor] = useState('#FFFFFF');

    const adjustColor = (color: string, amount: number): string => {
        const clamp = (num: number) => Math.min(255, Math.max(0, num));

        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        // Adjust each channel dynamically based on the amount
        const adjust = (channel: number, factor: number) => Math.floor(channel * (1 + factor));

        // Apply adjustment to each RGB channel with a dynamic factor (percentage adjustment)
        const adjustedR = clamp(adjust(r, amount));
        const adjustedG = clamp(adjust(g, amount));
        const adjustedB = clamp(adjust(b, amount));

        // Convert back to hex
        const toHex = (n: number) => n.toString(16).padStart(2, '0');
        return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
    }


    useEffect(() => {
        // const adjustedColor = adjustColor(bgColor, 15);
        setNodes((nds) =>
            nds.map((node) =>
                node.selected
                    ? {
                        ...node,
                        data: {
                            ...node.data,
                            style: {
                                ...node.data.style,
                                backgroundColor: bgColor, // Set the backgroundColor here
                                background: '', // Ensure that background shorthand is cleared
                            },
                        },
                    }
                    : node
            )
        );

        console.log(nodes);
    }, [bgColor, setNodes]);



    return (
        <div className="flex h-screen w-full">
            {/* Sidebar */}
            <Sidebar className="bg-gray-100 shadow-lg ">
                <SidebarHeader className="text-lg font-semibold text-gray-800 px-4 py-3 border-b border-gray-300">
                    Generate Flow Chart Using Text
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
                            className="w-full py-2 text-white bg-black rounded-lg hover:bg-gray-800 transition duration-150 ease-in-out text-lg font-semibold"
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'Generating...' : 'Generate'}
                        </Button>
                    </SidebarMenuItem>

                    <br />
                    <SidebarMenuItem>
                        <div className='text-xl'> Select Node and Change color</div>
                        <HexColorPicker
                            color={bgColor}
                            onChange={setBgColor}
                        />

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
