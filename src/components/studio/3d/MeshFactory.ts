import * as THREE from 'three';
import { PlacedComponent } from '../../../types/builder';
import { getCatalogueItem } from '../../../data/builderData';

// Shared Material Cache for Peak Rendering Performance & High Visual Quality
const createScreenTexture = (isSimulating: boolean): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  
  // High-contrast OLED dark background
  ctx.fillStyle = '#090D16';
  ctx.fillRect(0, 0, 256, 128);

  // Subtle digital grid
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 1;
  for (let x = 0; x < 256; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 128);
    ctx.stroke();
  }

  // Brand header
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('FUNNECT OS v2.4', 16, 26);

  // Friendly Robot Face or Status Waveform
  if (isSimulating) {
    ctx.fillStyle = '#4ADE80';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('^ ‿ ^', 72, 78);
    ctx.fillStyle = '#A7F3D0';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('● SYSTEM ACTIVE', 68, 108);
  } else {
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 34px monospace';
    ctx.fillText('• ‿ •', 74, 76);
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('STANDBY · READY', 66, 108);
  }

  // Battery bar top right
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 2;
  ctx.strokeRect(196, 12, 40, 16);
  ctx.fillStyle = '#38BDF8';
  ctx.fillRect(200, 15, 26, 10);
  ctx.fillRect(237, 16, 3, 8);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};

const materialsCache = {
  wood: new THREE.MeshStandardMaterial({
    color: 0xE2BA8A,
    roughness: 0.65,
    metalness: 0.02
  }),
  darkWood: new THREE.MeshStandardMaterial({
    color: 0xB88448,
    roughness: 0.75,
    metalness: 0.05
  }),
  cardboard: new THREE.MeshStandardMaterial({
    color: 0xD4A373,
    roughness: 0.85,
    metalness: 0.0
  }),
  plasticBlue: new THREE.MeshStandardMaterial({
    color: 0x2563EB,
    roughness: 0.28,
    metalness: 0.12
  }),
  plasticYellow: new THREE.MeshStandardMaterial({
    color: 0xFBBF24,
    roughness: 0.25,
    metalness: 0.15
  }),
  plasticOrange: new THREE.MeshStandardMaterial({
    color: 0xF97316,
    roughness: 0.28,
    metalness: 0.1
  }),
  plasticPurple: new THREE.MeshStandardMaterial({
    color: 0x8B5CF6,
    roughness: 0.3,
    metalness: 0.1
  }),
  plasticServoBlue: new THREE.MeshPhysicalMaterial({
    color: 0x1D4ED8,
    roughness: 0.15,
    metalness: 0.08,
    transmission: 0.35,
    opacity: 0.95,
    transparent: true,
    reflectivity: 0.6
  }),
  coreCasing: new THREE.MeshStandardMaterial({
    color: 0xF1F5F9,
    roughness: 0.2,
    metalness: 0.15
  }),
  coreFace: new THREE.MeshStandardMaterial({
    color: 0x0B1120,
    roughness: 0.25,
    metalness: 0.4
  }),
  rubberTire: new THREE.MeshStandardMaterial({
    color: 0x1E293B,
    roughness: 0.82,
    metalness: 0.08
  }),
  wheelRim: new THREE.MeshStandardMaterial({
    color: 0xFACC15,
    roughness: 0.25,
    metalness: 0.25
  }),
  metalShaft: new THREE.MeshStandardMaterial({
    color: 0xE2E8F0,
    roughness: 0.15,
    metalness: 0.92
  }),
  goldContact: new THREE.MeshStandardMaterial({
    color: 0xF59E0B,
    roughness: 0.2,
    metalness: 0.85
  }),
  ledOff: new THREE.MeshPhysicalMaterial({
    color: 0x94A3B8,
    roughness: 0.1,
    transmission: 0.7,
    transparent: true
  }),
  ledOn: new THREE.MeshStandardMaterial({
    color: 0x38BDF8,
    emissive: 0x0284C7,
    emissiveIntensity: 1.2,
    roughness: 0.15
  }),
  ledGreen: new THREE.MeshStandardMaterial({
    color: 0x4ADE80,
    emissive: 0x16A34A,
    emissiveIntensity: 1.2,
    roughness: 0.15
  }),
  redStripe: new THREE.MeshStandardMaterial({
    color: 0xEF4444,
    roughness: 0.35
  }),
  whiteStripe: new THREE.MeshStandardMaterial({
    color: 0xF8FAFC,
    roughness: 0.35
  }),
  selectedOutline: new THREE.MeshBasicMaterial({
    color: 0x3B82F6,
    wireframe: true,
    transparent: true,
    opacity: 0.7
  }),
  snapPointReady: new THREE.MeshBasicMaterial({
    color: 0x10B981,
    wireframe: false,
    transparent: true,
    opacity: 0.9
  }),
  snapPointHover: new THREE.MeshBasicMaterial({
    color: 0xF59E0B,
    wireframe: false,
    transparent: true,
    opacity: 0.95
  })
};

