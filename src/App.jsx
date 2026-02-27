import React, { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';
import { regionsData as initialRegionsData } from './utils/regionsData';
import { MainLayout } from './layout/MainLayout';
import { simulateTick, deriveStatus, formatPop, formatGDP, formatResource } from './engine/simulationEngine';

const REGION_IDS = initialRegionsData.map(r => r.id);

function App() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [turn, setTurn] = useState(0);
  const [regions, setRegions] = useState(initialRegionsData);
  const [globalMetrics, setGlobalMetrics] = useState(null);
  const [eventLog, setEventLog] = useState([]);

  // Refs to avoid stale closures in interval
  const regionStatesRef = useRef([]);
  const globalMetricsRef = useRef(null);
  const turnRef = useRef(0);

  const handleSimulateTick = useCallback(() => {
    setIsSimulating(true);

    // Run simulation tick synchronously (it's pure math, very fast)
    const nextTurn = turnRef.current + 1;
    const result = simulateTick(
      nextTurn,
      regionStatesRef.current,
      globalMetricsRef.current,
      REGION_IDS
    );

    // Store raw states for next tick
    regionStatesRef.current = result.regionStates;
    globalMetricsRef.current = result.globalMetrics;
    turnRef.current = nextTurn;

    // Merge simulation state into display regions
    setRegions(prevRegions => prevRegions.map((region, idx) => {
      const simState = result.regionStates[idx];
      if (!simState) return region;

      const status = deriveStatus(simState.stabilityIndex);
      return {
        ...region,
        aiFeed: simState.aiFeed,
        simState: {
          population: simState.population,
          GDP: simState.GDP,
          stabilityIndex: simState.stabilityIndex,
          resourceStock: simState.resourceStock,
          infrastructureLevel: simState.infrastructureLevel,
          technologyLevel: simState.technologyLevel,
          activeEvents: simState.activeEvents,
          tradePartners: simState.tradePartners,
        },
        // Update display stats from simulation
        stats: {
          ...region.stats,
          pop: formatPop(simState.population),
        },
        status: status.label,
        statusColor: status.color,
      };
    }));

    setGlobalMetrics(result.globalMetrics);
    setTurn(nextTurn);

    // Append events to log
    if (result.eventsThisTurn.length > 0) {
      setEventLog(prev => [
        ...result.eventsThisTurn.map(e => ({ ...e, turn: nextTurn })),
        ...prev,
      ].slice(0, 50)); // keep last 50
    }

    setIsSimulating(false);
  }, []);

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        handleSimulateTick();
      }, 2000); // 2-second ticks for smooth visual updates
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, handleSimulateTick]);

  const toggleSimulation = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      handleSimulateTick(); // run immediately once
    } else {
      setIsRunning(false);
    }
  }, [isRunning, handleSimulateTick]);

  return (
    <MainLayout
      regionsData={regions}
      toggleSimulation={toggleSimulation}
      isRunning={isRunning}
      isSimulating={isSimulating}
      turn={turn}
      globalMetrics={globalMetrics}
      eventLog={eventLog}
    />
  );
}

export default App;
