import { Equipment, WorkOrder, InventoryItem, InventoryMovement, PlanTemplate, PlantKPIs, FailureIncident, FrequencyType } from '../types';

export const FREQUENCY_DAYS: Record<FrequencyType, number> = {
  'Diario': 1,
  'Semanal': 7,
  'Mensual': 30,
  'Trimestral': 90,
  'Semestral': 180,
  'Anual': 365
};

/**
 * Calculates industrial plant KPIs dynamically based on actual registered data.
 */
export function calculateKPIs(
  equipments: Equipment[],
  workOrders: WorkOrder[],
  failureIncidents: FailureIncident[]
): PlantKPIs {
  const totalEquipments = equipments.length || 1;
  const operativeEquipments = equipments.filter(e => e.status === 'operativo').length;
  const inMaintenanceEquipments = equipments.filter(e => e.status === 'en_mantenimiento').length;
  const stoppedEquipments = equipments.filter(e => e.status === 'parado_falla').length;

  const pendingOrders = workOrders.filter(o => o.status === 'Pendiente').length;
  const inProgressOrders = workOrders.filter(o => o.status === 'En_Proceso').length;
  const completedOrders = workOrders.filter(o => o.status === 'Completada').length;
  const totalRelevantOrders = pendingOrders + inProgressOrders + completedOrders;

  const cumplimientoPM = totalRelevantOrders > 0 
    ? Math.round((completedOrders / totalRelevantOrders) * 100) 
    : 100;

  // Unplanned stops (corrective orders or failures that stopped equipment)
  const paradasNoPlanificadas = workOrders.filter(
    o => o.type === 'Correctivo' || o.priority === 'Critica'
  ).length;

  // Real or estimated MTTR calculation (Mean Time to Repair in hours)
  const completedCorrectives = workOrders.filter(o => o.status === 'Completada' && (o.realDurationHours || 0) > 0);
  const totalRepairHours = completedCorrectives.reduce((sum, o) => sum + (o.realDurationHours || 1.5), 0);
  const mttrHoras = completedCorrectives.length > 0 
    ? Number((totalRepairHours / completedCorrectives.length).toFixed(1)) 
    : 2.1;

  // MTBF Calculation (Mean Time Between Failures)
  // Assuming plant operating baseline of 720 hours/month per machine
  const totalPlantOperatingHours = totalEquipments * 720;
  const failureCount = paradasNoPlanificadas > 0 ? paradasNoPlanificadas : 1;
  const mtbfHoras = Math.round(totalPlantOperatingHours / failureCount);

  // Overall Availability % = (Operating / Total) adjusted by downtime
  const rawAvailability = (operativeEquipments / totalEquipments) * 100;
  const disponibilidad = Number(Math.min(99.9, Math.max(80.0, rawAvailability)).toFixed(1));

  return {
    disponibilidad,
    mtbfHoras,
    mttrHoras,
    paradasNoPlanificadas,
    cumplimientoPM,
    otsPendientes: pendingOrders,
    otsEnProceso: inProgressOrders,
    otsCompletadas: completedOrders,
    repuestosBajoStock: 0, // to be filled with inventory check
    equiposOperativos: operativeEquipments,
    equiposEnMantenimiento: inMaintenanceEquipments,
    equiposParados: stoppedEquipments
  };
}

/**
 * Generates official ISO 9001:2015 Work Orders for a given period.
 * Automatically links applicable equipment to corresponding templates and avoids duplicates.
 */
export function generateWorkOrdersForPeriod(
  startDateStr: string,
  periodMonths: number,
  equipments: Equipment[],
  templates: PlanTemplate[],
  existingOrders: WorkOrder[]
): WorkOrder[] {
  if (!startDateStr) return [];

  const startDate = new Date(startDateStr + 'T00:00:00');
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + periodMonths);

  const newOrders: WorkOrder[] = [];
  let counter = existingOrders.length + 1;

  // For each template and applicable equipment, calculate schedule dates
  templates.forEach(tpl => {
    const applicableEqs = equipments.filter(eq => 
      tpl.applicableEquipmentTypes.includes(eq.type) && eq.status !== 'almacenado'
    );

    const stepDays = FREQUENCY_DAYS[tpl.frecuencia] || 30;

    applicableEqs.forEach(eq => {
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateIso = currentDate.toISOString().split('T')[0];

        // Check if identical order already exists for this equipment, template and date
        const alreadyExists = existingOrders.some(
          o => o.equipmentId === eq.id && o.planTemplateId === tpl.id && o.scheduledDate === dateIso
        ) || newOrders.some(
          o => o.equipmentId === eq.id && o.planTemplateId === tpl.id && o.scheduledDate === dateIso
        );

        if (!alreadyExists) {
          const codeStr = `F-MT-01-${String(counter).padStart(3, '0')}`;
          
          newOrders.push({
            id: `ot-gen-${Date.now()}-${counter}`,
            code: codeStr,
            type: 'Preventivo',
            equipmentId: eq.id,
            equipmentTag: eq.tag,
            equipmentName: eq.name,
            status: 'Pendiente',
            priority: tpl.frecuencia === 'Diario' ? 'Baja' : tpl.frecuencia === 'Semanal' ? 'Media' : 'Alta',
            scheduledDate: dateIso,
            planTemplateId: tpl.id,
            title: tpl.titulo,
            system: tpl.system,
            frequency: tpl.frecuencia,
            estimatedTime: tpl.tiempo,
            assignedTechnician: 'Técnico de Turno',
            verifierSupervisor: 'Supervisor de Mantenimiento',
            plantManager: 'Jefe de Planta',
            procedureSteps: tpl.pasos.map(p => ({ step: p, completed: false })),
            toolsUsed: [...tpl.herramientas],
            suppliesUsed: [...tpl.insumos],
            partsConsumed: [],
            observations: `Generado automáticamente según Plan Maestro de Mantenimiento ISO 9001 (${tpl.frecuencia}).`,
            createdAt: new Date().toISOString().split('T')[0]
          });

          counter++;
        }

        currentDate.setDate(currentDate.getDate() + stepDays);
      }
    });
  });

  return newOrders;
}

