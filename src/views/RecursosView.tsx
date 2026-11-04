import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { InventoryItem } from '../types';
import {
  Package,
  Search,
  Plus,
  AlertTriangle,
  History,
  CheckCircle2,
  TrendingDown,
  Wrench,
  Boxes,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';

export const RecursosView: React.FC = () => {
  const { inventory, movements, addInventoryItem, updateInventoryStock } = useMaintenance();

  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItemForStock, setSelectedItemForStock] = useState<InventoryItem | null>(null);
  const [newStockValue, setNewStockValue] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState<boolean>(false);
  const [showMovementsModal, setShowMovementsModal] = useState<boolean>(false);

  // New item form state
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState<'repuesto' | 'insumo' | 'herramienta'>('repuesto');
  const [itemSystem, setItemSystem] = useState<InventoryItem['system']>('Mecánico');
  const [itemStock, setItemStock] = useState(5);
  const [itemMin, setItemMin] = useState(2);
  const [itemUnit, setItemUnit] = useState('un');
  const [itemLocation, setItemLocation] = useState('Estante A-01');
  const [itemCriticality, setItemCriticality] = useState<'Alta' | 'Media' | 'Baja'>('Alta');
  const [itemCost, setItemCost] = useState(25.0);

  const filteredItems = inventory.filter(item => {
    const matchesCategory = activeCategory === 'todos' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.system.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockItems = inventory.filter(i => i.stockCurrent <= i.stockMin);

  const handleStockUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForStock) return;
    updateInventoryStock(
      selectedItemForStock.id,
      newStockValue,
      adjustmentReason || 'Ajuste manual de almacén',
      'Encargado de Almacén'
    );
    setSelectedItemForStock(null);
  };

  const handleCreateItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInventoryItem({
      code: itemCode.toUpperCase().trim(),
      name: itemName.trim(),
      category: itemCategory,
      system: itemSystem,
      stockCurrent: itemStock,
      stockMin: itemMin,
      unit: itemUnit.trim(),
      location: itemLocation.trim(),
      criticality: itemCriticality,
      unitCost: itemCost,
      compatibleEquipments: []
    });
    setIsNewItemModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="p-5 rounded-2xl bg-[#151c2c] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            Gestión de Almacén, Repuestos Críticos e Insumos (CMMS)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Control de stock en tiempo real interrelacionado con el consumo de Órdenes de Trabajo y alertas automáticas de reorden.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowMovementsModal(true)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <History className="w-4 h-4 text-cyan-400" />
            Historial de Movimientos ({movements.length})
          </button>
          <button
            onClick={() => setIsNewItemModalOpen(true)}
            className="px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            Nuevo Artículo
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <strong className="text-amber-300 font-bold block mb-1">
              Atención: {lowStockItems.length} artículo(s) han alcanzado o están por debajo del Stock Mínimo de Seguridad
            </strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {lowStockItems.map(item => (
                <span
                  key={item.id}
                  className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[11px] font-semibold"
                >
                  {item.name}: {item.stockCurrent} {item.unit} (Mín: {item.stockMin})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#151c2c] border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          {['todos', 'repuesto', 'insumo', 'herramienta'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat === 'todos' ? 'Todo el Inventario' : `${cat}s`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, nombre, ubicación..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#151c2c]">
        <table className="w-full text-xs text-left min-w-[780px]">
          <thead className="bg-slate-900 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
            <tr>
              <th className="p-3 w-28">Código</th>
              <th className="p-3">Descripción del Artículo</th>
              <th className="p-3 w-28">Categoría</th>
              <th className="p-3 w-28">Sistema</th>
              <th className="p-3 w-28 text-center">Stock Actual</th>
              <th className="p-3 w-24 text-center">Stock Mín.</th>
              <th className="p-3 w-28">Ubicación</th>
              <th className="p-3 w-24 text-center">Criticidad</th>
              <th className="p-3 w-24 text-right">Costo Unit.</th>
              <th className="p-3 w-24 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/20">
            {filteredItems.map(item => {
              const isLow = item.stockCurrent <= item.stockMin;
              return (
                <tr key={item.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-mono font-bold text-cyan-300">{item.code}</td>
                  <td className="p-3">
                    <span className="font-semibold text-white">{item.name}</span>
                  </td>
                  <td className="p-3 capitalize text-slate-300">{item.category}</td>
                  <td className="p-3 text-slate-400">{item.system}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-mono font-bold text-xs ${
                        isLow
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {item.stockCurrent} {item.unit}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono text-slate-400">
                    {item.stockMin} {item.unit}
                  </td>
                  <td className="p-3 text-slate-300 font-medium">{item.location}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.criticality === 'Alta'
                          ? 'bg-rose-500/20 text-rose-300'
                          : item.criticality === 'Media'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {item.criticality}
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-slate-200">
                    ${item.unitCost.toFixed(2)}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedItemForStock(item);
                        setNewStockValue(item.stockCurrent);
                        setAdjustmentReason('');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-cyan-300 text-xs font-semibold transition-colors"
                    >
                      Ajustar
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={10} className="p-6 text-center text-slate-500 text-xs">
                  No se encontraron artículos en almacén con ese criterio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Adjust Stock Modal */}
      {selectedItemForStock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-md p-6 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Boxes className="w-4 h-4 text-cyan-400" />
              Ajuste de Existencias: {selectedItemForStock.name}
            </h3>
            <p className="text-slate-400">
              Registra una entrada de almacén, recepción de proveedor o inventario físico.
            </p>

            <form onSubmit={handleStockUpdateSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Nueva Cantidad en Existencia ({selectedItemForStock.unit}):
                </label>
                <input
                  type="number"
                  min="0"
                  value={newStockValue}
                  onChange={e => setNewStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                  required
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono font-bold text-base"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Motivo / Factura / Justificación:</label>
                <input
                  type="text"
                  placeholder="Ej: Compra Orden OC-941, conteo cíclico..."
                  value={adjustmentReason}
                  onChange={e => setAdjustmentReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedItemForStock(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold"
                >
                  Actualizar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movements History Modal */}
      {showMovementsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl flex flex-col my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                Bitácora de Trazabilidad y Salidas por OT
              </h3>
              <button
                onClick={() => setShowMovementsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto max-h-[55vh] space-y-2 text-xs">
              {movements.map(mov => (
                <div
                  key={mov.id}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                        mov.type === 'salida_ot'
                          ? 'bg-rose-500/10 text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {mov.type === 'salida_ot' ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="font-bold text-white">{mov.itemName}</span>
                      <p className="text-[11px] text-slate-400">{mov.notes} • Por: {mov.registeredBy}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-bold ${
                        mov.type === 'salida_ot' ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {mov.type === 'salida_ot' ? '-' : '+'}
                      {mov.quantity}
                    </span>
                    <span className="block text-[10px] text-slate-500">{mov.date}</span>
                  </div>
                </div>
              ))}
              {movements.length === 0 && (
                <p className="text-center py-8 text-slate-500">
                  No se han registrado consumos de repuestos todavía. Al cerrar una OT con repuestos se registrará aquí automáticamente.
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-700 flex justify-end">
              <button
                onClick={() => setShowMovementsModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Item Modal */}
      {isNewItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col my-8 text-xs">
            <h3 className="text-sm font-bold text-white mb-3">Registrar Nuevo Artículo de Almacén</h3>
            <form onSubmit={handleCreateItemSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Código / Referencia *</label>
                  <input
                    type="text"
                    required
                    placeholder="REP-XXX-01"
                    value={itemCode}
                    onChange={e => setItemCode(e.target.value)}
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Categoría</label>
                  <select
                    value={itemCategory}
                    onChange={e => setItemCategory(e.target.value as any)}
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                  >
                    <option value="repuesto">Repuesto</option>
                    <option value="insumo">Insumo / Consumible</option>
                    <option value="herramienta">Herramienta / Activo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nombre / Descripción *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Sello retenedor de vástago 60mm"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min="0"
                    value={itemStock}
                    onChange={e => setItemStock(parseInt(e.target.value) || 0)}
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    min="1"
                    value={itemMin}
                    onChange={e => setItemMin(parseInt(e.target.value) || 1)}
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Unidad</label>
                  <input
                    type="text"
                    value={itemUnit}
                    onChange={e => setItemUnit(e.target.value)}
                    placeholder="un, L, kg"
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Ubicación</label>
                  <input
                    type="text"
                    value={itemLocation}
                    onChange={e => setItemLocation(e.target.value)}
                    placeholder="Estante / Pasillo"
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Costo Unitario ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemCost}
                    onChange={e => setItemCost(parseFloat(e.target.value) || 0)}
                    className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsNewItemModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold"
                >
                  Guardar Artículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
