import { BuilderItemDef, BuildTemplate, PlacedComponent, WireConnection } from '../types/builder';

export const BUILDER_ITEM_CATALOG: BuilderItemDef[] = [
  // ==========================================
  // STRUCTURE
  // ==========================================
  {
    type: 'craft-stick',
    name: 'Craft Stick (Standard)',
    category: 'STRUCTURE',
    description: 'Popsicle stick standard 114mm with end slots for FUNNECT connectors.',
    badgeEmoji: '🪵',
    compatibleWith: ['Straight Connector', 'Corner Connector', 'T Connector', 'Cross Connector', 'Core Mount', 'Motor Mount'],
    dimensions: [2.4, 0.08, 0.28],
    color: '#D4A373',
    materialType: 'wood',
    educationalDescription: 'Batang es krim ramah lingkungan sebagai rangka dasar atau tulang robot.',
    roleExplanation: 'Membentuk sasis dan rangka mekanis yang kokoh namun mudah dirangkai.',
    snapPoints: [
      { id: 'left', name: 'Left End Slot', type: 'stick-slot', offset: [-1.1, 0, 0], normal: [-1, 0, 0], compatibleTypes: ['pin', 'universal'] },
      { id: 'center', name: 'Center Pivot', type: 'stick-slot', offset: [0, 0, 0], normal: [0, 1, 0], compatibleTypes: ['pin', 'universal'] },
      { id: 'right', name: 'Right End Slot', type: 'stick-slot', offset: [1.1, 0, 0], normal: [1, 0, 0], compatibleTypes: ['pin', 'universal'] }
    ]
  },
  {
    type: 'long-stick',
    name: 'Long Craft Stick',
    category: 'STRUCTURE',
    description: 'Extended craft stick 180mm for major chassis, crane jibs, and long beams.',
    badgeEmoji: '📏',
    compatibleWith: ['Straight Connector', 'Corner Connector', 'T Connector', 'Cross Connector'],
    dimensions: [3.8, 0.08, 0.28],
    color: '#C69463',
    materialType: 'wood',
    educationalDescription: 'Batang kayu panjang untuk membuat sasis mobil besar atau lengan derek.',
    roleExplanation: 'Memberikan jangkauan panjang dan kekakuan struktural utama.',
    snapPoints: [
      { id: 'left', name: 'Left End Slot', type: 'stick-slot', offset: [-1.8, 0, 0], normal: [-1, 0, 0], compatibleTypes: ['pin', 'universal'] },
      { id: 'center', name: 'Center Pivot', type: 'stick-slot', offset: [0, 0, 0], normal: [0, 1, 0], compatibleTypes: ['pin', 'universal'] },
      { id: 'right', name: 'Right End Slot', type: 'stick-slot', offset: [1.8, 0, 0], normal: [1, 0, 0], compatibleTypes: ['pin', 'universal'] }
    ]
  },
  {
    type: 'short-stick',
    name: 'Short Craft Stick',
    category: 'STRUCTURE',
    description: 'Compact 65mm stick for diagonal braces, bumpers, and small spacers.',
    badgeEmoji: '🥢',
    compatibleWith: ['Corner Connector', 'Angle Connector', 'Straight Connector'],
    dimensions: [1.4, 0.08, 0.28],
    color: '#D4A373',
    materialType: 'wood',
    educationalDescription: 'Batang kayu pendek untuk penguat diagonal dan bumper depan.',
    roleExplanation: 'Membuat konstruksi segitiga (truss) agar robot tidak mudah goyang.',
    snapPoints: [
      { id: 'left', name: 'Left End', type: 'stick-slot', offset: [-0.65, 0, 0], normal: [-1, 0, 0], compatibleTypes: ['pin', 'universal'] },
      { id: 'right', name: 'Right End', type: 'stick-slot', offset: [0.65, 0, 0], normal: [1, 0, 0], compatibleTypes: ['pin', 'universal'] }
    ]
  },
  {
    type: 'bamboo-stick',
    name: 'Bamboo Axle Stick',
    category: 'STRUCTURE',
    description: 'Round bamboo skewer 4mm diameter for rotating axles and structural shafts.',
    badgeEmoji: '🎋',
    compatibleWith: ['Wheel', 'DC Motor', 'Cross Connector', 'Hinge Connector'],
    dimensions: [2.8, 0.12, 0.12],
    color: '#E0B589',
    materialType: 'wood',
    educationalDescription: 'Tusuk bambu bulat sebagai poros berputar (axle) untuk roda atau kincir.',
    roleExplanation: 'Menghubungkan putaran motor langsung ke roda agar robot dapat melaju.',
    snapPoints: [
      { id: 'left', name: 'Left Axle End', type: 'axle', offset: [-1.3, 0, 0], normal: [-1, 0, 0], compatibleTypes: ['wheel', 'universal'] },
      { id: 'right', name: 'Right Axle End', type: 'axle', offset: [1.3, 0, 0], normal: [1, 0, 0], compatibleTypes: ['wheel', 'universal'] }
    ]
  },
  {
    type: 'cardboard-panel',
    name: 'Cardboard Base Panel',
    category: 'STRUCTURE',
    description: 'Recycled corrugated cardboard sheet for flat decks, flower petals, or car floors.',
    badgeEmoji: '📦',
    compatibleWith: ['Craft Stick', 'Core Mount', 'Motor Mount'],
    dimensions: [3.4, 0.1, 2.6],
    color: '#BA8B55',
    materialType: 'cardboard',
    educationalDescription: 'Kardus daur ulang sebagai lantai dasar sasis untuk menaruh FUNNECT Core.',
    roleExplanation: 'Menyediakan permukaan datar yang luas dan ringan untuk meletakkan komponen elektrik.',
    snapPoints: [
      { id: 'top-surface', name: 'Top Deck', type: 'core-mount', offset: [0, 0.1, 0], normal: [0, 1, 0], compatibleTypes: ['core-mount', 'universal'] },
      { id: 'front-edge', name: 'Front Lip', type: 'stick-slot', offset: [0, 0, 1.3], normal: [0, 0, 1], compatibleTypes: ['pin', 'universal'] },
      { id: 'rear-edge', name: 'Rear Lip', type: 'stick-slot', offset: [0, 0, -1.3], normal: [0, 0, -1], compatibleTypes: ['pin', 'universal'] }
    ]
  },

  // ==========================================
  // CONNECTORS
  // ==========================================
  {
    type: 'straight-connector',
    name: 'Straight Connector (180°)',
    category: 'CONNECTORS',
    description: 'Connects two craft sticks end-to-end to extend structural spans.',
    badgeEmoji: '🔗',
    compatibleWith: ['Craft Stick', 'Long Stick', 'Short Stick'],
    dimensions: [0.7, 0.35, 0.4],
    color: '#1D64F2',
    materialType: 'plastic-blue',
    educationalDescription: 'Penyambung lurus untuk menyatukan dua stik es krim memanjang.',
    roleExplanation: 'Memperpanjang struktur seperti rel jalan atau lengan jembatan.',
    snapPoints: [
      { id: 'slot-a', name: 'Socket A', type: 'pin', offset: [-0.35, 0, 0], normal: [-1, 0, 0], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'slot-b', name: 'Socket B', type: 'pin', offset: [0.35, 0, 0], normal: [1, 0, 0], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },
  {
    type: 'corner-connector',
    name: '90° Corner Connector',
    category: 'CONNECTORS',
    description: 'Right-angle bracket for box frames, car chassis corners, and towers.',
    badgeEmoji: '📐',
    compatibleWith: ['Craft Stick', 'Short Stick', 'Long Stick'],
    dimensions: [0.65, 0.35, 0.65],
    color: '#1D64F2',
    materialType: 'plastic-blue',
    educationalDescription: 'Konektor siku 90 derajat untuk membuat sudut sasis persegi atau kaki menara.',
    roleExplanation: 'Kunci pembentuk sudut siku-siku agar sasis robot persegi dan simetris.',
    snapPoints: [
      { id: 'slot-x', name: 'Socket X', type: 'pin', offset: [0.32, 0, 0], normal: [1, 0, 0], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'slot-z', name: 'Socket Z', type: 'pin', offset: [0, 0, 0.32], normal: [0, 0, 1], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },
  {
    type: 't-connector',
    name: 'T-Connector (3-Way)',
    category: 'CONNECTORS',
    description: 'Triple socket connector for crossbars, mast junctions, and spine supports.',
    badgeEmoji: '⚓',
    compatibleWith: ['Craft Stick', 'Long Stick'],
    dimensions: [0.8, 0.35, 0.65],
    color: '#F59E0B',
    materialType: 'plastic-yellow',
    snapPoints: [
      { id: 'left', name: 'Left Pin', type: 'pin', offset: [-0.4, 0, 0], normal: [-1, 0, 0], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'right', name: 'Right Pin', type: 'pin', offset: [0.4, 0, 0], normal: [1, 0, 0], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'stem', name: 'Stem Pin', type: 'pin', offset: [0, 0, 0.35], normal: [0, 0, 1], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },
  {
    type: 'cross-connector',
    name: '4-Way Cross Connector',
    category: 'CONNECTORS',
    description: 'Four-way hub for windmill towers, vehicle chassis crosses, and outriggers.',
    badgeEmoji: '➕',
    compatibleWith: ['Craft Stick', 'Long Stick', 'Bamboo Stick'],
    dimensions: [0.8, 0.35, 0.8],
    color: '#1D64F2',
    materialType: 'plastic-blue',
    snapPoints: [
      { id: 'pos-x', name: '+X Pin', type: 'pin', offset: [0.4, 0, 0], normal: [1, 0, 0], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'neg-x', name: '-X Pin', type: 'pin', offset: [-0.4, 0, 0], normal: [-1, 0, 0], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'pos-z', name: '+Z Pin', type: 'pin', offset: [0, 0, 0.4], normal: [0, 0, 1], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'neg-z', name: '-Z Pin', type: 'pin', offset: [0, 0, -0.4], normal: [0, 0, -1], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },
  {
    type: 'angle-connector',
    name: '45° Diagonal Angle Connector',
    category: 'CONNECTORS',
    description: 'Triangular truss connector for diagonal stiffness and roof gables.',
    badgeEmoji: '◿',
    compatibleWith: ['Craft Stick', 'Short Stick'],
    dimensions: [0.7, 0.35, 0.7],
    color: '#F59E0B',
    materialType: 'plastic-yellow',
    snapPoints: [
      { id: 'base', name: 'Base Pin', type: 'pin', offset: [0, 0, -0.3], normal: [0, 0, -1], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'diag', name: 'Diagonal Pin', type: 'pin', offset: [0.25, 0, 0.25], normal: [0.707, 0, 0.707], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },
  {
    type: 'hinge-connector',
    name: 'Swivel Hinge Connector',
    category: 'CONNECTORS',
    description: 'Pivoting joint for boom gates, crane booms, and flapping mechanisms.',
    badgeEmoji: '🚪',
    compatibleWith: ['Craft Stick', 'Micro Servo Motor'],
    dimensions: [0.6, 0.4, 0.6],
    color: '#10B981',
    materialType: 'plastic-blue',
    snapPoints: [
      { id: 'pivot-pin', name: 'Pivot Socket', type: 'pin', offset: [0, 0.2, 0], normal: [0, 1, 0], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'mount-base', name: 'Base Pad', type: 'pin', offset: [0, -0.2, 0], normal: [0, -1, 0], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },
  {
    type: 'core-mount',
    name: 'FUNNECT Core Cradle Mount',
    category: 'CONNECTORS',
    description: 'Snap-in bracket that holds the FUNNECT Core securely onto stick frames.',
    badgeEmoji: '🪑',
    compatibleWith: ['FUNNECT Core', 'Craft Stick', 'Cardboard Base Panel'],
    dimensions: [2.5, 0.3, 1.9],
    color: '#1D64F2',
    materialType: 'plastic-blue',
    snapPoints: [
      { id: 'cradle-slot', name: 'Core Seat', type: 'core-mount', offset: [0, 0.15, 0], normal: [0, 1, 0], compatibleTypes: ['core-mount', 'universal'] },
      { id: 'under-clip-l', name: 'Left Stick Clip', type: 'pin', offset: [-1.0, -0.15, 0], normal: [0, -1, 0], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'under-clip-r', name: 'Right Stick Clip', type: 'pin', offset: [1.0, -0.15, 0], normal: [0, -1, 0], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },
  {
    type: 'motor-mount',
    name: 'DC Motor Clip Mount',
    category: 'CONNECTORS',
    description: 'Clips DC gear motor firmly to craft stick chassis with vibration isolation.',
    badgeEmoji: '🗜️',
    compatibleWith: ['DC Gear Motor', 'Craft Stick'],
    dimensions: [1.1, 0.7, 0.8],
    color: '#F97316',
    materialType: 'plastic-yellow',
    snapPoints: [
      { id: 'motor-cavity', name: 'Motor Snap Bed', type: 'motor-mount', offset: [0, 0, 0], normal: [0, 1, 0], compatibleTypes: ['motor-mount', 'universal'] },
      { id: 'chassis-slot', name: 'Chassis Clip', type: 'pin', offset: [0, -0.35, 0], normal: [0, -1, 0], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },

  // ==========================================
  // ELECTRONICS
  // ==========================================
  {
    type: 'funnect-core',
    name: 'FUNNECT Core Controller',
    category: 'ELECTRONICS',
    description: 'The brain: rechargeable microcontroller with 6 quick-connect ports (S1, S2, M1, M2, O1, O2).',
    badgeEmoji: '🧠',
    compatibleWith: ['Core Cradle Mount', 'Sensors', 'Motors', 'Lights'],
    dimensions: [2.4, 0.7, 1.8],
    color: '#FFFFFF',
    materialType: 'electronics',
    educationalDescription: 'Otak utama robot: memproses logika kode, membaca sensor, dan menggerakkan motor.',
    roleExplanation: 'Menghubungkan seluruh komponen dan menjalankan program yang kamu buat.',
    compatiblePorts: ['P1/S1', 'P2/S2', 'M1', 'M2', 'O1', 'O2'],
    snapPoints: [
      { id: 'mount-base', name: 'Mounting Base', type: 'core-mount', offset: [0, -0.35, 0], normal: [0, -1, 0], compatibleTypes: ['core-mount', 'universal'] },
      { id: 'port-s1', name: 'Sensor Port S1', type: 'port', offset: [-0.7, 0, 0.9], normal: [0, 0, 1], compatibleTypes: ['port', 'universal'] },
      { id: 'port-s2', name: 'Sensor Port S2', type: 'port', offset: [0.7, 0, 0.9], normal: [0, 0, 1], compatibleTypes: ['port', 'universal'] },
      { id: 'port-m1', name: 'Motor Port M1', type: 'port', offset: [-0.7, 0, -0.9], normal: [0, 0, -1], compatibleTypes: ['port', 'universal'] },
      { id: 'port-m2', name: 'Motor Port M2', type: 'port', offset: [0.7, 0, -0.9], normal: [0, 0, -1], compatibleTypes: ['port', 'universal'] },
      { id: 'port-o1', name: 'Output Port O1', type: 'port', offset: [-1.2, 0, -0.2], normal: [-1, 0, 0], compatibleTypes: ['port', 'universal'] },
      { id: 'port-o2', name: 'Output Port O2', type: 'port', offset: [1.2, 0, -0.2], normal: [1, 0, 0], compatibleTypes: ['port', 'universal'] }
    ]
  },
  {
    type: 'distance-sensor',
    name: 'Ultrasonic Distance Sensor',
    category: 'ELECTRONICS',
    description: 'Dual ultrasonic eyes measure obstacles from 2cm to 400cm.',
    badgeEmoji: '📡',
    compatibleWith: ['FUNNECT Core', 'Craft Stick'],
    dimensions: [1.1, 0.5, 0.4],
    color: '#1D64F2',
    materialType: 'electronics',
    defaultModuleId: 'mod-distance',
    defaultPort: 'S1',
    suggestedPortType: 'sensor',
    educationalDescription: 'Sensor ultrasonik ini membantu robot mendeteksi jarak benda di depannya agar tidak menabrak.',
    roleExplanation: 'Memberikan indera penglihatan sonar seperti kelelawar untuk navigasi otomatis.',
    compatiblePorts: ['S1', 'S2'],
    snapPoints: [
      { id: 'back-clip', name: 'Stick Clip', type: 'stick-slot', offset: [0, 0, -0.2], normal: [0, 0, -1], compatibleTypes: ['pin', 'universal'] },
      { id: 'cable-port', name: 'Cable Socket', type: 'port', offset: [0, -0.25, 0], normal: [0, -1, 0], compatibleTypes: ['port', 'universal'] }
    ]
  },
  {
    type: 'light-sensor',
    name: 'Optical Light Sensor (LDR)',
    category: 'ELECTRONICS',
    description: 'Detects ambient sunlight brightness and shadow passes.',
    badgeEmoji: '☀️',
    compatibleWith: ['FUNNECT Core', 'Craft Stick'],
    dimensions: [0.5, 0.4, 0.3],
    color: '#3B82F6',
    materialType: 'electronics',
    defaultModuleId: 'mod-light',
    defaultPort: 'S1',
    suggestedPortType: 'sensor',
    educationalDescription: 'Sensor cahaya yang mengukur terang atau gelapnya ruangan seperti mata robot.',
    roleExplanation: 'Dapat digunakan untuk robot pengikut cahaya atau lampu otomatis saat malam.',
    compatiblePorts: ['S1', 'S2'],
    snapPoints: [
      { id: 'back-clip', name: 'Back Clip', type: 'stick-slot', offset: [0, 0, -0.15], normal: [0, 0, -1], compatibleTypes: ['pin', 'universal'] },
      { id: 'cable-port', name: 'Cable Socket', type: 'port', offset: [0, -0.2, 0], normal: [0, -1, 0], compatibleTypes: ['port', 'universal'] }
    ]
  },
  {
    type: 'temperature-sensor',
    name: 'Temperature & Climate Sensor',
    category: 'ELECTRONICS',
    description: 'Measures environmental temperature in Celsius with rapid thermistor probe.',
    badgeEmoji: '🌡️',
    compatibleWith: ['FUNNECT Core'],
    dimensions: [0.5, 0.4, 0.3],
    color: '#3B82F6',
    materialType: 'electronics',
    defaultModuleId: 'mod-temp',
    defaultPort: 'S2',
    suggestedPortType: 'sensor',
    snapPoints: [
      { id: 'back-clip', name: 'Clip Mount', type: 'stick-slot', offset: [0, 0, -0.15], normal: [0, 0, -1], compatibleTypes: ['pin', 'universal'] }
    ]
  },
  {
    type: 'button-module',
    name: 'Push Button Module',
    category: 'ELECTRONICS',
    description: 'Tactile pushbutton for user inputs, start signals, or bumper collisions.',
    badgeEmoji: '🔘',
    compatibleWith: ['FUNNECT Core'],
    dimensions: [0.5, 0.35, 0.5],
    color: '#1E293B',
    materialType: 'electronics',
    defaultModuleId: 'mod-button',
    defaultPort: 'S1',
    suggestedPortType: 'sensor',
    snapPoints: [
      { id: 'base-clip', name: 'Clip Mount', type: 'stick-slot', offset: [0, -0.15, 0], normal: [0, -1, 0], compatibleTypes: ['pin', 'universal'] }
    ]
  },
  {
    type: 'potentiometer-knob',
    name: 'Rotary Dial Potentiometer',
    category: 'ELECTRONICS',
    description: 'Rotating dial knob for speed control, crane hoist tuning, or dimmer input.',
    badgeEmoji: '🎛️',
    compatibleWith: ['FUNNECT Core'],
    dimensions: [0.6, 0.5, 0.6],
    color: '#475569',
    materialType: 'electronics',
    defaultModuleId: 'mod-potentiometer',
    defaultPort: 'S1',
    suggestedPortType: 'sensor',
    snapPoints: [
      { id: 'base-clip', name: 'Clip Mount', type: 'stick-slot', offset: [0, -0.2, 0], normal: [0, -1, 0], compatibleTypes: ['pin', 'universal'] }
    ]
  },
  {
    type: 'moisture-sensor',
    name: 'Soil Moisture Probe',
    category: 'ELECTRONICS',
    description: 'Two golden prongs measure soil water content for smart agriculture builds.',
    badgeEmoji: '💧',
    compatibleWith: ['FUNNECT Core'],
    dimensions: [0.4, 0.9, 0.15],
    color: '#0284C7',
    materialType: 'electronics',
    defaultModuleId: 'mod-moisture',
    defaultPort: 'S2',
    suggestedPortType: 'sensor',
    snapPoints: [
      { id: 'head-mount', name: 'Probe Head', type: 'pin', offset: [0, 0.4, 0], normal: [0, 1, 0], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },
  {
    type: 'rgb-led',
    name: 'Bright Multi-Color RGB LED',
    category: 'ELECTRONICS',
    description: 'Full-spectrum RGB diffuser bulb for headlights, indicators, and traffic signals.',
    badgeEmoji: '💡',
    compatibleWith: ['FUNNECT Core', 'Craft Stick'],
    dimensions: [0.45, 0.45, 0.45],
    color: '#EC4899',
    materialType: 'electronics',
    defaultModuleId: 'mod-led',
    defaultPort: 'O1',
    suggestedPortType: 'output',
    snapPoints: [
      { id: 'bottom-clip', name: 'Pin Clip', type: 'stick-slot', offset: [0, -0.2, 0], normal: [0, -1, 0], compatibleTypes: ['pin', 'universal'] }
    ]
  },
  {
    type: 'buzzer-siren',
    name: 'Piezo Buzzer Alarm',
    category: 'ELECTRONICS',
    description: 'Generates musical tones, beeps, and earthquake siren warnings.',
    badgeEmoji: '🔔',
    compatibleWith: ['FUNNECT Core'],
    dimensions: [0.45, 0.35, 0.45],
    color: '#10B981',
    materialType: 'electronics',
    defaultModuleId: 'mod-buzzer',
    defaultPort: 'O2',
    suggestedPortType: 'output',
    snapPoints: [
      { id: 'bottom-clip', name: 'Pin Clip', type: 'stick-slot', offset: [0, -0.15, 0], normal: [0, -1, 0], compatibleTypes: ['pin', 'universal'] }
    ]
  },

  // ==========================================
  // MOVEMENT
  // ==========================================
  {
    type: 'dc-motor',
    name: 'DC Gear Motor (Yellow 1:48)',
    category: 'MOVEMENT',
    description: 'High torque geared electric motor for driving wheels and conveyor rollers.',
    badgeEmoji: '⚙️',
    compatibleWith: ['DC Motor Clip Mount', 'Wheel', 'FUNNECT Core'],
    dimensions: [1.4, 0.5, 0.7],
    color: '#F97316',
    materialType: 'plastic-yellow',
    defaultModuleId: 'mod-dc-motor',
    defaultPort: 'M1',
    suggestedPortType: 'motor',
    educationalDescription: 'Motor listrik bertenaga yang memutar roda terus-menerus ke depan atau mundur.',
    roleExplanation: 'Memberikan tenaga dorong utama agar robot mobil bisa melaju di lantai.',
    compatiblePorts: ['M1', 'M2'],
    snapPoints: [
      { id: 'mount-body', name: 'Clip Bed', type: 'motor-mount', offset: [0, 0, 0], normal: [0, 1, 0], compatibleTypes: ['motor-mount', 'universal'] },
      { id: 'axle-shaft', name: 'Output Shaft', type: 'axle', offset: [0.75, 0, 0], normal: [1, 0, 0], compatibleTypes: ['axle', 'wheel', 'universal'] }
    ]
  },
  {
    type: 'servo-motor',
    name: 'Micro Servo Motor (SG90)',
    category: 'MOVEMENT',
    description: 'Precision angular actuator 0°–180° for steering, boom arms, and flower pivots.',
    badgeEmoji: '🦾',
    compatibleWith: ['Craft Stick', 'Swivel Hinge Connector', 'FUNNECT Core'],
    dimensions: [0.7, 0.8, 0.45],
    color: '#2563EB',
    materialType: 'plastic-blue',
    defaultModuleId: 'mod-servo',
    defaultPort: 'M2',
    suggestedPortType: 'motor',
    educationalDescription: 'Motor pintar dengan kendali sudut presisi (0° sampai 180°) seperti sendi siku.',
    roleExplanation: 'Digunakan untuk mengarahkan setir mobil, melambaikan tangan, atau membuka capit.',
    compatiblePorts: ['M1', 'M2', 'O1'],
    snapPoints: [
      { id: 'servo-horn', name: 'Rotating Horn', type: 'pin', offset: [0, 0.4, 0], normal: [0, 1, 0], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'ear-mount', name: 'Mounting Ears', type: 'pin', offset: [0, -0.3, 0], normal: [0, -1, 0], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },
  {
    type: 'wheel',
    name: 'Rubber Traction Wheel (65mm)',
    category: 'MOVEMENT',
    description: 'Rubber-treaded tire with yellow rim that snaps firmly onto motor shaft or bamboo axle.',
    badgeEmoji: '🛞',
    compatibleWith: ['DC Gear Motor', 'Bamboo Axle Stick'],
    dimensions: [1.3, 1.3, 0.35],
    color: '#334155',
    materialType: 'rubber',
    educationalDescription: 'Roda karet dengan cengkeraman kuat agar robot tidak slip di lantai licin.',
    roleExplanation: 'Mengubah putaran torsi motor menjadi laju gerakan robot.',
    snapPoints: [
      { id: 'center-hub', name: 'Axle Hub', type: 'axle', offset: [0, 0, 0], normal: [0, 0, 1], compatibleTypes: ['axle', 'universal'] }
    ]
  },
  {
    type: 'caster-wheel',
    name: 'Smooth Ball Caster',
    category: 'MOVEMENT',
    description: 'Omnidirectional steel caster ball for 3-point robot car balancing.',
    badgeEmoji: '⚪',
    compatibleWith: ['Cardboard Base Panel', 'Craft Stick'],
    dimensions: [0.6, 0.6, 0.6],
    color: '#94A3B8',
    materialType: 'rubber',
    snapPoints: [
      { id: 'top-mount', name: 'Caster Plate', type: 'pin', offset: [0, 0.25, 0], normal: [0, 1, 0], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },
  {
    type: 'axle-bushing',
    name: 'Smooth Axle Bushing',
    category: 'MOVEMENT',
    description: 'Low-friction sleeve collar for bamboo axles running through craft sticks.',
    badgeEmoji: '🔘',
    compatibleWith: ['Bamboo Axle Stick', 'Craft Stick'],
    dimensions: [0.35, 0.35, 0.3],
    color: '#1D64F2',
    materialType: 'plastic-blue',
    snapPoints: [
      { id: 'bore', name: 'Axle Bore', type: 'axle', offset: [0, 0, 0], normal: [1, 0, 0], compatibleTypes: ['axle', 'universal'] }
    ]
  },

  // ==========================================
  // SPECIAL SUB-ASSEMBLIES
  // ==========================================
  {
    type: 'wind-turbine-hub',
    name: '4-Blade Windmill Hub',
    category: 'SPECIAL',
    description: 'Pre-balanced aerodynamic 4-blade propeller hub for clean energy windmills.',
    badgeEmoji: '🌬️',
    compatibleWith: ['DC Gear Motor', 'Craft Stick'],
    dimensions: [2.8, 2.8, 0.4],
    color: '#E2E8F0',
    materialType: 'cardboard',
    snapPoints: [
      { id: 'rotor-shaft', name: 'Motor Shaft Socket', type: 'axle', offset: [0, 0, -0.2], normal: [0, 0, -1], compatibleTypes: ['axle', 'universal'] }
    ]
  },
  {
    type: 'sunflower-petal-head',
    name: 'Solar Sunflower Petal Disc',
    category: 'SPECIAL',
    description: 'Lightweight cardboard flower disc designed to hold light sensor on servo arm.',
    badgeEmoji: '🌻',
    compatibleWith: ['Micro Servo Motor', 'Optical Light Sensor (LDR)'],
    dimensions: [2.2, 2.2, 0.2],
    color: '#FACC15',
    materialType: 'cardboard',
    snapPoints: [
      { id: 'center-servo', name: 'Servo Horn Socket', type: 'pin', offset: [0, 0, -0.1], normal: [0, 0, -1], compatibleTypes: ['pin', 'universal'] },
      { id: 'front-sensor', name: 'Sensor Bed', type: 'port', offset: [0, 0, 0.1], normal: [0, 0, 1], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  },
  {
    type: 'barrier-boom-arm',
    name: 'Red & White Boom Barrier Arm',
    category: 'SPECIAL',
    description: 'Striped barrier gate arm with counterweight block for railway toll gates.',
    badgeEmoji: '🚧',
    compatibleWith: ['Micro Servo Motor'],
    dimensions: [3.2, 0.25, 0.12],
    color: '#DC2626',
    materialType: 'wood',
    snapPoints: [
      { id: 'pivot-hole', name: 'Servo Horn Socket', type: 'pin', offset: [-1.2, 0, 0], normal: [0, 0, 1], compatibleTypes: ['pin', 'universal'] }
    ]
  },
  {
    type: 'street-lamp-shade',
    name: 'Curved Street Lamp Shade',
    category: 'SPECIAL',
    description: 'Lamp shade canopy with built-in downward LED reflector cone.',
    badgeEmoji: '🏮',
    compatibleWith: ['Bright Multi-Color RGB LED', 'Craft Stick'],
    dimensions: [0.9, 0.6, 0.9],
    color: '#FEF08A',
    materialType: 'plastic-yellow',
    snapPoints: [
      { id: 'top-mount', name: 'Pole Mount', type: 'stick-slot', offset: [0, 0.25, 0], normal: [0, 1, 0], compatibleTypes: ['stick-slot', 'universal'] },
      { id: 'bulb-socket', name: 'LED Socket', type: 'port', offset: [0, -0.15, 0], normal: [0, -1, 0], compatibleTypes: ['stick-slot', 'universal'] }
    ]
  }
];

// Helper to lookup catalogue item
export const getCatalogueItem = (type: string): BuilderItemDef | undefined => {
  return BUILDER_ITEM_CATALOG.find(item => item.type === type);
};

// ==========================================
// PRESET BUILD TEMPLATES
// ==========================================
export const BUILD_TEMPLATES: BuildTemplate[] = [
  {
    id: 'template-robot-car',
    title: 'Smart Obstacle Robot Car',
    subtitle: 'Autonomous navigation with ultrasonic eyes & dual motors',
    badgeEmoji: '🚗',
    difficulty: 'Beginner',
    estimatedMinutes: 25,
    description: 'Build a two-wheel motorized chassis with a front caster ball. An ultrasonic sensor detects walls, steering the car around obstacles automatically.',
    materials: [
      { name: 'Craft Sticks', quantity: '8 pcs', category: 'craft', icon: 'Scissors' },
      { name: 'Corner Connectors', quantity: '4 pcs', category: 'connector', icon: 'Link' },
      { name: 'Core Mount', quantity: '1 pc', category: 'connector', icon: 'Cpu' },
      { name: 'Motor Mounts', quantity: '2 pcs', category: 'connector', icon: 'RotateCw' },
      { name: 'FUNNECT Core', quantity: '1 pc', category: 'electronics', icon: 'Cpu' },
      { name: 'DC Motors', quantity: '2 pcs', category: 'movement', icon: 'Cog' },
      { name: 'Rubber Wheels', quantity: '2 pcs', category: 'movement', icon: 'Circle' },
      { name: 'Caster Wheel', quantity: '1 pc', category: 'movement', icon: 'Circle' },
      { name: 'Distance Sensor', quantity: '1 pc', category: 'electronics', icon: 'Radio' }
    ],
    components: [
      // Chassis frame
      { id: 'c-frame-left', type: 'craft-stick', name: 'Left Rail', category: 'STRUCTURE', position: [-1.0, 0.8, 0], rotation: [0, 0, 0] },
      { id: 'c-frame-right', type: 'craft-stick', name: 'Right Rail', category: 'STRUCTURE', position: [1.0, 0.8, 0], rotation: [0, 0, 0] },
      { id: 'c-frame-front', type: 'craft-stick', name: 'Front Crossbar', category: 'STRUCTURE', position: [0, 0.8, 1.2], rotation: [0, Math.PI / 2, 0] },
      { id: 'c-frame-rear', type: 'craft-stick', name: 'Rear Crossbar', category: 'STRUCTURE', position: [0, 0.8, -1.2], rotation: [0, Math.PI / 2, 0] },
      // 4 Corner connectors
      { id: 'c-conn-fl', type: 'corner-connector', name: 'Front-Left Corner', category: 'CONNECTORS', position: [-1.0, 0.8, 1.2], rotation: [0, 0, 0] },
      { id: 'c-conn-fr', type: 'corner-connector', name: 'Front-Right Corner', category: 'CONNECTORS', position: [1.0, 0.8, 1.2], rotation: [0, -Math.PI / 2, 0] },
      { id: 'c-conn-rl', type: 'corner-connector', name: 'Rear-Left Corner', category: 'CONNECTORS', position: [-1.0, 0.8, -1.2], rotation: [0, Math.PI / 2, 0] },
      { id: 'c-conn-rr', type: 'corner-connector', name: 'Rear-Right Corner', category: 'CONNECTORS', position: [1.0, 0.8, -1.2], rotation: [0, Math.PI, 0] },
      // Core Mount & Core
      { id: 'c-core-mount', type: 'core-mount', name: 'Core Mount', category: 'CONNECTORS', position: [0, 0.88, 0], rotation: [0, 0, 0] },
      { id: 'c-core', type: 'funnect-core', name: 'FUNNECT Core', category: 'ELECTRONICS', position: [0, 1.25, 0], rotation: [0, 0, 0], isCore: true },
      // Motor Mounts & DC Motors
      { id: 'c-mount-ml', type: 'motor-mount', name: 'Left Motor Mount', category: 'CONNECTORS', position: [-1.0, 0.5, -0.6], rotation: [0, 0, 0] },
      { id: 'c-mount-mr', type: 'motor-mount', name: 'Right Motor Mount', category: 'CONNECTORS', position: [1.0, 0.5, -0.6], rotation: [0, Math.PI, 0] },
      { id: 'c-motor-l', type: 'dc-motor', name: 'Left DC Motor', category: 'MOVEMENT', position: [-1.2, 0.5, -0.6], rotation: [0, 0, 0], connectedPort: 'M1' },
      { id: 'c-motor-r', type: 'dc-motor', name: 'Right DC Motor', category: 'MOVEMENT', position: [1.2, 0.5, -0.6], rotation: [0, Math.PI, 0], connectedPort: 'M2' },
      // Wheels
      { id: 'c-wheel-l', type: 'wheel', name: 'Left Wheel', category: 'MOVEMENT', position: [-1.55, 0.5, -0.6], rotation: [0, Math.PI / 2, 0] },
      { id: 'c-wheel-r', type: 'wheel', name: 'Right Wheel', category: 'MOVEMENT', position: [1.55, 0.5, -0.6], rotation: [0, -Math.PI / 2, 0] },
      { id: 'c-caster', type: 'caster-wheel', name: 'Front Caster Ball', category: 'MOVEMENT', position: [0, 0.35, 1.1], rotation: [0, 0, 0] },
      // Distance sensor
      { id: 'c-sensor-dist', type: 'distance-sensor', name: 'Distance Sensor', category: 'ELECTRONICS', position: [0, 1.05, 1.45], rotation: [0, 0, 0], connectedPort: 'S1' }
    ],
    connections: [
      { id: 'w1', fromComponentId: 'c-core', fromPort: 'S1', toComponentId: 'c-sensor-dist', wireColor: '#3B82F6', wireType: 'sensor' },
      { id: 'w2', fromComponentId: 'c-core', fromPort: 'M1', toComponentId: 'c-motor-l', wireColor: '#F97316', wireType: 'motor' },
      { id: 'w3', fromComponentId: 'c-core', fromPort: 'M2', toComponentId: 'c-motor-r', wireColor: '#F97316', wireType: 'motor' }
    ],
    guideSteps: [
      { stepNumber: 1, title: 'Assemble Base Chassis', instruction: 'Connect 4 craft sticks with 4 corner connectors to form a rigid rectangular bed.', targetComponentType: 'craft-stick', parts: ['4 × Sticks', '4 × Corner Connectors'] },
      { stepNumber: 2, title: 'Install Motor Mounts & Motors', instruction: 'Snap 2 motor mounts under the side rails and slide in the left and right DC motors.', targetComponentType: 'dc-motor', parts: ['2 × Motor Mounts', '2 × DC Motors'] },
      { stepNumber: 3, title: 'Attach Wheels & Front Caster', instruction: 'Press the rubber wheels onto the motor shafts and clip the caster ball under the front bumper.', targetComponentType: 'wheel', parts: ['2 × Wheels', '1 × Caster Ball'] },
      { stepNumber: 4, title: 'Mount FUNNECT Core', instruction: 'Snap the Core Mount to the top rails, then firmly seat the FUNNECT Core controller.', targetComponentType: 'funnect-core', parts: ['1 × Core Mount', '1 × FUNNECT Core'] },
      { stepNumber: 5, title: 'Install Distance Sensor & Wire Up', instruction: 'Mount the distance sensor on the front nose and plug cables into S1, M1, and M2.', targetComponentType: 'distance-sensor', parts: ['1 × Distance Sensor', '3 × Cables'] }
    ]
  },
  {
    id: 'template-solar-sunflower',
    title: 'Smart Solar Sunflower',
    subtitle: 'Follow sunlight dynamically for maximum clean energy',
    badgeEmoji: '🌻',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    description: 'A sunflower structure pivoting on a micro servo. A light sensor reads illumination and turns the solar disc directly to face the sun.',
    materials: [
      { name: 'Craft Sticks', quantity: '10 pcs', category: 'craft', icon: 'Scissors' },
      { name: 'Corner Connectors', quantity: '6 pcs', category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', category: 'electronics', icon: 'Cpu' },
      { name: 'Micro Servo Motor', quantity: '1 pc', category: 'movement', icon: 'RotateCw' },
      { name: 'Sunflower Disc', quantity: '1 pc', category: 'craft', icon: 'Sun' },
      { name: 'Light Sensor', quantity: '1 pc', category: 'electronics', icon: 'SunMedium' }
    ],
    components: [
      // Planter Base
      { id: 's-base-1', type: 'craft-stick', name: 'Base Beam 1', category: 'STRUCTURE', position: [-0.9, 0.15, 0], rotation: [0, 0, 0] },
      { id: 's-base-2', type: 'craft-stick', name: 'Base Beam 2', category: 'STRUCTURE', position: [0.9, 0.15, 0], rotation: [0, 0, 0] },
      { id: 's-base-3', type: 'craft-stick', name: 'Base Cross 1', category: 'STRUCTURE', position: [0, 0.15, -0.9], rotation: [0, Math.PI / 2, 0] },
      { id: 's-base-4', type: 'craft-stick', name: 'Base Cross 2', category: 'STRUCTURE', position: [0, 0.15, 0.9], rotation: [0, Math.PI / 2, 0] },
      // Twin Upright Masts
      { id: 's-mast-l', type: 'craft-stick', name: 'Left Mast', category: 'STRUCTURE', position: [-0.5, 1.6, 0], rotation: [0, 0, Math.PI / 2] },
      { id: 's-mast-r', type: 'craft-stick', name: 'Right Mast', category: 'STRUCTURE', position: [0.5, 1.6, 0], rotation: [0, 0, Math.PI / 2] },
      // Top Servo Mount & Servo
      { id: 's-servo', type: 'servo-motor', name: 'Sunflower Servo', category: 'MOVEMENT', position: [0, 2.8, 0], rotation: [0, 0, 0], connectedPort: 'M1' },
      // Sunflower Head
      { id: 's-head', type: 'sunflower-petal-head', name: 'Cardboard Petal Disc', category: 'SPECIAL', position: [0, 2.8, 0.35], rotation: [0, 0, 0] },
      { id: 's-sensor', type: 'light-sensor', name: 'Sunlight Sensor', category: 'ELECTRONICS', position: [0, 2.8, 0.55], rotation: [0, 0, 0], connectedPort: 'S1' },
      // Core
      { id: 's-core', type: 'funnect-core', name: 'FUNNECT Core', category: 'ELECTRONICS', position: [0, 0.45, 1.4], rotation: [0, 0, 0], isCore: true }
    ],
    connections: [
      { id: 'sw1', fromComponentId: 's-core', fromPort: 'S1', toComponentId: 's-sensor', wireColor: '#3B82F6', wireType: 'sensor' },
      { id: 'sw2', fromComponentId: 's-core', fromPort: 'M1', toComponentId: 's-servo', wireColor: '#F97316', wireType: 'motor' }
    ],
    guideSteps: [
      { stepNumber: 1, title: 'Build Planter Base', instruction: 'Form a square foundation with 4 craft sticks and corner connectors.', targetComponentType: 'craft-stick', parts: ['4 × Sticks', '4 × Connectors'] },
      { stepNumber: 2, title: 'Erect Twin Stem Masts', instruction: 'Mount two vertical sticks upright to form the stem support tower.', targetComponentType: 'craft-stick', parts: ['2 × Sticks'] },
      { stepNumber: 3, title: 'Mount Micro Servo', instruction: 'Fasten the micro servo at the top of the stem facing forward.', targetComponentType: 'servo-motor', parts: ['1 × Micro Servo'] },
      { stepNumber: 4, title: 'Attach Sunflower Petal Disc', instruction: 'Press the cardboard disc and light sensor module onto the servo arm.', targetComponentType: 'sunflower-petal-head', parts: ['1 × Disc', '1 × Light Sensor'] },
      { stepNumber: 5, title: 'Connect to Core', instruction: 'Seat the Core on the base and connect Light Sensor to S1 and Servo to M1.', targetComponentType: 'funnect-core', parts: ['FUNNECT Core', '2 × Cables'] }
    ]
  },
  {
    id: 'template-boom-barrier',
    title: 'Automatic Railway Boom Barrier',
    subtitle: 'Ultrasonic proximity trigger with traffic signal & servo gate',
    badgeEmoji: '🚧',
    difficulty: 'Intermediate',
    estimatedMinutes: 25,
    description: 'An automated railway crossing gate. When an approaching car is detected by the ultrasonic sensor, the boom barrier raises and signal LED switches from red to green.',
    materials: [
      { name: 'Craft Sticks', quantity: '12 pcs', category: 'craft', icon: 'Scissors' },
      { name: 'Corner Connectors', quantity: '4 pcs', category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', category: 'electronics', icon: 'Cpu' },
      { name: 'Micro Servo Motor', quantity: '1 pc', category: 'movement', icon: 'RotateCw' },
      { name: 'Boom Barrier Arm', quantity: '1 pc', category: 'craft', icon: 'Shield' },
      { name: 'Distance Sensor', quantity: '1 pc', category: 'electronics', icon: 'Radio' },
      { name: 'RGB LED', quantity: '1 pc', category: 'electronics', icon: 'Lightbulb' }
    ],
    components: [
      // Pillar tower
      { id: 'b-post-l', type: 'craft-stick', name: 'Left Pillar', category: 'STRUCTURE', position: [-1.2, 1.4, -0.3], rotation: [0, 0, Math.PI / 2] },
      { id: 'b-post-r', type: 'craft-stick', name: 'Right Pillar', category: 'STRUCTURE', position: [-1.2, 1.4, 0.3], rotation: [0, 0, Math.PI / 2] },
      // Micro servo
      { id: 'b-servo', type: 'servo-motor', name: 'Barrier Servo', category: 'MOVEMENT', position: [-1.2, 2.2, 0], rotation: [0, 0, 0], connectedPort: 'M1' },
      // Boom arm
      { id: 'b-arm', type: 'barrier-boom-arm', name: 'Striped Boom Arm', category: 'SPECIAL', position: [0.3, 2.2, 0.3], rotation: [0, 0, 0] },
      // Signal LED
      { id: 'b-led', type: 'rgb-led', name: 'Traffic Signal LED', category: 'ELECTRONICS', position: [-1.2, 2.8, 0], rotation: [0, 0, 0], connectedPort: 'O1' },
      // Distance sensor
      { id: 'b-sensor', type: 'distance-sensor', name: 'Car Detector', category: 'ELECTRONICS', position: [-1.2, 0.8, 1.1], rotation: [0, 0, 0], connectedPort: 'S1' },
      // Core
      { id: 'b-core', type: 'funnect-core', name: 'FUNNECT Core', category: 'ELECTRONICS', position: [-1.8, 0.45, 0], rotation: [0, 0, 0], isCore: true }
    ],
    connections: [
      { id: 'bw1', fromComponentId: 'b-core', fromPort: 'S1', toComponentId: 'b-sensor', wireColor: '#3B82F6', wireType: 'sensor' },
      { id: 'bw2', fromComponentId: 'b-core', fromPort: 'M1', toComponentId: 'b-servo', wireColor: '#F97316', wireType: 'motor' },
      { id: 'bw3', fromComponentId: 'b-core', fromPort: 'O1', toComponentId: 'b-led', wireColor: '#EC4899', wireType: 'output' }
    ],
    guideSteps: [
      { stepNumber: 1, title: 'Build Pillar Tower', instruction: 'Construct a twin-post upright column using craft sticks.', targetComponentType: 'craft-stick', parts: ['4 × Sticks'] },
      { stepNumber: 2, title: 'Install Micro Servo', instruction: 'Mount the micro servo securely at gate pivot height.', targetComponentType: 'servo-motor', parts: ['1 × Micro Servo'] },
      { stepNumber: 3, title: 'Attach Striped Barrier Arm', instruction: 'Press the red-and-white boom gate bar onto the servo horn.', targetComponentType: 'barrier-boom-arm', parts: ['1 × Boom Arm'] },
      { stepNumber: 4, title: 'Mount Sensors & Signal LED', instruction: 'Position the distance sensor at road height and LED at tower apex.', targetComponentType: 'distance-sensor', parts: ['1 × Distance Sensor', '1 × RGB LED'] },
      { stepNumber: 5, title: 'Plug into FUNNECT Core', instruction: 'Connect Sensor (S1), Servo (M1), and Traffic LED (O1).', targetComponentType: 'funnect-core', parts: ['FUNNECT Core', '3 × Cables'] }
    ]
  },
  {
    id: 'template-wind-turbine',
    title: 'Clean Energy Wind Turbine',
    subtitle: 'Lattice truss tower with aerodynamic rotating blades',
    badgeEmoji: '🌬️',
    difficulty: 'Intermediate',
    estimatedMinutes: 30,
    description: 'A tall A-frame wind generator. Demonstrates structural triangulation and kinetic energy generation using a DC motor rotor.',
    materials: [
      { name: 'Craft Sticks', quantity: '14 pcs', category: 'craft', icon: 'Scissors' },
      { name: 'Connectors', quantity: '8 pcs', category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', category: 'electronics', icon: 'Cpu' },
      { name: 'DC Motor Generator', quantity: '1 pc', category: 'movement', icon: 'Cog' },
      { name: '4-Blade Wind Hub', quantity: '1 pc', category: 'craft', icon: 'Sun' }
    ],
    components: [
      // 3-legged A-frame tower
      { id: 'w-leg-1', type: 'craft-stick', name: 'Tower Leg A', category: 'STRUCTURE', position: [-0.7, 1.8, -0.5], rotation: [0.15, 0, 0.2] },
      { id: 'w-leg-2', type: 'craft-stick', name: 'Tower Leg B', category: 'STRUCTURE', position: [0.7, 1.8, -0.5], rotation: [0.15, 0, -0.2] },
      { id: 'w-leg-3', type: 'craft-stick', name: 'Tower Leg C', category: 'STRUCTURE', position: [0, 1.8, 0.7], rotation: [-0.2, 0, 0] },
      // Cross braces
      { id: 'w-brace-1', type: 'short-stick', name: 'Cross Brace A', category: 'STRUCTURE', position: [0, 1.0, -0.5], rotation: [0, Math.PI / 2, 0] },
      // Top DC Motor Generator
      { id: 'w-motor', type: 'dc-motor', name: 'DC Generator', category: 'MOVEMENT', position: [0, 3.4, 0], rotation: [0, 0, 0], connectedPort: 'M1' },
      // Blade Hub
      { id: 'w-blades', type: 'wind-turbine-hub', name: 'Windmill Rotor Hub', category: 'SPECIAL', position: [0, 3.4, 0.6], rotation: [0, 0, 0] },
      // Core
      { id: 'w-core', type: 'funnect-core', name: 'FUNNECT Core', category: 'ELECTRONICS', position: [0, 0.45, 1.3], rotation: [0, 0, 0], isCore: true }
    ],
    connections: [
      { id: 'ww1', fromComponentId: 'w-core', fromPort: 'M1', toComponentId: 'w-motor', wireColor: '#F97316', wireType: 'motor' }
    ],
    guideSteps: [
      { stepNumber: 1, title: 'Build Tripod Mast Base', instruction: 'Stand 3 craft sticks angled together at the apex.', targetComponentType: 'craft-stick', parts: ['3 × Sticks'] },
      { stepNumber: 2, title: 'Add Horizontal Cross Braces', instruction: 'Fasten short sticks horizontally for torsional rigidity.', targetComponentType: 'short-stick', parts: ['3 × Short Sticks'] },
      { stepNumber: 3, title: 'Mount DC Motor Nacelle', instruction: 'Secure the motor horizontally at the tower top.', targetComponentType: 'dc-motor', parts: ['1 × DC Motor'] },
      { stepNumber: 4, title: 'Press Rotor Fan Blades', instruction: 'Attach the 4-blade aerodynamic hub onto the motor spindle.', targetComponentType: 'wind-turbine-hub', parts: ['1 × Rotor Hub'] },
      { stepNumber: 5, title: 'Connect to Core', instruction: 'Connect the generator motor to Port M1 on the FUNNECT Core.', targetComponentType: 'funnect-core', parts: ['FUNNECT Core', '1 × Cable'] }
    ]
  },
  {
    id: 'template-street-light',
    title: 'Smart Solar Street Light',
    subtitle: 'Automatic dusk-to-dawn energy saving lighting system',
    badgeEmoji: '💡',
    difficulty: 'Beginner',
    estimatedMinutes: 20,
    description: 'A realistic street lamp post. When darkness falls, the light sensor triggers the overhead high-efficiency LED automatically.',
    materials: [
      { name: 'Craft Sticks', quantity: '8 pcs', category: 'craft', icon: 'Scissors' },
      { name: 'Connectors', quantity: '4 pcs', category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', category: 'electronics', icon: 'Cpu' },
      { name: 'RGB LED', quantity: '1 pc', category: 'electronics', icon: 'Lightbulb' },
      { name: 'Light Sensor', quantity: '1 pc', category: 'electronics', icon: 'SunMedium' },
      { name: 'Lamp Shade', quantity: '1 pc', category: 'craft', icon: 'Layers' }
    ],
    components: [
      // Base
      { id: 'l-base-1', type: 'craft-stick', name: 'Base Beam X', category: 'STRUCTURE', position: [0, 0.15, 0], rotation: [0, Math.PI / 4, 0] },
      { id: 'l-base-2', type: 'craft-stick', name: 'Base Beam Y', category: 'STRUCTURE', position: [0, 0.15, 0], rotation: [0, -Math.PI / 4, 0] },
      // Tall mast post
      { id: 'l-post', type: 'long-stick', name: 'Vertical Pole', category: 'STRUCTURE', position: [0, 2.0, 0], rotation: [0, 0, Math.PI / 2] },
      // Cantilever arm
      { id: 'l-arm', type: 'craft-stick', name: 'Overhang Arm', category: 'STRUCTURE', position: [0.7, 3.8, 0], rotation: [0, 0, 0.35] },
      // Lamp shade & LED
      { id: 'l-shade', type: 'street-lamp-shade', name: 'Lamp Shade Hood', category: 'SPECIAL', position: [1.4, 3.6, 0], rotation: [0, 0, 0] },
      { id: 'l-led', type: 'rgb-led', name: 'Street LED Bulb', category: 'ELECTRONICS', position: [1.4, 3.4, 0], rotation: [0, 0, 0], connectedPort: 'O1' },
      // Light sensor on pole
      { id: 'l-sensor', type: 'light-sensor', name: 'Ambient Light Sensor', category: 'ELECTRONICS', position: [0, 2.4, 0.25], rotation: [0, 0, 0], connectedPort: 'S1' },
      // Core
      { id: 'l-core', type: 'funnect-core', name: 'FUNNECT Core', category: 'ELECTRONICS', position: [-0.9, 0.45, 0], rotation: [0, 0, 0], isCore: true }
    ],
    connections: [
      { id: 'lw1', fromComponentId: 'l-core', fromPort: 'S1', toComponentId: 'l-sensor', wireColor: '#3B82F6', wireType: 'sensor' },
      { id: 'lw2', fromComponentId: 'l-core', fromPort: 'O1', toComponentId: 'l-led', wireColor: '#EC4899', wireType: 'output' }
    ],
    guideSteps: [
      { stepNumber: 1, title: 'Build Cross Base', instruction: 'Cross two craft sticks at 90 degrees with a center bracket.', targetComponentType: 'craft-stick', parts: ['2 × Sticks'] },
      { stepNumber: 2, title: 'Erect Lamp Post', instruction: 'Mount the tall stick upright and brace it firmly.', targetComponentType: 'long-stick', parts: ['1 × Long Stick'] },
      { stepNumber: 3, title: 'Add Overhanging Cantilever', instruction: 'Angle a craft stick forward to hold the lantern above the street.', targetComponentType: 'craft-stick', parts: ['1 × Stick'] },
      { stepNumber: 4, title: 'Install Lamp Shade & LED', instruction: 'Mount the shade hood and insert the high-output LED.', targetComponentType: 'street-lamp-shade', parts: ['1 × Shade', '1 × RGB LED'] },
      { stepNumber: 5, title: 'Wire to Core & Light Sensor', instruction: 'Clip Light Sensor to S1 and LED to O1 on the FUNNECT Core.', targetComponentType: 'funnect-core', parts: ['FUNNECT Core', '2 × Cables'] }
    ]
  }
];
