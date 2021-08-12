export const formatApproximation = (number: number) => {
  if (number < 10) return number.toString()
  else if (number < 100) return Math.round(number / 10) + '0'
  else if (number < 1000) return Math.round(number / 100) + ' hundred'
  else if (number < 1_000_000) return Math.round(number / 1000) + ' thousand'
  else if (number < 100_000_000) return Math.round(number / 1_000_000) + ' million'
}
