"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Play, SlidersHorizontal } from "lucide-react";
import { SimulationParams } from "@/types/simulation";

interface ControlPanelProps {
  params: SimulationParams;
  setParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  onRun: () => void;
  isRunning: boolean;
}

interface LeverConfig {
  key: keyof SimulationParams;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  description: string;
}

const LEVERS: LeverConfig[] = [
  {
    key: "syncLevel",
    label: "Sync Level",
    unit: "%",
    min: 0,
    max: 100,
    step: 1,
    description: "Target percentage of states/bodies to synchronize in cycle",
  },
  {
    key: "syncWindow",
    label: "Sync Window",
    unit: "Days",
    min: 0,
    max: 180,
    step: 5,
    description: "Allowable drift window for simultaneous election dates",
  },
  {
    key: "midTermRisk",
    label: "Mid-Term Risk",
    unit: "%",
    min: 0,
    max: 20,
    step: 0.5,
    description: "Probability of assembly dissolution before term end",
  },
  {
    key: "maxTermAdjust",
    label: "Max Term Adjust",
    unit: "Months",
    min: 0,
    max: 24,
    step: 1,
    description: "Maximum extension/curtailment allowed for alignment",
  },
  {
    key: "electionPhases",
    label: "Election Phases",
    unit: "",
    min: 1,
    max: 9,
    step: 1,
    description: "Number of voting phases across the country",
  },
  {
    key: "monteCarloRuns",
    label: "Monte Carlo Runs",
    unit: "",
    min: 100,
    max: 1000,
    step: 50,
    description: "Iterations for probabilistic cost/stability modeling",
  },
  {
    key: "timeHorizon",
    label: "Time Horizon",
    unit: "Years",
    min: 5,
    max: 30,
    step: 1,
    description: "Projection period for economic impact analysis",
  },
];

export function ControlPanel({ params, setParams, onRun, isRunning }: ControlPanelProps) {
  const handleChange = (key: keyof SimulationParams, value: number[]) => {
    setParams((prev) => ({ ...prev, [key]: value[0] }));
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-xl w-80">
      {/* Header */}
      <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <h2 className="text-sm font-bold tracking-wider text-zinc-600 dark:text-zinc-400 uppercase flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Policy Levers
        </h2>
      </div>

      {/* Sliders Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-7 custom-scrollbar">
        <TooltipProvider>
          {LEVERS.map((lever) => (
            <div key={lever.key} className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {lever.label}
                  </label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-600 cursor-help transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-xs">
                      {lever.description}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Badge variant="secondary" className="bg-zinc-100 text-zinc-800 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-200 px-2 min-w-[3rem] justify-center text-xs font-mono border-zinc-200">
                  {params[lever.key]}
                  <span className="text-zinc-400 ml-0.5 text-[10px]">{lever.unit}</span>
                </Badge>
              </div>

              <Slider
                value={[params[lever.key]]}
                min={lever.min}
                max={lever.max}
                step={lever.step}
                onValueChange={(val) => handleChange(lever.key, val)}
                className="[&_.range]:bg-zinc-900 dark:[&_.range]:bg-zinc-100"
              />
            </div>
          ))}
        </TooltipProvider>
      </div>

      {/* Footer / Run Button */}
      <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-4">
        <Button
          onClick={onRun}
          disabled={isRunning}
          className="w-full h-12 text-base font-semibold shadow-md
            bg-red-900 hover:bg-amber-600 text-white
            dark:bg-red-950 dark:hover:bg-amber-700 dark:text-zinc-100
            transition-all duration-300 ease-out"
        >
          {isRunning ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full"/>
              Simulating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" /> Run Simulation
            </span>
          )}
        </Button>

        <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-500 leading-tight">
          Simulations based on 2024 HLC Report & 2018 Law Commission data – indicative only.
        </p>
      </div>
    </div>
  );
}