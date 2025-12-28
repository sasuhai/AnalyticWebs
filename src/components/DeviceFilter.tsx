'use client';

import { useState } from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface DeviceFilterProps {
    onSelect: (device: string) => void;
}

const devices = [
    { label: 'All Devices', value: 'all', icon: Monitor },
    { label: 'Desktop', value: 'desktop', icon: Monitor },
    { label: 'Mobile', value: 'mobile', icon: Smartphone },
    { label: 'Tablet', value: 'tablet', icon: Tablet },
];

export default function DeviceFilter({ onSelect }: DeviceFilterProps) {
    const [selected, setSelected] = useState('all');

    const handleSelect = (value: string) => {
        setSelected(value);
        onSelect(value);
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-muted-foreground">Device:</span>
            <div className="flex gap-2 flex-wrap">
                {devices.map((device) => {
                    const Icon = device.icon;
                    return (
                        <button
                            key={device.value}
                            onClick={() => handleSelect(device.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${selected === device.value
                                    ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/30'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {device.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
