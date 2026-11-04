import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import {
  AlertTriangle,
  Search,
  Flame,
  CheckCircle2,
  Wrench,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface FallasViewProps {
  onOpenReportFailureWithData: (symptom: string, system: string) => void;
}

export const FallasView: React.FC<FallasViewProps> = ({ onOpenReportFailureWithData }) => {
  const { failures, resolveFailureIncident } = useMaintenance();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSystemFilter, setActiveSystemFilter] = useState('todos');

  const troubleshootingCatalog = [
    {
      symptom: 'Fuga de aceite hidráulico en el piso bajo la bancada o plato',
      system: 'Hidráulico',
      badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      cause: 'Manguera de alta presión agrietada por fatiga, racor flojo por vibración o kit de sellos de cilindro desgastado.',
      solution: 'Despresurizar el circuito y colocar LOTO. Reemplazar manguera o reapretar racor. Sustituir retenes y o-rings de vitón si es en cilindro.'
    },
    {
      symptom: 'La máquina no cierra el molde (hace intento y retrocede de inmediato)',
      system: 'Automatización y Seguridad',
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      cause: 'Protección de baja presión activada por rebaba o pieza atorada, o sensor inductivo de inicio de cierre descalibrado/sucio.',
      solution: 'Revisar cavidades en modo manual. Limpiar la cara activa del sensor inductivo. Verificar la válvula proporcional de cierre.'
    },
    {
      symptom: 'Ruido anormal (chillido metálico) durante apertura, cierre o inyección',
      system: 'Mecánico',
      badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      cause: 'Falta de grasa de alta presión en bujes de rodillera o cruceta, o desgaste severo en pasadores.',
      solution: 'Inyectar grasa EP-2 manualmente. Si el ruido persiste, montar comparador de carátula para medir holgura radial (> 0.25 mm requiere recambio).'
    },
    {
      symptom: 'Temperatura de zona de barril no sube o fluctúa bruscamente',
      system: 'Eléctrico',
      badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      cause: 'Resistencia tipo banda calefactora abierta (quemada), termopar tipo J desconectado/dañado o relé de estado sólido (SSR) averiado.',
      solution: 'Medir corriente con pinza amperimétrica. Comprobar continuidad de la banda calefactora y contacto físico del termopar en el fondo del pozo.'
    },
    {
      symptom: 'En sopladora: el parisón de PEAD desciende torcido o con curvatura',
      system: 'Soplado',
      badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      cause: 'Dado o mandril con resina carbonizada adherida en un labio, descentrado de boquilla o gradiente de temperatura desigual.',
      solution: 'Limpiar labios del cabezal con raspador de cobre. Verificar con pirómetro que no haya zonas frías y centrar pernos con llaves Allen.'
    },
    {
      symptom: 'Piezas moldeadas presentan rebabas (Flash) excesivas en línea de partición',
      system: 'Proceso y Mecánico',
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      cause: 'Fuerza de cierre insuficiente, desalineación o falta de paralelismo de platos, o presión de sostenimiento excesivamente alta.',
      solution: 'Limpiar caras de molde. Reajustar altura de molde y tonelaje en HMI. Verificar paralelismo con galgas. Bajar presión de empaque.'
    },
    {
      symptom: 'Pantalla HMI muestra "Error de Comunicación con PLC / Time-out"',
      system: 'Automatización',
      badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      cause: 'Cable Ethernet/Profibus desconectado o con pines sueltos, falla en fuente de 24VDC o módulo de red del PLC bloqueado.',
      solution: 'Revisar LEDs LINK/ACT en el switch industrial. Verificar voltaje de 24VDC. Reiniciar rack de control de forma segura.'
    },
    {
      symptom: 'Caída de presión general de aire comprimido en planta (< 5.5 bar)',
      system: 'Compresor',
      badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      cause: 'Compresor principal disparado por temperatura, purga automática trabada en abierto o filtro separador colmatado.',
      solution: 'Inspeccionar panel del compresor Atlas Copco. Recorrer la red verificando purgas abiertas y sustituir filtros si el ΔP es alto.'
    },
    {
      symptom: 'El husillo se atasca o el motor se detiene por sobrecarga durante la carga',
      system: 'Mecánico',
      badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      cause: 'Material frío en el barril por falta de empape térmico, contrapresión de plastificación muy alta o cuerpo metálico trabado.',
      solution: 'Aumentar 10°C la temperatura y esperar 15 minutos. Bajar contrapresión a 5 bar. Si persiste, retirar husillo para inspección de impurezas.'
    },
    {
      symptom: 'Temperatura del agua del Chiller sube a más de 18°C (Alarma de moldes calientes)',
      system: 'Chiller',
      badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
      cause: 'Serpentín condensador tapado de pelusa, fuga parcial de refrigerante R-410A o filtro colador tipo Y obstruido de sarro.',
      solution: 'Soplar serpentín con aire comprimido. Verificar presiones en manómetros de alta/baja. Limpiar filtro de agua y verificar caudal.'
    }
  ];

  const filteredCatalog = troubleshootingCatalog.filter(f => {
    const matchesSystem = activeSystemFilter === 'todos' || f.system.toLowerCase().includes(activeSystemFilter.toLowerCase());
    const matchesSearch =
      f.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.system.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.cause.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.solution.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSystem && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 rounded-2xl bg-[#151c2c] border border-slate-800">
        <h2 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          Matriz de Diagnóstico y Solución de Fallas (Troubleshooting)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Guía técnica para identificar causas raíz y acciones correctivas en planta. Puedes reportar cualquier síntoma en un equipo con 1 clic para abrir la OT Correctiva correspondiente.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#151c2c] border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {['todos', 'hidráulico', 'mecánico', 'eléctrico', 'soplado', 'chiller', 'compresor'].map(sys => (
            <button
              key={sys}
              onClick={() => setActiveSystemFilter(sys)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                activeSystemFilter === sys
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {sys === 'todos' ? 'Todos los Sistemas' : sys}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar falla (ej: fuga, temperatura, ruido, husillo)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Troubleshooting Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#151c2c]">
        <table className="w-full text-xs text-left min-w-[850px]">
          <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3 w-64">Síntoma / Condición de Falla</th>
              <th className="p-3 w-32">Sistema</th>
              <th className="p-3 w-64">Posible Causa Raíz</th>
              <th className="p-3">Acción Correctiva (Solución Técnica)</th>
              <th className="p-3 w-36 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/20">
            {filteredCatalog.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                <td className="p-3 font-semibold text-white">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0"></span>
                    <span>{item.symptom}</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${item.badge}`}>
                    {item.system}
                  </span>
                </td>
                <td className="p-3 text-slate-300 leading-relaxed">
                  {item.cause}
                </td>
                <td className="p-3 text-cyan-200 font-medium leading-relaxed bg-cyan-950/10">
                  {item.solution}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => onOpenReportFailureWithData(item.symptom, item.system)}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white font-bold text-xs transition-colors inline-flex items-center gap-1 shadow-sm"
                    title="Reportar esta avería en una máquina"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-300" />
                    Reportar
                  </button>
                </td>
              </tr>
            ))}
            {filteredCatalog.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 text-xs">
                  No se encontraron fallas que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Active Reported Incidents Log */}
      <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
          <Clock className="w-4 h-4 text-cyan-400" />
          Bitácora de Incidentes de Planta Registrados ({failures.length})
        </h3>

        <div className="space-y-2.5 text-xs">
          {failures.map(inc => (
            <div
              key={inc.id}
              className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                inc.status === 'abierta'
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === 'Critica'
                        ? 'bg-rose-500 text-slate-950'
                        : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {inc.severity}
                  </span>
                  <span className="text-[10px] text-slate-400">Sistema: {inc.system}</span>
                  <span className="text-[10px] text-slate-500">• {inc.reportedAt}</span>
                </div>
                <h4 className="font-bold text-white text-xs">{inc.symptom}</h4>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {inc.status === 'abierta' ? (
                  <button
                    onClick={() => resolveFailureIncident(inc.id)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Marcar Resuelta
                  </button>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resuelta
                  </span>
                )}
              </div>
            </div>
          ))}

          {failures.length === 0 && (
            <p className="text-slate-500 italic py-4">No hay fallas reportadas activas.</p>
          )}
        </div>
      </div>
    </div>
  );
};
