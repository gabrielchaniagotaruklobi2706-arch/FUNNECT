import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { 
  PlacedComponent, 
  WireConnection, 
  BuilderToolMode, 
  CameraPresetView, 
  MeasurementState 
} from '../../../types/builder';
import { getCatalogueItem } from '../../../data/builderData';
import { createComponentMesh, createSnapPointVisualizer, createCatenaryWire } from './MeshFactory';

interface BuilderCanvasProps {
  components: PlacedComponent[];
  connections: WireConnection[];
  selectedComponentId: string | null;
  onSelectComponent: (id: string | null) => void;
  onUpdateComponentPosition: (id: string, newPos: [number, number, number], newRot?: [number, number, number]) => void;
  toolMode: BuilderToolMode;
  cameraPreset: CameraPresetView;
  onCameraPresetChange?: (preset: CameraPresetView) => void;
  showLabels?: boolean;
  onToggleLabels?: () => void;
  isLearnMode?: boolean;
  onToggleLearnMode?: () => void;
  showGrid: boolean;
  explodedFactor: number; // 0 (assembled) to 1 (fully exploded)
  isSimulating: boolean;
  measurementState: MeasurementState;
  onMeasurePoint: (point: { id: string; name: string; position: [number, number, number] }) => void;
  onSnapDetected?: (info: { sourceId: string; targetId: string; message: string }) => void;
  className?: string;
}

interface ProjectedLabelItem {
  id: string;
  name: string;
  category: string;
  badgeEmoji: string;
  description: string;
  screenX: number;
  screenY: number;
  inFront: boolean;
  isSelected: boolean;
  isHovered: boolean;
}

