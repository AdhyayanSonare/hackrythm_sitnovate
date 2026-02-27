import React, { useState } from 'react';
import './index.css';
import { regionsData } from './utils/regionsData';
import { MainLayout } from './layout/MainLayout';

function App() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [turn, setTurn] = useState(1);
  const [regions, setRegions] = useState(regionsData);

  const handleSimulateTick = async () => {
    if (isSimulating) return; // Prevent overlapping calls
    setIsSimulating(true);
    try {
      const response = await fetch("https://lab.leapter.com/runtime/api/v1/2aece828-b181-42fc-ad6f-c794d322b50f/4e90117d-7ab7-4f0e-bde7-c5b980c11bd9/mcp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "lpt_ro2X2Ry9Mi9oMmlnQYfXxgVHSYKWovvhwgGadTy3aU"
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "tools/call",
          params: {
            name: "world_simulation_logic",
            arguments: {
              currentTurn: turn,
              previousGlobalMetrics: "Stable",
              dynamicEvents: [],
              previousRegionStates: [],
              regions: regions.map(r => ({ name: r.name, id: r.id })),
              instruction: "Generate individual AI thoughts (Neural Feed) for each of these 7 regions regarding their population trajectory, resource utilization, and geopolitical relations for this turn. Return a JSON object strictly keyed by region ID (e.g. 'central-core', 'snow-mountain-west'). Each value should be an object containing 'populationTrajectory', 'resourceUtilization', and 'geopoliticalRelations' strings."
            }
          },
          id: 1
        })
      });
      const data = await response.json();

      if (data.result && data.result.content && !data.result.isError) {
        try {
          const text = data.result.content[0].text;
          // Extract JSON if wrapped in markdown
          const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          const jsonString = jsonMatch ? jsonMatch[1] : text;

          const parsedResult = JSON.parse(jsonString);
          console.log("Simulation Result:", parsedResult);

          setRegions(prevRegions => prevRegions.map(region => {
            const feed = parsedResult[region.id];
            if (feed) {
              return { ...region, aiFeed: feed };
            }
            return region;
          }));

        } catch (e) {
          console.error("Failed to parse Leapter response", e);
        }
      }
      setTurn(prev => prev + 1);
    } catch (e) {
      console.error("Simulation failed", e);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      // Create continuous loop every 8 seconds (to respect API limits)
      intervalId = setInterval(() => {
        handleSimulateTick();
      }, 8000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, turn, isSimulating, regions]);

  const toggleSimulation = () => {
    if (!isRunning) {
      setIsRunning(true);
      handleSimulateTick(); // run immediately once
    } else {
      setIsRunning(false);
    }
  };

  return (
    <MainLayout
      regionsData={regions}
      toggleSimulation={toggleSimulation}
      isRunning={isRunning}
      isSimulating={isSimulating}
      turn={turn}
    />
  );
}

export default App;
