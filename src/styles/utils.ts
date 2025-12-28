// Common style patterns used across components

export const cardStyles = "bg-[#1a1a1a] border border-[#282828] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300 hover:border-[#4ade80] hover:shadow-[0_8px_32px_rgba(74,222,128,0.15)]";

export const gradientBg = "bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#0a0a0a]";

export const metricCardStyles = `${cardStyles} p-6 hover:translate-y-[-2px]`;

export const chartContainerStyles = `${cardStyles} p-6`;

export const buttonPremiumStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-br from-[#4ade80] to-[#16a34a] text-[#052e16] shadow-[0_4px_14px_rgba(74,222,128,0.4)] hover:shadow-[0_6px_20px_rgba(74,222,128,0.6)] hover:translate-y-[-2px]";

export const skeletonStyles = "animate-pulse bg-[#282828] rounded";

export const badgeStyles = "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-br from-[#4ade80] to-[#16a34a] text-[#052e16]";

export const tableStyles = {
    table: "w-full",
    thead: "border-b border-[#282828]",
    th: "px-4 py-3 text-left text-xs font-semibold text-[#6b7280] uppercase tracking-wider",
    td: "px-4 py-4 text-sm",
    tr: "border-b border-[#282828] transition-colors duration-200 hover:bg-[#1a1a1a]/50",
};
