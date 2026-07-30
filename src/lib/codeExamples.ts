import type { MotionParameters } from './physics'

export type ProgrammingLanguage = 'gdscript' | 'luau' | 'java' | 'python' | 'typescript'
export type ConceptCodeId = 'position' | 'velocity' | 'acceleration'
export type VectorConceptCodeId = 'components' | 'magnitude' | 'direction'
export type ExampleModuleId = 'motion' | 'vectors'

export interface LanguageDefinition {
  id: ProgrammingLanguage
  label: string
  fileName: string
  runtime: string
}

export const programmingLanguages: LanguageDefinition[] = [
  { id: 'gdscript', label: 'GDScript', fileName: 'motion.gd', runtime: 'Godot' },
  { id: 'luau', label: 'Luau', fileName: 'Motion.client.luau', runtime: 'Roblox' },
  { id: 'java', label: 'Java', fileName: 'Motion.java', runtime: 'Java / Minecraft' },
  { id: 'python', label: 'Python', fileName: 'motion.py', runtime: 'Python' },
  { id: 'typescript', label: 'TypeScript', fileName: 'motion.ts', runtime: 'Web' },
]

const exampleFileNames: Record<ExampleModuleId, Record<ProgrammingLanguage, string>> = {
  motion: {
    gdscript: 'motion.gd',
    luau: 'Motion.client.luau',
    java: 'Motion.java',
    python: 'motion.py',
    typescript: 'motion.ts',
  },
  vectors: {
    gdscript: 'vector_lab.gd',
    luau: 'VectorLab.client.luau',
    java: 'VectorLab.java',
    python: 'vector_lab.py',
    typescript: 'vectorLab.ts',
  },
}

const conceptCode: Record<ConceptCodeId, Record<ProgrammingLanguage, string>> = {
  position: {
    gdscript: `const ORIGIN := 0.0
var position := 12.0`,
    luau: `local ORIGIN = 0
local position = 12`,
    java: `final double origin = 0.0;
double position = 12.0;`,
    python: `ORIGIN = 0.0
position = 12.0`,
    typescript: `const origin = 0
let position = 12`,
  },
  velocity: {
    gdscript: `func physics_step(delta: float) -> void:
    position += velocity * delta`,
    luau: `local function physicsStep(deltaTime: number)
    position += velocity * deltaTime
end`,
    java: `void physicsStep(double deltaTime) {
    position += velocity * deltaTime;
}`,
    python: `def physics_step(delta_time: float) -> None:
    global position
    position += velocity * delta_time`,
    typescript: `function physicsStep(deltaTime: number) {
  position += velocity * deltaTime
}`,
  },
  acceleration: {
    gdscript: `func physics_step(delta: float) -> void:
    velocity += acceleration * delta
    position += velocity * delta`,
    luau: `local function physicsStep(deltaTime: number)
    velocity += acceleration * deltaTime
    position += velocity * deltaTime
end`,
    java: `void physicsStep(double deltaTime) {
    velocity += acceleration * deltaTime;
    position += velocity * deltaTime;
}`,
    python: `def physics_step(delta_time: float) -> None:
    global position, velocity
    velocity += acceleration * delta_time
    position += velocity * delta_time`,
    typescript: `function physicsStep(deltaTime: number) {
  velocity += acceleration * deltaTime
  position += velocity * deltaTime
}`,
  },
}

const vectorConceptCode: Record<
  VectorConceptCodeId,
  Record<ProgrammingLanguage, string>
> = {
  components: {
    gdscript: `var velocity := Vector2(3.0, 4.0)

print(velocity.x)
print(velocity.y)`,
    luau: `local velocity = Vector2.new(3, 4)

print(velocity.X)
print(velocity.Y)`,
    java: `double velocityX = 3.0;
double velocityY = 4.0;

System.out.println(velocityX);
System.out.println(velocityY);`,
    python: `velocity = (3.0, 4.0)
velocity_x, velocity_y = velocity

print(velocity_x, velocity_y)`,
    typescript: `const velocity = { x: 3, y: 4 }

console.log(velocity.x)
console.log(velocity.y)`,
  },
  magnitude: {
    gdscript: `var velocity := Vector2(3.0, 4.0)
var speed := velocity.length()

print(speed) # 5.0`,
    luau: `local velocity = Vector2.new(3, 4)
local speed = velocity.Magnitude

print(speed) -- 5`,
    java: `double velocityX = 3.0;
double velocityY = 4.0;
double speed = Math.hypot(velocityX, velocityY);

System.out.println(speed); // 5.0`,
    python: `from math import hypot

velocity = (3.0, 4.0)
speed = hypot(*velocity)

print(speed)  # 5.0`,
    typescript: `const velocity = { x: 3, y: 4 }
const speed = Math.hypot(velocity.x, velocity.y)

console.log(speed) // 5`,
  },
  direction: {
    gdscript: `var direction := Vector2(0.0, 5.0)
var angle := rad_to_deg(direction.angle())

print(angle) # 90.0`,
    luau: `local direction = Vector2.new(0, 5)
local angle = math.deg(math.atan2(direction.Y, direction.X))

print(angle) -- 90`,
    java: `double directionX = 0.0;
double directionY = 5.0;
double angle = Math.toDegrees(
    Math.atan2(directionY, directionX)
);

System.out.println(angle); // 90.0`,
    python: `from math import atan2, degrees

direction = (0.0, 5.0)
angle = degrees(atan2(direction[1], direction[0]))

print(angle)  # 90.0`,
    typescript: `const direction = { x: 0, y: 5 }
const angle = Math.atan2(direction.y, direction.x) * 180 / Math.PI

console.log(angle) // 90`,
  },
}

