import { useState } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import Image from 'next/image';
import GearIcon from '../gear-icon';

interface CustomNodeProps {
    data: {
        title: string;
        icon?: string;
        style?: React.CSSProperties;
    };
}

const GearNode: React.FC<CustomNodeProps> = ({
    data,
    selected = false,
}: any) => {
    const [title, setTitle] = useState(data.title || 'Untitled');
    const [isEditing, setIsEditing] = useState(false);

    const level = (data.id || 0) % 4;

    console.log(`Level : ${level}`);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const style: React.CSSProperties = {
        ...data.style,
    };

    return (
        <div className="custom-node flex flex-col items-center justify-center">
            <NodeResizer isVisible={selected} minHeight={100} />

            {/* Title Input/Display */}
            <div style={style}>
                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={() => setIsEditing(false)}
                        className="input-box "
                        style={{
                            width: '60%',
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '12px',
                        }}
                        autoFocus
                    />
                ) : (
                    <p
                        className="font-bold cursor-pointer"
                        style={{
                            fontSize: '24px',
                            width: '60%',
                            fontWeight: 'bold',
                            marginBottom: '12px',
                            textAlign: 'center',
                            color: '#333',
                            backgroundColor: 'transparent',
                            fontFamily: '"Comic Sans MS", sans-serif',
                        }}
                        onClick={() => setIsEditing(true)}
                    >
                        {title}
                    </p>
                )}

                {/* Handles */}
                <Handle type="target" position={Position.Top} />
                <Handle type="source" position={Position.Bottom} />
            </div>

            <GearIcon width={data.size} height={data.size} />
        </div>
    );
};

export default GearNode;
