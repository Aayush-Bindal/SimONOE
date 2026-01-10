"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimulationResponse } from '@/lib/api';

export default function ImpactBarChart({ data }: { data: SimulationResponse | null }) {
  if (!data) return null;

  const chartData = data.state_wise.map(s => ({
    name: s.state_code,
    Savings: s.savings_crore,
    Alignment: s.alignment_score * 50 // Scaling for visualization
  }));

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-gray-700">State-wise Projected Savings (₹ Crore)</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{fontSize: 12}} />
            <YAxis tick={{fontSize: 12}} />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{fill: '#f3f4f6'}}
            />
            <Legend />
            <Bar dataKey="Savings" fill="var(--color-gov-maroon)" radius={[4, 4, 0, 0]} name="Savings (Cr)" />
            <Bar dataKey="Alignment" fill="var(--color-gov-gold)" radius={[4, 4, 0, 0]} name="Alignment Score" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}