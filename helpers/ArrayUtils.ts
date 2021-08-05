export function randomElement<ItemType>(array: ItemType[]): ItemType {
  return array[Math.floor(array.length * Math.random())]
}
