import React, { useState } from 'react';
import { PlacedComponent, WireConnection } from '../../types/builder';
import { getCatalogueItem } from '../../data/builderData';
import { PortId } from '../../types';
import { 
  Trash2, 
  Copy, 
  RotateCw, 
  Move, 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  Cable, 
  ChevronDown, 
  ChevronUp,
  Cpu
} from 'lucide-react';

interface ObjectInspectorProps {
  component: PlacedComponent | null;
  allComponents: PlacedComponent[];
  connections: WireConnection[];
  onUpdateComponent: (comp: PlacedComponent) => void;
  onDeleteComponent: (id: string) => void;
  onDuplicateComponent: (id: string) => void;
  onConnectPort: (componentId: string, portId: PortId | null) => void;
  onClose?: () => void;
}

export const ObjectInspector: React.FC<ObjectInspectorProps> = ({
  component,
  allComponents,
  connections,
  onUpdateComponent,
  onDeleteComponent,
  onDuplicateComponent,
  onConnectPort,
  onClose
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!component) {
    return (
      <div className="p-5 text-center flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl text-slate-300">
          📐
        </div>
        <div>
          <div className="text-xs font-black text-slate-700">No Component Selected</div>
          <p className="text-[11px] text-slate-400 mt-1 max-w-[200px]">
            Click any part in the 3D workspace to inspect, rotate, or connect ports.
          </p>
        </div>
      </div>
    );
  }

  const itemDef = getCatalogueItem(component.type);

  // Position Nudge
  const nudgePosition = (axisIndex: 0 | 1 | 2, delta: number) => {
    const newPos: [number, number, number] = [...component.position];
    newPos[axisIndex] = Math.round((newPos[axisIndex] + delta) * 10) / 10;
    if (axisIndex === 1) newPos[1] = Math.max(0.1, newPos[1]); // keep above ground
    onUpdateComponent({ ...component, position: newPos });
  };

  // Quick 90° or 45° Rotate
  const rotateComponent = (angleRad: number, axisIndex: 0 | 1 | 2 = 1) => {
    const newRot: [number, number, number] = [...component.rotation];
    newRot[axisIndex] = (newRot[axisIndex] + angleRad) % (Math.PI * 2);
    onUpdateComponent({ ...component, rotation: newRot });
  };

  const isElectronic = component.category === 'ELECTRONICS' && !component.isCore;
  const isMotor = component.category === 'MOVEMENT' && component.type.includes('motor');
  const wireToMe = connections.find(w => w.toComponentId === component.id);

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 text-xs overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-xs">
            {itemDef?.badgeEmoji || '📦'}
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-900 leading-tight">
              {component.name}
            </h3>
            <span
              className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-black uppercase mt-1 ${
                component.category === 'STRUCTURE'
                  ? 'bg-amber-100 text-amber-800'
                  : component.category === 'CONNECTORS'
                  ? 'bg-blue-100 text-blue-800'
                  : component.category === 'ELECTRONICS'
                  ? 'bg-purple-100 text-purple-800'
                  : component.category === 'MOVEMENT'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {component.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicateComponent(component.id)}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
            title="Duplicate Component"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteComponent(component.id)}
            className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition-colors"
            title="Delete Component"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-4 flex-1">
        {/* Educational Info Card (Apa Fungsinya & Fungsi di Robot) */}
        {itemDef && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-200/80 space-y-2.5">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-blue-700 flex items-center gap-1">
                <span>💡</span>
                <span>Apa Fungsinya?</span>
              </div>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">
                {itemDef.educationalDescription || itemDef.description}
              </p>
            </div>

            {itemDef.roleExplanation && (
              <div className="pt-2 border-t border-blue-200/60">
                <div className="text-[10px] font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                  <span>🤖</span>
                  <span>Fungsi di Robot</span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed font-medium">
                  {itemDef.roleExplanation}
                </p>
              </div>
            )}

            {itemDef.compatiblePorts && itemDef.compatiblePorts.length > 0 && (
              <div className="pt-2 border-t border-blue-200/60 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-slate-500">Port Kompatibel:</span>
                {itemDef.compatiblePorts.map(p => (
                  <span key={p} className="px-1.5 py-0.5 rounded bg-blue-200/70 text-blue-900 font-mono text-[10px] font-black">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Port Wiring Section for Sensors, Motors, and Outputs */}
        {(isElectronic || isMotor) && (
          <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-blue-900 flex items-center gap-1.5 text-xs">
                <Cable className="w-3.5 h-3.5 text-blue-600" />
                <span>Core Port Connection</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-200/60 text-blue-900 font-bold">
                {component.connectedPort ? `Port ${component.connectedPort}` : 'Unwired'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(['S1', 'S2', 'M1', 'M2', 'O1', 'O2'] as PortId[]).map(port => {
                const isSelected = component.connectedPort === port;
                const isCompatible =
                  (port.startsWith('S') && (itemDef?.suggestedPortType === 'sensor' || component.category === 'ELECTRONICS')) ||
                  (port.startsWith('M') && (itemDef?.suggestedPortType === 'motor' || isMotor)) ||
                  (port.startsWith('O') && (itemDef?.suggestedPortType === 'output'));

                return (
                  <button
                    key={port}
                    onClick={() => onConnectPort(component.id, isSelected ? null : port)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : isCompatible
                        ? 'bg-white border-blue-300 text-blue-800 hover:bg-blue-100'
                        : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span>{port}</span>
                    {isSelected && <span>✓</span>}
                  </button>
                );
              })}
            </div>

            {component.connectedPort ? (
              <p className="text-[10px] text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Connected by flexible hardware cable to FUNNECT Core.</span>
              </p>
            ) : (
              <p className="text-[10px] text-amber-700 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                <span>Select a compatible port above to wire this part.</span>
              </p>
            )}
          </div>
        )}

        {/* FUNNECT Core Special Info */}
        {component.isCore && (
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2 text-xs">
            <div className="font-extrabold text-indigo-900 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>FUNNECT Core Master Controller</span>
            </div>
            <p className="text-[11px] text-indigo-700">
              The main processor. All sensors, motors, and light modules communicate through its 6 smart ports.
            </p>
            <div className="text-[10px] text-indigo-600 font-mono">
              Active Wires: <strong>{connections.length} connected</strong>
            </div>
          </div>
        )}

        {/* Quick 3D Rotation Controls */}
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <RotateCw className="w-3 h-3" />
            <span>Quick Rotation (Turn)</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            <button
              onClick={() => rotateComponent(-Math.PI / 4, 1)}
              className="py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-extrabold text-[11px] text-slate-700"
              title="Rotate -45°"
            >
              -45°
            </button>
            <button
              onClick={() => rotateComponent(Math.PI / 4, 1)}
              className="py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-extrabold text-[11px] text-slate-700"
              title="Rotate +45°"
            >
              +45°
            </button>
            <button
              onClick={() => rotateComponent(-Math.PI / 2, 1)}
              className="py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-extrabold text-[11px] text-slate-700"
              title="Rotate -90°"
            >
              -90°
            </button>
            <button
              onClick={() => rotateComponent(Math.PI / 2, 1)}
              className="py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-extrabold text-[11px] text-slate-700"
              title="Rotate +90°"
            >
              +90°
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              onClick={() => rotateComponent(Math.PI / 2, 0)}
              className="py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-[10px] text-slate-600"
              title="Tilt Pitch 90°"
            >
              Flip Up / Down (X)
            </button>
            <button
              onClick={() => rotateComponent(Math.PI / 2, 2)}
              className="py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-[10px] text-slate-600"
              title="Roll 90°"
            >
              Roll Sideways (Z)
            </button>
          </div>
        </div>

        {/* Position Nudge Controls */}
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Move className="w-3 h-3" />
            <span>Nudge Position (Grid Steps)</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {/* X-axis */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-black text-red-500 block mb-1">X (Left / Right)</span>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => nudgePosition(0, -0.2)}
                  className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-black text-xs"
                >
                  -
                </button>
                <span className="font-mono text-xs font-bold">{component.position[0].toFixed(1)}</span>
                <button
                  onClick={() => nudgePosition(0, 0.2)}
                  className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-black text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Y-axis */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-black text-emerald-500 block mb-1">Y (Height)</span>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => nudgePosition(1, -0.2)}
                  className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-black text-xs"
                >
                  -
                </button>
                <span className="font-mono text-xs font-bold">{component.position[1].toFixed(1)}</span>
                <button
                  onClick={() => nudgePosition(1, 0.2)}
                  className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-black text-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Z-axis */}
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-black text-blue-500 block mb-1">Z (Forward / Back)</span>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => nudgePosition(2, -0.2)}
                  className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-black text-xs"
                >
                  -
                </button>
                <span className="font-mono text-xs font-bold">{component.position[2].toFixed(1)}</span>
                <button
                  onClick={() => nudgePosition(2, 0.2)}
                  className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 font-black text-xs"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Accordion */}
        <div className="border-t border-slate-100 pt-2">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-slate-800 py-1"
          >
            <span>Advanced Properties</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-2 p-2.5 rounded-xl bg-slate-50 font-mono text-[10px] text-slate-600 space-y-1">
              <div>ID: <span className="text-slate-900 font-bold">{component.id}</span></div>
              <div>Type: <span className="text-slate-900 font-bold">{component.type}</span></div>
              <div>Dimensions: <span className="text-slate-900 font-bold">{itemDef?.dimensions.join(' × ') || '1x1x1'}</span></div>
              <div>Snap Points: <span className="text-slate-900 font-bold">{itemDef?.snapPoints.length || 0} active</span></div>
              <div>Compatible With: <span className="text-slate-900 font-bold">{itemDef?.compatibleWith.join(', ') || 'General'}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
