import React, { useState } from 'react';

/**
 * A reusable resilient Tabs component
 * Features horizontally scrollable, active indicator, smooth transitions.
 */
export const Tabs = ({ tabs, activeTab, onChange }) => {
    return (
        <div className="w-full mb-4 border-b border-white/10 overflow-x-auto hide-scrollbar">
            <div className="flex w-max min-w-full space-x-2 md:space-x-8 px-2 md:px-0 relative">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={`
                relative py-3 px-2 md:px-4 text-xs md:text-sm font-display font-medium uppercase tracking-wider
                transition-all duration-300 whitespace-nowrap
                ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}
              `}
                        >
                            {tab.label}
                            {/* Active Indicator Underline */}
                            <div
                                className={`
                  absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary to-accent-cyan
                  transform origin-left transition-transform duration-300 ease-out
                  ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}
                `}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
