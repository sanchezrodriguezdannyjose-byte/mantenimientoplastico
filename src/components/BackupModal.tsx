import React, { useRef, useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import { X, Download, Upload, RotateCcw, FileText, CheckCircle2, ShieldCheck, Database, FileCode, Copy, Check, ExternalLink } from 'lucide-react';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const {
    exportBackupJson,
    importBackupJson,
    resetToDemoData,
    exportWorkOrdersToCsv,
    exportInventoryToCsv
  } = useMaintenance();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [loadingHtml, setLoadingHtml] = useState(false);

  if (!isOpen) return null;

  const handleCopyHtml = async () => {
    try {
      setLoadingHtml(true);
      const res = await fetch('/programa_mantenimiento_integral.html');
      const htmlText = await res.text();
      await navigator.clipboard.writeText(htmlText);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2500);
    } catch (err) {
      console.error('Error copying HTML:', err);
    } finally {
      setLoadingHtml(false);
    }
  };

  const handleDownloadHtml = () => {
    const link = document.createElement('a');
    link.href = '/programa_mantenimiento_integral.html';
    link.download = 'programa_mantenimiento_integral.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importBackupJson(content);
        if (success) {
          onClose();
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#151c2c] border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gestor de Persistencia y Copias de Seguridad</h3>
              <p className="text-xs text-slate-400">Registro continuo garantizado | Exportación e Importación</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-sm">
          {/* Status badge */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-emerald-300">Guardado Automático Activo (LocalStorage)</span>
              Cada máquina, orden de trabajo, checklist o movimiento de repuesto se guarda al instante en tu navegador. Puedes generar copias de seguridad portátiles en cualquier momento.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Export JSON */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  Exportar Backup Completo
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Descarga un archivo JSON con todos los equipos, órdenes, consumos de inventario e historial.
                </p>
              </div>
              <button
                onClick={exportBackupJson}
                className="w-full py-2 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Descargar JSON
              </button>
            </div>

            {/* Import JSON */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between gap-3">
              <div>
                <h4 className="font-semibold text-slate-200 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  Restaurar desde JSON
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Carga un respaldo previo para recuperar todas tus órdenes y configuraciones anteriores.
                </p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                Seleccionar Archivo
              </button>
            </div>
          </div>

          {/* Standalone HTML Code Section requested by user */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-emerald-300 flex items-center gap-2 text-xs">
                <FileCode className="w-4 h-4 text-emerald-400" />
                Código HTML Autónomo Todo-en-Uno (.html)
              </h4>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                100% Funcional sin servidor
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-3">
              Todo el programa (10 módulos, formularios, persistencia en LocalStorage, formatos ISO 9001 e inventario) contenido en un único archivo HTML listo para abrir en cualquier navegador o guardar en una memoria USB.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={handleDownloadHtml}
                className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Descargar .html
              </button>
              <button
                onClick={handleCopyHtml}
                disabled={loadingHtml}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                {copiedHtml ? '¡Copiado!' : 'Copiar Código'}
              </button>
              <a
                href="/programa_mantenimiento_integral.html"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-1.5 text-center"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Abrir en Pestaña
              </a>
            </div>
          </div>

          {/* CSV Exports */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <h4 className="font-semibold text-slate-200 mb-2 flex items-center gap-2 text-xs">
              <FileText className="w-4 h-4 text-amber-400" />
              Exportación de Reportes a Excel / CSV
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={exportWorkOrdersToCsv}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors text-center"
              >
                Exportar Órdenes (.CSV)
              </button>
              <button
                onClick={exportInventoryToCsv}
                className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors text-center"
              >
                Exportar Almacén (.CSV)
              </button>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">¿Deseas reiniciar los datos de demostración de planta?</span>
            <button
              onClick={() => {
                if (window.confirm('¿Confirmas que deseas reiniciar todos los datos a la demostración inicial?')) {
                  resetToDemoData();
                  onClose();
                }
              }}
              className="px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 font-semibold transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reiniciar Demo
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
