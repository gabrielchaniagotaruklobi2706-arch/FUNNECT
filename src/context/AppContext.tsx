import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole,
  ViewType,
  FunnectModule,
  FunnectProject,
  FunnectCoreDevice,
  PortId,
  SimulationState,
  SchoolClass,
  StudentTeam
} from '../types';
import { 
  FUNNECT_MODULES, 
  FUNNECT_PROJECTS, 
  INITIAL_CLASSES, 
  INITIAL_CORE_DEVICE,
  checkPortCompatibility
} from '../data/funnectData';

interface AppContextType {
  // Navigation & Role
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Projects
  projects: FunnectProject[];
  selectedProject: FunnectProject;
  setSelectedProject: (project: FunnectProject) => void;
  createNewProject: (templateId?: string) => void;
  duplicateProject: (id: string) => void;
  deleteProject: (id: string) => void;
  saveProject: (project: FunnectProject) => void;

  // Modules & Ports
  allModules: FunnectModule[];
  coreDevice: FunnectCoreDevice;
  attachModuleToPort: (portId: PortId, module: FunnectModule | null) => { success: boolean; message: string };
  removeModuleFromPort: (portId: PortId) => void;
  resetProjectPorts: (project?: FunnectProject) => void;

  // Hardware Core Connection
  connectCore: () => void;
  disconnectCore: () => void;
  deployProject: () => Promise<boolean>;
  isDeploying: boolean;
  deployProgress: number;

  // 3D Canvas View Controls
  cameraPreset: 'perspective' | 'top' | 'front' | 'side';
  setCameraPreset: (preset: 'perspective' | 'top' | 'front' | 'side') => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showSticksAndConnectors: boolean;
  setShowSticksAndConnectors: (show: boolean) => void;
  selectedPortForInspection: PortId | null;
  setSelectedPortForInspection: (port: PortId | null) => void;

  // Simulation
  simulation: SimulationState;
  toggleSimulation: () => void;
  setSensorValue: (sensor: keyof SimulationState['sensorValues'], val: number | boolean) => void;
  setVirtualObstacle: (cm: number) => void;

  // Teacher Classroom State
  classes: SchoolClass[];
  activeClass: SchoolClass;
  setActiveClass: (cls: SchoolClass) => void;
  resolveTeamIssue: (teamId: string) => void;
  broadcastToClass: (message: string) => void;
  lastBroadcast: string | null;

  // Global Notification / Toast
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [projects, setProjects] = useState<FunnectProject[]>(FUNNECT_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<FunnectProject>(FUNNECT_PROJECTS[0]);
  const [allModules] = useState<FunnectModule[]>(FUNNECT_MODULES);
  const [coreDevice, setCoreDevice] = useState<FunnectCoreDevice>(INITIAL_CORE_DEVICE);

  // 3D canvas preferences
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'top' | 'front' | 'side'>('perspective');
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [showSticksAndConnectors, setShowSticksAndConnectors] = useState<boolean>(true);
  const [selectedPortForInspection, setSelectedPortForInspection] = useState<PortId | null>('S1');

  // Deployment state
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);

  // Classroom
  const [classes, setClasses] = useState<SchoolClass[]>(INITIAL_CLASSES);
  const [activeClass, setActiveClass] = useState<SchoolClass>(INITIAL_CLASSES[0]);
  const [lastBroadcast, setLastBroadcast] = useState<string | null>(null);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Simulation State
  const [simulation, setSimulation] = useState<SimulationState>({
    isRunning: false,
    sensorValues: {
      distance: 35,
      light: 65,
      moisture: 45,
      temperature: 26,
      button: false,
      potentiometer: 50
    },
    actuatorStates: {
      motorSpeed: 0,
      motorDirection: 'stopped',
      servoAngle: 0,
      ledState: false,
      ledColor: '#3B82F6',
      buzzerActive: false,
      buzzerTone: 440
    },
    virtualObstacleDistance: 35
  });

