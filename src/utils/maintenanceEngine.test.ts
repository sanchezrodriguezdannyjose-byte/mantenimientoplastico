import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateKPIs, generateWorkOrdersForPeriod, processInventoryDeduction, createCorrectiveWorkOrder } from './maintenanceEngine';
import { Equipment, WorkOrder, InventoryItem, PlanTemplate } from '../types';

test('calculateKPIs correctly calculates operative ratio, compliance and counts', () => {
  const dummyEquipments: Equipment[] = [
    {
      id: 'eq-1',
      tag: 'INY-01',
      name: 'Inyectora 1',
      type: 'inyeccion',
      brand: 'Haitian',
      model: 'MA250',
      serialNumber: '123',
      location: 'Nave A',
      status: 'operativo',
      currentHours: 5000,
      lastMaintenanceDate: '2026-10-01'
    },
    {
      id: 'eq-2',
      tag: 'SOP-01',
      name: 'Sopladora 1',
      type: 'soplado',
      brand: 'Bekum',
      model: 'H121',
      serialNumber: '456',
      location: 'Nave B',
      status: 'en_mantenimiento',
      currentHours: 3000,
      lastMaintenanceDate: '2026-10-01'
    }
  ];

  const dummyOrders: WorkOrder[] = [
    {
      id: 'ot-1',
      code: 'F-MT-01-001',
      type: 'Preventivo',
      equipmentId: 'eq-1',
      equipmentTag: 'INY-01',
      equipmentName: 'Inyectora 1',
      status: 'Completada',
      priority: 'Media',
      scheduledDate: '2026-10-01',
      title: 'Limpieza',
      system: 'Mecánico',
      frequency: 'Mensual',
      estimatedTime: '1 h',
      realDurationHours: 1.5,
      assignedTechnician: 'Tech 1',
      verifierSupervisor: 'Sup 1',
      procedureSteps: [],
      toolsUsed: [],
      suppliesUsed: [],
      partsConsumed: [],
      observations: '',
      createdAt: '2026-10-01'
    },
    {
      id: 'ot-2',
      code: 'F-MT-01-002',
      type: 'Preventivo',
      equipmentId: 'eq-2',
      equipmentTag: 'SOP-01',
      equipmentName: 'Sopladora 1',
      status: 'Pendiente',
      priority: 'Media',
      scheduledDate: '2026-10-02',
      title: 'Engrase',
      system: 'Mecánico',
      frequency: 'Mensual',
      estimatedTime: '1 h',
      assignedTechnician: 'Tech 2',
      verifierSupervisor: 'Sup 1',
      procedureSteps: [],
      toolsUsed: [],
      suppliesUsed: [],
      partsConsumed: [],
      observations: '',
      createdAt: '2026-10-01'
    }
  ];

  const kpis = calculateKPIs(dummyEquipments, dummyOrders, []);

  assert.equal(kpis.equiposOperativos, 1);
  assert.equal(kpis.equiposEnMantenimiento, 1);
  assert.equal(kpis.otsPendientes, 1);
  assert.equal(kpis.otsCompletadas, 1);
  assert.equal(kpis.cumplimientoPM, 50); // 1 completed out of 2 total
});

test('processInventoryDeduction decreases stock and triggers low stock alert when below minimum', () => {
  const dummyInventory: InventoryItem[] = [
    {
      id: 'part-1',
      code: 'FLT-01',
      name: 'Filtro Hidráulico',
      category: 'repuesto',
      system: 'Hidráulico',
      stockCurrent: 3,
      stockMin: 2,
      unit: 'un',
      location: 'H-01',
      criticality: 'Alta',
      unitCost: 50,
      compatibleEquipments: ['eq-1']
    }
  ];

  const result = processInventoryDeduction(dummyInventory, [], 'part-1', 2, 'ot-123', 'Carlos');
  
  assert.equal(result.updatedInventory[0].stockCurrent, 1);
  assert.equal(result.updatedMovements.length, 1);
  assert.equal(result.updatedMovements[0].quantity, 2);
  assert.ok(result.warningLowStock !== undefined, 'Should trigger low stock warning');
});

test('createCorrectiveWorkOrder sets up a corrective order linked to equipment', () => {
  const dummyEquipment: Equipment = {
    id: 'eq-1',
    tag: 'INY-01',
    name: 'Inyectora 1',
    type: 'inyeccion',
    brand: 'Haitian',
    model: 'MA250',
    serialNumber: '123',
    location: 'Nave A',
    status: 'parado_falla',
    currentHours: 5000,
    lastMaintenanceDate: '2026-10-01'
  };

  const ot = createCorrectiveWorkOrder(
    dummyEquipment,
    'Fuga de aceite en cilindro',
    'Se detectó charco en la bancada',
    'Critica',
    'Mario Rossi',
    15,
    'Hidráulico'
  );

  assert.equal(ot.type, 'Correctivo');
  assert.equal(ot.equipmentId, 'eq-1');
  assert.equal(ot.equipmentTag, 'INY-01');
  assert.equal(ot.priority, 'Critica');
  assert.equal(ot.code, 'F-MT-01-015');
});
