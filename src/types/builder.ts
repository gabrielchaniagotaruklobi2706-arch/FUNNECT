import { PortId } from '../types';

export type BuilderComponentCategory = 
  | 'STRUCTURE'
  | 'CONNECTORS'
  | 'ELECTRONICS'
  | 'MOVEMENT'
  | 'SPECIAL';

export type SnapType = 
  | 'stick-slot' 
  | 'pin' 
  | 'motor-mount' 
  | 'core-mount' 
  | 'axle' 
  | 'wheel'
  | 'port' 
  | 'universal';

export interface SnapPointDef {
  id: string;
  name: string;
  type: SnapType;
  offset: [number, number, number]; // [x, y, z] relative to component center
  normal: [number, number, number]; // direction vector [nx, ny, nz]
  compatibleTypes: SnapType[];
}

export interface BuilderItemDef {
  type: string;
  name: string;
  category: BuilderComponentCategory;
  description: string;
  badgeEmoji: string;
  compatibleWith: string[];
  dimensions: [number, number, number]; // [width, height, depth]
  color: string;
  materialType: 'wood' | 'plastic-blue' | 'plastic-yellow' | 'electronics' | 'rubber' | 'cardboard';
  snapPoints: SnapPointDef[];
  defaultModuleId?: string;
  defaultPort?: PortId;
  suggestedPortType?: 'sensor' | 'motor' | 'output';
  educationalDescription?: string;
  roleExplanation?: string;
  compatiblePorts?: string[];
}

export interface PlacedComponent {
  id: string;
  type: string;
  name: string;
  category: BuilderComponentCategory;
  position: [number, number, number];
  rotation: [number, number, number]; // Euler angles in radians [rx, ry, rz]
  scale?: [number, number, number];
  color?: string;
  connectedPort?: PortId | null;
  snappedTo?: {
    targetId: string;
    mySnapPointId: string;
    targetSnapPointId: string;
  } | null;
  isCore?: boolean;
}

export interface WireConnection {
  id: string;
  fromComponentId: string;
  fromPort: PortId;
  toComponentId: string;
  toPort?: string;
  wireColor: string;
  wireType: 'sensor' | 'motor' | 'output';
}

export interface BuildValidationIssue {
  id: string;
  severity: 'ready' | 'warning' | 'error';
  title: string;
  message: string;
  suggestion: string;
  autoFixType?: 'add-core' | 'connect-motors' | 'add-wheels' | 'wire-sensor' | 'add-connectors';
}

export interface BuildTemplate {
  id: string;
  title: string;
  subtitle: string;
  badgeEmoji: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  description: string;
  components: PlacedComponent[];
  connections: WireConnection[];
  guideSteps: {
    stepNumber: number;
    title: string;
    instruction: string;
    targetComponentType: string;
    parts: string[];
  }[];
  materials: {
    name: string;
    quantity: string;
    category: string;
    icon: string;
  }[];
}

export interface MeasurementState {
  active: boolean;
  pointA: { id: string; name: string; position: [number, number, number] } | null;
  pointB: { id: string; name: string; position: [number, number, number] } | null;
  distanceMm: number | null;
  angleDeg: number | null;
}

export type BuilderToolMode = 'select' | 'move' | 'rotate' | 'measure' | 'cable';
export type CameraPresetView = 'home' | 'front' | 'top' | 'side' | 'isometric';
