import React, { useEffect, useState } from 'react';
import { RegionOverlay } from '../RegionOverlay/RegionOverlay';

/**
 * Island component that sets the full-screen background image.
 * Renders region overlays on top.
 * Handles smooth zoom-in on load and zoom-in based on clicked region.
 */
export const Island = ({ regions, selectedRegion, onRegionClick }) => {
    const [hasLoaded, setHasLoaded] = useState(false);
    const ISLAND_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuB23YbdFaKzmSd0tCf4aqcC3vyDJX9TzdUi79v6eTK-8WZRiBNVg7YD1alyqbmuSDSk0at-12MGu51F03U_q9WWk_BMbD7UPw3AFIH-tA2M0SlkF_jr1WOyivfs5rSatwmTlmmflMjy1ygR_a73jHCfny2-1GDGkbsXUO98MME3t9qY-YCnmInnjNAHzCd-nMT9WLD36Qkd2Ds43YxOHBIE_91Buuog5Kj4CPdx_Lmxg2IIsPzNE7QYjN-m_fQolC0PZ5tRgELlvQ";

    useEffect(() => {
        // Zoom in animation on initial load
        setTimeout(() => setHasLoaded(true), 100);
    }, []);

    // Compute transform based on whether a region is selected to create a zoom pan effect
    const getTransform = () => {
        if (!hasLoaded) return 'scale(1.2) translate(0, 0)';
        if (!selectedRegion) return 'scale(1.0) translate(0, 0)';

        // Zoom in toward the region...
        // The image itself is background size cover.
        // If we scale the container, we want to translate oppositely to where the selected region is.
        // Let's create a subtle zoom effect.
        // Find how far the region's origin is from center (50%)
        const top = parseFloat(selectedRegion.style.top || selectedRegion.style.bottom);
        const isBottom = !!selectedRegion.style.bottom;
        const yPercent = isBottom ? (100 - top) : top;

        // Convert 0-100 to -1 to 1 space relative to center, then scale down
        // Actually, just a simple scale is usually enough for a subtle zoom,
        // let's do an origin based zoom.
        const transformOriginX = selectedRegion.style.left || selectedRegion.style.right;
        const isRight = !!selectedRegion.style.right;

        return {
            transform: 'scale(1.15)',
            transformOrigin: `${isRight ? 'calc(100% - ' + transformOriginX + ')' : transformOriginX} ${yPercent}%`
        };
    };

    const transformProps = selectedRegion ? getTransform() : { transform: hasLoaded ? 'scale(1.0)' : 'scale(1.1)', transformOrigin: 'center center' };

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050b14]">
            {/* Container that handles the zoom scale and pan */}
            <div
                className="absolute inset-0 w-full h-full transition-transform duration-[1500ms] cubic-bezier(0.16, 1, 0.3, 1)"
                style={{ ...transformProps }}
            >
                {/* The Hero Island Image Background */}
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        backgroundImage: `url('${ISLAND_IMAGE}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        // Increase contract slightly to make it pop like the original interactive-map
                        filter: 'contrast(1.1) brightness(1.1) drop-shadow(0 20px 50px rgba(0,0,0,0.8))'
                    }}
                />

                {/* Subtle Dark Gradient Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050b14]/90 via-transparent to-[#050b14]/50 mix-blend-multiply pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#050b14]/60 via-transparent to-[#050b14]/60 mix-blend-multiply pointer-events-none" />

                {/* Map Regions Container */}
                <div className="relative w-full h-full max-w-[1920px] mx-auto overflow-hidden group">

                    {/* Central radial blur */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-[#6366f1]/10 blur-[150px] rounded-full pointer-events-none transition-all duration-700" />

                    {regions.map((region) => (
                        <RegionOverlay
                            key={region.id}
                            region={region}
                            isSelected={selectedRegion?.id === region.id}
                            onClick={onRegionClick}
                        />
                    ))}
                </div>
            </div>

            {/* Additional ambient overlay effects that don't scale */}
            <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] pointer-events-none" />
            <div
                className="absolute inset-0 pointer-events-none z-0 mix-blend-screen"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '100px 100px'
                }}
            />
            {/* Ambient background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full opacity-30 animate-pulse-slow blur-[1px]"></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-[#6366f1] rounded-full opacity-50 animate-ping-slow"></div>
                <div className="absolute bottom-[20%] left-[10%] w-2 h-2 bg-[#22d3ee] rounded-full opacity-20 animate-pulse-slow delay-700 blur-[2px]"></div>
                <div className="absolute top-[15%] right-[20%] w-1.5 h-1.5 bg-[#4ade80] rounded-full opacity-40 animate-pulse delay-300"></div>
            </div>
        </div>
    );
};
