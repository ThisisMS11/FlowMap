import { useState } from 'react';
import DynamicLucidIcon from '../dynamic-lucid';
import { Handle, Position, NodeResizer } from '@xyflow/react';
import MyCircle from '../../app/assets/napkin-circle.png';
import Image from 'next/image';
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
    };

    return (
        <div className="relative">
            <Image
                src={MyCircle}
                alt="Image not found"
                width={Number(style.width)}
                height={Number(style.height)}
                className="w-64 h-30 absolute"
            />

            <div style={style}>
                <NodeResizer isVisible={selected} />/
                {data.icon && (
                    <div className="mr-4 icon-container w-12 h-12">
                        <DynamicLucidIcon iconName={data.icon} />
                    </div>
                )}
                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={handleTitleChange}
                        onBlur={() => setIsEditing(false)}
                        className="z-2 border rounded px-2 py-1 text-2xl font-bold"
                        autoFocus
                    />
                ) : (
                    <p
                        className="z-2 font-bold  cursor-pointer text-xl text-white"
                        onClick={() => setIsEditing(true)}
                        style={{
                            fontFamily: '"Comic Sans MS", sans-serif',
                        }}
                    >
                        {title}
                    </p>
                )}
                <Handle type="target" position={Position.Top} />
                <Handle type="source" position={Position.Bottom} />
            </div>
        </div>
    );
};

export default CustomNode;
