// Average Calculation Utilities
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0
  const sum = numbers.reduce((acc, num) => acc + num, 0)
  return parseFloat((sum / numbers.length).toFixed(2))
}

export function calculateWeightedAverage(
  values: { value: number; weight: number }[]
): number {
  const totalWeight = values.reduce((acc, item) => acc + item.weight, 0)
  const weightedSum = values.reduce((acc, item) => acc + item.value * item.weight, 0)
  return parseFloat((weightedSum / totalWeight).toFixed(2))
}

export function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0
  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}
