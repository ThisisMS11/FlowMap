import { useState } from 'react';
import DynamicLucidIcon from '../dynamic-lucid';
import { Handle, Position, NodeResizer } from '@xyflow/react';

interface CustomNodeProps {
    data: {
        title: string;
        icon?: string;
        style?: React.CSSProperties;
    };
}

const CustomNode: React.FC<CustomNodeProps> = ({
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

    // const iconContainerStyle: React.CSSProperties = {
    //     width: '50px',
    //     height: '50px',
    //     borderRadius: '100%',
    //     display: 'flex',
    //     alignItems: 'center',
    //     justifyContent: 'center',
    //     backgroundColor: style.backgroundColor,
    //     border: 'solid 2px black',
    // };

    return (
        <div className="custom-node w-[500px] flex  items-center">
            <NodeResizer
                isVisible={selected}
                // @ts-ignore
                minWidth={style.width}
                minHeight={100}
            />

            {/* Title Input/Display */}
            <div style={style}>
                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={() => setIsEditing(false)}
                        className="input-box"
                        style={{
                            width: '90%',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            border: `1px solid ${style.backgroundColor}`,
                            borderRadius: '4px',
                            backgroundColor: 'transparent',
                            marginBottom: '12px',
                        }}
                        autoFocus
                    />
                ) : (
                    <p
                        className="font-bold cursor-pointer"
                        style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            marginBottom: '12px',
                            color: '#333',
                            fontFamily: '"Comic Sans MS", sans-serif',
                        }}
                        onClick={() => setIsEditing(true)}
                    >
                        {title}
                    </p>
                )}

                {/* Handles */}
                <Handle
                    type="target"
                    position={Position.Top}
                    style={{ background: style.backgroundColor }}
                />
                <Handle
                    type="source"
                    position={Position.Bottom}
                    style={{ background: style.backgroundColor }}
                />
            </div>

            {/* Icon Container */}
            {data.icon && (
                <div>
                    <DynamicLucidIcon
                        iconName={data.icon}
                        invert={false}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomNode;
