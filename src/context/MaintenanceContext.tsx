import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Equipment,
  PlanTemplate,
  WorkOrder,
  InventoryItem,
  InventoryMovement,
  ChecklistExecutionLog,
  FailureIncident,
  MoldMountingRecord,
  PlantKPIs
} from '../types';
import {
  initialEquipments,
  initialPlanTemplates,
  initialInventory,
  initialFailureIncidents,
  initialWorkOrders,
  initialMoldMountingRecords
} from '../data/defaultData';
import {
  calculateKPIs,
  generateWorkOrdersForPeriod,
  processInventoryDeduction,
  createCorrectiveWorkOrder
} from '../utils/maintenanceEngine';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
}

interface MaintenanceContextType {
  equipments: Equipment[];
  templates: PlanTemplate[];
  workOrders: WorkOrder[];
  inventory: InventoryItem[];
  movements: InventoryMovement[];
  checklistLogs: ChecklistExecutionLog[];
  failures: FailureIncident[];
  moldRecords: MoldMountingRecord[];
  kpis: PlantKPIs;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'warning' | 'danger' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;

  // Equipment Actions
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, updates: Partial<Equipment>) => void;
  deleteEquipment: (id: string) => void;

  // Work Order Actions
  addWorkOrder: (order: Omit<WorkOrder, 'id' | 'code' | 'createdAt'>) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  completeWorkOrderWithDeductions: (
    orderId: string,
    realHours: number,
    observations: string,
    technicianSig: string,
    supervisorSig: string,
    consumedParts: { partId: string; quantity: number }[]
  ) => void;
  deleteWorkOrder: (id: string) => void;
  generateBatchOrders: (startDate: string, periodMonths: number) => number;

  // Inventory Actions
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryStock: (id: string, newStock: number, reason: string, user: string) => void;
  adjustInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;

  // Checklist Actions
  saveChecklistExecution: (
    type: ChecklistExecutionLog['type'],
    equipmentId: string,
    equipmentName: string,
    operator: string,
    shift: string,
    items: ChecklistExecutionLog['items'],
    createCorrectiveOnFailure?: boolean
  ) => ChecklistExecutionLog;

  // Failure / Troubleshooting Actions
  reportFailureIncident: (
    symptom: string,
    system: string,
    equipmentId: string,
    severity: 'Critica' | 'Alta' | 'Media' | 'Leve',
    generateOt: boolean
  ) => void;
  resolveFailureIncident: (id: string) => void;

  // Mold Actions
  mountMold: (
    moldId: string,
    machineId: string,
    torqueNm: number,
    checks: { lifting: boolean; water: boolean },
    technician: string,
    notes?: string
  ) => void;
  unmountMold: (moldId: string, cyclesRun: number, technician: string, notes?: string) => void;

  // Persistence & Backup
  exportBackupPdf: () => void;
  exportBackupJson: () => void;
  importBackupJson: (jsonData: string) => boolean;
  resetToDemoData: () => void;
  exportWorkOrdersToCsv: () => void;
  exportInventoryToCsv: () => void;
}

