import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PlacedComponent, 
  WireConnection, 
  BuilderToolMode, 
  CameraPresetView, 
  MeasurementState,
  BuilderItemDef,
  BuildTemplate
} from '../../types/builder';
import { BUILDER_ITEM_CATALOG, BUILD_TEMPLATES, getCatalogueItem } from '../../data/builderData';
import { PortId } from '../../types';
import { BuilderCanvas } from './3d/BuilderCanvas';
import { ComponentLibrary } from './ComponentLibrary';
import { ObjectInspector } from './ObjectInspector';
import { BuildValidationModal } from './BuildValidationModal';
import { PhysicalBuildModal } from './PhysicalBuildModal';
import { TemplatePickerModal } from './TemplatePickerModal';
import { GuideMeOverlay } from './GuideMeOverlay';
import { FunnectMascot } from '../common/FunnectMascot';
import { 
  Undo2, 
  Redo2, 
  Save, 
  Play, 
  Square, 
  CheckCircle2, 
  Sparkles, 
  Hammer, 
  Compass, 
  Grid, 
  Move, 
  RotateCw, 
  MousePointer, 
  Ruler, 
  Sliders, 
  Layers, 
  Eye, 
  ArrowRight, 
  Plus, 
  FolderPlus, 
  HelpCircle,
  X,
  RotateCcw
} from 'lucide-react';

