// from https://www.30secondsofcode.org/js/s/capitalize-every-word
export const capitalizeEveryWord = (str: string) => str?.toLowerCase().replace(/\b[a-z]/g, (char) => char.toUpperCase())