  // Sync simulation when selectedProject changes or values change
  useEffect(() => {
    if (!simulation.isRunning) {
      setSimulation(prev => ({
        ...prev,
        actuatorStates: {
          motorSpeed: 0,
          motorDirection: 'stopped',
          servoAngle: 0,
          ledState: false,
          ledColor: '#3B82F6',
          buzzerActive: false,
          buzzerTone: 440
        }
      }));
      return;
    }

    // Interactive logic execution based on project type
    const pType = selectedProject.physicalBuildType;
    const { distance, light, moisture, button } = simulation.sensorValues;

    if (pType === 'robot-car') {
      if (distance < 20) {
        // Obstacle close! Stop and steer
        setSimulation(prev => ({
          ...prev,
          actuatorStates: {
            ...prev.actuatorStates,
            motorSpeed: 30,
            motorDirection: 'reverse',
            ledState: true,
            ledColor: '#EF4444',
            buzzerActive: distance < 10,
            buzzerTone: 880
          }
        }));
      } else {
        // Clear road! Forward full speed
        setSimulation(prev => ({
          ...prev,
          actuatorStates: {
            ...prev.actuatorStates,
            motorSpeed: 85,
            motorDirection: 'forward',
            ledState: true,
            ledColor: '#10B981',
            buzzerActive: false,
            buzzerTone: 440
          }
        }));
      }
    } else if (pType === 'windmill') {
      const speed = Math.max(0, Math.min(100, Math.round(light * 1.1)));
      setSimulation(prev => ({
        ...prev,
        actuatorStates: {
          ...prev.actuatorStates,
          motorSpeed: speed,
          motorDirection: speed > 15 ? 'forward' : 'stopped',
          ledState: speed > 50,
          ledColor: '#F59E0B'
        }
      }));
    } else if (pType === 'irrigation') {
      const isDry = moisture < 30;
      setSimulation(prev => ({
        ...prev,
        actuatorStates: {
          ...prev.actuatorStates,
          servoAngle: isDry ? 120 : 0,
          ledState: true,
          ledColor: isDry ? '#EF4444' : '#10B981',
          buzzerActive: moisture < 15
        }
      }));
    } else if (pType === 'streetlight') {
      const isDark = light < 35 || button;
      setSimulation(prev => ({
        ...prev,
        actuatorStates: {
          ...prev.actuatorStates,
          ledState: isDark,
          ledColor: isDark ? '#FACC15' : '#475569'
        }
      }));
    } else if (pType === 'solar-tracker') {
      const angle = Math.round((light / 100) * 160);
      setSimulation(prev => ({
        ...prev,
        actuatorStates: {
          ...prev.actuatorStates,
          servoAngle: angle,
          ledState: light > 20,
          ledColor: '#F59E0B'
        }
      }));
    } else if (pType === 'automatic-barrier') {
      const carArrived = distance < 25;
      setSimulation(prev => ({
        ...prev,
        actuatorStates: {
          ...prev.actuatorStates,
          servoAngle: carArrived ? 90 : 0,
          ledState: true,
          ledColor: carArrived ? '#10B981' : '#EF4444',
          buzzerActive: carArrived && distance < 12,
          buzzerTone: 587
        }
      }));
    } else if (pType === 'earthquake-detector') {
      const hasTremor = button || distance < 18;
      setSimulation(prev => ({
        ...prev,
        actuatorStates: {
          ...prev.actuatorStates,
          buzzerActive: hasTremor,
          buzzerTone: 880,
          ledState: hasTremor,
          ledColor: '#EF4444',
          motorSpeed: hasTremor ? 70 : 0
        }
      }));
    } else if (pType === 'conveyor-sorter') {
      const itemDetected = light < 45 || distance < 22;
      setSimulation(prev => ({
        ...prev,
        actuatorStates: {
          ...prev.actuatorStates,
          motorSpeed: 60,
          motorDirection: 'forward',
          servoAngle: itemDetected ? 60 : 0,
          ledState: itemDetected,
          ledColor: itemDetected ? '#3B82F6' : '#10B981'
        }
      }));
    } else if (pType === 'crane-hoist') {
      const isLifting = button || distance < 20;
      setSimulation(prev => ({
        ...prev,
        actuatorStates: {
          ...prev.actuatorStates,
          motorSpeed: isLifting ? 50 : 0,
          motorDirection: isLifting ? 'forward' : 'stopped',
          servoAngle: isLifting ? 90 : 20,
          ledState: isLifting,
          ledColor: '#3B82F6'
        }
      }));
    }
  }, [simulation.isRunning, simulation.sensorValues, selectedProject?.physicalBuildType]);

  const toggleSimulation = () => {
    setSimulation(prev => ({ ...prev, isRunning: !prev.isRunning }));
    if (!simulation.isRunning) {
      showToast('3D Simulator started! Adjust the sensor sliders to test logic.', 'success');
    }
  };

  const setSensorValue = (sensor: keyof SimulationState['sensorValues'], val: number | boolean) => {
    setSimulation(prev => ({
      ...prev,
      sensorValues: {
        ...prev.sensorValues,
        [sensor]: val
      },
      ...(sensor === 'distance' ? { virtualObstacleDistance: typeof val === 'number' ? val : prev.virtualObstacleDistance } : {})
    }));
  };

  const setVirtualObstacle = (cm: number) => {
    setSimulation(prev => ({
      ...prev,
      virtualObstacleDistance: cm,
      sensorValues: {
        ...prev.sensorValues,
        distance: cm
      }
    }));
  };

  // Port attachment with friendly validation
  const attachModuleToPort = (portId: PortId, module: FunnectModule | null) => {
    if (!module) {
      removeModuleFromPort(portId);
      return { success: true, message: 'Port cleared.' };
    }

    const check = checkPortCompatibility(portId, module);
    if (!check.compatible) {
      showToast(check.statusText, 'error');
      return { success: false, message: check.statusText };
    }

    setCoreDevice(prev => ({
      ...prev,
      ports: {
        ...prev.ports,
        [portId]: module
      }
    }));

    showToast(`🟢 Compatible: ${module.name} plugged into Port ${portId}!`, 'success');
    return { success: true, message: 'Module connected.' };
  };