export const BuildStudioPage: React.FC = () => {
  const { 
    selectedProject, 
    coreDevice, 
    attachModuleToPort, 
    removeModuleFromPort, 
    setCurrentView,
    showToast,
    allModules
  } = useApp();

  // Find initial template matching selectedProject if any, otherwise default to robot car
  const defaultTemplate = BUILD_TEMPLATES.find(t => 
    selectedProject.title.toLowerCase().includes('robot') || 
    selectedProject.title.toLowerCase().includes('car')
  ) || BUILD_TEMPLATES[0];

  // ----------------------------------------------------
  // BUILD STATE
  // ----------------------------------------------------
  const [components, setComponents] = useState<PlacedComponent[]>(defaultTemplate.components);
  const [connections, setConnections] = useState<WireConnection[]>(defaultTemplate.connections);
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<Array<{ components: PlacedComponent[]; connections: WireConnection[] }>>([
    { components: defaultTemplate.components, connections: defaultTemplate.connections }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Viewport and Tool Controls
  const [toolMode, setToolMode] = useState<BuilderToolMode>('select');
  const [cameraPreset, setCameraPreset] = useState<CameraPresetView>('home');
  const [showLabels, setShowLabels] = useState(false);
  const [isLearnMode, setIsLearnMode] = useState(false);
  const [isMascotHelperOpen, setIsMascotHelperOpen] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [explodedFactor, setExplodedFactor] = useState(0); // 0 (assembled) to 1 (fully exploded)
  const [isExplodedActive, setIsExplodedActive] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Dynamic Mascot Advice based on current components
  const getMascotAdvice = () => {
    const hasCore = components.some(c => c.isCore || c.type === 'funnect-core');
    const hasMotor = components.some(c => c.category === 'MOVEMENT' || c.type.includes('motor'));
    const hasWheel = components.some(c => c.type === 'wheel');
    const hasStructure = components.some(c => c.category === 'STRUCTURE');

    if (!hasCore) {
      return {
        expression: 'helping' as const,
        title: 'Mulai dengan Core!',
        text: 'Tambahkan FUNNECT Core terlebih dahulu sebagai otak dan pusat kendali robotmu. 🧠'
      };
    }
    if (!hasStructure) {
      return {
        expression: 'thinking' as const,
        title: 'Buat Rangkanya',
        text: 'Hebat! Sekarang tambahkan Craft Stick dan Corner Connector untuk membuat sasis robot.'
      };
    }
    if (!hasMotor) {
      return {
        expression: 'excited' as const,
        title: 'Beri Tenaga Motor',
        text: 'Keren! Pasang DC Motor atau Servo Motor agar robotmu bisa bergerak!'
      };
    }
    if (!hasWheel) {
      return {
        expression: 'helping' as const,
        title: 'Pasang Roda',
        text: 'Pasang Rubber Traction Wheel pada poros motor agar siap meluncur!'
      };
    }
    return {
      expression: 'success' as const,
      title: 'Robot Siap Beraksi!',
      text: 'Wah luar biasa! Susunan robotmu sudah lengkap. Klik "Check Build" atau jalankan simulasi!'
    };
  };

  const mascotAdvice = getMascotAdvice();

  // Measurement State
  const [measurementState, setMeasurementState] = useState<MeasurementState>({
    active: false,
    pointA: null,
    pointB: null,
    distanceMm: null,
    angleDeg: null
  });

  // Modals & Panels
  const [isValidationOpen, setIsValidationOpen] = useState(false);
  const [isPhysicalModalOpen, setIsPhysicalModalOpen] = useState(false);
  const [isTemplatePickerOpen, setIsTemplatePickerOpen] = useState(false);
  const [isGuideMeOpen, setIsGuideMeOpen] = useState(false);
  const [guideStepIndex, setGuideStepIndex] = useState(0);
  const [isLibraryCollapsed, setIsLibraryCollapsed] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [lastSavedTime, setLastSavedTime] = useState<string>('Just now');
  const [showTutorialTips, setShowTutorialTips] = useState(false);

  // Push new state to undo/redo history
  const pushHistory = useCallback((newComps: PlacedComponent[], newWires: WireConnection[]) => {
    setHistory(prev => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, { components: newComps, connections: newWires }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setComponents(history[nextIndex].components);
      setConnections(history[nextIndex].connections);
      showToast('Undo performed', 'info');
    }
  }, [historyIndex, history, showToast]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setComponents(history[nextIndex].components);
      setConnections(history[nextIndex].connections);
      showToast('Redo performed', 'info');
    }
  }, [historyIndex, history, showToast]);

  // ----------------------------------------------------
  // COMPONENT ACTIONS
  // ----------------------------------------------------
  const handleAddComponent = (itemDef: BuilderItemDef) => {
    // Determine spawn position near center or above existing components
    const spawnX = (Math.random() - 0.5) * 1.5;
    const spawnZ = (Math.random() - 0.5) * 1.5;
    const spawnY = itemDef.category === 'STRUCTURE' ? 0.8 : 1.2;

    const newComponent: PlacedComponent = {
      id: `comp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: itemDef.type,
      name: itemDef.name,
      category: itemDef.category,
      position: [spawnX, spawnY, spawnZ],
      rotation: [0, 0, 0],
      isCore: itemDef.type === 'funnect-core',
      connectedPort: itemDef.defaultPort || null
    };

    const nextComps = [...components, newComponent];
    let nextWires = [...connections];

    // If item has a default port and there's a core placed, auto-wire it!
    if (itemDef.defaultPort) {
      const core = components.find(c => c.isCore || c.type === 'funnect-core');
      if (core) {
        const wireColor = itemDef.suggestedPortType === 'sensor' ? '#3B82F6' : itemDef.suggestedPortType === 'motor' ? '#F97316' : '#EC4899';
        nextWires.push({
          id: `wire-${Date.now()}`,
          fromComponentId: core.id,
          fromPort: itemDef.defaultPort,
          toComponentId: newComponent.id,
          wireColor,
          wireType: itemDef.suggestedPortType || 'sensor'
        });

        // Also sync to AppContext coreDevice
        const matchingMod = allModules.find(m => m.id === itemDef.defaultModuleId || m.compatiblePorts.includes(itemDef.defaultPort!));
        if (matchingMod) {
          attachModuleToPort(itemDef.defaultPort, matchingMod);
        }
      }
    }

    setComponents(nextComps);
    setConnections(nextWires);
    setSelectedComponentId(newComponent.id);
    pushHistory(nextComps, nextWires);
    showToast(`Added ${itemDef.name} to 3D canvas!`, 'success');
  };

  const handleUpdateComponentPosition = (
    id: string, 
    newPos: [number, number, number], 
    newRot?: [number, number, number]
  ) => {
    setComponents(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          position: newPos,
          rotation: newRot || c.rotation
        };
      }
      return c;
    }));
  };

  const handleUpdateComponent = (updated: PlacedComponent) => {
    const nextComps = components.map(c => c.id === updated.id ? updated : c);
    setComponents(nextComps);
    pushHistory(nextComps, connections);
  };

  const handleDeleteComponent = (id: string) => {
    const compToDelete = components.find(c => c.id === id);
    const nextComps = components.filter(c => c.id !== id);
    const nextWires = connections.filter(w => w.fromComponentId !== id && w.toComponentId !== id);

    if (compToDelete?.connectedPort) {
      removeModuleFromPort(compToDelete.connectedPort);
    }

    setComponents(nextComps);
    setConnections(nextWires);
    setSelectedComponentId(null);
    pushHistory(nextComps, nextWires);
    showToast('Component deleted', 'info');
  };

  const handleDuplicateComponent = (id: string) => {
    const original = components.find(c => c.id === id);
    if (!original) return;

    const duplicated: PlacedComponent = {
      ...original,
      id: `comp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: `${original.name} (Copy)`,
      position: [original.position[0] + 0.4, original.position[1] + 0.2, original.position[2] + 0.4],
      connectedPort: null,
      isCore: false
    };

    const nextComps = [...components, duplicated];
    setComponents(nextComps);
    setSelectedComponentId(duplicated.id);
    pushHistory(nextComps, connections);
    showToast(`Duplicated ${original.name}!`, 'success');
  };

  const handleConnectPort = (componentId: string, portId: PortId | null) => {
    const comp = components.find(c => c.id === componentId);
    if (!comp) return;

    const core = components.find(c => c.isCore || c.type === 'funnect-core');

    const nextComps = components.map(c => {
      if (c.id === componentId) {
        return { ...c, connectedPort: portId };
      }
      return c;
    });

    let nextWires = connections.filter(w => w.toComponentId !== componentId);

    if (portId && core) {
      const itemDef = getCatalogueItem(comp.type);
      const wireColor = portId.startsWith('S') ? '#3B82F6' : portId.startsWith('M') ? '#F97316' : '#EC4899';
      const wireType = portId.startsWith('S') ? 'sensor' : portId.startsWith('M') ? 'motor' : 'output';

      nextWires.push({
        id: `wire-${Date.now()}`,
        fromComponentId: core.id,
        fromPort: portId,
        toComponentId: componentId,
        wireColor,
        wireType
      });

      // Sync with AppContext hardware representation
      const matchingMod = allModules.find(m => m.id === itemDef?.defaultModuleId || m.compatiblePorts.includes(portId));
      if (matchingMod) {
        attachModuleToPort(portId, matchingMod);
      }
      showToast(`Wired ${comp.name} to Port ${portId}!`, 'success');
    } else {
      if (comp.connectedPort) {
        removeModuleFromPort(comp.connectedPort);
      }
      showToast(`Disconnected wire from ${comp.name}.`, 'info');
    }

    setComponents(nextComps);
    setConnections(nextWires);
    pushHistory(nextComps, nextWires);
  };

  // ----------------------------------------------------
  // TEMPLATES & BLANK CANVAS
  // ----------------------------------------------------
  const handleSelectTemplate = (template: BuildTemplate) => {
    setComponents(template.components);
    setConnections(template.connections);
    setSelectedComponentId(null);
    pushHistory(template.components, template.connections);

    // Sync template ports to AppContext
    template.connections.forEach(wire => {
      const targetComp = template.components.find(c => c.id === wire.toComponentId);
      if (targetComp) {
        const itemDef = getCatalogueItem(targetComp.type);
        const mod = allModules.find(m => m.id === itemDef?.defaultModuleId || m.compatiblePorts.includes(wire.fromPort));
        if (mod) {
          attachModuleToPort(wire.fromPort, mod);
        }
      }
    });

    showToast(`Loaded "${template.title}" template!`, 'success');
  };

  const handleStartBlank = () => {
    setComponents([]);
    setConnections([]);
    setSelectedComponentId(null);
    pushHistory([], []);
    showToast('Started fresh with a blank workspace!', 'info');
  };

  // ----------------------------------------------------
  // AUTO-FIX ACTION FROM VALIDATION MODAL
  // ----------------------------------------------------
  const handleAutoFix = (fixType: string) => {
    switch (fixType) {
      case 'add-core': {
        const item = getCatalogueItem('funnect-core');
        if (item) handleAddComponent(item);
        break;
      }
      case 'add-connectors': {
        const stick = getCatalogueItem('craft-stick');
        if (stick) handleAddComponent(stick);
        break;
      }
      case 'add-wheels': {
        const wheelItem = getCatalogueItem('wheel');
        if (wheelItem) handleAddComponent(wheelItem);
        break;
      }
      case 'connect-motors': {
        const motor = components.find(c => c.type === 'dc-motor' && !c.connectedPort);
        if (motor) handleConnectPort(motor.id, 'M1');
        break;
      }
      case 'wire-sensor': {
        const sensor = components.find(c => c.category === 'ELECTRONICS' && !c.isCore && !c.connectedPort);
        if (sensor) handleConnectPort(sensor.id, 'S1');
        break;
      }
    }
  };

  // ----------------------------------------------------
  // MEASUREMENT TOOL HANDLERS
  // ----------------------------------------------------
  const handleMeasurePoint = (pt: { id: string; name: string; position: [number, number, number] }) => {
    if (!measurementState.pointA) {
      setMeasurementState(prev => ({ ...prev, pointA: pt, pointB: null, distanceMm: null, angleDeg: null }));
      showToast(`Point A selected: ${pt.name}. Now click Point B!`, 'info');
    } else {
      const pA = measurementState.pointA.position;
      const pB = pt.position;
      const dx = (pB[0] - pA[0]) * 100; // convert to mm scale
      const dy = (pB[1] - pA[1]) * 100;
      const dz = (pB[2] - pA[2]) * 100;
      const distanceMm = Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz));

      // Calculate planar angle relative to X-Z ground plane
      const angleRad = Math.atan2(pB[2] - pA[2], pB[0] - pA[0]);
      const angleDeg = Math.round(Math.abs(angleRad * (180 / Math.PI)));

      setMeasurementState(prev => ({
        ...prev,
        pointB: pt,
        distanceMm,
        angleDeg
      }));
      showToast(`Distance: ${distanceMm} mm · Angle: ${angleDeg}°`, 'success');
    }
  };

  // ----------------------------------------------------
  // KEYBOARD SHORTCUTS
  // ----------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedComponentId) {
          e.preventDefault();
          handleDeleteComponent(selectedComponentId);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedComponentId) {
          handleDuplicateComponent(selectedComponentId);
        }
      } else if (e.key.toLowerCase() === 'm') {
        setToolMode('move');
      } else if (e.key.toLowerCase() === 'r') {
        setToolMode('rotate');
      } else if (e.key.toLowerCase() === 's') {
        setToolMode('select');
      } else if (e.key === 'Escape') {
        setSelectedComponentId(null);
        setMeasurementState(prev => ({ ...prev, active: false, pointA: null, pointB: null }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, handleUndo, handleRedo]);

  const selectedComp = components.find(c => c.id === selectedComponentId) || null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* ========================================================
          TOP CONTROL BAR
          ======================================================== */}
      <header className="bg-slate-900/95 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 z-30">
        {/* Project Branding & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xl shadow-xs">
            {selectedProject.badgeEmoji || '🤖'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black text-white tracking-wide">
                {selectedProject.title}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold">
                3D CAD Studio
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">● Auto Saved</span>
              <span>·</span>
              <span>{components.length} parts in build</span>
            </div>
          </div>
        </div>

        {/* Center Edit Operations (Undo, Redo, Templates) */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60">
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button
            onClick={() => setIsTemplatePickerOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Templates</span>
          </button>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Show Names / Labels Toggle ("Apa Ini?" Feature) */}
          <button
            onClick={() => {
              const next = !showLabels;
              setShowLabels(next);
              showToast(next ? 'Label Nama Benda: Aktif 🏷️' : 'Label Nama Benda: Nonaktif', 'info');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              showLabels
                ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/40'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
            title="Tampilkan Nama Semua Komponen / Benda di 3D"
          >
            <Eye className="w-3.5 h-3.5 text-blue-300" />
            <span className="hidden sm:inline">{showLabels ? 'Nama Benda: ON' : 'Nama Benda'}</span>
          </button>

          {/* Learn Mode Toggle */}
          <button
            onClick={() => {
              const next = !isLearnMode;
              setIsLearnMode(next);
              showToast(next ? 'Mode Edukasi: Aktif 💡 Klik komponen untuk melihat penjelasan STEM!' : 'Mode Edukasi: Nonaktif', 'info');
            }}
            className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all ${
              isLearnMode
                ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-300/50'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
            title="Pelajari fungsi dan konsep STEM setiap komponen"
          >
            <span>💡</span>
            <span className="hidden sm:inline">{isLearnMode ? 'Mode Belajar: ON' : 'Mode Belajar'}</span>
          </button>

          {/* Guide Me Button */}
          <button
            onClick={() => setIsGuideMeOpen(!isGuideMeOpen)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isGuideMeOpen
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">Guide Me</span>
          </button>

          {/* Check Build Button */}
          <button
            onClick={() => setIsValidationOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Check Build</span>
          </button>

          {/* Simulation Toggle */}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              isSimulating
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-900 shadow-md animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isSimulating ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Sim</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate</span>
              </>
            )}
          </button>

          {/* Physical Build Materials Button */}
          <button
            onClick={() => setIsPhysicalModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Hammer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Physical BOM</span>
          </button>

          {/* Code this build CTA */}
          <button
            onClick={() => setCurrentView('simulator')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
          >
            <span>Code This Build</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================
          MAIN WORKSPACE LAYOUT (Left Tools + 3D Canvas + Right Inspector)
          ======================================================== */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* ========================================================
            LEFT VERTICAL TOOLBAR
            ======================================================== */}
        <aside className="bg-slate-900 border-r border-slate-800 p-2 flex lg:flex-col items-center justify-between lg:justify-start gap-2 z-20 overflow-x-auto">
          {/* Tool Modes */}
          <div className="flex lg:flex-col items-center gap-1.5">
            <button
              onClick={() => {
                setToolMode('select');
                setMeasurementState(prev => ({ ...prev, active: false }));
              }}
              className={`p-2.5 rounded-2xl transition-all ${
                toolMode === 'select' && !measurementState.active
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Select & Inspect Object (S)"
            >
              <MousePointer className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setToolMode('move');
                setMeasurementState(prev => ({ ...prev, active: false }));
              }}
              className={`p-2.5 rounded-2xl transition-all ${
                toolMode === 'move'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="3D Move Gizmo (M)"
            >
              <Move className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setToolMode('rotate');
                setMeasurementState(prev => ({ ...prev, active: false }));
              }}
              className={`p-2.5 rounded-2xl transition-all ${
                toolMode === 'rotate'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="3D Rotate Gizmo (R)"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setToolMode('measure');
                setMeasurementState(prev => ({ ...prev, active: true, pointA: null, pointB: null }));
                showToast('Measurement mode active: click two objects to measure distance & angle!', 'info');
              }}
              className={`p-2.5 rounded-2xl transition-all ${
                measurementState.active
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title="Measure Tool (Distance & Angle)"
            >
              <Ruler className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 lg:w-6 lg:h-px bg-slate-800 my-1" />

          {/* Exploded View Slider Toggle */}
          <button
            onClick={() => setIsExplodedActive(!isExplodedActive)}
            className={`p-2.5 rounded-2xl transition-all ${
              isExplodedActive
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Exploded Assembly View"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Grid Toggle */}
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`p-2.5 rounded-2xl transition-all ${
              showGrid
                ? 'text-blue-400 bg-blue-500/10'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Toggle Ground Snap Grid"
          >
            <Grid className="w-4 h-4" />
          </button>

          <div className="w-px h-6 lg:w-6 lg:h-px bg-slate-800 my-1" />

          {/* Camera View Presets */}
          <div className="flex lg:flex-col items-center gap-1">
            {(['home', 'front', 'top', 'side', 'isometric'] as CameraPresetView[]).map(preset => (
              <button
                key={preset}
                onClick={() => setCameraPreset(preset)}
                className={`px-2 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors ${
                  cameraPreset === preset
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
                title={`Switch camera to ${preset} view`}
              >
                {preset === 'isometric' ? 'ISO' : preset}
              </button>
            ))}
          </div>
        </aside>

        {/* ========================================================
            CENTER: 3D VIEWPORT CANVAS
            ======================================================== */}
        <main className="flex-1 flex flex-col relative h-[500px] lg:h-auto bg-slate-950">
          <BuilderCanvas
            components={components}
            connections={connections}
            selectedComponentId={selectedComponentId}
            onSelectComponent={id => setSelectedComponentId(id)}
            onUpdateComponentPosition={handleUpdateComponentPosition}
            toolMode={toolMode}
            cameraPreset={cameraPreset}
            onCameraPresetChange={setCameraPreset}
            showLabels={showLabels}
            onToggleLabels={() => {
              const next = !showLabels;
              setShowLabels(next);
              showToast(next ? 'Label Nama Benda: Aktif 🏷️' : 'Label Nama Benda: Nonaktif', 'info');
            }}
            isLearnMode={isLearnMode}
            onToggleLearnMode={() => {
              const next = !isLearnMode;
              setIsLearnMode(next);
              showToast(next ? 'Mode Edukasi: Aktif 💡 Klik komponen untuk melihat penjelasan STEM!' : 'Mode Edukasi: Nonaktif', 'info');
            }}
            showGrid={showGrid}
            explodedFactor={isExplodedActive ? explodedFactor : 0}
            isSimulating={isSimulating}
            measurementState={measurementState}
            onMeasurePoint={handleMeasurePoint}
            onSnapDetected={({ message }) => showToast(message, 'success')}
            className="flex-1"
          />

          {/* 3D Builder Mascot Helper (Assistant Robot) */}
          {isMascotHelperOpen ? (
            <div className="absolute bottom-4 left-4 z-20 max-w-xs animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-white/95 border-2 border-blue-200/90 backdrop-blur-md rounded-2xl shadow-xl p-3 text-slate-800 relative">
                <button
                  onClick={() => setIsMascotHelperOpen(false)}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 text-xs font-bold"
                  title="Minimize Helper"
                >
                  ✕
                </button>
                <div className="flex items-start gap-2.5">
                  <div className="shrink-0 mt-0.5">
                    <FunnectMascot size="sm" expression={mascotAdvice.expression} />
                  </div>
                  <div className="flex-1 pr-3">
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-wider">
                      FUNNECT Robot Helper
                    </div>
                    <div className="text-xs font-black text-slate-900 mt-0.5">
                      {mascotAdvice.title}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-snug font-medium">
                      {mascotAdvice.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsMascotHelperOpen(true)}
              className="absolute bottom-4 left-4 z-20 p-2.5 rounded-2xl bg-white/95 border border-blue-200 text-blue-600 shadow-lg hover:scale-105 transition-transform flex items-center gap-2 text-xs font-black backdrop-blur-md"
              title="Open Robot Helper"
            >
              <FunnectMascot size="sm" expression="helping" />
              <span className="hidden sm:inline">Tanya Bot</span>
            </button>
          )}

          {/* Empty State Overlay if 0 components */}
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
              <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-md p-6 rounded-3xl text-center max-w-sm shadow-2xl pointer-events-auto space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl">
                  🚀
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Let's build something!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Drag a component into your workspace or select an educational template to get started.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      const item = getCatalogueItem('funnect-core');
                      if (item) handleAddComponent(item);
                    }}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-colors"
                  >
                    + Add Core
                  </button>
                  <button
                    onClick={() => {
                      const item = getCatalogueItem('craft-stick');
                      if (item) handleAddComponent(item);
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-xs transition-colors"
                  >
                    + Add Stick
                  </button>
                  <button
                    onClick={() => setIsTemplatePickerOpen(true)}
                    className="col-span-2 py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-black text-xs transition-colors"
                  >
                    ⭐ Choose Ready Template
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Exploded View Floating Slider Bar */}
          {isExplodedActive && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 border border-purple-500/40 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2 text-purple-400 font-extrabold">
                <Layers className="w-4 h-4" />
                <span>Exploded View:</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={explodedFactor}
                onChange={e => setExplodedFactor(parseFloat(e.target.value))}
                className="w-44 accent-purple-500 cursor-pointer"
              />
              <span className="font-mono text-purple-300 w-10 text-right">
                {Math.round(explodedFactor * 100)}%
              </span>
              <button
                onClick={() => {
                  setExplodedFactor(0);
                  setIsExplodedActive(false);
                }}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
          )}

          {/* Guide Me Step-by-Step Floating Card */}
          {isGuideMeOpen && defaultTemplate.guideSteps && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4 pointer-events-auto">
              <GuideMeOverlay
                steps={defaultTemplate.guideSteps}
                currentStepIndex={guideStepIndex}
                onNextStep={() => setGuideStepIndex(prev => Math.min(defaultTemplate.guideSteps.length - 1, prev + 1))}
                onPrevStep={() => setGuideStepIndex(prev => Math.max(0, prev - 1))}
                onClose={() => setIsGuideMeOpen(false)}
              />
            </div>
          )}
        </main>

        {/* ========================================================
            RIGHT SIDEBAR: OBJECT INSPECTOR
            ======================================================== */}
        <aside className="w-full lg:w-80 bg-white border-l border-slate-200 z-20 flex flex-col shrink-0">
          <ObjectInspector
            component={selectedComp}
            allComponents={components}
            connections={connections}
            onUpdateComponent={handleUpdateComponent}
            onDeleteComponent={handleDeleteComponent}
            onDuplicateComponent={handleDuplicateComponent}
            onConnectPort={handleConnectPort}
          />
        </aside>
      </div>

      {/* ========================================================
          BOTTOM: COMPONENT LIBRARY DOCK
          ======================================================== */}
      <div className="z-20 bg-white shadow-lg shrink-0">
        <ComponentLibrary
          onAddComponent={handleAddComponent}
          selectedComponentType={selectedComp?.type}
          onDuplicateSelected={() => selectedComponentId && handleDuplicateComponent(selectedComponentId)}
          hasSelectedComponent={!!selectedComponentId}
        />
      </div>

      {/* ========================================================
          MODALS & OVERLAYS
          ======================================================== */}
      <BuildValidationModal
        isOpen={isValidationOpen}
        onClose={() => setIsValidationOpen(false)}
        components={components}
        connections={connections}
        onAutoFix={handleAutoFix}
        onProceedToSimulate={() => setCurrentView('simulator')}
      />

      <PhysicalBuildModal
        isOpen={isPhysicalModalOpen}
        onClose={() => setIsPhysicalModalOpen(false)}
        components={components}
        onOpenPhysicalGuide={() => setCurrentView('project-guide')}
      />

      <TemplatePickerModal
        isOpen={isTemplatePickerOpen}
        onClose={() => setIsTemplatePickerOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        onStartBlank={handleStartBlank}
      />
    </div>
  );
};
