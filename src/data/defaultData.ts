import { Equipment, PlanTemplate, InventoryItem, FailureIncident, WorkOrder, MoldMountingRecord } from '../types';

export const initialEquipments: Equipment[] = [
  {
    id: 'eq-iny-01',
    tag: 'INY-01',
    name: 'Inyectora Haitian Mars II 250T',
    type: 'inyeccion',
    brand: 'Haitian',
    model: 'MA 2500 II / 1000',
    serialNumber: 'HT-2021-M250-994',
    location: 'Nave de Inyección - Bahía 1',
    status: 'operativo',
    currentHours: 8420,
    activeMoldId: 'eq-mld-02',
    lastMaintenanceDate: '2026-10-15',
    notes: 'Husillo de 55mm bimetálico. Servomotor de plastificación de alto torque.'
  },
  {
    id: 'eq-iny-02',
    tag: 'INY-02',
    name: 'Inyectora Engel Victory 180T',
    type: 'inyeccion',
    brand: 'Engel',
    model: 'VC 500/180 Tech',
    serialNumber: 'ENG-2019-180-412',
    location: 'Nave de Inyección - Bahía 2',
    status: 'operativo',
    currentHours: 11250,
    activeMoldId: 'eq-mld-03',
    lastMaintenanceDate: '2026-10-20',
    notes: 'Sistema Tie-bar-less (sin columnas). Control CC300.'
  },
  {
    id: 'eq-sop-01',
    tag: 'SOP-01',
    name: 'Sopladora Bekum H-121 Extrusión',
    type: 'soplado',
    brand: 'Bekum',
    model: 'H-121 D',
    serialNumber: 'BKM-2020-8812',
    location: 'Nave de Soplado - Bahía 1',
    status: 'operativo',
    currentHours: 9150,
    activeMoldId: 'eq-mld-01',
    lastMaintenanceDate: '2026-10-18',
    notes: 'Cabezal continuo para envases de 1L a 5L. Programador de parison 100 puntos.'
  },
  {
    id: 'eq-sop-02',
    tag: 'SOP-02',
    name: 'Sopladora Uniloy Milacron UMR 2000',
    type: 'soplado',
    brand: 'Uniloy',
    model: 'UMR-2000 Pro',
    serialNumber: 'UNI-2018-7731',
    location: 'Nave de Soplado - Bahía 2',
    status: 'en_mantenimiento',
    currentHours: 14200,
    lastMaintenanceDate: '2026-10-05',
    notes: 'En rutina de ajuste de rodilleras de cierre.'
  },
  {
    id: 'eq-chl-01',
    tag: 'CHL-01',
    name: 'Chiller Central Frick 30 TR',
    type: 'chiller',
    brand: 'Frick / York',
    model: 'YCAL-0033EC',
    serialNumber: 'FRK-2022-030-TR',
    location: 'Cuarto Frío Auxiliares',
    status: 'operativo',
    currentHours: 16800,
    lastMaintenanceDate: '2026-10-25',
    notes: 'Refrigerante R-410A. Setpoint de suministro de agua: 10 °C.'
  },
  {
    id: 'eq-cmp-01',
    tag: 'CMP-01',
    name: 'Compresor Tornillo Atlas Copco 50 HP',
    type: 'compresor',
    brand: 'Atlas Copco',
    model: 'GA 37 VSD+ FF',
    serialNumber: 'ATC-2021-GA37-551',
    location: 'Cuarto de Compresores',
    status: 'operativo',
    currentHours: 12400,
    lastMaintenanceDate: '2026-10-10',
    notes: 'Velocidad variable con secador frigorífico integrado. Presión red: 7.5 bar.'
  },
  {
    id: 'eq-gen-01',
    tag: 'GEN-01',
    name: 'Planta Eléctrica Diésel Cummins 250 kVA',
    type: 'planta',
    brand: 'Cummins Power',
    model: 'C250 D5e / QSB6.7',
    serialNumber: 'CUM-2020-250KVA-198',
    location: 'Caseta de Generación Exterior',
    status: 'operativo',
    currentHours: 520,
    lastMaintenanceDate: '2026-10-28',
    notes: 'Tablero de transferencia automática (ATS). Tanque base de 500 litros.'
  },
  {
    id: 'eq-mld-01',
    tag: 'MLD-01',
    name: 'Molde Botella 1 Litro PEAD (2 Cavidades)',
    type: 'molde',
    brand: 'TecnoMoldes',
    model: 'BOT-1000-PE',
    serialNumber: 'MLD-B1L-04',
    location: 'Montado en SOP-01',
    status: 'operativo',
    currentHours: 145000, // cycles
    maxCyclesBeforeOverhaul: 200000,
    mountedOnMachineId: 'eq-sop-01',
    lastMaintenanceDate: '2026-10-12',
    notes: 'Material de cavidad: Cobre-Berilio en zonas de corte. Refrigeración optimizada.'
  },
  {
    id: 'eq-mld-02',
    tag: 'MLD-02',
    name: 'Molde Tapa Rosca 28mm PCO 1881 (8 Cav)',
    type: 'molde',
    brand: 'Husky / Mold-Masters',
    model: 'TAP-28-8C-HR',
    serialNumber: 'MLD-T28-09',
    location: 'Montado en INY-01',
    status: 'operativo',
    currentHours: 320000, // cycles
    maxCyclesBeforeOverhaul: 500000,
    mountedOnMachineId: 'eq-iny-01',
    lastMaintenanceDate: '2026-10-15',
    notes: 'Sistema de canal caliente (Hot Runner) 8 boquillas valvuladas. Acero Stavax ESR.'
  },
  {
    id: 'eq-mld-03',
    tag: 'MLD-03',
    name: 'Molde Cubeta 4L Industrial con Asa (1 Cav)',
    type: 'molde',
    brand: 'EuroMoldes',
    model: 'CUB-4L-PP',
    serialNumber: 'MLD-C4L-02',
    location: 'Montado en INY-02',
    status: 'operativo',
    currentHours: 85000,
    maxCyclesBeforeOverhaul: 150000,
    mountedOnMachineId: 'eq-iny-02',
    lastMaintenanceDate: '2026-10-01',
    notes: 'Eyección combinada aire + pines mecánicos. Sistema de correderas para asa.'
  }
];

