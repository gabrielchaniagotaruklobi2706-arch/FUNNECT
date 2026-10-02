import * as THREE from 'three';

export interface BuildGeneratorContext {
  pType: string;
  woodMat: THREE.Material;
  cardboardMat: THREE.Material;
  blueConnectorMat: THREE.Material;
  yellowConnectorMat: THREE.Material;
  rubberMat: THREE.Material;
  createStick: (x: number, y: number, z: number, rx: number, ry: number, rz: number, len: number, mat: THREE.Material) => THREE.Mesh;
  createStickBetweenPoints: (p1: [number, number, number] | THREE.Vector3, p2: [number, number, number] | THREE.Vector3, mat: THREE.Material, width?: number, thickness?: number) => THREE.Mesh;
  createConnector: (x: number, y: number, z: number, mat: THREE.Material, scale?: number) => THREE.Mesh;
  createBracket: (x: number, y: number, z: number, w: number, h: number, d: number, colorHex?: number) => THREE.Mesh;
  createWire: (points: [number, number, number][], colorHex: number, radius?: number) => THREE.Mesh;
  wheelsRef: React.MutableRefObject<THREE.Group[]>;
  bladesRef: React.MutableRefObject<THREE.Group | null>;
  servoArmRef: React.MutableRefObject<THREE.Group | null>;
  solarFlowerRef: React.MutableRefObject<THREE.Group | null>;
  barrierArmRef: React.MutableRefObject<THREE.Group | null>;
  barrierLedRef: React.MutableRefObject<THREE.Mesh | null>;
  pendulumRef: React.MutableRefObject<THREE.Group | null>;
  seismoAlarmRef: React.MutableRefObject<THREE.PointLight | null>;
  conveyorRollersRef: React.MutableRefObject<THREE.Mesh[]>;
  sorterArmRef: React.MutableRefObject<THREE.Group | null>;
  craneHookRef: React.MutableRefObject<THREE.Group | null>;
  lampLightRef: React.MutableRefObject<THREE.PointLight | null>;
  obstacleMeshRef: React.MutableRefObject<THREE.Mesh | null>;
  assemblyStage?: number; // 1 = Sasis/Dasar, 2 = Struktur/Rangka, 3 = Penggerak/Mekanik, 4 = Lengkap
  partVisibility?: {
    sticks?: boolean;
    connectors?: boolean;
    mechanisms?: boolean;
    electronics?: boolean;
    wires?: boolean;
  };
  activeModuleIds?: string[];
}

