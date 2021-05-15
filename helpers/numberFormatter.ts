export const formatApproximation = (number: number) => {
  if (number < 10) return number.toString()
  else if (number < 100) return number.toString()
  else if (number < 1000) return number.toString().slice(0, 2)
  else if (number < 1_000_000) return Math.round(number / 1000) + ' thousand'
  else if (number < 100_000_000) return Math.round(number / 1_000_000) + ' million'
}
