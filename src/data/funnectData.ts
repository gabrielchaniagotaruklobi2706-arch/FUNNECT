import { 
  FunnectModule, 
  FunnectProject, 
  SchoolClass, 
  FunnectCoreDevice, 
  LearnLesson, 
  PortId 
} from '../types';

export const FUNNECT_MODULES: FunnectModule[] = [
  // --- INPUT CATEGORY ---
  {
    id: 'mod-distance',
    name: 'Distance Sensor',
    category: 'INPUT',
    description: 'Detects how close objects or hands are.',
    longDescription: 'Emits safe ultrasonic waves to measure distances from 2 cm up to 200 cm. Perfect for collision avoidance and interactive obstacle gates.',
    powerDrawMa: 40,
    iconName: 'Ruler',
    color: '#3B82F6',
    compatiblePorts: ['S1', 'S2'],
    portType: 'sensor',
    defaultUnit: 'cm',
    sensorType: 'distance'
  },
  {
    id: 'mod-light',
    name: 'Light Sensor',
    category: 'INPUT',
    description: 'Measures ambient room light and brightness.',
    longDescription: 'Reads ambient lux levels from 0% (dark) to 100% (bright daylight). Used for automated night lamps and solar trackers.',
    powerDrawMa: 25,
    iconName: 'SunMedium',
    color: '#3B82F6',
    compatiblePorts: ['S1', 'S2'],
    portType: 'sensor',
    defaultUnit: '%',
    sensorType: 'light'
  },
  {
    id: 'mod-temperature',
    name: 'Temperature Sensor',
    category: 'INPUT',
    description: 'Measures warmth of air, water, or objects.',
    longDescription: 'Accurate thermal sensor reading between 15°C and 50°C. Ideal for weather stations and thermal insulation tests.',
    powerDrawMa: 20,
    iconName: 'Thermometer',
    color: '#3B82F6',
    compatiblePorts: ['S1', 'S2'],
    portType: 'sensor',
    defaultUnit: '°C',
    sensorType: 'temperature'
  },
  {
    id: 'mod-moisture',
    name: 'Moisture Sensor',
    category: 'INPUT',
    description: 'Measures soil dampness and water levels.',
    longDescription: 'Dual-prong sensor measuring moisture in potted soil or sponges from 0% (bone dry) to 100% (saturated water).',
    powerDrawMa: 35,
    iconName: 'Droplets',
    color: '#3B82F6',
    compatiblePorts: ['S1', 'S2'],
    portType: 'sensor',
    defaultUnit: '%',
    sensorType: 'moisture'
  },
  {
    id: 'mod-button',
    name: 'Push Button',
    category: 'INPUT',
    description: 'Tactile press button for user input.',
    longDescription: 'Friendly large push button with snap spring. Great for doorbell triggers, game controllers, and horn switches.',
    powerDrawMa: 15,
    iconName: 'CircleDot',
    color: '#3B82F6',
    compatiblePorts: ['S1', 'S2'],
    portType: 'sensor',
    defaultUnit: 'state',
    sensorType: 'button'
  },
  {
    id: 'mod-potentiometer',
    name: 'Potentiometer',
    category: 'INPUT',
    description: 'Rotary knob to control speed or angles.',
    longDescription: 'Smooth dial that turns from 0° to 300° (0% to 100%). Perfect for steering wheels and dimming sliders.',
    powerDrawMa: 20,
    iconName: 'Gauge',
    color: '#3B82F6',
    compatiblePorts: ['S1', 'S2'],
    portType: 'sensor',
    defaultUnit: '%',
    sensorType: 'potentiometer'
  },

  // --- OUTPUT CATEGORY ---
  {
    id: 'mod-led',
    name: 'LED Light',
    category: 'OUTPUT',
    description: 'Clear bright light indicator.',
    longDescription: 'Soft glow LED light that turns on, flashes, or pulses to give clear visual feedback.',
    powerDrawMa: 30,
    iconName: 'Lightbulb',
    color: '#EC4899',
    compatiblePorts: ['O1', 'O2'],
    portType: 'output',
    actuatorType: 'led'
  },
  {
    id: 'mod-rgb-led',
    name: 'RGB LED',
    category: 'OUTPUT',
    description: 'Multi-color light dome (Red, Green, Blue).',
    longDescription: 'Frosted eye-safe RGB dome that mixes vibrant red, green, blue, yellow, and purple illumination.',
    powerDrawMa: 45,
    iconName: 'Sparkles',
    color: '#EC4899',
    compatiblePorts: ['O1', 'O2'],
    portType: 'output',
    actuatorType: 'rgb-led'
  },
  {
    id: 'mod-buzzer',
    name: 'Sound Buzzer',
    category: 'OUTPUT',
    description: 'Plays beeps, tones, and melodies.',
    longDescription: 'Piezo sound buzzer able to play alert beeps, musical scales (Do-Re-Mi), and cheerful celebration chimes.',
    powerDrawMa: 40,
    iconName: 'Volume2',
    color: '#EC4899',
    compatiblePorts: ['O1', 'O2'],
    portType: 'output',
    actuatorType: 'buzzer'
  },

  // --- MOVEMENT CATEGORY ---
  {
    id: 'mod-dc-motor',
    name: 'DC Motor',
    category: 'MOVEMENT',
    description: 'Continuous rotation for wheels and fans.',
    longDescription: 'High-torque geared classroom DC motor with dual D-shaft that locks directly onto FUNNECT connectors, ice cream sticks, and wheels.',
    powerDrawMa: 180,
    iconName: 'Cog',
    color: '#F97316',
    compatiblePorts: ['M1', 'M2'],
    portType: 'motor',
    actuatorType: 'motor'
  },
  {
    id: 'mod-servo',
    name: 'Servo Motor',
    category: 'MOVEMENT',
    description: 'Precise angle movement from 0° to 180°.',
    longDescription: 'Precision positional servo arm with multi-hole horn designed for steering, lifting barrier gates, and robotic waving arms.',
    powerDrawMa: 150,
    iconName: 'RotateCw',
    color: '#F97316',
    compatiblePorts: ['M1', 'M2'],
    portType: 'motor',
    actuatorType: 'servo'
  }
];