/**
 * Creates a visually stunning, realistic yet classroom-friendly 3D mesh representation
 * of any FUNNECT component.
 */
export function createComponentMesh(
  comp: PlacedComponent,
  isSelected: boolean = false,
  isHovered: boolean = false,
  isSimulating: boolean = false,
  simProgress: number = 0
): THREE.Group {
  const group = new THREE.Group();
  group.name = comp.id;
  group.userData = { componentId: comp.id, type: comp.type, category: comp.category };

  const itemDef = getCatalogueItem(comp.type);
  const color = comp.color || (itemDef ? itemDef.color : '#1D64F2');

  // Build specific geometry based on component type
  switch (comp.type) {
    // ----------------------------------------------------
    // STICKS & TIMBER
    // ----------------------------------------------------
    case 'craft-stick': {
      // Craft stick with smooth rounded ends
      const length = 2.4;
      const thickness = 0.08;
      const width = 0.28;

      const bodyGeo = new THREE.BoxGeometry(length - width, thickness, width);
      const bodyMesh = new THREE.Mesh(bodyGeo, materialsCache.wood);
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      group.add(bodyMesh);

      // End caps (half-cylinders / rounded ends)
      const capGeo = new THREE.CylinderGeometry(width / 2, width / 2, thickness, 16);
      const leftCap = new THREE.Mesh(capGeo, materialsCache.wood);
      leftCap.position.x = -(length - width) / 2;
      leftCap.castShadow = true;
      group.add(leftCap);

      const rightCap = new THREE.Mesh(capGeo, materialsCache.wood);
      rightCap.position.x = (length - width) / 2;
      rightCap.castShadow = true;
      group.add(rightCap);

      // Subtle pin holes in stick ends
      const holeGeo = new THREE.CylinderGeometry(0.04, 0.04, thickness + 0.01, 12);
      const holeMat = materialsCache.darkWood;
      const holeL = new THREE.Mesh(holeGeo, holeMat);
      holeL.position.x = -1.0;
      group.add(holeL);
      const holeR = new THREE.Mesh(holeGeo, holeMat);
      holeR.position.x = 1.0;
      group.add(holeR);
      const holeC = new THREE.Mesh(holeGeo, holeMat);
      group.add(holeC);
      break;
    }

    case 'long-stick': {
      const length = 3.8;
      const thickness = 0.08;
      const width = 0.28;
      const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(length - width, thickness, width), materialsCache.wood);
      bodyMesh.castShadow = true;
      group.add(bodyMesh);

      const capGeo = new THREE.CylinderGeometry(width / 2, width / 2, thickness, 16);
      const leftCap = new THREE.Mesh(capGeo, materialsCache.wood);
      leftCap.position.x = -(length - width) / 2;
      group.add(leftCap);
      const rightCap = new THREE.Mesh(capGeo, materialsCache.wood);
      rightCap.position.x = (length - width) / 2;
      group.add(rightCap);
      break;
    }

    case 'short-stick': {
      const length = 1.4;
      const thickness = 0.08;
      const width = 0.28;
      const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(length - width, thickness, width), materialsCache.wood);
      bodyMesh.castShadow = true;
      group.add(bodyMesh);

      const capGeo = new THREE.CylinderGeometry(width / 2, width / 2, thickness, 16);
      const leftCap = new THREE.Mesh(capGeo, materialsCache.wood);
      leftCap.position.x = -(length - width) / 2;
      group.add(leftCap);
      const rightCap = new THREE.Mesh(capGeo, materialsCache.wood);
      rightCap.position.x = (length - width) / 2;
      group.add(rightCap);
      break;
    }

    case 'bamboo-stick': {
      const skewerGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.8, 16);
      skewerGeo.rotateZ(Math.PI / 2);
      const skewerMesh = new THREE.Mesh(skewerGeo, materialsCache.darkWood);
      skewerMesh.castShadow = true;
      group.add(skewerMesh);
      break;
    }

    case 'cardboard-panel': {
      const cardGeo = new THREE.BoxGeometry(3.4, 0.08, 2.6);
      const cardMesh = new THREE.Mesh(cardGeo, materialsCache.cardboard);
      cardMesh.castShadow = true;
      cardMesh.receiveShadow = true;
      group.add(cardMesh);
      break;
    }

    // ----------------------------------------------------
    // CONNECTORS
    // ----------------------------------------------------
    case 'straight-connector': {
      const hubGeo = new THREE.BoxGeometry(0.8, 0.35, 0.42);
      const hubMesh = new THREE.Mesh(hubGeo, materialsCache.plasticBlue);
      hubMesh.castShadow = true;
      group.add(hubMesh);

      // Slot indicators
      const slotGeo = new THREE.BoxGeometry(0.25, 0.1, 0.3);
      const slotMat = materialsCache.coreFace;
      const slotA = new THREE.Mesh(slotGeo, slotMat);
      slotA.position.x = -0.3;
      group.add(slotA);
      const slotB = new THREE.Mesh(slotGeo, slotMat);
      slotB.position.x = 0.3;
      group.add(slotB);
      break;
    }

    case 'corner-connector': {
      // L-bracket
      const bar1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.35), materialsCache.plasticBlue);
      bar1.position.set(0.18, 0, 0);
      bar1.castShadow = true;
      group.add(bar1);

      const bar2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.7), materialsCache.plasticBlue);
      bar2.position.set(0, 0, 0.18);
      bar2.castShadow = true;
      group.add(bar2);

      // Central corner fillet
      const cornerMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.35, 12), materialsCache.plasticBlue);
      cornerMesh.position.set(0, 0, 0);
      group.add(cornerMesh);
      break;
    }

    case 't-connector': {
      const stem = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.6), materialsCache.plasticYellow);
      stem.position.set(0, 0, 0.25);
      group.add(stem);
      const topBar = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.35), materialsCache.plasticYellow);
      group.add(topBar);
      break;
    }

    case 'cross-connector': {
      const barX = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.35, 0.35), materialsCache.plasticBlue);
      const barZ = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.9), materialsCache.plasticBlue);
      group.add(barX);
      group.add(barZ);
      break;
    }

    case 'angle-connector': {
      const baseArm = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.6), materialsCache.plasticYellow);
      baseArm.position.set(0, 0, -0.2);
      group.add(baseArm);

      const diagArm = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.6), materialsCache.plasticYellow);
      diagArm.rotation.y = Math.PI / 4;
      diagArm.position.set(0.18, 0, 0.18);
      group.add(diagArm);
      break;
    }

    case 'hinge-connector': {
      const hingeA = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.25, 16), materialsCache.plasticBlue);
      hingeA.position.y = 0.1;
      group.add(hingeA);
      const hingeB = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.25, 16), materialsCache.plasticYellow);
      hingeB.position.y = -0.1;
      group.add(hingeB);
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 12), materialsCache.metalShaft);
      group.add(pin);
      break;
    }

    case 'core-mount': {
      // Cradle bed
      const bed = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.18, 1.9), materialsCache.plasticBlue);
      group.add(bed);

      // 4 corner retention tabs
      const tabGeo = new THREE.BoxGeometry(0.2, 0.35, 0.2);
      [[-1.15, -0.85], [1.15, -0.85], [-1.15, 0.85], [1.15, 0.85]].forEach(([x, z]) => {
        const tab = new THREE.Mesh(tabGeo, materialsCache.plasticBlue);
        tab.position.set(x, 0.15, z);
        group.add(tab);
      });
      break;
    }

    case 'motor-mount': {
      // C-clamp mount for DC gear motor
      const clampBed = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.15, 0.8), materialsCache.plasticOrange);
      group.add(clampBed);
      const sideWallL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.55, 0.8), materialsCache.plasticOrange);
      sideWallL.position.set(-0.52, 0.2, 0);
      group.add(sideWallL);
      const sideWallR = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.55, 0.8), materialsCache.plasticOrange);
      sideWallR.position.set(0.52, 0.2, 0);
      group.add(sideWallR);
      break;
    }

    // ----------------------------------------------------
    // FUNNECT CORE
    // ----------------------------------------------------
    case 'funnect-core': {
      // Main rounded white controller body with beveled look
      const coreBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.65, 1.8), materialsCache.coreCasing);
      coreBody.castShadow = true;
      coreBody.receiveShadow = true;
      group.add(coreBody);

      // Sleek top bezel plate
      const topBezel = new THREE.Mesh(new THREE.BoxGeometry(2.26, 0.04, 1.66), materialsCache.plasticBlue);
      topBezel.position.y = 0.33;
      group.add(topBezel);

      // OLED Screen with dynamic graphics
      const screenMat = new THREE.MeshBasicMaterial({
        map: createScreenTexture(isSimulating),
        transparent: false
      });
      const oledScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), screenMat);
      oledScreen.rotation.x = -Math.PI / 2;
      oledScreen.position.set(0, 0.355, 0.1);
      group.add(oledScreen);

      // Brand accent badge on top
      const brandStripe = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.18), materialsCache.plasticYellow);
      brandStripe.position.set(0, 0.352, -0.65);
      group.add(brandStripe);

      // Power switch toggle
      const switchBase = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.05, 0.12), materialsCache.coreFace);
      switchBase.position.set(0.85, 0.352, -0.65);
      group.add(switchBase);
      const switchKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.08, 12), materialsCache.plasticOrange);
      switchKnob.position.set(0.85, 0.38, -0.65);
      group.add(switchKnob);

      // Status LED (glows vibrant green when simulating, blue on standby)
      const ledGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.08, 16);
      const ledMat = isSimulating ? materialsCache.ledGreen : materialsCache.ledOn;
      const statusLed = new THREE.Mesh(ledGeo, ledMat);
      statusLed.position.set(-0.85, 0.36, -0.65);
      group.add(statusLed);

      // 6 Distinct Ports (S1, S2, M1, M2, O1, O2) with labeled colored sockets & gold pin holes
      const portSocketGeo = new THREE.BoxGeometry(0.36, 0.28, 0.16);
      const pinHoleGeo = new THREE.BoxGeometry(0.06, 0.1, 0.08);

      const sensorMat = materialsCache.plasticBlue;
      const motorMat = materialsCache.plasticOrange;
      const outputMat = materialsCache.plasticPurple;

      // S1 & S2 on Front Lip (Sensors - Cyan Blue)
      const addPort = (x: number, y: number, z: number, mat: THREE.Material, rotY = 0) => {
        const socket = new THREE.Mesh(portSocketGeo, mat);
        socket.position.set(x, y, z);
        socket.rotation.y = rotY;
        socket.castShadow = true;
        group.add(socket);

        // Gold contact pins inside
        const pin = new THREE.Mesh(pinHoleGeo, materialsCache.goldContact);
        pin.position.set(x, y, z + (z > 0 ? 0.05 : -0.05));
        pin.rotation.y = rotY;
        group.add(pin);
      };

      // S1 & S2 (Front)
      addPort(-0.7, 0, 0.9, sensorMat);
      addPort(0.7, 0, 0.9, sensorMat);

      // M1 & M2 (Back - Motors)
      addPort(-0.7, 0, -0.9, motorMat);
      addPort(0.7, 0, -0.9, motorMat);

      // O1 & O2 (Sides - Output)
      addPort(-1.2, 0, -0.2, outputMat, Math.PI / 2);
      addPort(1.2, 0, -0.2, outputMat, Math.PI / 2);

      // USB-C programming port with metallic rim
      const usbPort = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.06), materialsCache.metalShaft);
      usbPort.position.set(0, 0, -0.92);
      group.add(usbPort);
      break;
    }

    // ----------------------------------------------------
    // ELECTRONICS & SENSORS
    // ----------------------------------------------------
    case 'distance-sensor': {
      // High-precision Ultrasonic dual eye sensor
      const pcb = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.56, 0.12), materialsCache.plasticBlue);
      pcb.castShadow = true;
      group.add(pcb);

      // Sensor circuit IC chip and crystal oscillator on board
      const icChip = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 0.05), materialsCache.coreFace);
      icChip.position.set(0, 0, 0.08);
      group.add(icChip);

      const crystal = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.2, 12), materialsCache.metalShaft);
      crystal.rotation.z = Math.PI / 2;
      crystal.position.set(0, 0.18, 0.08);
      group.add(crystal);

      // Transducer metallic housing tubes (Left & Right eyes)
      const eyeGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.3, 24);
      eyeGeo.rotateX(Math.PI / 2);

      const eyeL = new THREE.Mesh(eyeGeo, materialsCache.metalShaft);
      eyeL.position.set(-0.35, 0, 0.18);
      eyeL.castShadow = true;
      group.add(eyeL);

      const eyeR = new THREE.Mesh(eyeGeo, materialsCache.metalShaft);
      eyeR.position.set(0.35, 0, 0.18);
      eyeR.castShadow = true;
      group.add(eyeR);

      // Outer bezel ring for cute friendly appearance
      const bezelGeo = new THREE.TorusGeometry(0.24, 0.03, 12, 24);
      const bezelL = new THREE.Mesh(bezelGeo, materialsCache.plasticYellow);
      bezelL.position.set(-0.35, 0, 0.33);
      group.add(bezelL);

      const bezelR = new THREE.Mesh(bezelGeo, materialsCache.plasticYellow);
      bezelR.position.set(0.35, 0, 0.33);
      group.add(bezelR);

      // Inner acoustic speaker mesh pattern
      const meshScreen = new THREE.Mesh(new THREE.CircleGeometry(0.2, 20), materialsCache.rubberTire);
      meshScreen.position.set(-0.35, 0, 0.335);
      group.add(meshScreen);
      const meshScreenR = meshScreen.clone();
      meshScreenR.position.x = 0.35;
      group.add(meshScreenR);

      // Simulated sonar pulse wave effect when active
      if (isSimulating) {
        const pulseGeo = new THREE.RingGeometry(0.1, 0.3 + (simProgress % 1) * 0.8, 20);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: 0x38BDF8,
          transparent: true,
          opacity: Math.max(0, 0.8 - (simProgress % 1)),
          side: THREE.DoubleSide
        });
        const pulse = new THREE.Mesh(pulseGeo, pulseMat);
        pulse.position.set(0, 0, 0.6 + (simProgress % 1) * 1.2);
        group.add(pulse);
      }
      break;
    }

    case 'light-sensor': {
      const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.1), materialsCache.plasticBlue);
      group.add(pcb);
      // Photoresistor dome
      const ldr = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.1, 16), materialsCache.plasticOrange);
      ldr.rotation.x = Math.PI / 2;
      ldr.position.z = 0.08;
      group.add(ldr);
      break;
    }

    case 'temperature-sensor': {
      const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.1), materialsCache.plasticBlue);
      group.add(pcb);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), materialsCache.metalShaft);
      bulb.position.set(0, 0.25, 0);
      group.add(bulb);
      break;
    }

    case 'button-module': {
      const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.5), materialsCache.plasticBlue);
      group.add(pcb);
      const pushCap = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.18, 16), materialsCache.plasticOrange);
      pushCap.position.y = 0.12;
      group.add(pushCap);
      break;
    }

    case 'potentiometer-knob': {
      const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15, 0.6), materialsCache.plasticBlue);
      group.add(pcb);
      const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.3, 16), materialsCache.wheelRim);
      knob.position.y = 0.2;
      if (isSimulating) {
        knob.rotation.y = Math.sin(simProgress * 2) * 1.5;
      }
      group.add(knob);
      break;
    }

    case 'moisture-sensor': {
      const pcb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.08), materialsCache.plasticBlue);
      pcb.position.y = 0.4;
      group.add(pcb);
      // Twin golden prongs
      const prongGeo = new THREE.BoxGeometry(0.08, 0.6, 0.04);
      const prongMat = materialsCache.wheelRim;
      const prongL = new THREE.Mesh(prongGeo, prongMat);
      prongL.position.set(-0.1, -0.05, 0);
      group.add(prongL);
      const prongR = new THREE.Mesh(prongGeo, prongMat);
      prongR.position.set(0.1, -0.05, 0);
      group.add(prongR);
      break;
    }

    case 'rgb-led': {
      const basePlate = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.12, 0.45), materialsCache.plasticBlue);
      group.add(basePlate);

      // Translucent or glowing bulb dome
      const ledBulbGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const ledMesh = new THREE.Mesh(ledBulbGeo, isSimulating ? materialsCache.ledOn : materialsCache.ledOff);
      ledMesh.position.y = 0.18;
      group.add(ledMesh);
      break;
    }

    case 'buzzer-siren': {
      const buzzerBody = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.22, 20), materialsCache.coreFace);
      buzzerBody.position.y = 0.11;
      group.add(buzzerBody);
      const soundHole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.02, 12), materialsCache.coreCasing);
      soundHole.position.y = 0.225;
      group.add(soundHole);
      break;
    }

    // ----------------------------------------------------
    // MOVEMENT & MOTORS
    // ----------------------------------------------------
    case 'dc-motor': {
      // Characteristic yellow TT gear motor with realistic details
      const gearBox = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.55, 0.7), materialsCache.plasticYellow);
      gearBox.castShadow = true;
      group.add(gearBox);

      // Mounting screw tabs on side of gearbox
      const tabGeo = new THREE.BoxGeometry(0.12, 0.18, 0.85);
      const tab = new THREE.Mesh(tabGeo, materialsCache.plasticYellow);
      tab.position.set(0.2, -0.15, 0);
      group.add(tab);

      // Metal DC motor can in rear
      const motorCylinderGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.65, 20);
      motorCylinderGeo.rotateZ(Math.PI / 2);
      const motorCylinder = new THREE.Mesh(motorCylinderGeo, materialsCache.metalShaft);
      motorCylinder.position.set(-0.6, 0, 0);
      motorCylinder.castShadow = true;
      group.add(motorCylinder);

      // Motor rear terminal cap with solder lugs
      const rearCap = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), materialsCache.coreFace);
      rearCap.rotation.z = Math.PI / 2;
      rearCap.position.set(-0.95, 0, 0);
      group.add(rearCap);

      const lugGeo = new THREE.BoxGeometry(0.04, 0.08, 0.02);
      const lug1 = new THREE.Mesh(lugGeo, materialsCache.goldContact);
      lug1.position.set(-1.02, 0.08, 0);
      group.add(lug1);
      const lug2 = new THREE.Mesh(lugGeo, materialsCache.goldContact);
      lug2.position.set(-1.02, -0.08, 0);
      group.add(lug2);

      // White double-flat (D-shaft) output axle
      const shaftGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.55, 16);
      shaftGeo.rotateZ(Math.PI / 2);
      const shaft = new THREE.Mesh(shaftGeo, materialsCache.whiteStripe);
      shaft.position.set(0.85, 0, 0);
      shaft.castShadow = true;
      group.add(shaft);
      break;
    }

    case 'servo-motor': {
      // SG90 micro servo in signature translucent blue casing
      const servoBody = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.82, 0.46), materialsCache.plasticServoBlue);
      servoBody.castShadow = true;
      group.add(servoBody);

      // Internal gear tower top section
      const towerGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.28, 16);
      const gearTower = new THREE.Mesh(towerGeo, materialsCache.plasticServoBlue);
      gearTower.position.set(0.12, 0.52, 0);
      group.add(gearTower);

      // Mounting ears
      const earGeo = new THREE.BoxGeometry(1.15, 0.08, 0.46);
      const ears = new THREE.Mesh(earGeo, materialsCache.plasticServoBlue);
      ears.position.y = 0.16;
      group.add(ears);

      // 3-wire ribbon cable entry at base
      const wireGeo = new THREE.BoxGeometry(0.18, 0.06, 0.12);
      const wire = new THREE.Mesh(wireGeo, materialsCache.plasticOrange);
      wire.position.set(-0.25, -0.42, 0);
      group.add(wire);

      // White rotating horn with cross arms
      const hornGroup = new THREE.Group();
      hornGroup.position.set(0.12, 0.68, 0);
      const hornHub = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.1, 16), materialsCache.whiteStripe);
      hornGroup.add(hornHub);

      // 4-arm cross horn
      const armGeo = new THREE.BoxGeometry(0.65, 0.06, 0.12);
      const armH = new THREE.Mesh(armGeo, materialsCache.whiteStripe);
      hornGroup.add(armH);
      const armV = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.5), materialsCache.whiteStripe);
      hornGroup.add(armV);

      // Center screw
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 8), materialsCache.metalShaft);
      hornGroup.add(screw);

      // Animate horn in simulation
      if (isSimulating) {
        hornGroup.rotation.y = Math.sin(simProgress * 4) * (Math.PI / 2.5);
      }
      group.add(hornGroup);
      break;
    }

    case 'wheel': {
      const wheelGroup = new THREE.Group();

      // Outer rubber tire with deep grip treads
      const tireGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.38, 28);
      tireGeo.rotateX(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, materialsCache.rubberTire);
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Tread ribs on tyre perimeter
      const ribGeo = new THREE.BoxGeometry(0.06, 0.04, 0.39);
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12;
        const rib = new THREE.Mesh(ribGeo, materialsCache.coreFace);
        rib.position.set(Math.cos(angle) * 0.7, Math.sin(angle) * 0.7, 0);
        rib.rotation.z = angle;
        wheelGroup.add(rib);
      }

      // Bright yellow rim with outer lip
      const rimGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.39, 24);
      rimGeo.rotateX(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, materialsCache.wheelRim);
      wheelGroup.add(rim);

      // 5-Spoke Sport Design
      const spokeGeo = new THREE.BoxGeometry(0.42, 0.08, 0.1);
      for (let s = 0; s < 5; s++) {
        const spoke = new THREE.Mesh(spokeGeo, materialsCache.wheelRim);
        spoke.rotation.z = (s * Math.PI * 2) / 5;
        spoke.position.z = 0.15;
        wheelGroup.add(spoke);
        const spokeBack = spoke.clone();
        spokeBack.position.z = -0.15;
        wheelGroup.add(spokeBack);
      }

      // Chrome center hub nut
      const nutGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.42, 12);
      nutGeo.rotateX(Math.PI / 2);
      const nut = new THREE.Mesh(nutGeo, materialsCache.metalShaft);
      wheelGroup.add(nut);

      // Rotate wheel during simulation
      if (isSimulating) {
        wheelGroup.rotation.x = simProgress * 9;
      }
      group.add(wheelGroup);
      break;
    }

    case 'caster-wheel': {
      // Swivel mount cup
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.25, 16), materialsCache.coreFace);
      cup.position.y = 0.15;
      group.add(cup);
      // Smooth steel roller ball
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), materialsCache.metalShaft);
      ball.position.y = -0.05;
      group.add(ball);
      break;
    }

    case 'axle-bushing': {
      const bushingGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.28, 16);
      bushingGeo.rotateZ(Math.PI / 2);
      const bushing = new THREE.Mesh(bushingGeo, materialsCache.plasticBlue);
      group.add(bushing);
      break;
    }

    // ----------------------------------------------------
    // SPECIAL COMPONENTS
    // ----------------------------------------------------
    case 'wind-turbine-hub': {
      const rotorGroup = new THREE.Group();
      // Center nose cone
      const coneGeo = new THREE.ConeGeometry(0.22, 0.35, 16);
      coneGeo.rotateX(Math.PI / 2);
      const cone = new THREE.Mesh(coneGeo, materialsCache.plasticYellow);
      rotorGroup.add(cone);

      // 4 Aerodynamic blades
      const bladeGeo = new THREE.BoxGeometry(0.18, 1.2, 0.04);
      for (let i = 0; i < 4; i++) {
        const blade = new THREE.Mesh(bladeGeo, materialsCache.whiteStripe);
        blade.position.y = 0.65;
        const bladeHolder = new THREE.Group();
        bladeHolder.rotation.z = (i * Math.PI) / 2;
        bladeHolder.add(blade);
        rotorGroup.add(bladeHolder);
      }

      // Rotate blades continuously in simulation
      if (isSimulating) {
        rotorGroup.rotation.z = simProgress * 6;
      }
      group.add(rotorGroup);
      break;
    }

    case 'sunflower-petal-head': {
      // Golden yellow petal disc
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.08, 24), materialsCache.plasticYellow);
      disc.rotateX(Math.PI / 2);
      group.add(disc);

      // Dark seed center
      const center = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.1, 20), materialsCache.darkWood);
      center.rotateX(Math.PI / 2);
      center.position.z = 0.04;
      group.add(center);
      break;
    }

    case 'barrier-boom-arm': {
      // Striped railway barrier arm
      const armLength = 3.2;
      const armMesh = new THREE.Mesh(new THREE.BoxGeometry(armLength, 0.22, 0.08), materialsCache.whiteStripe);
      group.add(armMesh);

      // Red hazard diagonal bands
      const stripeCount = 5;
      for (let i = 0; i < stripeCount; i++) {
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.24, 0.09), materialsCache.redStripe);
        stripe.position.x = -1.2 + i * 0.6;
        group.add(stripe);
      }
      break;
    }

    case 'street-lamp-shade': {
      const hood = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.4, 20, 1, true), materialsCache.plasticYellow);
      hood.position.y = 0.1;
      group.add(hood);
      break;
    }

    default: {
      // Generic fallback block
      const defGeo = new THREE.BoxGeometry(1, 0.5, 1);
      const defMat = new THREE.MeshStandardMaterial({ color: color });
      group.add(new THREE.Mesh(defGeo, defMat));
    }
  }

  // Visual feedback: Subtle outline or halo when selected
  if (isSelected) {
    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    box.getSize(size);
    const wireGeo = new THREE.BoxGeometry(size.x + 0.12, size.y + 0.12, size.z + 0.12);
    const wireMesh = new THREE.Mesh(wireGeo, materialsCache.selectedOutline);
    wireMesh.position.copy(box.getCenter(new THREE.Vector3()).sub(group.position));
    group.add(wireMesh);
  } else if (isHovered) {
    const box = new THREE.Box3().setFromObject(group);
    const size = new THREE.Vector3();
    box.getSize(size);
    const hoverMat = new THREE.MeshBasicMaterial({ color: 0x60A5FA, wireframe: true, transparent: true, opacity: 0.35 });
    const hoverMesh = new THREE.Mesh(new THREE.BoxGeometry(size.x + 0.06, size.y + 0.06, size.z + 0.06), hoverMat);
    hoverMesh.position.copy(box.getCenter(new THREE.Vector3()).sub(group.position));
    group.add(hoverMesh);
  }

  return group;
}

