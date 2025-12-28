'use client';

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { DeviceMetric } from '@/types/website';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DeviceChartProps {
    data: DeviceMetric[];
}

const deviceColors: Record<string, string> = {
    mobile: 'rgb(59, 130, 246)',    // Blue
    desktop: 'rgb(74, 222, 128)',   // Green
    tablet: 'rgb(168, 85, 247)',    // Purple
};

export default function DeviceChart({ data }: DeviceChartProps) {
    const chartData = {
        labels: data.map(d => d.device.charAt(0).toUpperCase() + d.device.slice(1)),
        datasets: [
            {
                label: 'Sessions',
                data: data.map(d => d.sessions),
                backgroundColor: data.map(d =>
                    (deviceColors[d.device.toLowerCase()] || 'rgb(156, 163, 175)').replace('rgb', 'rgba').replace(')', ', 0.8)')
                ),
                borderColor: data.map(d => deviceColors[d.device.toLowerCase()] || 'rgb(156, 163, 175)'),
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context: any) => {
                        const value = context.parsed.y || 0;
                        const percentage = data[context.dataIndex].percentage.toFixed(1);
                        return `Sessions: ${value.toLocaleString()} (${percentage}%)`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)',
                },
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="chart-container animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Device Breakdown</h3>
            <div style={{ height: '300px' }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
}
