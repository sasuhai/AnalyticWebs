'use client';

import { ContentPage } from '@/types/website';

interface TopPagesTableProps {
    pages: ContentPage[];
    title?: string;
}

export default function TopPagesTable({ pages, title = 'Top Content Pages' }: TopPagesTableProps) {
    if (!pages || pages.length === 0) {
        return (
            <div className="gradient-card p-6 rounded-xl animate-fade-in">
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <p className="text-muted-foreground text-center py-8">No data available</p>
            </div>
        );
    }

    return (
        <div className="gradient-card rounded-xl overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="text-left">Page Path</th>
                            <th className="text-right">Page Views</th>
                            <th className="text-right">Avg. Time (s)</th>
                            <th className="text-right">Bounce Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map((page, index) => (
                            <tr key={index}>
                                <td className="font-mono text-sm max-w-md truncate" title={page.path}>
                                    {page.path}
                                </td>
                                <td className="text-right font-semibold">
                                    {page.pageViews.toLocaleString()}
                                </td>
                                <td className="text-right">
                                    {page.avgTimeOnPage.toFixed(1)}
                                </td>
                                <td className="text-right">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${page.bounceRate > 70 ? 'bg-red-500/20 text-red-400' :
                                            page.bounceRate > 50 ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-green-500/20 text-green-400'
                                        }`}>
                                        {page.bounceRate.toFixed(1)}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
