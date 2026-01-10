export interface SimulationRequest {
  syncLevel: number; // 0-100%
  syncWindowDays: number;
  midTermProb: number;
  selectedStates: string[];
  metricFocus: 'financial' | 'governance' | 'administrative';
}

export interface SimulationResponse {
  financial: {
    total_savings_crore: number;
    savings_percent: number;
  };
  governance: {
    avg_turnout_boost_percent: number;
    mcc_days_reduction_annual: number;
  };
  administrative: {
    personnel_required_lakh: number;
  };
  economic: {
    gdp_boost_percent: number;
  };
  state_wise: Array<{
    state_code: string;
    state_name: string;
    savings_crore: number;
    alignment_score: number;
  }>;
  history: Array<{
    year: number;
    cost_with_onoe: number;
    cost_without_onoe: number;
  }>;
}

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
          savings_percent: 41 + (data.syncLevel / 10) 
        },
        governance: { 
          avg_turnout_boost_percent: 6.2, 
          mcc_days_reduction_annual: 210 
        },
        administrative: { 
          personnel_required_lakh: 85 - (data.syncLevel / 5) 
        },
        economic: { 
          gdp_boost_percent: 1.42 
        },
        state_wise: [
          { state_code: "MH", state_name: "Maharashtra", savings_crore: 4500, alignment_score: 92 },
          { state_code: "UP", state_name: "Uttar Pradesh", savings_crore: 6200, alignment_score: 88 },
          { state_code: "KA", state_name: "Karnataka", savings_crore: 3100, alignment_score: 75 },
          { state_code: "TN", state_name: "Tamil Nadu", savings_crore: 2900, alignment_score: 60 },
          { state_code: "DL", state_name: "Delhi", savings_crore: 1200, alignment_score: 95 },
        ],
        history: [
            { year: 2029, cost_with_onoe: 10000, cost_without_onoe: 15000 },
            { year: 2034, cost_with_onoe: 12000, cost_without_onoe: 22000 },
            { year: 2039, cost_with_onoe: 14000, cost_without_onoe: 35000 },
        ]
      });
    }, 1200);
  });
};