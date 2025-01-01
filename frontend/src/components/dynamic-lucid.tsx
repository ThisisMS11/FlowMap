import * as LucideIcons from 'lucide-react';
import { ArrowDownToDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const defaultIcons = [
    'Circle',
    'Square',
    'Hexagon',
    'ArrowRight',
    'Check',    
    'AlertCircle',
    'Play',
    'Pause',
    'ChevronDown',
    'Slash',
];

const getRandomDefaultIcon = () => {
    const randomIndex = Math.floor(Math.random() * defaultIcons.length);
    return defaultIcons[randomIndex];
};

const DynamicLucidIcon = ({
    iconName,
    color = 'black',
    invert = true,
}: any) => {
    // @ts-ignore
    const IconComponent = LucideIcons[iconName];

    const [randomIconName] = useState(() => getRandomDefaultIcon());
    // @ts-ignore
    const RandomDefaultIcon = LucideIcons[randomIconName];

    const extraClasses = invert ? `opacity-90 invert` : ``;

    if (!IconComponent) {
        console.warn(`Icon "${iconName}" not found in Lucide Icons library.`);

        return (
            <div  >
                {RandomDefaultIcon ? (
                    <RandomDefaultIcon
                        className={cn('h-10 w-10 filter brightness-0', extraClasses)}
                        color={color}
                    />
                ) : (
                    <ArrowDownToDot className="h-[80%] w-[85%]" color={color} />
                )}
            </div>
        );
    }

    return (
        <IconComponent
            color={color}
            className={cn('h-10 w-10 filter brightness-0', extraClasses)}
        />
    );
};

export default DynamicLucidIcon;
