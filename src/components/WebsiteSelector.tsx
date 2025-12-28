'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Website {
    id: string;
    name: string;
    domain: string;
}

interface WebsiteSelectorProps {
    selectedWebsiteId: string | null;
    onSelect: (websiteId: string) => void;
}

export default function WebsiteSelector({ selectedWebsiteId, onSelect }: WebsiteSelectorProps) {
    const [websites, setWebsites] = useState<Website[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWebsites();
    }, []);

    const fetchWebsites = async () => {
        try {
            const response = await fetch('/api/websites');
            const data = await response.json();
            setWebsites(data.websites || []);

            // Auto-select first website if none selected
            if (!selectedWebsiteId && data.websites && data.websites.length > 0) {
                onSelect(data.websites[0].id);
            }
        } catch (error) {
            console.error('Error fetching websites:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectedWebsite = websites.find(w => w.id === selectedWebsiteId);

    if (loading) {
        return (
            <div className="w-full max-w-md">
                <div className="skeleton h-14 w-full rounded-lg"></div>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full gradient-card px-6 py-4 flex items-center justify-between hover:scale-[1.02] transition-transform duration-200"
            >
                <div className="flex flex-col items-start">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Selected Website
                    </span>
                    <span className="text-lg font-semibold">
                        {selectedWebsite ? selectedWebsite.name : 'Select a website'}
                    </span>
                    {selectedWebsite && (
                        <span className="text-sm text-muted-foreground">{selectedWebsite.domain}</span>
                    )}
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#4ade80] rounded-lg overflow-hidden z-50 animate-fade-in shadow-[0_8px_32px_rgba(74,222,128,0.2)]">
                    {websites.map((website) => (
                        <button
                            key={website.id}
                            onClick={() => {
                                onSelect(website.id);
                                setIsOpen(false);
                            }}
                            className={`w-full px-6 py-4 text-left transition-colors duration-200 hover:bg-[#282828] ${selectedWebsiteId === website.id ? 'bg-[#282828]' : ''
                                }`}
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold">{website.name}</span>
                                <span className="text-sm text-muted-foreground">{website.domain}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
