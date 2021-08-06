// generated typescript definitions from database using groovy script
export interface ISicCodeDatabaseItem {
  code?: string
  description?: string
}

export interface ISicCodeItem {
  code?: string
  description?: string
}

export function convertSicCodeDatabaseItemToItem(databaseItem: ISicCodeDatabaseItem): ISicCodeItem {
  const item = {
    code: databaseItem.code,
    description: databaseItem.description
  }
  return item
}
