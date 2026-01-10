"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, RotateCcw } from "lucide-react";
import { SimulationRequest } from "@/lib/api";

interface ControlPanelProps {
  onRunSimulation: (params: SimulationRequest) => void;
  loading: boolean;
}

export default function ControlPanel({ onRunSimulation, loading }: ControlPanelProps) {
  const [syncLevel, setSyncLevel] = useState([85]);
  const [windowDays, setWindowDays] = useState([45]);
  const [metric, setMetric] = useState<any>("financial");

  const handleRun = () => {
    onRunSimulation({
      syncLevel: syncLevel[0],
      syncWindowDays: windowDays[0],
      midTermProb: 0.05,
      selectedStates: [], // Default all
      metricFocus: metric,
    });
  };

  return (
    <Card className="h-full border-l-4 border-l-gov-gold rounded-none md:rounded-lg shadow-sm">
      <CardHeader className="bg-gov-maroon/5 pb-4">
        <CardTitle className="text-lg text-gov-maroon font-serif font-bold flex items-center gap-2">
           <span>Control Parameters</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        
        {/* Sync Level Slider */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="font-semibold text-gray-700">Synchronization Level</Label>
            <span className="text-sm font-mono text-gov-maroon font-bold">{syncLevel}%</span>
          </div>
          <Slider 
            value={syncLevel} 
            onValueChange={setSyncLevel} 
            max={100} 
            step={1}
            className="cursor-pointer" 
          />
          <p className="text-xs text-gray-500">Percentage of states aligning their cycles.</p>
        </div>

        {/* Sync Window Slider */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <Label className="font-semibold text-gray-700">Election Phase Window</Label>
            <span className="text-sm font-mono text-gov-maroon font-bold">{windowDays} Days</span>
          </div>
          <Slider 
            value={windowDays} 
            onValueChange={setWindowDays} 
            max={90} 
            step={5} 
          />
        </div>

        {/* Metric Focus */}
        <div className="space-y-3">
          <Label className="font-semibold text-gray-700">Impact Focus</Label>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger>
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="financial">Fiscal Impact (INR)</SelectItem>
              <SelectItem value="governance">Governance Efficiency</SelectItem>
              <SelectItem value="administrative">Logistics Load</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 space-y-3">
            <Button 
                onClick={handleRun} 
                disabled={loading}
                className="w-full bg-gov-maroon hover:bg-gov-maroon/90 text-white font-bold h-12 shadow-md transition-all active:scale-95"
            >
                {loading ? "Calculating..." : (
                    <>
                        <Play className="mr-2 h-4 w-4" /> Run Simulation
                    </>
                )}
            </Button>
            <Button variant="outline" className="w-full text-gray-600">
                <RotateCcw className="mr-2 h-4 w-4" /> Reset Defaults
            </Button>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-800 mt-4">
            <strong>Disclaimer:</strong> This is a simulation model based on projected data. Official estimates may vary.
        </div>

      </CardContent>
    </Card>
  );
}