import { Website } from '@/types/website';

/**
 * Configure your websites here
 * 
 * To add a new website:
 * 1. Add a new object to this array
 * 2. Provide the domain, GA4 Property ID, and Search Console property
 * 3. Set enabled to true
 * 
 * How to get your GA4 Property ID:
 * - Go to Google Analytics > Admin > Property Settings
 * - The Property ID is shown at the top (format: 123456789)
 * 
 * How to get your Search Console property:
 * - Go to Google Search Console
 * - The property URL is shown in the property selector
 * - Use the full URL (e.g., https://example.com or sc-domain:example.com)
 */
export const websites: Website[] = [
    {
        id: 'familylinx',
        name: 'FamilyLinX',
        domain: 'familylinx-a03dc.web.app',
        ga4PropertyId: '515341643',
        searchConsoleProperty: 'https://familylinx-a03dc.web.app',
        enabled: true,
    },
    {
        id: 'mindful-consulting',
        name: 'Mindful Consulting',
        domain: 'mindfulconsulting-538b9.web.app',
        ga4PropertyId: '517345741',
        searchConsoleProperty: 'https://mindfulconsulting-538b9.web.app',
        enabled: true,
    },
    // Add more websites as needed
];

export const getEnabledWebsites = (): Website[] => {
    return websites.filter((website) => website.enabled);
};

export const getWebsiteById = (id: string): Website | undefined => {
    return websites.find((website) => website.id === id);
};
