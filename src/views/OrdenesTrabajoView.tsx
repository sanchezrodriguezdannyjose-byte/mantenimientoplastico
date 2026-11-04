import React, { useState, useMemo } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { WorkOrder } from '../types';
import {
  FileText,
  Printer,
  Maximize2,
  X,
  Play,
  CheckCircle2,
  Calendar,
  Layers,
  Filter,
  Plus,
  Trash2,
  Search,
  CheckSquare
} from 'lucide-react';

import { exportWorkOrderSheetsPdf } from '../utils/pdfExport';

interface OrdenesTrabajoViewProps {
  onOpenNewOt: () => void;
  onExecuteOt: (order: WorkOrder) => void;
}

export const OrdenesTrabajoView: React.FC<OrdenesTrabajoViewProps> = ({ onOpenNewOt, onExecuteOt }) => {
  const { workOrders, generateBatchOrders, updateWorkOrder, deleteWorkOrder } = useMaintenance();

  const [startDateInput, setStartDateInput] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [periodMonths, setPeriodMonths] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fullscreenSheetDate, setFullscreenSheetDate] = useState<string | null>(null);

  // Group work orders by scheduled date for Letter Size Sheets
  const groupedByDate = useMemo(() => {
    const groups: Record<string, WorkOrder[]> = {};
    workOrders.forEach(order => {
      const dateKey = order.scheduledDate || 'Sin fecha';
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(order);
    });
    return groups;
  }, [workOrders]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [groupedByDate]);

  const filteredOrders = useMemo(() => {
    return workOrders.filter(order => {
      const matchesFilter =
        activeFilter === 'todos' ||
        order.status.toLowerCase() === activeFilter.toLowerCase() ||
        order.type.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch =
        order.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.equipmentTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.assignedTechnician.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [workOrders, activeFilter, searchQuery]);

  const handleGenerate = () => {
    generateBatchOrders(startDateInput, periodMonths);
  };

  const handlePrintPdf = (date?: string) => {
    exportWorkOrderSheetsPdf(groupedByDate, date);
  };

  return (
    <div className="space-y-6">
      {/* Control & Batch Generator Card */}
      <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800 shadow-xl no-print">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide uppercase">
                Generador Oficial de Órdenes de Trabajo (ISO 9001:2015)
              </h2>
              <p className="text-xs text-slate-400">
                Formato Oficial Tamaño Carta F-MT-01 Rev.01 con Procedimiento Completo y Agrupación por Fecha
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewOt}
              className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Nueva OT Manual
            </button>
            <button
              onClick={() => handlePrintPdf()}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Exportar e imprimir todas las Hojas Carta F-MT-01 en formato PDF"
            >
              <Printer className="w-4 h-4" />
              Imprimir Hojas Carta (PDF)
            </button>
          </div>
        </div>

        {/* Batch Generator Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Fecha de Inicio del Programa:</label>
            <input
              type="date"
              value={startDateInput}
              onChange={e => setStartDateInput(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Período de Planificación:</label>
            <select
              value={periodMonths}
              onChange={e => setPeriodMonths(parseInt(e.target.value))}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
            >
              <option value={1}>Próximo Mes (30 días)</option>
              <option value={3}>Próximos 3 Meses (Trimestral)</option>
              <option value={6}>Próximos 6 Meses (Semestral)</option>
              <option value={12}>Próximo Año (Anual)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              className="w-full h-[42px] px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20"
            >
              <Layers className="w-4 h-4" />
              Generar Plan en Firme
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Table of Work Orders (For Screen Management) */}
      <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800 shadow-xl no-print">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {['todos', 'pendiente', 'en_proceso', 'completada', 'correctivo'].map(filterKey => (
              <button
                key={filterKey}
                onClick={() => setActiveFilter(filterKey)}
                className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors ${
                  activeFilter === filterKey
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {filterKey === 'en_proceso' ? 'En Proceso' : filterKey}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar OT por código, equipo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Digital Orders Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs text-left min-w-[800px]">
            <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3 w-28">Código</th>
                <th className="p-3 w-28">Equipo</th>
                <th className="p-3">Título / Actividad</th>
                <th className="p-3 w-24">Fecha Prog.</th>
                <th className="p-3 w-24">Estado</th>
                <th className="p-3 w-24">Prioridad</th>
                <th className="p-3 w-32">Responsable</th>
                <th className="p-3 w-36 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/20">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-mono font-bold text-cyan-300">{order.code}</td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-200">{order.equipmentTag}</span>
                    <span className="block text-[10px] text-slate-400 truncate max-w-[120px]">
                      {order.equipmentName}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-white">{order.title}</span>
                    <span className="block text-[10px] text-slate-400">
                      Sistema: {order.system} • {order.estimatedTime}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-300">{order.scheduledDate}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        order.status === 'Completada'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : order.status === 'En_Proceso'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {order.status === 'En_Proceso' ? 'En Proceso' : order.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${
                        order.priority === 'Critica'
                          ? 'text-rose-400 bg-rose-500/10'
                          : order.priority === 'Alta'
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-slate-400'
                      }`}
                    >
                      {order.priority}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{order.assignedTechnician}</td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onExecuteOt(order)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          order.status === 'Completada'
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                            : 'bg-cyan-600 hover:bg-cyan-500 text-slate-950'
                        }`}
                      >
                        {order.status === 'Completada' ? 'Revisar' : 'Cerrar OT'}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`¿Deseas eliminar la orden ${order.code}?`)) {
                            deleteWorkOrder(order.id);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition-colors"
                        title="Eliminar orden"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500 text-xs">
                    No se encontraron órdenes que coincidan con la búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official ISO 9001:2015 Letter-Size Sheets View (Grouped by Date) */}
      <div className="hoja-carta-container">
        <div className="text-center mb-4 no-print">
          <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">
            Documentación F-MT-01 Formato Carta (Listo para Impresión Oficial)
          </span>
        </div>

        {sortedDates.map((dateStr, sheetIndex) => {
          const ordersOnDate = groupedByDate[dateStr];

          return (
            <div key={dateStr} className="hoja-carta relative">
              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-2 no-print">
                <button
                  onClick={() => handlePrintPdf(dateStr)}
                  className="bg-purple-800 hover:bg-purple-700 text-white text-xs px-2.5 py-1 rounded flex items-center gap-1 shadow cursor-pointer font-semibold"
                  title="Exportar esta hoja a PDF"
                >
                  <Printer className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  onClick={() => setFullscreenSheetDate(dateStr)}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs px-2.5 py-1 rounded flex items-center gap-1 shadow cursor-pointer"
                  title="Ampliar a pantalla completa"
                >
                  <Maximize2 className="w-3.5 h-3.5" /> Ampliar
                </button>
              </div>

              {/* Document Header */}
              <div className="carta-header">
                <div className="logo">
                  <div className="logo-icon">M</div>
                  <div>
                    <h2>Planta de Producción Plástica Industrial</h2>
                    <p>Sistema de Gestión de la Calidad ISO 9001:2015 | Mantenimiento</p>
                    <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#b45309', marginTop: '2px' }}>
                      Sistema elaborado por el Ingeniero Sanchez Danny
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2>ORDEN DE TRABAJO</h2>
                  <p>Código: F-MT-01 | Versión: 01</p>
                  <p style={{ fontSize: '8px', color: '#555' }}>Ing. Sanchez Danny</p>
                </div>
              </div>

              {/* Info Box */}
              <div className="carta-documento-info">
                <div>
                  <strong>Fecha Programada de Ejecución:</strong>
                  <span className="font-bold text-black">{dateStr}</span>
                </div>
                <div>
                  <strong>Tipo de Procedimiento:</strong>
                  <span>Mantenimiento Preventivo / Auxiliares</span>
                </div>
                <div>
                  <strong>Documento / Folio:</strong>
                  <span>
                    Hoja {sheetIndex + 1} de {sortedDates.length}
                  </span>
                </div>
              </div>

              {/* Work Orders Table */}
              <div className="carta-tabla-wrapper">
                <table className="carta-tabla">
                  <thead>
                    <tr>
                      <th style={{ width: '4%' }}>N°</th>
                      <th style={{ width: '13%' }}>Equipo / TAG</th>
                      <th style={{ width: '17%' }}>Actividad / Tarea</th>
                      <th style={{ width: '8%' }}>Frec.</th>
                      <th style={{ width: '26%' }}>Procedimiento de Intervención</th>
                      <th style={{ width: '17%' }}>Herramientas e Insumos</th>
                      <th style={{ width: '7%' }}>T. Est.</th>
                      <th style={{ width: '8%' }}>Firma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersOnDate.map((ot, idx) => (
                      <tr key={ot.id}>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                        <td>
                          <strong>{ot.equipmentTag}</strong>
                          <div style={{ fontSize: '9px', color: '#444' }}>{ot.equipmentName}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 'bold' }}>{ot.title}</div>
                          <div style={{ fontSize: '9px', color: '#666' }}>Sistema: {ot.system}</div>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{ot.frequency}</td>
                        <td>
                          <ol>
                            {ot.procedureSteps.map((step, sIdx) => (
                              <li key={sIdx}>{step.step}</li>
                            ))}
                          </ol>
                        </td>
                        <td>
                          <ul>
                            {ot.toolsUsed.map((tool, tIdx) => (
                              <li key={`t-${tIdx}`}>🛠️ {tool}</li>
                            ))}
                            {ot.suppliesUsed.map((sup, sIdx) => (
                              <li key={`s-${sIdx}`}>🧴 {sup}</li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ textAlign: 'center' }}>{ot.estimatedTime}</td>
                        <td style={{ textAlign: 'center', fontSize: '9px' }}>
                          {ot.technicianSignature || ot.assignedTechnician}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Execution Findings / Observations */}
              <div style={{ border: '1px solid #000', padding: '8px', minHeight: '80px', marginTop: '10px' }}>
                <strong style={{ fontSize: '10px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Observaciones Técnicas / Registro de Parámetros y Consumo de Repuestos:
                </strong>
                <div style={{ fontSize: '10px', color: '#333' }}>
                  {ordersOnDate.map(o => o.observations).filter(Boolean).join(' | ') ||
                    'Sin desviaciones operativas registradas durante la ejecución.'}
                </div>
              </div>

              {/* Signatures */}
              <div className="carta-firmas">
                <div className="carta-firma-box">
                  <strong>Técnico de Mantenimiento</strong>
                  <span>Ejecutado conforme a procedimiento</span>
                </div>
                <div className="carta-firma-box">
                  <strong>Supervisor de Calidad</strong>
                  <span>Inspeccionado y verificado ISO 9001</span>
                </div>
                <div className="carta-firma-box">
                  <strong>Jefe de Planta</strong>
                  <span>Aprobación y entrega a Producción</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '8.5px', color: '#555', marginTop: '6px', borderTop: '1px solid #ddd', paddingTop: '4px' }}>
                SGMI • Sistema elaborado por el Ingeniero Sanchez Danny • Formato Oficial F-MT-01 Rev.01 • ISO 9001:2015
              </div>
            </div>
          );
        })}

        {sortedDates.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-xs">
            No hay órdenes generadas. Utiliza el generador superior para programar un nuevo período.
          </div>
        )}
      </div>

      {/* Fullscreen Modal View for a specific sheet */}
      {fullscreenSheetDate && groupedByDate[fullscreenSheetDate] && (
        <div className="fixed inset-0 z-50 bg-[#111827] flex flex-col no-print animate-in fade-in duration-200">
          <div className="bg-[#1f2937] p-3 px-6 flex items-center justify-between border-b border-slate-700">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              Vista Previa Ampliada de Hoja Carta (Fecha: {fullscreenSheetDate})
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimir
              </button>
              <button
                onClick={() => setFullscreenSheetDate(null)}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Cerrar
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex justify-center bg-slate-900/50">
            <div className="hoja-carta" style={{ margin: 0 }}>
              <div className="carta-header">
                <div className="logo">
                  <div className="logo-icon">M</div>
                  <div>
                    <h2>Planta de Producción Plástica Industrial</h2>
                    <p>Sistema de Gestión de la Calidad ISO 9001:2015</p>
                    <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#b45309', marginTop: '2px' }}>
                      Sistema elaborado por el Ingeniero Sanchez Danny
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h2>ORDEN DE TRABAJO</h2>
                  <p>Código: F-MT-01 | Versión: 01</p>
                  <p style={{ fontSize: '8px', color: '#555' }}>Ing. Sanchez Danny</p>
                </div>
              </div>

              <div className="carta-documento-info">
                <div>
                  <strong>Fecha de Ejecución:</strong>
                  <span className="font-bold">{fullscreenSheetDate}</span>
                </div>
                <div>
                  <strong>Tipo de Procedimiento:</strong>
                  <span>Mantenimiento Preventivo</span>
                </div>
                <div>
                  <strong>Documento:</strong>
                  <span>Hoja Oficial F-MT-01</span>
                </div>
              </div>

              <div className="carta-tabla-wrapper">
                <table className="carta-tabla">
                  <thead>
                    <tr>
                      <th style={{ width: '4%' }}>N°</th>
                      <th style={{ width: '13%' }}>Equipo / TAG</th>
                      <th style={{ width: '17%' }}>Actividad</th>
                      <th style={{ width: '8%' }}>Frec.</th>
                      <th style={{ width: '26%' }}>Procedimiento</th>
                      <th style={{ width: '17%' }}>Herramientas e Insumos</th>
                      <th style={{ width: '7%' }}>T. Est.</th>
                      <th style={{ width: '8%' }}>Firma</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedByDate[fullscreenSheetDate].map((ot, idx) => (
                      <tr key={ot.id}>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{idx + 1}</td>
                        <td>
                          <strong>{ot.equipmentTag}</strong>
                          <div style={{ fontSize: '9px', color: '#444' }}>{ot.equipmentName}</div>
                        </td>
                        <td>
                          <strong>{ot.title}</strong>
                          <div style={{ fontSize: '9px', color: '#666' }}>Sistema: {ot.system}</div>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{ot.frequency}</td>
                        <td>
                          <ol>
                            {ot.procedureSteps.map((step, sIdx) => (
                              <li key={sIdx}>{step.step}</li>
                            ))}
                          </ol>
                        </td>
                        <td>
                          <ul>
                            {ot.toolsUsed.map((tool, tIdx) => (
                              <li key={`t-${tIdx}`}>🛠️ {tool}</li>
                            ))}
                            {ot.suppliesUsed.map((sup, sIdx) => (
                              <li key={`s-${sIdx}`}>🧴 {sup}</li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ textAlign: 'center' }}>{ot.estimatedTime}</td>
                        <td style={{ textAlign: 'center', fontSize: '9px' }}>
                          {ot.technicianSignature || ot.assignedTechnician}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ border: '1px solid #000', padding: '8px', minHeight: '80px', marginTop: '10px' }}>
                <strong style={{ fontSize: '10px', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Observaciones Técnicas / Registro de Ejecución:
                </strong>
                <div style={{ fontSize: '10px', color: '#333' }}>
                  {groupedByDate[fullscreenSheetDate].map(o => o.observations).filter(Boolean).join(' | ') ||
                    'Sin desviaciones operativas registradas durante la ejecución.'}
                </div>
              </div>

              <div className="carta-firmas">
                <div className="carta-firma-box">
                  <strong>Técnico de Mantenimiento</strong>
                  <span>Ejecutor</span>
                </div>
                <div className="carta-firma-box">
                  <strong>Supervisor de Calidad</strong>
                  <span>Verificador</span>
                </div>
                <div className="carta-firma-box">
                  <strong>Jefe de Planta</strong>
                  <span>Aprobador</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '8.5px', color: '#555', marginTop: '6px', borderTop: '1px solid #ddd', paddingTop: '4px' }}>
                SGMI • Sistema elaborado por el Ingeniero Sanchez Danny • Formato Oficial F-MT-01 Rev.01 • ISO 9001:2015
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
