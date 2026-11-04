import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { Equipment, EquipmentType, EquipmentStatus, WorkOrder } from '../types';
import {
  Cpu,
  Search,
  Plus,
  Wrench,
  Flame,
  CheckCircle2,
  AlertTriangle,
  History,
  Layers,
  ArrowRight
} from 'lucide-react';

interface EquipmentsViewProps {
  onOpenNewEquipment: () => void;
  onOpenNewOtForEquipment: (eqId: string) => void;
  onReportFailureForEquipment: (eqId: string) => void;
}

export const EquipmentsView: React.FC<EquipmentsViewProps> = ({
  onOpenNewEquipment,
  onOpenNewOtForEquipment,
  onReportFailureForEquipment
}) => {
  const { equipments, workOrders, updateEquipment, deleteEquipment, setActiveTab } = useMaintenance();

  const [selectedType, setSelectedType] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHistoryEq, setSelectedHistoryEq] = useState<Equipment | null>(null);

  const filteredEquipments = equipments.filter(eq => {
    const matchesType = selectedType === 'todos' || eq.type === selectedType;
    const matchesSearch =
      eq.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      eq.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case 'operativo':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Operativo
          </span>
        );
      case 'en_mantenimiento':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> En Mantenimiento
          </span>
        );
      case 'parado_falla':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping"></span> Parado por Falla
          </span>
        );
      case 'almacenado':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-700/50 text-slate-400 border border-slate-600 flex items-center gap-1">
            Almacenado
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#151c2c] border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {['todos', 'inyeccion', 'soplado', 'chiller', 'compresor', 'planta', 'molde'].map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                selectedType === t
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {t === 'todos' ? 'Todos los Activos' : t === 'planta' ? 'Planta Eléctrica' : t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por TAG, modelo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <button
            onClick={onOpenNewEquipment}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shrink-0 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Activo</span>
          </button>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipments.map(eq => {
          const eqOrders = workOrders.filter(o => o.equipmentId === eq.id);
          const pendingCount = eqOrders.filter(o => o.status === 'Pendiente' || o.status === 'En_Proceso').length;
          const completedCount = eqOrders.filter(o => o.status === 'Completada').length;

          return (
            <div
              key={eq.id}
              className="p-5 rounded-2xl bg-[#151c2c] border border-slate-800 hover:border-cyan-500/40 shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: TAG + Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300">
                      {eq.tag}
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">
                      {eq.type}
                    </span>
                  </div>
                  {getStatusBadge(eq.status)}
                </div>

                <h3 className="text-sm font-bold text-white leading-snug">{eq.name}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {eq.brand} {eq.model} • Serie: {eq.serialNumber || 'S/N'}
                </p>

                <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Ubicación</span>
                    <span className="text-slate-300 font-medium">{eq.location}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      {eq.type === 'molde' ? 'Ciclos Totales' : 'Horas de Operación'}
                    </span>
                    <span className="text-cyan-400 font-mono font-bold">
                      {eq.currentHours.toLocaleString()} {eq.type === 'molde' ? 'ciclos' : 'hrs'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Último Mantenimiento</span>
                    <span className="text-slate-300">{eq.lastMaintenanceDate || 'Sin registro'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Historial OTs</span>
                    <span className="text-slate-300">
                      {pendingCount} pend. / {completedCount} cerradas
                    </span>
                  </div>
                </div>

                {eq.notes && (
                  <p className="mt-3 text-[11px] text-slate-400 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 italic">
                    {eq.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => setSelectedHistoryEq(eq)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors flex items-center gap-1"
                  title="Ver bitácora de intervenciones"
                >
                  <History className="w-3.5 h-3.5 text-cyan-400" />
                  Historial
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onReportFailureForEquipment(eq.id)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                    title="Reportar falla en este equipo"
                  >
                    <Flame className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenNewOtForEquipment(eq.id)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition-colors flex items-center gap-1"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Programar OT
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Equipment History Modal */}
      {selectedHistoryEq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Historial de Intervenciones: {selectedHistoryEq.tag}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedHistoryEq.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedHistoryEq(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-3 text-xs">
              {workOrders.filter(o => o.equipmentId === selectedHistoryEq.id).length > 0 ? (
                workOrders
                  .filter(o => o.equipmentId === selectedHistoryEq.id)
                  .map(order => (
                    <div
                      key={order.id}
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-300">{order.code}</span>
                          <span className="font-semibold text-white">{order.title}</span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === 'Completada'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Fecha: {order.scheduledDate}</span>
                        <span>Tipo: {order.type}</span>
                        <span>Técnico: {order.assignedTechnician}</span>
                      </div>
                      {order.observations && (
                        <p className="text-slate-300 text-[11px] italic bg-slate-800/60 p-2 rounded">
                          {order.observations}
                        </p>
                      )}
                    </div>
                  ))
              ) : (
                <p className="text-center py-6 text-slate-500">
                  No hay órdenes de trabajo registradas para este activo.
                </p>
              )}
            </div>

            <div className="p-4 bg-slate-900/80 border-t border-slate-700 flex justify-end">
              <button
                onClick={() => setSelectedHistoryEq(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