export const initialPlanTemplates: PlanTemplate[] = [
  {
    id: 'pm-mec-mensual',
    system: 'Mecánico',
    titulo: 'Verificación Mecánica, Rodillera y Lubricación',
    frecuencia: 'Mensual',
    tiempo: '1.5 Horas',
    icono: 'fa-gear',
    color: 'blue',
    herramientas: ['Llave Allen métrica', 'Pistola de engrase neumática', 'Comparador de carátula', 'Torquímetro 40-200 Nm', 'Linterna LED'],
    insumos: ['Grasa EP-2 Base Litio (Cartucho)', 'Paños industriales absorbentes', 'Solvente desengrasante'],
    repuestos: ['Bujes de bronce rodillera', 'Sellos rascadores de columna'],
    pasos: [
      'Aplicar protocolo de Bloqueo y Etiquetado (LOTO) en seccionador principal.',
      'Limpiar minuciosamente pasadores, rodilleras y columnas de cierre.',
      'Inyectar grasa de alta presión EP-2 en las graseras de la rodillera hasta purga de grasa vieja.',
      'Montar base magnética y verificar paralelismo entre plato fijo y móvil (desviación máx 0.1 mm).',
      'Verificar holgura axial y radial en pasadores y bujes de rodillera.',
      'Comprobar torque de fijación en tuercas de columnas y bancada.',
      'Retirar candado LOTO y probar movimiento de apertura/cierre en vacío a baja velocidad.'
    ],
    criterioAceptacion: 'Desviación de paralelismo < 0.1 mm en 4 esquinas; cero ruidos ni juego en rodillera.',
    applicableEquipmentTypes: ['inyeccion', 'soplado']
  },
  {
    id: 'pm-hid-mensual',
    system: 'Hidráulico',
    titulo: 'Inspección del Sistema Hidráulico y Filtración',
    frecuencia: 'Mensual',
    tiempo: '1.0 Hora',
    icono: 'fa-tint',
    color: 'red',
    herramientas: ['Llave de banda para filtros', 'Bandeja colectora de fluidos', 'Manómetro digital', 'Termómetro infrarrojo'],
    insumos: ['Aceite hidráulico ISO VG 46 (relleno)', 'Paños absorbentes para hidrocarburos'],
    repuestos: ['Elemento filtrante de retorno', 'Filtro respirador desecante de aire'],
    pasos: [
      'Verificar nivel en mirilla con máquina apagada y cilindros retraídos.',
      'Medir temperatura de operación del tanque (debe mantenerse entre 40°C y 52°C).',
      'Inspeccionar indicador de saturación del filtro de retorno (reemplazar si está en zona roja).',
      'Revisar mangueras de alta presión y racores buscando exudaciones o rozamiento.',
      'Limpiar el haz tubular del intercambiador de calor de agua/aceite.',
      'Poner en marcha bomba y chequear presión de alivio principal con manómetro patrón.'
    ],
    criterioAceptacion: 'Nivel óptimo; temperatura < 55°C; filtro nuevo con indicador en verde; cero fugas.',
    applicableEquipmentTypes: ['inyeccion', 'soplado']
  },
  {
    id: 'pm-ele-trimestral',
    system: 'Eléctrico',
    titulo: 'Inspección Eléctrica, Termografía y Reapriete',
    frecuencia: 'Trimestral',
    tiempo: '2.0 Horas',
    icono: 'fa-bolt',
    color: 'amber',
    herramientas: ['Cámara termográfica FLIR', 'Multímetro TRMS', 'Megóhmetro 1000V', 'Destornilladores dinamométricos aislados 1000V'],
    insumos: ['Limpiador dieléctrico de contactos spray', 'Aire comprimido seco libre de humedad'],
    repuestos: ['Contactores tripolares 32A', 'Resistencias tipo banda calefactora', 'Fusibles ultrarrápidos'],
    pasos: [
      'Con el tablero bajo carga normal de producción, realizar barrido termográfico completo.',
      'Detectar si existe algún diferencial de temperatura (ΔT > 10°C) entre fases o bornes.',
      'Desconectar y aplicar LOTO eléctrico.',
      'Soplar suavemente el polvo del tablero con aire comprimido seco y brocha antiestática.',
      'Efectuar reapriete con torque de calibración en todos los contactores, guardamotores y borneras.',
      'Verificar resistencia de aislamiento de los devanados del motor con megóhmetro (> 100 MΩ).',
      'Comprobar consumo en amperes de las resistencias calefactoras del cilindro y cabezal.'
    ],
    criterioAceptacion: 'ΔT < 10°C; terminales apretados; aislamiento de motor > 100 MΩ; resistencias sin corte.',
    applicableEquipmentTypes: ['inyeccion', 'soplado', 'chiller', 'compresor', 'planta']
  },
  {
    id: 'pm-neu-semanal',
    system: 'Neumático',
    titulo: 'Rutina Neumática, FRL y Detección de Fugas',
    frecuencia: 'Semanal',
    tiempo: '30 Minutos',
    icono: 'fa-wind',
    color: 'cyan',
    herramientas: ['Detector de fugas ultrasónico o agua jabonosa', 'Destornillador plano', 'Manómetro de prueba'],
    insumos: ['Aceite neumático ISO VG 32', 'Cinta teflón para conexiones neumáticas'],
    repuestos: ['Manguera de poliuretano (PU) 8mm y 10mm', 'Racores instantáneos rectos y en codo'],
    pasos: [
      'Drenar manualmente el condensado acumulado en la taza del filtro de la unidad FRL.',
      'Comprobar que el regulador mantenga la presión estable en 6.0 a 7.0 bar.',
      'Verificar nivel de aceite lubricador neumático y rellenar si está debajo del 25%.',
      'Inspeccionar mangueras flexibles de alimentación a eyectores neumáticos y válvulas de soplado.',
      'Aplicar solución jabonosa o detector ultrasónico en racores para localizar fugas activas.',
      'Limpiar silenciadores de escape de las electroválvulas para evitar contrapresiones.'
    ],
    criterioAceptacion: 'Presión en 6.5 bar; cero fugas audibles; drenaje limpio y nivel de lubricador correcto.',
    applicableEquipmentTypes: ['inyeccion', 'soplado', 'compresor']
  },
  {
    id: 'pm-seg-diario',
    system: 'Seguridad y Medio Ambiente',
    titulo: 'Verificación Diaria de Paros de Emergencia y Seguros',
    frecuencia: 'Diario',
    tiempo: '15 Minutos',
    icono: 'fa-shield-halved',
    color: 'emerald',
    herramientas: ['Pulsador manual', 'Linterna'],
    insumos: ['Paño de microfibra'],
    repuestos: [],
    pasos: [
      'Probar la respuesta inmediata de cada pulsador de paro de emergencia (seta roja).',
      'Verificar que al abrir la puerta de seguridad del molde la máquina desenergice la bomba y cierre.',
      'Comprobar la integridad de la cortina fotoeléctrica de seguridad (si aplica).',
      'Verificar que los seguros mecánicos de caída de plato se enclaven correctamente.',
      'Inspeccionar estado de extintores y kit antiderrames en la cercanía de la máquina.'
    ],
    criterioAceptacion: 'Detención inmediata en todos los dispositivos de parada de seguridad; 100% operativo.',
    applicableEquipmentTypes: ['inyeccion', 'soplado']
  },
  {
    id: 'pm-aut-semestral',
    system: 'Automatización y Electrónica',
    titulo: 'Calibración de Termopares, Backup de PLC y Limpieza',
    frecuencia: 'Semanal',
    tiempo: '2.5 Horas',
    icono: 'fa-microchip',
    color: 'purple',
    herramientas: ['Calibrador de procesos multifunción', 'Laptop con software de PLC y cable de comunicación', 'Paño microfibra antiestático'],
    insumos: ['Limpiador dieléctrico', 'Pasta térmica de silicona'],
    repuestos: ['Termopares tipo J baipás', 'Sensor inductivo PNP M12', 'Relé de estado sólido'],
    pasos: [
      'Conectar laptop y realizar respaldo completo (Backup) de receta y programa del PLC y pantalla HMI.',
      'Calibrar cada canal de lectura de temperatura del cilindro y molde comparando con termopar patrón.',
      'Ajustar offset de temperatura en el controlador si la desviación supera ± 1.0 °C.',
      'Limpiar con microfibra y limpiador dieléctrico los disipadores de calor de los variadores de frecuencia.',
      'Verificar la fijación y distancia de conmutación de sensores inductivos de posición de cierre y eyección.',
      'Revisar las baterías internas de respaldo del PLC (reemplazar si el led de batería baja titila).'
    ],
    criterioAceptacion: 'Error de pirómetro < ± 1.0 °C; respaldo de software guardado; HMI sin errores de red.',
    applicableEquipmentTypes: ['inyeccion', 'soplado']
  },
  {
    id: 'pm-chl-diario',
    system: 'Chiller',
    titulo: 'Monitoreo Operativo Diario de Chiller Central',
    frecuencia: 'Diario',
    tiempo: '20 Minutos',
    icono: 'fa-snowflake',
    color: 'cyan',
    herramientas: ['Termómetro infrarrojo', 'Manómetros de refrigeración'],
    insumos: ['Hoja de registro de parámetros'],
    repuestos: [],
    pasos: [
      'Registrar temperatura de suministro de agua fría hacia moldes (Target: 10°C - 12°C).',
      'Registrar temperatura de retorno del agua desde moldes (Diferencial térmico ΔT esperado: 3°C a 5°C).',
      'Verificar presiones de succión y descarga en el panel del chiller según el gas refrigerante.',
      'Comprobar nivel de agua y glicol en el tanque pulmón del circuito cerrado.',
      'Comprobar que no existan ruidos de cavitación en la bomba de recirculación.'
    ],
    criterioAceptacion: 'Agua suministrada a 10°C ± 1°C; presiones de compresor dentro de curva; cero cavitación.',
    applicableEquipmentTypes: ['chiller']
  },
  {
    id: 'pm-chl-semanal',
    system: 'Chiller',
    titulo: 'Limpieza de Condensador y Serpentín de Chiller',
    frecuencia: 'Semanal',
    tiempo: '45 Minutos',
    icono: 'fa-broom',
    color: 'cyan',
    herramientas: ['Aire comprimido a baja presión', 'Cepillo de cerdas suaves de plástico'],
    insumos: ['Solvente desengrasante para serpentines HVAC', 'Agua a presión moderada'],
    repuestos: [],
    pasos: [
      'Apagar el chiller desde el panel y esperar detención completa de ventiladores axiales.',
      'Soplar suavemente el polvo acumulado en las aletas del serpentín condensador desde el interior hacia afuera.',
      'Peinar aletas dobladas con peine de aletas para no estrangular el flujo de aire.',
      'Aplicar agua a presión suave con desengrasante y enjuagar sin deformar las aletas de aluminio.',
      'Revisar libre rotación y estado de cojinetes de los ventiladores de condensación.'
    ],
    criterioAceptacion: 'Serpentín 100% permeable al flujo de aire; aletas rectas y libres de obstrucciones.',
    applicableEquipmentTypes: ['chiller']
  },
  {
    id: 'pm-chl-trimestral',
    system: 'Chiller',
    titulo: 'Inspección de Carga de Gas, Fugas y Controles',
    frecuencia: 'Trimestral',
    tiempo: '2.0 Horas',
    icono: 'fa-magnifying-glass',
    color: 'cyan',
    herramientas: ['Detector electrónico de fugas halogenadas', 'Manifold digital con sondas de temperatura'],
    insumos: ['Gas refrigerante R-410A (si requiere compensación)'],
    repuestos: ['Núcleos de válvula Schrader', 'Filtro deshidratador de línea líquida'],
    pasos: [
      'Pasar sensor ultrasónico/electrónico por todas las soldaduras, bridas y prensaestopas del compresor.',
      'Medir recalentamiento (Superheat) y subenfriamiento (Subcooling) con el manifold.',
      'Verificar mirilla de líquido (debe verse burbuja cero y color verde indicador de humedad seca).',
      'Probar calibración y disparo de los presostatos de alta y baja presión.',
      'Limpiar el filtro colador tipo "Y" en la entrada del evaporador de placas.'
    ],
    criterioAceptacion: 'Cero fugas de gas; mirilla verde sin burbujas; presostatos disparando en punto exacto.',
    applicableEquipmentTypes: ['chiller']
  },
  {
    id: 'pm-cmp-diario',
    system: 'Compresor',
    titulo: 'Drenaje de Condensados y Parámetros de Compresor',
    frecuencia: 'Diario',
    tiempo: '15 Minutos',
    icono: 'fa-fan',
    color: 'blue',
    herramientas: ['Manómetro patrón', 'Linterna'],
    insumos: ['Paño de limpieza'],
    repuestos: [],
    pasos: [
      'Abrir purga manual del pulmón acumulador principal para desalojar agua y lodos.',
      'Comprobar funcionamiento de las purgas electrónicas capacitivas temporizadas.',
      'Verificar nivel de aceite sintético en la mirilla del separador mientras está en carga.',
      'Registrar temperatura del elemento de tornillo (nominal: 75°C a 88°C).',
      'Revisar punto de rocío del secador frigorífico integrado (< 3°C).'
    ],
    criterioAceptacion: 'Presión en red de 7.5 bar; cero condensado en tanque; temperatura de tornillo < 90°C.',
    applicableEquipmentTypes: ['compresor']
  },
  {
    id: 'pm-cmp-mensual',
    system: 'Compresor',
    titulo: 'Mantenimiento del Filtro de Admisión y Correas',
    frecuencia: 'Mensual',
    tiempo: '45 Minutos',
    icono: 'fa-filter',
    color: 'blue',
    herramientas: ['Aspiradora industrial', 'Pistola de soplado', 'Tensiómetro de correas'],
    insumos: ['Elemento filtrante de celulosa o sintético nuevo'],
    repuestos: ['Cartucho de filtro de aire de admisión'],
    pasos: [
      'Despresurizar el sistema antes de abrir la carcasa de admisión.',
      'Extraer cartucho de filtro de aire, inspeccionar estado y soplar a baja presión de adentro hacia afuera.',
      'Si presenta saturación o más de 1500 horas, sustituir por cartucho nuevo.',
      'Limpiar el interior de la caja porta-filtro con aspiradora.',
      'Revisar la tensión de la correa de transmisión y poleas si el modelo no es de acople directo.'
    ],
    criterioAceptacion: 'Cartucho limpio; caída de presión en admisión < 20 mbar; caja hermética.',
    applicableEquipmentTypes: ['compresor']
  },
  {
    id: 'pm-cmp-semestral',
    system: 'Compresor',
    titulo: 'Servicio Mayor de Lubricación y Filtro Separador',
    frecuencia: 'Semanal',
    tiempo: '3.0 Horas',
    icono: 'fa-oil-can',
    color: 'blue',
    herramientas: ['Llave de filtros de gran tamaño', 'Bomba manual de extracción de aceite', 'Torquímetro'],
    insumos: ['Aceite sintético para compresor de tornillo (ej. Roto-Inject Fluid)', 'Paños absorbentes'],
    repuestos: ['Cartucho filtro de aceite', 'Cartucho filtro separador aire/aceite'],
    pasos: [
      'Hacer funcionar el compresor hasta calentar el aceite para facilitar el drenaje.',
      'Detener, bloquear eléctricamente y verificar despresurización total del tanque separador.',
      'Drenar aceite usado a recipiente colector para reciclaje ambiental.',
      'Sustituir el filtro de aceite aplicando lubricación en la junta tórica.',
      'Desmontar y colocar nuevo cartucho filtro separador aire/aceite garantizando continuidad de puesta a tierra.',
      'Llenar con aceite nuevo sintético hasta el nivel máximo de la mirilla.',
      'Reconectar y probar durante 20 minutos revisando presión diferencial del separador.'
    ],
    criterioAceptacion: 'Separador nuevo; ΔP < 0.2 bar; aceite nuevo en marca máxima; sin fugas.',
    applicableEquipmentTypes: ['compresor']
  },
  {
    id: 'pm-gen-semanal',
    system: 'Planta Eléctrica',
    titulo: 'Prueba de Arranque en Vacío y Nivel de Diésel',
    frecuencia: 'Semanal',
    tiempo: '30 Minutos',
    icono: 'fa-charging-station',
    color: 'red',
    herramientas: ['Multímetro digital', 'Medidor de vara de combustible', 'Cronómetro'],
    insumos: ['Combustible diésel para reposición'],
    repuestos: [],
    pasos: [
      'Inspeccionar nivel de combustible diésel en tanque diario (debe ser mayor al 75%).',
      'Verificar nivel de aceite de motor en varilla (entre marcas ADD y FULL).',
      'Verificar nivel y estado del refrigerante en radiador y depósito de expansión.',
      'Verificar voltaje de batería en bornes con motor parado (> 12.6V en reposo, 13.6V con cargador flotante).',
      'Ejecutar arranque manual de prueba durante 10 minutos.',
      'Registrar voltaje entre fases (220V/380V), frecuencia (60 Hz ± 0.5Hz) y presión de aceite de motor (40-60 PSI).',
      'Detener generador y regresar selector del panel a modo "AUTO" para respuesta del ATS.'
    ],
    criterioAceptacion: 'Arranque en < 5 segundos; parámetros eléctricos estables; selector en AUTO.',
    applicableEquipmentTypes: ['planta']
  },
  {
    id: 'pm-gen-mensual',
    system: 'Planta Eléctrica',
    titulo: 'Mantenimiento de Batería, ATS y Calentador de Bloque',
    frecuencia: 'Mensual',
    tiempo: '1.5 Horas',
    icono: 'fa-car-battery',
    color: 'red',
    herramientas: ['Densímetro de batería o analizador de conductancia', 'Llaves de bornes', 'Termómetro'],
    insumos: ['Grasa vaselinada para bornes', 'Limpiador de contactos', 'Agua destilada'],
    repuestos: ['Batería de arranque 12V 100Ah (si la conductancia cae de 70%)'],
    pasos: [
      'Desconectar cargador de baterías y limpiar sulfatos de bornes con cepillo de alambre y bicarbonato.',
      'Aplicar vaselina protectora y reapretar terminales.',
      'Comprobar funcionamiento del calentador de camisas/bloque de motor (debe mantenerse tibio a 40°C).',
      'Simular fallo de red eléctrica en tablero de transferencia automática (ATS) para verificar conmutación.',
      'Cronometrar tiempo de transferencia (debe ser < 10 segundos).',
      'Restablecer red comercial y verificar retorno suave sin microcortes destructivos.'
    ],
    criterioAceptacion: 'Transferencia automática ejecutada en < 10 s; batería en óptimo estado; calentador a 40°C.',
    applicableEquipmentTypes: ['planta']
  },
  {
    id: 'pm-gen-anual',
    system: 'Planta Eléctrica',
    titulo: 'Servicio Mayor, Cambio de Filtros y Banco de Carga',
    frecuencia: 'Anual',
    tiempo: '5.0 Horas',
    icono: 'fa-award',
    color: 'red',
    herramientas: ['Banco de carga resistivo portátil', 'Llave de cadena para filtros', 'Pinza amperimétrica'],
    insumos: ['Aceite de motor 15W40 diésel API CK-4 (galones)', 'Refrigerante 50/50 de larga vida'],
    repuestos: ['Filtro de aceite primario', 'Filtro de combustible primario y secundario separador de agua', 'Filtro de aire para trabajo pesado'],
    pasos: [
      'Drenar aceite usado caliente del cárter y reemplazar filtro de aceite.',
      'Cambiar filtros de combustible y purgar aire del circuito de inyección diésel.',
      'Reemplazar filtro de aire principal y de seguridad.',
      'Inspeccionar tensión y desgaste de correas de ventilador y alternador de carga.',
      'Conectar banco de carga resistiva externa al generador.',
      'Operar al 50% de carga por 30 min, 75% por 30 min y 100% de carga por 1 hora completa.',
      'Monitorear temperatura de gases de escape, presión de turbo y ausencia de humo negro.'
    ],
    criterioAceptacion: 'Soporte del 100% de potencia nominal sin sobrecalentamiento ni caída de frecuencia > 2%.',
    applicableEquipmentTypes: ['planta']
  },
  {
    id: 'pm-mld-turno',
    system: 'Moldes',
    titulo: 'Inspección y Limpieza Diaria de Molde (Inicio de Turno)',
    frecuencia: 'Diario',
    tiempo: '20 Minutos',
    icono: 'fa-toolbox',
    color: 'emerald',
    herramientas: ['Paños de algodón 100% libre de pelusa', 'Rascadores de latón/cobre blando', 'Linterna'],
    insumos: ['Limpiador desengrasante de moldes rápido sin residuo', 'Protector antióxido para paradas'],
    repuestos: [],
    pasos: [
      'Detener máquina y activar seguro mecánico de plato para ingreso seguro.',
      'Limpiar restos de polímero degradado en las cavidades y corazones con solvente y paño suave.',
      'Inspeccionar línea de partición verificando ausencia de golpes, rebabas o deformaciones.',
      'Despejar ranuras de venteo con varilla blanda de latón para evitar gases atrapados y quemaduras.',
      'Comprobar flujo de agua libre y ausencia de fugas en conectores de refrigeración.',
      'Verificar suave retorno de los pines expulsores y lubricación de columnas guía.'
    ],
    criterioAceptacion: 'Cavidades brillantes sin residuos; venteos limpios; cero goteos de agua en el molde.',
    applicableEquipmentTypes: ['molde']
  },
  {
    id: 'pm-mld-mensual',
    system: 'Moldes',
    titulo: 'Mantenimiento Periódico de Guías, Correderas y Canales',
    frecuencia: 'Mensual',
    tiempo: '2.0 Horas',
    icono: 'fa-wrench',
    color: 'amber',
    herramientas: ['Bomba de lavado químico para canales de molde', 'Llaves Allen', 'Calibre de espesores'],
    insumos: ['Desincrustante químico biodegradable para sarro y óxido', 'Grasa especial de alta adherencia blanca para moldes'],
    repuestos: ['O-rings de vitón para tapones de agua', 'Resortes de retorno de placa expulsora'],
    pasos: [
      'Conectar bomba de lavado químico en circuito cerrado a los canales de refrigeración del molde.',
      'Circular solución desincrustante por 45 minutos para desprender sarro y capas de carbonato de calcio.',
      'Enjuagar con agua limpia neutralizada y soplar con aire a presión hasta secar.',
      'Desmontar placas de deslizamiento (sliders/lifters), limpiar suciedad y lubricar con grasa de alta temperatura.',
      'Inspeccionar holgura en bujes guía y pernos expulsores con calibrador de espesores.',
      'Revisar continuidad en resistencias del canal caliente y ajustar termopares de boquilla.'
    ],
    criterioAceptacion: 'Canales con flujo de agua nominal restaurado; correderas suaves; sensores calibrados.',
    applicableEquipmentTypes: ['molde']
  },
  {
    id: 'pm-mld-overhaul',
    system: 'Moldes',
    titulo: 'Overhaul Mayor de Molde (Desarme Completo y Ajuste)',
    frecuencia: 'Semestral',
    tiempo: '8.0 Horas',
    icono: 'fa-arrows-rotate',
    color: 'purple',
    herramientas: ['Grúa puente / polipasto', 'Piedras de pulir cerámicas', 'Micrómetro de profundidad', 'Mesa de ajuste'],
    insumos: ['Pasta de diamante para pulido espejo', 'Selladores anaeróbicos', 'Kit de limpieza ultrasónica'],
    repuestos: ['Juego completo de resortes de eyección', 'Pines expulsores nuevos cortados a medida', 'Bujes de bronce fosforado'],
    pasos: [
      'Desmontar molde de la máquina y trasladarlo al taller de matricería.',
      'Desensamblar totalmente placas, placa expulsora, correderas y sistema de canal caliente.',
      'Limpiar componentes metálicos en tina de ultrasonido.',
      'Medir desgaste dimensional en cavidades, corazones y planos de cierre.',
      'Rectificar planos de partición en rectificadora tangencial si se detectan desgastes o rebabas.',
      'Reemplazar el 100% de o-rings de refrigeración y resortes de eyección.',
      'Pulir a mano las cavidades con pasta de diamante hasta restaurar acabado óptico espejo.',
      'Armar verificando torques de pernos en cruz y probar suavidad de carrera de eyección en banco.'
    ],
    criterioAceptacion: 'Dimensiones dentro de tolerancia de plano; cero rebaba en prueba de tinta azul; sellos 100% nuevos.',
    applicableEquipmentTypes: ['molde']
  }
];

