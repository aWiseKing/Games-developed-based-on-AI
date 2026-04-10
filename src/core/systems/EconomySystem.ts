import type { Player } from '../models/Player'
import type { Equipment } from '../models/Equipment'
import type { Item } from '../models/Item'
import { getEquipmentPrice } from '../models/Equipment'
import { createPotion } from '../models/Item'

// 还款阶段定义
export interface RepaymentStage {
  deadlineDay: number
  minimumPayment: number
  paid: number
}

export const REPAYMENT_PLAN: RepaymentStage[] = [
  { deadlineDay: 20, minimumPayment: 1000, paid: 0 },
  { deadlineDay: 40, minimumPayment: 2000, paid: 0 },
  { deadlineDay: 60, minimumPayment: 2500, paid: 0 },
  { deadlineDay: 80, minimumPayment: 3000, paid: 0 },
  { deadlineDay: 100, minimumPayment: 0, paid: 0 }, // 最后阶段还清剩余
]

// 获取当前阶段
export function getCurrentStage(day: number): number {
  for (let i = 0; i < REPAYMENT_PLAN.length; i++) {
    if (day <= REPAYMENT_PLAN[i].deadlineDay) {
      return i
    }
  }
  return REPAYMENT_PLAN.length - 1
}

// 计算应还金额
export function calculatePayment(player: Player): {
  stageIndex: number
  minimumPayment: number
  alreadyPaid: number
  remaining: number
  deadlineDay: number
} {
  const stageIndex = getCurrentStage(player.day)
  const stage = REPAYMENT_PLAN[stageIndex]
  const alreadyPaid = player.repaidHistory[stageIndex] || 0
  const remaining = Math.max(0, stage.minimumPayment - alreadyPaid)
  
  return {
    stageIndex,
    minimumPayment: stage.minimumPayment,
    alreadyPaid,
    remaining,
    deadlineDay: stage.deadlineDay,
  }
}

// 进行还款
export function makePayment(player: Player, amount: number): {
  success: boolean
  player: Player
  paid: number
  interest: number
  message: string
} {
  const { stageIndex, remaining } = calculatePayment(player)
  
  if (amount > player.gold) {
    return {
      success: false,
      player,
      paid: 0,
      interest: 0,
      message: '金币不足！',
    }
  }
  
  if (amount <= 0) {
    return {
      success: false,
      player,
      paid: 0,
      interest: 0,
      message: '还款金额必须大于 0',
    }
  }
  
  const actualPayment = Math.min(amount, remaining + player.debt)
  const newGold = player.gold - actualPayment
  const newDebt = player.debt - actualPayment
  const newRepaidHistory = [...player.repaidHistory]
  newRepaidHistory[stageIndex] = (newRepaidHistory[stageIndex] || 0) + actualPayment
  
  return {
    success: true,
    player: {
      ...player,
      gold: newGold,
      debt: Math.max(0, newDebt),
      repaidHistory: newRepaidHistory,
    },
    paid: actualPayment,
    interest: 0,
    message: `成功还款 ${actualPayment} 金币`,
  }
}

// 阶段结算（检查是否还清最低额度）
export function settleStage(player: Player, stageIndex: number): {
  player: Player
  paid: number
  missed: number
  interest: number
  message: string
} {
  const stage = REPAYMENT_PLAN[stageIndex]
  const paid = player.repaidHistory[stageIndex] || 0
  const missed = Math.max(0, stage.minimumPayment - paid)
  const interest = Math.floor(missed * 0.25) // 25% 利息
  
  if (missed > 0) {
    return {
      player: {
        ...player,
        debt: player.debt + interest,
      },
      paid,
      missed,
      interest,
      message: `第 ${stageIndex + 1} 阶段结算：未还 ${missed} 金币，产生 ${interest} 金币利息`,
    }
  }
  
  return {
    player,
    paid,
    missed: 0,
    interest: 0,
    message: `第 ${stageIndex + 1} 阶段结算：已按时还清`,
  }
}

// 商店物品
export interface ShopItem {
  id: string
  name: string
  price: number
  type: 'equipment' | 'consumable'
  equipment?: Equipment
  item?: Item
}