export const BuilderCanvas: React.FC<BuilderCanvasProps> = ({
  components,
  connections,
  selectedComponentId,
  onSelectComponent,
  onUpdateComponentPosition,
  toolMode,
  cameraPreset,
  onCameraPresetChange,
  showLabels = false,
  onToggleLabels,
  isLearnMode = false,
  onToggleLearnMode,
  showGrid,
  explodedFactor,
  isSimulating,
  measurementState,
  onMeasurePoint,
  onSnapDetected,
  className = ''
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const transformControlsRef = useRef<TransformControls | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const wiresGroupRef = useRef<THREE.Group | null>(null);
  const snapIndicatorsRef = useRef<THREE.Group | null>(null);
  const measurementLineRef = useRef<THREE.Line | null>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeSnapFeedback, setActiveSnapFeedback] = useState<string | null>(null);
  const [projectedLabels, setProjectedLabels] = useState<ProjectedLabelItem[]>([]);

  // Keep references to latest props for event callbacks
  const propsRef = useRef({
    components,
    selectedComponentId,
    toolMode,
    measurementState,
    onSelectComponent,
    onUpdateComponentPosition,
    onMeasurePoint,
    onSnapDetected,
    isSimulating,
    showLabels,
    hoveredId
  });

  useEffect(() => {
    propsRef.current = {
      components,
      selectedComponentId,
      toolMode,
      measurementState,
      onSelectComponent,
      onUpdateComponentPosition,
      onMeasurePoint,
      onSnapDetected,
      isSimulating,
      showLabels,
      hoveredId
    };
  });

  // ----------------------------------------------------
  // INITIALIZE THREE.JS SCENE
  // ----------------------------------------------------
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF1F5F9);
    sceneRef.current = scene;

    // 2. Camera with soft realistic depth
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(7, 6, 8);
    cameraRef.current = camera;

    // 3. Renderer with soft shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainSun = new THREE.DirectionalLight(0xffffff, 1.2);
    mainSun.position.set(10, 15, 10);
    mainSun.castShadow = true;
    mainSun.shadow.mapSize.width = 2048;
    mainSun.shadow.mapSize.height = 2048;
    mainSun.shadow.camera.near = 0.5;
    mainSun.shadow.camera.far = 40;
    mainSun.shadow.camera.left = -10;
    mainSun.shadow.camera.right = 10;
    mainSun.shadow.camera.top = 10;
    mainSun.shadow.camera.bottom = -10;
    scene.add(mainSun);

    const fillLight = new THREE.DirectionalLight(0x93C5FD, 0.45);
    fillLight.position.set(-10, 8, -10);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xFDE68A, 0.35);
    rimLight.position.set(0, -10, 5);
    scene.add(rimLight);

    // 5. Ground Plane & Grid
    const groundGeo = new THREE.PlaneGeometry(40, 40);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Circular STEM Build Platform base
    const platformGeo = new THREE.CylinderGeometry(9.2, 9.5, 0.18, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xF8FAFC,
      roughness: 0.35,
      metalness: 0.08
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = -0.1;
    platform.receiveShadow = true;
    scene.add(platform);

    // Blue platform perimeter accent ring
    const ringGeo = new THREE.RingGeometry(9.05, 9.2, 48);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3B82F6, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.005;
    scene.add(ring);

    const grid = new THREE.GridHelper(18, 36, 0x3B82F6, 0xCBD5E1);
    grid.position.y = 0;
    scene.add(grid);
    gridHelperRef.current = grid;

    // 6. Object Groups
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);
    objectsGroupRef.current = objectsGroup;

    const wiresGroup = new THREE.Group();
    scene.add(wiresGroup);
    wiresGroupRef.current = wiresGroup;

    const snapGroup = new THREE.Group();
    scene.add(snapGroup);
    snapIndicatorsRef.current = snapGroup;

    // 7. OrbitControls with smooth classroom damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Don't flip below floor
    controls.minDistance = 2;
    controls.maxDistance = 25;
    controls.target.set(0, 1.2, 0);
    controlsRef.current = controls;

    // 8. TransformControls for precise moving/rotating
    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.size = 0.75;
    transformControls.showX = true;
    transformControls.showY = true;
    transformControls.showZ = true;
    scene.add(transformControls.getHelper());
    transformControlsRef.current = transformControls;

    transformControls.addEventListener('dragging-changed', (event) => {
      controls.enabled = !event.value;
    });

    transformControls.addEventListener('objectChange', () => {
      const obj = transformControls.object;
      if (!obj) return;
      const compId = obj.name;
      if (!compId) return;

      const newPos: [number, number, number] = [obj.position.x, Math.max(0.1, obj.position.y), obj.position.z];
      const newRot: [number, number, number] = [obj.rotation.x, obj.rotation.y, obj.rotation.z];

      // Automatic Snapping Detection Check
      const currentComps = propsRef.current.components;
      const activeComp = currentComps.find(c => c.id === compId);
      if (activeComp) {
        const activeDef = getCatalogueItem(activeComp.type);
        if (activeDef && activeDef.snapPoints.length > 0) {
          // Check against all other components in scene
          for (const other of currentComps) {
            if (other.id === compId) continue;
            const otherDef = getCatalogueItem(other.type);
            if (!otherDef) continue;

            // Distance between objects
            const dx = other.position[0] - newPos[0];
            const dy = other.position[1] - newPos[1];
            const dz = other.position[2] - newPos[2];
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // Magnetic snap threshold: 0.85 units
            if (dist < 0.85) {
              // Find matching snap points
              for (const mySp of activeDef.snapPoints) {
                for (const targetSp of otherDef.snapPoints) {
                  const compatible = mySp.compatibleTypes.includes(targetSp.type) || targetSp.compatibleTypes.includes(mySp.type) || mySp.type === 'universal' || targetSp.type === 'universal';
                  if (compatible) {
                    // Snap position!
                    const snappedX = other.position[0] + targetSp.offset[0] - mySp.offset[0];
                    const snappedY = Math.max(0.1, other.position[1] + targetSp.offset[1] - mySp.offset[1]);
                    const snappedZ = other.position[2] + targetSp.offset[2] - mySp.offset[2];

                    obj.position.set(snappedX, snappedY, snappedZ);
                    propsRef.current.onUpdateComponentPosition(compId, [snappedX, snappedY, snappedZ], newRot);
                    
                    const feedback = `Snapped ${activeComp.name} to ${other.name}!`;
                    setActiveSnapFeedback(feedback);
                    if (propsRef.current.onSnapDetected) {
                      propsRef.current.onSnapDetected({ sourceId: compId, targetId: other.id, message: feedback });
                    }
                    setTimeout(() => setActiveSnapFeedback(null), 2500);
                    return;
                  }
                }
              }
            }
          }
        }
      }

      propsRef.current.onUpdateComponentPosition(compId, newPos, newRot);
    });

    // 9. Raycasting for Selection & Measurement
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      // Don't trigger raycasting if clicking on transform gizmo
      if (transformControls.dragging) return;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objectsGroup.children, true);

      if (intersects.length > 0) {
        // Find top group with componentId in userData
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && curr.parent && curr.parent !== objectsGroup) {
          curr = curr.parent;
        }
        if (curr && curr.userData && curr.userData.componentId) {
          const clickedId = curr.userData.componentId;
          const clickedComp = propsRef.current.components.find(c => c.id === clickedId);

          if (propsRef.current.toolMode === 'measure' && clickedComp) {
            propsRef.current.onMeasurePoint({
              id: clickedComp.id,
              name: clickedComp.name,
              position: clickedComp.position
            });
            return;
          }

          propsRef.current.onSelectComponent(clickedId);
          return;
        }
      } else {
        // Clicked empty workspace: deselect unless in measure mode
        if (propsRef.current.toolMode !== 'measure') {
          propsRef.current.onSelectComponent(null);
        }
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objectsGroup.children, true);

      if (intersects.length > 0) {
        let curr: THREE.Object3D | null = intersects[0].object;
        while (curr && curr.parent && curr.parent !== objectsGroup) {
          curr = curr.parent;
        }
        if (curr && curr.userData?.componentId) {
          setHoveredId(curr.userData.componentId);
          container.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredId(null);
      container.style.cursor = 'default';
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // 10. Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      controls.update();

      // If simulation is running, gently tick animated parts
      if (propsRef.current.isSimulating) {
        objectsGroup.children.forEach(obj => {
          const compType = obj.userData?.type;
          if (compType === 'wheel') {
            obj.rotation.x = elapsedTime * 6;
          } else if (compType === 'wind-turbine-hub') {
            obj.rotation.z = elapsedTime * 8;
          } else if (compType === 'servo-motor') {
            obj.rotation.y = Math.sin(elapsedTime * 3) * (Math.PI / 4);
          }
        });
      }

      // Update projected screen coordinates for 3D Labels
      const shouldProject = propsRef.current.showLabels || !!propsRef.current.selectedComponentId || !!propsRef.current.hoveredId;
      if (shouldProject && container) {
        const w = container.clientWidth;
        const h = container.clientHeight;
        const tempVec = new THREE.Vector3();
        
        const labels: ProjectedLabelItem[] = propsRef.current.components.map(comp => {
          tempVec.set(comp.position[0], comp.position[1] + 0.4, comp.position[2]);
          tempVec.project(camera);
          const inFront = tempVec.z < 1.0;
          const screenX = (tempVec.x * 0.5 + 0.5) * w;
          const screenY = (-(tempVec.y * 0.5) + 0.5) * h;
          const itemDef = getCatalogueItem(comp.type);
          return {
            id: comp.id,
            name: comp.name,
            category: comp.category,
            badgeEmoji: itemDef?.badgeEmoji || '📦',
            description: itemDef?.educationalDescription || itemDef?.description || '',
            screenX,
            screenY,
            inFront,
            isSelected: comp.id === propsRef.current.selectedComponentId,
            isHovered: comp.id === propsRef.current.hoveredId
          };
        });
        setProjectedLabels(labels);
      } else {
        setProjectedLabels([]);
      }

      renderer.render(scene, camera);
    };
    animate();

    // 11. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.dispose();
      transformControls.dispose();
    };
  }, []);

  // ----------------------------------------------------
  // SYNC GRID TOGGLE
  // ----------------------------------------------------
  useEffect(() => {
    if (gridHelperRef.current) {
      gridHelperRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // ----------------------------------------------------
  // SYNC CAMERA PRESET
  // ----------------------------------------------------
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    switch (cameraPreset) {
      case 'front':
        camera.position.set(0, 2.5, 9);
        controls.target.set(0, 1.2, 0);
        break;
      case 'top':
        camera.position.set(0, 11, 0.01);
        controls.target.set(0, 0, 0);
        break;
      case 'side':
        camera.position.set(9, 2.5, 0);
        controls.target.set(0, 1.2, 0);
        break;
      case 'isometric':
        camera.position.set(7, 7, 7);
        controls.target.set(0, 1.2, 0);
        break;
      case 'home':
      default:
        camera.position.set(6, 5, 7);
        controls.target.set(0, 1.2, 0);
        break;
    }
    controls.update();
  }, [cameraPreset]);

  // ----------------------------------------------------
  // REBUILD 3D OBJECTS & WIRES WHEN STATE CHANGES
  // ----------------------------------------------------
  useEffect(() => {
    if (!objectsGroupRef.current || !wiresGroupRef.current) return;
    const objectsGroup = objectsGroupRef.current;
    const wiresGroup = wiresGroupRef.current;

    // Clear old objects
    while (objectsGroup.children.length > 0) {
      objectsGroup.remove(objectsGroup.children[0]);
    }
    while (wiresGroup.children.length > 0) {
      wiresGroup.remove(wiresGroup.children[0]);
    }

    // Calculate center of mass for exploded view
    const center = new THREE.Vector3(0, 1.2, 0);

    // Build Component Meshes
    components.forEach(comp => {
      const isSelected = comp.id === selectedComponentId;
      const isHovered = comp.id === hoveredId;

      const mesh = createComponentMesh(comp, isSelected, isHovered, isSimulating);

      // Apply Exploded View displacement
      let posX = comp.position[0];
      let posY = comp.position[1];
      let posZ = comp.position[2];

      if (explodedFactor > 0) {
        const dir = new THREE.Vector3(posX, posY, posZ).sub(center);
        if (dir.length() < 0.01) dir.set(0, 1, 0);
        dir.normalize().multiplyScalar(explodedFactor * 2.8);
        posX += dir.x;
        posY += dir.y;
        posZ += dir.z;
      }

      mesh.position.set(posX, posY, posZ);
      mesh.rotation.set(comp.rotation[0], comp.rotation[1], comp.rotation[2]);

      // If selected or hovered, show snap point helpers
      if (isSelected || isHovered) {
        const itemDef = getCatalogueItem(comp.type);
        if (itemDef && itemDef.snapPoints.length > 0) {
          const snapHelper = createSnapPointVisualizer(itemDef.snapPoints);
          mesh.add(snapHelper);
        }
      }

      objectsGroup.add(mesh);
    });

    // Build Connecting Catenary Wires
    connections.forEach(wire => {
      const fromComp = components.find(c => c.id === wire.fromComponentId);
      const toComp = components.find(c => c.id === wire.toComponentId);
      if (fromComp && toComp) {
        const start = new THREE.Vector3(fromComp.position[0], fromComp.position[1] + 0.3, fromComp.position[2]);
        const end = new THREE.Vector3(toComp.position[0], toComp.position[1] + 0.2, toComp.position[2]);
        const line = createCatenaryWire(start, end, wire.wireColor);
        wiresGroup.add(line);
      }
    });

    // Attach TransformControls to selected object if in move or rotate mode
    if (transformControlsRef.current) {
      const tc = transformControlsRef.current;
      const helper = tc.getHelper ? tc.getHelper() : null;
      if (selectedComponentId && (toolMode === 'move' || toolMode === 'rotate')) {
        const selectedObj = objectsGroup.children.find(c => c.name === selectedComponentId);
        if (selectedObj) {
          tc.attach(selectedObj);
          tc.setMode(toolMode === 'rotate' ? 'rotate' : 'translate');
          tc.enabled = true;
          if (helper) helper.visible = true;
        } else {
          tc.detach();
          tc.enabled = false;
          if (helper) helper.visible = false;
        }
      } else {
        tc.detach();
        tc.enabled = false;
        if (helper) helper.visible = false;
      }
    }
  }, [components, connections, selectedComponentId, hoveredId, toolMode, explodedFactor, isSimulating]);

  // ----------------------------------------------------
  // MEASUREMENT RULER RENDERING
  // ----------------------------------------------------
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove previous ruler line
    if (measurementLineRef.current) {
      scene.remove(measurementLineRef.current);
      measurementLineRef.current = null;
    }

    if (measurementState.pointA && measurementState.pointB) {
      const pA = new THREE.Vector3(...measurementState.pointA.position);
      const pB = new THREE.Vector3(...measurementState.pointB.position);
      pA.y += 0.2;
      pB.y += 0.2;

      const points = [pA, pB];
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineDashedMaterial({
        color: 0x10B981,
        dashSize: 0.15,
        gapSize: 0.08,
        linewidth: 3
      });
      const ruler = new THREE.Line(geom, mat);
      ruler.computeLineDistances();
      scene.add(ruler);
      measurementLineRef.current = ruler;
    }
  }, [measurementState]);

  return (
    <div className={`relative w-full h-full select-none overflow-hidden ${className}`}>
      <div ref={mountRef} className="w-full h-full" />

      {/* Primary 3D Object Names & Helper Bar (Top Left of 3D Viewport) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Prominent "Show Object Names" Toggle Button */}
        <button
          onClick={onToggleLabels}
          id="btn-toggle-3d-labels"
          className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg backdrop-blur-md transition-all transform active:scale-95 ${
            showLabels
              ? 'bg-blue-600 text-white shadow-blue-500/30 ring-2 ring-blue-300'
              : 'bg-white/95 text-slate-700 hover:bg-white hover:text-blue-600 border border-slate-200/90 shadow-slate-200/50'
          }`}
          title="Tampilkan atau sembunyikan nama semua benda/komponen di 3D"
        >
          <span className="text-base">{showLabels ? '🏷️' : '👁️'}</span>
          <span>{showLabels ? 'Nama Benda: Aktif' : 'Perlihatkan Nama Benda'}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            showLabels ? 'bg-white/25 text-white' : 'bg-blue-50 text-blue-600 font-extrabold'
          }`}>
            {components.length} Part
          </span>
        </button>

        {/* Learn Mode / Educational Toggle */}
        <button
          onClick={onToggleLearnMode}
          className={`px-3 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all ${
            isLearnMode
              ? 'bg-amber-500 text-white shadow-amber-500/30 ring-2 ring-amber-300'
              : 'bg-white/95 text-slate-700 hover:bg-white hover:text-amber-600 border border-slate-200/90'
          }`}
          title="Mode Edukasi: Pelajari fungsi dan konsep STEM setiap komponen"
        >
          <span className="text-base">💡</span>
          <span className="hidden sm:inline">Pelajari Komponen</span>
        </button>
      </div>

      {/* Floating Camera Quick Controls (Top Right of 3D Viewport) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200/90 text-xs">
        <button
          onClick={() => onCameraPresetChange && onCameraPresetChange('home')}
          className={`px-2.5 py-1 rounded-xl text-xs font-black transition-all ${
            cameraPreset === 'home'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Home / Default View (⌂)"
        >
          ⌂
        </button>
        <button
          onClick={() => onCameraPresetChange && onCameraPresetChange('front')}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            cameraPreset === 'front'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Front View"
        >
          Front
        </button>
        <button
          onClick={() => onCameraPresetChange && onCameraPresetChange('top')}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            cameraPreset === 'top'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Top View"
        >
          Top
        </button>
        <button
          onClick={() => onCameraPresetChange && onCameraPresetChange('isometric')}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            cameraPreset === 'isometric'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Isometric 3D View"
        >
          Iso
        </button>
        <button
          onClick={() => onCameraPresetChange && onCameraPresetChange('side')}
          className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
            cameraPreset === 'side'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
          title="Side View"
        >
          Side
        </button>
      </div>

      {/* Snap Magnetic Toast Notification */}
      {activeSnapFeedback && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs shadow-lg flex items-center gap-2 animate-bounce-short">
            <span>✨</span>
            <span>{activeSnapFeedback}</span>
          </div>
        </div>
      )}

      {/* 3D Realtime Projected Object Labels ("Apa Ini?" Feature) */}
      {projectedLabels.map(label => {
        if (!label.inFront) return null;
        const isVisible = showLabels || label.isSelected || label.isHovered;
        if (!isVisible) return null;

        const categoryTheme = {
          'Structure': 'border-emerald-200 bg-emerald-50/90 text-emerald-800',
          'Connectors': 'border-purple-200 bg-purple-50/90 text-purple-800',
          'Electronics': 'border-blue-200 bg-blue-50/90 text-blue-800',
          'Movement': 'border-amber-200 bg-amber-50/90 text-amber-800'
        }[label.category] || 'border-slate-200 bg-slate-50/90 text-slate-800';

        return (
          <div
            key={label.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectComponent(label.id);
            }}
            className={`absolute z-15 -translate-x-1/2 -translate-y-full mb-3 pointer-events-auto cursor-pointer transition-all duration-200 transform ${
              label.isSelected ? 'scale-110 z-30' : 'hover:scale-105'
            }`}
            style={{ left: `${label.screenX}px`, top: `${label.screenY}px` }}
          >
            <div className={`px-3 py-1.5 rounded-2xl shadow-xl border-2 backdrop-blur-md flex items-center gap-2.5 ${
              label.isSelected 
                ? 'bg-blue-600 text-white border-blue-400 ring-4 ring-blue-400/30 shadow-blue-500/40' 
                : 'bg-white/95 text-slate-900 border-white/80 hover:border-blue-300 shadow-slate-900/10'
            }`}>
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm shadow-inner ${
                label.isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-800'
              }`}>
                {label.badgeEmoji}
              </div>
              <div className="flex flex-col text-left leading-tight pr-1">
                <span className="text-xs font-black tracking-wide">{label.name}</span>
                <span className={`text-[9px] font-black uppercase tracking-wider mt-0.5 px-1.5 py-0.2 rounded-full w-fit ${
                  label.isSelected ? 'bg-white/25 text-white' : categoryTheme
                }`}>
                  {label.category}
                </span>
              </div>
            </div>
            {/* Arrow pointer downwards */}
            <div className={`w-0 h-0 mx-auto border-x-5 border-x-transparent border-t-6 ${
              label.isSelected ? 'border-t-blue-600' : 'border-t-white'
            }`} />
          </div>
        );
      })}

      {/* Informative Hover Card (When hovering over a part) */}
      {hoveredId && !selectedComponentId && (() => {
        const hoveredComp = components.find(c => c.id === hoveredId);
        if (!hoveredComp) return null;
        const hoveredDef = getCatalogueItem(hoveredComp.type);
        return (
          <div className="absolute top-16 left-4 z-20 pointer-events-none bg-white/95 border border-slate-200/90 text-slate-900 rounded-2xl shadow-xl p-3 backdrop-blur-md max-w-xs animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg shadow-2xs">
                {hoveredDef?.badgeEmoji || '📦'}
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">{hoveredComp.name}</div>
                <div className="text-[9px] font-black uppercase text-blue-600 tracking-wider">
                  {hoveredComp.category}
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              {hoveredDef?.educationalDescription || hoveredDef?.description || 'FUNNECT modular robotics part.'}
            </p>
          </div>
        );
      })()}

      {/* Educational Mode Card (When Learn Mode is ON and a part is selected) */}
      {isLearnMode && selectedComponentId && (() => {
        const selComp = components.find(c => c.id === selectedComponentId);
        if (!selComp) return null;
        const selDef = getCatalogueItem(selComp.type);
        return (
          <div className="absolute bottom-6 left-6 z-20 bg-white/95 border border-amber-300/80 rounded-2xl shadow-xl p-4 max-w-sm backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 border-b border-amber-100 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💡</span>
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                  Learn Mode · Apa Ini?
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {selComp.category}
              </span>
            </div>
            <div className="text-sm font-black text-slate-900 mb-1 flex items-center gap-1.5">
              <span>{selDef?.badgeEmoji || '📦'}</span>
              <span>{selComp.name}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-2">
              {selDef?.educationalDescription || selDef?.description}
            </p>
            {selDef?.roleExplanation && (
              <div className="p-2 rounded-xl bg-blue-50/80 border border-blue-100 text-[11px] text-blue-900">
                <span className="font-black">Fungsi di Robot: </span>
                {selDef.roleExplanation}
              </div>
            )}
          </div>
        );
      })()}

      {/* Measurement Readout Overlay */}
      {measurementState.active && (measurementState.pointA || measurementState.pointB) && (
        <div className="absolute top-4 right-4 z-10 bg-white/95 border border-emerald-300 p-3 rounded-2xl shadow-lg backdrop-blur-xs text-xs space-y-1">
          <div className="font-black text-emerald-800 flex items-center gap-1.5">
            <span>📐</span>
            <span>STEM Measurement Tool</span>
          </div>
          <div className="text-[11px] text-slate-600">
            A: <strong>{measurementState.pointA?.name || 'Click Point 1'}</strong>
          </div>
          <div className="text-[11px] text-slate-600">
            B: <strong>{measurementState.pointB?.name || 'Click Point 2'}</strong>
          </div>
          {measurementState.distanceMm !== null && (
            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Distance:</span>
              <span className="font-black text-emerald-700 font-mono text-sm">{measurementState.distanceMm} mm</span>
            </div>
          )}
          {measurementState.angleDeg !== null && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Angle:</span>
              <span className="font-black text-blue-700 font-mono text-sm">{measurementState.angleDeg}°</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
