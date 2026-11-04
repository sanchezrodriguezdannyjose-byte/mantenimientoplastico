import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import {
  Wrench,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Layers,
  ArrowRight,
  HardHat,
  RotateCcw
} from 'lucide-react';

export const MontajeMoldesView: React.FC = () => {
  const { equipments, moldRecords, mountMold, unmountMold } = useMaintenance();

  const [selectedMoldId, setSelectedMoldId] = useState('');
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [torqueNm, setTorqueNm] = useState(190);
  const [liftingOk, setLiftingOk] = useState(false);
  const [waterOk, setWaterOk] = useState(false);
  const [technician, setTechnician] = useState('Carlos Méndez (Matricero)');
  const [notes, setNotes] = useState('');

  // Unmounting state
  const [unmountingMoldId, setUnmountingMoldId] = useState<string | null>(null);
  const [cyclesRunInput, setCyclesRunInput] = useState(15000);

  const molds = equipments.filter(e => e.type === 'molde');
  const machines = equipments.filter(e => e.type === 'inyeccion' || e.type === 'soplado');

  const availableMolds = molds.filter(m => m.status === 'almacenado' || !m.mountedOnMachineId);
  const mountedMolds = molds.filter(m => m.mountedOnMachineId);

  const handleMountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMoldId || !selectedMachineId) {
      alert('Por favor selecciona el molde y la máquina.');
      return;
    }
    if (!liftingOk || !waterOk) {
      alert('Debes confirmar las verificaciones críticas de seguridad e izaje antes de montar.');
      return;
    }

    mountMold(
      selectedMoldId,
      selectedMachineId,
      torqueNm,
      { lifting: liftingOk, water: waterOk },
      technician,
      notes
    );

    // Reset fields
    setSelectedMoldId('');
    setSelectedMachineId('');
    setLiftingOk(false);
    setWaterOk(false);
    setNotes('');
  };

  const handleUnmountSubmit = (moldId: string) => {
    unmountMold(moldId, cyclesRunInput, technician, 'Desmontaje para cambio de lote');
    setUnmountingMoldId(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="p-5 rounded-2xl bg-[#151c2c] border border-slate-800">
        <h2 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-400" />
          Procedimiento Oficial de Montaje y Desmontaje de Moldes
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Protocolo de seguridad para izaje, alineación con anillo centrador, apriete a 190 Nm y trazabilidad de utillajes.
        </p>
      </div>

      {/* Critical Safety Alert */}
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-rose-300 text-sm block mb-1">
            Advertencia de Seguridad Crítica en Maniobras de Izaje
          </strong>
          El izaje de moldes (pesos de 200 kg a más de 3 toneladas) representa una operación de alto riesgo. Es mandatorio verificar que los cáncamos roscados estén apretados a tope, que las eslingas de poliéster no tengan cortes ni quemaduras, y que el área esté 100% despejada. Nunca ubicarse bajo carga suspendida.
        </div>
      </div>

      {/* Active Mounted Molds Monitor */}
      <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Moldes Actualmente Montados en Producción ({mountedMolds.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mountedMolds.map(mld => {
            const currentMachine = machines.find(m => m.id === mld.mountedOnMachineId);
            return (
              <div
                key={mld.id}
                className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">{mld.tag}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      En Operación
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{mld.name}</h4>
                  <p className="text-[11px] text-cyan-400 mt-1">
                    Montado en: <strong>{currentMachine ? `${currentMachine.tag} - ${currentMachine.name}` : mld.location}</strong>
                  </p>
                  <div className="mt-2 text-[11px] text-slate-400">
                    Ciclos acumulados: <span className="font-mono text-white font-bold">{mld.currentHours.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setUnmountingMoldId(mld.id)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Desmontar y Guardar
                  </button>
                </div>
              </div>
            );
          })}

          {mountedMolds.length === 0 && (
            <p className="text-xs text-slate-500 italic py-4 col-span-full">
              No hay moldes montados en este momento. Utiliza el formulario a continuación para registrar un nuevo montaje.
            </p>
          )}
        </div>
      </div>

      {/* Unmount Modal Prompt */}
      {unmountingMoldId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">Desmontaje de Molde y Registro de Ciclos</h3>
            <p className="text-slate-400">
              Registra cuántos ciclos corrió este molde durante el lote actual para sumar al horómetro de mantenimiento.
            </p>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ciclos Producidos en este Lote:</label>
              <input
                type="number"
                min="0"
                value={cyclesRunInput}
                onChange={e => setCyclesRunInput(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono font-bold"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setUnmountingMoldId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUnmountSubmit(unmountingMoldId)}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold"
              >
                Confirmar Desmontaje
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Form: Mount a Mold */}
      <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <HardHat className="w-4 h-4 text-amber-400" />
          Registrar Nuevo Montaje de Molde (Checklist de Izaje y Torque)
        </h3>

        <form onSubmit={handleMountSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Molde a Montar *</label>
              <select
                value={selectedMoldId}
                onChange={e => setSelectedMoldId(e.target.value)}
                required
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-medium"
              >
                <option value="">-- Seleccionar molde disponible --</option>
                {availableMolds.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.tag} - {m.name} ({m.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Máquina Receptora *</label>
              <select
                value={selectedMachineId}
                onChange={e => setSelectedMachineId(e.target.value)}
                required
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-medium"
              >
                <option value="">-- Seleccionar máquina de inyección o soplado --</option>
                {machines.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.tag} - {m.name} ({m.activeMoldId ? 'Actualmente con molde' : 'Libre'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Torque Aplicado a Pernos / Grapas (Nm) *
              </label>
              <input
                type="number"
                min="100"
                max="400"
                value={torqueNm}
                onChange={e => setTorqueNm(parseInt(e.target.value) || 190)}
                required
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono font-bold"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Estándar recomendado: 190 Nm en cruz.</span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Técnico Matricero / Montador *</label>
              <input
                type="text"
                value={technician}
                onChange={e => setTechnician(e.target.value)}
                required
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>
          </div>

          {/* Safety Confirmations */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
            <h4 className="font-bold text-slate-200">Verificaciones de Seguridad Obligatorias:</h4>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="chk-lift"
                checked={liftingOk}
                onChange={e => setLiftingOk(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
              <label htmlFor="chk-lift" className="text-slate-300 cursor-pointer">
                Verifiqué cáncamos bien roscados, eslingas sin desgaste y polipasto centrado sobre la gravedad del molde.
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="chk-water"
                checked={waterOk}
                onChange={e => setWaterOk(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
              />
              <label htmlFor="chk-water" className="text-slate-300 cursor-pointer">
                Conecté mangueras de agua del Chiller, verifiqué flujo continuo y ausencia total de goteos en línea de partición.
              </label>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Observaciones del Montaje</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Número de grapas utilizadas, centrado con anillo, prueba de cierre en vacío realizada..."
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Registrar Montaje y Generar OT
            </button>
          </div>
        </form>
      </div>

      {/* 2-Column: Tools Table & 8-Step Procedure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
            <Wrench className="w-4 h-4 text-cyan-400" />
            Herramientas y Equipos de Montaje Homologados
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[320px]">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="pb-2">Herramienta / Equipo</th>
                  <th className="pb-2">Uso Específico</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr><td className="py-2.5 font-semibold text-white">Polipasto / Grúa Pórtico 2T</td><td>Izaje vertical y balanceo seguro del molde.</td></tr>
                <tr><td className="py-2.5 font-semibold text-white">Eslingas y Grilletes Certificados</td><td>Sujeción de 2 o 4 puntos en cáncamos.</td></tr>
                <tr><td className="py-2.5 font-semibold text-white">Torquímetro Dinamométrico</td><td>Garantizar apriete exacto a 190 Nm en tornillos/clamps.</td></tr>
                <tr><td className="py-2.5 font-semibold text-white">Anillo Centrador</td><td>Alineación concéntrica de la boquilla con el bebedero.</td></tr>
                <tr><td className="py-2.5 font-semibold text-white">Grapas de Fijación (Clamps)</td><td>Sujeción de pestañas de molde si no hay barrenos directos.</td></tr>
                <tr><td className="py-2.5 font-semibold text-white">Carro de Transporte Hidráulico</td><td>Traslado desde matricería hasta la bancada de máquina.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Procedimiento de Montaje Paso a Paso (8 Pasos)
          </h3>
          <ol className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">1</span>
              <span><strong>Inspección Previa:</strong> Verificar que el molde esté limpio, caras pulidas sin golpes y cáncamos firmes.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">2</span>
              <span><strong>Traslado y Preparación:</strong> Trasladar en carro, enganchar eslingas y elevar 20 cm para verificar balance de centro de gravedad.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">3</span>
              <span><strong>Izaje e Introducción:</strong> Ingresar lentamente por encima de las barras de cierre sin golpear las columnas.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">4</span>
              <span><strong>Alineación y Centrado:</strong> Encajar el anillo centrador en el barreno del plato fijo de inyección.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">5</span>
              <span><strong>Fijación Provisional:</strong> Ajustar 2 tornillos diagonales en lado fijo con la mano.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">6</span>
              <span><strong>Ajuste de Altura de Molde:</strong> Cerrar a baja velocidad hasta contacto y fijar plato móvil.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">7</span>
              <span><strong>Apriete Final a Torque:</strong> Apretar todos los tornillos a 190 Nm en patrón cruzado. Retirar polipasto.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center justify-center shrink-0">8</span>
              <span><strong>Verificación Final:</strong> Conectar agua de refrigeración, cables de zonas calientes y probar ciclo en vacío.</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
};
