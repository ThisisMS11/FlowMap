import React from 'react';
import gearIcon from '@/app/assets/Gear-icon.png';
import Image from 'next/image';

interface GearIconProps {
    height: number;
    width: number;
    bgColor?: string;
    className?: string;
    spinning?: boolean;
}

const GearIcon: React.FC<GearIconProps> = ({ height = 100, width = 100 }) => {
    return (
        <Image src={gearIcon} alt="Gear Icon" width={width} height={height} />
    );
};

export default GearIcon;
