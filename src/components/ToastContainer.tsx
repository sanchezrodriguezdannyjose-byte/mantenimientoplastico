import React from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useMaintenance();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
      {toasts.map(toast => {
        let bg = 'bg-slate-900 border-slate-700 text-slate-100';
        let icon = <Info className="w-5 h-5 text-cyan-400 shrink-0" />;

        if (toast.type === 'success') {
          bg = 'bg-emerald-950/95 border-emerald-600/60 text-emerald-100';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-950/95 border-amber-600/60 text-amber-100';
          icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
        } else if (toast.type === 'danger') {
          bg = 'bg-rose-950/95 border-rose-600/60 text-rose-100';
          icon = <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />;
        } else if (toast.type === 'info') {
          bg = 'bg-cyan-950/95 border-cyan-600/60 text-cyan-100';
          icon = <Info className="w-5 h-5 text-cyan-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 ${bg}`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm leading-tight">{toast.title}</h4>
              <p className="text-xs opacity-90 mt-1 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors shrink-0"
              title="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