export const initialInventory: InventoryItem[] = [
  {
    id: 'inv-rep-01',
    code: 'REP-FIL-01',
    name: 'Filtro de Retorno Hidráulico 10 Micras',
    category: 'repuesto',
    system: 'Hidráulico',
    stockCurrent: 4,
    stockMin: 2,
    unit: 'un',
    location: 'Estante H-01',
    criticality: 'Alta',
    unitCost: 45.0,
    compatibleEquipments: ['eq-iny-01', 'eq-iny-02', 'eq-sop-01', 'eq-sop-02']
  },
  {
    id: 'inv-rep-02',
    code: 'REP-FIL-02',
    name: 'Filtro Separador Aire/Aceite Compresor',
    category: 'repuesto',
    system: 'Auxiliares',
    stockCurrent: 2,
    stockMin: 1,
    unit: 'un',
    location: 'Estante C-02',
    criticality: 'Alta',
    unitCost: 110.0,
    compatibleEquipments: ['eq-cmp-01']
  },
  {
    id: 'inv-rep-03',
    code: 'REP-RES-01',
    name: 'Resistencia Banda Cerámica 220V 1500W',
    category: 'repuesto',
    system: 'Eléctrico',
    stockCurrent: 6,
    stockMin: 3,
    unit: 'un',
    location: 'Estante E-04',
    criticality: 'Alta',
    unitCost: 35.0,
    compatibleEquipments: ['eq-iny-01', 'eq-iny-02', 'eq-sop-01']
  },
  {
    id: 'inv-rep-04',
    code: 'REP-TER-01',
    name: 'Termopar Baipás Tipo J Rosca M6',
    category: 'repuesto',
    system: 'Electrónico',
    stockCurrent: 5,
    stockMin: 3,
    unit: 'un',
    location: 'Estante E-05',
    criticality: 'Alta',
    unitCost: 18.0,
    compatibleEquipments: ['eq-iny-01', 'eq-iny-02', 'eq-sop-01', 'eq-mld-02']
  },
  {
    id: 'inv-rep-05',
    code: 'REP-CON-01',
    name: 'Contactor Tripolar 32A Bobina 110V',
    category: 'repuesto',
    system: 'Eléctrico',
    stockCurrent: 3,
    stockMin: 2,
    unit: 'un',
    location: 'Estante E-02',
    criticality: 'Media',
    unitCost: 28.0,
    compatibleEquipments: ['eq-iny-01', 'eq-sop-01', 'eq-chl-01', 'eq-gen-01']
  },
  {
    id: 'inv-rep-06',
    code: 'REP-VAL-01',
    name: 'Electroválvula Neumática 5/2 24VDC',
    category: 'repuesto',
    system: 'Neumático',
    stockCurrent: 3,
    stockMin: 2,
    unit: 'un',
    location: 'Estante N-01',
    criticality: 'Alta',
    unitCost: 55.0,
    compatibleEquipments: ['eq-iny-01', 'eq-iny-02', 'eq-sop-01', 'eq-sop-02']
  },
  {
    id: 'inv-rep-07',
    code: 'REP-MLD-PIN',
    name: 'Pin Expulsor Templado D:6mm x L:250mm',
    category: 'repuesto',
    system: 'Moldes',
    stockCurrent: 12,
    stockMin: 8,
    unit: 'un',
    location: 'Estante M-03',
    criticality: 'Media',
    unitCost: 8.5,
    compatibleEquipments: ['eq-mld-02', 'eq-mld-03']
  },
  {
    id: 'inv-rep-08',
    code: 'REP-MLD-RES',
    name: 'Resorte de Retorno Molde Carga Media (Azul)',
    category: 'repuesto',
    system: 'Moldes',
    stockCurrent: 8,
    stockMin: 4,
    unit: 'un',
    location: 'Estante M-04',
    criticality: 'Media',
    unitCost: 12.0,
    compatibleEquipments: ['eq-mld-02', 'eq-mld-03']
  },
  {
    id: 'inv-rep-09',
    code: 'REP-MLD-ORING',
    name: 'Kit de O-Rings Vitón Alta Temperatura',
    category: 'repuesto',
    system: 'Moldes',
    stockCurrent: 15,
    stockMin: 10,
    unit: 'juego',
    location: 'Estante M-01',
    criticality: 'Alta',
    unitCost: 14.0,
    compatibleEquipments: ['eq-mld-01', 'eq-mld-02', 'eq-mld-03', 'eq-chl-01']
  },
  {
    id: 'inv-rep-10',
    code: 'REP-GEN-BAT',
    name: 'Batería de Arranque Pesada 12V 100Ah',
    category: 'repuesto',
    system: 'Auxiliares',
    stockCurrent: 1,
    stockMin: 1,
    unit: 'un',
    location: 'Área Baterías',
    criticality: 'Alta',
    unitCost: 140.0,
    compatibleEquipments: ['eq-gen-01']
  },
  // INSUMOS
  {
    id: 'inv-ins-01',
    code: 'INS-ACE-01',
    name: 'Aceite Hidráulico ISO VG 46 Anti-desgaste',
    category: 'insumo',
    system: 'Hidráulico',
    stockCurrent: 180, // litros
    stockMin: 80,
    unit: 'L',
    location: 'Almacén Químicos - Tambor 1',
    criticality: 'Alta',
    unitCost: 4.2,
    compatibleEquipments: ['eq-iny-01', 'eq-iny-02', 'eq-sop-01', 'eq-sop-02']
  },
  {
    id: 'inv-ins-02',
    code: 'INS-GRA-01',
    name: 'Grasa EP-2 Base Litio Alta Presión',
    category: 'insumo',
    system: 'Mecánico',
    stockCurrent: 10,
    stockMin: 5,
    unit: 'cartucho 400g',
    location: 'Estante G-01',
    criticality: 'Alta',
    unitCost: 6.8,
    compatibleEquipments: ['eq-iny-01', 'eq-iny-02', 'eq-sop-01', 'eq-sop-02', 'eq-mld-01']
  },
  {
    id: 'inv-ins-03',
    code: 'INS-DIE-01',
    name: 'Limpiador Dieléctrico Contact Cleaner',
    category: 'insumo',
    system: 'Eléctrico',
    stockCurrent: 5,
    stockMin: 3,
    unit: 'spray 400ml',
    location: 'Estante E-01',
    criticality: 'Media',
    unitCost: 7.5,
    compatibleEquipments: ['eq-iny-01', 'eq-sop-01', 'eq-chl-01', 'eq-cmp-01', 'eq-gen-01']
  },
  {
    id: 'inv-ins-04',
    code: 'INS-MLD-PRO',
    name: 'Spray Protector Antióxido y Anticorrosivo',
    category: 'insumo',
    system: 'Moldes',
    stockCurrent: 7,
    stockMin: 4,
    unit: 'spray 400ml',
    location: 'Estante M-02',
    criticality: 'Alta',
    unitCost: 9.0,
    compatibleEquipments: ['eq-mld-01', 'eq-mld-02', 'eq-mld-03']
  },
  {
    id: 'inv-ins-05',
    code: 'INS-DES-01',
    name: 'Desincrustante Químico para Canales de Molde',
    category: 'insumo',
    system: 'Moldes',
    stockCurrent: 25,
    stockMin: 15,
    unit: 'L',
    location: 'Almacén Químicos - Bidón',
    criticality: 'Alta',
    unitCost: 5.5,
    compatibleEquipments: ['eq-mld-01', 'eq-mld-02', 'eq-mld-03', 'eq-chl-01']
  },
  // HERRAMIENTAS
  {
    id: 'inv-her-01',
    code: 'HER-TOR-01',
    name: 'Torquímetro Dinamométrico 40-200 Nm Calibrado',
    category: 'herramienta',
    system: 'Mecánico',
    stockCurrent: 2,
    stockMin: 1,
    unit: 'un',
    location: 'Caja Calibrada Taller',
    criticality: 'Alta',
    unitCost: 180.0,
    compatibleEquipments: ['eq-iny-01', 'eq-iny-02', 'eq-sop-01', 'eq-mld-01', 'eq-mld-02', 'eq-mld-03']
  },
  {
    id: 'inv-her-02',
    code: 'HER-TER-01',
    name: 'Cámara Termográfica Industrial FLIR E5',
    category: 'herramienta',
    system: 'Eléctrico',
    stockCurrent: 1,
    stockMin: 1,
    unit: 'un',
    location: 'Laboratorio de Instrumentación',
    criticality: 'Alta',
    unitCost: 1200.0,
    compatibleEquipments: ['eq-iny-01', 'eq-sop-01', 'eq-chl-01', 'eq-cmp-01', 'eq-gen-01']
  },
  {
    id: 'inv-her-03',
    code: 'HER-MEG-01',
    name: 'Megóhmetro Digital 1000V Fluke 1507',
    category: 'herramienta',
    system: 'Eléctrico',
    stockCurrent: 1,
    stockMin: 1,
    unit: 'un',
    location: 'Laboratorio de Instrumentación',
    criticality: 'Alta',
    unitCost: 750.0,
    compatibleEquipments: ['eq-iny-01', 'eq-sop-01', 'eq-chl-01', 'eq-cmp-01', 'eq-gen-01']
  }
];

