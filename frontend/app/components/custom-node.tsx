import { useState } from 'react';
import DynamicLucidIcon from './dynamic-lucid';
import { Handle, Position, NodeResizer, NodeToolbar } from '@xyflow/react';
import { Button } from './ui/button';
import { HexColorPicker } from 'react-colorful';

interface CustomNodeProps {
    data: {
        title: string;
        icon?: string;
        style?: React.CSSProperties;
        color?: string;
    };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
    const [title, setTitle] = useState(data.title || 'Untitled');
    const [isEditing, setIsEditing] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#000000');
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const style: React.CSSProperties = {
        ...data.style,
        backgroundColor,
    };

    return (
        <div className="relative" style={style}>
            <NodeResizer minWidth={100} minHeight={30} />

            <NodeToolbar position={Position.Top} className="flex gap-2">
                <Button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    size="sm"
                >
                    {showColorPicker ? 'Close' : 'Color'}
                </Button>
            </NodeToolbar>

            {showColorPicker && (
                <div
                    className="absolute left-0 -top-2 transform -translate-y-full"
                    style={{
                        zIndex: 1000,
                    }}
                >
                    <div className="p-2 rounded-lg shadow-lg bg-white">
                        <HexColorPicker
                            color={backgroundColor}
                            onChange={(color) =>
                                setBackgroundColor(() => color)
                            }
                        />
                    </div>
                </div>
            )}

            <div className="flex items-center">
                {data.icon && (
                    <div className="mr-4">
                        <DynamicLucidIcon iconName={data.icon} />
                    </div>
                )}
                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={() => setIsEditing(false)}
                        className="border rounded px-2 py-1 text-lg font-bold"
                        autoFocus
                    />
                ) : (
                    <p
                        className="font-bold text-lg cursor-pointer"
                        onClick={() => setIsEditing(true)}
                    >
                        {title}
                    </p>
                )}
            </div>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
};

export default CustomNode;
