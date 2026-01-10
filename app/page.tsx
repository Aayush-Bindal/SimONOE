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

// Dynamically import map to avoid SSR issues
const IndiaMap = dynamic(() => import("@/components/IndiaMap"), { 
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full bg-slate-200" />
});

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SimulationResponse | null>(null);

  // Initial load
  useEffect(() => {
    handleSimulation({
        syncLevel: 85,
        syncWindowDays: 45,
        midTermProb: 0.05,
        selectedStates: [],
        metricFocus: 'financial'
    });
  }, []);

  const handleSimulation = async (params: SimulationRequest) => {
    setLoading(true);
    try {
        const result = await fetchSimulation(params);
        setData(result);
        toast.success("Simulation completed successfully");
    } catch (error) {
        toast.error("Simulation failed. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Visualizations (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KPICard 
                    title="Total Savings" 
                    value={data ? `₹${data.financial.total_savings_crore} Cr` : "..."} 
                    icon={<Wallet className="h-4 w-4 text-gov-maroon" />}
                    loading={loading}
                />
                <KPICard 
                    title="GDP Boost" 
                    value={data ? `+${data.economic.gdp_boost_percent}%` : "..."} 
                    icon={<TrendingUp className="h-4 w-4 text-green-600" />}
                    loading={loading}
                />
                <KPICard 
                    title="Staff Released" 
                    value={data ? `${data.administrative.personnel_required_lakh} L` : "..."} 
                    icon={<Users className="h-4 w-4 text-blue-600" />}
                    loading={loading}
                />
                <KPICard 
                    title="MCC Reduced" 
                    value={data ? `${data.governance.mcc_days_reduction_annual} Days` : "..."} 
                    icon={<Clock className="h-4 w-4 text-orange-600" />}
                    loading={loading}
                />
            </div>

            {/* Map Section */}
            <div className="grid gap-6">
                 <IndiaMap />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading && !data ? (
                    <>
                        <Skeleton className="h-[300px] w-full" />
                        <Skeleton className="h-[300px] w-full" />
                    </>
                ) : (
                    <>
                        <ImpactBarChart data={data} />
                        <TimeSeriesChart data={data} />
                    </>
                )}
            </div>
          </div>

          {/* RIGHT COLUMN: Controls (3 cols) */}
          <div className="lg:col-span-3">
             <div className="sticky top-24">
                <ControlPanel onRunSimulation={handleSimulation} loading={loading} />
             </div>
          </div>

        </div>
      </main>
      
      <footer className="bg-white border-t py-6 text-center text-sm text-gray-500">
         <p>© 2026 Government of India Simulation Portal. For official use only.</p>
      </footer>
    </div>
  );
}

function KPICard({ title, value, icon, loading }: { title: string, value: string, icon: any, loading: boolean }) {
    return (
        <Card className="shadow-sm border-l-4 border-l-gov-gold">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                {loading ? (
                    <Skeleton className="h-8 w-24" />
                ) : (
                    <div className="text-2xl font-bold text-gov-maroon">{value}</div>
                )}
            </CardContent>
        </Card>
    )
}