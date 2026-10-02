import React from 'react';
import { PlacedComponent } from '../../types/builder';
import { getCatalogueItem } from '../../data/builderData';
import { X, Wrench, Clock, Award, Hammer, ArrowRight, Printer, CheckCircle } from 'lucide-react';

interface PhysicalBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  components: PlacedComponent[];
  onOpenPhysicalGuide: () => void;
}

export const PhysicalBuildModal: React.FC<PhysicalBuildModalProps> = ({
  isOpen,
  onClose,
  components,
  onOpenPhysicalGuide
}) => {
  if (!isOpen) return null;

  // Aggregate Bill of Materials (BOM) from current 3D components
  const tallyMap = new Map<string, { name: string; category: string; count: number; emoji: string }>();

  components.forEach(comp => {
    const itemDef = getCatalogueItem(comp.type);
    const key = comp.type;
    const existing = tallyMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      tallyMap.set(key, {
        name: itemDef?.name || comp.name,
        category: comp.category,
        count: 1,
        emoji: itemDef?.badgeEmoji || '📦'
      });
    }
  });

  const materialsList = Array.from(tallyMap.values());
  const totalParts = components.length;
  const estimatedTimeMins = Math.max(15, Math.round(totalParts * 1.8));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shadow-xs">
              🔨
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Build This Physically</h2>
              <p className="text-xs text-slate-500">Virtual CAD to Physical Classroom Maker Kit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50 border-b border-slate-100 text-center py-3 px-4">
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Materials</div>
            <div className="text-base font-black text-slate-900">{totalParts} items</div>
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Build Time</div>
            <div className="text-base font-black text-blue-600 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>~{estimatedTimeMins} mins</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Skill Level</div>
            <div className="text-base font-black text-emerald-600">Beginner</div>
          </div>
        </div>

        {/* Materials List */}
        <div className="p-6 max-h-72 overflow-y-auto space-y-2">
          <div className="text-xs font-black text-slate-900 mb-2 flex items-center justify-between">
            <span>Classroom Bill of Materials (BOM)</span>
            <span className="text-[10px] text-slate-400">{materialsList.length} distinct component types</span>
          </div>

          <div className="space-y-1.5">
            {materialsList.map((mat, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl border border-slate-200/80 bg-white flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{mat.emoji}</span>
                  <div>
                    <span className="font-extrabold text-slate-900">{mat.name}</span>
                    <span className="text-[10px] text-slate-400 ml-2 uppercase font-semibold">{mat.category}</span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono font-black text-slate-800 text-xs">
                  {mat.count}×
                </div>
              </div>
            ))}
          </div>

          {materialsList.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              Workspace is empty. Add components to generate your materials list.
            </div>
          )}
        </div>

        {/* Educational Workshop Tip */}
        <div className="px-6 py-3 bg-amber-50/70 border-t border-amber-100 text-[11px] text-amber-900 flex items-center gap-2">
          <span>🌱</span>
          <span>
            <strong>Classroom Tip:</strong> FUNNECT craft sticks and cardboard panels can be reused across all student terms!
          </span>
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
          >
            Close
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenPhysicalGuide();
            }}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <Hammer className="w-4 h-4" />
            <span>Open Step-by-Step Physical Guide</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