  const removeModuleFromPort = (portId: PortId) => {
    setCoreDevice(prev => ({
      ...prev,
      ports: {
        ...prev.ports,
        [portId]: null
      }
    }));
  };

  const resetProjectPorts = (project: FunnectProject = selectedProject) => {
    const newPorts: Record<PortId, FunnectModule | null> = {
      S1: null,
      S2: null,
      M1: null,
      M2: null,
      O1: null,
      O2: null
    };

    Object.entries(project.defaultPortMapping).forEach(([pId, modId]) => {
      if (modId) {
        const found = allModules.find(m => m.id === modId);
        if (found) {
          newPorts[pId as PortId] = found;
        }
      }
    });

    setCoreDevice(prev => ({
      ...prev,
      ports: newPorts
    }));
  };

  // Connect to Core Life cycle
  const connectCore = () => {
    setCoreDevice(prev => ({ ...prev, searchState: 'searching' }));
    showToast('🟡 Searching for FUNNECT Core...', 'info');

    setTimeout(() => {
      setCoreDevice(prev => ({
        ...prev,
        searchState: 'connected',
        connected: true,
        batteryPercent: 94
      }));
      showToast('🟢 FUNNECT Core Connected successfully!', 'success');
    }, 1500);
  };

  const disconnectCore = () => {
    setCoreDevice(prev => ({
      ...prev,
      searchState: 'idle',
      connected: false
    }));
    showToast('FUNNECT Core disconnected.', 'info');
  };

  const deployProject = async (): Promise<boolean> => {
    if (!coreDevice.connected) {
      connectCore();
      await new Promise(r => setTimeout(r, 1600));
    }

    setIsDeploying(true);
    setDeployProgress(15);
    showToast('Checking components & preparing code...', 'info');

    await new Promise(r => setTimeout(r, 600));
    setDeployProgress(45);

    await new Promise(r => setTimeout(r, 700));
    setDeployProgress(80);

    await new Promise(r => setTimeout(r, 600));
    setDeployProgress(100);
    setIsDeploying(false);

    showToast(`🎉 "${selectedProject.title}" deployed to FUNNECT Core! Ready for real test.`, 'success');
    return true;
  };

  // Project management
  const createNewProject = (templateId?: string) => {
    const template = FUNNECT_PROJECTS.find(p => p.id === templateId) || FUNNECT_PROJECTS[0];
    const newProj: FunnectProject = {
      ...template,
      id: `proj-custom-${Date.now()}`,
      title: templateId ? `${template.title} (My Build)` : 'My Custom Invention',
      subtitle: 'Created with FUNNECT Studio',
      lastEdited: 'Just now',
      progressPercent: 20,
      status: 'In Progress'
    };

    setProjects(prev => [newProj, ...prev]);
    setSelectedProject(newProj);
    resetProjectPorts(newProj);
    setCurrentView('create-project');
    showToast(`Created new project: ${newProj.title}!`, 'success');
  };

  const duplicateProject = (id: string) => {
    const orig = projects.find(p => p.id === id);
    if (!orig) return;
    const copy: FunnectProject = {
      ...orig,
      id: `proj-copy-${Date.now()}`,
      title: `${orig.title} (Copy)`,
      lastEdited: 'Just now'
    };
    setProjects(prev => [copy, ...prev]);
    showToast(`Duplicated "${orig.title}"`, 'success');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast('Project removed.', 'info');
  };

  const saveProject = (updated: FunnectProject) => {
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    setSelectedProject(updated);
    showToast('Project saved successfully!', 'success');
  };

  // Classroom helper
  const resolveTeamIssue = (teamId: string) => {
    setClasses(prev =>
      prev.map(cls => ({
        ...cls,
        teams: cls.teams.map(t =>
          t.id === teamId
            ? { ...t, status: 'Building' as const, statusColor: 'yellow' as const, activeIssue: undefined }
            : t
        )
      }))
    );
    showToast('Team issue marked as resolved! Team is back on track.', 'success');
  };

  const broadcastToClass = (message: string) => {
    setLastBroadcast(message);
    showToast(`📢 Broadcast sent to all kits: "${message}"`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        userRole,
        setUserRole,
        projects,
        selectedProject,
        setSelectedProject,
        createNewProject,
        duplicateProject,
        deleteProject,
        saveProject,
        allModules,
        coreDevice,
        attachModuleToPort,
        removeModuleFromPort,
        resetProjectPorts,
        connectCore,
        disconnectCore,
        deployProject,
        isDeploying,
        deployProgress,
        cameraPreset,
        setCameraPreset,
        showGrid,
        setShowGrid,
        showSticksAndConnectors,
        setShowSticksAndConnectors,
        selectedPortForInspection,
        setSelectedPortForInspection,
        simulation,
        toggleSimulation,
        setSensorValue,
        setVirtualObstacle,
        classes,
        activeClass,
        setActiveClass,
        resolveTeamIssue,
        broadcastToClass,
        lastBroadcast,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
