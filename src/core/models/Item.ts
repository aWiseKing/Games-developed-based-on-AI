export type ItemType = 'consumable' | 'material' | 'key'

export interface Item {
  id: string
  name: string
  type: ItemType
  description: string
  quantity: number
  sellPrice: number
  // 消耗品效果
  effect?: {
    type: 'heal' | 'buff'
    value: number
  }
}

// 创建药水
export function createPotion(type: 'small' | 'medium' | 'large'): Item {
  const potions = {
    small: { name: '小型回复药', heal: 30, price: 20 },
    medium: { name: '中型回复药', heal: 60, price: 50 },
    large: { name: '大型回复药', heal: 100, price: 100 },
  }
  
  const potion = potions[type]
  
  return {
    id: `potion_${type}_${Date.now()}`,
    name: potion.name,
    type: 'consumable',
    description: `回复 ${potion.heal} 点生命值`,
    quantity: 1,
    sellPrice: Math.floor(potion.price * 0.5),
    effect: {
      type: 'heal',
      value: potion.heal,
    },
  }
}

// 创建材料
export function createMaterial(name: string, sellPrice: number): Item {
  return {
    id: `material_${name}_${Date.now()}`,
    name,
    type: 'material',
    description: '可以出售换取金币的材料',
    quantity: 1,
    sellPrice,
  }
}

// 使用物品
export function useItem(item: Item): { success: boolean; effect?: { type: string; value: number } } {
  if (item.type !== 'consumable' || !item.effect) {
    return { success: false }
  }
  
  return {
    success: true,
    effect: item.effect,
  }
}
