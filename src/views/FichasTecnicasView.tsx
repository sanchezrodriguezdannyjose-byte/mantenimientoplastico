import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { PlanTemplate } from '../types';
import {
  FileSpreadsheet,
  Clock,
  Repeat,
  Wrench,
  Droplet,
  Cog,
  CheckCircle2,
  PlusCircle,
  FileCheck
} from 'lucide-react';

interface FichasTecnicasViewProps {
  onOpenNewOtForTemplate: (title: string, system: string) => void;
}

export const FichasTecnicasView: React.FC<FichasTecnicasViewProps> = ({ onOpenNewOtForTemplate }) => {
  const { templates } = useMaintenance();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(templates[0]?.id || '');

  const selectedPlan = templates.find(p => p.id === selectedPlanId) || templates[0];

  const getColorClasses = (color: PlanTemplate['color']) => {
    switch (color) {
      case 'cyan':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'amber':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'emerald':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'red':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'purple':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'blue':
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#151c2c] border border-slate-800">
        <h2 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
          Fichas Técnicas Interactivas de Mantenimiento
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Selecciona una actividad de la lista lateral para visualizar el desglose exhaustivo de herramientas, insumos, repuestos y el procedimiento técnico homologado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Activity List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
          {templates.map(plan => {
            const isSelected = plan.id === selectedPlan?.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-cyan-950/20 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 border-l-4 border-l-cyan-400'
                    : 'bg-[#151c2c] border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                    {plan.system}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Repeat className="w-3 h-3 text-cyan-400" />
                    {plan.frecuencia}
                  </span>
                </div>

                <h4 className="text-xs font-bold leading-tight">{plan.titulo}</h4>

                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" /> {plan.tiempo}
                  </span>
                  <span>•</span>
                  <span>{plan.pasos.length} pasos</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Detailed Technical Card */}
        <div className="lg:col-span-7 bg-[#151c2c] border border-slate-800 rounded-2xl p-6 shadow-2xl">
          {selectedPlan ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {selectedPlan.system}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      Frecuencia: {selectedPlan.frecuencia}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> {selectedPlan.tiempo}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {selectedPlan.titulo}
                  </h2>
                </div>

                <button
                  onClick={() => onOpenNewOtForTemplate(selectedPlan.titulo, selectedPlan.system)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <PlusCircle className="w-4 h-4" />
                  Programar OT
                </button>
              </div>

              {/* Resources Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Tools */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="font-bold text-cyan-300 mb-2.5 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Wrench className="w-4 h-4 text-cyan-400" /> Herramientas
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {selectedPlan.herramientas.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Supplies */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="font-bold text-amber-300 mb-2.5 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Droplet className="w-4 h-4 text-amber-400" /> Insumos
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {selectedPlan.insumos.map((ins, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Droplet className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{ins}</span>
                      </li>
                    ))}
                    {selectedPlan.insumos.length === 0 && (
                      <li className="text-slate-500 italic">No requiere insumos directos.</li>
                    )}
                  </ul>
                </div>

                {/* Spare Parts */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <h4 className="font-bold text-purple-300 mb-2.5 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Cog className="w-4 h-4 text-purple-400" /> Repuestos Críticos
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {selectedPlan.repuestos.map((rep, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Cog className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{rep}</span>
                      </li>
                    ))}
                    {selectedPlan.repuestos.length === 0 && (
                      <li className="text-slate-500 italic">No requiere recambios en rutina estándar.</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Procedure Step-by-Step */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Procedimiento de Ejecución Técnica (Homologado ISO 9001)
                </h3>
                <ol className="space-y-2.5 text-xs text-slate-300">
                  {selectedPlan.pasos.map((paso, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{paso}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Criteria */}
              {selectedPlan.criterioAceptacion && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-300">Criterio de Aceptación:</strong>
                    {selectedPlan.criterioAceptacion}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              Selecciona una actividad para ver su detalle técnico.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
