import React from 'react';

/**
 * A reusable glassmorphism card component.
 * Implements "Soft elevation shadows" and "Soft border radius (12-20px)".
 */
export const GlassCard = ({ children, className = '', noPadding = false, hover = false }) => {
    return (
        <div
            className={`
        bg-black/30 backdrop-blur-[16px] 
        border border-white/10 
        rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]
        ${hover ? 'hover:bg-black/40 hover:border-white/20 transition-all duration-300' : ''}
        ${!noPadding ? 'p-4 md:p-6' : ''}
        ${className}
      `}
        >
            {children}
        </div>
    );
};
