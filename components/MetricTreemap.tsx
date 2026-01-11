"use client";

import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimulationResponse } from "@/types/simulation";

interface MetricTreemapProps {
  data: SimulationResponse | null;
}

export default function MetricTreemap({ data }: MetricTreemapProps) {
  if (!data) return null;

  // Flatten the specific 3+3+3 structure into treemap nodes
  // We use absolute values or arbitrary sizing for non-monetary metrics to ensure visibility
  const treeData = [
    {
      name: "Financial",
      children: [
        { name: "Total Savings (Cr)", size: data.financial.total_savings_crore },
        { name: "EVM Extra Cost (Cr)", size: data.financial.evm_extra_cost_crore },
        { name: "Savings %", size: data.financial.savings_percent * 100 }, // Scaling for visibility
      ],
    },
    {
      name: "Governance",
      children: [
        { name: "Turnout Boost (%)", size: data.governance.avg_turnout_boost_percent * 500 },
        { name: "MCC Reduction (Days)", size: data.governance.mcc_days_reduction_annual * 10 },
        { name: "Crime Reduction", size: Math.abs(data.governance.crime_rate_reduction_per_100k) * 500 },
      ],
    },
    {
      name: "Administrative",
      children: [
        { name: "Personnel (Lakh)", size: data.administrative.personnel_required_lakh * 100 },
        { name: "Phase Count", size: data.administrative.phase_count * 500 },
        { name: "EVM Scaling", size: data.administrative.evm_scaling_factor * 1000 },
      ],
    },
  ];

  return (
    <Card className="h-full border-l-4 border-l-teal-600 shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">
          Metric Hierarchy
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treeData}
            dataKey="size"
            stroke="#fff"
            fill="#0f766e"
            aspectRatio={4 / 3}
            content={<CustomContent />}
          />
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

const CustomContent = (props: any) => {
  const { root, depth, x, y, width, height, name } = props;
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: depth === 1 ? "#374151" : "#14b8a6", // Dark gray for category, Teal for leaf
          stroke: "#fff",
          strokeWidth: 2 / (depth + 1e-10),
          strokeOpacity: 1 / (depth + 1e-10),
        }}
      />
      {width > 50 && height > 30 && (
        <text
          x={x + width / 2}
          y={y + height / 2 + 7}
          textAnchor="middle"
          fill="#fff"
          fontSize={10}
        >
          {name}
        </text>
      )}
    </g>
  );
};