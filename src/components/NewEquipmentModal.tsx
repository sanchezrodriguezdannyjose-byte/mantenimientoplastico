import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { EquipmentType, EquipmentStatus } from '../types';
import { X, Cpu, Plus } from 'lucide-react';

interface NewEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewEquipmentModal: React.FC<NewEquipmentModalProps> = ({ isOpen, onClose }) => {
  const { addEquipment } = useMaintenance();

  const [tag, setTag] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<EquipmentType>('inyeccion');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [location, setLocation] = useState('Nave de Inyección');
  const [status, setStatus] = useState<EquipmentStatus>('operativo');
  const [currentHours, setCurrentHours] = useState(0);
  const [maxCycles, setMaxCycles] = useState(250000);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEquipment({
      tag: tag.toUpperCase().trim(),
      name: name.trim(),
      type,
      brand: brand.trim(),
      model: model.trim(),
      serialNumber: serialNumber.trim(),
      location: location.trim(),
      status,
      currentHours: Number(currentHours) || 0,
      maxCyclesBeforeOverhaul: type === 'molde' ? maxCycles : undefined,
      lastMaintenanceDate: new Date().toISOString().split('T')[0],
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col my-8">
        <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Registrar Nuevo Equipo / Activo</h3>
              <p className="text-xs text-slate-400">Inyección, Soplado, Auxiliares o Moldes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Código / TAG *</label>
              <input
                type="text"
                required
                placeholder="Ej: INY-03, CMP-02"
                value={tag}
                onChange={e => setTag(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-bold uppercase"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tipo de Activo *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as EquipmentType)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              >
                <option value="inyeccion">Máquina Inyectora</option>
                <option value="soplado">Máquina Sopladora</option>
                <option value="chiller">Chiller de Proceso</option>
                <option value="compresor">Compresor de Aire</option>
                <option value="planta">Planta Eléctrica Diésel</option>
                <option value="molde">Molde / Utillaje</option>
                <option value="auxiliar">Otro Auxiliar</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Nombre Comercial / Descripción *</label>
            <input
              type="text"
              required
              placeholder="Ej: Inyectora Haitian Mars III 320T"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Marca</label>
              <input
                type="text"
                placeholder="Ej: Engel"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Modelo</label>
              <input
                type="text"
                placeholder="Ej: Victory 200"
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">N° Serie</label>
              <input
                type="text"
                placeholder="Ej: SN-88210"
                value={serialNumber}
                onChange={e => setSerialNumber(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Ubicación en Planta</label>
              <input
                type="text"
                placeholder="Ej: Nave A - Bahía 3"
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Estado Inicial</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as EquipmentStatus)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-semibold"
              >
                <option value="operativo">Operativo (En línea)</option>
                <option value="en_mantenimiento">En Mantenimiento</option>
                <option value="parado_falla">Parado por Falla</option>
                <option value="almacenado">Almacenado / En espera</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {type === 'molde' ? 'Ciclos Acumulados' : 'Horómetro (Horas)'}
              </label>
              <input
                type="number"
                min="0"
                value={currentHours}
                onChange={e => setCurrentHours(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
              />
            </div>
            {type === 'molde' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Límite para Overhaul (Ciclos)</label>
                <input
                  type="number"
                  min="10000"
                  step="10000"
                  value={maxCycles}
                  onChange={e => setMaxCycles(parseInt(e.target.value) || 200000)}
                  className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Notas Técnicas / Especificaciones</label>
            <textarea
              rows={2}
              placeholder="Voltaje, tonelaje, capacidad de inyección, refrigerante, etc."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Guardar Equipo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
