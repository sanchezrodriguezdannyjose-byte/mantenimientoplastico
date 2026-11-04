import React, { useState, useMemo } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { PlanTemplate, SapWorkCenter, SapActivityType } from '../types';
import {
  Wrench,
  Droplet,
  Wind,
  Zap,
  Cpu,
  Snowflake,
  Fan,
  Flame,
  Plus,
  Search,
  Filter,
  Copy,
  Edit,
  Trash2,
  CheckCircle2,
  Layers,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Sliders,
  Package,
  FileText,
  ChevronDown,
  ChevronUp,
  ClipboardList
} from 'lucide-react';
import { PlanTemplateModal } from '../components/PlanTemplateModal';

interface PlanesViewProps {
  onOpenNewOtForTemplate: (title: string, system: string) => void;
}

export const PlanesView: React.FC<PlanesViewProps> = ({ onOpenNewOtForTemplate }) => {
  const { templates, deletePlanTemplate, duplicatePlanTemplate } = useMaintenance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('todos');
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<string>('todos');
  const [selectedActivityType, setSelectedActivityType] = useState<string>('todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PlanTemplate | null>(null);

  // Expanded accordions
  const [expandedPlanIds, setExpandedPlanIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedPlanIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    templates.forEach(t => (all[t.id] = true));
    setExpandedPlanIds(all);
  };

  const collapseAll = () => {
    setExpandedPlanIds({});
  };

  // Systems List for Filter
  const systemsList = [
    { id: 'todos', label: 'Todos los Sistemas' },
    { id: 'Mecánico', label: 'Mecánico' },
    { id: 'Hidráulico', label: 'Hidráulico' },
    { id: 'Neumático', label: 'Neumático' },
    { id: 'Eléctrico', label: 'Eléctrico' },
    { id: 'Electrónica/PLC', label: 'Electrónica / PLC' },
    { id: 'Chiller', label: 'Chiller' },
    { id: 'Compresor', label: 'Compresor' },
    { id: 'Planta Eléctrica', label: 'Planta Eléctrica' },
    { id: 'Moldes', label: 'Moldes' }
  ];

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch =
        t.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.system.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.code && t.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.criterioAceptacion && t.criterioAceptacion.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSystem =
        selectedSystem === 'todos' || t.system.toLowerCase() === selectedSystem.toLowerCase();

      const matchesWorkCenter =
        selectedWorkCenter === 'todos' || t.workCenter === selectedWorkCenter;

      const matchesActivity =
        selectedActivityType === 'todos' || t.sapActivityType === selectedActivityType;

      return matchesSearch && matchesSystem && matchesWorkCenter && matchesActivity;
    });
  }, [templates, searchQuery, selectedSystem, selectedWorkCenter, selectedActivityType]);

  const handleEdit = (tpl: PlanTemplate) => {
    setEditingTemplate(tpl);
    setIsModalOpen(true);
  };

  const handleNewPlan = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`¿Confirma que desea eliminar la actividad preventiva '${title}'?`)) {
      deletePlanTemplate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Sliders className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide uppercase">
              Planes de Mantenimiento Preventivo (Estructura SAP PM)
            </h2>
            <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
              Hojas de Ruta & Puestos de Trabajo
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Ingreso y organización técnica de actividades preventivas interrelacionadas: Puesto de trabajo (Work Center), Clase de actividad (PM01-PM06), ciclo de disparo por tiempo o contadores de máquina, y lista de operaciones con criterios de aceptación ISO 9001.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleNewPlan}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nueva Actividad Preventiva (SAP PM)</span>
          </button>
        </div>
      </div>

      {/* SAP PM Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[11px]">Hojas de Ruta Activas</span>
            <span className="text-xl font-bold text-cyan-400">{templates.length}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
            <ClipboardList className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[11px]">Puestos de Trabajo (WC)</span>
            <span className="text-xl font-bold text-emerald-400">8 Puestos</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Wrench className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[11px]">Seguridad LOTO Estricto</span>
            <span className="text-xl font-bold text-amber-400">
              {templates.filter(t => t.machineCondition === 'parada_loto').length} Planes
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-slate-400 block text-[11px]">Planificador Resp.</span>
            <span className="text-xs font-bold text-amber-300 block truncate">
              Ing. Sanchez Danny
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
            <Cpu className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-[#151c2c] border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Buscar por código (HR-xxx), título, tarea, sistema o criterio de aceptación..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              Expandir Todos
            </button>
            <button
              onClick={collapseAll}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              Colapsar
            </button>
          </div>
        </div>

        {/* System & Work Center Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-cyan-400" /> Sistema:
          </span>
          {systemsList.map(sys => (
            <button
              key={sys.id}
              onClick={() => setSelectedSystem(sys.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedSystem === sys.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {sys.label}
            </button>
          ))}
        </div>

        {/* Advanced SAP Filters: Work Center & Activity Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="flex items-center gap-2">
            <label className="text-slate-400 text-[11px] shrink-0 font-semibold">Puesto de Trabajo (Work Center):</label>
            <select
              value={selectedWorkCenter}
              onChange={e => setSelectedWorkCenter(e.target.value)}
              className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
            >
              <option value="todos">Todos los Puestos</option>
              <option value="MEC-01">MEC-01 - Mecánica</option>
              <option value="ELE-01">ELE-01 - Electricidad / Potencia</option>
              <option value="HID-01">HID-01 - Hidráulica</option>
              <option value="NEU-01">NEU-01 - Neumática</option>
              <option value="REF-01">REF-01 - Refrigeración / Chiller</option>
              <option value="MAT-01">MAT-01 - Matricería / Moldes</option>
              <option value="INS-01">INS-01 - Instrumentación / PLC</option>
              <option value="LUB-01">LUB-01 - Lubricación</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-400 text-[11px] shrink-0 font-semibold">Clase de Actividad (PM Activity):</label>
            <select
              value={selectedActivityType}
              onChange={e => setSelectedActivityType(e.target.value)}
              className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
            >
              <option value="todos">Todas las Clases</option>
              <option value="PM01">PM01 - Preventivo Sistemático</option>
              <option value="PM02">PM02 - Inspección y Diagnóstico</option>
              <option value="PM03">PM03 - Lubricación Programada</option>
              <option value="PM04">PM04 - Calibración y Ajuste</option>
              <option value="PM05">PM05 - Overhaul Mayor</option>
              <option value="PM06">PM06 - Seguridad y LOTO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plans List / Accordions */}
      <div className="space-y-3.5">
        {filteredTemplates.map(tpl => {
          const isExpanded = !!expandedPlanIds[tpl.id];
          const hasOperations = tpl.operations && tpl.operations.length > 0;
          const opsCount = hasOperations ? tpl.operations!.length : tpl.pasos.length;

          return (
            <div
              key={tpl.id}
              className={`rounded-2xl bg-[#151c2c] border transition-all shadow-md overflow-hidden ${
                isExpanded ? 'border-cyan-500/50 shadow-cyan-500/5' : 'border-slate-800'
              }`}
            >
              {/* Header Bar */}
              <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div
                  onClick={() => toggleExpand(tpl.id)}
                  className="flex items-start gap-3 cursor-pointer flex-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 text-cyan-400">
                    <Wrench className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono font-bold text-cyan-400 text-xs px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                        {tpl.code || `HR-${tpl.system.substring(0, 3).toUpperCase()}`}
                      </span>

                      <span className="font-mono text-[11px] font-bold text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {tpl.workCenter || 'MEC-01'}
                      </span>

                      <span className="text-[10px] font-semibold text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {tpl.sapActivityType || 'PM01'}
                      </span>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        {tpl.frecuencia}
                      </span>

                      {tpl.machineCondition === 'parada_loto' && (
                        <span className="text-[10px] font-semibold text-rose-300 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-rose-400" /> Parada con LOTO
                        </span>
                      )}

                      {tpl.specificEquipmentTag && tpl.specificEquipmentTag !== 'TODOS' && (
                        <span className="text-[10px] font-bold text-purple-300 px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30">
                          TAG: {tpl.specificEquipmentTag}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-white hover:text-cyan-400 transition-colors">
                      {tpl.titulo}
                    </h3>

                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                      <span>Sistema: <strong className="text-slate-300">{tpl.system}</strong></span>
                      <span>•</span>
                      <span>Duración: <strong className="text-slate-300">{tpl.tiempo}</strong></span>
                      <span>•</span>
                      <span>Operaciones: <strong className="text-cyan-400">{opsCount} pasos</strong></span>
                    </p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => onOpenNewOtForTemplate(tpl.titulo, tpl.system)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                    title="Programar Orden de Trabajo inmediata a partir de este plan"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ OT</span>
                  </button>

                  <button
                    onClick={() => handleEdit(tpl)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Editar Hoja de Ruta y Parámetros SAP PM"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => duplicatePlanTemplate(tpl.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Duplicar Actividad Preventiva"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(tpl.id, tpl.titulo)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Eliminar Actividad"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleExpand(tpl.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Plan Details */}
              {isExpanded && (
                <div className="p-5 border-t border-slate-800 bg-[#0c111d] space-y-4 text-xs animate-in fade-in duration-150">
                  {/* Operations Table */}
                  <div>
                    <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-cyan-400">
                      <Sliders className="w-3.5 h-3.5" /> Hoja de Ruta Normalizada (Operaciones Paso a Paso):
                    </h4>

                    <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px]">
                          <tr>
                            <th className="p-2.5 w-16 text-center">N° Op</th>
                            <th className="p-2.5">Descripción de la Tarea / Procedimiento</th>
                            <th className="p-2.5 w-48">Norma / Parámetro de Referencia</th>
                            <th className="p-2.5 w-20 text-center">Tiempo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {hasOperations ? (
                            tpl.operations!.map((op, oIdx) => (
                              <tr key={oIdx} className="hover:bg-slate-800/40">
                                <td className="p-2.5 font-mono text-center font-bold text-cyan-400">
                                  {op.opNumber}
                                </td>
                                <td className="p-2.5 text-slate-200">{op.description}</td>
                                <td className="p-2.5 font-mono text-amber-300 text-[11px]">
                                  {op.referenceStandard || 'Conforme a manual'}
                                </td>
                                <td className="p-2.5 text-center text-slate-400">
                                  {op.durationMinutes} min
                                </td>
                              </tr>
                            ))
                          ) : (
                            tpl.pasos.map((p, pIdx) => (
                              <tr key={pIdx} className="hover:bg-slate-800/40">
                                <td className="p-2.5 font-mono text-center font-bold text-cyan-400">
                                  {String((pIdx + 1) * 10).padStart(4, '0')}
                                </td>
                                <td className="p-2.5 text-slate-200">{p}</td>
                                <td className="p-2.5 font-mono text-amber-300 text-[11px]">
                                  Tolerancia estándar
                                </td>
                                <td className="p-2.5 text-center text-slate-400">15 min</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3-Column Info: Materials/BOM, Tools (PRT), Acceptance Criteria */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* Tools (PRT) */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <strong className="text-slate-300 block mb-1.5 flex items-center gap-1.5 text-xs">
                        <Wrench className="w-3.5 h-3.5 text-blue-400" />
                        Herramientas (PRT):
                      </strong>
                      <div className="flex flex-wrap gap-1">
                        {tpl.herramientas && tpl.herramientas.length > 0 ? (
                          tpl.herramientas.map((h, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                              {h}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 italic">Herramientas estándar</span>
                        )}
                      </div>
                    </div>

                    {/* Spare Parts (BOM) */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <strong className="text-slate-300 block mb-1.5 flex items-center gap-1.5 text-xs">
                        <Package className="w-3.5 h-3.5 text-amber-400" />
                        Repuestos & Insumos (BOM):
                      </strong>
                      <div className="space-y-1">
                        {tpl.requiredPartsDetailed && tpl.requiredPartsDetailed.length > 0 ? (
                          tpl.requiredPartsDetailed.map((p, i) => (
                            <div key={i} className="flex justify-between text-[11px]">
                              <span className="text-slate-300 font-mono text-cyan-400">[{p.partSku}] {p.partName}</span>
                              <span className="font-bold text-amber-300">{p.quantity} {p.unit}</span>
                            </div>
                          ))
                        ) : tpl.repuestos && tpl.repuestos.length > 0 ? (
                          tpl.repuestos.map((r, i) => (
                            <span key={i} className="inline-block mr-1 px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                              {r}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 italic">No requiere repuestos directos</span>
                        )}
                      </div>
                    </div>

                    {/* Acceptance Criteria */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                      <strong className="text-slate-300 block mb-1.5 flex items-center gap-1.5 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Criterio de Aceptación ISO 9001:
                      </strong>
                      <p className="text-slate-300 font-mono text-[11px] leading-relaxed">
                        {tpl.criterioAceptacion || 'Cero ruidos anormales, parámetros dentro del límite operativo.'}
                      </p>
                    </div>
                  </div>

                  {/* Footer note: Planner Group & Safety */}
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                    <div className="flex items-center gap-3">
                      <span>Grupo Planificador: <strong className="text-amber-300">{tpl.plannerGroup || 'Ingeniero Sanchez Danny'}</strong></span>
                      <span>•</span>
                      <span>Ventana de llamada: <strong>{tpl.toleranceDays || 3} días</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Permisos:</span>
                      {(tpl.safetyPermits && tpl.safetyPermits.length > 0 ? tpl.safetyPermits : ['LOTO']).map((perm, pIdx) => (
                        <span key={pIdx} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-bold">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12 rounded-2xl bg-[#151c2c] border border-slate-800">
            <ClipboardList className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-300">No se encontraron actividades preventivas</h4>
            <p className="text-xs text-slate-500 mt-1">Prueba cambiando los filtros o crea una nueva actividad.</p>
            <button
              onClick={handleNewPlan}
              className="mt-3 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs"
            >
              + Crear Nueva Actividad
            </button>
          </div>
        )}
      </div>

      {/* Plan Template Modal */}
      <PlanTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        templateToEdit={editingTemplate}
      />
    </div>
  );
};