export const initialFailureIncidents: FailureIncident[] = [
  {
    id: 'fail-01',
    symptom: 'Fuga de aceite hidráulico en el piso bajo la bancada',
    system: 'Hidráulico',
    possibleCauses: [
      'Manguera de alta presión fatigada o agrietada por pulsaciones.',
      'Racor de acople rápido flojo por vibración continua.',
      'Junta o sello retenedor de vástago de cilindro de cierre desgastado.'
    ],
    solutionSteps: [
      'Despresurizar el circuito y bloquear con LOTO.',
      'Limpiar con paño absorbente para identificar punto exacto de fuga.',
      'Si es racor: aflojar, limpiar rosca, aplicar cinta sellante y apretar a torque.',
      'Si es manguera: reemplazar de inmediato por repuesto con igual especificación de presión.',
      'Si es cilindro: desmontar y sustituir kit completo de sellos de vitón.'
    ],
    severity: 'Critica',
    status: 'resuelta'
  },
  {
    id: 'fail-02',
    symptom: 'La máquina no cierra el molde (hace intento y retrocede de inmediato)',
    system: 'Automatización y Seguridad',
    possibleCauses: [
      'Protección de baja presión de molde activada por obstrucción de rebaba o pieza anterior.',
      'Sensor inductivo de posición de inicio de cierre descalibrado o sucio de grasa.',
      'Falla o suciedad en bobina de válvula proporcional de control de velocidad de cierre.'
    ],
    solutionSteps: [
      'Entrar en modo manual e inspeccionar cavidades y línea de partición del molde.',
      'Verificar LED testigo del sensor de posición en el PLC.',
      'Limpiar cara activa del sensor inductivo con paño seco.',
      'Comprobar la presión de baja protección en pantalla HMI (no debe forzarse).'
    ],
    severity: 'Media',
    status: 'resuelta'
  },
  {
    id: 'fail-03',
    symptom: 'Ruido anormal tipo chillido metálico durante la carrera de inyección/plastificación',
    system: 'Mecánico',
    possibleCauses: [
      'Falta de grasa de alta presión en los bujes de la rodillera o cruceta.',
      'Desgaste crítico en los bujes de bronce o rayaduras en las columnas.',
      'Falta de alineación entre plato móvil y bancada.'
    ],
    solutionSteps: [
      'Detener máquina e inyectar grasa EP-2 manualmente en todas las boquillas.',
      'Revisar si la bomba de engrase automático tiene presión y cartucho con grasa.',
      'Medir holgura radial con comparador de carátula; si supera 0.25mm programar recambio de bujes.'
    ],
    severity: 'Media',
    status: 'resuelta'
  },
  {
    id: 'fail-04',
    symptom: 'Temperatura de zona 2 del cilindro no alcanza el setpoint o fluctúa severamente',
    system: 'Eléctrico',
    possibleCauses: [
      'Resistencia tipo banda calefactora abierta (quemada).',
      'Termopar tipo J desprendido del pozo termométrico o cable compensado cortado.',
      'Relé de estado sólido (SSR) averiado en estado abierto.'
    ],
    solutionSteps: [
      'Medir corriente con pinza amperimétrica en cables de la resistencia.',
      'Si corriente es 0 A con salida activada: medir resistencia óhmica (si es infinita, cambiar banda).',
      'Revisar contacto físico del termopar en el fondo del orificio del cilindro.',
      'Verificar voltaje de control (12-24VDC) en entrada del relé de estado sólido.'
    ],
    severity: 'Alta',
    status: 'resuelta'
  },
  {
    id: 'fail-05',
    symptom: 'En sopladora: el parison de PEAD cae torcido o con curvatura hacia un lado',
    system: 'Soplado / Extrusión',
    possibleCauses: [
      'Dado o mandril del cabezal con restos de resina carbonizada adherida en un labio.',
      'Descentrado mecánico del labio de salida del cabezal.',
      'Diferencia de temperatura en las resistencias calefactoras del cabezal de extrusión.'
    ],
    solutionSteps: [
      'Poner extrusora a baja velocidad y limpiar la boquilla con raspador de cobre blando.',
      'Verificar con termómetro infrarrojo que no haya zonas frías en el cabezal.',
      'Ajustar suavemente los pernos de centrado del dado con llaves Allen hasta que el parison descienda verticalmente.'
    ],
    severity: 'Media',
    status: 'resuelta'
  },
  {
    id: 'fail-06',
    symptom: 'Piezas inyectadas presentan rebabas (Flash) excesivas en la línea de unión',
    system: 'Proceso y Mecánico',
    possibleCauses: [
      'Fuerza de cierre insuficiente o descalibración del tonelaje en HMI.',
      'Falta de paralelismo de los platos (molde cierra inclinado).',
      'Presión o velocidad de inyección y sostenimiento demasiado alta.',
      'Partículas de resina o suciedad aplastada entre las caras del molde impidiendo el asiento.'
    ],
    solutionSteps: [
      'Limpiar minuciosamente las caras del molde con desengrasante.',
      'Verificar y reajustar altura de molde y tonelaje de cierre recomendado.',
      'Realizar prueba de paralelismo con galgas de espesor.',
      'Ajustar curva de conmutación de presión de inyección a sostenimiento.'
    ],
    severity: 'Media',
    status: 'resuelta'
  },
  {
    id: 'fail-07',
    symptom: 'Pantalla HMI muestra "Error de Comunicación con PLC / Time-out"',
    system: 'Automatización',
    possibleCauses: [
      'Cable Ethernet / Profibus con conector RJ45 suelto o dañado por vibración.',
      'Falla en la fuente de alimentación conmutada de 24VDC que alimenta el switch o HMI.',
      'Módulo de comunicación del rack de PLC colgado o dañado.'
    ],
    solutionSteps: [
      'Verificar estado de los LEDs LINK/ACT en el puerto Ethernet del PLC y pantalla.',
      'Medir que la fuente entregue 24.0VDC estables bajo carga.',
      'Reiniciar el sistema de control desenergizando el circuito de 24V por 30 segundos.',
      'Probar sustituyendo el cable de red por un cable de prueba certificado CAT6 blindado.'
    ],
    severity: 'Alta',
    status: 'resuelta'
  },
  {
    id: 'fail-08',
    symptom: 'Caída de presión de aire general en la planta (< 5.5 bar)',
    system: 'Auxiliares / Compresor',
    possibleCauses: [
      'Compresor principal disparado por alta temperatura de tornillo.',
      'Válvula de purga automática de condensados trabada en posición abierta dejando fugar aire masivamente.',
      'Filtro separador aire/aceite saturado creando alta contrapresión.'
    ],
    solutionSteps: [
      'Ir al cuarto de compresores y revisar panel del Atlas Copco.',
      'Revisar si hay alarmas de parada o mantenimiento.',
      'Recorrer la red principal verificando que ninguna purga o válvula manual esté abierta.',
      'Si el compresor está en falla, arrancar unidad auxiliar y sustituir elementos filtrantes.'
    ],
    severity: 'Critica',
    status: 'resuelta'
  },
  {
    id: 'fail-09',
    symptom: 'El motor del husillo se detiene por sobrecarga durante la carga de material',
    system: 'Mecánico / Eléctrico',
    possibleCauses: [
      'Temperatura del barril demasiado baja (plástico semicongelado creando resistencia de corte).',
      'Contrapresión hidráulica de plastificación excesiva.',
      'Cuerpo extraño metálico o contaminante trabado en los alabes del husillo.',
      'Térmico del guardamotor o servodrive desajustado.'
    ],
    solutionSteps: [
      'Subir 10°C la temperatura del barril y dejar reposar 15 minutos (tiempo de empape térmico).',
      'Bajar la contrapresión a 5 bar.',
      'Intentar rotación manual a baja velocidad y torque limitado.',
      'Si persiste el bloqueo, purgar tolva, retirar husillo para inspección de incrustación metálica.'
    ],
    severity: 'Alta',
    status: 'resuelta'
  },
  {
    id: 'fail-10',
    symptom: 'Temperatura del agua del Chiller sube a más de 18°C y dispara alarma de moldes calientes',
    system: 'Auxiliares / Chiller',
    possibleCauses: [
      'Serpentín condensador saturado de polvo, pelusa y suciedad.',
      'Fuga parcial de gas refrigerante R-410A en el circuito de refrigeración.',
      'Filtro de agua hacia evaporador obstruido impidiendo caudal de transferencia.'
    ],
    solutionSteps: [
      'Inspeccionar serpentín condensador; si está tapado, apagar y soplar con aire a presión.',
      'Comprobar presiones en manómetros de alta y baja del chiller.',
      'Limpiar el filtro tipo "Y" en la entrada de agua.',
      'Si presiones están bajas, localizar fuga con detector electrónico, soldar y recargar gas.'
    ],
    severity: 'Critica',
    status: 'resuelta'
  }
];

