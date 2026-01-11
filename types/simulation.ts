// types/simulation.ts

export interface SimulationParams {
  syncLevel: number;        // 0-100%
  syncWindow: number;       // 0-180 days
  midTermRisk: number;      // 0-30%
  maxTermAdjust: number;    // 0-24 months
//   resourceBuffer: number;   // 0-50%
  electionPhases: number;   // 1-9
  monteCarloRuns: number;   // 100-1000
  timeHorizon: number;      // 5-30 years
}

export const DEFAULT_PARAMS: SimulationParams = {
  syncLevel: 75,
  syncWindow: 100,
  midTermRisk: 8.5,
  maxTermAdjust: 15,
//   resourceBuffer: 20,
  electionPhases: 5,
  monteCarloRuns: 300,
  timeHorizon: 15,
};