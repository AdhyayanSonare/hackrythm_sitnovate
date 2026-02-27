import React, { useState, useEffect } from 'react';
import { RegionOverlayLayer } from '../RegionOverlayLayer/RegionOverlayLayer';

export const IslandCanvas = ({ regions, selectedRegion, onRegionClick, cursorPos }) => {
    const [hasLoaded, setHasLoaded] = useState(false);
    const ISLAND_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuB23YbdFaKzmSd0tCf4aqcC3vyDJX9TzdUi79v6eTK-8WZRiBNVg7YD1alyqbmuSDSk0at-12MGu51F03U_q9WWk_BMbD7UPw3AFIH-tA2M0SlkF_jr1WOyivfs5rSatwmTlmmflMjy1ygR_a73jHCfny2-1GDGkbsXUO98MME3t9qY-YCnmInnjNAHzCd-nMT9WLD36Qkd2Ds43YxOHBIE_91Buuog5Kj4CPdx_Lmxg2IIsPzNE7QYjN-m_fQolC0PZ5tRgELlvQ";

    useEffect(() => {
        setTimeout(() => setHasLoaded(true), 150);
    }, []);

    // Calculate mouse parallax movement
    // X and Y ranging from -1 to 1 based on screen size
    const px = (cursorPos.x / (typeof window !== 'undefined' ? window.innerWidth : 1)) * 2 - 1;
    const py = (cursorPos.y / (typeof window !== 'undefined' ? window.innerHeight : 1)) * 2 - 1;

    // Max translate offset in pixels
    const PARALLAX_OFFSET = 15;

    const getTransform = () => {
        // Starting zoom -> load zoom
        if (!hasLoaded) return 'scale(1.05) translate(0px, 0px)';

        // Slight parallax
        const tx = -px * PARALLAX_OFFSET;
        const ty = -py * PARALLAX_OFFSET;

        return `scale(1.02) translate(${tx}px, ${ty}px)`;
    };

    return (
        <div className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-1000 ${hasLoaded ? 'opacity-100' : 'opacity-0'}`}>

            {/* Container that handles the subtle parallax scale and pan */}
            <div
                className="absolute inset-0 w-full h-full transition-transform duration-200 ease-out"
                style={{ transform: getTransform() }}
            >
                {/* Clean, Vibrant Hero Image */}
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('${ISLAND_IMAGE}')`,
                        filter: 'contrast(1.05) brightness(1.05)'
                    }}
                />

                {/* Subtle top-down overlay for text readability without killing vibrance */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.45) 100%)'
                    }}
                />

                {/* Central Core Ambient Gentle Glow */}
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[35%] h-[35%] bg-accent-red/10 blur-[100px] rounded-full pointer-events-none mix-blend-screen animate-pulse-slow" />

                {/* Map Regions Container */}
                <div className="relative w-full h-full max-w-[1440px] mx-auto overflow-hidden pointer-events-auto">
                    {regions.map((region) => (
                        <RegionOverlayLayer
                            key={region.id}
                            region={region}
                            isSelected={selectedRegion?.id === region.id}
                            onClick={onRegionClick}
                        />
                    ))}
                </div>
            </div>

            {/* Soft Particles & Grid - minimal overlay */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-screen opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)',
                    backgroundSize: '80px 80px'
                }}
            />

            {/* Ambient floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[25%] left-[25%] w-1.5 h-1.5 bg-primary rounded-full opacity-40 animate-float-slow blur-[1px]"></div>
                <div className="absolute top-[75%] right-[25%] w-2 h-2 bg-secondary rounded-full opacity-30 animate-float-medium blur-[2px]"></div>
                <div className="absolute bottom-[20%] left-[10%] w-2.5 h-2.5 bg-accent-cyan rounded-full opacity-20 animate-float-fast delay-700 blur-[3px]"></div>
                <div className="absolute top-[15%] right-[20%] w-1 h-1 bg-white rounded-full opacity-50 animate-pulse delay-300"></div>
            </div>
        </div>
    );
};
