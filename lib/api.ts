import { SimulationParams, SimulationResponse } from '@/types/simulation';

// Request type extends params and adds selectedStates
export type SimulationRequest = SimulationParams & {
  selectedStates: string[];
};

export const fetchSimulation = async (
  data: SimulationRequest
): Promise<SimulationResponse> => {
  // In a real app, this fetches from your backend
  // await fetch('http://localhost:8000/api/v1/simulate', ...)
  
  // MOCK DELAY & RESPONSE
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        financial: { 
          total_savings_crore: 24500 + (data.syncLevel * 100), 
          savings_percent: 41 + (data.syncLevel / 10),
          evm_extra_cost_crore: 2300 - (data.syncLevel * 5)
        },
        governance: { 
          avg_turnout_boost_percent: 6.2, 
          mcc_days_reduction_annual: 210,
          crime_rate_reduction_per_100k: 45
        },
        administrative: { 
          personnel_required_lakh: 85 - (data.syncLevel / 5),
          evm_scaling_factor: 1.2,
          phase_count: data.electionPhases
        },
        economic: { 
          gdp_boost_percent: 1.42,
          inflation_change_pp: -0.3,
          fiscal_deficit_change_pp: -0.8
        },
        monte_carlo_summary: {
          mean_outcome: 2.1,
          std_deviation: 0.45
        },
        state_wise: [
          { state_code: "MH", savings_crore: 4500, turnout_boost: 6.5 },
          { state_code: "UP", savings_crore: 6200, turnout_boost: 5.8 },
          { state_code: "KA", savings_crore: 3100, turnout_boost: 7.2 },
          { state_code: "TN", savings_crore: 2900, turnout_boost: 6.1 },
          { state_code: "DL", savings_crore: 1200, turnout_boost: 8.3 },
        ]
      });
    }, 1200);
  });
};