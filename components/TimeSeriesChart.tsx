"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationResponse } from "@/types/simulation";

interface TimeSeriesChartProps {
  data: SimulationResponse | null;
  horizon: number;
}

export default function TimeSeriesChart({ data, horizon }: TimeSeriesChartProps) {
  if (!data) return null;

  // Generate linear trend data
  const chartData = Array.from({ length: horizon + 1 }, (_, i) => {
    const year = 2024 + i;
    // Simple projection logic: GDP accumulates, Turnout stays steady (or grows slightly)
    return {
      year,
      gdp: (data.economic.gdp_boost_percent * (1 + i * 0.1)).toFixed(2), // Slight compound
      turnout: data.governance.avg_turnout_boost_percent, // Steady state assumption
    };
  });

  return (
    <Card className="h-full border-l-4 border-l-amber-600 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
          {horizon}-Year Projection
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="year" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 10 }} label={{ value: 'Turnout %', angle: -90, position: 'insideLeft', fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} label={{ value: 'GDP %', angle: 90, position: 'insideRight', fontSize: 10 }} />
            <Tooltip 
              contentStyle={{ fontSize: '12px', borderRadius: '6px' }}
              labelStyle={{ fontWeight: 'bold', color: '#333' }}
            />
            <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
            
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="turnout" 
              name="Turnout Boost (%)" 
              stroke="#b45309" 
              strokeWidth={2} 
              dot={false}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="gdp" 
              name="GDP Boost (%)" 
              stroke="#7f1d1d" 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}