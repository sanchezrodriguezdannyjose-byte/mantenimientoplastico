import React, { useState } from 'react';
import { MaintenanceProvider, useMaintenance } from './context/MaintenanceContext';
import { Header } from './components/Header';
import { ToastContainer } from './components/ToastContainer';
import { BackupModal } from './components/BackupModal';
import { NewWorkOrderModal } from './components/NewWorkOrderModal';
import { ExecuteWorkOrderModal } from './components/ExecuteWorkOrderModal';
import { NewEquipmentModal } from './components/NewEquipmentModal';
import { ReportFailureModal } from './components/ReportFailureModal';

import { DashboardView } from './views/DashboardView';
import { EquipmentsView } from './views/EquipmentsView';
import { PlanesView } from './views/PlanesView';
import { FichasTecnicasView } from './views/FichasTecnicasView';
import { OrdenesTrabajoView } from './views/OrdenesTrabajoView';
import { MontajeMoldesView } from './views/MontajeMoldesView';
import { MantenimientoMoldesView } from './views/MantenimientoMoldesView';
import { RecursosView } from './views/RecursosView';
import { CronogramaView } from './views/CronogramaView';
import { ChecklistsView } from './views/ChecklistsView';
import { FallasView } from './views/FallasView';
import { WorkOrder } from './types';

const MainContent: React.FC = () => {
  const { activeTab } = useMaintenance();

  // Modal States
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isNewOtOpen, setIsNewOtOpen] = useState(false);
  const [preselectedOtData, setPreselectedOtData] = useState<{
    eqId?: string;
    title?: string;
    system?: string;
  }>({});

  const [executingOrder, setExecutingOrder] = useState<WorkOrder | null>(null);
  const [isNewEquipmentOpen, setIsNewEquipmentOpen] = useState(false);

  const [isReportFailureOpen, setIsReportFailureOpen] = useState(false);
  const [failurePreselectData, setFailurePreselectData] = useState<{
    eqId?: string;
    symptom?: string;
    system?: string;
  }>({});

  // Handlers
  const handleOpenNewOt = (eqId?: string, title?: string, system?: string) => {
    setPreselectedOtData({ eqId, title, system });
    setIsNewOtOpen(true);
  };

  const handleOpenReportFailure = (eqId?: string, symptom?: string, system?: string) => {
    setFailurePreselectData({ eqId, symptom, system });
    setIsReportFailureOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Application Header */}
      <Header
        onOpenNewOt={() => handleOpenNewOt()}
        onOpenReportFailure={() => handleOpenReportFailure()}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            onExecuteOt={order => setExecutingOrder(order)}
            onOpenNewOt={() => handleOpenNewOt()}
          />
        )}

        {activeTab === 'equipos' && (
          <EquipmentsView
            onOpenNewEquipment={() => setIsNewEquipmentOpen(true)}
            onOpenNewOtForEquipment={eqId => handleOpenNewOt(eqId)}
            onReportFailureForEquipment={eqId => handleOpenReportFailure(eqId)}
          />
        )}

        {activeTab === 'planes' && (
          <PlanesView
            onOpenNewOtForTemplate={(title, system) => handleOpenNewOt(undefined, title, system)}
          />
        )}

        {activeTab === 'interactivo' && (
          <FichasTecnicasView
            onOpenNewOtForTemplate={(title, system) => handleOpenNewOt(undefined, title, system)}
          />
        )}

        {activeTab === 'ordenes' && (
          <OrdenesTrabajoView
            onOpenNewOt={() => handleOpenNewOt()}
            onExecuteOt={order => setExecutingOrder(order)}
          />
        )}

        {activeTab === 'montaje' && <MontajeMoldesView />}

        {activeTab === 'mantenimiento-moldes' && <MantenimientoMoldesView />}

        {activeTab === 'recursos' && <RecursosView />}

        {activeTab === 'cronograma' && (
          <CronogramaView
            onExecuteOt={order => setExecutingOrder(order)}
            onOpenNewOt={() => handleOpenNewOt()}
          />
        )}

        {activeTab === 'checklists' && <ChecklistsView />}

        {activeTab === 'fallas' && (
          <FallasView
            onOpenReportFailureWithData={(symptom, system) =>
              handleOpenReportFailure(undefined, symptom, system)
            }
          />
        )}
      </main>

      {/* App Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] py-5 px-4 sm:px-8 text-xs text-slate-400 no-print mt-auto">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-2 text-slate-300 font-medium text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Gestión de Mantenimiento Integral (SGMI) • Inyección, Soplado y Auxiliares</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 font-bold text-xs shadow-sm">
            <i className="fa-solid fa-user-check text-amber-400"></i>
            <span>Sistema elaborado por el Ingeniero Sanchez Danny</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Norma ISO 9001:2015 • Formato F-MT-01 Rev.01 • Registro Continuo
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BackupModal isOpen={isBackupOpen} onClose={() => setIsBackupOpen(false)} />

      <NewWorkOrderModal
        isOpen={isNewOtOpen}
        onClose={() => {
          setIsNewOtOpen(false);
          setPreselectedOtData({});
        }}
        preselectedEquipmentId={preselectedOtData.eqId}
        preselectedTitle={preselectedOtData.title}
        preselectedSystem={preselectedOtData.system}
      />

      <ExecuteWorkOrderModal
        order={executingOrder}
        isOpen={!!executingOrder}
        onClose={() => setExecutingOrder(null)}
      />

      <NewEquipmentModal
        isOpen={isNewEquipmentOpen}
        onClose={() => setIsNewEquipmentOpen(false)}
      />

      <ReportFailureModal
        isOpen={isReportFailureOpen}
        onClose={() => {
          setIsReportFailureOpen(false);
          setFailurePreselectData({});
        }}
        preselectedEquipmentId={failurePreselectData.eqId}
        preselectedSymptom={failurePreselectData.symptom}
        preselectedSystem={failurePreselectData.system}
      />

      {/* Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <MaintenanceProvider>
      <MainContent />
    </MaintenanceProvider>
  );
}