export const initialWorkOrders: WorkOrder[] = [
  {
    id: 'ot-2026-001',
    code: 'F-MT-01-001',
    type: 'Preventivo',
    equipmentId: 'eq-iny-01',
    equipmentTag: 'INY-01',
    equipmentName: 'Inyectora Haitian Mars II 250T',
    status: 'Completada',
    priority: 'Media',
    scheduledDate: '2026-10-15',
    startedAt: '2026-10-15 08:00',
    completedAt: '2026-10-15 09:30',
    planTemplateId: 'pm-mec-mensual',
    title: 'Verificación Mecánica, Rodillera y Lubricación',
    system: 'Mecánico',
    frequency: 'Mensual',
    estimatedTime: '1.5 Horas',
    realDurationHours: 1.5,
    assignedTechnician: 'Carlos Méndez (Mecánico)',
    verifierSupervisor: 'Ing. Roberto Silva',
    plantManager: 'Ing. Danny Sánchez',
    procedureSteps: [
      { step: 'Aplicar protocolo de Bloqueo y Etiquetado (LOTO).', completed: true },
      { step: 'Limpiar minuciosamente pasadores, rodilleras y columnas de cierre.', completed: true },
      { step: 'Inyectar grasa de alta presión EP-2 en las graseras.', completed: true },
      { step: 'Verificar paralelismo entre platos (desviación máx 0.1 mm).', completed: true },
      { step: 'Verificar holgura axial y radial en pasadores y bujes.', completed: true },
      { step: 'Comprobar torque de fijación en tuercas de columnas.', completed: true },
      { step: 'Probar movimiento en vacío a baja velocidad.', completed: true }
    ],
    toolsUsed: ['Llave Allen métrica', 'Pistola de engrase', 'Comparador de carátula', 'Torquímetro'],
    suppliesUsed: ['Grasa EP-2 Base Litio (Cartucho)', 'Paños industriales'],
    partsConsumed: [
      { partId: 'inv-ins-02', partName: 'Grasa EP-2 Base Litio Alta Presión', quantity: 1, unitCost: 6.8 }
    ],
    observations: 'Paralelismo verificado en 0.04 mm (excelente estado). Rodillera lubricada.',
    technicianSignature: 'C. Méndez',
    supervisorSignature: 'R. Silva',
    createdAt: '2026-10-10'
  },
  {
    id: 'ot-2026-002',
    code: 'F-MT-01-002',
    type: 'Preventivo',
    equipmentId: 'eq-chl-01',
    equipmentTag: 'CHL-01',
    equipmentName: 'Chiller Central Frick 30 TR',
    status: 'Pendiente',
    priority: 'Alta',
    scheduledDate: '2026-11-05',
    planTemplateId: 'pm-chl-trimestral',
    title: 'Inspección de Carga de Gas, Fugas y Controles',
    system: 'Chiller',
    frequency: 'Trimestral',
    estimatedTime: '2.0 Horas',
    assignedTechnician: 'Luis Morales (Refrigeración)',
    verifierSupervisor: 'Ing. Roberto Silva',
    plantManager: 'Ing. Danny Sánchez',
    procedureSteps: [
      { step: 'Pasar sensor ultrasónico/electrónico por todas las soldaduras y bridas.', completed: false },
      { step: 'Medir recalentamiento y subenfriamiento con manifold.', completed: false },
      { step: 'Verificar mirilla de líquido (color verde sin burbujas).', completed: false },
      { step: 'Probar calibración y disparo de los presostatos.', completed: false },
      { step: 'Limpiar el filtro colador tipo Y en entrada de agua.', completed: false }
    ],
    toolsUsed: ['Detector electrónico de fugas', 'Manifold digital con sondas'],
    suppliesUsed: ['Gas R-410A'],
    partsConsumed: [],
    observations: 'Programada para parada preventiva de fin de semana.',
    createdAt: '2026-11-01'
  },
  {
    id: 'ot-2026-003',
    code: 'F-MT-01-003',
    type: 'Correctivo',
    equipmentId: 'eq-sop-02',
    equipmentTag: 'SOP-02',
    equipmentName: 'Sopladora Uniloy Milacron UMR 2000',
    status: 'En_Proceso',
    priority: 'Critica',
    scheduledDate: '2026-11-03',
    startedAt: '2026-11-03 07:30',
    title: 'Ajuste de Rodillera y Corrección de Fuga Hidráulica',
    system: 'Hidráulico',
    frequency: 'Mensual',
    estimatedTime: '3.0 Horas',
    assignedTechnician: 'Javier Peña (Mecánico)',
    verifierSupervisor: 'Ing. Roberto Silva',
    plantManager: 'Ing. Danny Sánchez',
    procedureSteps: [
      { step: 'Despresurizar y drenar aceite residual.', completed: true },
      { step: 'Desmontar racor dañado y colocar sello nuevo.', completed: true },
      { step: 'Ajustar juego en pernos de biela de cierre.', completed: false },
      { step: 'Prueba de presión y verificación de fugas.', completed: false }
    ],
    toolsUsed: ['Juego de llaves mixtas', 'Torquímetro', 'Bandeja colectora'],
    suppliesUsed: ['Paños absorbentes', 'Aceite ISO VG 46'],
    partsConsumed: [
      { partId: 'inv-rep-01', partName: 'Filtro de Retorno Hidráulico 10 Micras', quantity: 1, unitCost: 45.0 }
    ],
    observations: 'Se detectó fuga menor en manguera flexible de retorno. Se cambia filtro preventivamente.',
    createdAt: '2026-11-02'
  }
];

