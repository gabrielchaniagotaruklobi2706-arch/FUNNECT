export type UserRole = 'student' | 'teacher';

export type PortId = 'S1' | 'S2' | 'M1' | 'M2' | 'O1' | 'O2';

export type ModuleCategory = 'INPUT' | 'OUTPUT' | 'MOVEMENT';

export interface FunnectModule {
  id: string;
  name: string;
  category: ModuleCategory;
  description: string;
  longDescription: string;
  powerDrawMa: number;
  iconName: string;
  color: string;
  compatiblePorts: PortId[];
  portType: 'sensor' | 'motor' | 'output';
  defaultUnit?: string;
  sensorType?: 'distance' | 'light' | 'moisture' | 'temperature' | 'button' | 'potentiometer';
  actuatorType?: 'motor' | 'servo' | 'led' | 'rgb-led' | 'buzzer';
}

export interface ConnectedPort {
  portId: PortId;
  label: string;
  type: 'sensor' | 'motor' | 'output';
  module: FunnectModule | null;
  value?: number | boolean;
  status: 'ready' | 'warning' | 'error' | 'empty';
}

export type SubjectCategory = 
  | 'Science' 
  | 'Technology' 
  | 'Engineering' 
  | 'Mathematics' 
  | 'Art' 
  | 'Robotics'
  | 'Informatics' 
  | 'Sustainability';

export type GradeLevel = 'Elementary' | 'Middle School' | 'High School' | 'Robotics Club';

export interface PhysicalMaterial {
  name: string;
  quantity: number | string;
  isReusable: boolean;
  category: 'craft' | 'connector' | 'core' | 'electronic' | 'hardware';
  icon: string;
  emoji?: string;
  isRecycledOrCraft?: boolean;
}

export interface BuildStep {
  stepNumber: number;
  title: string;
  description: string;
  instruction?: string;
  partsNeeded: string[];
  tip?: string;
  visualType: 'base' | 'motors' | 'core' | 'sensor' | 'wheels' | 'modules';
}

export interface ProjectGuideSection {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface FunnectProject {
  id: string;
  title: string;
  subtitle: string;
  badgeEmoji: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  description: string;
  learningOutcome: string;
  materials: PhysicalMaterial[];
  requiredMaterials?: PhysicalMaterial[];
  requiredModules: string[]; // module ids
  defaultPortMapping: Record<PortId, string | null>;
  buildSteps: BuildStep[];
  physicalBuildSteps?: BuildStep[];
  pythonCode?: string;
  codePreset: {
    blocksXml?: string;
    blockSummary: string[];
    sampleCode: string;
  };
  physicalBuildType: 
    | 'robot-car' 
    | 'windmill' 
    | 'irrigation' 
    | 'streetlight' 
    | 'solar-tracker'
    | 'automatic-barrier'
    | 'earthquake-detector'
    | 'conveyor-sorter'
    | 'crane-hoist';
  lastEdited?: string;
  progressPercent: number;
  status: 'In Progress' | 'Completed' | 'Draft';
  curriculum: string[];
  improvementChallenges: string[];
}

export interface StudentTeam {
  id: string;
  name: string;
  studentNames: string[];
  students?: string[];
  assignedDeviceId: string;
  currentProject: string;
  status: 'Building' | 'Coding' | 'Testing' | 'Need Help';
  statusColor: 'yellow' | 'blue' | 'green' | 'red';
  batteryLevel: number;
  batteryPercent?: number;
  buildProgress: number; // 0-100
  codingProgress: number; // 0-100
  progressPercent?: number;
  simulationTested: boolean;
  timeSpentMinutes: number;
  activeIssue?: string;
  lastActive: string;
  codeUploaded: boolean;
  connectedModules: string[];
}

export interface SchoolClass {
  id: string;
  name: string;
  grade: string;
  totalStudents: number;
  scheduleDay: string;
  currentProjectTitle: string;
  teams: StudentTeam[];
}

export interface FunnectCoreDevice {
  id: string;
  name: string;
  connected: boolean;
  batteryPercent: number;
  firmwareVersion: string;
  ports: Record<PortId, FunnectModule | null>;
  searchState: 'idle' | 'searching' | 'connected';
}

export interface SimulationState {
  isRunning: boolean;
  sensorValues: {
    distance: number; // 0 - 100 cm
    light: number; // 0 - 100 %
    moisture: number; // 0 - 100 %
    temperature: number; // 15 - 45 °C
    button: boolean;
    potentiometer: number; // 0 - 100 %
  };
  actuatorStates: {
    motorSpeed: number; // -100 to 100
    motorDirection: 'forward' | 'reverse' | 'stopped';
    servoAngle: number; // 0 - 180
    ledState: boolean;
    ledColor: string;
    buzzerActive: boolean;
    buzzerTone: number;
  };
  virtualObstacleDistance: number; // in cm
}

export interface LearnLesson {
  id: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  subtitle: string;
  durationMinutes: number;
  icon: string;
  summary: string;
  concepts: string[];
  handsOnBuild: string;
  quizQuestions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export type ViewType = 
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'create-project'
  | 'build-studio'
  | '3d-builder'
  | 'simulator'
  | 'learn'
  | 'my-projects'
  | 'project-guide'
  | 'classes'
  | 'activities'
  | 'progress';
