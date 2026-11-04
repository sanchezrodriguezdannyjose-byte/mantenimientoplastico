import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import {
  Layers,
  HeartPulse,
  Calendar,
  CalendarDays,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Wrench,
  Droplet
} from 'lucide-react';

export const MantenimientoMoldesView: React.FC = () => {
  const { equipments, updateEquipment, addWorkOrder } = useMaintenance();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'diario': true,
    'periodico': true,
    'overhaul': true
  });

  const toggleSection = (s: string) => {
    setOpenSections(prev => ({ ...prev, [s]: !prev[s] }));
  };

  const molds = equipments.filter(e => e.type === 'molde');

  const handleRegisterOverhaul = (moldId: string) => {
    const mold = molds.find(m => m.id === moldId);
    if (!mold) return;

    if (
      window.confirm(
        `¿Confirmas el Overhaul Mayor para el molde '${mold.name}'? Se reiniciará el contador de ciclos para el próximo ciclo de mantenimiento profundo.`
      )
    ) {
      updateEquipment(mold.id, {
        currentHours: 0,
        lastMaintenanceDate: new Date().toISOString().split('T')[0]
      });

      addWorkOrder({
        type: 'Overhaul',
        equipmentId: mold.id,
        equipmentTag: mold.tag,
        equipmentName: mold.name,
        status: 'Completada',
        priority: 'Alta',
        scheduledDate: new Date().toISOString().split('T')[0],
        title: `Overhaul Mayor y Rectificado: ${mold.name}`,
        system: 'Moldes',
        frequency: 'Semestral',
        estimatedTime: '8.0 Horas',
        realDurationHours: 8.0,
        assignedTechnician: 'Taller de Matricería Central',
        verifierSupervisor: 'Jefe de Calidad e Ingeniería',
        plantManager: 'Ing. Danny Sánchez',
        procedureSteps: [
          { step: 'Desmontaje total de cavidades, corazones y placa expulsora.', completed: true },
          { step: 'Limpieza ultrasónica y desincrustación química de canales.', completed: true },
          { step: 'Medición dimensional de desgastes y ajuste de plano de partición.', completed: true },
          { step: 'Reemplazo del 100% de o-rings de vitón y resortes de retorno.', completed: true },
          { step: 'Pulido espejo de cavidades con pasta de diamante.', completed: true }
        ],
        toolsUsed: ['Tina de ultrasonido', 'Micrómetro de profundidad', 'Pasta de diamante'],
        suppliesUsed: ['Desincrustante biodegradable', 'Kit O-rings vitón'],
        partsConsumed: [
          { partId: 'inv-rep-09', partName: 'Kit de O-Rings Vitón Alta Temperatura', quantity: 1, unitCost: 14.0 },
          { partId: 'inv-rep-08', partName: 'Resorte de Retorno Molde Carga Media', quantity: 4, unitCost: 12.0 }
        ],
        observations: 'Overhaul mayor completado satisfactoriamente. Cavidades restauradas a tolerancia cero.',
        technicianSignature: 'Taller Matricería',
        supervisorSignature: 'Ing. Roberto Silva'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#151c2c] border border-slate-800">
        <h2 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Mantenimiento Preventivo Profundo de Moldes de Inyección y Soplado
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          El molde es el componente crítico de calidad. Un mantenimiento estructurado reduce rebabas, atascos de eyección y extiende la vida útil de los aceros hasta millones de ciclos.
        </p>
      </div>

      {/* Info Card: The Heart of the Process */}
      <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs flex items-start gap-3">
        <HeartPulse className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-cyan-300 text-sm block mb-1">
            El Molde es el "Corazón" del Proceso Plástico
          </strong>
          Un molde descuidado genera rebabas (Flash), inyecciones cortas, marcas térmicas y paradas no planificadas. Cada ciclo de inyección y soplado somete los insertos a presiones superiores a 1000 bar y choques térmicos continuos.
        </div>
      </div>

      {/* Cycle Trackers per Mold */}
      <div className="p-6 rounded-2xl bg-[#151c2c] border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Monitoreo de Ciclos y Vencimiento de Overhaul por Molde
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {molds.map(mold => {
            const max = mold.maxCyclesBeforeOverhaul || 200000;
            const current = mold.currentHours; // used for cycles in molds
            const percent = Math.min(100, Math.round((current / max) * 100));
            const isNearOverhaul = percent >= 80;

            return (
              <div
                key={mold.id}
                className={`p-4 rounded-xl border flex flex-col justify-between ${
                  isNearOverhaul
                    ? 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-cyan-300">{mold.tag}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isNearOverhaul
                          ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {percent}% de vida de ciclo
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-tight">{mold.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Ubicación: {mold.location}</p>

                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Ciclos Corridos:</span>
                      <span className="font-mono text-white font-bold">
                        {current.toLocaleString()} / {max.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent >= 90
                            ? 'bg-rose-500'
                            : percent >= 75
                            ? 'bg-amber-400'
                            : 'bg-cyan-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-500">Último PM: {mold.lastMaintenanceDate}</span>
                  <button
                    onClick={() => handleRegisterOverhaul(mold.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    title="Registrar Overhaul de Molde y reiniciar ciclos"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Overhaul
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Routine 1: Daily Turn Maintenance */}
      <div className="rounded-2xl bg-[#151c2c] border border-slate-800 overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('diario')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="text-sm font-bold text-white">
              Inspección y Limpieza por Turno (Antes y Después de Cada Corrida)
            </h3>
          </div>
          {openSections['diario'] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {openSections['diario'] && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/40 overflow-x-auto text-xs">
            <table className="w-full text-left min-w-[650px]">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="pb-2 w-48">Área / Componente</th>
                  <th className="pb-2">Tarea de Limpieza y Control</th>
                  <th className="pb-2 w-56">Criterio de Aceptación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-2.5 font-bold text-white">Cavidades y Corazones</td>
                  <td>Limpiar residuos de resina, vapores plásticos condensados o grasa con paño 100% algodón y solvente.</td>
                  <td className="text-cyan-300">Superficie espejo libre de marcas o rayas.</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white">Línea de Partición</td>
                  <td>Retirar cualquier rebaba de plástico aplastada. Verificar que no existan golpes ni abolladuras.</td>
                  <td className="text-cyan-300">Asiento hermético al cerrar sin paso de luz.</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white">Canales de Refrigeración</td>
                  <td>Inspección visual de racores rápidos; verificar que no existan microfugas que mojen la cavidad.</td>
                  <td className="text-cyan-300">Cero gotas de condensación en el molde.</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white">Ranuras de Venteo</td>
                  <td>Limpiar venteos (profundidad 0.02 - 0.03 mm) con raspador blando de latón para evitar quemaduras por aire.</td>
                  <td className="text-cyan-300">Venteos 100% permeables a los gases.</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white">Pines Expulsores (Eyectores)</td>
                  <td>Verificar que retornen suavemente a su posición rasante sin atascos por fricción.</td>
                  <td className="text-cyan-300">Movimiento libre sin juego excesivo.</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Routine 2: Periodic Monthly Maintenance */}
      <div className="rounded-2xl bg-[#151c2c] border border-slate-800 overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('periodico')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="text-sm font-bold text-white">
              Mantenimiento Periódico Mensual (Guías, Correderas y Desincrustación)
            </h3>
          </div>
          {openSections['periodico'] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {openSections['periodico'] && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/40 overflow-x-auto text-xs">
            <table className="w-full text-left min-w-[650px]">
              <thead className="border-b border-slate-800 text-slate-400 uppercase text-[11px]">
                <tr>
                  <th className="pb-2 w-48">Componente</th>
                  <th className="pb-2">Tarea Detallada</th>
                  <th className="pb-2 w-56">Herramienta / Insumo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-2.5 font-bold text-white">Pasadores Guía y Bujes</td>
                  <td>Limpiar grasa vieja con desengrasante y lubricar con grasa blanca de alta adherencia sin goteo.</td>
                  <td className="text-slate-400">Grasa especial de moldes, paño.</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white">Correderas y Deslizadores (Sliders)</td>
                  <td>Inspeccionar desgaste en placas de desgaste de bronce fosforado; verificar holguras con galga.</td>
                  <td className="text-slate-400">Galgas de espesor, llaves Allen.</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white">Canales de Agua (Desincrustado)</td>
                  <td>Conectar bomba de recirculación química con solución desincrustante para remover sarro y óxido.</td>
                  <td className="text-slate-400">Bomba de recirculación, desincrustante ácido cítrico.</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-white">Canal Caliente (Hot Runner)</td>
                  <td>Verificar continuidad óhmica y aislamiento en resistencias de boquillas y sensores termopar.</td>
                  <td className="text-slate-400">Multímetro digital calibrado.</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Routine 3: Major Overhaul */}
      <div className="rounded-2xl bg-[#151c2c] border border-slate-800 overflow-hidden shadow-lg">
        <button
          onClick={() => toggleSection('overhaul')}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="text-sm font-bold text-white">
              Overhaul Mayor en Matricería (Cada 100,000 a 500,000 Ciclos)
            </h3>
          </div>
          {openSections['overhaul'] ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>

        {openSections['overhaul'] && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/40 text-xs space-y-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-200">
              <strong>Procedimiento de Desarme Completo:</strong>
              <p className="mt-1">
                Se traslada el molde al taller de matricería. Se desarman todas las placas de cierre, eyección y colada caliente. Se sumergen las piezas en cuba de ultrasonido, se rectifican planos de partición si hay deformación y se sustituyen el 100% de o-rings de vitón y resortes.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-white block mb-1">Inspección Dimensional CMM:</span>
                Medición con comparador de reloj y micrómetro de profundidad de la conicidad y desgaste de bujes de cierre.
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="font-bold text-white block mb-1">Pulido Espejo SPI A-1:</span>
                Pulido manual con pasta de diamante graduada (3 a 1 micrón) para eliminar rayaduras y restaurar brillo de piezas plásticas.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
