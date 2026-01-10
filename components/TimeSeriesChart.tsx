"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimulationResponse } from '@/lib/api';

export default function TimeSeriesChart({ data }: { data: SimulationResponse | null }) {
    if (!data) return null;

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold text-gray-700">Election Expenditure Projection (2029-2039)</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.history}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="cost_without_onoe" stroke="#ef4444" strokeWidth={2} name="Current System" dot={{r: 4}} />
                        <Line type="monotone" dataKey="cost_with_onoe" stroke="#22c55e" strokeWidth={2} name="ONOE Scenario" dot={{r: 4}} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}