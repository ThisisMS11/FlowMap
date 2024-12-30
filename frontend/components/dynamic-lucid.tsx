import React from 'react';
import * as LucideIcons from 'lucide-react';

const DynamicLucidIcon = ({ iconName, size = 24, color = "black" }: any) => {
    // @ts-ignore 
    const IconComponent = LucideIcons[iconName];

    if (!IconComponent) {
        console.warn(`Icon "${iconName}" not found in Lucide Icons library.`);
        return <div>Icon not found</div>; 
    }

    return <IconComponent size={size} color={color} />;
};

export default DynamicLucidIcon;
