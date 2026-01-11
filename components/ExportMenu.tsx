"use client";

import React, { useState } from "react";
import { Download, FileSpreadsheet, Image as ImageIcon, FileText, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SimulationResponse } from "@/types/simulation";

interface ExportMenuProps {
  data: SimulationResponse | null;
  targetRef: React.RefObject<HTMLDivElement | null>; // Ref to the dashboard container
}

export function ExportMenu({ data, targetRef }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);

  // Helper: Flatten JSON to CSV
  const downloadCSV = () => {
    if (!data) return;

    const rows = [
      ["Category", "Metric", "Value", "Unit/Details"], // Header
      // Financial
      ["Financial", "Total Savings", data.financial.total_savings_crore, "Crore INR"],
      ["Financial", "Savings %", data.financial.savings_percent, "%"],
      ["Financial", "EVM Extra Cost", data.financial.evm_extra_cost_crore, "Crore INR"],
      // Governance
      ["Governance", "Turnout Boost", data.governance.avg_turnout_boost_percent, "%"],
      ["Governance", "MCC Reduction", data.governance.mcc_days_reduction_annual, "Days/Year"],
      ["Governance", "Crime Reduction", data.governance.crime_rate_reduction_per_100k, "Per 100k"],
      // Administrative
      ["Administrative", "Personnel Required", data.administrative.personnel_required_lakh, "Lakh"],
      ["Administrative", "EVM Scaling", data.administrative.evm_scaling_factor, "Factor"],
      ["Administrative", "Phase Count", data.administrative.phase_count, "Phases"],
      // Economic
      ["Economic", "GDP Boost", data.economic.gdp_boost_percent, "%"],
      ["Economic", "Inflation Change", data.economic.inflation_change_pp, "pp"],
      ["Economic", "Fiscal Deficit Change", data.economic.fiscal_deficit_change_pp, "pp"],
      [], // Empty row separator
      ["State Wise Data"],
      ["State Code", "Savings (Cr)", "Turnout Boost (%)"], // Sub-header
      ...data.state_wise.map((s) => [s.state_code, s.savings_crore, s.turnout_boost]),
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ONOE_Simulation_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper: Download PNG
  const downloadPNG = async () => {
    if (!targetRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(targetRef.current, { scale: 2, useCORS: true });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = "ONOE_Charts.png";
      link.click();
    } catch (err) {
      console.error("PNG Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Helper: Download PDF
  const downloadPDF = async () => {
    if (!targetRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(targetRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // If content is long, add pages
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      // Disclaimer footer
      pdf.setFontSize(8);
      pdf.text("Based on 2024 HLC Report – indicative only", 10, pdfHeight - 10);
      
      pdf.save("ONOE_Dashboard.pdf");
    } catch (err) {
      console.error("PDF Export failed:", err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!data) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          disabled={isExporting}
          className="bg-red-900 hover:bg-amber-600 text-white border border-red-950 shadow-sm transition-all gap-2"
        >
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export Results
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <DropdownMenuLabel>Download Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={downloadCSV} className="cursor-pointer gap-2">
          <FileSpreadsheet className="h-4 w-4 text-green-600" />
          <span>Results as CSV</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={downloadPNG} className="cursor-pointer gap-2">
          <ImageIcon className="h-4 w-4 text-blue-600" />
          <span>Charts as PNG</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={downloadPDF} className="cursor-pointer gap-2">
          <FileText className="h-4 w-4 text-red-600" />
          <span>Dashboard as PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}