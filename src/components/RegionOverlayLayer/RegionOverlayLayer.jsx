import React from 'react';
import { RegionCard } from '../RegionCard/RegionCard';

export const RegionOverlayLayer = ({ region, isSelected, onClick }) => {
    return (
        <div
            className={`absolute z-20 group/pin transition-all duration-[600ms] ease-out pointer-events-auto
        ${isSelected ? 'z-50' : 'hover:z-40'}
      `}
            style={{
                ...region.style,
                animation: `float-medium 6s ease-in-out infinite`,
                animationDelay: region.delay
            }}
        >
            <div className="relative flex flex-col items-center">
                {/* Invisible hit box for easier clicking */}
                <div
                    className="absolute inset-[-50px] rounded-full z-10 cursor-pointer"
                    onClick={() => onClick(region)}
                />

                {/* Region Label Card */}
                <RegionCard region={region} isSelected={isSelected} onClick={onClick} />

                {/* Stem Anchor to point exactly at the map location */}
                <div className="flex flex-col items-center pointer-events-none origin-top transition-transform duration-300">
                    <div className="w-[1.5px] h-8 md:h-12 bg-gradient-to-b from-[rgba(255,255,255,0.4)] to-transparent mt-1"></div>
                    {isSelected && (
                        <div className="absolute -bottom-1 w-6 h-6 bg-[#4FD1C5]/40 rounded-full animate-ping-slow mix-blend-screen"></div>
                    )}
                    <div className={`absolute -bottom-1 w-2.5 h-2.5 ${isSelected ? 'bg-[#4FD1C5]' : 'bg-white/60'} rounded-full shadow-[0_0_20px_rgba(79,209,197,0.8)] transition-all duration-300`}></div>
                </div>
            </div>
        </div>
    );
};