const STORAGE_KEY = 'sgmi_mantenimiento_v2_store';

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load from LocalStorage if available
  const [equipments, setEquipments] = useState<Equipment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_equipments`);
      return saved ? JSON.parse(saved) : initialEquipments;
    } catch {
      return initialEquipments;
    }
  });

  const [templates] = useState<PlanTemplate[]>(initialPlanTemplates);

  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_work_orders`);
      return saved ? JSON.parse(saved) : initialWorkOrders;
    } catch {
      return initialWorkOrders;
    }
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_inventory`);
      return saved ? JSON.parse(saved) : initialInventory;
    } catch {
      return initialInventory;
    }
  });

  const [movements, setMovements] = useState<InventoryMovement[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_movements`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [checklistLogs, setChecklistLogs] = useState<ChecklistExecutionLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_checklists`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [failures, setFailures] = useState<FailureIncident[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_failures`);
      return saved ? JSON.parse(saved) : initialFailureIncidents;
    } catch {
      return initialFailureIncidents;
    }
  });

  const [moldRecords, setMoldRecords] = useState<MoldMountingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_mold_records`);
      return saved ? JSON.parse(saved) : initialMoldMountingRecords;
    } catch {
      return initialMoldMountingRecords;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistent sync on state change
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_equipments`, JSON.stringify(equipments));
      localStorage.setItem(`${STORAGE_KEY}_work_orders`, JSON.stringify(workOrders));
      localStorage.setItem(`${STORAGE_KEY}_inventory`, JSON.stringify(inventory));
      localStorage.setItem(`${STORAGE_KEY}_movements`, JSON.stringify(movements));
      localStorage.setItem(`${STORAGE_KEY}_checklists`, JSON.stringify(checklistLogs));
      localStorage.setItem(`${STORAGE_KEY}_failures`, JSON.stringify(failures));
      localStorage.setItem(`${STORAGE_KEY}_mold_records`, JSON.stringify(moldRecords));
    } catch (e) {
      console.warn('Error saving to LocalStorage', e);
    }
  }, [equipments, workOrders, inventory, movements, checklistLogs, failures, moldRecords]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Dynamically calculate KPIs
  const kpis = useMemo(() => {
    const calculated = calculateKPIs(equipments, workOrders, failures);
    const lowStockCount = inventory.filter(i => i.stockCurrent <= i.stockMin).length;
    return {
      ...calculated,
      repuestosBajoStock: lowStockCount
    };
  }, [equipments, workOrders, failures, inventory]);

  // Equipment Handlers
  const addEquipment = (eqData: Omit<Equipment, 'id'>) => {
    const id = `eq-${eqData.tag.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
    const newEq: Equipment = { ...eqData, id };
    setEquipments(prev => [...prev, newEq]);
    addToast('success', 'Equipo Registrado', `Se agregó el activo ${newEq.tag} (${newEq.name}) correctamente.`);
  };

  const updateEquipment = (id: string, updates: Partial<Equipment>) => {
    setEquipments(prev => prev.map(eq => (eq.id === id ? { ...eq, ...updates } : eq)));
    addToast('info', 'Equipo Actualizado', 'Los datos del equipo han sido actualizados.');
  };

  const deleteEquipment = (id: string) => {
    setEquipments(prev => prev.filter(eq => eq.id !== id));
    addToast('warning', 'Equipo Eliminado', 'Se ha eliminado el equipo del sistema.');
  };

  // Work Order Handlers
  const addWorkOrder = (orderData: Omit<WorkOrder, 'id' | 'code' | 'createdAt'>) => {
    const num = workOrders.length + 1;
    const code = `F-MT-01-${String(num).padStart(3, '0')}`;
    const newOrder: WorkOrder = {
      ...orderData,
      id: `ot-${Date.now()}`,
      code,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setWorkOrders(prev => [newOrder, ...prev]);

    // If order is in process and equipment is set to en_mantenimiento
    if (newOrder.status === 'En_Proceso') {
      setEquipments(prev =>
        prev.map(eq => (eq.id === newOrder.equipmentId ? { ...eq, status: 'en_mantenimiento' } : eq))
      );
    }

    addToast('success', 'OT Creada', `Orden ${code} generada exitosamente para ${newOrder.equipmentTag}.`);
  };

  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders(prev =>
      prev.map(ot => {
        if (ot.id === id) {
          const updated = { ...ot, ...updates };
          // If status changed to En_Proceso, set equipment to en_mantenimiento
          if (updates.status === 'En_Proceso') {
            setEquipments(eqs =>
              eqs.map(eq => (eq.id === ot.equipmentId ? { ...eq, status: 'en_mantenimiento' } : eq))
            );
          }
          return updated;
        }
        return ot;
      })
    );
    addToast('info', 'OT Actualizada', 'Cambios guardados en la orden de trabajo.');
  };

  const completeWorkOrderWithDeductions = (
    orderId: string,
    realHours: number,
    observations: string,
    technicianSig: string,
    supervisorSig: string,
    consumedParts: { partId: string; quantity: number }[]
  ) => {
    const targetOrder = workOrders.find(o => o.id === orderId);
    if (!targetOrder) return;

    let currentInventory = [...inventory];
    let currentMovements = [...movements];
    const registeredPartsConsumed: WorkOrder['partsConsumed'] = [];

    // Deduct each part from inventory
    consumedParts.forEach(p => {
      if (p.quantity > 0) {
        const item = currentInventory.find(i => i.id === p.partId);
        if (item) {
          const result = processInventoryDeduction(
            currentInventory,
            currentMovements,
            p.partId,
            p.quantity,
            targetOrder.code,
            technicianSig || 'Técnico'
          );
          currentInventory = result.updatedInventory;
          currentMovements = result.updatedMovements;

          registeredPartsConsumed.push({
            partId: item.id,
            partName: item.name,
            quantity: p.quantity,
            unitCost: item.unitCost
          });

          if (result.warningLowStock) {
            addToast('warning', 'Stock Bajo', result.warningLowStock);
          }
        }
      }
    });

    setInventory(currentInventory);
    setMovements(currentMovements);

    const completionTime = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updatedOrder: WorkOrder = {
      ...targetOrder,
      status: 'Completada',
      completedAt: completionTime,
      realDurationHours: realHours,
      observations: observations || targetOrder.observations,
      technicianSignature: technicianSig || targetOrder.assignedTechnician,
      supervisorSignature: supervisorSig || targetOrder.verifierSupervisor,
      partsConsumed: [...targetOrder.partsConsumed, ...registeredPartsConsumed],
      procedureSteps: targetOrder.procedureSteps.map(s => ({ ...s, completed: true }))
    };

    setWorkOrders(prev => prev.map(o => (o.id === orderId ? updatedOrder : o)));

    // Return equipment status to 'operativo' and update lastMaintenanceDate
    setEquipments(prev =>
      prev.map(eq =>
        eq.id === targetOrder.equipmentId
          ? {
              ...eq,
              status: eq.status === 'en_mantenimiento' ? 'operativo' : eq.status,
              lastMaintenanceDate: new Date().toISOString().split('T')[0]
            }
          : eq
      )
    );

    addToast(
      'success',
      'OT Completada con Éxito',
      `Orden ${targetOrder.code} finalizada. Repuestos descontados y equipo ${targetOrder.equipmentTag} operativo.`
    );
  };

  const deleteWorkOrder = (id: string) => {
    setWorkOrders(prev => prev.filter(o => o.id !== id));
    addToast('warning', 'OT Eliminada', 'La orden de trabajo fue removida.');
  };

  const generateBatchOrders = (startDate: string, periodMonths: number): number => {
    const generated = generateWorkOrdersForPeriod(
      startDate,
      periodMonths,
      equipments,
      templates,
      workOrders
    );

    if (generated.length > 0) {
      setWorkOrders(prev => [...generated, ...prev]);
      addToast(
        'success',
        'Plan Maestro Generado',
        `Se han programado ${generated.length} órdenes de trabajo interrelacionadas para los próximos ${periodMonths} mes(es).`
      );
    } else {
      addToast('info', 'Sin Nuevas Órdenes', 'Todas las órdenes para este período ya existen en el sistema.');
    }

    return generated.length;
  };

  // Inventory Handlers
  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>) => {
    const id = `inv-${itemData.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`;
    const newItem: InventoryItem = { ...itemData, id };
    setInventory(prev => [...prev, newItem]);
    addToast('success', 'Artículo Creado', `Se registró '${newItem.name}' en almacén.`);
  };

  const updateInventoryStock = (id: string, newStock: number, reason: string, user: string) => {
    const target = inventory.find(i => i.id === id);
    if (!target) return;

    const diff = newStock - target.stockCurrent;
    const movementType = diff >= 0 ? 'entrada' : 'ajuste';

    const newMov: InventoryMovement = {
      id: `mov-${Date.now()}`,
      itemId: id,
      itemName: target.name,
      type: movementType,
      quantity: Math.abs(diff),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes: reason || 'Ajuste manual de existencias',
      registeredBy: user || 'Administrador de Almacén'
    };

    setInventory(prev =>
      prev.map(i => (i.id === id ? { ...i, stockCurrent: Math.max(0, newStock) } : i))
    );
    setMovements(prev => [newMov, ...prev]);

    addToast('info', 'Stock Actualizado', `Existencias de '${target.name}': ${newStock} ${target.unit}.`);
  };

  const adjustInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)));
    addToast('info', 'Inventario Modificado', 'Ficha de almacén actualizada.');
  };

  // Checklist Handlers
  const saveChecklistExecution = (
    type: ChecklistExecutionLog['type'],
    equipmentId: string,
    equipmentName: string,
    operator: string,
    shift: string,
    items: ChecklistExecutionLog['items'],
    createCorrectiveOnFailure: boolean = true
  ): ChecklistExecutionLog => {
    const failedItems = items.filter(it => it.status === 'fallo');
    const passed = failedItems.length === 0;
    const logId = `chk-${Date.now()}`;
    let generatedOtId: string | undefined;

    // If an item failed and user requested automatic OT generation
    if (!passed && createCorrectiveOnFailure) {
      const eq = equipments.find(e => e.id === equipmentId) || {
        id: equipmentId,
        tag: 'EQ-REV',
        name: equipmentName,
        type: 'inyeccion' as const,
        brand: 'Planta',
        model: 'Standard',
        serialNumber: 'SN-01',
        location: 'Planta',
        status: 'parado_falla' as const,
        currentHours: 0,
        lastMaintenanceDate: new Date().toISOString().split('T')[0]
      };

      const failDetails = failedItems.map(f => `${f.category}: ${f.label}`).join('; ');
      const newOt = createCorrectiveWorkOrder(
        eq,
        `Falla detectada en Checklist (${type})`,
        failDetails,
        'Critica',
        operator,
        workOrders.length + 1,
        failedItems[0]?.category || 'General'
      );

      generatedOtId = newOt.id;
      setWorkOrders(prev => [newOt, ...prev]);

      // Update equipment status to 'parado_falla' or 'en_mantenimiento'
      setEquipments(prev =>
        prev.map(e => (e.id === equipmentId ? { ...e, status: 'parado_falla' } : e))
      );

      addToast(
        'danger',
        '¡Alerta de Falla Crítica!',
        `Se detectó no conformidad en checklist. Se creó automáticamente la OT Correctiva ${newOt.code}.`
      );
    } else if (passed) {
      addToast('success', 'Checklist Conforme', `Inspección de ${equipmentName} aprobada al 100%.`);
    }

    const newLog: ChecklistExecutionLog = {
      id: logId,
      date: new Date().toISOString().split('T')[0],
      shift,
      type,
      equipmentId,
      equipmentName,
      operatorName: operator,
      items,
      passed,
      generatedWorkOrderId: generatedOtId,
      timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    setChecklistLogs(prev => [newLog, ...prev]);
    return newLog;
  };

  // Failure Handlers
  const reportFailureIncident = (
    symptom: string,
    system: string,
    equipmentId: string,
    severity: 'Critica' | 'Alta' | 'Media' | 'Leve',
    generateOt: boolean
  ) => {
    const eq = equipments.find(e => e.id === equipmentId);
    let otId: string | undefined;

    if (generateOt && eq) {
      const otPriority: 'Critica' | 'Alta' | 'Media' =
        severity === 'Critica' ? 'Critica' : severity === 'Alta' ? 'Alta' : 'Media';

      const correctiveOt = createCorrectiveWorkOrder(
        eq,
        symptom,
        `Reporte de avería urgente en sistema ${system}`,
        otPriority,
        'Técnico de Turno',
        workOrders.length + 1,
        system
      );
      otId = correctiveOt.id;
      setWorkOrders(prev => [correctiveOt, ...prev]);

      if (severity === 'Critica') {
        setEquipments(prev =>
          prev.map(e => (e.id === equipmentId ? { ...e, status: 'parado_falla' } : e))
        );
      }
    }

    const newIncident: FailureIncident = {
      id: `fail-${Date.now()}`,
      symptom,
      system,
      possibleCauses: ['Desgaste mecánico/eléctrico', 'Falta de lubricación o desajuste'],
      solutionSteps: ['Inspeccionar según procedimiento de troubleshooting', 'Reemplazar componentes dañados'],
      equipmentId,
      reportedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'abierta',
      workOrderId: otId,
      severity
    };

    setFailures(prev => [newIncident, ...prev]);
    addToast(
      'warning',
      'Falla Reportada',
      `Se registró la avería en ${eq ? eq.tag : 'el sistema'}. ${otId ? 'OT Correctiva vinculada creada.' : ''}`
    );
  };

  const resolveFailureIncident = (id: string) => {
    setFailures(prev =>
      prev.map(f => (f.id === id ? { ...f, status: 'resuelta' } : f))
    );
    addToast('success', 'Falla Resuelta', 'El incidente de falla fue marcado como solucionado.');
  };

  // Mold Mounting Handlers
  const mountMold = (
    moldId: string,
    machineId: string,
    torqueNm: number,
    checks: { lifting: boolean; water: boolean },
    technician: string,
    notes?: string
  ) => {
    const mold = equipments.find(e => e.id === moldId);
    const machine = equipments.find(e => e.id === machineId);
    if (!mold || !machine) return;

    const newRecord: MoldMountingRecord = {
      id: `rec-mnt-${Date.now()}`,
      moldId,
      moldName: mold.name,
      machineId,
      machineName: machine.name,
      mountedDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      torqueAppliedNm: torqueNm,
      liftingChecklistOk: checks.lifting,
      waterFlowCheckOk: checks.water,
      technician,
      cyclesRun: 0,
      status: 'montado',
      notes
    };

    // Update mold status and link
    setEquipments(prev =>
      prev.map(e => {
        if (e.id === moldId) {
          return {
            ...e,
            status: 'operativo',
            location: `Montado en ${machine.tag}`,
            mountedOnMachineId: machineId
          };
        }
        if (e.id === machineId) {
          return {
            ...e,
            activeMoldId: moldId
          };
        }
        return e;
      })
    );

    setMoldRecords(prev => [newRecord, ...prev]);

    // Also register a Work Order of type 'Montaje_Molde'
    const otCode = `F-MT-01-${String(workOrders.length + 1).padStart(3, '0')}`;
    const mountingOt: WorkOrder = {
      id: `ot-mnt-${Date.now()}`,
      code: otCode,
      type: 'Montaje_Molde',
      equipmentId: machine.id,
      equipmentTag: machine.tag,
      equipmentName: machine.name,
      status: 'Completada',
      priority: 'Media',
      scheduledDate: new Date().toISOString().split('T')[0],
      startedAt: newRecord.mountedDate,
      completedAt: newRecord.mountedDate,
      title: `Montaje de ${mold.name}`,
      system: 'Moldes',
      frequency: 'Diario',
      estimatedTime: '1.0 Hora',
      realDurationHours: 1.0,
      assignedTechnician: technician,
      verifierSupervisor: 'Supervisor de Turno',
      plantManager: 'Jefe de Planta',
      procedureSteps: [
        { step: 'Inspección previa de cáncamos y eslingas certificadas.', completed: true },
        { step: 'Izaje seguro y centrado con anillo centrador.', completed: true },
        { step: `Apriete en cruz verificado a ${torqueNm} Nm con torquímetro.`, completed: true },
        { step: 'Conexión de refrigeración y comprobación de flujo sin fugas.', completed: true }
      ],
      toolsUsed: ['Polipasto 2T', 'Torquímetro dinamométrico', 'Llaves Allen'],
      suppliesUsed: ['Grasa para guías de molde'],
      partsConsumed: [],
      observations: `Montaje exitoso. ${notes || ''}`,
      technicianSignature: technician,
      supervisorSignature: 'Supervisor Calidad',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setWorkOrders(prev => [mountingOt, ...prev]);
    addToast('success', 'Molde Montado', `${mold.name} montado exitosamente en ${machine.tag} con torque de ${torqueNm} Nm.`);
  };

  const unmountMold = (moldId: string, cyclesRun: number, technician: string, notes?: string) => {
    const mold = equipments.find(e => e.id === moldId);
    if (!mold) return;

    const unmountTime = new Date().toISOString().replace('T', ' ').substring(0, 16);

    // Update mold mounting records
    setMoldRecords(prev =>
      prev.map(r =>
        r.moldId === moldId && r.status === 'montado'
          ? {
              ...r,
              status: 'desmontado',
              unmountedDate: unmountTime,
              cyclesRun: cyclesRun || r.cyclesRun,
              notes: notes ? `${r.notes || ''} | ${notes}` : r.notes
            }
          : r
      )
    );

    // Update mold equipment
    const machineId = mold.mountedOnMachineId;
    setEquipments(prev =>
      prev.map(e => {
        if (e.id === moldId) {
          const newTotalCycles = e.currentHours + (cyclesRun || 0);
          return {
            ...e,
            status: 'almacenado',
            location: 'Almacén de Moldes (Rack A)',
            mountedOnMachineId: undefined,
            currentHours: newTotalCycles,
            notes: `${e.notes || ''} Desmontado el ${unmountTime}.`
          };
        }
        if (e.id === machineId) {
          return {
            ...e,
            activeMoldId: undefined
          };
        }
        return e;
      })
    );

    addToast('info', 'Molde Desmontado', `${mold.name} ha sido retirado y enviado al almacén de moldes.`);
  };

  // Backup & Restore
  const exportBackupPdf = () => {
    const printDate = new Date().toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'medium' });
    const folioCode = `RESPALDO-SGMI-${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12)}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Respaldo Integral de Planta - SGMI (${folioCode})</title>
        <style>
          @page {
            size: letter portrait;
            margin: 10mm;
          }
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
          body { color: #0f172a; background: #fff; font-size: 9.5px; line-height: 1.35; padding: 12px; }
          .header { border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
          .logo-box { width: 44px; height: 44px; border: 2px solid #0f172a; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; background: #e0f2fe; color: #0369a1; margin-right: 10px; border-radius: 4px; }
          .header-title h1 { font-size: 13px; font-weight: 800; text-transform: uppercase; color: #0f172a; margin-bottom: 2px; }
          .header-title p { font-size: 9px; color: #475569; }
          .header-title .author { font-size: 9.5px; font-weight: 700; color: #b45309; margin-top: 2px; }
          .doc-info { text-align: right; font-size: 8.5px; color: #334155; }
          .doc-info strong { display: block; font-size: 10px; color: #0f172a; text-transform: uppercase; }
          
          .kpi-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px; }
          .kpi-card { border: 1px solid #cbd5e1; padding: 6px; border-radius: 6px; text-align: center; background: #f8fafc; }
          .kpi-card .val { font-size: 14px; font-weight: 800; color: #0891b2; }
          .kpi-card .lbl { font-size: 8px; font-weight: 700; text-transform: uppercase; color: #64748b; }
          
          .section-title { font-size: 10px; font-weight: 800; text-transform: uppercase; background: #0f172a; color: #fff; padding: 4px 8px; margin-top: 10px; margin-bottom: 5px; border-radius: 3px; display: flex; justify-content: space-between; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 8.5px; }
          th { background: #f1f5f9; border: 1px solid #94a3b8; padding: 4px; text-align: left; font-weight: 700; font-size: 8px; text-transform: uppercase; color: #1e293b; }
          td { border: 1px solid #cbd5e1; padding: 3px 4px; vertical-align: top; }
          tr:nth-child(even) { background: #f8fafc; }
          
          .badge { display: inline-block; padding: 1px 5px; border-radius: 3px; font-size: 7.5px; font-weight: 700; text-transform: uppercase; }
          .badge-green { background: #dcfce7; color: #166534; border: 1px solid #86efac; }
          .badge-red { background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }
          .badge-yellow { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
          
          .firmas { margin-top: 22px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; page-break-inside: avoid; }
          .firma-box { border-top: 1.5px solid #0f172a; text-align: center; padding-top: 5px; }
          .firma-box strong { font-size: 9px; display: block; color: #0f172a; }
          .firma-box span { font-size: 8px; color: #64748b; }
          
          .footer-note { text-align: center; font-size: 8px; color: #64748b; margin-top: 16px; border-top: 1px dashed #cbd5e1; padding-top: 5px; }
          
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; align-items: center;">
            <div class="logo-box">SGMI</div>
            <div class="header-title">
              <h1>Respaldo Integral de Mantenimiento de Planta</h1>
              <p>Inyección, Soplado y Servicios Auxiliares (Chiller, Compresor, Planta Eléctrica y Moldes)</p>
              <div class="author">Sistema elaborado por el Ingeniero Sanchez Danny</div>
            </div>
          </div>
          <div class="doc-info">
            <strong>Dossier Oficial de Auditoría</strong>
            <div>Folio: ${folioCode}</div>
            <div>Generado: ${printDate}</div>
            <div>Norma: ISO 9001:2015</div>
          </div>
        </div>

        <div class="kpi-bar">
          <div class="kpi-card">
            <div class="val">${kpis.disponibilidad}%</div>
            <div class="lbl">Disponibilidad (MTBF)</div>
          </div>
          <div class="kpi-card">
            <div class="val">${kpis.mttrHoras} h</div>
            <div class="lbl">T. Medio Reparación (MTTR)</div>
          </div>
          <div class="kpi-card">
            <div class="val">${kpis.equiposOperativos} / ${equipments.length}</div>
            <div class="lbl">Equipos Operativos</div>
          </div>
          <div class="kpi-card">
            <div class="val">${kpis.cumplimientoPM}%</div>
            <div class="lbl">Cumplimiento PM</div>
          </div>
        </div>

        <!-- Equipos -->
        <div class="section-title">
          <span>1. Matriz de Activos y Estado Operativo de Maquinaria</span>
          <span>${equipments.length} Activos Registrados</span>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 10%;">TAG</th>
              <th style="width: 25%;">Nombre del Equipo</th>
              <th style="width: 14%;">Tipo / Sistema</th>
              <th style="width: 20%;">Marca / Modelo</th>
              <th style="width: 16%;">Ubicación</th>
              <th style="width: 8%;">Horas</th>
              <th style="width: 7%;">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${equipments.map(e => `
              <tr>
                <td><strong>${e.tag}</strong></td>
                <td>${e.name}</td>
                <td>${e.type}</td>
                <td>${e.brand} ${e.model || ''}</td>
                <td>${e.location}</td>
                <td>${e.currentHours.toLocaleString()}</td>
                <td><span class="badge ${e.status === 'operativo' ? 'badge-green' : e.status === 'en_mantenimiento' ? 'badge-yellow' : 'badge-red'}">${e.status}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Órdenes de Trabajo -->
        <div class="section-title">
          <span>2. Registro de Órdenes de Trabajo (Formato ISO 9001:2015 F-MT-01)</span>
          <span>${workOrders.length} Órdenes Registradas</span>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 12%;">Código OT</th>
              <th style="width: 10%;">TAG Equipo</th>
              <th style="width: 28%;">Tarea / Intervención</th>
              <th style="width: 10%;">Tipo</th>
              <th style="width: 12%;">Fecha Prog.</th>
              <th style="width: 10%;">Estado</th>
              <th style="width: 18%;">Técnico Asignado</th>
            </tr>
          </thead>
          <tbody>
            ${workOrders.map(o => `
              <tr>
                <td><strong>${o.code}</strong></td>
                <td>${o.equipmentTag}</td>
                <td>${o.title}</td>
                <td>${o.type}</td>
                <td>${o.scheduledDate}</td>
                <td><span class="badge ${o.status === 'Completada' ? 'badge-green' : o.status === 'En_Proceso' ? 'badge-yellow' : 'badge-red'}">${o.status}</span></td>
                <td>${o.assignedTechnician}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Inventario de Repuestos -->
        <div class="section-title">
          <span>3. Almacén Técnico y Existencias de Repuestos Críticos</span>
          <span>${inventory.length} Ítems en Kárdex</span>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 12%;">SKU / Código</th>
              <th style="width: 32%;">Descripción del Repuesto</th>
              <th style="width: 14%;">Sistema</th>
              <th style="width: 12%;">Stock Actual</th>
              <th style="width: 10%;">Mínimo</th>
              <th style="width: 8%;">Unidad</th>
              <th style="width: 12%;">Estado Stock</th>
            </tr>
          </thead>
          <tbody>
            ${inventory.map(i => `
              <tr>
                <td><strong>${i.code}</strong></td>
                <td>${i.name}</td>
                <td>${i.system}</td>
                <td><strong>${i.stockCurrent}</strong></td>
                <td>${i.stockMin}</td>
                <td>${i.unit}</td>
                <td><span class="badge ${i.stockCurrent <= i.stockMin ? 'badge-red' : 'badge-green'}">${i.stockCurrent <= i.stockMin ? 'REORDEN' : 'OK'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Moldes -->
        <div class="section-title">
          <span>4. Registro de Moldes, Torques y Ciclos de Producción</span>
          <span>190 Nm Par de Apriete Verificado</span>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 12%;">TAG Molde</th>
              <th style="width: 28%;">Nombre / Cavidades</th>
              <th style="width: 22%;">Ubicación / Máquina</th>
              <th style="width: 18%;">Torque Apriete</th>
              <th style="width: 20%;">Ciclos Acumulados</th>
            </tr>
          </thead>
          <tbody>
            ${equipments.filter(e => e.type === 'molde').map(m => `
              <tr>
                <td><strong>${m.tag}</strong></td>
                <td>${m.name}</td>
                <td>${m.location}</td>
                <td>190 Nm (Conforme)</td>
                <td>${m.currentHours.toLocaleString()} / ${(m.maxCyclesBeforeOverhaul || 200000).toLocaleString()} tiros</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Firmas de Validación -->
        <div class="firmas">
          <div class="firma-box">
            <strong>Técnico de Mantenimiento</strong>
            <span>Generador del Respaldo Técnico</span>
          </div>
          <div class="firma-box">
            <strong>Supervisor de Calidad ISO 9001</strong>
            <span>Auditoría y Verificación</span>
          </div>
          <div class="firma-box">
            <strong>Ingeniero Sanchez Danny</strong>
            <span>Jefe de Mantenimiento / Aprobación</span>
          </div>
        </div>

        <div class="footer-note">
          SGMI • Sistema elaborado por el Ingeniero Sanchez Danny • Respaldo Documental en PDF para Auditoría y Archivo Técnico • ISO 9001:2015
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 400);
    } else {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
        iframe.contentWindow?.focus();
        setTimeout(() => {
          iframe.contentWindow?.print();
          setTimeout(() => document.body.removeChild(iframe), 2500);
        }, 400);
      }
    }

    addToast('success', 'Respaldo PDF Preparado', 'Se abrió la ventana de impresión. Selecciona "Guardar como PDF".');
  };

  const exportBackupJson = () => {
    const backupData = {
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      equipments,
      workOrders,
      inventory,
      movements,
      checklistLogs,
      failures,
      moldRecords
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SGMI_Planta_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Copia de Seguridad Exportada', 'Archivo JSON generado y descargado.');
  };

  const importBackupJson = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.equipments && data.workOrders && data.inventory) {
        setEquipments(data.equipments);
        setWorkOrders(data.workOrders);
        setInventory(data.inventory);
        if (data.movements) setMovements(data.movements);
        if (data.checklistLogs) setChecklistLogs(data.checklistLogs);
        if (data.failures) setFailures(data.failures);
        if (data.moldRecords) setMoldRecords(data.moldRecords);
        addToast('success', 'Restauración Exitosa', 'Todos los datos fueron restaurados correctamente.');
        return true;
      }
      throw new Error('Estructura de JSON inválida');
    } catch (e) {
      addToast('danger', 'Error de Importación', 'El archivo no contiene un formato de respaldo válido.');
      return false;
    }
  };

  const resetToDemoData = () => {
    setEquipments(initialEquipments);
    setWorkOrders(initialWorkOrders);
    setInventory(initialInventory);
    setMovements([]);
    setChecklistLogs([]);
    setFailures(initialFailureIncidents);
    setMoldRecords(initialMoldMountingRecords);
    addToast('info', 'Datos Reestablecidos', 'Se restablecieron los datos maestros industriales iniciales.');
  };

  const exportWorkOrdersToCsv = () => {
    const headers = ['Codigo', 'Tipo', 'Equipo_TAG', 'Equipo_Nombre', 'Titulo', 'Sistema', 'Frecuencia', 'Estado', 'Prioridad', 'Fecha_Programada', 'Horas_Reales', 'Tecnico'];
    const rows = workOrders.map(o => [
      o.code,
      o.type,
      o.equipmentTag,
      `"${o.equipmentName}"`,
      `"${o.title}"`,
      o.system,
      o.frequency,
      o.status,
      o.priority,
      o.scheduledDate,
      o.realDurationHours || 0,
      `"${o.assignedTechnician}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Ordenes_Trabajo_SGMI_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'CSV Descargado', 'Reporte de Órdenes de Trabajo exportado.');
  };

  const exportInventoryToCsv = () => {
    const headers = ['Codigo', 'Nombre', 'Categoria', 'Sistema', 'Stock_Actual', 'Stock_Minimo', 'Unidad', 'Costo_Unitario_USD', 'Ubicacion', 'Criticidad'];
    const rows = inventory.map(i => [
      i.code,
      `"${i.name}"`,
      i.category,
      i.system,
      i.stockCurrent,
      i.stockMin,
      i.unit,
      i.unitCost,
      `"${i.location}"`,
      i.criticality
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Inventario_Repuestos_SGMI_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('success', 'CSV Descargado', 'Reporte de Almacén y Repuestos exportado.');
  };

  return (
    <MaintenanceContext.Provider
      value={{
        equipments,
        templates,
        workOrders,
        inventory,
        movements,
        checklistLogs,
        failures,
        moldRecords,
        kpis,
        activeTab,
        setActiveTab,
        toasts,
        addToast,
        removeToast,
        addEquipment,
        updateEquipment,
        deleteEquipment,
        addWorkOrder,
        updateWorkOrder,
        completeWorkOrderWithDeductions,
        deleteWorkOrder,
        generateBatchOrders,
        addInventoryItem,
        updateInventoryStock,
        adjustInventoryItem,
        saveChecklistExecution,
        reportFailureIncident,
        resolveFailureIncident,
        mountMold,
        unmountMold,
        exportBackupPdf,
        exportBackupJson,
        importBackupJson,
        resetToDemoData,
        exportWorkOrdersToCsv,
        exportInventoryToCsv
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = (): MaintenanceContextType => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};
