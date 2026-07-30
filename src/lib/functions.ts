export interface LinearFunctionParameters {
  slope: number
  intercept: number
}

export interface LinearFunctionState extends LinearFunctionParameters {
  input: number
  output: number
}

export function evaluateLinearFunction(
  parameters: LinearFunctionParameters,
  input: number,
): number {
  return parameters.slope * input + parameters.intercept
}

export function calculateLinearFunctionState(
  parameters: LinearFunctionParameters,
  input: number,
): LinearFunctionState {
  return {
    ...parameters,
    input,
    output: evaluateLinearFunction(parameters, input),
  }
}

export function sampleLinearFunction(
  parameters: LinearFunctionParameters,
  inputs: number[],
): Array<{ input: number; output: number }> {
  return inputs.map((input) => ({
    input,
    output: evaluateLinearFunction(parameters, input),
  }))
}