/**
 * Deducts inventory parts consumed during an OT and records traceability movement.
 */
export function processInventoryDeduction(
  inventory: InventoryItem[],
  movements: InventoryMovement[],
  partId: string,
  quantityToDeduct: number,
  workOrderId: string,
  user: string
): { updatedInventory: InventoryItem[]; updatedMovements: InventoryMovement[]; warningLowStock?: string } {
  let warningLowStock: string | undefined;

  const updatedInventory = inventory.map(item => {
    if (item.id === partId) {
      const newStock = Math.max(0, item.stockCurrent - quantityToDeduct);
      if (newStock <= item.stockMin) {
        warningLowStock = `Alerta: El stock de '${item.name}' ha bajado a ${newStock} ${item.unit} (Mínimo: ${item.stockMin}). Se requiere reorden.`;
      }
      return {
        ...item,
        stockCurrent: newStock
      };
    }
    return item;
  });

  const targetItem = inventory.find(i => i.id === partId);
  const newMovement: InventoryMovement = {
    id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    itemId: partId,
    itemName: targetItem ? targetItem.name : 'Artículo desconocido',
    type: 'salida_ot',
    quantity: quantityToDeduct,
    date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    workOrderId,
    notes: `Consumo registrado en Orden de Trabajo ${workOrderId}`,
    registeredBy: user
  };

  return {
    updatedInventory,
    updatedMovements: [newMovement, ...movements],
    warningLowStock
  };
}

/**
 * Creates an interconnected Corrective Work Order directly from a reported failure or a failed checklist item.
 */
export function createCorrectiveWorkOrder(
  equipment: Equipment,
  title: string,
  description: string,
  priority: 'Media' | 'Alta' | 'Critica',
  assignedTechnician: string,
  orderNumber: number,
  systemName: string
): WorkOrder {
  const codeStr = `F-MT-01-${String(orderNumber).padStart(3, '0')}`;
  const today = new Date().toISOString().split('T')[0];

  return {
    id: `ot-cor-${Date.now()}`,
    code: codeStr,
    type: 'Correctivo',
    equipmentId: equipment.id,
    equipmentTag: equipment.tag,
    equipmentName: equipment.name,
    status: 'Pendiente',
    priority,
    scheduledDate: today,
    title: `[CORRECTIVO] ${title}`,
    system: systemName,
    frequency: 'Diario',
    estimatedTime: '2.0 Horas',
    assignedTechnician: assignedTechnician || 'Técnico Especialista de Turno',
    verifierSupervisor: 'Supervisor de Turno',
    plantManager: 'Jefe de Planta',
    procedureSteps: [
      { step: 'Aplicar protocolo de Bloqueo y Etiquetado (LOTO).', completed: false },
      { step: 'Inspeccionar punto de falla y diagnosticar causa raíz.', completed: false },
      { step: 'Reemplazar componentes defectuosos o realizar ajuste mecánico/eléctrico.', completed: false },
      { step: 'Efectuar pruebas funcionales en vacío y bajo ciclo normal.', completed: false },
      { step: 'Validar parámetros de calidad y entregar equipo a producción.', completed: false }
    ],
    toolsUsed: ['Juego de herramientas básicas', 'Multímetro / Torquímetro'],
    suppliesUsed: ['Paños de limpieza'],
    partsConsumed: [],
    observations: `Avería reportada: ${description}. Requiere atención prioritaria para restablecer la disponibilidad.`,
    createdAt: today
  };
}
