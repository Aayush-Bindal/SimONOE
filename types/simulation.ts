export interface SimulationParams {
  syncLevel: number;
  syncWindow: number;
  midTermRisk: number;
  maxTermAdjust: number;
  // resourceBuffer: number;
  electionPhases: number;
  monteCarloRuns: number;
  timeHorizon: number;
}

export const DEFAULT_PARAMS: SimulationParams = {
  syncLevel: 75,
  syncWindow: 100,
  midTermRisk: 8.5,
  maxTermAdjust: 15,
  // resourceBuffer: 20,
  electionPhases: 5,
  monteCarloRuns: 300,
  timeHorizon: 15,
};

// EXACT Response Structure
export interface SimulationResponse {
  financial: {
    total_savings_crore: number;
    savings_percent: number;
    evm_extra_cost_crore: number;
  };
  governance: {
    avg_turnout_boost_percent: number;
    mcc_days_reduction_annual: number;
    crime_rate_reduction_per_100k: number;
  };
  administrative: {
    personnel_required_lakh: number;
    evm_scaling_factor: number;
    phase_count: number;
  };
  economic: {
    gdp_boost_percent: number;
    inflation_change_pp: number;
    fiscal_deficit_change_pp: number;
  };
  monte_carlo_summary: {
    mean_outcome?: any;
    std_deviation?: any;
  };
  state_wise: Array<{
    state_code: string;
    savings_crore: number;
    turnout_boost: number;
  }>;
}