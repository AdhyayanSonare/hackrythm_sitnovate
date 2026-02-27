import React from 'react';

export const GlassContainer = ({ children, className = '', hover = false, onClick }) => {
    return (
        <div
            className={`glass-container p-4 md:p-6 ${hover ? 'hover:scale-[1.02] hover:border-primary/50 hover:shadow-[0_0_20px_rgba(79,209,197,0.2)] transition-all duration-300 cursor-pointer' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

export const GlassCard = ({ children, className = '', hover = true, onClick, noPadding = false }) => {
    return (
        <div
            className={`glass-card ${noPadding ? '' : 'px-5 py-3'} ${className} ${hover ? '' : 'hover:scale-100 hover:border-white/12 hover:shadow-none pointer-events-none'}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
