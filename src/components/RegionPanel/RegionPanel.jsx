import React, { useState, useEffect } from 'react';
import { GlassCard } from '../GlassContainer/GlassContainer';
import { Tabs } from '../Tabs/Tabs';

const TAB_DATA = [
    { id: 'overview', label: 'Overview' },
    { id: 'ai_brain', label: 'AI Brain' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'insights', label: 'Insights' },
    { id: 'leaderboard', label: 'Leaderboard' }
];

export const RegionPanel = ({ region, onClose }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (region) {
            setIsOpen(true);
            setActiveTab('overview');
        } else {
            setIsOpen(false);
        }
    }, [region]);

    if (!region && !isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ease-in-out"
                    onClick={onClose}
                />
            )}

            {/* Slide-in Panel from Bottom/Side */}
            <div
                className={`
          fixed bottom-0 left-0 right-0 md:left-auto md:right-0 md:top-0 md:h-full
          z-50 w-full md:w-[480px] lg:w-[540px] h-[75vh] md:h-screen
          transform transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)
          ${isOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-x-full md:translate-y-0'}
        `}
            >
                <div className="h-full w-full bg-[#050b14]/90 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative">

                    {/* Header */}
                    <div
                        className={`p-6 md:p-8 flex items-start justify-between border-b border-white/5 relative overflow-hidden bg-cover bg-center`}
                        style={{
                            backgroundImage: region?.imageUrl ? `url(${region.imageUrl})` : 'none'
                        }}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-r from-[#050b14] via-[#050b14]/90 to-${region?.hex}/20`}></div>
                        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3">
                                <span className={`material-symbols-outlined text-3xl ${region?.colorClasses?.text} animate-pulse`}>
                                    {region?.icon}
                                </span>
                                <div>
                                    <h2 className="font-display text-2xl md:text-3xl font-bold tracking-widest text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                                        {region?.name}
                                    </h2>
                                    <p className={`text-sm font-mono mt-1 tracking-wider ${region?.colorClasses?.text}`}>
                                        {region?.subtitle}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-all -m-2 relative z-10 bg-black/40 backdrop-blur-sm"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    {/* Regional Stats Bar */}
                    <div className="flex bg-[#03060c] border-b border-white/5 text-xs font-mono">
                        <div className="flex-1 p-3 border-r border-white/5 flex flex-col gap-1 items-center justify-center text-slate-400">
                            <span className="text-accent-red font-bold text-sm tracking-wider">{region?.stats?.temp}</span>
                            <span className="uppercase text-[10px] track-widest">Core Temp</span>
                        </div>
                        <div className="flex-1 p-3 border-r border-white/5 flex flex-col gap-1 items-center justify-center text-slate-400">
                            <span className="text-accent-cyan font-bold text-sm tracking-wider">{region?.stats?.weather}</span>
                            <span className="uppercase text-[10px] track-widest">Environment</span>
                        </div>
                        <div className="flex-1 p-3 flex flex-col gap-1 items-center justify-center text-slate-400">
                            <span className="text-accent-amber font-bold text-sm tracking-wider">{region?.stats?.pop}</span>
                            <span className="uppercase text-[10px] track-widest">Population</span>
                        </div>
                    </div>

                    {/* Body Content */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 styled-scrollbar min-h-0 relative">

                        <Tabs tabs={TAB_DATA} activeTab={activeTab} onChange={setActiveTab} />

                        <div className="relative w-full overflow-hidden mt-6">

                            {/* Content Transition wrapper */}
                            <div className="w-full transition-all duration-500 ease-in-out">
                                {activeTab === 'overview' && (
                                    <div className="animate-fade-in-up space-y-6">
                                        <GlassCard>
                                            <h3 className="font-display text-white font-bold tracking-wider mb-2 text-sm">System Brief</h3>
                                            <p className="text-slate-300 text-sm md:text-base leading-relaxed">{region?.overview}</p>
                                        </GlassCard>
                                        <div className="grid grid-cols-2 gap-4">
                                            <GlassCard noPadding className="p-4" hover>
                                                <h4 className="text-[10px] uppercase text-slate-500 font-mono mb-2">Network Status</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2.5 h-2.5 rounded-full ${region?.statusColor} shadow-[0_0_8px] shadow-${region?.statusColor.split('-')[1]}-500/50`}></span>
                                                    <span className="text-white font-mono text-sm tracking-widest">{region?.status}</span>
                                                </div>
                                            </GlassCard>
                                            <GlassCard noPadding className="p-4" hover>
                                                <h4 className="text-[10px] uppercase text-slate-500 font-mono mb-2">Security Level</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary text-sm animate-spin-slow">security</span>
                                                    <span className="text-white font-mono text-sm tracking-widest">LEVEL 4</span>
                                                </div>
                                            </GlassCard>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'ai_brain' && (
                                    <div className="animate-fade-in-up space-y-4">
                                        <GlassCard className="border-accent-cyan/30 bg-accent-cyan/5 relative">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-[50px] rounded-full mix-blend-screen pointer-events-none"></div>
                                            <div className="relative z-10 flex flex-col gap-4">
                                                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                                                    <h3 className="font-display text-accent-cyan font-bold tracking-wider text-sm uppercase flex items-center gap-2">
                                                        <span className="material-symbols-outlined animate-pulse text-lg">psychology</span>
                                                        Neural Link Live
                                                    </h3>
                                                    <span className="text-[10px] font-mono text-accent-cyan animate-pulse">SYNCING...</span>
                                                </div>

                                                {region?.aiFeed ? (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-[10px] text-slate-400 font-mono uppercase mb-1">Population Trajectory</h4>
                                                            <p className="text-sm text-slate-200 leading-relaxed font-body">{region.aiFeed.populationTrajectory || region.aiFeed.population}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[10px] text-slate-400 font-mono uppercase mb-1">Resource Utilization</h4>
                                                            <p className="text-sm text-slate-200 leading-relaxed font-body">{region.aiFeed.resourceUtilization || region.aiFeed.resources}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[10px] text-slate-400 font-mono uppercase mb-1">Geopolitical & Events</h4>
                                                            <p className="text-sm text-slate-200 leading-relaxed font-body">{region.aiFeed.geopoliticalRelations || region.aiFeed.diplomacy || region.aiFeed.geopolitics}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="py-8 flex flex-col items-center justify-center text-center text-slate-500">
                                                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">smart_toy</span>
                                                        <p className="text-sm font-mono">Awaiting Regional Synthesis...</p>
                                                        <p className="text-[10px] mt-1">Start engine to initiate logic feed.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'challenges' && (
                                    <div className="animate-fade-in-up space-y-4">
                                        <GlassCard className="border-accent-amber/30 bg-accent-amber/5">
                                            <div className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-accent-amber animate-pulse mt-0.5">warning</span>
                                                <div>
                                                    <h3 className="font-display text-accent-amber font-bold tracking-wider mb-2 text-sm uppercase">Active Threats</h3>
                                                    <p className="text-slate-300 text-sm leading-relaxed">{region?.challenges}</p>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'simulation' && (
                                    <div className="animate-fade-in-up space-y-4">
                                        <GlassCard className="border-accent-cyan/30 bg-accent-cyan/5 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-cyan/10 blur-[50px] rounded-full mix-blend-screen pointer-events-none"></div>
                                            <div className="flex items-start gap-3 relative z-10">
                                                <span className="material-symbols-outlined text-accent-cyan animate-spin-slow mt-0.5">memory</span>
                                                <div>
                                                    <h3 className="font-display text-accent-cyan font-bold tracking-wider mb-2 text-sm uppercase">Simulated Output</h3>
                                                    <p className="text-slate-300 text-sm leading-relaxed font-mono">{region?.simulation}</p>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'insights' && (
                                    <div className="animate-fade-in-up space-y-4">
                                        <GlassCard className="border-primary/30 bg-primary/5">
                                            <div className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-primary mt-0.5">lightbulb</span>
                                                <div>
                                                    <h3 className="font-display text-primary font-bold tracking-wider mb-2 text-sm uppercase">Intel Report</h3>
                                                    <p className="text-slate-300 text-sm leading-relaxed">{region?.insights}</p>
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </div>
                                )}

                                {activeTab === 'leaderboard' && (
                                    <div className="animate-fade-in-up space-y-2">
                                        {[1, 2, 3, 4, 5].map((item) => (
                                            <GlassCard key={item} noPadding className="px-4 py-3 flex items-center justify-between" hover>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-mono text-slate-500 w-4">{item}</span>
                                                    <span className="font-bold text-white tracking-widest text-sm">OPERATIVE_{item}9X</span>
                                                </div>
                                                <span className="text-accent-cyan font-mono text-sm">{Math.floor(Math.random() * 5000 + 1000)} PTS</span>
                                            </GlassCard>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="p-6 md:p-8 bg-[#03060c] border-t border-white/5">
                        <button className="w-full glass-hud px-6 py-4 rounded-xl border border-primary text-white font-display font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center gap-3 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                            <span className="material-symbols-outlined text-accent-cyan group-hover:animate-pulse relative z-10">flight_takeoff</span>
                            <span className="relative z-10">INITIATE DESCENT</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
