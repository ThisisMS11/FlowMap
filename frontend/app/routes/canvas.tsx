import React, { useCallback, useEffect,useMemo } from 'react';
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    addEdge,
    Position,
    Handle
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';

const initialNodes = [
    { id: '1', type: 'textUpdater', position: { x: 0, y: 0 }, data: { label: '1', icon: 'something' } },
    { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
    { id: '3', position: { x: 0, y: 150 }, data: { label: 'mohit' } },
];
const initialEdges = [{ id: 'e1-2', source: '2', target: '3' }];

function TextUpdaterNode({ data }: any) {
    const onChange = useCallback((evt: any) => {
        console.log(evt.target.value);
    }, []);

    return (
        <>
            <Handle type="target" position={Position.Top} />
            <div className='bb p-4 rounded-md bg-pink-500'>
                <label htmlFor="text">Text:</label>
                <input id="text" name="text" onChange={onChange} className="nodrag" />
            </div>
            <Handle type="source" position={Position.Bottom} id="a" />
            <Handle
                type="source"
                position={Position.Bottom}
                id="b"
                style={{ left: 10 }}
            />
        </>
    );
}

export default function App() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);

    useEffect(() => {
        console.log(edges)
    }, [edges])

    return (
        <div className='h-[80vh] w-[80vw] bb'>
            <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            />
        </div>
    );
}