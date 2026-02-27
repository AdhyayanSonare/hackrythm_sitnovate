import React, { useState, useEffect } from 'react';
import { GlassContainer } from '../GlassContainer/GlassContainer';

export const HUD = ({ turn, isRunning, isSimulating, toggleSimulation }) => {
    const [time, setTime] = useState('');

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

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
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]" />
                            System Online
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
            </GlassContainer>
        </div>
    );
};
