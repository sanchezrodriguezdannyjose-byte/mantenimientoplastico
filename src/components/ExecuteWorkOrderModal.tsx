import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { WorkOrder } from '../types';
import { X, CheckCircle2, Wrench, Package, Clock, ShieldCheck, Plus, Trash2 } from 'lucide-react';

interface ExecuteWorkOrderModalProps {
  order: WorkOrder | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ExecuteWorkOrderModal: React.FC<ExecuteWorkOrderModalProps> = ({
  order,
  isOpen,
  onClose
}) => {
  const { inventory, completeWorkOrderWithDeductions } = useMaintenance();

  const [stepsCompleted, setStepsCompleted] = useState<boolean[]>(
    order ? order.procedureSteps.map(s => s.completed) : []
  );
  const [realHours, setRealHours] = useState<number>(order?.realDurationHours || 1.5);
  const [observations, setObservations] = useState<string>(order?.observations || '');
  const [technicianSig, setTechnicianSig] = useState<string>(order?.assignedTechnician || '');
  const [supervisorSig, setSupervisorSig] = useState<string>(order?.verifierSupervisor || '');

  // Consumed parts state: [{ partId, quantity }]
  const [consumedParts, setConsumedParts] = useState<{ partId: string; quantity: number }[]>([]);
  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [selectedQty, setSelectedQty] = useState<number>(1);

  if (!isOpen || !order) return null;

  const toggleStep = (index: number) => {
    setStepsCompleted(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const handleAddPart = () => {
    if (!selectedPartId || selectedQty <= 0) return;
    const existingIndex = consumedParts.findIndex(p => p.partId === selectedPartId);
    if (existingIndex >= 0) {
      setConsumedParts(prev => {
        const copy = [...prev];
        copy[existingIndex].quantity += selectedQty;
        return copy;
      });
    } else {
      setConsumedParts(prev => [...prev, { partId: selectedPartId, quantity: selectedQty }]);
    }
    setSelectedPartId('');
    setSelectedQty(1);
  };

  const handleRemovePart = (partId: string) => {
    setConsumedParts(prev => prev.filter(p => p.partId !== partId));
  };

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    completeWorkOrderWithDeductions(
      order.id,
      realHours,
      observations,
      technicianSig,
      supervisorSig,
      consumedParts
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-bold">
                  {order.code}
                </span>
                <span className="text-xs text-slate-400">({order.type})</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">{order.title}</h3>
              <p className="text-xs text-cyan-400">
                Equipo: {order.equipmentTag} - {order.equipmentName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleComplete} className="p-6 space-y-4 text-xs">
          {/* Procedure Steps checklist */}
          <div>
            <label className="block text-slate-200 font-bold mb-2 flex items-center justify-between">
              <span>Procedimiento Operativo (Paso a Paso)</span>
              <span className="text-cyan-400 font-normal">
                {stepsCompleted.filter(Boolean).length} / {order.procedureSteps.length} pasos completados
              </span>
            </label>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {order.procedureSteps.map((stepItem, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`flex items-start gap-2.5 p-2 rounded-lg border cursor-pointer transition-colors ${
                    stepsCompleted[idx]
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!stepsCompleted[idx]}
                    onChange={() => {}} // handled by parent div
                    className="mt-0.5 w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                  <span className={`text-xs ${stepsCompleted[idx] ? 'line-through opacity-80' : ''}`}>
                    {stepItem.step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Consumed Parts / Inventory Integration */}
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
            <label className="block text-slate-200 font-bold mb-1.5 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-400" />
              Repuestos y Materiales Consumidos (Descuento de Almacén)
            </label>
            <p className="text-[11px] text-slate-400 mb-2.5">
              Selecciona los insumos utilizados. El sistema actualizará las existencias reales automáticamente.
            </p>

            {/* Part Selector Row */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-2.5">
              <select
                value={selectedPartId}
                onChange={e => setSelectedPartId(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs"
              >
                <option value="">-- Seleccionar repuesto / insumo de inventario --</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.code} | {item.name} (Stock: {item.stockCurrent} {item.unit} | ${item.unitCost})
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 w-28">
                <input
                  type="number"
                  min="1"
                  value={selectedQty}
                  onChange={e => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs text-center"
                  placeholder="Cant"
                />
              </div>

              <button
                type="button"
                onClick={handleAddPart}
                disabled={!selectedPartId}
                className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>

            {/* Added Parts List */}
            {consumedParts.length > 0 ? (
              <div className="space-y-1">
                {consumedParts.map(cp => {
                  const part = inventory.find(i => i.id === cp.partId);
                  if (!part) return null;
                  const total = (part.unitCost * cp.quantity).toFixed(2);
                  return (
                    <div
                      key={cp.partId}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-xs"
                    >
                      <div>
                        <span className="font-semibold text-slate-200">{part.name}</span>
                        <span className="text-slate-400 ml-2">
                          ({cp.quantity} {part.unit} x ${part.unitCost} = ${total} USD)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemovePart(cp.partId)}
                        className="text-slate-400 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic">No se han registrado consumos de repuestos para esta OT.</p>
            )}
          </div>

          {/* Time & Observations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                Tiempo Real Invertido (Horas) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={realHours}
                onChange={e => setRealHours(parseFloat(e.target.value) || 0)}
                required
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Firma / Nombre del Supervisor
              </label>
              <input
                type="text"
                value={supervisorSig}
                onChange={e => setSupervisorSig(e.target.value)}
                placeholder="Supervisor que da el V°B°"
                required
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Firma / Nombre del Técnico Ejecutor *
            </label>
            <input
              type="text"
              value={technicianSig}
              onChange={e => setTechnicianSig(e.target.value)}
              placeholder="Nombre del técnico responsable de la intervención"
              required
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Registro de Hallazgos y Observaciones Finales
            </label>
            <textarea
              value={observations}
              onChange={e => setObservations(e.target.value)}
              rows={3}
              placeholder="Describe los resultados de la intervención, parámetros alcanzados o recomendaciones..."
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
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-600/20 transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Finalizar OT y Actualizar Planta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
