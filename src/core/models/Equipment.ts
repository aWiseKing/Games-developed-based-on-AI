export type EquipmentSlot = 'weapon' | 'armor' | 'accessory'
export type EquipmentQuality = 1 | 2 | 3 | 4 | 5 | 6

export const QUALITY_NAMES: Record<EquipmentQuality, string> = {
  1: '破旧',
  2: '普通',
  3: '精良',
  4: '稀有',
  5: '史诗',
  6: '传说',
}

export const QUALITY_COLORS: Record<EquipmentQuality, string> = {
  1: '#888888',
  2: '#ffffff',
  3: '#2ecc71',
  4: '#3498db',
  5: '#9b59b6',
  6: '#f39c12',
}

export interface Equipment {
  id: string
  name: string
  slot: EquipmentSlot
  quality: EquipmentQuality
  level: number
  attackBonus: number
  defenseBonus: number
  hpBonus: number
  critBonus: number
  dodgeBonus: number
  description: string
}

// 生成随机装备
export function generateEquipment(
  slot: EquipmentSlot,
  floor: number,
  quality?: EquipmentQuality
): Equipment {
  const qualityRoll = Math.random()
  const determinedQuality: EquipmentQuality = quality || (
    qualityRoll > 0.98 ? 6 :
    qualityRoll > 0.90 ? 5 :
    qualityRoll > 0.75 ? 4 :
    qualityRoll > 0.50 ? 3 :
    qualityRoll > 0.20 ? 2 : 1
  )

  const baseValue = Math.floor(floor * 2 * determinedQuality)
  
  const equipmentNames: Record<EquipmentSlot, string[]> = {
    weapon: ['短剑', '长剑', '战斧', '长矛', '匕首', '战锤', '法杖', '巨剑'],
    armor: ['皮甲', '锁甲', '板甲', '布甲', '鳞甲', '重甲', '轻甲', '战甲'],
    accessory: ['戒指', '项链', '护符', '徽章', '腰带', '手套', '护腕', '耳环'],
  }

  const names = equipmentNames[slot]
  const name = names[Math.floor(Math.random() * names.length)]

  const equipment: Equipment = {
    id: `equip_${Date.now()}_${Math.random()}`,
    name: `${QUALITY_NAMES[determinedQuality]}${name}`,
    slot,
    quality: determinedQuality,
    level: floor,
    attackBonus: 0,
    defenseBonus: 0,
    hpBonus: 0,
    critBonus: 0,
    dodgeBonus: 0,
    description: '',
  }

  // 根据部位设置属性
  switch (slot) {
    case 'weapon':
      equipment.attackBonus = baseValue + Math.floor(Math.random() * 5)
      equipment.critBonus = determinedQuality >= 4 ? 0.05 + (determinedQuality - 3) * 0.02 : 0
      break
    case 'armor':
      equipment.defenseBonus = Math.floor(baseValue * 0.8) + Math.floor(Math.random() * 3)
      equipment.hpBonus = determinedQuality >= 3 ? baseValue * 2 : 0
      equipment.dodgeBonus = determinedQuality >= 4 ? 0.03 + (determinedQuality - 3) * 0.02 : 0
      break
    case 'accessory':
      // 饰品属性比较综合
      equipment.attackBonus = Math.floor(baseValue * 0.3)
      equipment.defenseBonus = Math.floor(baseValue * 0.3)
      equipment.hpBonus = Math.floor(baseValue * 0.5)
      break
  }

  return equipment
}

// 计算装备售价
export function getEquipmentPrice(equipment: Equipment): number {
  const basePrice = equipment.level * 10
  const qualityMultiplier = equipment.quality * 0.5
  return Math.floor(basePrice * qualityMultiplier)
}
