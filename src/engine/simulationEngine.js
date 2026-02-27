/**
 * Client-side World Simulation Engine
 * Faithfully implements the logic from world-simulation-engine.js
 * as a pure function that runs each turn locally in the browser.
 */

// ─── Simulation Parameters ─────────────────────────────────────────────
export const SIMULATION_PARAMS = {
  initialResourceAvailabilityFactor: 1.0,
  climateEventProbability: 0.25,
  resourceDepletionRate: 0.00002,
  tradeCostFactor: 0.5,
  populationGrowthRate: 0.012,
  urbanizationRate: 0.005,
  infrastructureImprovementRate: 0.02,
  techImprovementRate: 0.03,
  maxTurns: 200,
};

// ─── Dynamic Event Templates ────────────────────────────────────────────
export const DYNAMIC_EVENTS = [
  { type: 'Drought', duration: 3, severity: 2, regionTarget: 'Desert South' },
  { type: 'Drought', duration: 2, severity: 1, regionTarget: 'Central Core' },
  { type: 'Cyclone', duration: 2, severity: 3, regionTarget: 'Coastal Isles' },
  { type: 'Cyclone', duration: 1, severity: 2, regionTarget: 'Tech Harbor' },
  { type: 'Technological Breakthrough', duration: 1, severity: 2, regionTarget: 'Snow Mountain West' },
  { type: 'Technological Breakthrough', duration: 1, severity: 3, regionTarget: 'Tech Harbor' },
  { type: 'Drought', duration: 2, severity: 2, regionTarget: 'Forest North' },
  { type: 'Cyclone', duration: 3, severity: 2, regionTarget: 'Global' },
  { type: 'Technological Breakthrough', duration: 1, severity: 1, regionTarget: 'Snow Mountain East' },
  { type: 'Drought', duration: 2, severity: 1, regionTarget: 'Global' },
];

// ─── Region Simulation Configs ─────────────────────────────────────────
// Each region has initialState and aiStrategy as required by the engine
export const REGION_SIM_CONFIGS = {
  'central-core': {
    name: 'Central Core',
    initialState: {
      population: 200000,
      GDP: 8000000,
      stabilityIndex: 0.65,
      resourceStock: { water: 40000, food: 30000, energy: 120000 },
      infrastructureLevel: 4.5,
      technologyLevel: 5.0,
    },
    aiStrategy: {
      growthPrioritization: 0.6,
      stabilityPrioritization: 0.8,
      cooperationTendency: 0.4,
    },
  },
  'snow-mountain-west': {
    name: 'Snow Mountain West',
    initialState: {
      population: 100000,
      GDP: 6000000,
      stabilityIndex: 0.85,
      resourceStock: { water: 80000, food: 20000, energy: 50000 },
      infrastructureLevel: 6.0,
      technologyLevel: 7.5,
    },
    aiStrategy: {
      growthPrioritization: 0.4,
      stabilityPrioritization: 0.9,
      cooperationTendency: 0.6,
    },
  },
  'snow-mountain-east': {
    name: 'Snow Mountain East',
    initialState: {
      population: 500000,
      GDP: 10000000,
      stabilityIndex: 0.80,
      resourceStock: { water: 60000, food: 40000, energy: 60000 },
      infrastructureLevel: 5.5,
      technologyLevel: 6.0,
    },
    aiStrategy: {
      growthPrioritization: 0.5,
      stabilityPrioritization: 0.7,
      cooperationTendency: 0.7,
    },
  },
  'desert-south': {
    name: 'Desert South',
    initialState: {
      population: 800000,
      GDP: 5000000,
      stabilityIndex: 0.55,
      resourceStock: { water: 15000, food: 25000, energy: 90000 },
      infrastructureLevel: 3.0,
      technologyLevel: 3.5,
    },
    aiStrategy: {
      growthPrioritization: 0.7,
      stabilityPrioritization: 0.5,
      cooperationTendency: 0.3,
    },
  },
  'forest-north': {
    name: 'Forest North',
    initialState: {
      population: 350000,
      GDP: 7000000,
      stabilityIndex: 0.70,
      resourceStock: { water: 70000, food: 90000, energy: 40000 },
      infrastructureLevel: 3.5,
      technologyLevel: 4.0,
    },
    aiStrategy: {
      growthPrioritization: 0.5,
      stabilityPrioritization: 0.6,
      cooperationTendency: 0.8,
    },
  },
  'tech-harbor': {
    name: 'Tech Harbor',
    initialState: {
      population: 14200000,
      GDP: 50000000,
      stabilityIndex: 0.75,
      resourceStock: { water: 50000, food: 60000, energy: 80000 },
      infrastructureLevel: 7.0,
      technologyLevel: 8.0,
    },
    aiStrategy: {
      growthPrioritization: 0.8,
      stabilityPrioritization: 0.6,
      cooperationTendency: 0.5,
    },
  },
  'coastal-isles': {
    name: 'Coastal Isles',
    initialState: {
      population: 2100000,
      GDP: 12000000,
      stabilityIndex: 0.72,
      resourceStock: { water: 120000, food: 70000, energy: 35000 },
      infrastructureLevel: 4.0,
      technologyLevel: 4.5,
    },
    aiStrategy: {
      growthPrioritization: 0.5,
      stabilityPrioritization: 0.7,
      cooperationTendency: 0.9,
    },
  },
};

