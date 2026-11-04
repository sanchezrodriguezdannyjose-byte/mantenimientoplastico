import React, { useState } from 'react';
import { useMaintenance } from '../context/MaintenanceContext';
import {
  ChevronDown,
  ChevronUp,
  Wrench,
  Droplet,
  Wind,
  Zap,
  Cpu,
  ShieldCheck,
  Snowflake,
  Fan,
  Flame,
  Plus
} from 'lucide-react';

interface PlanesViewProps {
  onOpenNewOtForTemplate: (title: string, system: string) => void;
}

export const PlanesView: React.FC<PlanesViewProps> = ({ onOpenNewOtForTemplate }) => {
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    'mecanico': true,
    'hidraulico': true,
    'chiller': true,
    'compresor': true,
    'planta': true
  });

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sections = [
    {
      id: 'mecanico',
      title: '1. Sistema Mecánico (Husillo, Unidad de Cierre, Rodillera y Eyección)',
      icon: <Wrench className="w-5 h-5 text-blue-400" />,
      items: [
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Verificar paralelismo de platos (desviación máx 0.1 mm con comparador de carátula en 4 esquinas).', tools: 'Comparador de carátula, base magnética, galgas.', criteria: 'Desviación < 0.1 mm. Ajuste de tuercas si excede.' },
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Medir holgura radial/axial de la rodillera (Toggle) e inyectar grasa EP-2 en pasadores.', tools: 'Pistola de engrase neumática, grasa EP-2, calibre.', criteria: 'Sin juego axial visible; expulsión de grasa vieja.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Revisar desgaste de husillo y camisa bimetálica (medir diámetro interno/externo con micrómetro).', tools: 'Micrómetro interior/exterior, linterna LED.', criteria: 'Desgaste < 0.20 mm respecto a cota nominal de fábrica.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Inspeccionar guías y placa expulsora de moldes y resortes de retorno de eyección.', tools: 'Llaves Allen, calibre, lubricante blanco.', criteria: 'Retorno instantáneo al 100% sin roce metálico.' },
        { freq: 'Semestral', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Tensión y alineación de correas/fajas de transmisión principal de bomba y extrusora.', tools: 'Tensiómetro de frecuencia / regla de deflexión.', criteria: 'Deflexión de 10 mm al centro bajo carga nominal.' }
      ]
    },
    {
      id: 'hidraulico',
      title: '2. Sistema Hidráulico (Bombas Proporcionales, Válvulas, Filtros y Aceite)',
      icon: <Droplet className="w-5 h-5 text-rose-400" />,
      items: [
        { freq: 'Diario', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Verificar nivel de aceite en mirilla con cilindros retraídos y monitorear temperatura del tanque.', tools: 'Inspección visual, pirómetro infrarrojo.', criteria: 'Nivel en tercio superior. Temperatura entre 40°C y 52°C.' },
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Reemplazar filtros de retorno de 10 micras o según manómetro de saturación diferencial.', tools: 'Filtros nuevos, llave de cinta, bandeja.', criteria: 'Indicador en zona verde; sello de vitón lubricado.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Limpiar haz tubular del intercambiador de calor agua/aceite (enfriador).', tools: 'Desengrasante, solución ácida suave, cepillo.', criteria: 'Diferencial térmico eficiente; aceite < 50°C a plena carga.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Inspección minuciosa de mangueras de alta presión, retenes de vástago y racores.', tools: 'Paño absorbente, llave dinamométrica.', criteria: 'Cero exudaciones ni gotas en piso o bancada.' },
        { freq: 'Anual', badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', task: 'Análisis de laboratorio de aceite hidráulico (viscosidad cSt, conteo de partículas ISO 4406, agua ppm).', tools: 'Kit de muestreo en botella sellada.', criteria: 'Código de limpieza ISO 18/16/13; agua < 200 ppm.' }
      ]
    },
    {
      id: 'neumatico',
      title: '3. Sistema Neumático (Unidades FRL, Reguladores, Cilindros y Electroválvulas)',
      icon: <Wind className="w-5 h-5 text-cyan-400" />,
      items: [
        { freq: 'Diario', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Purgar condensado de agua en la taza de los filtros reguladores (FRL).', tools: 'Válvula manual de purga.', criteria: 'Taza de filtro transparente sin restos de agua ni aceite.' },
        { freq: 'Diario', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Verificar presión de aire de trabajo en manómetro regulador principal (6.0 - 7.5 bar).', tools: 'Manómetro calibrado de glicerina.', criteria: 'Presión constante sin caídas bruscas durante soplado.' },
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Verificar nivel de aceite lubricador neumático ISO VG 32 y lubricar cilindros de eyección.', tools: 'Aceite ISO VG 32 grado neumático.', criteria: 'Goteo de 1 gota cada 10 ciclos en el visor.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Mantenimiento de electroválvulas de soplado (limpieza de bobinas, cambio de silenciadores).', tools: 'Limpiador de contactos dieléctrico, multímetro.', criteria: 'Conmutación instantánea < 30 ms sin zumbidos.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Detección ultrasónica o con agua jabonosa de fugas en red neumática interna de la máquina.', tools: 'Detector acústico ultrasónico o atomizador jabón.', criteria: 'Cero fugas en racores y mangueras de poliuretano.' }
      ]
    },
    {
      id: 'electrico',
      title: '4. Sistema Eléctrico de Potencia (Tableros, Contactores, Resistencias Calefactoras)',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      items: [
        { freq: 'Diario', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Inspección visual de terminales de resistencias de barril y cableado de alta temperatura.', tools: 'Visual, pirómetro infrarrojo.', criteria: 'Cero olor a quemado ni cables pelados o recalentados.' },
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Reapriete de borneras y tornillos de potencia en tablero principal con torquímetro aislado.', tools: 'Destornilladores 1000V dinamométricos.', criteria: 'Tornillos al torque del fabricante (1.5 - 2.5 Nm).' },
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Limpieza de contactores, arrancadores suaves y relés con aire seco libre de humedad.', tools: 'Aire comprimido seco a 2 bar, brocha electrostática.', criteria: 'Sin depósitos de polvillo aislante ni restos de resina.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Barrido termográfico con cámara infrarroja bajo carga máxima de inyección/extrusión.', tools: 'Cámara termográfica FLIR calibrada.', criteria: 'ΔT entre fases y bornes < 10 °C. Cero puntos calientes.' },
        { freq: 'Semestral', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Prueba de resistencia de aislamiento de devanados de motores eléctricos (Megger 1000V).', tools: 'Megóhmetro Fluke 1000V DC.', criteria: 'Resistencia de aislamiento > 100 Megaohmios.' }
      ]
    },
    {
      id: 'electronica',
      title: '5. Electrónica, PLC, Pantallas HMI y Sensores de Proceso',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      items: [
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Calibración de pirómetros y termopares tipo J/K en cilindro, boquilla y zonas de molde.', tools: 'Calibrador de procesos multifunción patrón.', criteria: 'Desviación térmica inferior a ± 1.0 °C en todo el rango.' },
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Respaldo digital completo (Backup) de recetas de moldeo y software del PLC/HMI.', tools: 'Memoria USB industrial / Laptop de ingeniería.', criteria: 'Archivo .bak generado y verificado en servidor.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Limpieza y alineación de reglas ópticas (transductores lineales) y encoders angulares.', tools: 'Paño microfibra, limpiador dieléctrico sin residuo.', criteria: 'Lectura milimétrica precisa y repetible al 100%.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Inspección de disipadores y ventiladores de enfriamiento de servodrives y variadores.', tools: 'Aspiradora antiestática, brocha suave.', criteria: 'Disipadores sin polvo; temperatura de módulo < 60°C.' },
        { freq: 'Semestral', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Diagnóstico de redes industriales (Ethernet Industrial, CANopen, Profinet) y cableado.', tools: 'Analizador de red / comprobador de cables CAT6.', criteria: 'Cero tramas descartadas o errores de timeout en HMI.' }
      ]
    },
    {
      id: 'seguridad',
      title: '6. Seguridad Ocupacional, Interbloqueos y Protección Ambiental',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      items: [
        { freq: 'Diario', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Prueba funcional de paradas de emergencia (setas rojas) y cortina óptica de molde.', tools: 'Activación manual por turno.', criteria: 'Detención instantánea de bomba y apertura inmediata.' },
        { freq: 'Diario', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Verificación de microinterruptores de puerta delantera y trasera de seguridad.', tools: 'Apertura física de puerta.', criteria: 'La máquina imposibilita cualquier movimiento de cierre.' },
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Inspección de extintores de CO2/PQS y bandejas de retención de fugas de aceite.', tools: 'Checklist de seguridad industrial.', criteria: 'Manómetro en verde, precintos intactos y fecha vigente.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Auditoría de uso de EPP para montaje (calzado con puntera, guantes térmicos, careta).', tools: 'Formulario de auditoría interna ISO 45001.', criteria: '100% de cumplimiento en operarios y técnicos.' }
      ]
    },
    {
      id: 'chiller',
      title: '7. Chiller Central (Agua de Proceso para Enfriamiento de Moldes e Hidráulica)',
      icon: <Snowflake className="w-5 h-5 text-cyan-400" />,
      items: [
        { freq: 'Diario', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Registrar temperatura de suministro (ida) y retorno del agua fría de proceso.', tools: 'Termómetro digital / panel del Chiller.', criteria: 'Agua suministrada a 10 °C - 12 °C con ΔT de 3 a 5 °C.' },
        { freq: 'Diario', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Monitorear presiones de succión y descarga del compresor de refrigeración.', tools: 'Manómetros de alta/baja en cabina del chiller.', criteria: 'Dentro de envolvente de operación del gas (ej. R-410A).' },
        { freq: 'Semanal', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Limpiar aletas del serpentín condensador con aire comprimido a baja presión y cepillo suave.', tools: 'Aire seco, cepillo plástico para serpentines.', criteria: 'Libre de pelusas y polvo que bloqueen el flujo de aire.' },
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Desmontar y limpiar filtro colador en Y en la entrada de agua al evaporador.', tools: 'Llave francesa, cepillo de cerdas duras.', criteria: 'Malla metálica sin residuos de sarro ni óxido.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Inspección de fugas de gas refrigerante en bridas, soldaduras y válvulas de servicio.', tools: 'Detector electrónico ultrasónico de refrigerantes.', criteria: 'Cero fugas detectables; mirilla de gas en color verde.' },
        { freq: 'Semestral', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Lavado químico de tubos del evaporador con solución desincrustante biodegradable.', tools: 'Bomba de recirculación química, ácido cítrico.', criteria: 'Transferencia térmica óptima sin sarro acumulado.' },
        { freq: 'Anual', badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', task: 'Cambio de aceite sintético POE del compresor de refrigeración y análisis de acidez.', tools: 'Bomba de carga de aceite, kit de prueba de acidez.', criteria: 'Aceite neutro sin partículas de desgaste metálico.' }
      ]
    },
    {
      id: 'compresor',
      title: '8. Compresor de Aire de Tornillo y Pulmón de Almacenamiento Principal',
      icon: <Fan className="w-5 h-5 text-blue-400" />,
      items: [
        { freq: 'Diario', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Drenar condensados acumulados en el tanque pulmón principal y verificar purgas automáticas.', tools: 'Válvula de purga manual inferior.', criteria: 'Cero agua retenida; purga electrónica disparando a tiempo.' },
        { freq: 'Diario', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Verificar presión en red (> 7.0 bar) y nivel de aceite del compresor en mirilla bajo carga.', tools: 'Manómetro principal, visor de vidrio.', criteria: 'Presión entre 7.0 y 7.8 bar; aceite en nivel verde.' },
        { freq: 'Semanal', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Recorrido por la red neumática de nave verificando ausencia de soplidos o fugas.', tools: 'Audición / detector ultrasónico.', criteria: 'Cero fugas audibles en toda la tubería troncal.' },
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Limpieza o sustitución del cartucho de filtro de admisión de aire del compresor.', tools: 'Aspiradora industrial, cartucho nuevo si amerita.', criteria: 'Pérdida de carga en admisión < 20 mbar.' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Inspeccionar secador frigorífico y verificar punto de rocío a presión (PDP < 3 °C).', tools: 'Sensor de humedad / pantalla del secador.', criteria: 'Aire de descarga 100% seco sin condensados arrastrados.' },
        { freq: 'Semestral', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Cambio de filtro de aceite y filtro separador aire/aceite del compresor.', tools: 'Filtros nuevos, llave de banda, torquímetro.', criteria: 'Diferencial de presión del separador < 0.2 bar.' },
        { freq: 'Anual', badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', task: 'Reemplazo total de fluido refrigerante sintético del tornillo y prueba de temperatura.', tools: 'Aceite sintético para compresor (ej. Roto-Inject).', criteria: 'Temperatura de tornillo estabilizada en 82°C.' }
      ]
    },
    {
      id: 'planta',
      title: '9. Planta Eléctrica de Emergencia (Generador Diésel y Tablero ATS)',
      icon: <Flame className="w-5 h-5 text-rose-400" />,
      items: [
        { freq: 'Semanal', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Arranque manual de prueba en vacío por 10 minutos y registro de voltaje y frecuencia.', tools: 'Multímetro TRMS, panel Deep Sea del generador.', criteria: 'Voltaje 220V/380V y 60.0 Hz estables; sin fugas.' },
        { freq: 'Semanal', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Verificar nivel de aceite de motor diésel y refrigerante en radiador/depósito.', tools: 'Varilla de nivel, visor de refrigerante.', criteria: 'Aceite en marca MAX; refrigerante a nivel correcto.' },
        { freq: 'Semanal', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Comprobar nivel de combustible diésel en el tanque diario (mínimo 75% de capacidad).', tools: 'Medidor de nivel mecánico/eléctrico.', criteria: 'Tanque > 75% para garantizar al menos 12h de respaldo.' },
        { freq: 'Mensual', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', task: 'Limpieza y desulfatación de bornes de batería de arranque y prueba de tensión de flote.', tools: 'Multímetro, cepillo de cobre, vaselina.', criteria: 'Voltaje de batería en reposo > 12.6V (13.6V en carga).' },
        { freq: 'Trimestral', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30', task: 'Prueba de simulación de corte de red y conmutación automática del tablero ATS.', tools: 'Selector de prueba de transferencia con carga.', criteria: 'Arranque y transferencia a planta en menos de 10 segundos.' },
        { freq: 'Semestral', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', task: 'Cambio de aceite de motor diésel 15W40 y sustitución de filtros de aceite y diésel.', tools: 'Aceite 15W40 API CK-4, filtros de combustible/aceite.', criteria: 'Aceite limpio, cebado sin burbujas en inyectores.' },
        { freq: 'Anual', badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30', task: 'Prueba de carga al 100% con banco de carga resistivo durante 2 horas continuas.', tools: 'Banco de carga resistivo calibrado.', criteria: 'Soporte de potencia sin caídas de frecuencia ni sobrecalentamiento.' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-[#151c2c] border border-slate-800">
        <h2 className="text-base font-bold text-white tracking-wide uppercase flex items-center gap-2">
          <Wrench className="w-5 h-5 text-cyan-400" />
          Plan de Mantenimiento Preventivo Integral (Máquinas y Auxiliares)
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Despliega cada especialidad técnica para auditar los procedimientos, herramientas, criterios de aceptación y frecuencias normadas. Puedes programar una Orden de Trabajo vinculada directamente desde cada fila.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map(sec => {
          const isOpen = !!openAccordions[sec.id];
          return (
            <div
              key={sec.id}
              className="rounded-2xl bg-[#151c2c] border border-slate-800 overflow-hidden shadow-lg transition-all"
            >
              <button
                onClick={() => toggleAccordion(sec.id)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                    {sec.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white tracking-wide">{sec.title}</h3>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-950/40 overflow-x-auto">
                  <table className="w-full text-xs text-left min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase text-[11px] font-semibold">
                        <th className="pb-3 w-28">Frecuencia</th>
                        <th className="pb-3">Componente / Tarea Específica</th>
                        <th className="pb-3 w-48">Herramienta / Insumo</th>
                        <th className="pb-3 w-48">Criterio de Aceptación</th>
                        <th className="pb-3 w-28 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {sec.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3 pr-2">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${it.badge}`}>
                              {it.freq}
                            </span>
                          </td>
                          <td className="py-3 pr-3 font-medium text-slate-200">
                            {it.task}
                          </td>
                          <td className="py-3 pr-3 text-slate-400">
                            {it.tools}
                          </td>
                          <td className="py-3 pr-3 text-cyan-300/90 font-mono text-[11px]">
                            {it.criteria}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => onOpenNewOtForTemplate(it.task, sec.title.split(' ')[1] || 'Mecánico')}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-slate-950 text-cyan-400 font-bold text-[11px] transition-colors inline-flex items-center gap-1 shrink-0"
                              title="Generar OT para esta tarea"
                            >
                              <Plus className="w-3 h-3" /> OT
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
