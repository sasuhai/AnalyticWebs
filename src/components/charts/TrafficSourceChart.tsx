'use client';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { TrafficSource } from '@/types/website';

ChartJS.register(ArcElement, Tooltip, Legend);

interface TrafficSourceChartProps {
    data: TrafficSource[];
}

const colors = [
    'rgb(74, 222, 128)',   // Green
    'rgb(59, 130, 246)',   // Blue
    'rgb(168, 85, 247)',   // Purple
    'rgb(251, 146, 60)',   // Orange
    'rgb(236, 72, 153)',   // Pink
    'rgb(234, 179, 8)',    // Yellow
    'rgb(20, 184, 166)',   // Teal
    'rgb(248, 113, 113)',  // Red
];

export default function TrafficSourceChart({ data }: TrafficSourceChartProps) {
    const chartData = {
        labels: data.map(d => d.source),
        datasets: [
            {
                data: data.map(d => d.sessions),
                backgroundColor: colors.slice(0, data.length).map(c => c.replace('rgb', 'rgba').replace(')', ', 0.8)')),
                borderColor: colors.slice(0, data.length),
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    padding: 15,
                    font: {
                        size: 12,
                    },
                    generateLabels: (chart: any) => {
                        const datasets = chart.data.datasets;
                        return chart.data.labels.map((label: string, i: number) => ({
                            text: `${label} (${data[i].percentage.toFixed(1)}%)`,
                            fillStyle: datasets[0].backgroundColor[i],
                            strokeStyle: datasets[0].borderColor[i],
                            lineWidth: datasets[0].borderWidth,
                            hidden: false,
                            index: i,
                        }));
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                displayColors: true,
                callbacks: {
                    label: (context: any) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const percentage = data[context.dataIndex].percentage.toFixed(1);
                        return `${label}: ${value.toLocaleString()} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="chart-container animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
            <div style={{ height: '300px' }}>
                <Doughnut data={chartData} options={options} />
            </div>
        </div>
    );
}
