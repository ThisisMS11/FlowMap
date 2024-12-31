import { useState } from 'react';
import DynamicLucidIcon from './dynamic-lucid';
import { Handle, Position, NodeResizer } from '@xyflow/react';

interface CustomNodeProps {
    data: {
        title: string;
        icon?: string;
        style?: React.CSSProperties;
        color?: string;
    };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data, selected =false}: any) => {
    const [title, setTitle] = useState(data.title || 'Untitled');
    const [isEditing, setIsEditing] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const style: React.CSSProperties = {
        ...data.style,
    };

    return (
        <div className="relative" style={style}>
            <NodeResizer isVisible={selected} />


            {data.icon && (
                <div className="mr-4 icon-container">
                    <DynamicLucidIcon iconName={data.icon} />
                </div>
            )}
            {isEditing ? (
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    onBlur={() => setIsEditing(false)}
                    className="border rounded px-2 py-1 text-2xl font-bold"
                    autoFocus
                />
            ) : (
                <p
                    className="font-bold  cursor-pointer text-2xl"
                    onClick={() => setIsEditing(true)}
                >
                    {title}
                </p>
            )}
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default CustomNode;
