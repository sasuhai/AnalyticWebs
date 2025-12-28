'use client';

import { Users, Eye, MousePointerClick, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    change?: number;
    icon: 'users' | 'eye' | 'click' | 'trending';
    trend?: 'up' | 'down';
    subtitle?: string;
}

const icons = {
    users: Users,
    eye: Eye,
    click: MousePointerClick,
    trending: TrendingUp,
};

export default function MetricCard({ title, value, change, icon, trend, subtitle }: MetricCardProps) {
    const Icon = icons[icon];

    return (
        <div className="metric-card animate-fade-in">
            <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <Icon className="w-6 h-6" />
                </div>
                {change !== undefined && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${trend === 'up' ? 'stat-increase' : 'stat-decrease'
                        }`}>
                        {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {Math.abs(change)}%
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    {title}
                </h3>
                <p className="text-3xl font-bold">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                {subtitle && (
                    <p className="text-xs text-muted-foreground">{subtitle}</p>
                )}
            </div>
        </div>
    );
}
