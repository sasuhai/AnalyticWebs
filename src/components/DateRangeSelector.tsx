'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangeSelectorProps {
    onSelect: (startDate: string, endDate: string) => void;
}

const presetRanges = [
    { label: 'Last 7 days', value: '7daysAgo' },
    { label: 'Last 30 days', value: '30daysAgo' },
    { label: 'Last 90 days', value: '90daysAgo' },
    { label: 'Last 12 months', value: '365daysAgo' },
];

export default function DateRangeSelector({ onSelect }: DateRangeSelectorProps) {
    const [selected, setSelected] = useState('30daysAgo');

    const handleSelect = (value: string) => {
        setSelected(value);
        onSelect(value, 'today');
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Date Range:</span>
            </div>
            <div className="flex gap-2 flex-wrap">
                {presetRanges.map((range) => (
                    <button
                        key={range.value}
                        onClick={() => handleSelect(range.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selected === range.value
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
