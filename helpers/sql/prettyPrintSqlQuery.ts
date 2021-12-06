export const prettyPrintSqlQuery = (query: string, values: any[]) => {
  return query.replace(/\$[0-9]+/gm, (dollarN) => {
    const value = values[Number(dollarN.slice(1)) - 1]
    if (typeof value === 'number') return value
    else if (typeof value === 'undefined' || value === null) return 'null'
    else if (typeof value === 'string') return `'${value}'`
    else if (value instanceof Date) return `'${value.toUTCString()}'`
    else if (value instanceof Array) return "'{" + value.join(',') + "}'"
    else if (typeof value === 'object') return `'${JSON.stringify(value)}'`
    else return value?.toString()
  })
}
