import React, { useState, useEffect } from 'react';
import { GlassContainer } from '../GlassContainer/GlassContainer';
import { formatGDP, formatResource } from '../../engine/simulationEngine';

export const HUD = ({ turn, isRunning, isSimulating, toggleSimulation, globalMetrics, eventLog }) => {
    const [time, setTime] = useState('');

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const stabilityPct = globalMetrics ? (globalMetrics.globalStability * 100).toFixed(1) : '—';
    const stabilityColor = globalMetrics
        ? globalMetrics.globalStability >= 0.7 ? 'text-accent-green' : globalMetrics.globalStability >= 0.4 ? 'text-accent-amber' : 'text-accent-red'
        : 'text-slate-400';

    return (
        <div className="absolute top-0 left-0 p-6 md:p-8 z-40 w-full md:max-w-sm pointer-events-none">
            <GlassContainer className="pointer-events-auto flex flex-col gap-4">
                {/* Header Branding */}
                <div className="flex items-center gap-3 border-b border-[var(--glass-border)] pb-4">
                    <div className="w-10 h-10 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center text-[var(--primary-accent)] shadow-[0_0_15px_rgba(79,209,197,0.2)]">
                        <span className="material-symbols-outlined text-xl animate-spin-slow">public</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="h2 tracking-widest uppercase flex items-center gap-2 m-0 leading-none">
                            Aethelgard
                            <span className="bg-[#4FD1C5]/20 text-[#4FD1C5] border border-[#4FD1C5]/50 px-1.5 py-0.5 rounded text-[10px] font-mono leading-none">
                                V.3.2
                            </span>
                        </h1>
                        <p className="caption text-[var(--text-secondary)] mt-1 flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_#4ade80] ${isRunning ? 'bg-green-400' : 'bg-slate-500'}`} />
                            {isRunning ? 'Simulation Active' : 'System Idle'}
                        </p>
                    </div>
                </div>

                {/* Time and Simulation Box */}
                <div className="flex gap-3">
                    {/* Time Module */}
                    <div className="flex-1 bg-black/30 rounded-xl p-3 border border-white/5 flex flex-col justify-between">
                        <span className="caption text-[var(--text-secondary)]">Local Time</span>
                        <span className="font-mono text-xl text-white tracking-widest">{time || '00:00:00'}</span>
                    </div>

                    {/* Action Module */}
                    <button
                        onClick={toggleSimulation}
                        className={`flex-1 border rounded-xl p-3 flex flex-col justify-between items-start transition-colors group cursor-pointer ${isRunning
                            ? 'bg-accent-red/10 border-accent-red/40 hover:bg-accent-red/20'
                            : 'bg-[#4FD1C5]/10 border-[#4FD1C5]/40 hover:bg-[#4FD1C5]/20'
                            }`}
                    >
                        <span className={`caption flex items-center gap-1 ${isRunning ? 'text-accent-red' : 'text-[#4FD1C5]'}`}>
                            <span className={`material-symbols-outlined text-sm ${isRunning && !isSimulating ? 'animate-pulse' : isSimulating ? 'animate-spin' : ''}`}>
                                {isRunning ? (isSimulating ? 'sync' : 'stop_circle') : 'play_arrow'}
                            </span>
                            {isRunning ? (isSimulating ? 'Processing...' : 'Stop Engine') : 'Start Engine'}
                        </span>
                        <div className="flex items-center justify-between w-full">
                            <span className="font-mono text-lg text-white">T-{turn}</span>
                            {isRunning && (
                                <span className="text-[9px] uppercase tracking-widest text-[var(--accent-red)] animate-pulse">Running</span>
                            )}
                        </div>
                    </button>
                </div>

                {/* Global Metrics (shown when simulation has run at least 1 turn) */}
                {globalMetrics && (
                    <div className="border-t border-[var(--glass-border)] pt-3 flex flex-col gap-2">
                        <span className="caption text-[var(--text-secondary)] flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">monitoring</span>
                            Global Metrics
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                                <span className="text-[9px] uppercase text-slate-500 font-mono block">World GDP</span>
                                <span className="font-mono text-sm text-accent-green">{formatGDP(globalMetrics.totalGDP)}</span>
                            </div>
                            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                                <span className="text-[9px] uppercase text-slate-500 font-mono block">Stability</span>
                                <span className={`font-mono text-sm ${stabilityColor}`}>{stabilityPct}%</span>
                            </div>
                            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                                <span className="text-[9px] uppercase text-slate-500 font-mono flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px] text-blue-400">water_drop</span>Water
                                </span>
                                <span className="font-mono text-xs text-blue-300">{formatResource(globalMetrics.globalResourceLevels.water)}</span>
                            </div>
                            <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                                <span className="text-[9px] uppercase text-slate-500 font-mono flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px] text-green-400">restaurant</span>Food
                                </span>
                                <span className="font-mono text-xs text-green-300">{formatResource(globalMetrics.globalResourceLevels.food)}</span>
                            </div>
                        </div>

                        {/* Recent Events Ticker */}
                        {eventLog && eventLog.length > 0 && (
                            <div className="bg-black/30 rounded-lg p-2 border border-white/5 max-h-20 overflow-y-auto hide-scrollbar">
                                <span className="text-[9px] uppercase text-slate-500 font-mono block mb-1">Recent Events</span>
                                {eventLog.slice(0, 3).map((evt, i) => (
                                    <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono leading-relaxed">
                                        <span className={`w-1 h-1 rounded-full shrink-0 ${evt.type === 'Technological Breakthrough' ? 'bg-accent-green' : 'bg-accent-red'}`} />
                                        <span className="text-slate-400 truncate">T{evt.turn}: {evt.type} → {evt.affectedRegion || evt.regionTarget}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </GlassContainer>
        </div>
    );
};