export const initialMoldMountingRecords: MoldMountingRecord[] = [
  {
    id: 'rec-mnt-01',
    moldId: 'eq-mld-02',
    moldName: 'Molde Tapa Rosca 28mm PCO 1881 (8 Cav)',
    machineId: 'eq-iny-01',
    machineName: 'Inyectora Haitian Mars II 250T',
    mountedDate: '2026-10-15 14:00',
    torqueAppliedNm: 190,
    liftingChecklistOk: true,
    waterFlowCheckOk: true,
    technician: 'Carlos Méndez',
    cyclesRun: 18450,
    status: 'montado',
    notes: 'Montaje con cáncamos certificados de 2T. Torque aplicado en cruz a 190 Nm. Conexión de 8 zonas de canal caliente verificadas.'
  },
  {
    id: 'rec-mnt-02',
    moldId: 'eq-mld-01',
    moldName: 'Molde Botella 1 Litro PEAD (2 Cavidades)',
    machineId: 'eq-sop-01',
    machineName: 'Sopladora Bekum H-121 Extrusión',
    mountedDate: '2026-10-18 10:30',
    torqueAppliedNm: 180,
    liftingChecklistOk: true,
    waterFlowCheckOk: true,
    technician: 'Javier Peña',
    cyclesRun: 24300,
    status: 'montado',
    notes: 'Centrado verificado con anillo centrador. Canales de agua refrigerada purgados a 12°C.'
  }
];
