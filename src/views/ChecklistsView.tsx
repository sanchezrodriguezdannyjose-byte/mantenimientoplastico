import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { ChecklistItemStatus } from '../types';
import {
  CheckSquare,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  History,
  ShieldCheck,
  Flame,
  ChevronRight
} from 'lucide-react';

export const ChecklistsView: React.FC = () => {
  const { equipments, checklistLogs, saveChecklistExecution, setActiveTab } = useMaintenance();

  const [activeChecklistType, setActiveChecklistType] = useState<
    'diario_inyeccion' | 'semanal_general' | 'chiller' | 'compresor' | 'planta'
  >('diario_inyeccion');

  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string>(equipments[0]?.id || '');
  const [operatorName, setOperatorName] = useState<string>('Operador de Turno');
  const [shift, setShift] = useState<string>('Turno 1 - Mañana');
  const [autoCreateOt, setAutoCreateOt] = useState<boolean>(true);

  // Default checklist templates
  const checklistTemplates = {
    diario_inyeccion: [
      { id: 'd-1', category: 'Mecánico', label: 'Verificar ausencia de fugas de aceite en piso o bancada bajo la máquina.' },
      { id: 'd-2', category: 'Hidráulico', label: 'Comprobar nivel de aceite en mirilla del tanque y temperatura en rango (< 55°C).' },
      { id: 'd-3', category: 'Neumático', label: 'Drenar agua condensada de la unidad FRL y verificar presión en 6.5 bar.' },
      { id: 'd-4', category: 'Eléctrico', label: 'Inspeccionar que no existan chispazos, olores a quemado ni cables de potencia sueltos.' },
      { id: 'd-5', category: 'Electrónico', label: 'Verificar que la pantalla HMI no tenga alarmas activas de Pirómetro o Termopar.' },
      { id: 'd-6', category: 'Seguridad', label: 'Probar paros de emergencia (setas rojas) y cortina óptica de seguridad de molde.' },
      { id: 'd-7', category: 'Proceso', label: 'Comprobar estabilidad térmica en zonas de barril y boquilla de inyección.' },
      { id: 'd-8', category: 'Limpieza', label: 'Retirar rebabas y restos de resina de la línea de cierre del molde y tolva.' }
    ],
    semanal_general: [
      { id: 's-1', category: 'Mecánico', label: 'Engrasar manualmente pasadores de rodillera, columnas y codos de eyección.' },
      { id: 's-2', category: 'Mecánico', label: 'Verificar apriete de tornillos y grapas de fijación del molde a 190 Nm.' },
      { id: 's-3', category: 'Hidráulico', label: 'Revisar indicador de saturación del filtro de retorno hidráulico.' },
      { id: 's-4', category: 'Neumático', label: 'Revisar mangueras de aire y silenciadores de escape de electroválvulas.' },
      { id: 's-5', category: 'Eléctrico', label: 'Limpiar polvo exterior del tablero eléctrico con aire seco a baja presión.' },
      { id: 's-6', category: 'Electrónico', label: 'Revisar integridad mecánica de cables de sensores inductivos y termopares.' },
      { id: 's-7', category: 'Proceso', label: 'Limpiar el asiento de la boquilla de inyección contra el bebedero del molde.' }
    ],
    chiller: [
      { id: 'c-1', category: 'Chiller', label: 'Temperatura de suministro de agua fría hacia moldes entre 10°C y 12°C.' },
      { id: 'c-2', category: 'Chiller', label: 'Temperatura de retorno con diferencial térmico correcto (ΔT entre 3°C y 5°C).' },
      { id: 'c-3', category: 'Chiller', label: 'Presión de succión y descarga dentro de rango de trabajo según manómetros.' },
      { id: 'c-4', category: 'Chiller', label: 'Serpentín condensador libre de suciedad y pelusa que bloquee el flujo de aire.' },
      { id: 'c-5', category: 'Chiller', label: 'Bomba de recirculación sin ruidos de cavitación y con caudal continuo.' }
    ],
    compresor: [
      { id: 'k-1', category: 'Compresor', label: 'Purgar condensado acumulado en tanque pulmón y verificar purgas automáticas.' },
      { id: 'k-2', category: 'Compresor', label: 'Presión de red neumática estable en 7.5 bar.' },
      { id: 'k-3', category: 'Compresor', label: 'Nivel de aceite en mirilla del separador en zona verde.' },
      { id: 'k-4', category: 'Compresor', label: 'Temperatura de elemento compresor de tornillo inferior a 90°C.' },
      { id: 'k-5', category: 'Compresor', label: 'Punto de rocío del secador frigorífico inferior a 3°C (aire seco).' }
    ],
    planta: [
      { id: 'g-1', category: 'Planta', label: 'Nivel de combustible diésel en tanque diario superior al 75% de capacidad.' },
      { id: 'g-2', category: 'Planta', label: 'Nivel de aceite de motor y refrigerante en marcas recomendadas.' },
      { id: 'g-3', category: 'Planta', label: 'Voltaje de batería de arranque en reposo superior a 12.6V.' },
      { id: 'g-4', category: 'Planta', label: 'Calentador de camisas tibio al tacto (40°C) para arranque inmediato.' },
      { id: 'g-5', category: 'Planta', label: 'Selector del panel en posición "AUTO" para respuesta del tablero ATS.' }
    ]
  };

  // State of responses for current active template
  const [itemsStatus, setItemsStatus] = useState<Record<string, 'ok' | 'fallo' | 'na'>>({});
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});

  const currentTemplate = checklistTemplates[activeChecklistType];

  const handleStatusChange = (itemId: string, status: 'ok' | 'fallo' | 'na') => {
    setItemsStatus(prev => ({ ...prev, [itemId]: status }));
  };

  const handleNoteChange = (itemId: string, note: string) => {
    setItemNotes(prev => ({ ...prev, [itemId]: note }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEq = equipments.find(e => e.id === selectedEquipmentId) || equipments[0];
    if (!targetEq) return;

    const fullItems: ChecklistItemStatus[] = currentTemplate.map(it => ({
      id: it.id,
      category: it.category,
      label: it.label,
      status: itemsStatus[it.id] || 'ok',
      note: itemNotes[it.id]
    }));

    saveChecklistExecution(
      activeChecklistType,
      targetEq.id,
      `${targetEq.tag} - ${targetEq.name}`,
      operatorName,
      shift,
      fullItems,
      autoCreateOt
    );

    // Reset status for next check
    setItemsStatus({});
    setItemNotes({});
  };

  const hasAnyFailure = currentTemplate.some(it => itemsStatus[it.id] === 'fallo');

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="p-5 rounded-2xl bg-[#151c2c] border border-slate-800">
        <h2 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <CheckSquare className="w-5 h-5 text-cyan-400" />
          Checklists Operativos y Bitácoras de Inspección en Línea
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Inspecciones diarias por turno y semanales. Al registrar una no conformidad (Falla), el sistema genera automáticamente la Orden de Trabajo Correctiva vinculada.
        </p>
      </div>

      {/* Select Checklist Type Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-[#151c2c] border border-slate-800">
        {[
          { id: 'diario_inyeccion', label: 'Diario: Inyección y Soplado' },
          { id: 'semanal_general', label: 'Semanal: Mecánico y Eléctrico' },
          { id: 'chiller', label: 'Auxiliar: Chiller Central' },
          { id: 'compresor', label: 'Auxiliar: Compresor de Aire' },
          { id: 'planta', label: 'Auxiliar: Planta Eléctrica' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              setActiveChecklistType(t.id as any);
              setItemsStatus({});
              setItemNotes({});
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeChecklistType === t.id
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form to Fill */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 p-6 rounded-2xl bg-[#151c2c] border border-slate-800 space-y-5 text-xs">
          {/* Metadata: Equipment, Shift, Operator */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Equipo Inspeccionado:</label>
              <select
                value={selectedEquipmentId}
                onChange={e => setSelectedEquipmentId(e.target.value)}
                required
                className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold"
              >
                {equipments.map(eq => (
                  <option key={eq.id} value={eq.id}>
                    {eq.tag} - {eq.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Turno de Operación:</label>
              <select
                value={shift}
                onChange={e => setShift(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs"
              >
                <option value="Turno 1 - Mañana (07:00 - 15:00)">Turno 1 - Mañana</option>
                <option value="Turno 2 - Tarde (15:00 - 23:00)">Turno 2 - Tarde</option>
                <option value="Turno 3 - Noche (23:00 - 07:00)">Turno 3 - Noche</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Operador / Inspector:</label>
              <input
                type="text"
                value={operatorName}
                onChange={e => setOperatorName(e.target.value)}
                required
                placeholder="Nombre del operador"
                className="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Checklist Items Rows */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-slate-400 font-bold uppercase text-[11px] px-2">
              <span>Punto de Inspección / Condición</span>
              <span className="pr-4">Evaluación</span>
            </div>

            {currentTemplate.map((item, idx) => {
              const currentVal = itemsStatus[item.id] || 'ok';
              const isFailed = currentVal === 'fallo';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isFailed
                      ? 'bg-rose-950/30 border-rose-500/60'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-cyan-400 mr-2 text-[11px] uppercase">
                          [{item.category}]
                        </span>
                        <span className="text-slate-200 text-xs font-medium">{item.label}</span>
                      </div>
                    </div>

                    {/* Radio Options */}
                    <div className="flex items-center gap-1.5 shrink-0 pl-7 sm:pl-0">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'ok')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                          currentVal === 'ok'
                            ? 'bg-emerald-500 text-slate-950 shadow-sm'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> OK
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'fallo')}
                        className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1 ${
                          currentVal === 'fallo'
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 animate-pulse'
                            : 'bg-slate-800 text-slate-400 hover:text-rose-400'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" /> Falla
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(item.id, 'na')}
                        className={`px-2 py-1 rounded-lg font-medium text-[11px] transition-colors ${
                          currentVal === 'na'
                            ? 'bg-slate-700 text-white'
                            : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        N/A
                      </button>
                    </div>
                  </div>

                  {/* Optional Note input if failed */}
                  {isFailed && (
                    <div className="mt-2.5 pt-2 border-t border-rose-500/30 pl-7">
                      <input
                        type="text"
                        placeholder="Describe la falla observada (ej: goteo en racor, sonido extraño)..."
                        value={itemNotes[item.id] || ''}
                        onChange={e => handleNoteChange(item.id, e.target.value)}
                        className="w-full p-2 rounded-lg bg-rose-950/40 border border-rose-500/50 text-rose-100 text-xs placeholder:text-rose-300/50"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Failure Alert Box */}
          {hasAnyFailure && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-400 shrink-0" />
                <span>
                  <strong>Condición No Conforme Detectada:</strong> Se generará automáticamente una Orden de Trabajo Correctiva con prioridad Crítica para atender esta desviación.
                </span>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-700">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={autoCreateOt}
                onChange={e => setAutoCreateOt(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
              Crear OT Correctiva automática en caso de falla
            </label>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all flex items-center gap-1.5"
            >
              <CheckSquare className="w-4 h-4" />
              Firmar y Guardar Checklist
            </button>
          </div>
        </form>

        {/* Saved History Sidebar */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-[#151c2c] border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <History className="w-4 h-4 text-cyan-400" />
            Historial de Inspecciones ({checklistLogs.length})
          </h3>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1 text-xs">
            {checklistLogs.map(log => (
              <div
                key={log.id}
                className={`p-3 rounded-xl border flex flex-col gap-1.5 ${
                  log.passed
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-rose-950/20 border-rose-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate max-w-[170px]">{log.equipmentName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.passed
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300 animate-pulse'
                    }`}
                  >
                    {log.passed ? '100% Conforme' : 'Con Fallas'}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{log.date} ({log.timestamp})</span>
                  <span>{log.shift.split(' ')[0]} {log.shift.split(' ')[1]}</span>
                </div>

                <div className="text-[11px] text-slate-300 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span>Insp: {log.operatorName}</span>
                  {log.generatedWorkOrderId && (
                    <button
                      onClick={() => setActiveTab('ordenes')}
                      className="text-cyan-400 hover:underline font-bold text-[10px]"
                    >
                      Ver OT Generada →
                    </button>
                  )}
                </div>
              </div>
            ))}

            {checklistLogs.length === 0 && (
              <p className="text-center py-10 text-slate-500 text-xs">
                No hay checklists guardados en el historial todavía. Cada inspección completada se almacenará aquí con fecha y responsable.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
