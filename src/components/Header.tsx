import React from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import {
  LayoutDashboard,
  Cpu,
  ClipboardList,
  FileSpreadsheet,
  FileText,
  Wrench,
  Layers,
  Package,
  CalendarDays,
  CheckSquare,
  AlertTriangle,
  PlusCircle,
  HardDriveDownload,
  ShieldAlert,
  Flame,
  FileCode,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  onOpenNewOt: () => void;
  onOpenReportFailure: () => void;
  onOpenBackup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewOt,
  onOpenReportFailure,
  onOpenBackup
}) => {
  const { activeTab, setActiveTab, kpis } = useMaintenance();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'equipos', label: 'Equipos y Activos', icon: Cpu },
    { id: 'planes', label: 'Planes Maestros', icon: ClipboardList },
    { id: 'interactivo', label: 'Fichas Técnicas', icon: FileSpreadsheet },
    { id: 'ordenes', label: 'Órdenes de Trabajo', icon: FileText, badge: kpis.otsPendientes + kpis.otsEnProceso },
    { id: 'montaje', label: 'Montaje de Moldes', icon: Wrench },
    { id: 'mantenimiento-moldes', label: 'Mant. Moldes', icon: Layers },
    { id: 'recursos', label: 'Almacén y Repuestos', icon: Package, badge: kpis.repuestosBajoStock, badgeColor: 'bg-rose-500' },
    { id: 'cronograma', label: 'Cronograma Anual', icon: CalendarDays },
    { id: 'checklists', label: 'Checklists Operativos', icon: CheckSquare },
    { id: 'fallas', label: 'Matriz de Fallas', icon: AlertTriangle }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800 shadow-lg px-4 lg:px-8 py-3">
      {/* Top Bar: Logo, Plant Status & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800/60">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <i className="fa-solid fa-gears text-xl"></i>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base lg:text-lg font-bold text-white tracking-wide">
                Gestión de Mantenimiento Integral (SGMI)
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                En Línea | Auto-guardado
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-xs">
                <i className="fa-solid fa-user-check text-amber-400 text-[10px]"></i>
                Sistema elaborado por el Ingeniero Sanchez Danny
              </span>
            </div>
            <p className="text-xs text-cyan-400 font-medium flex items-center gap-1.5 flex-wrap">
              <span>Inyección, Soplado y Auxiliares</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">Chiller, Compresor, Planta Eléctrica y Moldes</span>
            </p>
          </div>
        </div>

        {/* Live Plant Quick Badges & Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Equipos Operativos:</span>
            <span className="font-bold text-emerald-400">{kpis.equiposOperativos}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">Parados:</span>
            <span className={`font-bold ${kpis.equiposParados > 0 ? 'text-rose-400 font-extrabold animate-pulse' : 'text-slate-300'}`}>
              {kpis.equiposParados}
            </span>
          </div>

          <button
            onClick={onOpenNewOt}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-600/20 transition-colors"
            title="Crear una nueva Orden de Trabajo manual o correctiva"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nueva OT</span>
          </button>

          <button
            onClick={onOpenReportFailure}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-500 text-white font-medium text-xs border border-rose-500/40 shadow-md transition-colors"
            title="Reportar avería o parada no planificada"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Reportar Falla</span>
          </button>

          <button
            onClick={onOpenBackup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors"
            title="Exportar/Importar copia de seguridad en JSON o restablecer demo"
          >
            <HardDriveDownload className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Guardado & Backup</span>
          </button>

          <a
            href="/programa_mantenimiento_integral.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition-colors"
            title="Abrir o descargar la versión autónoma en un único archivo de código HTML"
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Versión HTML Pura</span>
            <ExternalLink className="w-3 h-3 text-emerald-400 opacity-70" />
          </a>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <nav className="flex items-center gap-1 overflow-x-auto pt-2.5 pb-1 no-scrollbar text-xs">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all duration-150 relative ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {typeof tab.badge === 'number' && tab.badge > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    tab.badgeColor || (isActive ? 'bg-slate-900 text-cyan-300' : 'bg-cyan-500/20 text-cyan-300')
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