/**
 * Creates visual snap point spheres for interactive magnetic snapping.
 */
export function createSnapPointVisualizer(
  snapPoints: Array<{ id: string; offset: [number, number, number]; type: string }>,
  highlightSnapId?: string | null
): THREE.Group {
  const snapGroup = new THREE.Group();
  snapPoints.forEach(sp => {
    const isTarget = highlightSnapId === sp.id;
    const geo = new THREE.SphereGeometry(isTarget ? 0.12 : 0.07, 12, 12);
    const mat = isTarget ? materialsCache.snapPointHover : materialsCache.snapPointReady;
    const sphere = new THREE.Mesh(geo, mat);
    sphere.position.set(sp.offset[0], sp.offset[1], sp.offset[2]);
    sphere.userData = { snapPointId: sp.id, type: sp.type };
    snapGroup.add(sphere);
  });
  return snapGroup;
}

/**
 * Creates a clean, realistic catenary curved cable in 3D connecting two hardware points.
 */
export function createCatenaryWire(
  start: THREE.Vector3,
  end: THREE.Vector3,
  color: string = '#3B82F6'
): THREE.Line {
  const mid = start.clone().add(end).multiplyScalar(0.5);
  // Natural gravity droop
  const distance = start.distanceTo(end);
  const sag = Math.min(0.4, distance * 0.15);
  mid.y -= sag;

  const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
  const points = curve.getPoints(24);
  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const material = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    linewidth: 3
  });

  return new THREE.Line(geometry, material);
}
