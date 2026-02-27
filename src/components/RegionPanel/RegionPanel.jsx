import React, { useState, useEffect } from 'react';
import { GlassCard } from '../GlassContainer/GlassContainer';
import { Tabs } from '../Tabs/Tabs';
import { formatGDP, formatPop, formatResource } from '../../engine/simulationEngine';

const TAB_DATA = [
    { id: 'overview', label: 'Overview' },
    { id: 'ai_brain', label: 'AI Brain' },
    { id: 'resources', label: 'Resources' },
    { id: 'simulation', label: 'Simulation' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'leaderboard', label: 'Leaderboard' },
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
          z-50 w-full md:w-120 lg:w-135 h-[75vh] md:h-screen
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

                    {/* Regional Stats Bar — live from simulation */}
                    <div className="flex bg-[#03060c] border-b border-white/5 text-xs font-mono">
                        <div className="flex-1 p-3 border-r border-white/5 flex flex-col gap-1 items-center justify-center text-slate-400">
                            <span className="text-accent-amber font-bold text-sm tracking-wider">
                                {region?.simState ? formatPop(region.simState.population) : region?.stats?.pop}
                            </span>
                            <span className="uppercase text-[10px] tracking-widest">Population</span>
                        </div>
                        <div className="flex-1 p-3 border-r border-white/5 flex flex-col gap-1 items-center justify-center text-slate-400">
                            <span className="text-accent-green font-bold text-sm tracking-wider">
                                {region?.simState ? formatGDP(region.simState.GDP) : '—'}
                            </span>
                            <span className="uppercase text-[10px] tracking-widest">GDP</span>
                        </div>
                        <div className="flex-1 p-3 flex flex-col gap-1 items-center justify-center text-slate-400">
                            <span className={`font-bold text-sm tracking-wider ${region?.simState
                                ? region.simState.stabilityIndex >= 0.7 ? 'text-accent-green' : region.simState.stabilityIndex >= 0.4 ? 'text-accent-amber' : 'text-accent-red'
                                : 'text-accent-cyan'}`}>
                                {region?.simState ? (region.simState.stabilityIndex * 100).toFixed(1) + '%' : region?.stats?.temp}
                            </span>
                            <span className="uppercase text-[10px] tracking-widest">Stability</span>
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
                                                    <span className={`w-2.5 h-2.5 rounded-full ${region?.statusColor}`}></span>
                                                    <span className="text-white font-mono text-sm tracking-widest">{region?.status}</span>
                                                </div>
                                            </GlassCard>
                                            <GlassCard noPadding className="p-4" hover>
                                                <h4 className="text-[10px] uppercase text-slate-500 font-mono mb-2">Environment</h4>
                                                <div className="flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-primary text-sm">{region?.icon}</span>
                                                    <span className="text-white font-mono text-sm tracking-widest">{region?.stats?.temp} · {region?.stats?.weather}</span>
                                                </div>
                                            </GlassCard>
                                        </div>
                                        {/* Active Events */}
                                        {region?.simState?.activeEvents?.length > 0 && (
                                            <GlassCard className="border-accent-amber/20">
                                                <h4 className="text-[10px] uppercase text-accent-amber font-mono mb-2 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">bolt</span>
                                                    Active Events
                                                </h4>
                                                <div className="space-y-1">
                                                    {region.simState.activeEvents.map((evt, i) => (
                                                        <div key={i} className="flex items-center justify-between text-xs font-mono">
                                                            <span className="text-slate-300">{evt.type}</span>
                                                            <span className="text-slate-500">Severity {evt.severity} · {evt.duration}T left</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </GlassCard>
                                        )}
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
                                                    <span className={`text-[10px] font-mono ${region?.aiFeed ? 'text-accent-green' : 'text-accent-cyan animate-pulse'}`}>
                                                        {region?.aiFeed ? 'CONNECTED' : 'AWAITING...'}
                                                    </span>
                                                </div>

                                                {region?.aiFeed ? (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <h4 className="text-[10px] text-slate-400 font-mono uppercase mb-1">Population Trajectory</h4>
                                                            <p className="text-sm text-slate-200 leading-relaxed font-body">{region.aiFeed.populationTrajectory}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[10px] text-slate-400 font-mono uppercase mb-1">Resource Utilization</h4>
                                                            <p className="text-sm text-slate-200 leading-relaxed font-body">{region.aiFeed.resourceUtilization}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[10px] text-slate-400 font-mono uppercase mb-1">Geopolitical & Events</h4>
                                                            <p className="text-sm text-slate-200 leading-relaxed font-body">{region.aiFeed.geopoliticalRelations}</p>
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

                                {activeTab === 'resources' && (
                                    <div className="animate-fade-in-up space-y-4">
                                        {region?.simState ? (
                                            <>
                                                {/* Resource Bars */}
                                                {[
                                                    { key: 'water', label: 'Water Reserves', icon: 'water_drop', color: 'bg-blue-400', textColor: 'text-blue-400', value: region.simState.resourceStock.water, max: 150000 },
                                                    { key: 'food', label: 'Food Stock', icon: 'restaurant', color: 'bg-green-400', textColor: 'text-green-400', value: region.simState.resourceStock.food, max: 120000 },
                                                    { key: 'energy', label: 'Energy Grid', icon: 'bolt', color: 'bg-amber-400', textColor: 'text-amber-400', value: region.simState.resourceStock.energy, max: 150000 },
                                                ].map(res => {
                                                    const pct = Math.min(100, (res.value / res.max) * 100);
                                                    return (
                                                        <GlassCard key={res.key}>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className={`text-[10px] uppercase font-mono flex items-center gap-1 ${res.textColor}`}>
                                                                    <span className="material-symbols-outlined text-xs">{res.icon}</span>
                                                                    {res.label}
                                                                </h4>
                                                                <span className="text-white font-mono text-sm">{formatResource(res.value)}</span>
                                                            </div>
                                                            <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full ${res.color} rounded-full transition-all duration-700 ease-out`}
                                                                    style={{ width: `${pct}%` }}
                                                                />
                                                            </div>
                                                        </GlassCard>
                                                    );
                                                })}

                                                {/* Infrastructure & Tech */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <GlassCard noPadding className="p-4">
                                                        <h4 className="text-[10px] uppercase text-slate-500 font-mono mb-1">Infrastructure</h4>
                                                        <span className="text-white font-mono text-lg">{region.simState.infrastructureLevel.toFixed(1)}</span>
                                                        <span className="text-slate-500 text-xs font-mono">/10</span>
                                                    </GlassCard>
                                                    <GlassCard noPadding className="p-4">
                                                        <h4 className="text-[10px] uppercase text-slate-500 font-mono mb-1">Technology</h4>
                                                        <span className="text-white font-mono text-lg">{region.simState.technologyLevel.toFixed(1)}</span>
                                                        <span className="text-slate-500 text-xs font-mono">/10</span>
                                                    </GlassCard>
                                                </div>

                                                {/* Trade Partners */}
                                                {region.simState.tradePartners?.length > 0 && (
                                                    <GlassCard className="border-primary/20">
                                                        <h4 className="text-[10px] uppercase text-primary font-mono mb-2 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-xs">swap_horiz</span>
                                                            Active Trade
                                                        </h4>
                                                        {region.simState.tradePartners.map((tp, i) => (
                                                            <div key={i} className="flex items-center justify-between text-xs font-mono">
                                                                <span className="text-slate-300">{tp.terms}</span>
                                                                <span className="text-slate-500">{formatResource(tp.volume)} units → {tp.partnerRegion}</span>
                                                            </div>
                                                        ))}
                                                    </GlassCard>
                                                )}
                                            </>
                                        ) : (
                                            <GlassCard>
                                                <div className="py-8 flex flex-col items-center justify-center text-center text-slate-500">
                                                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">inventory_2</span>
                                                    <p className="text-sm font-mono">No resource data yet.</p>
                                                    <p className="text-[10px] mt-1">Start the simulation engine.</p>
                                                </div>
                                            </GlassCard>
                                        )}
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
                                        {/* Active sim events as challenges */}
                                        {region?.simState?.activeEvents?.length > 0 && (
                                            <GlassCard className="border-accent-red/20 bg-accent-red/5">
                                                <h4 className="text-[10px] uppercase text-accent-red font-mono mb-2 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs animate-pulse">crisis_alert</span>
                                                    Live Crisis Events
                                                </h4>
                                                <div className="space-y-2">
                                                    {region.simState.activeEvents.map((evt, i) => (
                                                        <div key={i} className="bg-black/30 rounded-lg p-2.5 border border-white/5 flex items-center justify-between">
                                                            <div>
                                                                <span className="text-white text-sm font-mono">{evt.type}</span>
                                                                <span className="text-slate-500 text-[10px] font-mono ml-2">SEV-{evt.severity}</span>
                                                            </div>
                                                            <span className="text-accent-amber text-[10px] font-mono">{evt.duration}T remaining</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </GlassCard>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'leaderboard' && (
                                    <div className="animate-fade-in-up space-y-2">
                                        <GlassCard className="mb-4">
                                            <h4 className="text-[10px] uppercase text-slate-500 font-mono mb-2">Region Performance Score</h4>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-accent-cyan font-mono text-2xl font-bold">
                                                    {region?.simState ? Math.floor(
                                                        region.simState.stabilityIndex * 2000 +
                                                        (region.simState.GDP / 1000000) * 100 +
                                                        region.simState.infrastructureLevel * 50 +
                                                        region.simState.technologyLevel * 50
                                                    ) : '—'}
                                                </span>
                                                <span className="text-slate-500 text-xs font-mono">PTS</span>
                                            </div>
                                        </GlassCard>
                                        {[
                                            { label: 'Stability Score', value: region?.simState ? (region.simState.stabilityIndex * 2000).toFixed(0) : '—' },
                                            { label: 'Economic Score', value: region?.simState ? ((region.simState.GDP / 1000000) * 100).toFixed(0) : '—' },
                                            { label: 'Infrastructure Score', value: region?.simState ? (region.simState.infrastructureLevel * 50).toFixed(0) : '—' },
                                            { label: 'Technology Score', value: region?.simState ? (region.simState.technologyLevel * 50).toFixed(0) : '—' },
                                        ].map((item, idx) => (
                                            <GlassCard key={idx} noPadding className="px-4 py-3 flex items-center justify-between" hover>
                                                <div className="flex items-center gap-4">
                                                    <span className="font-mono text-slate-500 w-4">{idx + 1}</span>
                                                    <span className="font-bold text-white tracking-widest text-sm">{item.label}</span>
                                                </div>
                                                <span className="text-accent-cyan font-mono text-sm">{item.value} PTS</span>
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
