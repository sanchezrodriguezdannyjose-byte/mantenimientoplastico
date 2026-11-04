import React from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import {
  Activity,
  Clock,
  AlertOctagon,
  CheckCircle2,
  Cpu,
  Package,
  Wrench,
  TrendingUp,
  ArrowRight,
  Flame,
  CheckSquare
} from 'lucide-react';
import { WorkOrder } from '../types';

interface DashboardViewProps {
  onExecuteOt: (order: WorkOrder) => void;
  onOpenNewOt: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onExecuteOt, onOpenNewOt }) => {
  const { kpis, equipments, workOrders, setActiveTab, updateWorkOrder } = useMaintenance();

  const upcomingTasks = workOrders
    .filter(o => o.status === 'Pendiente' || o.status === 'En_Proceso')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 4 Main KPI Cards matching the user's theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Availability */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#151c2c] to-[#0b0f19] border border-slate-800 shadow-xl overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Disponibilidad (MTBF)</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 tracking-tight">
            {kpis.disponibilidad}%
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-cyan-400 font-bold">{kpis.mtbfHoras} h</span> tiempo medio e/ fallas
          </p>
        </div>

        {/* MTTR */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#151c2c] to-[#0b0f19] border border-slate-800 shadow-xl overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-400"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>T. Medio Reparación (MTTR)</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400 tracking-tight">
            {kpis.mttrHoras} h
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Promedio de restablecimiento operativo
          </p>
        </div>

        {/* Unplanned Stops */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#151c2c] to-[#0b0f19] border border-slate-800 shadow-xl overflow-hidden group hover:border-rose-500/50 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Paradas No Planificadas</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className={`text-3xl font-extrabold tracking-tight ${kpis.paradasNoPlanificadas > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
            {kpis.paradasNoPlanificadas}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {kpis.paradasNoPlanificadas === 0 ? 'Cero paradas críticas activas' : 'Averías en atención técnica'}
          </p>
        </div>

        {/* PM Compliance */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#151c2c] to-[#0b0f19] border border-slate-800 shadow-xl overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400"></div>
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Cumplimiento PM</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-400 tracking-tight">
            {kpis.cumplimientoPM}%
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {kpis.otsCompletadas} órdenes cerradas satisfactoriamente
          </p>
        </div>
      </div>

      {/* Grid: Plant Equipment Status & Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#151c2c] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Máquinas y Auxiliares</div>
              <div className="text-lg font-bold text-white">
                {kpis.equiposOperativos} / {equipments.length} Operativos
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('equipos')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            Ver Activos <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#151c2c] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Órdenes de Trabajo Activas</div>
              <div className="text-lg font-bold text-white">
                {kpis.otsPendientes} Pendientes | {kpis.otsEnProceso} En Curso
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('ordenes')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            Ver OTs <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-[#151c2c] border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Alertas de Almacén</div>
              <div className="text-lg font-bold text-white">
                {kpis.repuestosBajoStock} Repuestos Bajo Mínimo
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('recursos')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            Ver Almacén <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2-Column: Objectives & Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Objectives */}
        <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800 mb-4">
              <i className="fa-solid fa-bullseye text-cyan-400 text-xl"></i>
              <h2 className="text-base font-bold text-white uppercase tracking-wider">
                Objetivos del Programa Interrelacionado
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs mb-4">
              <strong className="block text-cyan-300 text-sm mb-1 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Maximizar la Eficiencia Global de los Equipos (OEE)
              </strong>
              Reducir las paradas no planificadas mediante la trazabilidad estricta de rutinas en inyectoras, sopladoras, moldes y auxiliares críticos (Chiller, Compresor, Planta).
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Extender la vida útil</strong> de husillos, camisas, rodilleras de cierre, canales de moldes, compresores y serpentines de chiller.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Garantizar continuidad de servicios auxiliares:</strong> aire comprimido seco a 7.5 bar, agua fría de proceso a 10-12°C y respaldo eléctrico automático (ATS).
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Interconexión de Almacén y Costos:</strong> cada intervención descuenta automáticamente piezas y repuestos para auditoría ISO 9001.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">¿Necesitas programar el plan del mes?</span>
            <button
              onClick={() => setActiveTab('ordenes')}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
            >
              Generador de OTs ISO 9001
            </button>
          </div>
        </div>

        {/* Tasks in Queue */}
        <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-lightbulb text-emerald-400 text-xl"></i>
                <h2 className="text-base font-bold text-white uppercase tracking-wider">
                  Órdenes y Tareas en Cola
                </h2>
              </div>
              <button
                onClick={onOpenNewOt}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                + Nueva OT
              </button>
            </div>

            <div className="space-y-3">
              {upcomingTasks.map(task => {
                const isUrgent = task.priority === 'Critica' || task.type === 'Correctivo';
                return (
                  <div
                    key={task.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                      isUrgent
                        ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                        : task.status === 'En_Proceso'
                        ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                          {task.code}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {task.equipmentTag}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            task.status === 'En_Proceso'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {task.status === 'En_Proceso' ? 'En Proceso' : 'Pendiente'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">{task.title}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                        <span>Prog: {task.scheduledDate}</span>
                        <span>•</span>
                        <span>Resp: {task.assignedTechnician}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onExecuteOt(task)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-colors"
                      >
                        Intervenir / Cerrar
                      </button>
                    </div>
                  </div>
                );
              })}

              {upcomingTasks.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No hay órdenes pendientes. Puedes generar un nuevo período desde la pestaña de Órdenes.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">¿Revisión rápida de inicio de turno?</span>
            <button
              onClick={() => setActiveTab('checklists')}
              className="text-emerald-400 hover:underline font-semibold flex items-center gap-1"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Llenar Checklist Operativo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
