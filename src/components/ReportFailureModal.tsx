import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { X, Flame, AlertTriangle, ShieldAlert } from 'lucide-react';

interface ReportFailureModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedEquipmentId?: string;
  preselectedSymptom?: string;
  preselectedSystem?: string;
}

export const ReportFailureModal: React.FC<ReportFailureModalProps> = ({
  isOpen,
  onClose,
  preselectedEquipmentId,
  preselectedSymptom,
  preselectedSystem
}) => {
  const { equipments, reportFailureIncident } = useMaintenance();

  const [equipmentId, setEquipmentId] = useState(preselectedEquipmentId || equipments[0]?.id || '');
  const [system, setSystem] = useState(preselectedSystem || 'Hidráulico');
  const [symptom, setSymptom] = useState(preselectedSymptom || '');
  const [severity, setSeverity] = useState<'Critica' | 'Alta' | 'Media' | 'Leve'>('Critica');
  const [generateOt, setGenerateOt] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptom.trim()) return;

    reportFailureIncident(symptom.trim(), system, equipmentId, severity, generateOt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#151c2c] border border-rose-500/50 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-rose-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Flame className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Reportar Falla / Parada No Planificada</h3>
              <p className="text-xs text-rose-300">Generación inmediata de OT Correctiva vinculada</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Equipo Afectado *</label>
            <select
              value={equipmentId}
              onChange={e => setEquipmentId(e.target.value)}
              required
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-medium"
            >
              {equipments.map(eq => (
                <option key={eq.id} value={eq.id}>
                  {eq.tag} - {eq.name} ({eq.location})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sistema Involucrado</label>
              <select
                value={system}
                onChange={e => setSystem(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              >
                <option value="Hidráulico">Hidráulico</option>
                <option value="Mecánico">Mecánico</option>
                <option value="Neumático">Neumático</option>
                <option value="Eléctrico">Eléctrico</option>
                <option value="Automatización">Automatización</option>
                <option value="Chiller">Chiller</option>
                <option value="Compresor">Compresor</option>
                <option value="Planta Eléctrica">Planta Eléctrica</option>
                <option value="Moldes">Moldes</option>
                <option value="Proceso">Proceso / Calidad</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Severidad</label>
              <select
                value={severity}
                onChange={e => setSeverity(e.target.value as any)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-bold"
              >
                <option value="Critica">Crítica (Máquina Detenida)</option>
                <option value="Alta">Alta (Riesgo Operativo)</option>
                <option value="Media">Media (Rendimiento Degradado)</option>
                <option value="Leve">Leve (Observación Menor)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Descripción del Síntoma / Falla Observada *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Ej: Fuga profusa de aceite en manguera de cierre; alarma de sobrecalentamiento activa; ruido fuerte..."
              value={symptom}
              onChange={e => setSymptom(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs resize-none"
            />
          </div>

          <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-2.5">
            <input
              type="checkbox"
              id="gen-ot-check"
              checked={generateOt}
              onChange={e => setGenerateOt(e.target.checked)}
              className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
            />
            <label htmlFor="gen-ot-check" className="text-xs text-slate-200 cursor-pointer font-medium">
              Generar Orden de Trabajo Correctiva (OT) automáticamente y cambiar estado del equipo
            </label>
          </div>

          <div className="pt-3 border-t border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              Registrar Incidente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
