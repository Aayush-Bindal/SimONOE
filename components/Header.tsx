import { Building2 } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-gov-gold bg-gov-maroon text-white shadow-lg">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-3">
            {/* Ashoka Pillar / Emblem Mock */}
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gov-gold/10 border-2 border-gov-gold p-1">
               <Building2 className="h-6 w-6 text-gov-gold" />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white uppercase font-sans">
                    Bharat Governance Simulator
                </h1>
                <p className="text-[10px] text-gov-gold uppercase tracking-widest">
                    One Nation • One Election
                </p>
            </div>
        </div>
        <div className="ml-auto flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-xs text-white/80">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>System Operational</span>
             </div>
             <div className="bg-white/10 px-3 py-1 rounded border border-white/20 text-xs font-mono">
                v2.4.0-GOV
             </div>
        </div>
      </div>
    </header>
  );
}