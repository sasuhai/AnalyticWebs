'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { TrendData } from '@/types/website';
import { format, parseISO } from 'date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface TrendChartProps {
    data: TrendData[];
    title: string;
    color?: string;
}

export default function TrendChart({ data, title, color = 'rgb(74, 222, 128)' }: TrendChartProps) {
    const chartData = {
        labels: data.map(d => {
            try {
                const dateStr = d.date;
                // GA4 format: YYYYMMDD
                if (dateStr.length === 8) {
                    const year = dateStr.substring(0, 4);
                    const month = dateStr.substring(4, 6);
                    const day = dateStr.substring(6, 8);
                    return format(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)), 'MMM dd');
                }
                return dateStr;
            } catch (error) {
                return d.date;
            }
        }),
        datasets: [
            {
                label: title,
                data: data.map(d => d.value),
                borderColor: color,
                backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                pointBackgroundColor: color,
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
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
                borderColor: color,
                borderWidth: 1,
                displayColors: false,
            },
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false,
                },
                ticks: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 10,
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
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div style={{ height: '300px' }}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}