export function getLanguageDefinition(language: ProgrammingLanguage): LanguageDefinition {
  return programmingLanguages.find((definition) => definition.id === language) ?? programmingLanguages[0]
}

export function getConceptCode(
  conceptId: ConceptCodeId,
  language: ProgrammingLanguage,
): string {
  return conceptCode[conceptId][language]
}

export function getVectorConceptCode(
  conceptId: VectorConceptCodeId,
  language: ProgrammingLanguage,
): string {
  return vectorConceptCode[conceptId][language]
}

export function getExampleFileName(
  moduleId: ExampleModuleId,
  language: ProgrammingLanguage,
): string {
  return exampleFileNames[moduleId][language]
}

export function getMotionLoopCode(
  language: ProgrammingLanguage,
  parameters: MotionParameters,
): string {
  const position = parameters.initialPosition.toFixed(1)
  const velocity = parameters.initialVelocity.toFixed(1)
  const acceleration = parameters.acceleration.toFixed(1)

  const examples: Record<ProgrammingLanguage, string> = {
    gdscript: `# Parámetros actuales
var position := ${position}
var velocity := ${velocity}
var acceleration := ${acceleration}

func _physics_process(delta: float) -> void:
    velocity += acceleration * delta
    position += velocity * delta`,
    luau: `-- Parámetros actuales
local RunService = game:GetService("RunService")
local position = ${position}
local velocity = ${velocity}
local acceleration = ${acceleration}

RunService.Heartbeat:Connect(function(deltaTime)
    velocity += acceleration * deltaTime
    position += velocity * deltaTime
end)`,
    java: `// Parámetros actuales
double position = ${position};
double velocity = ${velocity};
double acceleration = ${acceleration};

void physicsStep(double deltaTime) {
    velocity += acceleration * deltaTime;
    position += velocity * deltaTime;
}`,
    python: `# Parámetros actuales
position = ${position}
velocity = ${velocity}
acceleration = ${acceleration}

def physics_step(delta_time: float) -> None:
    global position, velocity
    velocity += acceleration * delta_time
    position += velocity * delta_time`,
    typescript: `// Parámetros actuales
let position = ${position}
let velocity = ${velocity}
const acceleration = ${acceleration}

function physicsStep(deltaTime: number) {
  velocity += acceleration * deltaTime
  position += velocity * deltaTime
}`,
  }

  return examples[language]
}

export function getVectorLabCode(
  language: ProgrammingLanguage,
  vectorX: number,
  vectorY: number,
): string {
  const x = vectorX.toFixed(1)
  const y = vectorY.toFixed(1)

  const examples: Record<ProgrammingLanguage, string> = {
    gdscript: `var velocity := Vector2(${x}, ${y})
var speed := velocity.length()
var direction := velocity.normalized()

print("speed: ", speed)
print("direction: ", direction)`,
    luau: `local velocity = Vector2.new(${x}, ${y})
local speed = velocity.Magnitude
local direction = if speed > 0 then velocity.Unit else Vector2.zero

print("speed:", speed)
print("direction:", direction)`,
    java: `double velocityX = ${x};
double velocityY = ${y};
double speed = Math.hypot(velocityX, velocityY);

double directionX = speed > 0 ? velocityX / speed : 0;
double directionY = speed > 0 ? velocityY / speed : 0;

System.out.printf("direction: (%.2f, %.2f)%n", directionX, directionY);`,
    python: `from math import hypot

velocity = (${x}, ${y})
speed = hypot(*velocity)
direction = (
    velocity[0] / speed if speed else 0.0,
    velocity[1] / speed if speed else 0.0,
)

print("speed:", speed)
print("direction:", direction)`,
    typescript: `const velocity = { x: ${x}, y: ${y} }
const speed = Math.hypot(velocity.x, velocity.y)
const direction = speed > 0
  ? { x: velocity.x / speed, y: velocity.y / speed }
  : { x: 0, y: 0 }

console.log({ speed, direction })`,
  }

  return examples[language]
}
