import React, { useState, useEffect } from 'react';
import { IslandCanvas } from '../components/IslandCanvas/IslandCanvas';
import { RegionPanel } from '../components/RegionPanel/RegionPanel';
import { HUD } from '../components/HUD/HUD';
import { NavigationPanel } from '../components/NavigationPanel/NavigationPanel';

export const MainLayout = ({ regionsData, toggleSimulation, isRunning, isSimulating, turn, globalMetrics, eventLog }) => {
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [selectedRegion, setSelectedRegion] = useState(null);

    useEffect(() => {
        const handleMouseMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="relative w-screen h-screen overflow-hidden bg-[var(--background-dark)] text-[var(--text-primary)] font-body antialiased interactive-map">

            {/* 3D Island & Floating Regions */}
            <IslandCanvas
                regions={regionsData}
                selectedRegion={selectedRegion}
                onRegionClick={setSelectedRegion}
                cursorPos={cursorPos}
            />

            {/* Slide-in Region Data Panel */}
            <RegionPanel
                region={selectedRegion}
                onClose={() => setSelectedRegion(null)}
            />

            {/* Custom Cursor */}
            <div
                className="hidden md:flex items-center justify-center pointer-events-none mix-blend-screen z-[99999]"
                style={{ left: cursorPos.x, top: cursorPos.y, position: 'fixed', transform: 'translate(-50%, -50%)' }}
            >
                <div className="relative w-8 h-8 rounded-full border border-[var(--primary-accent)]/50 flex items-center justify-center animate-spin-slow">
                    <div className="absolute top-0 w-0.5 h-1.5 bg-[var(--primary-accent)]"></div>
                    <div className="absolute bottom-0 w-0.5 h-1.5 bg-[var(--primary-accent)]"></div>
                    <div className="absolute left-0 h-0.5 w-1.5 bg-[var(--primary-accent)]"></div>
                    <div className="absolute right-0 h-0.5 w-1.5 bg-[var(--primary-accent)]"></div>
                </div>
                <div className="absolute w-1 h-1 bg-white rounded-full drop-shadow-[0_0_5px_#fff]"></div>
            </div>

            {/* Top Left minimal HUD */}
            <HUD
                turn={turn}
                isRunning={isRunning}
                isSimulating={isSimulating}
                toggleSimulation={toggleSimulation}
                globalMetrics={globalMetrics}
                eventLog={eventLog}
            />

            {/* Bottom Right modular navigation panel */}
            <NavigationPanel
                regionsData={regionsData}
                selectedRegion={selectedRegion}
                onRegionClick={setSelectedRegion}
            />
        </div>
    );
};
