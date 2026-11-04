import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { WorkOrderType, WorkOrderPriority, FrequencyType } from '../types';
import { X, Plus, Trash2, FileCheck, Wrench, ShieldAlert } from 'lucide-react';

interface NewWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedEquipmentId?: string;
  preselectedTitle?: string;
  preselectedSystem?: string;
  preselectedType?: WorkOrderType;
}

export const NewWorkOrderModal: React.FC<NewWorkOrderModalProps> = ({
  isOpen,
  onClose,
  preselectedEquipmentId,
  preselectedTitle,
  preselectedSystem,
  preselectedType
}) => {
  const { equipments, templates, addWorkOrder } = useMaintenance();

  const [equipmentId, setEquipmentId] = useState<string>(preselectedEquipmentId || equipments[0]?.id || '');
  const [type, setType] = useState<WorkOrderType>(preselectedType || 'Preventivo');
  const [priority, setPriority] = useState<WorkOrderPriority>('Media');
  const [title, setTitle] = useState<string>(preselectedTitle || '');
  const [system, setSystem] = useState<string>(preselectedSystem || 'Mecánico');
  const [frequency, setFrequency] = useState<FrequencyType>('Mensual');
  const [scheduledDate, setScheduledDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [estimatedTime, setEstimatedTime] = useState<string>('1.5 Horas');
  const [assignedTechnician, setAssignedTechnician] = useState<string>('Carlos Méndez (Técnico)');
  const [verifierSupervisor, setVerifierSupervisor] = useState<string>('Ing. Roberto Silva');
  const [observations, setObservations] = useState<string>('');

  const [steps, setSteps] = useState<string[]>([
    'Aplicar protocolo de Bloqueo y Etiquetado (LOTO).',
    'Inspeccionar componentes del sistema y verificar desgastes.',
    'Efectuar ajustes, aprietes y limpieza.',
    'Efectuar prueba operativa y registrar parámetros.'
  ]);
  const [newStepText, setNewStepText] = useState('');

  // Auto-populate when selecting a plan template
  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tplId = e.target.value;
    if (!tplId) return;
    const tpl = templates.find(t => t.id === tplId);
    if (tpl) {
      setTitle(tpl.titulo);
      setSystem(tpl.system);
      setFrequency(tpl.frecuencia);
      setEstimatedTime(tpl.tiempo);
      setSteps(tpl.pasos);
    }
  };

  const handleAddStep = () => {
    if (newStepText.trim()) {
      setSteps(prev => [...prev, newStepText.trim()]);
      setNewStepText('');
    }
  };

  const handleRemoveStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEq = equipments.find(eq => eq.id === equipmentId);
    if (!targetEq) return;

    addWorkOrder({
      type,
      equipmentId: targetEq.id,
      equipmentTag: targetEq.tag,
      equipmentName: targetEq.name,
      status: 'Pendiente',
      priority,
      scheduledDate,
      title: title || `Mantenimiento ${system} en ${targetEq.tag}`,
      system,
      frequency,
      estimatedTime,
      assignedTechnician,
      verifierSupervisor,
      plantManager: 'Ing. Danny Sánchez',
      procedureSteps: steps.map(s => ({ step: s, completed: false })),
      toolsUsed: ['Llaves de mano', 'Multímetro / Torquímetro'],
      suppliesUsed: ['Paños industriales', 'Desengrasante'],
      partsConsumed: [],
      observations
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Generar Orden de Trabajo (ISO 9001)</h3>
              <p className="text-xs text-slate-400">Asignación técnica vinculada al activo de planta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Quick Template Picker */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
            <label className="block text-slate-300 font-semibold mb-1">
              Opcional: Cargar desde Plan Maestro
            </label>
            <select
              onChange={handleTemplateSelect}
              className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs"
            >
              <option value="">-- Seleccionar rutina predefinida --</option>
              {templates.map(tpl => (
                <option key={tpl.id} value={tpl.id}>
                  [{tpl.system} - {tpl.frecuencia}] {tpl.titulo}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Equipment Selection */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Equipo / Activo *</label>
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

            {/* Work Order Type */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tipo de Mantenimiento</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as WorkOrderType)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              >
                <option value="Preventivo">Preventivo (PM)</option>
                <option value="Correctivo">Correctivo (Avería / Parada)</option>
                <option value="Predictivo">Predictivo (Termografía / Análisis)</option>
                <option value="Montaje_Molde">Montaje de Molde</option>
                <option value="Overhaul">Overhaul Mayor</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Título de la Actividad *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej: Verificación y lubricación de rodillera de cierre"
              required
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Sistema</label>
              <select
                value={system}
                onChange={e => setSystem(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              >
                <option value="Mecánico">Mecánico</option>
                <option value="Hidráulico">Hidráulico</option>
                <option value="Neumático">Neumático</option>
                <option value="Eléctrico">Eléctrico</option>
                <option value="Automatización">Automatización</option>
                <option value="Chiller">Chiller</option>
                <option value="Compresor">Compresor</option>
                <option value="Planta Eléctrica">Planta Eléctrica</option>
                <option value="Moldes">Moldes</option>
                <option value="Seguridad">Seguridad</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Frecuencia</label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as FrequencyType)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              >
                <option value="Diario">Diario</option>
                <option value="Semanal">Semanal</option>
                <option value="Mensual">Mensual</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Prioridad</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as WorkOrderPriority)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-semibold"
              >
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
                <option value="Critica">Crítica (Urgente)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Fecha Programada</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={e => setScheduledDate(e.target.value)}
                required
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Técnico Ejecutor Asignado</label>
              <input
                type="text"
                value={assignedTechnician}
                onChange={e => setAssignedTechnician(e.target.value)}
                placeholder="Nombre del técnico responsable"
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Supervisor de Calidad / Verificador</label>
              <input
                type="text"
                value={verifierSupervisor}
                onChange={e => setVerifierSupervisor(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>
          </div>

          {/* Procedure Steps List */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
              <span>Procedimiento Paso a Paso ({steps.length} pasos)</span>
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-xs">{st}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={newStepText}
                onChange={e => setNewStepText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStep();
                  }
                }}
                placeholder="Agregar paso al procedimiento..."
                className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddStep}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold border border-slate-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Observaciones Iniciales</label>
            <textarea
              value={observations}
              onChange={e => setObservations(e.target.value)}
              rows={2}
              placeholder="Instrucciones específicas, precauciones de seguridad, etc."
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs resize-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-700 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              Crear Orden de Trabajo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