export const FUNNECT_PROJECTS: FunnectProject[] = [
  {
    id: 'proj-robot-car',
    title: 'Robot Car',
    subtitle: 'Build an obstacle avoiding robot',
    badgeEmoji: '🚗',
    category: 'Robotics',
    difficulty: 'Beginner',
    durationMinutes: 45,
    description: 'Construct a 2-wheel drive robotic chassis using ice cream sticks and FUNNECT connectors, mounted with an ultrasonic distance sensor to steer clear of obstacles autonomously.',
    learningOutcome: 'Understand closed-loop robotics, conditional logic (IF/ELSE), and ultrasonic distance calculation.',
    materials: [
      { name: 'Ice Cream Sticks', quantity: '18 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'FUNNECT Connectors', quantity: '8 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'DC Motors', quantity: '2 pcs', isReusable: true, category: 'electronic', icon: 'Cog' },
      { name: 'Rubber Wheels', quantity: '2 pcs', isReusable: true, category: 'hardware', icon: 'Circle' },
      { name: 'Distance Sensor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Ruler' },
      { name: 'Caster Wheel / Smooth Glider', quantity: '1 pc', isReusable: true, category: 'hardware', icon: 'Disc' }
    ],
    requiredModules: ['mod-distance', 'mod-dc-motor'],
    defaultPortMapping: {
      S1: 'mod-distance',
      S2: null,
      M1: 'mod-dc-motor',
      M2: 'mod-dc-motor',
      O1: null,
      O2: null
    },
    buildSteps: [
      {
        stepNumber: 1,
        title: 'Build the Base',
        description: 'Connect 4 ice cream sticks using FUNNECT 90° corner connectors to form a sturdy rectangular chassis frame.',
        partsNeeded: ['4 × Ice Cream Sticks', '4 × FUNNECT 90° Connectors'],
        tip: 'Ensure the joints are snapped tightly so the car does not wobble on uneven tables.',
        visualType: 'base'
      },
      {
        stepNumber: 2,
        title: 'Attach the Motors',
        description: 'Snap the two DC Motors onto the left and right motor mounts at the rear of the frame.',
        partsNeeded: ['2 × DC Motors', '2 × FUNNECT Motor Clips'],
        tip: 'Check that both motor shafts point directly outward in parallel lines.',
        visualType: 'motors'
      },
      {
        stepNumber: 3,
        title: 'Mount the Core',
        description: 'Place the FUNNECT Core in the middle of the frame using the magnetic snap mounts, keeping ports easily accessible.',
        partsNeeded: ['1 × FUNNECT Core'],
        tip: 'Position the power switch facing the top for convenient access during testing.',
        visualType: 'core'
      },
      {
        stepNumber: 4,
        title: 'Attach the Distance Sensor',
        description: 'Mount the Distance Sensor at the front bumper pointing directly forward like robot eyes.',
        partsNeeded: ['1 × Distance Sensor', '2 × Sticks', '1 × Swivel Connector'],
        tip: 'Angle the sensor slightly upward so it does not falsely detect floor reflections.',
        visualType: 'sensor'
      },
      {
        stepNumber: 5,
        title: 'Connect the Wheels',
        description: 'Push the two rubber traction wheels onto the motor D-shafts, and mount the front caster glider under the nose.',
        partsNeeded: ['2 × Rubber Wheels', '1 × Caster Wheel'],
        tip: 'Spin each wheel gently with your fingers to ensure smooth, unhindered rotation.',
        visualType: 'wheels'
      },
      {
        stepNumber: 6,
        title: 'Connect the Modules',
        description: 'Plug the Distance Sensor cable into Port S1, the Left Motor into Port M1, and the Right Motor into Port M2.',
        partsNeeded: ['Connecting ribbon cables'],
        tip: 'Route wires neatly along the stick frame so they do not catch on the spinning wheels.',
        visualType: 'modules'
      }
    ],
    codePreset: {
      blockSummary: [
        'WHEN START',
        'FOREVER',
        '  distance = READ DISTANCE SENSOR (S1)',
        '  IF distance < 20 cm THEN',
        '    STOP MOTOR (M1, M2)',
        '    WAIT 0.2s',
        '    TURN RIGHT (M1 Forward, M2 Reverse)',
        '  ELSE',
        '    MOVE FORWARD (M1 Forward, M2 Forward)'
      ],
      sampleCode: `# FUNNECT Robot Car Obstacle Avoider
from funnect import Core

core = Core()

while True:
    dist = core.ports.S1.read_distance()
    if dist < 20:
        core.ports.M1.stop()
        core.ports.M2.stop()
        core.sleep(0.2)
        core.ports.M1.set_speed(70)
        core.ports.M2.set_speed(-70)
        core.sleep(0.4)
    else:
        core.ports.M1.set_speed(80)
        core.ports.M2.set_speed(80)`
    },
    physicalBuildType: 'robot-car',
    lastEdited: '2 hours ago',
    progressPercent: 75,
    status: 'In Progress',
    curriculum: ['Mechanics & Chassis', 'Ultrasonic Reflection', 'Algorithmic Decision Branching'],
    improvementChallenges: [
      'Add an RGB LED on Port O1 that turns RED when backing up and GREEN when moving forward.',
      'Add a Buzzer on Port O2 to beep an alert horn when an obstacle is dangerously close (< 10 cm).'
    ]
  },
  {
    id: 'proj-windmill',
    title: 'Windmill',
    subtitle: 'Explore movement and energy',
    badgeEmoji: '🌬️',
    category: 'Physics & Energy',
    difficulty: 'Beginner',
    durationMinutes: 40,
    description: 'Create an upright kinetic wind turbine tower using wooden sticks, cardboard blades, and FUNNECT connectors, powered by an adjustable speed motor and light sensor.',
    learningOutcome: 'Investigate renewable energy concepts, torque transmission, and blade surface area aerodynamics.',
    materials: [
      { name: 'Ice Cream Sticks', quantity: '16 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Bamboo Skewers', quantity: '4 pcs', isReusable: true, category: 'craft', icon: 'Maximize2' },
      { name: 'Cardboard Fan Blades', quantity: '4 pcs', isReusable: true, category: 'craft', icon: 'Layers' },
      { name: 'FUNNECT Connectors', quantity: '10 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'DC Motor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Cog' },
      { name: 'Light Sensor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'SunMedium' }
    ],
    requiredModules: ['mod-light', 'mod-dc-motor'],
    defaultPortMapping: {
      S1: 'mod-light',
      S2: null,
      M1: 'mod-dc-motor',
      M2: null,
      O1: null,
      O2: null
    },
    buildSteps: [
      {
        stepNumber: 1,
        title: 'Build the Base',
        description: 'Construct a broad triangular tripod base using 6 ice cream sticks and flexible 3-way connectors.',
        partsNeeded: ['6 × Sticks', '3 × 3-Way Connectors'],
        visualType: 'base'
      },
      {
        stepNumber: 2,
        title: 'Attach the Motors',
        description: 'Mount the DC Motor horizontally at the tower apex using the motor bracket.',
        partsNeeded: ['1 × DC Motor', 'Apex Tower Clip'],
        visualType: 'motors'
      },
      {
        stepNumber: 3,
        title: 'Mount the Core',
        description: 'Secure the FUNNECT Core to the lower tower crossbar to act as stabilizing ballast.',
        partsNeeded: ['1 × FUNNECT Core'],
        visualType: 'core'
      },
      {
        stepNumber: 4,
        title: 'Attach the Distance Sensor',
        description: 'Position the Light Sensor on the sun-facing side of the tower.',
        partsNeeded: ['1 × Light Sensor'],
        visualType: 'sensor'
      },
      {
        stepNumber: 5,
        title: 'Connect the Wheels',
        description: 'Fasten the 4 cardboard turbine blades onto the central rotor hub and slide onto the motor shaft.',
        partsNeeded: ['4 × Rotor Blades', '1 × Rotor Hub'],
        visualType: 'wheels'
      },
      {
        stepNumber: 6,
        title: 'Connect the Modules',
        description: 'Connect Light Sensor to S1 and DC Motor to M1.',
        partsNeeded: ['2 × Ribbon Cables'],
        visualType: 'modules'
      }
    ],
    codePreset: {
      blockSummary: [
        'WHEN START',
        'FOREVER',
        '  sunlight = READ LIGHT SENSOR (S1)',
        '  IF sunlight > 40 THEN',
        '    SET MOTOR SPEED (M1) = sunlight',
        '  ELSE',
        '    STOP MOTOR (M1)'
      ],
      sampleCode: `# FUNNECT Solar-Responsive Windmill
from funnect import Core

core = Core()

while True:
    lux = core.ports.S1.read_light()
    if lux > 40:
        core.ports.M1.set_speed(lux)
    else:
        core.ports.M1.stop()
    core.sleep(0.1)`
    },
    physicalBuildType: 'windmill',
    lastEdited: '3 days ago',
    progressPercent: 100,
    status: 'Completed',
    curriculum: ['Renewable Energy', 'Aerodynamics', 'Proportional Control'],
    improvementChallenges: [
      'Angle the blades at 30° vs 45° to observe how blade pitch affects maximum rotation speed.',
      'Add an LED on Port O1 that brightens proportionally to the power generated.'
    ]
  },
  {
    id: 'proj-smart-irrigation',
    title: 'Smart Irrigation',
    subtitle: 'Build an automatic watering system',
    badgeEmoji: '🌱',
    category: 'Sustainability & Bio',
    difficulty: 'Intermediate',
    durationMinutes: 50,
    description: 'Design a water-conserving plant care planter frame with reusable sticks and connectors. When soil moisture drops below threshold, the servo arm tips the drip reservoir automatically.',
    learningOutcome: 'Understand soil hygrometry, natural resource conservation, and servo lever mechanisms.',
    materials: [
      { name: 'Ice Cream Sticks', quantity: '14 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Recycled Paper Cup / Reservoir', quantity: '1 pc', isReusable: true, category: 'craft', icon: 'CupSoda' },
      { name: 'FUNNECT Connectors', quantity: '8 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'Moisture Sensor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Droplets' },
      { name: 'Servo Motor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'RotateCw' },
      { name: 'RGB LED', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Sparkles' }
    ],
    requiredModules: ['mod-moisture', 'mod-servo', 'mod-rgb-led'],
    defaultPortMapping: {
      S1: 'mod-moisture',
      S2: null,
      M1: 'mod-servo',
      M2: null,
      O1: 'mod-rgb-led',
      O2: null
    },
    buildSteps: [
      {
        stepNumber: 1,
        title: 'Build the Base',
        description: 'Construct a square frame to hold a small plant pot securely with 8 ice cream sticks.',
        partsNeeded: ['8 × Sticks', '4 × Corner Connectors'],
        visualType: 'base'
      },
      {
        stepNumber: 2,
        title: 'Attach the Motors',
        description: 'Attach the Servo Motor to the pivot crossbeam 10 cm above the soil surface.',
        partsNeeded: ['1 × Servo Motor', 'Servo Mount'],
        visualType: 'motors'
      },
      {
        stepNumber: 3,
        title: 'Mount the Core',
        description: 'Mount the Core to the splash-protected outer upright stick.',
        partsNeeded: ['1 × FUNNECT Core'],
        visualType: 'core'
      },
      {
        stepNumber: 4,
        title: 'Attach the Distance Sensor',
        description: 'Insert the Moisture Sensor dual probes straight down into the potting soil or test sponge.',
        partsNeeded: ['1 × Moisture Sensor'],
        visualType: 'sensor'
      },
      {
        stepNumber: 5,
        title: 'Connect the Wheels',
        description: 'Connect the servo horn to the mini water tipping cup arm.',
        partsNeeded: ['Tipping Arm', 'Cup'],
        visualType: 'wheels'
      },
      {
        stepNumber: 6,
        title: 'Connect the Modules',
        description: 'Moisture Sensor to Port S1, Servo to Port M1, and RGB LED to Port O1.',
        partsNeeded: ['3 × Cables'],
        visualType: 'modules'
      }
    ],
    codePreset: {
      blockSummary: [
        'WHEN START',
        'FOREVER',
        '  moisture = READ MOISTURE SENSOR (S1)',
        '  IF moisture < 30% THEN',
        '    SET RGB LED (O1) = RED',
        '    SERVO (M1) TO 120° (Tilt water)',
        '    WAIT 1.5s',
        '    SERVO (M1) TO 0° (Reset upright)',
        '  ELSE',
        '    SET RGB LED (O1) = GREEN'
      ],
      sampleCode: `# FUNNECT Smart Plant Hydration
from funnect import Core

core = Core()

while True:
    moisture = core.ports.S1.read_moisture()
    if moisture < 30:
        core.ports.O1.set_color('red')
        core.ports.M1.set_angle(120)
        core.sleep(1.5)
        core.ports.M1.set_angle(0)
    else:
        core.ports.O1.set_color('green')
    core.sleep(2.0)`
    },
    physicalBuildType: 'irrigation',
    lastEdited: 'Yesterday',
    progressPercent: 90,
    status: 'In Progress',
    curriculum: ['Soil Chemistry', 'Resource Stewardship', 'Hysteresis & Thresholds'],
    improvementChallenges: [
      'Calibrate sensor readings between moist organic potting soil and dry sand.',
      'Add a gentle Buzzer chime on Port O2 when the reservoir needs manual refilling.'
    ]
  },
  {
    id: 'proj-street-light',
    title: 'Smart Street Light',
    subtitle: 'Create an automatic light system',
    badgeEmoji: '💡',
    category: 'Civic Tech & Smart Cities',
    difficulty: 'Beginner',
    durationMinutes: 35,
    description: 'Construct a miniature street lamp post with bamboo and cardboard. An ambient light sensor detects sunset darkness to trigger the LED street lamp and conserve energy.',
    learningOutcome: 'Learn about energy efficiency, smart grid sensors, and threshold hysteresis.',
    materials: [
      { name: 'Bamboo Skewers / Chopsticks', quantity: '4 pcs', isReusable: true, category: 'craft', icon: 'Maximize2' },
      { name: 'Ice Cream Sticks', quantity: '8 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Cardboard Baseplate', quantity: '1 pc', isReusable: true, category: 'craft', icon: 'Square' },
      { name: 'FUNNECT Connectors', quantity: '6 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'Light Sensor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'SunMedium' },
      { name: 'LED Light / RGB LED', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Lightbulb' }
    ],
    requiredModules: ['mod-light', 'mod-led'],
    defaultPortMapping: {
      S1: 'mod-light',
      S2: null,
      M1: null,
      M2: null,
      O1: 'mod-led',
      O2: null
    },
    buildSteps: [
      {
        stepNumber: 1,
        title: 'Build the Base',
        description: 'Cross 4 ice cream sticks to form a broad, stable street pavement foundation.',
        partsNeeded: ['4 × Sticks', '4 × Base Grippers'],
        visualType: 'base'
      },
      {
        stepNumber: 2,
        title: 'Attach the Motors',
        description: 'Erect the bamboo post vertically and attach the arching lamp head bracket.',
        partsNeeded: ['2 × Bamboo Posts', 'Elbow Connector'],
        visualType: 'motors'
      },
      {
        stepNumber: 3,
        title: 'Mount the Core',
        description: 'Mount the Core cleanly at the rear of the post as an electrical transformer box.',
        partsNeeded: ['1 × FUNNECT Core'],
        visualType: 'core'
      },
      {
        stepNumber: 4,
        title: 'Attach the Distance Sensor',
        description: 'Point the Light Sensor upward toward the classroom ceiling lights.',
        partsNeeded: ['1 × Light Sensor'],
        visualType: 'sensor'
      },
      {
        stepNumber: 5,
        title: 'Connect the Wheels',
        description: 'Fasten the frosted lamp shade dome and install the LED underneath.',
        partsNeeded: ['1 × LED Dome', 'Lamp Shade'],
        visualType: 'wheels'
      },
      {
        stepNumber: 6,
        title: 'Connect the Modules',
        description: 'Light Sensor into S1, LED Light into O1.',
        partsNeeded: ['2 × Cables'],
        visualType: 'modules'
      }
    ],
    codePreset: {
      blockSummary: [
        'WHEN START',
        'FOREVER',
        '  lux = READ LIGHT SENSOR (S1)',
        '  IF lux < 35% THEN',
        '    TURN ON LED (O1)',
        '  ELSE',
        '    TURN OFF LED (O1)'
      ],
      sampleCode: `# FUNNECT Smart Municipal Lamp
from funnect import Core

core = Core()

while True:
    lux = core.ports.S1.read_light()
    if lux < 35:
        core.ports.O1.on()
    else:
        core.ports.O1.off()
    core.sleep(0.5)`
    },
    physicalBuildType: 'streetlight',
    lastEdited: '4 hours ago',
    progressPercent: 40,
    status: 'In Progress',
    curriculum: ['Photocells', 'Smart Urban Planning', 'Energy Conservation'],
    improvementChallenges: [
      'Add a Push Button on Port S2 to simulate an emergency pedestrian crossing override.',
      'Program the light to dim gradually rather than abruptly turning off.'
    ]
  },
  {
    id: 'proj-solar-tracker',
    title: 'Smart Solar Sunflower',
    subtitle: 'Follow sunlight for maximum energy',
    badgeEmoji: '🌻',
    category: 'Physics & Clean Energy',
    difficulty: 'Intermediate',
    durationMinutes: 45,
    description: 'Construct a sunflower solar tracker using craft sticks, cardboard petals, and a rotating servo. The light sensor detects the brightest sunlight direction and pivots the solar face automatically.',
    learningOutcome: 'Understand renewable solar efficiency, angular servo control, and closed-loop light tracking.',
    materials: [
      { name: 'Ice Cream Sticks', quantity: '14 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Cardboard Petal Disc', quantity: '1 pc', isReusable: true, category: 'craft', icon: 'Sun' },
      { name: 'Bamboo Pivot Axle', quantity: '2 pcs', isReusable: true, category: 'craft', icon: 'Maximize2' },
      { name: 'FUNNECT Connectors', quantity: '8 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'Micro Servo Motor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'RotateCw' },
      { name: 'Light Sensor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'SunMedium' },
      { name: 'LED Indicator', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Lightbulb' }
    ],
    requiredMaterials: [
      { name: 'Ice Cream Sticks', quantity: '14 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Cardboard Petal Disc', quantity: '1 pc', isReusable: true, category: 'craft', icon: 'Sun' },
      { name: 'FUNNECT Connectors', quantity: '8 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'Micro Servo Motor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'RotateCw' },
      { name: 'Light Sensor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'SunMedium' }
    ],
    requiredModules: ['mod-light', 'mod-servo', 'mod-led'],
    defaultPortMapping: {
      S1: 'mod-light',
      S2: null,
      M1: 'mod-servo',
      M2: null,
      O1: 'mod-led',
      O2: null
    },
    buildSteps: [
      {
        stepNumber: 1,
        title: 'Construct Planter Base',
        description: 'Form a hexagonal base using 6 ice cream sticks and corner connectors for rock-solid stability.',
        partsNeeded: ['6 × Sticks', '6 × Connectors'],
        visualType: 'base'
      },
      {
        stepNumber: 2,
        title: 'Erect Vertical Twin Masts',
        description: 'Mount two upright vertical sticks to support the rotating sunflower pivot axle.',
        partsNeeded: ['4 × Sticks', '2 × Upright Brackets'],
        visualType: 'motors'
      },
      {
        stepNumber: 3,
        title: 'Attach Servo Swivel',
        description: 'Secure the micro-servo between the masts and connect its horn to the flower backing plate.',
        partsNeeded: ['1 × Micro Servo', 'Servo Horn'],
        visualType: 'core'
      },
      {
        stepNumber: 4,
        title: 'Assemble Sunflower Head',
        description: 'Cut yellow cardboard petals, mount the light sensor in the dark center, and attach to the servo arm.',
        partsNeeded: ['Cardboard Disc', '1 × Light Sensor'],
        visualType: 'sensor'
      },
      {
        stepNumber: 5,
        title: 'Mount FUNNECT Core',
        description: 'Seat the Core on the rear platform of the base and plug in the sensor and servo cables.',
        partsNeeded: ['1 × FUNNECT Core', '2 × Cables'],
        visualType: 'modules'
      }
    ],
    codePreset: {
      blockSummary: [
        'WHEN START',
        'FOREVER',
        '  lux = READ LIGHT SENSOR (S1)',
        '  targetAngle = MAP (lux, 0, 100, 10, 170)',
        '  SET SERVO (M1) TO targetAngle',
        '  IF lux > 50% THEN SET LED (O1) = ON'
      ],
      sampleCode: `# FUNNECT Solar Sunflower Tracker
from funnect import Core

core = Core()

while True:
    lux = core.ports.S1.read_light()
    target_angle = int((lux / 100.0) * 160) + 10
    core.ports.M1.set_angle(target_angle)
    if lux > 50:
        core.ports.O1.on()
    else:
        core.ports.O1.off()
    core.sleep(0.3)`
    },
    physicalBuildType: 'solar-tracker',
    lastEdited: 'Just now',
    progressPercent: 50,
    status: 'In Progress',
    curriculum: ['Heliotropism', 'Solar Photovoltaics', 'Closed-Loop Proportional Tracking'],
    improvementChallenges: [
      'Add a second light sensor on Port S2 to compare left vs right sunlight and steer autonomously.',
      'Program night-time sleep mode to return the sunflower east at dusk.'
    ]
  },
  {
    id: 'proj-automatic-barrier',
    title: 'Automatic Boom Barrier',
    subtitle: 'Smart railway crossing & toll gate',
    badgeEmoji: '🚧',
    category: 'Robotics & Automation',
    difficulty: 'Intermediate',
    durationMinutes: 40,
    description: 'Build an automated railway boom gate with popsicle sticks and a micro servo. An ultrasonic sensor detects arriving vehicles to automatically lift the barrier and switch signal lights.',
    learningOutcome: 'Master ultrasonic distance triggering, safety interlocks, and state-machine transitions.',
    materials: [
      { name: 'Ice Cream Sticks', quantity: '16 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Red/White Striped Tape', quantity: '1 roll', isReusable: true, category: 'craft', icon: 'Shield' },
      { name: 'Bamboo Axle Pin', quantity: '2 pcs', isReusable: true, category: 'craft', icon: 'Maximize2' },
      { name: 'FUNNECT Connectors', quantity: '8 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'Micro Servo Motor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'RotateCw' },
      { name: 'Ultrasonic Distance Sensor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Radio' },
      { name: 'LED Traffic Light', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Lightbulb' },
      { name: 'Buzzer Siren', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Volume2' }
    ],
    requiredMaterials: [
      { name: 'Ice Cream Sticks', quantity: '16 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'FUNNECT Connectors', quantity: '8 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'Micro Servo Motor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'RotateCw' },
      { name: 'Ultrasonic Distance Sensor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Radio' }
    ],
    requiredModules: ['mod-distance', 'mod-servo', 'mod-led', 'mod-buzzer'],
    defaultPortMapping: {
      S1: 'mod-distance',
      S2: null,
      M1: 'mod-servo',
      M2: null,
      O1: 'mod-led',
      O2: 'mod-buzzer'
    },
    buildSteps: [
      {
        stepNumber: 1,
        title: 'Assemble Checkpoint Booth',
        description: 'Construct a twin-pillar tower using ice cream sticks joined by 90-degree corner brackets.',
        partsNeeded: ['8 × Sticks', '4 × Corner Brackets'],
        visualType: 'base'
      },
      {
        stepNumber: 2,
        title: 'Craft the Boom Barrier Arm',
        description: 'Glue 2 sticks lengthwise, apply alternating red-and-white stripes, and affix a counterweight block.',
        partsNeeded: ['3 × Sticks', 'Stripe Tape'],
        visualType: 'motors'
      },
      {
        stepNumber: 3,
        title: 'Mount Servo Actuator',
        description: 'Fasten the servo to the tower pillar and press the barrier arm securely onto the servo horn.',
        partsNeeded: ['1 × Micro Servo', 'Mounting Bracket'],
        visualType: 'core'
      },
      {
        stepNumber: 4,
        title: 'Install Vehicle Sensor',
        description: 'Mount the ultrasonic sensor at road height facing incoming traffic lanes.',
        partsNeeded: ['1 × Distance Sensor'],
        visualType: 'sensor'
      },
      {
        stepNumber: 5,
        title: 'Wire Core & Indicators',
        description: 'Connect Distance Sensor to S1, Servo to M1, Signal LED to O1, and Buzzer to O2.',
        partsNeeded: ['FUNNECT Core', '4 × Cables'],
        visualType: 'modules'
      }
    ],
    codePreset: {
      blockSummary: [
        'WHEN START',
        'FOREVER',
        '  dist = READ DISTANCE SENSOR (S1)',
        '  IF dist < 25 cm THEN',
        '    SET LED (O1) = GREEN',
        '    PLAY CHIME (O2)',
        '    SET SERVO (M1) TO 90° (Raise Gate)',
        '    WAIT 3s',
        '  ELSE',
        '    SET LED (O1) = RED',
        '    SET SERVO (M1) TO 0° (Lower Gate)'
      ],
      sampleCode: `# FUNNECT Automatic Toll Barrier
from funnect import Core

core = Core()

while True:
    dist = core.ports.S1.read_distance()
    if dist < 25:
        core.ports.O1.set_color('green')
        core.ports.O2.beep(frequency=587, duration=0.2)
        core.ports.M1.set_angle(90)
        core.sleep(3.0)
    else:
        core.ports.O1.set_color('red')
        core.ports.M1.set_angle(0)
    core.sleep(0.2)`
    },
    physicalBuildType: 'automatic-barrier',
    lastEdited: '3 hours ago',
    progressPercent: 65,
    status: 'In Progress',
    curriculum: ['Automated Traffic Systems', 'Proximity Detection', 'Safety Interlock Logic'],
    improvementChallenges: [
      'Add a countdown timer on the LED display before lowering the boom gate.',
      'Add a safety sensor so the gate immediately reopens if an obstacle is under the bar.'
    ]
  },
  {
    id: 'proj-earthquake-detector',
    title: 'Seismic Earthquake Alarm',
    subtitle: 'Detect ground vibrations & warning alert',
    badgeEmoji: '📈',
    category: 'Earth Science & Safety',
    difficulty: 'Intermediate',
    durationMinutes: 45,
    description: 'Construct an A-frame seismograph tower with a suspended inertial pendulum bob. When tremors occur, the vibration sensor sounds a siren and pulses an emergency beacon.',
    learningOutcome: 'Investigate tectonic wave propagation, harmonic oscillators, and emergency alarm broadcasting.',
    materials: [
      { name: 'Ice Cream Sticks', quantity: '18 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Suspension String / Wire', quantity: '1 pc', isReusable: true, category: 'craft', icon: 'Activity' },
      { name: 'Heavy Pendulum Bob (Nut / Clay)', quantity: '1 pc', isReusable: true, category: 'craft', icon: 'Circle' },
      { name: 'Cardboard Paper Drum', quantity: '1 pc', isReusable: true, category: 'craft', icon: 'Layers' },
      { name: 'FUNNECT Connectors', quantity: '10 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'Tilt / Vibration Sensor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Vibrate' },
      { name: 'Emergency Buzzer', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Volume2' },
      { name: 'Warning Strobe LED', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'AlertTriangle' }
    ],
    requiredMaterials: [
      { name: 'Ice Cream Sticks', quantity: '18 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Suspension String', quantity: '1 pc', isReusable: true, category: 'craft', icon: 'Activity' },
      { name: 'FUNNECT Connectors', quantity: '10 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'Tilt / Vibration Sensor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Vibrate' }
    ],
    requiredModules: ['mod-tilt', 'mod-buzzer', 'mod-led'],
    defaultPortMapping: {
      S1: 'mod-tilt',
      S2: null,
      M1: null,
      M2: null,
      O1: 'mod-buzzer',
      O2: 'mod-led'
    },
    buildSteps: [
      {
        stepNumber: 1,
        title: 'Build Seismic Ground Plate',
        description: 'Craft a reinforced square base with shock-isolating rubber dampers at the 4 corners.',
        partsNeeded: ['4 × Sticks', 'Base Dampers'],
        visualType: 'base'
      },
      {
        stepNumber: 2,
        title: 'Assemble A-Frame Gantry',
        description: 'Erect 4 diagonal sticks meeting at an apex peak to form a rigid suspension pyramid.',
        partsNeeded: ['8 × Sticks', 'Apex Connector'],
        visualType: 'motors'
      },
      {
        stepNumber: 3,
        title: 'Suspend Inertial Pendulum',
        description: 'Suspend the heavy bob on a taut string from the apex so the stylus tip touches the recording bed.',
        partsNeeded: ['1 × String', '1 × Heavy Bob'],
        visualType: 'core'
      },
      {
        stepNumber: 4,
        title: 'Attach Vibration Sensor',
        description: 'Clamp the tilt/vibration sensor securely to the bedrock platform to register subtle shocks.',
        partsNeeded: ['1 × Tilt Sensor'],
        visualType: 'sensor'
      },
      {
        stepNumber: 5,
        title: 'Mount Strobe Beacon & Siren',
        description: 'Mount the red strobe dome on top of the A-frame and connect Buzzer and Core.',
        partsNeeded: ['FUNNECT Core', 'Buzzer', 'LED Strobe'],
        visualType: 'modules'
      }
    ],
    codePreset: {
      blockSummary: [
        'WHEN START',
        'FOREVER',
        '  shaking = READ VIBRATION SENSOR (S1)',
        '  IF shaking == TRUE THEN',
        '    PULSE LED (O2) = RED (Emergency)',
        '    SOUND SIREN (O1) AT 880 Hz',
        '    WAIT 2s',
        '  ELSE',
        '    SET LED (O2) = OFF',
        '    MUTE SIREN (O1)'
      ],
      sampleCode: `# FUNNECT Seismic Warning System
from funnect import Core

core = Core()

while True:
    tremor = core.ports.S1.read_tilt()
    if tremor:
        for _ in range(5):
            core.ports.O2.set_color('red')
            core.ports.O1.beep(frequency=880, duration=0.15)
            core.sleep(0.1)
            core.ports.O2.off()
            core.sleep(0.1)
    else:
        core.ports.O2.off()
        core.sleep(0.1)`
    },
    physicalBuildType: 'earthquake-detector',
    lastEdited: '5 hours ago',
    progressPercent: 80,
    status: 'In Progress',
    curriculum: ['Seismology & Richter Scale', 'Harmonic Inertia', 'Civil Disaster Preparedness'],
    improvementChallenges: [
      'Calibrate tremor sensitivity thresholds between mild footsteps and real seismic shocks.',
      'Add an IoT data log that records the timestamp and duration of every vibration event.'
    ]
  },
  {
    id: 'proj-conveyor-sorter',
    title: 'Smart Recycling Sorter',
    subtitle: 'Automated conveyor belt & diverter',
    badgeEmoji: '🏭',
    category: 'Industrial Automation',
    difficulty: 'Advanced',
    durationMinutes: 55,
    description: 'Construct a motorized conveyor belt using popsicle stick trusses and rolling axles. An optical sensor detects incoming recyclable items, and a servo diverter kicks them into designated sorting bins.',
    learningOutcome: 'Learn about manufacturing automation, conveyor mechanical advantage, and optical item classification.',
    materials: [
      { name: 'Ice Cream Sticks', quantity: '22 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Bamboo Skewer Rollers', quantity: '5 pcs', isReusable: true, category: 'craft', icon: 'Maximize2' },
      { name: 'Rubber / Cardboard Belt', quantity: '1 loop', isReusable: true, category: 'craft', icon: 'Layers' },
      { name: 'Sorting Bins (Cardboard)', quantity: '2 pcs', isReusable: true, category: 'craft', icon: 'Archive' },
      { name: 'FUNNECT Connectors', quantity: '12 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'DC Motor Module', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Cog' },
      { name: 'Micro Servo Motor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'RotateCw' },
      { name: 'Light / Color Sensor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'SunMedium' }
    ],
    requiredMaterials: [
      { name: 'Ice Cream Sticks', quantity: '22 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Bamboo Skewer Rollers', quantity: '5 pcs', isReusable: true, category: 'craft', icon: 'Maximize2' },
      { name: 'FUNNECT Connectors', quantity: '12 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'DC Motor Module', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Cog' },
      { name: 'Micro Servo Motor', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'RotateCw' }
    ],
    requiredModules: ['mod-light', 'mod-dc-motor', 'mod-servo', 'mod-led'],
    defaultPortMapping: {
      S1: 'mod-light',
      S2: null,
      M1: 'mod-dc-motor',
      M2: 'mod-servo',
      O1: 'mod-led',
      O2: null
    },
    buildSteps: [
      {
        stepNumber: 1,
        title: 'Build Conveyor Bed Frame',
        description: 'Construct parallel side rails using paired sticks and spacer cross-members.',
        partsNeeded: ['8 × Sticks', '4 × Spacers'],
        visualType: 'base'
      },
      {
        stepNumber: 2,
        title: 'Install Roller Axles & Belt',
        description: 'Slide bamboo skewer axles through guide connectors and loop the conveyor belt track.',
        partsNeeded: ['5 × Bamboo Rollers', '1 × Track Belt'],
        visualType: 'motors'
      },
      {
        stepNumber: 3,
        title: 'Couple Drive Motor',
        description: 'Attach the DC motor to the drive roller with a snug rubber friction coupling.',
        partsNeeded: ['1 × DC Motor', 'Motor Bracket'],
        visualType: 'core'
      },
      {
        stepNumber: 4,
        title: 'Erect Inspection Arch',
        description: 'Build an arch spanning the conveyor and mount the optical sensor looking down.',
        partsNeeded: ['4 × Sticks', '1 × Light Sensor'],
        visualType: 'sensor'
      },
      {
        stepNumber: 5,
        title: 'Mount Sorter Diverter Arm',
        description: 'Position the micro servo arm beside the belt to sweep detected items into the sorting bin.',
        partsNeeded: ['1 × Servo Motor', 'Diverter Paddle'],
        visualType: 'modules'
      }
    ],
    codePreset: {
      blockSummary: [
        'WHEN START',
        'START MOTOR (M1) SPEED 60% (Run Belt)',
        'FOREVER',
        '  itemLight = READ SENSOR (S1)',
        '  IF itemLight < 40% THEN',
        '    SET LED (O1) = BLUE (Recyclable Plastic)',
        '    WAIT 0.5s',
        '    SERVO (M2) TO 60° (Divert to Blue Bin)',
        '    WAIT 0.8s',
        '    SERVO (M2) TO 0° (Reset Arm)'
      ],
      sampleCode: `# FUNNECT Automated Sorting Conveyor
from funnect import Core

core = Core()
core.ports.M1.set_speed(60)

while True:
    lux = core.ports.S1.read_light()
    if lux < 40:
        core.ports.O1.set_color('blue')
        core.sleep(0.4)
        core.ports.M2.set_angle(60)
        core.sleep(0.8)
        core.ports.M2.set_angle(0)
    else:
        core.ports.O1.set_color('green')
    core.sleep(0.1)`
    },
    physicalBuildType: 'conveyor-sorter',
    lastEdited: '1 hour ago',
    progressPercent: 45,
    status: 'In Progress',
    curriculum: ['Circular Economy & Recycling', 'Continuous Motion Kinematics', 'Optical Actuation Timing'],
    improvementChallenges: [
      'Add an item tally counter that counts total sorted items and shows the score.',
      'Add a second diverter paddle for 3-way material sorting.'
    ]
  },
  {
    id: 'proj-crane-hoist',
    title: 'Recycled Tower Crane',
    subtitle: 'Mechanical advantage & cable hoist',
    badgeEmoji: '🏗️',
    category: 'Civil & Mechanical Engineering',
    difficulty: 'Advanced',
    durationMinutes: 60,
    description: 'Assemble a tall lattice tower crane from cross-braced popsicle sticks. A motorized winch drum winds cable over pulley jibs to lift heavy payload containers gracefully.',
    learningOutcome: 'Explore pulley mechanical advantage, structural shear forces, and counterbalanced equilibrium.',
    materials: [
      { name: 'Ice Cream Sticks', quantity: '28 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Bamboo Jib Beams', quantity: '4 pcs', isReusable: true, category: 'craft', icon: 'Maximize2' },
      { name: 'Hoist Cable String', quantity: '1 spool', isReusable: true, category: 'craft', icon: 'Anchor' },
      { name: 'Cardboard Cargo Crate', quantity: '1 pc', isReusable: true, category: 'craft', icon: 'Box' },
      { name: 'Counterweight Block', quantity: '1 pc', isReusable: true, category: 'craft', icon: 'Shield' },
      { name: 'FUNNECT Connectors', quantity: '14 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'DC Motor Module (Winch)', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Cog' },
      { name: 'Potentiometer Control Knob', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Sliders' },
      { name: 'Indicator LED', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Lightbulb' }
    ],
    requiredMaterials: [
      { name: 'Ice Cream Sticks', quantity: '28 pcs', isReusable: true, category: 'craft', icon: 'Scissors' },
      { name: 'Bamboo Jib Beams', quantity: '4 pcs', isReusable: true, category: 'craft', icon: 'Maximize2' },
      { name: 'FUNNECT Connectors', quantity: '14 pcs', isReusable: true, category: 'connector', icon: 'Link' },
      { name: 'FUNNECT Core', quantity: '1 pc', isReusable: true, category: 'core', icon: 'Cpu' },
      { name: 'DC Motor Module', quantity: '1 pc', isReusable: true, category: 'electronic', icon: 'Cog' }
    ],
    requiredModules: ['mod-potentiometer', 'mod-dc-motor', 'mod-led'],
    defaultPortMapping: {
      S1: 'mod-potentiometer',
      S2: null,
      M1: 'mod-dc-motor',
      M2: null,
      O1: 'mod-led',
      O2: null
    },
    buildSteps: [
      {
        stepNumber: 1,
        title: 'Construct Cross-Braced Mast',
        description: 'Build a sturdy triangular truss mast with vertical sticks and alternating diagonal braces.',
        partsNeeded: ['12 × Sticks', '6 × 3-Way Connectors'],
        visualType: 'base'
      },
      {
        stepNumber: 2,
        title: 'Assemble Jib & Counter-Jib',
        description: 'Create the long horizontal working boom and short rear arm with counterweight box.',
        partsNeeded: ['8 × Sticks', 'Counterweight'],
        visualType: 'motors'
      },
      {
        stepNumber: 3,
        title: 'Install Winch Spool',
        description: 'Attach the DC motor with cylindrical spool drum at the base of the mast.',
        partsNeeded: ['1 × DC Motor', '1 × Cable Spool'],
        visualType: 'core'
      },
      {
        stepNumber: 4,
        title: 'Thread Pulley Cable',
        description: 'Route the hoist string over the apex pulley down to the metal cargo hook ring.',
        partsNeeded: ['String Cable', 'Pulley Wheel', 'Cargo Hook'],
        visualType: 'sensor'
      },
      {
        stepNumber: 5,
        title: 'Mount Core & Control Knob',
        description: 'Mount the Core at the base plate and plug in the potentiometer knob into Port S1.',
        partsNeeded: ['FUNNECT Core', 'Potentiometer Knob'],
        visualType: 'modules'
      }
    ],
    codePreset: {
      blockSummary: [
        'WHEN START',
        'FOREVER',
        '  knob = READ POTENTIOMETER (S1)',
        '  IF knob > 60% THEN',
        '    MOTOR (M1) FORWARD SPEED (knob) (Winch Up)',
        '    SET LED (O1) = BLUE',
        '  ELSE IF knob < 40% THEN',
        '    MOTOR (M1) REVERSE SPEED (40) (Lower Hook)',
        '    SET LED (O1) = AMBER',
        '  ELSE',
        '    STOP MOTOR (M1)',
        '    SET LED (O1) = GREEN'
      ],
      sampleCode: `# FUNNECT Tower Crane Winch Control
from funnect import Core

core = Core()

while True:
    knob = core.ports.S1.read_potentiometer()
    if knob > 60:
        core.ports.M1.set_speed(int((knob - 60) * 2.5))
        core.ports.O1.set_color('blue')
    elif knob < 40:
        core.ports.M1.set_speed(-int((40 - knob) * 2.5))
        core.ports.O1.set_color('amber')
    else:
        core.ports.M1.stop()
        core.ports.O1.set_color('green')
    core.sleep(0.05)`
    },
    physicalBuildType: 'crane-hoist',
    lastEdited: 'Just now',
    progressPercent: 55,
    status: 'In Progress',
    curriculum: ['Truss Physics & Center of Mass', 'Mechanical Advantage of Pulleys', 'Analog Control Systems'],
    improvementChallenges: [
      'Add an ultrasonic sensor near the hook to prevent collision with the crane jib.',
      'Implement an automatic hoisting preset that lifts cargo, pauses, and safely sets it down.'
    ]
  }
];

// Ensure all projects have both buildSteps and physicalBuildSteps, plus pythonCode, requiredMaterials and step instructions
FUNNECT_PROJECTS.forEach(proj => {
  proj.buildSteps = proj.buildSteps.map(s => ({
    ...s,
    instruction: s.instruction || s.description
  }));
  proj.physicalBuildSteps = proj.buildSteps;
  proj.requiredMaterials = proj.materials;
  proj.pythonCode = proj.codePreset.sampleCode;
});

export const LEARN_LESSONS: LearnLesson[] = [
  // --- BEGINNER ---
  {
    id: 'learn-sensor',
    level: 'Beginner',
    title: 'What is a Sensor?',
    subtitle: 'Giving your inventions eyes, ears, and touch',
    durationMinutes: 10,
    icon: 'Eye',
    summary: 'Sensors are digital senses. Just like humans use eyes to see light and ears to hear sound, a FUNNECT project uses sensors to understand its surroundings.',
    concepts: [
      'An input device converts physical world phenomena into electrical numbers.',
      'The Distance Sensor uses ultrasound echo timing to calculate distance.',
      'The Light Sensor measures illumination percentage from 0% (dark) to 100% (bright).'
    ],
    handsOnBuild: 'Connect the Light Sensor to Port S1. Cover it with your palm and watch the live slider drop!',
    quizQuestions: [
      {
        question: 'Which FUNNECT port type is designed for sensors like Distance and Light?',
        options: ['M ports (M1, M2)', 'S ports (S1, S2)', 'O ports (O1, O2)', 'Power only'],
        correctIndex: 1,
        explanation: 'Sensors are inputs and connect to S1 or S2 on the FUNNECT Core.'
      }
    ]
  },
  {
    id: 'learn-motor',
    level: 'Beginner',
    title: 'What is a Motor?',
    subtitle: 'Creating motion, spin, and mechanical work',
    durationMinutes: 12,
    icon: 'Cog',
    summary: 'Motors convert electrical energy into mechanical movement. With DC Motors you get continuous spinning for wheels, while Servo Motors give you precise angle control from 0° to 180°.',
    concepts: [
      'DC Motors rotate continuously for car wheels and windmill blades.',
      'Servo Motors hold exact angles for steering, robot arms, and lifting gates.',
      'Movement components connect to ports M1 and M2 on the Core.'
    ],
    handsOnBuild: 'Mount a DC motor to an ice cream stick and test speed from 0 to 100.',
    quizQuestions: [
      {
        question: 'What is the main difference between a DC Motor and a Servo Motor?',
        options: [
          'DC Motors spin continuously, while Servos move to specific angles (0°-180°)',
          'Servos only work in water',
          'DC Motors are only used for lighting up',
          'There is no difference'
        ],
        correctIndex: 0,
        explanation: 'DC motors spin continuously for driving wheels, while servos turn to precise angles.'
      }
    ]
  },
  {
    id: 'learn-core',
    level: 'Beginner',
    title: 'Introduction to Core',
    subtitle: 'Meet the brain of your inventions',
    durationMinutes: 10,
    icon: 'Cpu',
    summary: 'The FUNNECT Core is the central microcontroller that runs your code, powers attached modules, reads sensor inputs, and commands motor outputs.',
    concepts: [
      'Rechargeable battery powers all connected modules safely.',
      'Dedicated ports: S1/S2 for sensors, M1/M2 for motors, O1/O2 for outputs.',
      'One-click wireless sync to test your code instantly.'
    ],
    handsOnBuild: 'Turn on your Core, look at the status LED, and check battery level.',
    quizQuestions: [
      {
        question: 'What is the primary role of the FUNNECT Core?',
        options: [
          'It is just a battery pack',
          'It is the brain that runs your program and controls all modules',
          'It is only a plastic decoration',
          'It only connects to the internet'
        ],
        correctIndex: 1,
        explanation: 'The Core is the brain of the project, receiving inputs and driving actuators.'
      }
    ]
  },
  {
    id: 'learn-connectors',
    level: 'Beginner',
    title: 'Introduction to Connectors',
    subtitle: 'Turning everyday sticks into rigid structures',
    durationMinutes: 8,
    icon: 'Link',
    summary: 'FUNNECT Connectors are durable, snap-fit joints designed to hold standard ice cream sticks, bamboo skewers, and cardboard plates into strong 2D and 3D geometric trusses.',
    concepts: [
      'Triangles are the strongest shape in structural engineering.',
      'Connectors are 100% reusable — snap, build, dismantle, and reuse!',
      'Combine craft materials with precision snap joints.'
    ],
    handsOnBuild: 'Build a rigid triangle using 3 ice cream sticks and 3 connectors.',
    quizQuestions: [
      {
        question: 'Why do engineers use triangles when building bridges and towers?',
        options: [
          'Triangles look cooler',
          'Triangles cannot deform without breaking their sides, making them rigid',
          'Triangles use fewer sticks than a straight line',
          'Triangles dissolve in water'
        ],
        correctIndex: 1,
        explanation: 'Triangles have fixed geometric stability, making them the foundation of structural engineering.'
      }
    ]
  },
  {
    id: 'learn-coding',
    level: 'Beginner',
    title: 'Basic Block Coding',
    subtitle: 'Snapping logic commands together',
    durationMinutes: 15,
    icon: 'Code2',
    summary: 'Block coding lets you program computer logic like puzzle pieces. Connect event triggers (WHEN START), loops (FOREVER), and decisions (IF / ELSE) without syntax errors.',
    concepts: [
      'Sequencing: computers execute code from top to bottom.',
      'Looping: repeat actions continuously to keep checking sensors.',
      'Conditionals: IF obstacle is detected THEN stop.'
    ],
    handsOnBuild: 'Snap a block that turns on the LED when the push button is pressed.',
    quizQuestions: [
      {
        question: 'What block block structure allows a robot to constantly watch for obstacles?',
        options: ['A FOREVER loop', 'A STOP command', 'A WAIT 10 seconds block', 'A comment block'],
        correctIndex: 0,
        explanation: 'A FOREVER loop continuously checks the sensor readings without stopping.'
      }
    ]
  },

  // --- INTERMEDIATE ---
  {
    id: 'learn-conditionals',
    level: 'Intermediate',
    title: 'Sensors & Conditions',
    subtitle: 'Teaching machines to make smart decisions',
    durationMinutes: 15,
    icon: 'GitBranch',
    summary: 'Explore comparative logic: greater than (>), less than (<), and equal to (==). Use threshold triggers to automate night lights and safety stops.',
    concepts: ['Threshold values', 'Hysteresis margins', 'Compound conditions (AND / OR)'],
    handsOnBuild: 'Build a night light that turns on only if light < 30 AND button is not pressed.',
    quizQuestions: []
  },
  {
    id: 'learn-mechanics',
    level: 'Intermediate',
    title: 'Mechanical Structures & Levers',
    subtitle: 'Gears, pulleys, linkages, and mechanical advantage',
    durationMinutes: 18,
    icon: 'Wrench',
    summary: 'Learn how simple machines multiply force or speed. Connect ice cream stick linkages to servo arms to build scissor lifts, robotic grippers, and barrier gates.',
    concepts: ['Fulcrum and lever arms', 'Gear reduction ratios', 'Linkage kinematics'],
    handsOnBuild: 'Build a 4-bar linkage scissor arm powered by a servo motor.',
    quizQuestions: []
  },

  // --- ADVANCED ---
  {
    id: 'learn-robotics',
    level: 'Advanced',
    title: 'Autonomous Mobile Robotics',
    subtitle: 'Differential drive steering and PID control concepts',
    durationMinutes: 25,
    icon: 'Bot',
    summary: 'Master differential drive mathematics: rotating wheels in opposite directions creates zero-radius spins. Learn proportional wall following and maze solving.',
    concepts: ['Differential steering kinematics', 'Proportional feedback loops', 'Dead reckoning and sensor fusion'],
    handsOnBuild: 'Program your Robot Car to follow a hallway wall at a constant 15 cm distance.',
    quizQuestions: []
  }
];

export const INITIAL_CORE_DEVICE: FunnectCoreDevice = {
  id: 'fcore-8891',
  name: 'FUNNECT Core #01',
  connected: true,
  batteryPercent: 88,
  firmwareVersion: 'v2.4.1',
  ports: {
    S1: FUNNECT_MODULES.find(m => m.id === 'mod-distance') || null,
    S2: null,
    M1: FUNNECT_MODULES.find(m => m.id === 'mod-dc-motor') || null,
    M2: FUNNECT_MODULES.find(m => m.id === 'mod-dc-motor') || null,
    O1: null,
    O2: null
  },
  searchState: 'connected'
};

export const INITIAL_CLASSES: SchoolClass[] = [
  {
    id: 'cls-robotics-101',
    name: 'Class: Robotics 101',
    grade: 'Grade 6',
    totalStudents: 16,
    scheduleDay: 'Monday, 09:00 AM',
    currentProjectTitle: 'Robot Car',
    teams: [
      {
        id: 'team-a',
        name: 'Team A (The Innovators)',
        studentNames: ['Adit', 'Nisa', 'Rian', 'Maya'],
        assignedDeviceId: 'fcore-8891',
        currentProject: 'Robot Car',
        status: 'Building',
        statusColor: 'yellow',
        batteryLevel: 92,
        buildProgress: 80,
        codingProgress: 40,
        simulationTested: true,
        timeSpentMinutes: 28,
        lastActive: '1 min ago',
        codeUploaded: true,
        connectedModules: ['Distance Sensor (S1)', 'DC Motor (M1)', 'DC Motor (M2)']
      },
      {
        id: 'team-b',
        name: 'Team B (Speedy Gears)',
        studentNames: ['Budi', 'Farah', 'Kevin', 'Siti'],
        assignedDeviceId: 'fcore-8892',
        currentProject: 'Robot Car',
        status: 'Coding',
        statusColor: 'blue',
        batteryLevel: 85,
        buildProgress: 100,
        codingProgress: 75,
        simulationTested: true,
        timeSpentMinutes: 32,
        lastActive: 'Just now',
        codeUploaded: true,
        connectedModules: ['Distance Sensor (S1)', 'DC Motor (M1)', 'DC Motor (M2)', 'LED (O1)']
      },
      {
        id: 'team-c',
        name: 'Team C (Eco Builders)',
        studentNames: ['Chandra', 'Dewi', 'Dimas', 'Putri'],
        assignedDeviceId: 'fcore-8893',
        currentProject: 'Smart Irrigation',
        status: 'Testing',
        statusColor: 'green',
        batteryLevel: 78,
        buildProgress: 100,
        codingProgress: 100,
        simulationTested: true,
        timeSpentMinutes: 42,
        lastActive: '3 mins ago',
        codeUploaded: true,
        connectedModules: ['Moisture Sensor (S1)', 'Servo Motor (M1)', 'RGB LED (O1)']
      },
      {
        id: 'team-d',
        name: 'Team D (Spark Plugs)',
        studentNames: ['Doni', 'Eka', 'Gilang', 'Intan'],
        assignedDeviceId: 'fcore-8894',
        currentProject: 'Windmill',
        status: 'Need Help',
        statusColor: 'red',
        batteryLevel: 45,
        buildProgress: 55,
        codingProgress: 20,
        simulationTested: false,
        timeSpentMinutes: 24,
        activeIssue: 'Motor cable loose on port M1. Car chassis sticks need reinforcement.',
        lastActive: 'Just now',
        codeUploaded: false,
        connectedModules: ['Light Sensor (S1)']
      }
    ]
  },
  {
    id: 'cls-steam-grade5',
    name: 'Class: Grade 5 STEAM',
    grade: 'Grade 5',
    totalStudents: 20,
    scheduleDay: 'Wednesday, 10:30 AM',
    currentProjectTitle: 'Smart Street Light',
    teams: []
  }
];

// Ensure teams have compatibility fields populated
INITIAL_CLASSES.forEach(c => {
  c.teams.forEach(t => {
    t.students = t.studentNames;
    t.batteryPercent = t.batteryLevel;
    t.progressPercent = t.buildProgress;
  });
});

// Port Compatibility Check Helper
export function checkPortCompatibility(portId: PortId, module: FunnectModule | null): {
  compatible: boolean;
  statusText: string;
  badge: 'green' | 'red' | 'gray';
} {
  if (!module) {
    return {
      compatible: true,
      statusText: 'Port ready for connection',
      badge: 'gray'
    };
  }

  // S1, S2 are SENSOR / INPUT ports
  if (portId === 'S1' || portId === 'S2') {
    if (module.category === 'INPUT') {
      return {
        compatible: true,
        statusText: 'Compatible',
        badge: 'green'
      };
    }
    return {
      compatible: false,
      statusText: "This module can't connect here. S ports are for Sensors (Input).",
      badge: 'red'
    };
  }

  // M1, M2 are MOVEMENT / MOTOR ports
  if (portId === 'M1' || portId === 'M2') {
    if (module.category === 'MOVEMENT') {
      return {
        compatible: true,
        statusText: 'Compatible',
        badge: 'green'
      };
    }
    return {
      compatible: false,
      statusText: "This module can't connect here. M ports are for Motors (Movement).",
      badge: 'red'
    };
  }

  // O1, O2 are OUTPUT ports (LED, Buzzer)
  if (portId === 'O1' || portId === 'O2') {
    if (module.category === 'OUTPUT') {
      return {
        compatible: true,
        statusText: 'Compatible',
        badge: 'green'
      };
    }
    return {
      compatible: false,
      statusText: "This module can't connect here. O ports are for Outputs (LED / Buzzer).",
      badge: 'red'
    };
  }

  return {
    compatible: false,
    statusText: "This module can't connect here.",
    badge: 'red'
  };
}
