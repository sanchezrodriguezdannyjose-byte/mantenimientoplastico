import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import {
  CalendarDays,
  Calendar,
  CheckCircle2,
  Clock,
  Wrench,
  X,
  Plus
} from 'lucide-react';
import { WorkOrder } from '../types';

interface CronogramaViewProps {
  onExecuteOt: (order: WorkOrder) => void;
  onOpenNewOt: () => void;
}

export const CronogramaView: React.FC<CronogramaViewProps> = ({ onExecuteOt, onOpenNewOt }) => {
  const { workOrders, setActiveTab } = useMaintenance();

  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const mesesCompletos = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number | null>(new Date().getMonth());

  const cronogramaMatrix = [
    {
      id: 'diario',
      nombre: 'Diario (Operador y Turno)',
      color: 'bg-cyan-500 text-slate-950 font-bold',
      meses: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      tareas: [
        'Drenaje de condensados en tanques de aire y FRL',
        'Verificación de temperaturas de agua de Chiller (10-12°C)',
        'Inspección de paros de emergencia y seguros de puerta',
        'Comprobación de nivel de aceite hidráulico en mirilla'
      ]
    },
    {
      id: 'semanal',
      nombre: 'Semanal (Técnico de Planta)',
      color: 'bg-amber-500 text-slate-950 font-bold',
      meses: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      tareas: [
        'Engrase manual de rodilleras y columnas de inyectoras',
        'Prueba de arranque manual de Planta Eléctrica Diésel',
        'Limpieza de serpentín y aletas del Chiller',
        'Detección acústica de fugas en red neumática'
      ]
    },
    {
      id: 'mensual',
      nombre: 'Mensual (Especialista)',
      color: 'bg-emerald-500 text-slate-950 font-bold',
      meses: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      tareas: [
        'Verificación de paralelismo de platos (desviación < 0.1 mm)',
        'Reemplazo de filtros de retorno hidráulicos de 10 micras',
        'Calibración de termopares y respaldo de programa PLC/HMI',
        'Limpieza de filtro de admisión del compresor y revisión de batería'
      ]
    },
    {
      id: 'trimestral',
      nombre: 'Trimestral (Predictivo & Termografía)',
      color: 'bg-purple-500 text-white font-bold',
      meses: [2, 5, 8, 11], // Mar, Jun, Sep, Dic
      tareas: [
        'Barrido termográfico infrarrojo en tableros bajo carga (ΔT < 10°C)',
        'Inspección de carga de gas refrigerante y presostatos de Chiller',
        'Prueba de transferencia automática del tablero ATS con carga',
        'Medición de desgaste de husillos y camisas bimetálicas'
      ]
    },
    {
      id: 'semestral',
      nombre: 'Semestral (Overhaul Parcial)',
      color: 'bg-emerald-600 text-white font-bold',
      meses: [5, 11], // Jun, Dic
      tareas: [
        'Megado de aislamiento en motores eléctricos (Megger > 100 MΩ)',
        'Cambio de filtro separador y aceite en compresor de tornillo',
        'Lavado químico desincrustante en canales de moldes y evaporador',
        'Cambio de aceite 15W40 y filtros de generador diésel'
      ]
    },
    {
      id: 'anual',
      nombre: 'Anual (Parada Mayor de Planta)',
      color: 'bg-rose-600 text-white font-bold',
      meses: [0, 11], // Ene, Dic
      tareas: [
        'Overhaul mayor de platos, rodilleras y cilindros principales',
        'Prueba al 100% de carga con banco resistivo en planta eléctrica',
        'Análisis físico-químico completo de aceite hidráulico en laboratorio',
        'Rectificado y pulido espejo de cavidades en moldes de alta producción'
      ]
    }
  ];

  // Filter actual work orders falling into selected month
  const actualOrdersInSelectedMonth = selectedMonthIndex !== null
    ? workOrders.filter(o => {
        if (!o.scheduledDate) return false;
        const parts = o.scheduledDate.split('-');
        if (parts.length >= 2) {
          const m = parseInt(parts[1], 10) - 1;
          return m === selectedMonthIndex;
        }
        return false;
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#151c2c] border border-slate-800">
        <h2 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-cyan-400" />
          Cronograma Dinámico de Mantenimiento Anual
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Matriz anual de frecuencias normadas. Haz clic en cualquier columna de mes para auditar la programación técnica y las Órdenes de Trabajo reales registradas.
        </p>
      </div>

      {/* Matrix Table */}
      <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800 overflow-x-auto shadow-2xl">
        <div className="min-w-[850px]">
          {/* Header Month Row */}
          <div className="grid grid-cols-13 gap-1.5 pb-2 border-b border-slate-800 text-center text-xs font-bold">
            <div className="col-span-3 text-left pl-3 text-cyan-400 uppercase tracking-wider text-[11px]">
              Especialidad / Nivel
            </div>
            {meses.map((m, idx) => {
              const isSelected = selectedMonthIndex === idx;
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMonthIndex(idx)}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-extrabold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  title={`Ver tareas de ${mesesCompletos[idx]}`}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-800/60 pt-2 text-xs">
            {cronogramaMatrix.map(row => (
              <div key={row.id} className="grid grid-cols-13 gap-1.5 py-2.5 items-center">
                <div className="col-span-3 text-left pl-3 font-semibold text-slate-200">
                  {row.nombre}
                </div>
                {meses.map((_, mIdx) => {
                  const isScheduled = row.meses.includes(mIdx);
                  const isSelected = selectedMonthIndex === mIdx;

                  return (
                    <div
                      key={mIdx}
                      onClick={() => setSelectedMonthIndex(mIdx)}
                      className={`h-9 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer transition-all ${
                        isScheduled
                          ? `${row.color} shadow-sm hover:scale-105`
                          : 'bg-slate-900/60 text-slate-600 hover:bg-slate-800/80 hover:text-slate-400'
                      } ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}
                    >
                      {isScheduled ? '●' : '—'}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Month Detail Modal/Card */}
      {selectedMonthIndex !== null && (
        <div className="p-6 rounded-2xl bg-[#151c2c] border border-cyan-500/40 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Programación Técnica para {mesesCompletos[selectedMonthIndex]}
                </h3>
                <p className="text-xs text-slate-400">
                  Rutinas preventivas maestras y Órdenes de Trabajo vinculadas en este mes
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenNewOt}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Nueva OT
              </button>
              <button
                onClick={() => setSelectedMonthIndex(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
            {/* Planned Routines */}
            <div>
              <h4 className="font-bold text-cyan-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Wrench className="w-4 h-4" /> Rutinas Normadas para este Mes
              </h4>
              <div className="space-y-2">
                {cronogramaMatrix
                  .filter(row => row.meses.includes(selectedMonthIndex))
                  .map(row => (
                    <div
                      key={row.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{row.nombre}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-slate-800 text-cyan-400">
                          {row.tareas.length} tareas
                        </span>
                      </div>
                      <ul className="space-y-1 text-slate-300 pl-1">
                        {row.tareas.map((t, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>

            {/* Actual Work Orders Registered for this month */}
            <div>
              <h4 className="font-bold text-emerald-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Órdenes de Trabajo Registradas ({actualOrdersInSelectedMonth.length})
              </h4>
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {actualOrdersInSelectedMonth.map(order => (
                  <div
                    key={order.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-cyan-300">{order.code}</span>
                        <span className="text-slate-400 font-semibold">{order.equipmentTag}</span>
                      </div>
                      <h5 className="font-bold text-white text-xs">{order.title}</h5>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Fecha: {order.scheduledDate} • Resp: {order.assignedTechnician}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.status === 'Completada'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : order.status === 'En_Proceso'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {order.status}
                      </span>
                      <button
                        onClick={() => onExecuteOt(order)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold"
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                ))}

                {actualOrdersInSelectedMonth.length === 0 && (
                  <div className="p-6 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
                    No hay OTs específicas programadas en fecha para este mes. Puedes generarlas desde la pestaña Órdenes de Trabajo.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
