import { useState } from 'react';
import DynamicLucidIcon from '../dynamic-lucid';
import { Handle, Position, NodeResizer } from '@xyflow/react';

interface CustomNodeProps {
    data: {
        title: string;
        icon?: string;
        style?: React.CSSProperties;
        color?: string;
    };
}

const CustomNode: React.FC<CustomNodeProps> = ({
    data,
    selected = false,
}: any) => {
    const [title, setTitle] = useState(data.title || 'Untitled');
    const [isEditing, setIsEditing] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const style: React.CSSProperties = {
        ...data.style,
        backgroundColor: 'transparent',
        borderRadius: '12px',
        padding: '16px',
        textAlign: 'center',
    };

    return (
        <div style={style} className="custom-node">
            <NodeResizer isVisible={selected} />

            {/* Input box */}
            {isEditing ? (
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={() => setIsEditing(false)}
                    className="input-box"
                    style={{
                        width: '100%',
                        padding: '4px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                    }}
                    autoFocus
                />
            ) : (
                <p
                    className="font-bold cursor-pointer"
                    style={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        width: '200px',
                        fontFamily: '"Comic Sans MS", sans-serif',
                    }}
                    onClick={() => setIsEditing(true)}
                >
                    {title}
                </p>
            )}

            {/* Circular icon */}
            {data.icon && (
                <div
                    className="icon-container"
                    style={{
                        width: '80px',
                        height: '75px',
                        margin: '0 auto', // Center align
                        borderRadius: '100%',
                        backgroundColor: `${data.style.backgroundColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <DynamicLucidIcon iconName={data.icon} />
                </div>
            )}

            {/* Handles */}
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default CustomNode;