// 生成商店货物
export function generateShopItems(day: number): ShopItem[] {
  const items: ShopItem[] = []
  
  // 回复药水
  items.push({
    id: 'shop_potion_small',
    name: '小型回复药',
    price: 20,
    type: 'consumable',
  })
  
  items.push({
    id: 'shop_potion_medium',
    name: '中型回复药',
    price: 50,
    type: 'consumable',
  })
  
  // 装备（根据天数解锁更好装备）
  const maxQuality = Math.min(4, 1 + Math.floor(day / 25))
  
  for (let i = 0; i < 3; i++) {
    const slot = ['weapon', 'armor', 'accessory'][i] as 'weapon' | 'armor' | 'accessory'
    const equipment = generateEquipment(slot, Math.min(10, 1 + Math.floor(day / 10)))
    equipment.quality = Math.min(equipment.quality, maxQuality) as 1 | 2 | 3 | 4 | 5 | 6
    
    items.push({
      id: `shop_equip_${i}`,
      name: equipment.name,
      price: getEquipmentPrice(equipment) * 2, // 商店价格是售价的2倍
      type: 'equipment',
      equipment,
    })
  }
  
  return items
}

// 购买物品
export function buyItem(player: Player, shopItem: ShopItem): {
  success: boolean
  player: Player
  message: string
} {
  if (player.gold < shopItem.price) {
    return { success: false, player, message: '金币不足！' }
  }
  
  const newGold = player.gold - shopItem.price
  let newInventory = [...player.inventory]
  
  if (shopItem.type === 'equipment' && shopItem.equipment) {
    // 装备直接添加到背包
    const sellPrice = Math.floor(shopItem.price * 0.5)
    const equipItem: Item = {
      id: shopItem.equipment.id,
      name: shopItem.equipment.name,
      type: 'material',
      description: `${shopItem.equipment.slot === 'weapon' ? '武器' : shopItem.equipment.slot === 'armor' ? '护甲' : '饰品'} - 攻击+${shopItem.equipment.attackBonus || 0} 防御+${shopItem.equipment.defenseBonus || 0}`,
      quantity: 1,
      sellPrice: sellPrice > 0 ? sellPrice : 1, // 确保至少能卖1金币
    }
    newInventory.push(equipItem)
  } else if (shopItem.type === 'consumable') {
    // 消耗品 - 检查是否已有同类物品，增加数量
    const existingIdx = newInventory.findIndex(i => i.name === shopItem.name && i.type === 'consumable')
    
    if (existingIdx >= 0) {
      // 增加现有物品数量
      newInventory[existingIdx] = {
        ...newInventory[existingIdx],
        quantity: newInventory[existingIdx].quantity + 1
      }
    } else {
      // 创建新的消耗品
      let potionType: 'small' | 'medium' | 'large' = 'small'
      if (shopItem.id.includes('medium')) potionType = 'medium'
      else if (shopItem.id.includes('large')) potionType = 'large'
      
      const newPotion = createPotion(potionType)
      newInventory.push(newPotion)
    }
  }
  
  const updatedPlayer: Player = {
    ...player,
    gold: newGold,
    inventory: newInventory,
  }
  
  return {
    success: true,
    player: updatedPlayer,
    message: `购买了 ${shopItem.name}`,
  }
}

// 出售物品
export function sellItem(player: Player, item: Item | Equipment, isEquipment: boolean): {
  success: boolean
  player: Player
  price: number
  message: string
} {
  // 计算售价 - 对于背包中的物品，直接使用 sellPrice
  let price: number
  if (isEquipment) {
    // 如果是已装备的 Equipment 类型，使用 getEquipmentPrice
    price = getEquipmentPrice(item as Equipment)
  } else {
    // 背包中的物品直接使用 sellPrice
    price = (item as Item).sellPrice ?? 0
  }
  
  // 确保价格有效
  if (isNaN(price) || price < 0) {
    price = 0
  }
  
  let newInventory = [...player.inventory]
  let newEquipment = { ...player.equipment }
  
  if (isEquipment) {
    // 出售已装备的装备
    const equip = item as Equipment
    if (player.equipment.weapon?.id === equip.id) newEquipment.weapon = null
    if (player.equipment.armor?.id === equip.id) newEquipment.armor = null
    if (player.equipment.accessory?.id === equip.id) newEquipment.accessory = null
  } else {
    // 出售背包中的物品
    const idx = newInventory.findIndex(i => i.id === item.id)
    if (idx >= 0) {
      newInventory[idx] = { ...newInventory[idx], quantity: newInventory[idx].quantity - 1 }
      if (newInventory[idx].quantity <= 0) {
        newInventory.splice(idx, 1)
      }
    }
  }
  
  // 计算新的金币数，确保不会出现 NaN
  const currentGold = player.gold ?? 0
  const newGold = currentGold + price
  
  return {
    success: true,
    player: {
      ...player,
      gold: newGold,
      inventory: newInventory,
      equipment: newEquipment,
    },
    price,
    message: `出售了 ${item.name}，获得 ${price} 金币`,
  }
}

import { generateEquipment } from '../models/Equipment'
