import React from 'react';

/**
 * Renders the clickable region pins/zones over the island map.
 * Adds slight glow highlights on hover and smooth transitions.
 */
export const RegionOverlay = ({ region, isSelected, onClick }) => {
    const cl = region.colorClasses;

    return (
        <div
            className={`
        absolute group/pin region-label ${region.animationClass} z-20 
        transition-all duration-500 ease-out cursor-none
        ${isSelected ? 'scale-125 z-50 drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]' : 'hover:scale-110 hover:z-40'}
      `}
            style={{ ...region.style, animationDelay: region.delay }}
            onClick={() => onClick(region)}
        >
            <div className="relative flex flex-col items-center cursor-pointer">
                {/* Invisible Clickable Zone - larger area for easier clicking */}
                <div className="absolute inset-[-40px] rounded-full z-10" />

                {/* Hover Ambient Glow */}
                <div
                    className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-32 h-32 rounded-full blur-[40px] mix-blend-screen pointer-events-none transition-opacity duration-300
            ${isSelected ? 'opacity-80' : 'opacity-0 group-hover/pin:opacity-40'}
          `}
                    style={{ backgroundColor: region.hex }}
                />

                {/* Label Content */}
                <div
                    className={`
            glass-hud px-4 md:px-5 py-2 md:py-2.5 rounded-xl border-l-2 
            ${cl.border} flex items-center gap-2 md:gap-3 transition-all duration-300 backdrop-blur-md
            ${isSelected
                            ? `${cl.bgSelect} shadow-[0_0_40px_${region.hex}50]`
                            : `hover:bg-black/40 hover:border-white/20`}
          `}
                >
                    <span
                        className={`
              material-symbols-outlined text-lg md:text-xl transition-all duration-300
              ${isSelected ? `${cl.text} animate-pulse scale-110 drop-shadow-[0_0_15px_${region.hex}]` : 'text-white/80'}
            `}
                    >
                        {region.icon}
                    </span>
                    <div className="text-left">
                        <h3 className={`font-display text-sm md:text-base font-bold tracking-widest uppercase leading-none mb-1 transition-colors ${isSelected ? 'text-white' : 'text-white/90'}`}>
                            {region.name}
                        </h3>
                        <p className={`text-[9px] md:text-[10px] font-mono uppercase tracking-wide opacity-80 ${isSelected ? cl.text : 'text-slate-400'}`}>
                            {region.subtitle}
                        </p>
                    </div>
                </div>

                {/* Stem Anchor */}
                <div className="flex flex-col items-center pointer-events-none">
                    <div className={`w-[2px] h-8 md:h-12 bg-gradient-to-b ${isSelected ? cl.gradTo : 'from-white/30'} to-transparent mt-1 md:mt-2 transition-all duration-300`}></div>
                    {isSelected && (
                        <div className={`absolute -bottom-1 w-6 h-6 ${cl.bgPing} rounded-full animate-ping-slow mix-blend-screen`}></div>
                    )}
                    <div className={`absolute -bottom-1 w-2.5 h-2.5 ${isSelected ? cl.bgDot : 'bg-white/50'} rounded-full shadow-[0_0_20px_${region.hex}] transition-all duration-300`}></div>
                </div>
            </div>
        </div>
    );
};
