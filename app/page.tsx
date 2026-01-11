"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { TrendingUp, Users, Wallet, Clock } from "lucide-react";

// Components
import { ControlPanel } from "@/components/ControlPanel"; // The NEW sidebar we made
import Header from "@/components/Header"; // Your existing header
import ImpactBarChart from "@/components/ImpactBarChart"; // Your existing chart
import TimeSeriesChart from "@/components/TimeSeriesChart"; // Your existing chart
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// API & Types
import { fetchSimulation, SimulationResponse } from "@/lib/api";
import { DEFAULT_PARAMS, SimulationParams } from "@/types/simulation";

// Dynamic Map Import
const IndiaMap = dynamic(() => import("@/components/IndiaMap"), { 
  ssr: false,
  loading: () => <Skeleton className="h-[500px] w-full bg-slate-200" />
});

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SimulationResponse | null>(null);
  
  // 1. NEW: State for the 8 Policy Levers
  const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);

  // 2. EXISTING: State Selection Management
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const handleStateToggle = (stateName: string) => {
    setSelectedStates(prev => {
        if (prev.includes(stateName)) {
            return prev.filter(s => s !== stateName);
        } else {
            return [...prev, stateName];
        }
    });
  };

  // 3. MERGED: Simulation Handler
  const handleSimulation = async () => {
    setLoading(true);
    try {
        // We combine the NEW sliders (params) with the EXISTING state selection
        const requestPayload = {
            ...params,
            selectedStates: selectedStates.length > 0 ? selectedStates : ["All India"] 
        };
        
        // Assuming your API can handle the merged payload
        // You might need to update the `fetchSimulation` type definition to accept `...params`
        const result = await fetchSimulation(requestPayload);
        
        setData(result);
        toast.success("Simulation Updated", {
            description: `Impact analysis based on ${params.syncLevel}% sync level.`
        });
    } catch (error) {
        toast.error("Simulation failed. Please try again.");
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* --- LEFT COLUMN: CONTENT (9 cols) --- */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* KPI Section (Preserved from your code) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <KPICard 
                    title="Total Savings" 
                    value={data ? `₹${data.financial.total_savings_crore} Cr` : "..."} 
                    icon={<Wallet className="h-4 w-4"/>} 
                    loading={loading} 
                 />
                 <KPICard 
                    title="GDP Boost" 
                    value={data ? `+${data.economic.gdp_boost_percent}%` : "..."} 
                    icon={<TrendingUp className="h-4 w-4"/>} 
                    loading={loading} 
                 />
                 <KPICard 
                    title="Staff Released" 
                    value={data ? `${data.administrative.personnel_required_lakh} L` : "..."} 
                    icon={<Users className="h-4 w-4"/>} 
                    loading={loading} 
                 />
                 <KPICard 
                    title="Regions Active" 
                    value={`${selectedStates.length || 'All'}`} 
                    icon={<Clock className="h-4 w-4"/>} 
                    loading={false} 
                 />
            </div>

            {/* Map Section */}
            <div className="grid gap-6">
                 <IndiaMap 
                    selectedStates={selectedStates} 
                    onStateToggle={handleStateToggle} 
                    // Pass syncLevel to map if it supports visualization changes
                    // syncLevel={params.syncLevel} 
                 />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <ImpactBarChart data={data} />
                 <TimeSeriesChart data={data} />
            </div>
          </div>

          {/* --- RIGHT COLUMN: CONTROLS (3 cols) --- */}
          <div className="lg:col-span-3">
             <div className="sticky top-24 space-y-4">
                
                {/* 1. The New Policy Levers Panel */}
                <ControlPanel 
                    params={params} 
                    setParams={setParams} 
                    onRun={handleSimulation} // Wired to the merged handler
                    isRunning={loading} 
                />
                
                {/* 2. Your Existing Selection Summary Card */}
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

// Helper Component (Preserved)
function KPICard({ title, value, icon, loading }: { title: string, value: string, icon: any, loading: boolean }) {
    return (
        <Card className="shadow-sm border-l-4 border-l-amber-500 bg-white dark:bg-zinc-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wide">{title}</CardTitle>
                <div className="text-gray-400">{icon}</div>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-24" />
                ) : (
                    <div className="text-2xl font-bold text-red-900 dark:text-red-400">{value}</div>
                )}
            </CardContent>
        </Card>
    )
}