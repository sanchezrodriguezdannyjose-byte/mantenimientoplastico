import React, { useState, useEffect } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { PlanTemplate, EquipmentType, FrequencyType, SapWorkCenter, SapActivityType, SapTriggerStrategy, MachineCondition, SapOperation, SapRequiredPart } from '../types';
import {
  X,
  ClipboardList,
  Save,
  Plus,
  Trash2,
  Cpu,
  Layers,
  Wrench,
  Package,
  ShieldAlert,
  Clock,
  Sliders,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface PlanTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateToEdit?: PlanTemplate | null;
}

export const PlanTemplateModal: React.FC<PlanTemplateModalProps> = ({
  isOpen,
  onClose,
  templateToEdit
}) => {
  const { addPlanTemplate, updatePlanTemplate, inventory, equipments } = useMaintenance();

  // Tab navigation inside modal
  const [activeTab, setActiveTab] = useState<'cabecera' | 'estrategia' | 'operaciones' | 'materiales'>('cabecera');

  // Form State
  const [code, setCode] = useState('');
  const [titulo, setTitulo] = useState('');
  const [system, setSystem] = useState('Mecánico');
  const [frecuencia, setFrecuencia] = useState<FrequencyType>('Mensual');
  const [tiempo, setTiempo] = useState('1.5 Horas');
  const [color, setColor] = useState<'cyan' | 'amber' | 'emerald' | 'red' | 'purple' | 'blue'>('blue');
  const [applicableTypes, setApplicableTypes] = useState<EquipmentType[]>(['inyeccion', 'soplado']);
  const [specificEquipmentTag, setSpecificEquipmentTag] = useState<string>('TODOS');
  
  // SAP PM Variables
  const [workCenter, setWorkCenter] = useState<SapWorkCenter>('MEC-01');
  const [sapActivityType, setSapActivityType] = useState<SapActivityType>('PM01');
  const [strategyType, setStrategyType] = useState<SapTriggerStrategy>('tiempo');
  const [counterInterval, setCounterInterval] = useState<number>(500);
  const [machineCondition, setMachineCondition] = useState<MachineCondition>('parada_loto');
  const [safetyPermits, setSafetyPermits] = useState<string[]>(['LOTO']);
  const [plannerGroup, setPlannerGroup] = useState<string>('Ingeniero Sanchez Danny');
  const [toleranceDays, setToleranceDays] = useState<number>(3);
  const [activeStatus, setActiveStatus] = useState<boolean>(true);

  // Operations (SAP Task List Operations)
  const [operations, setOperations] = useState<SapOperation[]>([
    { opNumber: '0010', description: 'Aplicar protocolo de consignación y bloqueo LOTO en tablero principal.', durationMinutes: 15, referenceStandard: 'Cero energía eléctrica/hidráulica residual' },
    { opNumber: '0020', description: 'Inspeccionar visualmente componentes y limpiar depósitos de suciedad.', durationMinutes: 20, referenceStandard: 'Ausencia de fugas y rozamientos' },
    { opNumber: '0030', description: 'Efectuar medición y calibración de parámetros operativos.', durationMinutes: 35, referenceStandard: 'Tolerancia según manual del fabricante' },
    { opNumber: '0040', description: 'Desconsignar equipo y realizar prueba funcional en vacío.', durationMinutes: 20, referenceStandard: 'Movimiento suave y sin alarmas' }
  ]);

  // Tools & Supplies
  const [herramientasInput, setHerramientasInput] = useState('');
  const [insumosInput, setInsumosInput] = useState('');
  const [criterioAceptacion, setCriterioAceptacion] = useState('Operación conforme a tolerancias de ingeniería; cero fugas y ruidos extraños.');

  // Required Parts from Inventory
  const [selectedParts, setSelectedParts] = useState<SapRequiredPart[]>([]);
  const [newPartId, setNewPartId] = useState('');
  const [newPartQty, setNewPartQty] = useState(1);

  // Load editing data or reset
  useEffect(() => {
    if (templateToEdit) {
      setCode(templateToEdit.code || `HR-${templateToEdit.system.substring(0, 3).toUpperCase()}-001`);
      setTitulo(templateToEdit.titulo);
      setSystem(templateToEdit.system);
      setFrecuencia(templateToEdit.frecuencia);
      setTiempo(templateToEdit.tiempo);
      setColor(templateToEdit.color || 'blue');
      setApplicableTypes(templateToEdit.applicableEquipmentTypes || ['inyeccion']);
      setSpecificEquipmentTag(templateToEdit.specificEquipmentTag || 'TODOS');
      setWorkCenter(templateToEdit.workCenter || 'MEC-01');
      setSapActivityType(templateToEdit.sapActivityType || 'PM01');
      setStrategyType(templateToEdit.strategyType || 'tiempo');
      setCounterInterval(templateToEdit.counterInterval || 500);
      setMachineCondition(templateToEdit.machineCondition || 'parada_loto');
      setSafetyPermits(templateToEdit.safetyPermits || ['LOTO']);
      setPlannerGroup(templateToEdit.plannerGroup || 'Ingeniero Sanchez Danny');
      setToleranceDays(templateToEdit.toleranceDays || 3);
      setActiveStatus(templateToEdit.activeStatus !== undefined ? templateToEdit.activeStatus : true);

      // Operations
      if (templateToEdit.operations && templateToEdit.operations.length > 0) {
        setOperations(templateToEdit.operations);
      } else if (templateToEdit.pasos && templateToEdit.pasos.length > 0) {
        setOperations(
          templateToEdit.pasos.map((p, idx) => ({
            opNumber: String((idx + 1) * 10).padStart(4, '0'),
            description: p,
            durationMinutes: 20
          }))
        );
      }

      setHerramientasInput((templateToEdit.herramientas || []).join(', '));
      setInsumosInput((templateToEdit.insumos || []).join(', '));
      setCriterioAceptacion(templateToEdit.criterioAceptacion || '');
      setSelectedParts(templateToEdit.requiredPartsDetailed || []);
    } else {
      // Defaults for a new SAP PM plan
      const nextNum = Math.floor(Math.random() * 800) + 100;
      setCode(`HR-PM-${nextNum}`);
      setTitulo('');
      setSystem('Mecánico');
      setFrecuencia('Mensual');
      setTiempo('1.5 Horas');
      setColor('blue');
      setApplicableTypes(['inyeccion', 'soplado']);
      setSpecificEquipmentTag('TODOS');
      setWorkCenter('MEC-01');
      setSapActivityType('PM01');
      setStrategyType('tiempo');
      setCounterInterval(500);
      setMachineCondition('parada_loto');
      setSafetyPermits(['LOTO']);
      setPlannerGroup('Ingeniero Sanchez Danny');
      setToleranceDays(3);
      setActiveStatus(true);
      setOperations([
        { opNumber: '0010', description: 'Aplicar protocolo de consignación y bloqueo LOTO en tablero principal.', durationMinutes: 15, referenceStandard: 'Cero energía eléctrica/hidráulica residual' },
        { opNumber: '0020', description: 'Inspeccionar visualmente componentes y limpiar depósitos de suciedad.', durationMinutes: 20, referenceStandard: 'Ausencia de fugas y rozamientos' },
        { opNumber: '0030', description: 'Efectuar medición y calibración de parámetros operativos.', durationMinutes: 35, referenceStandard: 'Tolerancia según manual del fabricante' },
        { opNumber: '0040', description: 'Desconsignar equipo y realizar prueba funcional en vacío.', durationMinutes: 20, referenceStandard: 'Movimiento suave y sin alarmas' }
      ]);
      setHerramientasInput('Torquímetro calibrado, Llaves Allen métricas, Multímetro');
      setInsumosInput('Paños absorbentes, Grasa EP-2, Desengrasante dieléctrico');
      setCriterioAceptacion('Operación conforme a tolerancias de ingeniería; cero fugas y ruidos extraños.');
      setSelectedParts([]);
    }
  }, [templateToEdit, isOpen]);

  if (!isOpen) return null;

  // Toggle applicable equipment types
  const handleToggleType = (type: EquipmentType) => {
    setApplicableTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  // Toggle safety permit
  const handleTogglePermit = (permit: string) => {
    setSafetyPermits(prev =>
      prev.includes(permit) ? prev.filter(p => p !== permit) : [...prev, permit]
    );
  };

  // Operations handlers
  const handleAddOperation = () => {
    const nextOpNum = String((operations.length + 1) * 10).padStart(4, '0');
    setOperations(prev => [
      ...prev,
      {
        opNumber: nextOpNum,
        description: '',
        durationMinutes: 15,
        referenceStandard: ''
      }
    ]);
  };

  const handleUpdateOperation = (index: number, field: keyof SapOperation, value: any) => {
    setOperations(prev =>
      prev.map((op, i) => (i === index ? { ...op, [field]: value } : op))
    );
  };

  const handleRemoveOperation = (index: number) => {
    setOperations(prev => prev.filter((_, i) => i !== index));
  };

  // Required Parts Handlers
  const handleAddPart = () => {
    const invItem = inventory.find(i => i.id === newPartId);
    if (!invItem) return;

    if (selectedParts.some(p => p.partId === newPartId)) {
      return;
    }

    setSelectedParts(prev => [
      ...prev,
      {
        partId: invItem.id,
        partSku: invItem.code,
        partName: invItem.name,
        quantity: newPartQty,
        unit: invItem.unit
      }
    ]);
    setNewPartId('');
    setNewPartQty(1);
  };

  const handleRemovePart = (partId?: string) => {
    setSelectedParts(prev => prev.filter(p => p.partId !== partId));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) {
      alert('Por favor ingrese el título de la actividad de mantenimiento.');
      return;
    }

    if (applicableTypes.length === 0) {
      alert('Debe seleccionar al menos un tipo de equipo aplicable.');
      return;
    }

    const herramientas = herramientasInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const insumos = insumosInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const repuestos = selectedParts.map(p => `${p.partName} (${p.quantity} ${p.unit})`);
    const pasos = operations.map(op => op.description).filter(Boolean);

    const templateData: Omit<PlanTemplate, 'id'> = {
      code,
      titulo: titulo.trim(),
      system,
      frecuencia,
      tiempo,
      icono: system === 'Hidráulico' ? 'fa-tint' : system === 'Eléctrico' ? 'fa-bolt' : system === 'Chiller' ? 'fa-snowflake' : system === 'Compresor' ? 'fa-wind' : system === 'Planta Eléctrica' ? 'fa-car-battery' : system === 'Moldes' ? 'fa-cubes' : 'fa-gear',
      color,
      herramientas,
      insumos,
      repuestos,
      pasos,
      criterioAceptacion,
      applicableEquipmentTypes: applicableTypes,

      // SAP PM fields
      workCenter,
      sapActivityType,
      strategyType,
      counterInterval: Number(counterInterval) || 500,
      machineCondition,
      safetyPermits,
      operations,
      requiredPartsDetailed: selectedParts,
      plannerGroup,
      toleranceDays: Number(toleranceDays) || 3,
      specificEquipmentTag,
      activeStatus
    };

    if (templateToEdit) {
      updatePlanTemplate(templateToEdit.id, templateData);
    } else {
      addPlanTemplate(templateData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#111827] border border-slate-700 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {templateToEdit ? 'Editar Actividad / Hoja de Ruta SAP PM' : 'Diseño de Plan Preventivo (Modelo SAP PM)'}
                </h3>
                <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
                  SAP PM Module
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Estructura de Hoja de Ruta, Puesto de Trabajo, Estrategia de Disparo y Lista de Materiales (BOM)
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

        {/* Tab Navigation inside modal */}
        <div className="flex border-b border-slate-800 bg-[#0d131f] px-4 pt-2 gap-1 text-xs overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('cabecera')}
            className={`py-2 px-3 rounded-t-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'cabecera'
                ? 'bg-[#111827] text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>1. Cabecera & Emplazamiento</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('estrategia')}
            className={`py-2 px-3 rounded-t-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'estrategia'
                ? 'bg-[#111827] text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>2. Estrategia & Puesto (Work Center)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('operaciones')}
            className={`py-2 px-3 rounded-t-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'operaciones'
                ? 'bg-[#111827] text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3. Hoja de Ruta (Operaciones {operations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('materiales')}
            className={`py-2 px-3 rounded-t-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'materiales'
                ? 'bg-[#111827] text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>4. Materiales, BOM & Herramientas</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* TAB 1: CABECERA & EMPLAZAMIENTO */}
          {activeTab === 'cabecera' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Código de Hoja de Ruta (Task List):
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    required
                    placeholder="Ej. HR-INY-010"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono uppercase"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">
                    Título / Denominación de la Actividad Preventiva:
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={e => setTitulo(e.target.value)}
                    required
                    placeholder="Ej. Inspección de paralelismo de platos, rodillera y lubricación EP-2"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Ubicación Técnica / Sistema:
                  </label>
                  <select
                    value={system}
                    onChange={e => setSystem(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="Mecánico">Mecánico (Rodillera, Husillo, Cierre)</option>
                    <option value="Hidráulico">Hidráulico (Bombas, Bloques, Filtros)</option>
                    <option value="Neumático">Neumático (FRL, Válvulas, Soplado)</option>
                    <option value="Eléctrico">Eléctrico (Tablero, Resistencias, Motores)</option>
                    <option value="Electrónica/PLC">Electrónica (HMI, Sensores, Encoders)</option>
                    <option value="Chiller">Chiller (Compresor Freón, Bomba, Serpentín)</option>
                    <option value="Compresor">Compresor (Tornillo, Secador, Purga)</option>
                    <option value="Planta Eléctrica">Planta Eléctrica (Diésel, ATS, Alternador)</option>
                    <option value="Moldes">Matricería / Moldes (Canales, Guías)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Equipo Específico (Opcional):
                  </label>
                  <select
                    value={specificEquipmentTag}
                    onChange={e => setSpecificEquipmentTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="TODOS">TODOS (Aplica a todo equipo del tipo)</option>
                    {equipments.map(eq => (
                      <option key={eq.id} value={eq.tag}>
                        {eq.tag} - {eq.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Color de Identificación:
                  </label>
                  <select
                    value={color}
                    onChange={e => setColor(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="blue">Azul (Mecánico / General)</option>
                    <option value="red">Rojo (Hidráulico / Crítico)</option>
                    <option value="cyan">Cian (Neumático / Chiller)</option>
                    <option value="amber">Ámbar (Eléctrico / Advertencia)</option>
                    <option value="purple">Púrpura (Electrónica / Overhaul)</option>
                    <option value="emerald">Verde Esmeralda (Inspección / OK)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Tipos de Equipos Aplicables:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'inyeccion', label: 'Inyectoras' },
                    { id: 'soplado', label: 'Sopladoras' },
                    { id: 'chiller', label: 'Chillers' },
                    { id: 'compresor', label: 'Compresores' },
                    { id: 'planta', label: 'Plantas Eléctricas' },
                    { id: 'molde', label: 'Moldes / Utillajes' },
                    { id: 'auxiliar', label: 'Equipos Auxiliares' }
                  ].map(item => (
                    <label
                      key={item.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                        applicableTypes.includes(item.id as EquipmentType)
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={applicableTypes.includes(item.id as EquipmentType)}
                        onChange={() => handleToggleType(item.id as EquipmentType)}
                        className="rounded accent-cyan-500"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-200 block">Estado de la Hoja de Ruta:</span>
                  <span className="text-slate-400 text-[11px]">
                    Si está inactiva, no se generarán órdenes periódicas automáticamente.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveStatus(!activeStatus)}
                  className={`px-3 py-1 rounded-full font-bold text-xs transition-colors ${
                    activeStatus
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {activeStatus ? '● Activo en Plan Maestro' : '○ Inactivo / Suspendido'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ESTRATEGIA & PUESTO DE TRABAJO (SAP WORK CENTER) */}
          {activeTab === 'estrategia' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Puesto de Trabajo Responsable (SAP Work Center):
                  </label>
                  <select
                    value={workCenter}
                    onChange={e => setWorkCenter(e.target.value as SapWorkCenter)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white font-medium"
                  >
                    <option value="MEC-01">MEC-01 - Mecánica y Transmisiones</option>
                    <option value="ELE-01">ELE-01 - Electricidad, Tableros y Potencia</option>
                    <option value="HID-01">HID-01 - Hidráulica y Válvulas Proporcionales</option>
                    <option value="NEU-01">NEU-01 - Neumática y FRL</option>
                    <option value="REF-01">REF-01 - Refrigeración Industrial / Chiller</option>
                    <option value="MAT-01">MAT-01 - Matricería, Ajuste y Moldes</option>
                    <option value="INS-01">INS-01 - Instrumentación, PLC y Calibración</option>
                    <option value="LUB-01">LUB-01 - Lubricación y Engrase de Planta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Clase de Actividad PM (SAP PM Activity Type):
                  </label>
                  <select
                    value={sapActivityType}
                    onChange={e => setSapActivityType(e.target.value as SapActivityType)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="PM01">PM01 - Mantenimiento Preventivo Sistemático</option>
                    <option value="PM02">PM02 - Inspección y Diagnóstico Técnico</option>
                    <option value="PM03">PM03 - Lubricación y Engrase Programado</option>
                    <option value="PM04">PM04 - Calibración y Ajustes de Precisión</option>
                    <option value="PM05">PM05 - Overhaul y Reacondicionamiento Mayor</option>
                    <option value="PM06">PM06 - Seguridad Ocupacional y LOTO</option>
                  </select>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="font-semibold text-slate-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Estrategia y Ciclo de Disparo (Maintenance Strategy)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 font-medium mb-1">Tipo de Disparo:</label>
                    <select
                      value={strategyType}
                      onChange={e => setStrategyType(e.target.value as SapTriggerStrategy)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="tiempo">Por Tiempo Calendario (Días / Meses)</option>
                      <option value="contador_horas">Por Contador de Horas de Operación</option>
                      <option value="contador_ciclos">Por Contador de Tiros / Ciclos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      {strategyType === 'tiempo' ? 'Frecuencia Calendario:' : 'Intervalo Numérico:'}
                    </label>
                    {strategyType === 'tiempo' ? (
                      <select
                        value={frecuencia}
                        onChange={e => setFrecuencia(e.target.value as FrequencyType)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                      >
                        <option value="Diario">Diario (1 Día)</option>
                        <option value="Semanal">Semanal (7 Días)</option>
                        <option value="Mensual">Mensual (30 Días)</option>
                        <option value="Trimestral">Trimestral (90 Días)</option>
                        <option value="Semestral">Semestral (180 Días)</option>
                        <option value="Anual">Anual (365 Días)</option>
                      </select>
                    ) : (
                      <input
                        type="number"
                        value={counterInterval}
                        onChange={e => setCounterInterval(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                        placeholder="Ej. 500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-400 font-medium mb-1">
                      Ventana / Tolerancia (Días):
                    </label>
                    <input
                      type="number"
                      value={toleranceDays}
                      onChange={e => setToleranceDays(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                      min={1}
                      max={30}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Condición de la Máquina Requerida:
                  </label>
                  <select
                    value={machineCondition}
                    onChange={e => setMachineCondition(e.target.value as MachineCondition)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="parada_loto">Parada con LOTO (Máquina Fuera de Servicio)</option>
                    <option value="en_marcha">En Marcha (Inspección bajo carga normal)</option>
                    <option value="indiferente">Indiferente / Sin Restricción</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Tiempo Estimado de Intervención:
                  </label>
                  <input
                    type="text"
                    value={tiempo}
                    onChange={e => setTiempo(e.target.value)}
                    required
                    placeholder="Ej. 2.0 Horas"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Permisos de Seguridad Requeridos (LOTO & Safety):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    'LOTO Eléctrico/Mecánico',
                    'Trabajo Eléctrico en Vivo',
                    'Trabajo en Altura',
                    'Manejo de Sustancias Químicas'
                  ].map(permit => (
                    <label
                      key={permit}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-xs transition-colors ${
                        safetyPermits.includes(permit)
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={safetyPermits.includes(permit)}
                        onChange={() => handleTogglePermit(permit)}
                        className="rounded accent-amber-500"
                      />
                      <span>{permit}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Grupo Planificador / Ingeniero Responsable:
                </label>
                <input
                  type="text"
                  value={plannerGroup}
                  onChange={e => setPlannerGroup(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-semibold"
                />
              </div>
            </div>
          )}

          {/* TAB 3: OPERACIONES PASO A PASO (SAP TASK LIST) */}
          {activeTab === 'operaciones' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">
                    Operaciones de Hoja de Ruta (Secuencia de Intervención)
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    Estructura normalizada con código de operación SAP (0010, 0020...), duración y valores estándar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddOperation}
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Agregar Operación
                </button>
              </div>

              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {operations.map((op, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row gap-2.5 items-start sm:items-center"
                  >
                    <span className="px-2 py-1 rounded bg-slate-800 text-cyan-400 font-mono font-bold text-xs shrink-0">
                      Op. {op.opNumber}
                    </span>

                    <div className="flex-1 w-full sm:w-auto">
                      <input
                        type="text"
                        value={op.description}
                        onChange={e => handleUpdateOperation(idx, 'description', e.target.value)}
                        placeholder="Descripción detallada de la tarea a ejecutar..."
                        required
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div className="w-full sm:w-48">
                      <input
                        type="text"
                        value={op.referenceStandard || ''}
                        onChange={e => handleUpdateOperation(idx, 'referenceStandard', e.target.value)}
                        placeholder="Parámetro Ref (ej. 7.5 bar)"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <input
                        type="number"
                        value={op.durationMinutes}
                        onChange={e => handleUpdateOperation(idx, 'durationMinutes', Number(e.target.value))}
                        className="w-16 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-center text-xs"
                        min={5}
                        step={5}
                      />
                      <span className="text-[11px] text-slate-400">min</span>

                      <button
                        type="button"
                        onClick={() => handleRemoveOperation(idx)}
                        disabled={operations.length <= 1}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors disabled:opacity-30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Criterio de Aceptación General ISO 9001:
                </label>
                <textarea
                  value={criterioAceptacion}
                  onChange={e => setCriterioAceptacion(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  placeholder="Normas de tolerancia, vibración admisible, estanqueidad hidráulica..."
                ></textarea>
              </div>
            </div>
          )}

          {/* TAB 4: MATERIALES, BOM & HERRAMIENTAS */}
          {activeTab === 'materiales' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Linked Spare Parts from Warehouse */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-200 flex items-center gap-2">
                    <Package className="w-4 h-4 text-amber-400" />
                    Lista de Materiales y Repuestos Requeridos (BOM / Almacén)
                  </h4>
                  <span className="text-slate-400 text-[11px]">
                    Se reservarán y descontarán del kárdex al ejecutar la OT
                  </span>
                </div>

                {/* Add new part selector */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={newPartId}
                    onChange={e => setNewPartId(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="">-- Seleccionar repuesto del catálogo de almacén --</option>
                    {inventory.map(item => (
                      <option key={item.id} value={item.id}>
                        [{item.code}] {item.name} (Stock: {item.stockCurrent} {item.unit})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={newPartQty}
                      onChange={e => setNewPartQty(Math.max(1, Number(e.target.value)))}
                      min={1}
                      className="w-20 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-center"
                    />
                    <button
                      type="button"
                      onClick={handleAddPart}
                      disabled={!newPartId}
                      className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold disabled:opacity-50 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Agregar
                    </button>
                  </div>
                </div>

                {/* Parts Table */}
                {selectedParts.length > 0 ? (
                  <div className="border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-2">Código SKU</th>
                          <th className="p-2">Descripción del Repuesto</th>
                          <th className="p-2 text-center">Cantidad Reservada</th>
                          <th className="p-2 text-right">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {selectedParts.map((part, pIdx) => (
                          <tr key={pIdx} className="hover:bg-slate-800/40">
                            <td className="p-2 font-mono text-cyan-400">{part.partSku}</td>
                            <td className="p-2 text-slate-200">{part.partName}</td>
                            <td className="p-2 text-center font-bold text-amber-300">
                              {part.quantity} {part.unit}
                            </td>
                            <td className="p-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemovePart(part.partId)}
                                className="text-slate-400 hover:text-rose-400 p-1 rounded"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-3 text-slate-500 text-xs italic">
                    Sin repuestos vinculados. Esta actividad no consume piezas de almacén por defecto.
                  </div>
                )}
              </div>

              {/* Tools & Equipment (PRT) */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Herramientas y Medios Auxiliares (PRT - Separadas por coma):
                </label>
                <input
                  type="text"
                  value={herramientasInput}
                  onChange={e => setHerramientasInput(e.target.value)}
                  placeholder="Torquímetro 190 Nm, Comparador de carátula, FLIR, Megóhmetro, Llaves Allen..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              {/* Supplies */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Insumos y Lubricantes Requeridos (Separados por coma):
                </label>
                <input
                  type="text"
                  value={insumosInput}
                  onChange={e => setInsumosInput(e.target.value)}
                  placeholder="Grasa EP-2, Aceite ISO VG 46, Paños absorbentes, Solvente dieléctrico..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-colors"
            >
              <Save className="w-4 h-4" />
              {templateToEdit ? 'Guardar Cambios en Hoja de Ruta' : 'Crear Plan Preventivo SAP PM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
