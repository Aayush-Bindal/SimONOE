"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationResponse } from "@/types/simulation";

interface ImpactBarChartProps {
  data: SimulationResponse | null;
}

export default function ImpactBarChart({ data }: ImpactBarChartProps) {
  if (!data) return null;

  const chartData = [
    { 
      name: "Financial", 
      metric: "Savings %", 
      value: data.financial.savings_percent, 
      fill: "#15803d" // Green
    },
    { 
      name: "Governance", 
      metric: "Turnout Boost %", 
      value: data.governance.avg_turnout_boost_percent, 
      fill: "#b45309" // Amber
    },
    { 
      name: "Admin", 
      metric: "Personnel (Lakh)", 
      value: data.administrative.personnel_required_lakh, 
      fill: "#1d4ed8" // Blue
    },
    { 
      name: "Economic", 
      metric: "GDP Boost %", 
      value: data.economic.gdp_boost_percent, 
      fill: "#7f1d1d" // Maroon
    },
  ];

  return (
    <Card className="h-full border-l-4 border-l-blue-900 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
          Key Impact Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fontSize: 12, fill: "#52525b" }} 
              width={80} 
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-white border border-zinc-200 p-2 rounded shadow-lg text-xs">
                      <p className="font-bold">{d.name}</p>
                      <p>{d.metric}: <span className="font-mono font-semibold">{d.value}</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}