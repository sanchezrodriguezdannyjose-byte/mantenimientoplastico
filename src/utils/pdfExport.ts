import { WorkOrder } from '../types';

/**
 * Generates and prints/saves official F-MT-01 Work Order sheets in Letter Size PDF format.
 * Formatted strictly for ISO 9001:2015 audit with attribution to Ing. Sanchez Danny.
 */
export function exportWorkOrderSheetsPdf(
  groupedByDate: Record<string, WorkOrder[]>,
  specificDate?: string
) {
  const datesToPrint = specificDate
    ? [specificDate]
    : Object.keys(groupedByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  if (datesToPrint.length === 0) {
    alert('No hay órdenes de trabajo disponibles para exportar en PDF.');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor, permite ventanas emergentes para generar el documento PDF.');
    return;
  }

  const generatedDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const sheetsHtml = datesToPrint
    .map(dateKey => {
      const orders = groupedByDate[dateKey] || [];
      if (orders.length === 0) return '';

      const rowsHtml = orders
        .map(
          (ot, idx) => `
          <tr>
            <td style="text-align:center; font-weight:bold;">${idx + 1}</td>
            <td>
              <strong>${ot.equipmentTag}</strong>
              <div style="font-size:8px; color:#475569;">${ot.equipmentName}</div>
            </td>
            <td>
              <strong style="color:#0f172a;">${ot.title}</strong>
              <div style="font-size:8px; color:#64748b;">Sistema: ${ot.system} • Tipo: ${ot.type}</div>
            </td>
            <td style="text-align:center; font-weight:bold;">${ot.frequency || 'Mensual'}</td>
            <td>
              <ol style="margin:0; padding-left:14px; font-size:8px; line-height:1.25;">
                ${ot.procedureSteps.map(s => `<li>${s.step}</li>`).join('')}
              </ol>
            </td>
            <td>
              <ul style="margin:0; padding-left:12px; font-size:8px; line-height:1.25; list-style:none;">
                ${ot.toolsUsed.map(t => `<li>🛠️ ${t}</li>`).join('')}
                ${ot.suppliesUsed.map(s => `<li>🧴 ${s}</li>`).join('')}
                ${(ot.partsConsumed || []).map(p => `<li>⚙️ ${p.partName} (${p.quantity})</li>`).join('')}
              </ul>
            </td>
            <td style="text-align:center; font-weight:bold; font-size:8.5px;">${ot.estimatedTime || '1.5 h'}</td>
            <td style="text-align:center; font-size:8px;">
              <div>${ot.technicianSignature || ot.assignedTechnician}</div>
              <div style="font-size:7px; color:#64748b; font-style:italic;">${ot.status === 'Completada' ? 'Verificado' : 'Asignado'}</div>
            </td>
          </tr>
        `
        )
        .join('');

      const observationsSummary = orders
        .map(o => o.observations)
        .filter(Boolean)
        .join(' | ') || 'Sin desviaciones operativas registradas durante la ejecución.';

      return `
        <div class="hoja-carta">
          <!-- Encabezado Oficial F-MT-01 -->
          <div class="carta-header">
            <div class="logo-box">SGMI</div>
            <div class="header-center">
              <h2>PROGRAMA DE MANTENIMIENTO INTEGRAL DE PLANTA</h2>
              <h3>ORDEN DE TRABAJO DIARIA / PERIÓDICA DE MANTENIMIENTO (F-MT-01)</h3>
              <p>Inyección, Soplado y Servicios Auxiliares • Cumplimiento Norma ISO 9001:2015</p>
              <div class="author">Sistema elaborado por el Ingeniero Sanchez Danny</div>
            </div>
            <div class="header-right">
              <div><strong>CÓDIGO:</strong> F-MT-01</div>
              <div><strong>REVISIÓN:</strong> 01</div>
              <div><strong>FECHA:</strong> ${dateKey}</div>
              <div><strong>HOJA:</strong> 1 de 1</div>
            </div>
          </div>

          <!-- Metadatos de la Jornada -->
          <div class="meta-strip">
            <div><span>Fecha Programada:</span> <strong>${dateKey}</strong></div>
            <div><span>Total Órdenes:</span> <strong>${orders.length} intervenciones</strong></div>
            <div><span>Supervisor Responsable:</span> <strong>Ing. Sanchez Danny</strong></div>
            <div><span>Emisión:</span> <strong>${generatedDate}</strong></div>
          </div>

          <!-- Tabla de Actividades de Mantenimiento -->
          <table class="carta-table">
            <thead>
              <tr>
                <th style="width: 4%;">N°</th>
                <th style="width: 14%;">Equipo / TAG</th>
                <th style="width: 22%;">Actividad y Sistema</th>
                <th style="width: 8%;">Frecuencia</th>
                <th style="width: 24%;">Procedimiento Técnico Homologado</th>
                <th style="width: 16%;">Herramientas e Insumos</th>
                <th style="width: 6%;">T. Est.</th>
                <th style="width: 6%;">Firma</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <!-- Observaciones y Hallazgos -->
          <div class="obs-box">
            <strong>OBSERVACIONES TÉCNICAS / HALLAZGOS Y REPUESTOS CONSUMIDOS:</strong>
            <p>${observationsSummary}</p>
          </div>

          <!-- Firmas de Validación -->
          <div class="firmas-row">
            <div class="firma-col">
              <div class="linea"></div>
              <strong>Técnico de Mantenimiento</strong>
              <span>Ejecutado conforme a procedimiento técnico</span>
            </div>
            <div class="firma-col">
              <div class="linea"></div>
              <strong>Supervisor de Calidad / Mantenimiento</strong>
              <span>Inspeccionado y liberado bajo norma ISO 9001</span>
            </div>
            <div class="firma-col">
              <div class="linea"></div>
              <strong>Jefe de Planta / Operaciones</strong>
              <span>Conforme y recepción para producción</span>
            </div>
          </div>

          <!-- Pie de Página -->
          <div class="carta-footer">
            SGMI Planta • Sistema elaborado por el Ingeniero Sanchez Danny • Formato Oficial Tamaño Carta F-MT-01 • ISO 9001:2015
          </div>
        </div>
      `;
    })
    .join('');

  const fullHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Hojas Carta F-MT-01 - PDF | Ing. Sanchez Danny</title>
      <style>
        @page {
          size: letter portrait;
          margin: 8mm 10mm;
        }
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        body {
          background-color: #fff;
          color: #0f172a;
          font-size: 9px;
          line-height: 1.3;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .hoja-carta {
          border: 2px solid #0f172a;
          padding: 10px;
          margin-bottom: 20px;
          page-break-after: always;
          min-height: 250mm;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #fff;
        }
        .hoja-carta:last-child {
          page-break-after: auto;
        }
        .carta-header {
          display: flex;
          border-bottom: 2px solid #0f172a;
          padding-bottom: 6px;
          margin-bottom: 6px;
          align-items: center;
        }
        .logo-box {
          width: 50px;
          height: 50px;
          border: 2px solid #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          background: #e0f2fe;
          color: #0369a1;
          margin-right: 10px;
          border-radius: 4px;
        }
        .header-center {
          flex: 1;
          text-align: center;
        }
        .header-center h2 {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: #0f172a;
        }
        .header-center h3 {
          font-size: 9.5px;
          font-weight: 700;
          color: #0284c7;
          margin: 2px 0;
        }
        .header-center p {
          font-size: 8px;
          color: #475569;
        }
        .header-center .author {
          font-size: 8.5px;
          font-weight: 700;
          color: #b45309;
          margin-top: 2px;
        }
        .header-right {
          width: 130px;
          font-size: 8px;
          text-align: right;
          border-left: 1px solid #cbd5e1;
          padding-left: 8px;
          line-height: 1.4;
        }
        .header-right strong {
          color: #0f172a;
        }
        .meta-strip {
          display: flex;
          justify-content: space-between;
          background: #f1f5f9;
          padding: 4px 8px;
          border: 1px solid #cbd5e1;
          margin-bottom: 8px;
          font-size: 8.5px;
        }
        .meta-strip span {
          color: #64748b;
        }
        .carta-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 8px;
          font-size: 8px;
        }
        .carta-table th {
          background: #0f172a;
          color: #fff;
          border: 1px solid #0f172a;
          padding: 4px;
          font-size: 7.5px;
          text-transform: uppercase;
          text-align: left;
        }
        .carta-table td {
          border: 1px solid #cbd5e1;
          padding: 4px;
          vertical-align: top;
        }
        .carta-table tr:nth-child(even) {
          background: #f8fafc;
        }
        .obs-box {
          border: 1px solid #0f172a;
          padding: 6px 8px;
          margin-bottom: 10px;
          min-height: 40px;
          background: #fcfcfc;
        }
        .obs-box strong {
          display: block;
          font-size: 8px;
          color: #0f172a;
          margin-bottom: 2px;
        }
        .obs-box p {
          font-size: 8px;
          color: #334155;
        }
        .firmas-row {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          margin-top: 10px;
          page-break-inside: avoid;
        }
        .firma-col {
          flex: 1;
          text-align: center;
        }
        .firma-col .linea {
          border-top: 1.5px solid #0f172a;
          margin-bottom: 4px;
        }
        .firma-col strong {
          display: block;
          font-size: 8px;
          color: #0f172a;
        }
        .firma-col span {
          font-size: 7.5px;
          color: #64748b;
        }
        .carta-footer {
          margin-top: 8px;
          padding-top: 4px;
          border-top: 1px dashed #cbd5e1;
          text-align: center;
          font-size: 7.5px;
          color: #64748b;
        }
        @media print {
          body {
            padding: 0;
            background: none;
          }
          .hoja-carta {
            box-shadow: none;
            border: 2px solid #000;
          }
        }
      </style>
    </head>
    <body>
      ${sheetsHtml}
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(fullHtml);
  printWindow.document.close();
}
