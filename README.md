# SITnovate-   
# Emergent Geopolitics Simulation

A multi-agent simulation engine where autonomous regions compete, cooperate, and adapt under resource constraints.

## 🧠 Overview

This project simulates a world of multiple regions, each governed by an independent agent managing:

- Water
- Food
- Energy
- Land

Over discrete time cycles, regions must:
- Sustain their population
- Grow economically
- Trade with other regions
- Respond to dynamic global events

No fixed geopolitical rules are hardcoded — behaviors emerge from resource pressure and agent decisions.

---

## ⚙️ Core Concepts

### 1. Finite Resources
Each region operates under limited:
- Water
- Food
- Energy

Resources deplete and regenerate over time.

---

### 2. Autonomous Agents
Each region is controlled by an agent that:
- Makes decisions per cycle
- Balances survival vs growth
- Adapts based on outcomes

(Current version uses heuristic strategies. Reinforcement learning planned.)

---

### 3. Interaction System
Regions interact through:
- Trade (resource exchange)
- Cooperation (alliances - WIP)
- Competition (future: conflict)

---

### 4. Dynamic Events
The world evolves through stochastic events:
- Resource shocks (e.g., drought)
- Positive disruptions (e.g., tech breakthroughs)

These force agents to adapt continuously.

---

### 5. Emergent Behavior
The simulation is designed to observe:
- Sustainable strategies
- Collapse scenarios
- Cooperation vs exploitation dynamics

---

## 🧩 Architecture

- `engine/` → core simulation systems
- `agents/` → decision-making logic
- `config/` → initial world setup
- `visualization/` → simulation rendering

---

## 🚀 Running the Simulation

```bash
npm install
node src/index.js
