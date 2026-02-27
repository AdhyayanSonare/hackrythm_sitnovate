import React from 'react';

/**
 * RegionCard is the visual container for the map region label.
 * It uses the strict UI UX Master typography and token system.
 */
export const RegionCard = ({ region, isSelected, onClick }) => {
    const cl = region.colorClasses; // still using the token colors for highlighting

    return (
        <div
            className={`
        backdrop-blur-md bg-slate-900/50 border border-white/10 rounded-[16px] px-5 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)]
        transition-all duration-300 ease-in-out flex flex-col items-start cursor-pointer origin-center
        ${isSelected ? `scale-[1.05] shadow-[0_0_25px_var(--primary-accent)] border-[#4FD1C5]` : `hover:scale-[1.05] hover:border-[#4FD1C5]/50 hover:shadow-[0_0_15px_rgba(79,209,197,0.3)]`}
      `}
            onClick={(e) => {
                e.stopPropagation();
                onClick(region);
            }}
        >
            <div className="flex items-center gap-3 w-full">
                {/* Glow Icon */}
                <span
                    className={`
            material-symbols-outlined text-lg transition-all duration-300
            ${isSelected ? `text-[#4FD1C5] animate-pulse drop-shadow-[0_0_8px_#4FD1C5]` : 'text-slate-200 group-hover/pin:text-white'}
          `}
                >
                    {region.icon}
                </span>

                {/* Label text */}
                <div className="text-left flex-1">
                    <h3 className={`font-display text-sm font-bold tracking-widest uppercase mb-0.5 leading-none transition-colors ${isSelected ? 'text-white' : 'text-[var(--text-primary)]'}`}>
                        {region.name}
                    </h3>
                    <p className={`caption transition-colors ${isSelected ? 'text-[#4FD1C5]' : 'text-[var(--text-secondary)]'} opacity-80`}>
                        {region.subtitle}
                    </p>
                </div>
            </div>
        </div>
    );
};
