export type EquipmentType = 
  | 'inyeccion' 
  | 'soplado' 
  | 'chiller' 
  | 'compresor' 
  | 'planta' 
  | 'molde' 
  | 'auxiliar';

export type EquipmentStatus = 
  | 'operativo' 
  | 'en_mantenimiento' 
  | 'parado_falla' 
  | 'almacenado';

export interface Equipment {
  id: string;
  tag: string; // e.g. INY-01, SOP-01, CHL-01, CMP-01, GEN-01, MLD-01
  name: string;
  type: EquipmentType;
  brand: string;
  model: string;
  serialNumber: string;
  location: string;
  status: EquipmentStatus;
  currentHours: number; // or cycles for molds
  maxCyclesBeforeOverhaul?: number; // for molds, e.g. 200,000
  activeMoldId?: string; // which mold is currently mounted on this machine
  mountedOnMachineId?: string; // for molds: which machine it is mounted on
  lastMaintenanceDate: string;
  notes?: string;
}

export type FrequencyType = 'Diario' | 'Semanal' | 'Mensual' | 'Trimestral' | 'Semestral' | 'Anual';

export type SapWorkCenter = 'MEC-01' | 'ELE-01' | 'HID-01' | 'NEU-01' | 'REF-01' | 'MAT-01' | 'LUB-01' | 'INS-01';
export type SapActivityType = 'PM01' | 'PM02' | 'PM03' | 'PM04' | 'PM05' | 'PM06';
export type SapTriggerStrategy = 'tiempo' | 'contador_horas' | 'contador_ciclos';
export type MachineCondition = 'parada_loto' | 'en_marcha' | 'indiferente';

export interface SapOperation {
  opNumber: string; // ej. 0010, 0020
  description: string;
  durationMinutes: number;
  workCenter?: string;
  referenceStandard?: string;
}

export interface SapRequiredPart {
  partId?: string;
  partSku: string;
  partName: string;
  quantity: number;
  unit: string;
}

export interface PlanTemplate {
  id: string;
  code?: string; // ej. HR-INY-001, PM-CHL-002 (Hoja de Ruta / Plan SAP PM)
  system: string;
  titulo: string;
  frecuencia: FrequencyType;
  tiempo: string;
  icono: string;
  color: 'cyan' | 'amber' | 'emerald' | 'red' | 'purple' | 'blue';
  herramientas: string[];
  insumos: string[];
  repuestos: string[];
  pasos: string[];
  criterioAceptacion?: string;
  applicableEquipmentTypes: EquipmentType[];

  // Variables avanzadas modelo SAP PM (Plant Maintenance)
  workCenter?: SapWorkCenter; // Puesto de trabajo responsable (MEC-01, ELE-01, etc.)
  sapActivityType?: SapActivityType; // PM01 (Preventivo), PM02 (Inspección), etc.
  strategyType?: SapTriggerStrategy; // Por tiempo, contador de horas o ciclos
  counterInterval?: number; // ej. cada 500 horas o 100,000 ciclos
  machineCondition?: MachineCondition; // Parada con LOTO vs En Operación
  safetyPermits?: string[]; // LOTO, Eléctrico, Altura, Químico
  operations?: SapOperation[]; // Operaciones estructuradas con numeración SAP
  requiredPartsDetailed?: SapRequiredPart[]; // Repuestos vinculados con cantidades reservadas
  plannerGroup?: string; // Grupo planificador (ej. Ing. Sanchez Danny)
  toleranceDays?: number; // Tolerancia / horizonte de llamada (días)
  specificEquipmentTag?: string; // TAG específico (ej. INY-01) o 'TODOS'
  activeStatus?: boolean; // Estado activo en el plan maestro
}

export type WorkOrderStatus = 'Pendiente' | 'En_Proceso' | 'Completada' | 'Cancelada';
export type WorkOrderPriority = 'Baja' | 'Media' | 'Alta' | 'Critica';
export type WorkOrderType = 'Preventivo' | 'Correctivo' | 'Predictivo' | 'Montaje_Molde' | 'Overhaul';

export interface PartConsumption {
  partId: string;
  partName: string;
  quantity: number;
  unitCost: number;
}

