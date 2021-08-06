import { getItemById } from '../interface/filter/getItemById'

export function randomElement<ItemType>(array: ItemType[]): ItemType {
  return array[Math.floor(array.length * Math.random())]
}

export async function pmap<InputType, ReturnType>(
  array: InputType[],
  mapper: (item: InputType) => Promise<ReturnType>
): Promise<ReturnType[]> {
  return await Promise.all(array.map(mapper))
}
