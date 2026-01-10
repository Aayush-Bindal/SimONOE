"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import Header from "@/components/Header";
import ControlPanel from "@/components/ControlPanel";
import ImpactBarChart from "@/components/ImpactBarChart";
import TimeSeriesChart from "@/components/TimeSeriesChart";
import { fetchSimulation, SimulationRequest, SimulationResponse } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, Clock } from "lucide-react";

// Dynamic import for Map
const IndiaMap = dynamic(() => import("@/components/IndiaMap"), { 
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full bg-slate-200" />
});

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SimulationResponse | null>(null);
  
  // STATE SELECTION MANAGEMENT
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

  const handleSimulation = async (params: SimulationRequest) => {
    setLoading(true);
    try {
        // Pass the selected states to the API
        const requestPayload = {
            ...params,
            selectedStates: selectedStates.length > 0 ? selectedStates : ["All India"] 
        };
        
        const result = await fetchSimulation(requestPayload);
        setData(result);
        toast.success("Simulation Updated", {
            description: `Analyzing impact for ${selectedStates.length || 'All'} regions.`
        });
    } catch (error) {
        toast.error("Simulation failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  // ... (Rest of the JSX remains similar, just update the Map component props)

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9 space-y-6">
            
            {/* KPI Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {/* ... KPI Cards ... */}
                 <KPICard title="Total Savings" value={data ? `₹${data.financial.total_savings_crore} Cr` : "..."} icon={<Wallet className="h-4 w-4"/>} loading={loading} />
                 <KPICard title="GDP Boost" value={data ? `+${data.economic.gdp_boost_percent}%` : "..."} icon={<TrendingUp className="h-4 w-4"/>} loading={loading} />
                 <KPICard title="Staff Released" value={data ? `${data.administrative.personnel_required_lakh} L` : "..."} icon={<Users className="h-4 w-4"/>} loading={loading} />
                 <KPICard title="Regions Active" value={`${selectedStates.length || 'All'}`} icon={<Clock className="h-4 w-4"/>} loading={false} />
            </div>

            {/* Map Section */}
            <div className="grid gap-6">
                 <IndiaMap 
                    selectedStates={selectedStates} 
                    onStateToggle={handleStateToggle} 
                 />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ... Charts ... */}
                 <ImpactBarChart data={data} />
                 <TimeSeriesChart data={data} />
            </div>
          </div>

          <div className="lg:col-span-3">
             <div className="sticky top-24">
                <ControlPanel 
                    onRunSimulation={handleSimulation} 
                    loading={loading}
                    // Pass selected count to control panel if needed
                />
                
                {/* Selection Summary */}
                <Card className="mt-4 border-l-4 border-l-gov-navy">
                    <CardHeader className="py-3">
                        <CardTitle className="text-sm">Selected Regions ({selectedStates.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 text-xs text-gray-600 max-h-40 overflow-y-auto">
                        {selectedStates.length === 0 ? (
                            <span className="italic">All India (Default)</span>
                        ) : (
                            <div className="flex flex-wrap gap-1">
                                {selectedStates.map(s => (
                                    <span key={s} className="bg-gov-gold/20 px-1.5 py-0.5 rounded border border-gov-gold/30">
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

// ... KPICard component ...
function KPICard({ title, value, icon, loading }: { title: string, value: string, icon: any, loading: boolean }) {
    return (
        <Card className="shadow-sm border-l-4 border-l-gov-gold">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? <Skeleton className="h-8 w-24" /> : <div className="text-2xl font-bold text-gov-maroon">{value}</div>}
            </CardContent>
        </Card>
    )
}