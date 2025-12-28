'use client';

import { SearchQuery } from '@/types/website';
import { TrendingUp } from 'lucide-react';

interface SearchQueriesTableProps {
    queries: SearchQuery[];
}

export default function SearchQueriesTable({ queries }: SearchQueriesTableProps) {
    if (!queries || queries.length === 0) {
        return (
            <div className="gradient-card p-6 rounded-xl animate-fade-in">
                <h3 className="text-lg font-semibold mb-4">Top Search Queries</h3>
                <p className="text-muted-foreground text-center py-8">No data available</p>
            </div>
        );
    }

    return (
        <div className="gradient-card rounded-xl overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-border">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Top Search Queries (Google)</h3>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="text-left">Query</th>
                            <th className="text-right">Clicks</th>
                            <th className="text-right">Impressions</th>
                            <th className="text-right">CTR</th>
                            <th className="text-right">Avg. Position</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queries.map((query, index) => (
                            <tr key={index}>
                                <td className="font-medium max-w-md truncate" title={query.query}>
                                    {query.query}
                                </td>
                                <td className="text-right font-semibold text-primary">
                                    {query.clicks.toLocaleString()}
                                </td>
                                <td className="text-right text-muted-foreground">
                                    {query.impressions.toLocaleString()}
                                </td>
                                <td className="text-right">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${query.ctr > 10 ? 'bg-green-500/20 text-green-400' :
                                            query.ctr > 5 ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-red-500/20 text-red-400'
                                        }`}>
                                        {query.ctr.toFixed(2)}%
                                    </span>
                                </td>
                                <td className="text-right">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${query.position <= 3 ? 'bg-green-500/20 text-green-400' :
                                            query.position <= 10 ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        #{query.position.toFixed(1)}
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
