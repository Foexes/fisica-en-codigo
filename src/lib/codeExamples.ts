import type { MotionParameters } from './physics'

export type ProgrammingLanguage = 'gdscript' | 'luau' | 'java' | 'python' | 'typescript'
export type ConceptCodeId = 'position' | 'velocity' | 'acceleration'

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

export function getLanguageDefinition(language: ProgrammingLanguage): LanguageDefinition {
  return programmingLanguages.find((definition) => definition.id === language) ?? programmingLanguages[0]
}

export function getConceptCode(
  conceptId: ConceptCodeId,
  language: ProgrammingLanguage,
): string {
  return conceptCode[conceptId][language]
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
