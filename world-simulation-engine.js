/**
 * World Simulation Logic
 * This document details the logic for a run-type simulation of a 7-region world. It defines the distinct characteristics of each region, their interdependencies, the decision-making process of AI agents governing these regions, and the core simulation cycle. The simulation aims to model complex geopolitical interactions, resource management, trade dynamics, conflict resolution, climate events, and the resulting emergent behaviors like growth and collapse.
 *
 * @param {{currentTurn: number, previousGlobalMetrics: string, dynamicEvents: string[]}} input - Input parameters
 * @returns {{currentTurn: number, regionsState: string, globalMetrics: string}} - Output result
 */
function executeLogicFlow(input) {
  "use strict";

  //@type:any - Load previous states if available for continuing simulation
  var previousStates;

  //@type:any - previousGlobalMetrics
  var previousGlobalMetrics;

  //@type:any - currentTurnNumber
  var currentTurnNumber;

  //@type:number - Initialize accumulators for global metrics
  var totalGDPAccumulator = 0;

  //@type:number - totalStabilityAccumulator
  var totalStabilityAccumulator = 0;

  //@type:number - totalWaterAccumulator
  var totalWaterAccumulator = 0;

  //@type:number - totalFoodAccumulator
  var totalFoodAccumulator = 0;

  //@type:number - totalEnergyAccumulator
  var totalEnergyAccumulator = 0;

  //@type:list - eventsThisTurn
  var eventsThisTurn;

  //@type:number - Define critical thresholds for simulation stability and resource management
  var CRITICAL_GDP_THRESHOLD = 1000000;

  //@type:number - CRITICAL_STABILITY_THRESHOLD
  var CRITICAL_STABILITY_THRESHOLD = 0.1;

  //@type:number - RESOURCE_CRITICAL_LEVEL
  var RESOURCE_CRITICAL_LEVEL = 0.2;

  //@type:object - Map region configurations by name for easy lookup
  var regionConfigMap;

  //@type:any - i
  var i;

  //@type:any - j
  var j;

  //@type:any - Get configuration and initial state for the current region
  var config;

  //@type:any - state
  var state;

  //@type:any - previousState
  var previousState;

  //@type:any - aiStrategy
  var aiStrategy;

  //@type:any - currentRegionWaterStock
  var currentRegionWaterStock;

  //@type:any - currentRegionFoodStock
  var currentRegionFoodStock;

  //@type:any - currentRegionEnergyStock
  var currentRegionEnergyStock;

  //@type:number - stabilityChange
  var stabilityChange = 0;

  //@type:any - resourceConsumptionFactor
  var resourceConsumptionFactor;

  //@type:any - infrastructureInvestment
  var infrastructureInvestment;

  //@type:any - techInvestment
  var techInvestment;

  //@type:object - newRegionState
  var newRegionState;

  //@type:any - initialConfig
  var initialConfig;

  //@type:list - Determine and apply dynamic events for the current turn
  var regionEvents;

  //@type:boolean - globalEventOccurred
  var globalEventOccurred = false;

  //@type:any - Select a random event from the available dynamic events
  var selectedEventIndex;

  //@type:any - eventTemplate
  var eventTemplate;

  //@type:object - Create an instance of the event
  var eventInstance;

  //@type:any - k
  var k;

  //@type:any - activeEvent
  var activeEvent;

  //@type:number - Apply immediate impacts of events (Simplified: Drought reduces water/food, Breakthrough boosts tech)
  var eventImpactFactor = 1;

  //@type:number - eventDamage
  var eventDamage = 0;

  //@type:any - event
  var event;

  //@type:any - Decision: Food Import Need
  var foodNeed;

  //@type:any - tradeVolume
  var tradeVolume;

  //@type:any - Calculate economic growth drivers based on resources, infrastructure, and technology
  var growthDrivers;

  //@type:any - Calculate economic growth based on AI's growth prioritization and drivers
  var economicGrowth;

  //@type:any - Calculate economic decline based on event damage and stability changes
  var economicDecline;

  //@type:any - Calculate the new GDP
  var newGDP;

  //@type:any - Calculate stability adjustments based on GDP change and resource availability
  var stabilityFromGrowth;

  //@type:any - stabilityFromResources
  var stabilityFromResources;

  //@type:any - Combine all stability adjustments
  var totalStabilityAdjustment;

  //@type:any - Calculate the new stability index
  var newStability;

  //@type:any - Calculate base population growth
  var basePopGrowth;

  //@type:any - Determine influence of food availability and stability on population growth
  var foodInfluence;

  //@type:any - stabilityInfluence
  var stabilityInfluence;

  //@type:any - Calculate effective population growth
  var effectivePopGrowth;

  //@type:any - Calculate urbanization effect
  var urbanizationEffect;

  //@type:any - Calculate new population
  var newPopulation;

  //@type:any - Placeholder for AI Investment: Allocate a portion of GDP change towards investment
  var investmentBudget;

  //@type:any - --- 2e. Global Metrics Update ---
  var regionCount;

  var output = {
    currentTurn: null,
    regionsState: null,
    globalMetrics: null
  };

  previousStates = previousRegionStates || [];
  previousGlobalMetrics = input.previousGlobalMetrics || {  };

  if (previousStates.length > 0) {
    currentTurnNumber = input.previousGlobalMetrics.input.currentTurn + 1;
  } else {
    currentTurnNumber = 1;
  }

  output.currentTurn = currentTurnNumber;
  eventsThisTurn = [];
  regionConfigMap = {  };

  for (var i = 0; i < regions.length; i = i + 1) {
    regionConfigMap[regions[i].name] = regions[i];
  }

  for (var i = 0; i < regions.length; i = i + 1) {
    config = regions[i];
    stabilityChange = 0;
    newRegionState = {  };
    initialConfig = config.initialState;

    if (currentTurnNumber === 1) {
      state = { name: config.name, population: initialConfig.population, GDP: initialConfig.GDP, stabilityIndex: initialConfig.stabilityIndex, resourceStock: { water: initialConfig.resourceStock.water * simulationParameters.initialResourceAvailabilityFactor, food: initialConfig.resourceStock.food * simulationParameters.initialResourceAvailabilityFactor, energy: initialConfig.resourceStock.energy * simulationParameters.initialResourceAvailabilityFactor }, infrastructureLevel: initialConfig.infrastructureLevel, technologyLevel: initialConfig.technologyLevel, activeEvents: [], tradePartners: [], geopoliticalStatus: { alliances: [], rivalries: [], influence: {  } } };
    } else {
      state = previousStates[i];
    }

    aiStrategy = config.aiStrategy;
    previousState = previousStates[i];
    newRegionState.name = state.name;
    newRegionState.activeEvents = [];
    newRegionState.tradePartners = [];
    newRegionState.geopoliticalStatus = state.geopoliticalStatus;
    regionEvents = [];
    globalEventOccurred = false;

    if (Math.random() < simulationParameters.climateEventProbability || input.previousGlobalMetrics.globalStability < 0.5 && Math.random() < 0.1) {
      selectedEventIndex = Math.floor(Math.random() * input.dynamicEvents.length);
      eventTemplate = input.dynamicEvents[selectedEventIndex];

      if (eventTemplate.regionTarget === "Global" || eventTemplate.regionTarget === config.name) {
        eventInstance = { type: eventTemplate.type, duration: eventTemplate.duration, severity: eventTemplate.severity };
        regionEvents.push(eventInstance);
        globalEventOccurred = true;

        if (currentTurnNumber === 1) {
          eventsThisTurn.push({ type: eventTemplate.type, regionTarget: eventTemplate.regionTarget, severity: eventTemplate.severity });
        }
      }
    }

    if (state.activeEvents) {
      for (var k = 0; k < state.activeEvents.length; k = k + 1) {
        activeEvent = state.activeEvents[k];
        activeEvent.duration = activeEvent.duration - 1;

        if (activeEvent.duration > 0) {
          regionEvents.push(activeEvent);
        }
      }
    }

    newRegionState.activeEvents = regionEvents;
    eventImpactFactor = 1;
    eventDamage = 0;

    for (var j = 0; j < regionEvents.length; j = j + 1) {
      event = regionEvents[j];

      if (event.type === "Drought" || event.type === "Cyclone") {
        eventImpactFactor = eventImpactFactor - event.severity * 0.2;
        eventDamage = eventDamage + event.severity * 100000;
      } else if (event.type === "Technological Breakthrough") {
        newRegionState.technologyLevel = state.technologyLevel + event.severity * 2;

        if (currentTurnNumber === 1) {
          eventsThisTurn.push({ type: event.type, regionTarget: config.name, severity: event.severity });
        }
      }
    }

    currentRegionWaterStock = state.resourceStock.water;
    currentRegionFoodStock = state.resourceStock.food;
    currentRegionEnergyStock = state.resourceStock.energy;
    resourceConsumptionFactor = simulationParameters.resourceDepletionRate * state.population;
    currentRegionWaterStock = currentRegionWaterStock - resourceConsumptionFactor * eventImpactFactor;
    currentRegionFoodStock = currentRegionFoodStock - resourceConsumptionFactor * eventImpactFactor;
    currentRegionEnergyStock = currentRegionEnergyStock - resourceConsumptionFactor * eventImpactFactor;

    if (state.stabilityIndex < 0.5) {
      stabilityChange = stabilityChange - aiStrategy.stabilityPrioritization * 0.05;
    }

    foodNeed = Math.max(0, resourceConsumptionFactor * 2 - currentRegionFoodStock);
    tradeVolume = foodNeed > 0 ? Math.min(foodNeed, 100000) : 0;

    if (tradeVolume > 0) {
      newRegionState.tradePartners.push({ partnerRegion: "Global Supplier Placeholder", volume: tradeVolume, terms: "Urgent Import" });
      currentRegionFoodStock = currentRegionFoodStock + tradeVolume * 0.8;
      newRegionState.GDP = state.GDP - tradeVolume * simulationParameters.tradeCostFactor;
      stabilityChange = stabilityChange + aiStrategy.cooperationTendency * 0.01;
    }

    if (currentRegionFoodStock < 0 || currentRegionWaterStock < 0 || currentRegionEnergyStock < 0) {
      stabilityChange = stabilityChange - 0.2;

      if (currentTurnNumber === 1) {
        throw new Error("ResourceShortage: Essential resources depleted in " + config.name);
      }
    }

    currentRegionWaterStock = Math.max(0, currentRegionWaterStock);
    currentRegionFoodStock = Math.max(0, currentRegionFoodStock);
    currentRegionEnergyStock = Math.max(0, currentRegionEnergyStock);
    newRegionState.resourceStock = { water: currentRegionWaterStock, food: currentRegionFoodStock, energy: currentRegionEnergyStock };
    growthDrivers = state.resourceStock.food / resourceConsumptionFactor + state.infrastructureLevel + state.technologyLevel;
    economicGrowth = state.GDP * aiStrategy.growthPrioritization * 0.05 * growthDrivers;
    economicDecline = eventDamage / 1000000 + Math.abs(stabilityChange) * 0.1;
    newGDP = state.GDP + economicGrowth - economicDecline;

    if (newGDP < CRITICAL_GDP_THRESHOLD && currentTurnNumber > 1) {
      stabilityChange = stabilityChange - 0.15;

      if (currentTurnNumber === 1) {
        throw new Error("EconomicCollapse: GDP fell below critical threshold in " + config.name);
      }
    }

    newRegionState.GDP = Math.max(CRITICAL_GDP_THRESHOLD / 10, newGDP);
    stabilityFromGrowth = newRegionState.GDP / state.GDP - 1;
    stabilityFromResources = currentRegionFoodStock / resourceConsumptionFactor * 2 - 0.5;
    totalStabilityAdjustment = stabilityChange + stabilityFromGrowth * 0.1 + stabilityFromResources * 0.2;
    newStability = state.stabilityIndex + totalStabilityAdjustment;
    newStability = Math.max(0, Math.min(1, newStability));

    if (newStability < CRITICAL_STABILITY_THRESHOLD && currentTurnNumber > 1) {
      if (currentTurnNumber === 1) {
        throw new Error("PoliticalInstability: Stability index critically low in " + config.name);
      }

      newRegionState.population = newRegionState.population * 0.8;
      newStability = newStability + 0.05;
    }

    newRegionState.stabilityIndex = newStability;
    basePopGrowth = simulationParameters.populationGrowthRate * state.population;
    foodInfluence = currentRegionFoodStock / resourceConsumptionFactor * 2;
    stabilityInfluence = newRegionState.stabilityIndex;
    effectivePopGrowth = basePopGrowth * foodInfluence * stabilityInfluence;
    urbanizationEffect = state.population * simulationParameters.urbanizationRate;
    newPopulation = state.population + effectivePopGrowth;
    newPopulation = Math.max(1000, newPopulation);
    newRegionState.population = newPopulation;
    investmentBudget = newRegionState.GDP - state.GDP > 0 ? newRegionState.GDP - state.GDP * 0.1 : state.GDP * 0.05;
    infrastructureInvestment = investmentBudget / state.GDP * simulationParameters.infrastructureImprovementRate * 10;
    techInvestment = investmentBudget / state.GDP * simulationParameters.techImprovementRate * 10;
    newRegionState.infrastructureLevel = state.infrastructureLevel + infrastructureInvestment;
    newRegionState.technologyLevel = state.technologyLevel + techInvestment;
    newRegionState.infrastructureLevel = Math.min(10, newRegionState.infrastructureLevel);
    newRegionState.technologyLevel = Math.min(10, newRegionState.technologyLevel);
    newRegionState.population = Math.floor(newRegionState.population);
    newRegionState.GDP = Math.floor(newRegionState.GDP);
    newRegionState.infrastructureLevel = Math.round(newRegionState.infrastructureLevel * 100) / 100;
    newRegionState.technologyLevel = Math.round(newRegionState.technologyLevel * 100) / 100;
    newRegionState.stabilityIndex = Math.round(newRegionState.stabilityIndex * 1000) / 1000;
    totalGDPAccumulator = totalGDPAccumulator + newRegionState.GDP;
    totalStabilityAccumulator = totalStabilityAccumulator + newRegionState.stabilityIndex;
    totalWaterAccumulator = totalWaterAccumulator + newRegionState.resourceStock.water;
    totalFoodAccumulator = totalFoodAccumulator + newRegionState.resourceStock.food;
    totalEnergyAccumulator = totalEnergyAccumulator + newRegionState.resourceStock.energy;
    output.regionsState.push(newRegionState);
  }

  regionCount = regions.length;
  output.globalMetrics.totalGDP = totalGDPAccumulator;
  output.globalMetrics.globalStability = totalStabilityAccumulator / regionCount;
  output.globalMetrics.globalResourceLevels.water = totalWaterAccumulator;
  output.globalMetrics.globalResourceLevels.food = totalFoodAccumulator;
  output.globalMetrics.globalResourceLevels.energy = totalEnergyAccumulator;
  output.globalMetrics.majorEventsThisTurn = eventsThisTurn;

  if (currentTurnNumber === 1) {
    output.globalMetrics.input.currentTurn = 1;
  }

  if (currentTurnNumber >= simulationParameters.maxTurns)
    {}

  return output;
}