export function populatePhysicalCraftFrame(
  sticksGroup: THREE.Group,
  ctx: BuildGeneratorContext
) {
  const {
    pType,
    woodMat,
    cardboardMat,
    blueConnectorMat,
    yellowConnectorMat,
    rubberMat,
    createStickBetweenPoints,
    createConnector,
    createBracket,
    createWire,
    wheelsRef,
    bladesRef,
    servoArmRef,
    solarFlowerRef,
    barrierArmRef,
    barrierLedRef,
    pendulumRef,
    seismoAlarmRef,
    conveyorRollersRef,
    sorterArmRef,
    craneHookRef,
    lampLightRef,
    obstacleMeshRef,
    assemblyStage = 4,
    partVisibility,
    activeModuleIds
  } = ctx;

  const stage = assemblyStage;
  const vis = {
    sticks: partVisibility?.sticks ?? true,
    connectors: partVisibility?.connectors ?? true,
    mechanisms: partVisibility?.mechanisms ?? true,
    electronics: partVisibility?.electronics ?? true,
    wires: partVisibility?.wires ?? true,
  };

  // Helper dispatchers respecting stage (minStage) and user visibility toggles
  const addStick = (
    p1: [number, number, number] | THREE.Vector3,
    p2: [number, number, number] | THREE.Vector3,
    mat: THREE.Material,
    minStage = 1,
    width?: number,
    thickness?: number
  ) => {
    if (stage >= minStage && vis.sticks) {
      const mesh = createStickBetweenPoints(p1, p2, mat, width, thickness);
      sticksGroup.add(mesh);
      return mesh;
    }
    return null;
  };

  const addConnector = (
    x: number,
    y: number,
    z: number,
    mat: THREE.Material,
    minStage = 1,
    scale?: number
  ) => {
    if (stage >= minStage && vis.connectors) {
      const mesh = createConnector(x, y, z, mat, scale);
      sticksGroup.add(mesh);
      return mesh;
    }
    return null;
  };

  const addStructure = (obj: THREE.Object3D, minStage = 2) => {
    if (stage >= minStage) {
      sticksGroup.add(obj);
      return obj;
    }
    return null;
  };

  const addMech = (obj: THREE.Object3D, minStage = 3) => {
    if (stage >= minStage && vis.mechanisms) {
      sticksGroup.add(obj);
      return obj;
    }
    return null;
  };

  const addElec = (obj: THREE.Object3D, minStage = 4) => {
    if (stage >= minStage && vis.electronics) {
      sticksGroup.add(obj);
      return obj;
    }
    return null;
  };

  const addWire = (
    points: [number, number, number][],
    colorHex: number,
    minStage = 4,
    radius?: number
  ) => {
    if (stage >= minStage && vis.wires) {
      const mesh = createWire(points, colorHex, radius);
      sticksGroup.add(mesh);
      return mesh;
    }
    return null;
  };

  // Check if specific module is included
  const hasModule = (modSnippet: string) => {
    if (!activeModuleIds || activeModuleIds.length === 0) return true;
    return activeModuleIds.some(id => id.includes(modSnippet));
  };

  if (pType === 'robot-car') {
    // --- 1. ROBOT CAR: Stage 1 = Perimeter Base, Stage 2 = Crossbars & Deckplate, Stage 3 = Motors & Wheels, Stage 4 = Ultrasonic & Wires ---
    const frameCorners: [number, number, number][] = [
      [-1.0, 0.8, -1.4],
      [1.0, 0.8, -1.4],
      [1.0, 0.8, 1.4],
      [-1.0, 0.8, 1.4]
    ];

    // Stage 1: Base perimeter sticks and 4 corner connectors
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      addStick(frameCorners[i], frameCorners[next], woodMat, 1);
      addConnector(frameCorners[i][0], frameCorners[i][1], frameCorners[i][2], i < 2 ? blueConnectorMat : yellowConnectorMat, 1, 0.34);
    }

    // Stage 2: Center cross support stick & connectors
    addStick([-1.0, 0.8, 0], [1.0, 0.8, 0], woodMat, 2);
    addConnector(-1.0, 0.8, 0, blueConnectorMat, 2, 0.28);
    addConnector(1.0, 0.8, 0, blueConnectorMat, 2, 0.28);

    // Stage 2: Solid Deckplate & Standoff pins
    const deckplate = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 3.1), cardboardMat);
    deckplate.position.set(0, 0.84, 0);
    deckplate.castShadow = true;
    deckplate.receiveShadow = true;
    addStructure(deckplate, 2);

    [[-0.8, -0.6], [0.8, -0.6], [-0.8, 0.6], [0.8, 0.6]].forEach(([sx, sz]) => {
      const standoff = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.46, 12), blueConnectorMat);
      standoff.position.set(sx, 1.07, sz);
      standoff.castShadow = true;
      addStructure(standoff, 2);
    });

    // Stage 3: TT Motors, Axles, Mounts, Wheels, and Caster
    if (hasModule('motor') || hasModule('dc-motor')) {
      const motorMat = new THREE.MeshStandardMaterial({ color: 0xFACC15, roughness: 0.35, metalness: 0.1 });
      const metalShaftMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.85, roughness: 0.2 });

      [-1.05, 1.05].forEach((mx, idx) => {
        const motorBox = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.46, 0.9), motorMat);
        motorBox.position.set(mx, 0.75, -0.6);
        motorBox.castShadow = true;
        addMech(motorBox, 3);

        const b1 = createBracket(mx, 0.75, -0.85, 0.4, 0.5, 0.15, 0x0F172A);
        const b2 = createBracket(mx, 0.75, -0.35, 0.4, 0.5, 0.15, 0x0F172A);
        addMech(b1, 3);
        addMech(b2, 3);

        const axleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.38, 12);
        axleGeo.rotateZ(Math.PI / 2);
        const axleMesh = new THREE.Mesh(axleGeo, metalShaftMat);
        axleMesh.position.set(idx === 0 ? -1.22 : 1.22, 0.75, -0.6);
        axleMesh.castShadow = true;
        addMech(axleMesh, 3);
      });

      // Wheels
      const wheelGeo = new THREE.CylinderGeometry(0.75, 0.75, 0.28, 24);
      wheelGeo.rotateZ(Math.PI / 2);
      const rimGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.3, 16);
      rimGeo.rotateZ(Math.PI / 2);

      [-1.38, 1.38].forEach(xSide => {
        const wheelGroup = new THREE.Group();
        wheelGroup.position.set(xSide, 0.75, -0.6);
        const tire = new THREE.Mesh(wheelGeo, rubberMat);
        tire.castShadow = true;
        const rim = new THREE.Mesh(rimGeo, yellowConnectorMat);
        wheelGroup.add(tire);
        wheelGroup.add(rim);
        const added = addMech(wheelGroup, 3);
        if (added) {
          wheelsRef.current.push(wheelGroup);
        }
      });
    }

    // Front Caster Wheel
    const casterRiser = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.46, 12), blueConnectorMat);
    casterRiser.position.set(0, 0.58, 1.25);
    casterRiser.castShadow = true;
    addMech(casterRiser, 3);

    const caster = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), rubberMat);
    caster.position.set(0, 0.35, 1.25);
    caster.castShadow = true;
    addMech(caster, 3);

    // Stage 4: Ultrasonic Sensor, Cables & Obstacle
    if (hasModule('distance') || hasModule('ultrasonic')) {
      addStick([0, 0.8, 1.4], [0, 1.3, 1.55], woodMat, 4);
      const uBracket = createBracket(0, 1.3, 1.55, 0.45, 0.28, 0.35, 0x1D64F2);
      addStructure(uBracket, 4);

      const sensorGroup = new THREE.Group();
      sensorGroup.position.set(0, 1.3, 1.75);
      const sensorPcb = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 0.1), blueConnectorMat);
      const eyeGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.25, 16);
      eyeGeo.rotateX(Math.PI / 2);
      const eyeMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, metalness: 0.8 });
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.3, 0, 0.15);
      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.3, 0, 0.15);
      sensorGroup.add(sensorPcb, leftEye, rightEye);
      addElec(sensorGroup, 4);

      addWire([[-0.7, 1.35, 0.92], [-0.5, 0.95, 1.1], [-0.2, 0.95, 1.4], [-0.1, 1.25, 1.7]], 0x2563EB, 4, 0.024);
    }

    addWire([[-0.7, 1.35, -0.92], [-0.9, 0.95, -0.75], [-1.05, 0.75, -0.85]], 0xEA580C, 4, 0.024);
    addWire([[0.7, 1.35, -0.92], [0.9, 0.95, -0.75], [1.05, 0.75, -0.85]], 0xF59E0B, 4, 0.024);

    // Obstacle Target
    const obsGeo = new THREE.BoxGeometry(1.6, 1.6, 0.3);
    const obsMat = new THREE.MeshStandardMaterial({ color: 0xEF4444, roughness: 0.4, transparent: true, opacity: 0.85 });
    const obstacle = new THREE.Mesh(obsGeo, obsMat);
    obstacle.position.set(0, 0.8, 4.2);
    if (stage >= 4 && vis.electronics) {
      sticksGroup.add(obstacle);
      obstacleMeshRef.current = obstacle;
    }

  } else if (pType === 'windmill') {
    // --- 2. WINDMILL: Stage 1 = Triangular Tripod Base, Stage 2 = Mast Legs & Bracing, Stage 3 = Nacelle & Blades, Stage 4 = Sensor & Wires ---
    const footA: [number, number, number] = [-1.1, 0.08, -0.8];
    const footB: [number, number, number] = [1.1, 0.08, -0.8];
    const footC: [number, number, number] = [0, 0.08, 0.7];
    const apex: [number, number, number] = [0, 4.0, -0.05];

    // Stage 1: Base feet & ring sticks
    addConnector(footA[0], footA[1], footA[2], yellowConnectorMat, 1, 0.38);
    addConnector(footB[0], footB[1], footB[2], yellowConnectorMat, 1, 0.38);
    addConnector(footC[0], footC[1], footC[2], yellowConnectorMat, 1, 0.38);

    addStick(footA, footB, woodMat, 1, 0.2, 0.09);
    addStick(footB, footC, woodMat, 1, 0.2, 0.09);
    addStick(footC, footA, woodMat, 1, 0.2, 0.09);

    // Stage 2: 3 Tower upright legs and intermediate bracing
    addStick(footA, apex, woodMat, 2, 0.22, 0.1);
    addStick(footB, apex, woodMat, 2, 0.22, 0.1);
    addStick(footC, apex, woodMat, 2, 0.22, 0.1);

    const t1 = 0.34;
    const braceA1: [number, number, number] = [footA[0] * (1 - t1) + apex[0] * t1, 1.4, footA[2] * (1 - t1) + apex[2] * t1];
    const braceB1: [number, number, number] = [footB[0] * (1 - t1) + apex[0] * t1, 1.4, footB[2] * (1 - t1) + apex[2] * t1];
    const braceC1: [number, number, number] = [footC[0] * (1 - t1) + apex[0] * t1, 1.4, footC[2] * (1 - t1) + apex[2] * t1];

    addStick(braceA1, braceB1, woodMat, 2, 0.16, 0.08);
    addStick(braceB1, braceC1, woodMat, 2, 0.16, 0.08);
    addStick(braceC1, braceA1, woodMat, 2, 0.16, 0.08);
    addConnector(braceA1[0], braceA1[1], braceA1[2], blueConnectorMat, 2, 0.28);
    addConnector(braceB1[0], braceB1[1], braceB1[2], blueConnectorMat, 2, 0.28);
    addConnector(braceC1[0], braceC1[1], braceC1[2], blueConnectorMat, 2, 0.28);

    const t2 = 0.67;
    const braceA2: [number, number, number] = [footA[0] * (1 - t2) + apex[0] * t2, 2.7, footA[2] * (1 - t2) + apex[2] * t2];
    const braceB2: [number, number, number] = [footB[0] * (1 - t2) + apex[0] * t2, 2.7, footB[2] * (1 - t2) + apex[2] * t2];
    const braceC2: [number, number, number] = [footC[0] * (1 - t2) + apex[0] * t2, 2.7, footC[2] * (1 - t2) + apex[2] * t2];

    addStick(braceA2, braceB2, woodMat, 2, 0.16, 0.08);
    addStick(braceB2, braceC2, woodMat, 2, 0.16, 0.08);
    addStick(braceC2, braceA2, woodMat, 2, 0.16, 0.08);
    addConnector(braceA2[0], braceA2[1], braceA2[2], blueConnectorMat, 2, 0.26);
    addConnector(braceB2[0], braceB2[1], braceB2[2], blueConnectorMat, 2, 0.26);
    addConnector(braceC2[0], braceC2[1], braceC2[2], blueConnectorMat, 2, 0.26);

    const apexCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.35, 16), yellowConnectorMat);
    apexCollar.position.set(apex[0], apex[1], apex[2]);
    apexCollar.castShadow = true;
    addStructure(apexCollar, 2);

    const coreTray = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.06, 2.0), cardboardMat);
    coreTray.position.set(0, 0.08, 1.4);
    addStructure(coreTray, 2);

    addStick(footC, [-0.8, 0.08, 1.4], woodMat, 2);
    addStick(footC, [0.8, 0.08, 1.4], woodMat, 2);
    addConnector(-0.8, 0.08, 1.4, yellowConnectorMat, 2, 0.26);
    addConnector(0.8, 0.08, 1.4, yellowConnectorMat, 2, 0.26);

    // Stage 3: Nacelle Motor Hub & Rotating Blades
    const hubGroup = new THREE.Group();
    hubGroup.position.set(apex[0], apex[1] + 0.36, apex[2] + 0.15);
    const hubBox = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.82, 1.05), blueConnectorMat);
    hubBox.castShadow = true;
    hubGroup.add(hubBox);

    const flange = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.32, 0.25, 12),
      new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 })
    );
    flange.position.set(0, -0.38, -0.1);
    hubGroup.add(flange);

    const bladesGroup = new THREE.Group();
    bladesGroup.position.set(0, 0, 0.62);

    const spinnerCap = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.35, 16), yellowConnectorMat);
    spinnerCap.rotation.x = Math.PI / 2;
    bladesGroup.add(spinnerCap);

    const bladeGeo = new THREE.BoxGeometry(0.5, 2.2, 0.04);
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(bladeGeo, cardboardMat);
      blade.position.y = 1.1;
      blade.castShadow = true;
      const bladeHolder = new THREE.Group();
      bladeHolder.rotation.z = (i * Math.PI) / 2;
      bladeHolder.add(blade);
      bladesGroup.add(bladeHolder);
    }
    hubGroup.add(bladesGroup);
    const addedHub = addMech(hubGroup, 3);
    if (addedHub) {
      bladesRef.current = bladesGroup;
    }

    // Stage 4: Wiring
    addWire(
      [
        [0.7, 0.45, 1.4],
        [0.4, 0.15, 1.1],
        [footC[0], footC[1] + 0.1, footC[2]],
        [braceC1[0], braceC1[1], braceC1[2]],
        [braceC2[0], braceC2[1], braceC2[2]],
        [apex[0], apex[1], apex[2]],
        [apex[0], apex[1] + 0.35, apex[2] + 0.1]
      ],
      0xF97316,
      4,
      0.024
    );

  } else if (pType === 'irrigation') {
    // --- 3. SMART IRRIGATION PLANTER ---
    const rimCorners: [number, number, number][] = [
      [-1.2, 0.15, -1.2],
      [1.2, 0.15, -1.2],
      [1.2, 0.15, 1.2],
      [-1.2, 0.15, 1.2]
    ];
    // Stage 1: Planter rim base
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      addStick(rimCorners[i], rimCorners[next], woodMat, 1);
      addConnector(rimCorners[i][0], rimCorners[i][1], rimCorners[i][2], blueConnectorMat, 1);
    }

    // Stage 2: Soil Bed, Plant Stem & Servo Tower Post
    const soil = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.38, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x583101, roughness: 0.95 })
    );
    soil.position.set(0, 0.2, 0);
    soil.receiveShadow = true;
    addStructure(soil, 2);

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 1.4, 8),
      new THREE.MeshStandardMaterial({ color: 0x22C55E })
    );
    stem.position.set(0, 1.0, 0);
    addStructure(stem, 2);

    addStick([-1.2, 0.15, 0], [-1.2, 2.15, 0], woodMat, 2);
    addStick([-1.2, 0.15, -0.8], [-1.2, 1.2, 0], woodMat, 2);
    addStick([-1.2, 0.15, 0.8], [-1.2, 1.2, 0], woodMat, 2);
    addConnector(-1.2, 2.15, 0, yellowConnectorMat, 2);
    const sBracket = createBracket(-1.05, 2.15, 0, 0.45, 0.55, 0.4, 0x1D64F2);
    addStructure(sBracket, 2);

    // Stage 3: Servo Tipping Cup Arm
    const armGroup = new THREE.Group();
    armGroup.position.set(-0.85, 2.15, 0);
    const hornHub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 16), new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    hornHub.rotation.z = Math.PI / 2;
    armGroup.add(hornHub);

    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.2, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x60A5FA, transparent: true, opacity: 0.85 })
    );
    cup.position.set(0.65, 0, 0);
    armGroup.add(cup);
    const cupStick = createStickBetweenPoints([0, 0, 0], [0.65, 0, 0], woodMat);
    armGroup.add(cupStick);
    const addedArm = addMech(armGroup, 3);
    if (addedArm) {
      servoArmRef.current = armGroup;
    }

    // Stage 4: Moisture Probe & Cables
    const probePcb = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.05), new THREE.MeshStandardMaterial({ color: 0x1E40AF }));
    probePcb.position.set(0.6, 0.45, 0.6);
    addElec(probePcb, 4);

    addWire([[-0.7, 1.2, 0.92], [-0.4, 0.2, 0.8], [0.2, 0.2, 0.7], [0.6, 0.45, 0.6]], 0x2563EB, 4, 0.022);
    addWire([[-0.7, 1.2, -0.92], [-1.0, 0.5, -0.4], [-1.2, 1.5, 0], [-1.05, 2.1, 0]], 0xEA580C, 4, 0.022);

  } else if (pType === 'streetlight') {
    // --- 4. SMART STREET LIGHT ---
    // Stage 1: Base cross frame
    addStick([-1.2, 0.15, -1.2], [1.2, 0.15, 1.2], woodMat, 1);
    addStick([-1.2, 0.15, 1.2], [1.2, 0.15, -1.2], woodMat, 1);
    addConnector(0, 0.18, 0, blueConnectorMat, 1, 0.38);
    addConnector(-1.2, 0.15, -1.2, yellowConnectorMat, 1, 0.28);
    addConnector(1.2, 0.15, 1.2, yellowConnectorMat, 1, 0.28);
    addConnector(-1.2, 0.15, 1.2, yellowConnectorMat, 1, 0.28);
    addConnector(1.2, 0.15, -1.2, yellowConnectorMat, 1, 0.28);

    // Stage 2: Upright post, diagonal struts & lamp arm stick
    addStick([0.8, 0.15, 0], [0, 0.9, 0], woodMat, 2);
    addStick([-0.8, 0.15, 0], [0, 0.9, 0], woodMat, 2);
    addStick([0, 0.15, 0.8], [0, 0.9, 0], woodMat, 2);
    addStick([0, 0.15, -0.8], [0, 0.9, 0], woodMat, 2);
    addConnector(0, 0.9, 0, blueConnectorMat, 2, 0.32);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 4.0, 16), new THREE.MeshStandardMaterial({ color: 0xE0B589, roughness: 0.7 }));
    post.position.set(0, 2.0, 0);
    post.castShadow = true;
    addStructure(post, 2);

    const elbow = new THREE.Mesh(new THREE.DodecahedronGeometry(0.35, 0), yellowConnectorMat);
    elbow.position.set(0, 4.0, 0);
    addStructure(elbow, 2);

    addStick([0, 4.0, 0], [1.4, 3.8, 0], woodMat, 2);

    // Stage 3 & 4: Lamp Shade, LED light, and Wires
    const lampGroup = new THREE.Group();
    lampGroup.position.set(1.4, 3.8, 0);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xFEF08A, roughness: 0.2 }));
    dome.rotation.x = Math.PI;
    lampGroup.add(dome);

    const lampLight = new THREE.PointLight(0xFDE047, 1.2, 10);
    lampLight.position.set(0, -0.2, 0);
    lampGroup.add(lampLight);
    const addedLamp = addElec(lampGroup, 3);
    if (addedLamp) {
      lampLightRef.current = lampLight;
    }

    addWire([[-1.22, 1.2, -0.2], [-0.6, 0.8, -0.2], [0.0, 1.0, -0.15], [0.0, 2.5, -0.15], [0.0, 4.0, 0.0], [0.7, 4.05, 0.0], [1.4, 3.85, 0.0]], 0xEC4899, 4, 0.022);

  } else if (pType === 'solar-tracker') {
    // --- 5. SMART SOLAR SUNFLOWER ---
    // Stage 1: Hexagonal base ring
    const hexCorners: [number, number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      hexCorners.push([Math.cos(angle) * 1.3, 0.15, Math.sin(angle) * 1.3]);
    }
    for (let i = 0; i < 6; i++) {
      const next = (i + 1) % 6;
      addStick(hexCorners[i], hexCorners[next], woodMat, 1);
      addConnector(hexCorners[i][0], hexCorners[i][1], hexCorners[i][2], yellowConnectorMat, 1, 0.28);
    }

    // Stage 2: Turf, twin masts, crossbars & leaves
    const turf = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.2, 16), new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.9 }));
    turf.position.set(0, 0.1, 0);
    turf.receiveShadow = true;
    addStructure(turf, 2);

    addStick([-0.5, 0.15, 0], [-0.5, 3.2, 0], woodMat, 2);
    addStick([0.5, 0.15, 0], [0.5, 3.2, 0], woodMat, 2);
    addStick([-0.5, 0.8, 0], [0.5, 0.8, 0], woodMat, 2);
    addStick([-0.5, 2.0, 0], [0.5, 2.0, 0], woodMat, 2);
    addStick([-0.5, 3.2, 0], [0.5, 3.2, 0], woodMat, 2);
    addConnector(-0.5, 3.2, 0, yellowConnectorMat, 2);
    addConnector(0.5, 3.2, 0, yellowConnectorMat, 2);

    addStick([-1.1, 0.15, 0], [-0.5, 1.2, 0], woodMat, 2);
    addStick([1.1, 0.15, 0], [0.5, 1.2, 0], woodMat, 2);

    const leafGeo = new THREE.ConeGeometry(0.35, 1.1, 4);
    leafGeo.rotateZ(Math.PI / 3);
    const leftLeaf = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({ color: 0x22C55E }));
    leftLeaf.position.set(-0.8, 1.6, 0);
    const rightLeaf = new THREE.Mesh(leafGeo, new THREE.MeshStandardMaterial({ color: 0x22C55E }));
    rightLeaf.rotation.y = Math.PI;
    rightLeaf.position.set(0.8, 2.1, 0);
    addStructure(leftLeaf, 2);
    addStructure(rightLeaf, 2);

    const fBracket = createBracket(0, 3.2, 0, 0.65, 0.72, 0.45, 0x1D64F2);
    addStructure(fBracket, 2);

    // Stage 3: Rotating Sunflower Head & Servo Mount
    const flowerGroup = new THREE.Group();
    flowerGroup.position.set(0, 3.2, 0.35);
    const hornDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.1, 16), new THREE.MeshStandardMaterial({ color: 0xFFFFFF }));
    hornDisk.rotation.x = Math.PI / 2;
    hornDisk.position.set(0, 0, -0.1);
    flowerGroup.add(hornDisk);

    const petalRingGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.05, 16);
    petalRingGeo.rotateX(Math.PI / 2);
    const petalDisc = new THREE.Mesh(petalRingGeo, new THREE.MeshStandardMaterial({ color: 0xFACC15, roughness: 0.4 }));
    petalDisc.castShadow = true;
    flowerGroup.add(petalDisc);

    const coreSeedGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.08, 16);
    coreSeedGeo.rotateX(Math.PI / 2);
    const coreSeed = new THREE.Mesh(coreSeedGeo, new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.8 }));
    coreSeed.position.z = 0.04;
    flowerGroup.add(coreSeed);

    const ldrSensor = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.12), new THREE.MeshStandardMaterial({ color: 0x1E40AF }));
    ldrSensor.position.set(0, 0, 0.12);
    flowerGroup.add(ldrSensor);
    const addedFlower = addMech(flowerGroup, 3);
    if (addedFlower) {
      solarFlowerRef.current = flowerGroup;
    }

    // Stage 4: Wires
    addWire([[-0.7, 0.45, 1.5], [-0.6, 0.2, 0.8], [-0.5, 1.8, 0.1], [-0.3, 3.2, 0.2], [0.0, 3.2, 0.45]], 0x2563EB, 4, 0.022);
    addWire([[-0.7, 0.45, -0.92], [-0.4, 0.4, -0.4], [0.0, 1.5, -0.1], [0.0, 3.1, -0.1]], 0xEA580C, 4, 0.022);

  } else if (pType === 'automatic-barrier') {
    // --- 6. AUTOMATIC BOOM BARRIER ---
    // Stage 1 & 2: Road Pad & Tower Posts
    const roadPad = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.1, 3.0), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 }));
    roadPad.position.set(0, 0.05, 0);
    roadPad.receiveShadow = true;
    addStructure(roadPad, 1);

    addStick([-1.2, 0.1, -0.4], [-1.2, 2.6, -0.4], woodMat, 2);
    addStick([-1.2, 0.1, 0.4], [-1.2, 2.6, 0.4], woodMat, 2);
    addStick([-1.2, 1.0, -0.4], [-1.2, 1.0, 0.4], woodMat, 2);
    addStick([-1.2, 2.6, -0.4], [-1.2, 2.6, 0.4], woodMat, 2);
    addConnector(-1.2, 2.6, 0, yellowConnectorMat, 2);

    addStick([-1.8, 0.1, 0], [-1.2, 1.2, 0], woodMat, 2);

    // Stage 3: Servo Boom Gate Arm
    const bArmGroup = new THREE.Group();
    bArmGroup.position.set(-1.0, 2.4, 0);

    const bPivot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16), blueConnectorMat);
    bPivot.rotation.x = Math.PI / 2;
    bArmGroup.add(bPivot);

    const gateStick = createStickBetweenPoints([0, 0, 0], [2.8, 0, 0], woodMat, 0.18, 0.08);
    bArmGroup.add(gateStick);

    for (let s = 0.4; s <= 2.6; s += 0.5) {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.09), new THREE.MeshStandardMaterial({ color: 0xEF4444 }));
      stripe.position.set(s, 0, 0);
      bArmGroup.add(stripe);
    }
    const addedBarrier = addMech(bArmGroup, 3);
    if (addedBarrier) {
      barrierArmRef.current = bArmGroup;
    }

    // Stage 4: Sensor & Traffic LED
    const uBrack = createBracket(-1.2, 0.8, 0.6, 0.35, 0.4, 0.4, 0x1E293B);
    addStructure(uBrack, 4);

    const ultraPcb = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.2), blueConnectorMat);
    ultraPcb.position.set(-1.2, 0.8, 0.95);
    const eye1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.2, 12), new THREE.MeshStandardMaterial({ color: 0xE2E8F0 }));
    eye1.rotation.x = Math.PI / 2;
    eye1.position.set(-0.2, 0, 0.1);
    const eye2 = eye1.clone();
    eye2.position.set(0.2, 0, 0.1);
    ultraPcb.add(eye1, eye2);
    addElec(ultraPcb, 4);

    const signalLed = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), new THREE.MeshStandardMaterial({ color: 0x10B981, emissive: 0x059669 }));
    signalLed.position.set(-1.2, 3.1, 0);
    const addedLed = addElec(signalLed, 4);
    if (addedLed) {
      barrierLedRef.current = signalLed;
    }

    addWire([[-1.6, 0.45, 0.92], [-1.4, 0.4, 0.6], [-1.2, 0.8, 0.8]], 0x2563EB, 4, 0.022);
    addWire([[-1.6, 0.45, -0.92], [-1.4, 1.2, -0.2], [-1.0, 2.3, 0.0]], 0xEA580C, 4, 0.022);

  } else if (pType === 'earthquake-detector') {
    // --- 7. EARTHQUAKE DETECTOR ---
    // Stage 1: Base & Seismograph Drum
    addStick([-1.4, 0.12, -1.4], [1.4, 0.12, -1.4], woodMat, 1);
    addStick([1.4, 0.12, -1.4], [1.4, 0.12, 1.4], woodMat, 1);
    addStick([1.4, 0.12, 1.4], [-1.4, 0.12, 1.4], woodMat, 1);
    addStick([-1.4, 0.12, 1.4], [-1.4, 0.12, -1.4], woodMat, 1);

    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.2, 24), new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.6 }));
    drum.rotation.z = Math.PI / 2;
    drum.position.set(0, 0.6, -0.4);
    addStructure(drum, 1);

    // Stage 2: A-Frame Suspension Tripod
    addStick([-1.2, 0.12, 0.5], [0, 3.8, 0], woodMat, 2);
    addStick([1.2, 0.12, 0.5], [0, 3.8, 0], woodMat, 2);
    addStick([0, 0.12, -1.2], [0, 3.8, 0], woodMat, 2);
    addConnector(0, 3.8, 0, yellowConnectorMat, 2, 0.42);

    addStick([-0.6, 1.9, 0.25], [0.6, 1.9, 0.25], woodMat, 2);

    // Stage 3: Pendulum Inertia Bob
    const pGroup = new THREE.Group();
    pGroup.position.set(0, 3.8, 0);

    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.5, 8), new THREE.MeshBasicMaterial({ color: 0x0F172A }));
    cord.position.y = -1.25;
    pGroup.add(cord);

    const bob = new THREE.Mesh(new THREE.SphereGeometry(0.38, 20, 20), new THREE.MeshStandardMaterial({ color: 0xD97706, metalness: 0.85, roughness: 0.2 }));
    bob.position.y = -2.5;
    pGroup.add(bob);
    const addedPend = addMech(pGroup, 3);
    if (addedPend) {
      pendulumRef.current = pGroup;
    }

    // Stage 4: Alarm Siren Beacon & Wires
    const siren = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.35, 16), new THREE.MeshStandardMaterial({ color: 0xEF4444, roughness: 0.2 }));
    siren.position.set(0, 4.15, 0);
    const alarmLight = new THREE.PointLight(0xEF4444, 0, 8);
    alarmLight.position.set(0, 4.3, 0);
    siren.add(alarmLight);
    const addedSiren = addElec(siren, 4);
    if (addedSiren) {
      seismoAlarmRef.current = alarmLight;
    }

    addWire([[0.0, 0.45, 1.6], [0.0, 1.8, 0.8], [0.0, 3.8, 0.0]], 0x2563EB, 4, 0.022);

  } else if (pType === 'conveyor-sorter') {
    // --- 8. SMART CONVEYOR SORTER ---
    // Stage 1: Table Legs & Braces
    [[-1.8, -0.6], [1.8, -0.6], [-1.8, 0.6], [1.8, 0.6]].forEach(([lx, lz]) => {
      addStick([lx, 0.1, lz], [lx, 1.4, lz], woodMat, 1, 0.2, 0.1);
      addConnector(lx, 0.1, lz, blueConnectorMat, 1, 0.3);
      addConnector(lx, 1.4, lz, yellowConnectorMat, 1, 0.3);
    });

    addStick([-1.8, 0.4, -0.6], [1.8, 0.4, -0.6], woodMat, 1);
    addStick([-1.8, 0.4, 0.6], [1.8, 0.4, 0.6], woodMat, 1);

    // Stage 2: Table Deck & Rails
    addStick([-1.8, 1.4, -0.6], [1.8, 1.4, -0.6], woodMat, 2, 0.2, 0.1);
    addStick([-1.8, 1.4, 0.6], [1.8, 1.4, 0.6], woodMat, 2, 0.2, 0.1);

    // Stage 3: Rollers & Belt
    const rollerMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.6 });
    for (let rx = -1.6; rx <= 1.6; rx += 0.8) {
      const rollerGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.1, 16);
      rollerGeo.rotateX(Math.PI / 2);
      const roller = new THREE.Mesh(rollerGeo, rollerMat);
      roller.position.set(rx, 1.4, 0);
      const addedRoller = addMech(roller, 3);
      if (addedRoller) {
        conveyorRollersRef.current.push(roller);
      }
    }

    const belt = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.04, 1.05), rubberMat);
    belt.position.set(0, 1.57, 0);
    addMech(belt, 3);

    // Sorter Servo Arm
    const sorterGroup = new THREE.Group();
    sorterGroup.position.set(0, 1.7, -0.6);
    const sorterStick = createStickBetweenPoints([0, 0, 0], [0, 0, 1.1], woodMat, 0.15, 0.08);
    sorterGroup.add(sorterStick);
    const addedSorter = addMech(sorterGroup, 3);
    if (addedSorter) {
      sorterArmRef.current = sorterGroup;
    }

    // Stage 4: Wires & Item Sensor
    addWire([[0.0, 0.45, 1.8], [0.0, 1.2, 1.0], [0.0, 1.7, -0.6]], 0x2563EB, 4, 0.022);

  } else if (pType === 'crane-hoist') {
    // --- 9. MOTORIZED CRANE HOIST ---
    // Stage 1: Cross Outrigger Base
    const baseLegs: [number, number, number][] = [
      [-1.4, 0.12, -1.4],
      [1.4, 0.12, -1.4],
      [1.4, 0.12, 1.4],
      [-1.4, 0.12, 1.4]
    ];
    baseLegs.forEach(([bx, by, bz]) => {
      addStick([0, 0.12, 0], [bx, by, bz], woodMat, 1, 0.22, 0.12);
      addConnector(bx, by, bz, blueConnectorMat, 1, 0.36);
    });
    addConnector(0, 0.12, 0, yellowConnectorMat, 1, 0.44);

    // Stage 2: Vertical Truss Mast
    const mastHeight = 4.8;
    const mastCorners: [number, number][] = [[-0.4, -0.4], [0.4, -0.4], [0, 0.4]];
    mastCorners.forEach(([mx, mz]) => {
      addStick([mx, 0.12, mz], [mx, mastHeight, mz], woodMat, 2, 0.2, 0.1);
      addConnector(mx, 0.12, mz, yellowConnectorMat, 2, 0.26);
      addConnector(mx, mastHeight, mz, yellowConnectorMat, 2, 0.28);
    });

    for (let y = 1.0; y <= 4.0; y += 1.0) {
      addStick([-0.4, y, -0.4], [0.4, y, -0.4], woodMat, 2, 0.14, 0.07);
      addStick([0.4, y, -0.4], [0, y, 0.4], woodMat, 2, 0.14, 0.07);
      addStick([0, y, 0.4], [-0.4, y, -0.4], woodMat, 2, 0.14, 0.07);
    }

    addStick([-1.2, 0.12, 0], [-0.4, 1.0, 0], woodMat, 2);
    addStick([1.2, 0.12, 0], [0.4, 1.0, 0], woodMat, 2);
    addStick([0, 0.12, -1.2], [0, 1.0, -0.4], woodMat, 2);
    addStick([0, 0.12, 1.2], [0, 1.0, 0.4], woodMat, 2);

    // Stage 3: Top Boom Jib, Winch & Cable Hook
    const topDeck = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.2, 16), yellowConnectorMat);
    topDeck.position.set(0, mastHeight + 0.1, 0);
    addStructure(topDeck, 3);

    addStick([-1.4, mastHeight + 0.35, 0], [2.7, mastHeight + 0.35, 0], woodMat, 3, 0.22, 0.12);

    const counterweight = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.6), new THREE.MeshStandardMaterial({ color: 0x64748B }));
    counterweight.position.set(-1.2, mastHeight + 0.4, 0);
    addMech(counterweight, 3);

    addStick([0, mastHeight + 0.1, 0], [0, mastHeight + 1.2, 0], woodMat, 3);

    const winch = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0xF97316 }));
    winch.position.set(0, 1.8, 0.5);
    addMech(winch, 3);

    const hookGroup = new THREE.Group();
    hookGroup.position.set(1.6, 2.4, 0);
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.4, 6), new THREE.MeshBasicMaterial({ color: 0x0F172A }));
    cable.position.y = 1.2;
    hookGroup.add(cable);

    const hookRing = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.04, 8, 16), new THREE.MeshStandardMaterial({ color: 0xCBD5E1, metalness: 0.9 }));
    hookGroup.add(hookRing);

    const cargoBox = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.7), cardboardMat);
    cargoBox.position.set(0, -0.5, 0);
    hookGroup.add(cargoBox);
    const addedHook = addMech(hookGroup, 3);
    if (addedHook) {
      craneHookRef.current = hookGroup;
    }

    // Stage 4: Wires
    addWire([[0.0, 0.45, 1.6], [0.0, 1.2, 1.0], [0.0, 1.8, 0.5]], 0xEA580C, 4, 0.022);

  } else {
    // --- 10. GENERIC / SPACE-FRAME TRUSS FALLBACK ---
    // Stage 1: Base perimeter
    const corners: [number, number, number][] = [
      [-1.2, 0.2, -1.2],
      [1.2, 0.2, -1.2],
      [1.2, 0.2, 1.2],
      [-1.2, 0.2, 1.2]
    ];
    const apexNode: [number, number, number] = [0, 2.4, 0];

    corners.forEach(([cx, cy, cz]) => {
      addConnector(cx, cy, cz, blueConnectorMat, 1, 0.36);
    });

    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      addStick(corners[i], corners[next], woodMat, 1);
    }

    // Stage 2: Pyramid struts
    addConnector(apexNode[0], apexNode[1], apexNode[2], yellowConnectorMat, 2, 0.42);
    corners.forEach(c => {
      addStick(c, apexNode, woodMat, 2);
    });
  }
}