// ─── Constants ──────────────────────────────────────────────────────────
const CRITICAL_GDP_THRESHOLD = 1000000;
const CRITICAL_STABILITY_THRESHOLD = 0.1;

// ─── Helper: format numbers for display ─────────────────────────────────
export function formatPop(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return String(n);
}

export function formatGDP(n) {
  if (n >= 1_000_000_000) return '$' + (n / 1_000_000_000).toFixed(2) + 'B';
  if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
  if (n >= 1_000) return '$' + (n / 1_000).toFixed(1) + 'K';
  return '$' + n;
}

export function formatResource(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

// ─── Derive status from stability index ─────────────────────────────────
export function deriveStatus(stability) {
  if (stability >= 0.8) return { label: 'STABLE', color: 'bg-green-500' };
  if (stability >= 0.6) return { label: 'ONLINE', color: 'bg-blue-400' };
  if (stability >= 0.4) return { label: 'WARNING', color: 'bg-yellow-400' };
  if (stability >= 0.2) return { label: 'CRITICAL', color: 'bg-amber-500' };
  return { label: 'COLLAPSE', color: 'bg-red-500' };
}

// ─── Generate AI narrative for a region ─────────────────────────────────
function generateNarrative(regionId, prevState, newState, events) {
  const popDelta = newState.population - prevState.population;
  const popDir = popDelta > 0 ? 'growing' : popDelta < 0 ? 'declining' : 'stable';
  const gdpDelta = newState.GDP - prevState.GDP;
  const gdpDir = gdpDelta > 0 ? 'expanding' : gdpDelta < 0 ? 'contracting' : 'stable';

  const waterPct = prevState.resourceStock.water > 0
    ? ((newState.resourceStock.water / prevState.resourceStock.water) * 100).toFixed(0)
    : 0;
  const foodPct = prevState.resourceStock.food > 0
    ? ((newState.resourceStock.food / prevState.resourceStock.food) * 100).toFixed(0)
    : 0;
  const energyPct = prevState.resourceStock.energy > 0
    ? ((newState.resourceStock.energy / prevState.resourceStock.energy) * 100).toFixed(0)
    : 0;

  const eventStr = events.length > 0
    ? events.map(e => `${e.type} (severity ${e.severity})`).join(', ')
    : 'No significant events';

  const tradeStr = newState.tradePartners.length > 0
    ? `Active trade: ${newState.tradePartners.map(t => `${t.terms} (${formatResource(t.volume)} units)`).join(', ')}`
    : 'No active trade agreements';

  return {
    populationTrajectory: `Population is ${popDir} (${popDelta >= 0 ? '+' : ''}${formatPop(popDelta)}). Current: ${formatPop(newState.population)}. Stability index at ${(newState.stabilityIndex * 100).toFixed(1)}% is ${newState.stabilityIndex >= 0.6 ? 'supporting' : 'hindering'} growth.`,
    resourceUtilization: `Water reserves at ${waterPct}% of prior turn. Food at ${foodPct}%. Energy at ${energyPct}%. Infrastructure level ${newState.infrastructureLevel.toFixed(1)}/10, Tech level ${newState.technologyLevel.toFixed(1)}/10.`,
    geopoliticalRelations: `Economy ${gdpDir} (${gdpDelta >= 0 ? '+' : ''}${formatGDP(Math.abs(gdpDelta))}). ${tradeStr}. Events: ${eventStr}.`,
  };
}

// ─── MAIN SIMULATION TICK ───────────────────────────────────────────────
/**
 * Runs one simulation turn.
 * @param {number} currentTurn - current turn number (1-based)
 * @param {Object[]} previousRegionStates - array of region states from prior turn (empty on turn 1)
 * @param {Object} previousGlobalMetrics - global metrics from prior turn
 * @param {string[]} regionIds - ordered array of region IDs
 * @returns {{ currentTurn, regionStates, globalMetrics, eventsThisTurn }}
 */
export function simulateTick(currentTurn, previousRegionStates, previousGlobalMetrics, regionIds) {
  const simP = SIMULATION_PARAMS;
  const isFirstTurn = previousRegionStates.length === 0;

  let totalGDP = 0;
  let totalStability = 0;
  let totalWater = 0;
  let totalFood = 0;
  let totalEnergy = 0;
  const eventsThisTurn = [];
  const newRegionStates = [];

  for (let i = 0; i < regionIds.length; i++) {
    const regionId = regionIds[i];
    const config = REGION_SIM_CONFIGS[regionId];
    if (!config) continue;

    const initialCfg = config.initialState;
    const aiStrategy = config.aiStrategy;

    // ── Resolve current state ────────────────────────────
    let state;
    if (isFirstTurn) {
      state = {
        name: config.name,
        regionId,
        population: initialCfg.population,
        GDP: initialCfg.GDP,
        stabilityIndex: initialCfg.stabilityIndex,
        resourceStock: {
          water: initialCfg.resourceStock.water * simP.initialResourceAvailabilityFactor,
          food: initialCfg.resourceStock.food * simP.initialResourceAvailabilityFactor,
          energy: initialCfg.resourceStock.energy * simP.initialResourceAvailabilityFactor,
        },
        infrastructureLevel: initialCfg.infrastructureLevel,
        technologyLevel: initialCfg.technologyLevel,
        activeEvents: [],
        tradePartners: [],
      };
    } else {
      state = { ...previousRegionStates[i] };
      state.resourceStock = { ...state.resourceStock };
    }

    let stabilityChange = 0;
    const newState = {
      name: state.name,
      regionId,
      activeEvents: [],
      tradePartners: [],
      resourceStock: {},
      population: state.population,
      GDP: state.GDP,
      stabilityIndex: state.stabilityIndex,
      infrastructureLevel: state.infrastructureLevel,
      technologyLevel: state.technologyLevel ?? initialCfg.technologyLevel,
    };

    // ── Dynamic Events ───────────────────────────────────
    const regionEvents = [];
    const globalStab = previousGlobalMetrics?.globalStability ?? 0.7;

    if (Math.random() < simP.climateEventProbability || (globalStab < 0.5 && Math.random() < 0.1)) {
      const idx = Math.floor(Math.random() * DYNAMIC_EVENTS.length);
      const tmpl = DYNAMIC_EVENTS[idx];
      if (tmpl.regionTarget === 'Global' || tmpl.regionTarget === config.name) {
        const inst = { type: tmpl.type, duration: tmpl.duration, severity: tmpl.severity };
        regionEvents.push(inst);
        eventsThisTurn.push({ type: tmpl.type, regionTarget: tmpl.regionTarget, severity: tmpl.severity, affectedRegion: config.name });
      }
    }

    // Carry over unexpired events
    if (state.activeEvents) {
      for (const evt of state.activeEvents) {
        const remaining = { ...evt, duration: evt.duration - 1 };
        if (remaining.duration > 0) regionEvents.push(remaining);
      }
    }
    newState.activeEvents = regionEvents;

    // ── Event Impacts ────────────────────────────────────
    let eventImpactFactor = 1;
    let eventDamage = 0;

    for (const evt of regionEvents) {
      if (evt.type === 'Drought' || evt.type === 'Cyclone') {
        eventImpactFactor -= evt.severity * 0.2;
        eventDamage += evt.severity * 100000;
      } else if (evt.type === 'Technological Breakthrough') {
        newState.technologyLevel = state.technologyLevel + evt.severity * 2;
      }
    }
    eventImpactFactor = Math.max(0.1, eventImpactFactor);

    // ── Resource Consumption ─────────────────────────────
    let water = state.resourceStock.water;
    let food = state.resourceStock.food;
    let energy = state.resourceStock.energy;
    const consumption = simP.resourceDepletionRate * state.population;

    water -= consumption * eventImpactFactor;
    food -= consumption * eventImpactFactor;
    energy -= consumption * eventImpactFactor;

    // Natural regeneration (small amount each turn)
    water += initialCfg.resourceStock.water * 0.05;
    food += initialCfg.resourceStock.food * 0.05;
    energy += initialCfg.resourceStock.energy * 0.05;

    // ── AI Decision: Stability ───────────────────────────
    if (state.stabilityIndex < 0.5) {
      stabilityChange -= aiStrategy.stabilityPrioritization * 0.05;
    }

    // ── AI Decision: Trade ───────────────────────────────
    const foodNeed = Math.max(0, consumption * 2 - food);
    const tradeVolume = foodNeed > 0 ? Math.min(foodNeed, 100000) : 0;

    if (tradeVolume > 0) {
      newState.tradePartners.push({
        partnerRegion: 'Global Market',
        volume: tradeVolume,
        terms: 'Urgent Import',
      });
      food += tradeVolume * 0.8;
      newState.GDP = state.GDP - tradeVolume * simP.tradeCostFactor;
      stabilityChange += aiStrategy.cooperationTendency * 0.01;
    }

    // ── Resource Shortage Penalty ────────────────────────
    if (food < 0 || water < 0 || energy < 0) {
      stabilityChange -= 0.2;
    }

    water = Math.max(0, water);
    food = Math.max(0, food);
    energy = Math.max(0, energy);
    newState.resourceStock = { water, food, energy };

    // ── Economic Calculation ─────────────────────────────
    const safeConsumption = consumption > 0 ? consumption : 1;
    const growthDrivers = (state.resourceStock.food / safeConsumption) + state.infrastructureLevel + state.technologyLevel;
    const economicGrowth = state.GDP * aiStrategy.growthPrioritization * 0.05 * growthDrivers;
    const economicDecline = (eventDamage / 1000000) + Math.abs(stabilityChange) * 0.1;
    let newGDP = (newState.GDP || state.GDP) + economicGrowth - economicDecline;

    if (newGDP < CRITICAL_GDP_THRESHOLD && !isFirstTurn) {
      stabilityChange -= 0.15;
    }
    newState.GDP = Math.max(CRITICAL_GDP_THRESHOLD / 10, newGDP);

    // ── Stability Calculation ────────────────────────────
    const stabilityFromGrowth = (newState.GDP / state.GDP) - 1;
    const stabilityFromResources = (food / (safeConsumption * 2)) - 0.5;
    const totalStabAdj = stabilityChange + (stabilityFromGrowth * 0.1) + (stabilityFromResources * 0.2);
    let newStability = state.stabilityIndex + totalStabAdj;
    newStability = Math.max(0, Math.min(1, newStability));

    if (newStability < CRITICAL_STABILITY_THRESHOLD && !isFirstTurn) {
      newState.population = state.population * 0.8;
      newStability += 0.05;
    }
    newState.stabilityIndex = newStability;

    // ── Population Calculation ───────────────────────────
    const basePopGrowth = simP.populationGrowthRate * state.population;
    const foodInfluence = food / (safeConsumption * 2);
    const stabilityInfluence = newState.stabilityIndex;
    const effectivePopGrowth = basePopGrowth * foodInfluence * stabilityInfluence;
    let newPop = state.population + effectivePopGrowth;
    newPop = Math.max(1000, newPop);
    newState.population = newPop;

    // ── Infrastructure & Tech Investment ─────────────────
    const investBudget = newState.GDP > state.GDP
      ? (newState.GDP - state.GDP) * 0.1
      : state.GDP * 0.05;
    const infraInv = (investBudget / state.GDP) * simP.infrastructureImprovementRate * 10;
    const techInv = (investBudget / state.GDP) * simP.techImprovementRate * 10;
    newState.infrastructureLevel = Math.min(10, state.infrastructureLevel + infraInv);
    newState.technologyLevel = Math.min(10, (newState.technologyLevel || state.technologyLevel) + techInv);

    // ── Round values ─────────────────────────────────────
    newState.population = Math.floor(newState.population);
    newState.GDP = Math.floor(newState.GDP);
    newState.infrastructureLevel = Math.round(newState.infrastructureLevel * 100) / 100;
    newState.technologyLevel = Math.round(newState.technologyLevel * 100) / 100;
    newState.stabilityIndex = Math.round(newState.stabilityIndex * 1000) / 1000;

    // ── Generate AI narrative ────────────────────────────
    newState.aiFeed = generateNarrative(regionId, state, newState, regionEvents);

    // ── Accumulate globals ───────────────────────────────
    totalGDP += newState.GDP;
    totalStability += newState.stabilityIndex;
    totalWater += newState.resourceStock.water;
    totalFood += newState.resourceStock.food;
    totalEnergy += newState.resourceStock.energy;

    newRegionStates.push(newState);
  }

  const regionCount = regionIds.length;
  const globalMetrics = {
    totalGDP,
    globalStability: totalStability / regionCount,
    globalResourceLevels: {
      water: totalWater,
      food: totalFood,
      energy: totalEnergy,
    },
    majorEventsThisTurn: eventsThisTurn,
  };

  return {
    currentTurn,
    regionStates: newRegionStates,
    globalMetrics,
    eventsThisTurn,
  };
}
