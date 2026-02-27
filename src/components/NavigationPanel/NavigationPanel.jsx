import React from 'react';
import { formatPop } from '../../engine/simulationEngine';

export const NavigationPanel = ({ regionsData, selectedRegion, onRegionClick }) => {
    return (
        <div className={`absolute bottom-0 right-0 p-6 md:p-8 z-40 hidden md:flex flex-col items-end gap-3 pointer-events-none transition-transform duration-500 ease-out 
      ${selectedRegion ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
    `}>
            <h3 className="caption text-[var(--text-secondary)] border-b border-[var(--glass-border)] pb-1 w-full text-right drop-shadow-md">
                Sector Navigation
            </h3>
            <div className="flex flex-col gap-2 w-56 pointer-events-auto">
                {regionsData.map((r) => {
                    const isSelected = selectedRegion?.id === r.id;
                    const hasSim = !!r.simState;
                    return (
                        <div
                            key={r.id}
                            onClick={() => onRegionClick(r)}
                            className={`
                px-3 py-2.5 rounded-xl border-l-2 flex items-center justify-between cursor-pointer transition-all duration-300 backdrop-blur-md bg-[var(--glass-bg)]
                ${isSelected
                                    ? 'border-[#4FD1C5] bg-[#4FD1C5]/10 shadow-[0_0_15px_rgba(79,209,197,0.3)]'
                                    : 'border-transparent hover:border-white/20 hover:bg-black/40'}
              `}
                        >
                            <div className="flex flex-col flex-1 min-w-0 pr-2">
                                <span className={`text-[11px] font-bold uppercase tracking-wide truncate ${isSelected ? 'text-white' : 'text-[var(--text-secondary)]'}`}>
                                    {r.name}
                                </span>
                                {hasSim && (
                                    <span className="text-[9px] font-mono text-slate-500 truncate">
                                        {formatPop(r.simState.population)} · {(r.simState.stabilityIndex * 100).toFixed(0)}%
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <span className={`w-1.5 h-1.5 rounded-full ${r.statusColor}`}></span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