export interface ProcedureStep {
  step: string;
  completed: boolean;
}

export interface WorkOrder {
  id: string;
  code: string; // F-MT-01-xxxx
  type: WorkOrderType;
  equipmentId: string;
  equipmentTag: string;
  equipmentName: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  scheduledDate: string; // YYYY-MM-DD
  startedAt?: string;
  completedAt?: string;
  planTemplateId?: string;
  title: string;
  system: string;
  frequency: FrequencyType;
  estimatedTime: string;
  realDurationHours?: number;
  downtimeHours?: number; // Horas reales de parada de máquina
  assignedTechnician: string;
  verifierSupervisor: string;
  plantManager?: string;
  procedureSteps: ProcedureStep[];
  toolsUsed: string[];
  suppliesUsed: string[];
  partsConsumed: PartConsumption[];
  observations: string;
  rootCause?: string;
  correctiveActionTaken?: string;
  technicianSignature?: string;
  supervisorSignature?: string;
  createdAt: string;
  relatedIncidentId?: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'repuesto' | 'insumo' | 'herramienta';
  system: 'Mecánico' | 'Hidráulico' | 'Neumático' | 'Eléctrico' | 'Electrónico' | 'Moldes' | 'Auxiliares' | 'General';
  stockCurrent: number;
  stockMin: number;
  unit: string; // un, L, kg, m, roll, lata, juego
  location: string;
  criticality: 'Alta' | 'Media' | 'Baja';
  unitCost: number;
  compatibleEquipments: string[];
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'entrada' | 'salida_ot' | 'ajuste';
  quantity: number;
  date: string;
  workOrderId?: string;
  notes: string;
  registeredBy: string;
}

export interface ChecklistItemStatus {
  id: string;
  category: string;
  label: string;
  status: 'ok' | 'fallo' | 'na';
  note?: string;
}

export interface ChecklistExecutionLog {
  id: string;
  date: string;
  shift: string;
  type: 'diario_inyeccion' | 'semanal_general' | 'chiller' | 'compresor' | 'planta' | 'montaje_molde';
  equipmentId: string;
  equipmentName: string;
  operatorName: string;
  items: ChecklistItemStatus[];
  passed: boolean;
  generatedWorkOrderId?: string;
  timestamp: string;
}

export interface FailureIncident {
  id: string;
  symptom: string;
  system: string;
  possibleCauses: string[];
  solutionSteps: string[];
  equipmentId?: string;
  reportedAt?: string;
  status: 'abierta' | 'en_atencion' | 'resuelta';
  workOrderId?: string;
  downtimeHours?: number;
  severity: 'Critica' | 'Alta' | 'Media' | 'Leve';
}

export interface MoldMountingRecord {
  id: string;
  moldId: string;
  moldName: string;
  machineId: string;
  machineName: string;
  mountedDate: string;
  unmountedDate?: string;
  torqueAppliedNm: number; // e.g. 190 Nm
  liftingChecklistOk: boolean;
  waterFlowCheckOk: boolean;
  technician: string;
  cyclesRun: number;
  status: 'montado' | 'desmontado';
  notes?: string;
}

export interface PlantKPIs {
  disponibilidad: number; // e.g. 98.5%
  mtbfHoras: number; // e.g. 240 h
  mttrHoras: number; // e.g. 2.4 h
  paradasNoPlanificadas: number;
  cumplimientoPM: number; // %
  otsPendientes: number;
  otsEnProceso: number;
  otsCompletadas: number;
  repuestosBajoStock: number;
  equiposOperativos: number;
  equiposEnMantenimiento: number;
  equiposParados: number;
  tiempoTotalParadaHoras: number; // Horas totales acumuladas de parada por averías/intervenciones
  tiempoTotalReparacionHoras: number; // Horas hombre reales invertidas en ejecución de mantenimientos
  costoTotalRepuestos: number; // Costo monetario total de repuestos consumidos en OTs
  ratioPreventivoCorrectivo: number; // % de OTs preventivas sobre el total
  horasHombreTotal: number; // Total acumulado de horas técnicas
}
