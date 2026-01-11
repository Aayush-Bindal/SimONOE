"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { 
  Activity, 
  IndianRupee, 
  Gavel, 
  Briefcase, 
  TrendingUp, 
  Map as MapIcon, 
  List, 
  Wallet, 
  Users, 
  Clock 
} from "lucide-react";

// Components
import { ControlPanel } from "@/components/ControlPanel";
import { ExportMenu } from "@/components/ExportMenu";
import Header from "@/components/Header";
import ImpactBarChart from "@/components/ImpactBarChart";
import TimeSeriesChart from "@/components/TimeSeriesChart";
import MetricTreemap from "@/components/MetricTreemap";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// API & Types
import { fetchSimulation } from "@/lib/api";
import { DEFAULT_PARAMS, SimulationParams, SimulationResponse } from "@/types/simulation";

// Dynamic Map with a taller loading skeleton
const IndiaMap = dynamic(() => import("@/components/IndiaMap"), { 
  ssr: false,
  loading: () => <Skeleton className="h-[600px] w-full bg-zinc-100 rounded-none" />
});

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SimulationResponse | null>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  // 1. State for the Policy Levers (New)
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);

  // 2. State for State Selection (Existing)
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const handleStateToggle = (stateName: string) => {
    setSelectedStates(prev => 
        prev.includes(stateName) ? prev.filter(s => s !== stateName) : [...prev, stateName]
    );
  };

  // 3. Merged Simulation Handler
  const handleSimulation = async () => {
    setLoading(true);
    try {
        // We combine the NEW sliders (params) with the EXISTING state selection
        const requestPayload = { 
            ...params, 
            selectedStates: selectedStates.length > 0 ? selectedStates : ["All India"] 
        };
        
        const result = await fetchSimulation(requestPayload);
        
        setData(result);
        toast.success("Simulation Complete", { description: "Impact analysis updated successfully." });
    } catch (error) {
        console.error(error);
        toast.error("Simulation failed", { description: "Please check your network connection." });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50 dark:bg-zinc-950 font-sans text-zinc-900">
      {/* 1. Fixed Header */}
      <Header />

      <main className="flex-1 container mx-auto p-6 lg:p-8 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- LEFT COLUMN: VISUALIZATION AREA (9 cols) --- */}
          <div className="lg:col-span-9 space-y-8">

            {/* Top Bar: Title & Export */}
            <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-3">
                  <Activity className="w-6 h-6 text-red-700" />
                  Simulation Dashboard
                </h1>
                <p className="text-sm text-zinc-500">Real-time impact analysis based on HLC & Law Commission parameters</p>
              </div>
              {data && <ExportMenu data={data} targetRef={dashboardRef} />}
            </div>

            {/* RESULTS CONTENT WRAPPER */}
            <div ref={dashboardRef} className="space-y-8">
              
              {/* 2. KEY METRICS ROW */}
              {data ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                  <MetricCard 
                    title="Financial Impact"
                    color="green"
                    icon={<IndianRupee className="w-4 h-4" />}
                    items={[
                      { label: "Total Savings", value: `₹${data.financial.total_savings_crore} Cr`, highlight: true },
                      { label: "Savings %", value: `${data.financial.savings_percent}%` },
                      { label: "EVM Cost", value: `₹${data.financial.evm_extra_cost_crore} Cr` },
                    ]}
                  />
                  <MetricCard 
                    title="Governance"
                    color="amber"
                    icon={<Gavel className="w-4 h-4" />}
                    items={[
                      { label: "Turnout Boost", value: `+${data.governance.avg_turnout_boost_percent}%`, highlight: true },
                      { label: "MCC Reduction", value: `${data.governance.mcc_days_reduction_annual} Days` },
                      { label: "Crime Drop", value: `${data.governance.crime_rate_reduction_per_100k}/100k` },
                    ]}
                  />
                  <MetricCard 
                    title="Administrative"
                    color="blue"
                    icon={<Briefcase className="w-4 h-4" />}
                    items={[
                      { label: "Personnel Req", value: `${data.administrative.personnel_required_lakh} Lakh` },
                      { label: "EVM Scaling", value: `${data.administrative.evm_scaling_factor}x` },
                      { label: "Phases", value: `${data.administrative.phase_count}` },
                    ]}
                  />
                  <MetricCard 
                    title="Economic Projections"
                    color="red"
                    icon={<TrendingUp className="w-4 h-4" />}
                    items={[
                      { label: "GDP Boost", value: `${data.economic.gdp_boost_percent}%`, highlight: true },
                      { label: "Inflation", value: `${data.economic.inflation_change_pp} pp` },
                      { label: "Fiscal Deficit", value: `${data.economic.fiscal_deficit_change_pp} pp` },
                    ]}
                  />
                </div>
              ) : (
                <EmptyState />
              )}

              {/* 3. BIG MAP & DATA TABLE SECTION */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[600px]">
                 {/* MAP (Takes 2/3 width) */}
                 <Card className="xl:col-span-2 border-zinc-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <CardHeader className="py-4 px-6 border-b bg-white flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-2">
                        <MapIcon className="w-4 h-4" /> Select States for Simulation
                      </CardTitle>
                      {selectedStates.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {selectedStates.length} Selected
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="p-0 flex-1 relative bg-zinc-50">
                        {/* Map Container fills remaining height */}
                        <div className="absolute inset-0">
                           <IndiaMap 
                                selectedStates={selectedStates} 
                                onStateToggle={handleStateToggle}
                                stateData={data?.state_wise || []}
                           />
                        </div>
                        {/* Legend Overlay */}
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-lg border shadow-sm text-xs space-y-1">
                          <div className="font-semibold mb-1">Interaction Guide</div>
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-800 rounded-sm"></div> Selected Region</div>
                          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-zinc-200 rounded-sm border"></div> Not Selected</div>
                        </div>
                    </CardContent>
                 </Card>
                 
                 {/* TABLE (Takes 1/3 width) */}
                 <Card className="xl:col-span-1 border-zinc-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <CardHeader className="py-4 px-5 border-b bg-white">
                        <CardTitle className="text-sm font-bold text-zinc-600 uppercase tracking-wider flex items-center gap-2">
                           <List className="w-4 h-4" /> Regional Data
                        </CardTitle>
                    </CardHeader>
                    <div className="flex-1 overflow-auto bg-white">
                        {data?.state_wise && data.state_wise.length > 0 ? (
                            <Table>
                                <TableHeader className="sticky top-0 bg-zinc-50 shadow-sm z-10">
                                    <TableRow>
                                        <TableHead className="w-[80px] text-xs font-bold">State</TableHead>
                                        <TableHead className="text-right text-xs font-bold">Savings (Cr)</TableHead>
                                        <TableHead className="text-right text-xs font-bold">T/O Boost</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.state_wise.map((state) => (
                                        <TableRow key={state.state_code} className="hover:bg-zinc-50/80 transition-colors">
                                            <TableCell className="font-medium text-xs py-3">{state.state_code}</TableCell>
                                            <TableCell className="text-right text-xs py-3 font-mono text-green-700">
                                              ₹{state.savings_crore.toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-right text-xs py-3 font-mono text-amber-700">
                                              +{state.turnout_boost}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-400 p-6 text-center">
                                <List className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-xs">Run simulation to generate regional breakdown.</p>
                            </div>
                        )}
                    </div>
                 </Card>
              </div>

              {/* 4. CHARTS ROW */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[320px]">
                  <ImpactBarChart data={data} />
                  <TimeSeriesChart data={data} horizon={params.timeHorizon} />
                  <MetricTreemap data={data} />
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: SIDEBAR (3 cols) --- */}
          <div className="lg:col-span-3">
             <div className="sticky top-6 space-y-4">
               
               {/* 1. The Policy Levers Panel */}
               <ControlPanel 
                   params={params} 
                   setParams={setParams} 
                   onRun={handleSimulation} 
                   isRunning={loading} 
               />
               
               {/* 2. THE RESTORED SECTION: Selection Summary Card */}
               <Card className="border-l-4 border-l-blue-900 shadow-sm">
                   <CardHeader className="py-3 bg-white dark:bg-zinc-900">
                       <CardTitle className="text-sm font-semibold">Selected Regions ({selectedStates.length})</CardTitle>
                   </CardHeader>
                   <CardContent className="py-2 text-xs text-gray-600 dark:text-gray-400 max-h-40 overflow-y-auto bg-white dark:bg-zinc-900">
                       {selectedStates.length === 0 ? (
                           <span className="italic">All India (Default)</span>
                       ) : (
                           <div className="flex flex-wrap gap-1">
                               {selectedStates.map(s => (
                                   <span key={s} className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                                       {s}
                                   </span>
                               ))}
                           </div>
                       )}
                   </CardContent>
               </Card>

             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function MetricCard({ title, color, icon, items }: any) {
  const colorMap: any = {
    green: "border-green-600 text-green-700",
    amber: "border-amber-600 text-amber-700",
    blue: "border-blue-600 text-blue-700",
    red: "border-red-800 text-red-800",
  };
  
  return (
    <Card className={`border-l-4 shadow-sm bg-white hover:shadow-md transition-shadow ${colorMap[color].split(" ")[0]}`}>
      <CardContent className="p-5">
        <div className={`flex items-center gap-2 mb-4 ${colorMap[color].split(" ")[1]}`}>
          {icon}
          <h3 className="text-xs font-bold uppercase tracking-widest">{title}</h3>
        </div>
        <div className="space-y-3">
          {items.map((item: any, i: number) => (
            <div key={i} className="flex justify-between items-baseline">
              <span className="text-sm text-zinc-500 font-medium">{item.label}</span>
              <span className={`font-mono ${item.highlight ? "text-lg font-bold text-zinc-900" : "text-sm font-semibold text-zinc-700"}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
       {[1,2,3,4].map((i) => (
         <div key={i} className="h-40 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 flex items-center justify-center">
            <span className="text-zinc-400 text-sm font-medium">Metric Placeholder</span>
         </div>
       ))}
    </div>
  );
}