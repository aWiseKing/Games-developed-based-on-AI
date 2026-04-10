import type { Equipment } from './Equipment'
import type { Item } from './Item'
import type { Skill } from './Skill'

export interface Player {
  name: string
  level: number
  hp: number
  maxHp: number
  mp: number
  maxMp: number
  attack: number
  defense: number
  intelligence: number // 智力，影响魔法伤害和治疗
  exp: number
  gold: number
  debt: number
  day: number
  actionsLeft: number
  highestFloor: number // 新增：玩家达到过的最高地下城层数
  equipment: {
    weapon: Equipment | null
    armor: Equipment | null
    accessory: Equipment | null
  }
  inventory: Item[]
  repaidHistory: number[]
  skills: {
    learned: Skill[] // 已学习的技能
    equipped: {
      active: Skill[] // 已装备的主动技能（最多4个）
      passive: Skill[] // 已装备的被动技能（最多2个）
    }
  }
}

export function createDefaultPlayer(): Player {
  return {
    name: '勇者',
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    attack: 10,
    defense: 5,
    intelligence: 8,
    exp: 0,
    gold: 200,
    debt: 10000,
    day: 1,
    actionsLeft: 3,
    highestFloor: 1, // 默认解锁第1层
    equipment: {
      weapon: null,
      armor: null,
      accessory: null,
    },
    inventory: [],
    repaidHistory: [0, 0, 0, 0, 0],
    skills: {
      learned: [],
      equipped: {
        active: [],
        passive: []
      }
    }
  }
}

// 升级所需经验
export function getExpForLevel(level: number): number {
  return level * 20 + Math.pow(level - 1, 2) * 5
}

// 计算玩家总属性（基础 + 装备）
export function calculatePlayerStats(player: Player): {
  maxHp: number
  maxMp: number
  attack: number
  defense: number
  intelligence: number
  critRate: number
  dodgeRate: number
} {
  let bonusAttack = 0
  let bonusDefense = 0
  let bonusHp = 0
  let bonusMp = 0
  let bonusIntelligence = 0
  let critRate = 0.05
  let dodgeRate = 0.05

  // 装备加成
  if (player.equipment.weapon) {
    bonusAttack += player.equipment.weapon.attackBonus
    critRate += player.equipment.weapon.critBonus
  }
  if (player.equipment.armor) {
    bonusDefense += player.equipment.armor.defenseBonus
    bonusHp += player.equipment.armor.hpBonus
    dodgeRate += player.equipment.armor.dodgeBonus
  }
  if (player.equipment.accessory) {
    bonusAttack += player.equipment.accessory.attackBonus
    bonusDefense += player.equipment.accessory.defenseBonus
    bonusHp += player.equipment.accessory.hpBonus
  }

  // 被动技能加成（暂时忽略，后续实现）
  // TODO: 应用被动技能效果

  return {
    maxHp: player.maxHp + bonusHp,
    maxMp: player.maxMp + bonusMp,
    attack: player.attack + bonusAttack,
    defense: player.defense + bonusDefense,
    intelligence: player.intelligence + bonusIntelligence,
    critRate,
    dodgeRate,
  }
}

// 玩家升级
export function levelUp(player: Player): Player {
  const newLevel = player.level + 1
  const expNeeded = getExpForLevel(player.level)
  
  return {
    ...player,
    level: newLevel,
    exp: player.exp - expNeeded,
    maxHp: player.maxHp + 10,
    hp: player.maxHp + 10, // 升级回满血
    maxMp: player.maxMp + 5,
    mp: player.maxMp + 5, // 升级回满MP
    attack: player.attack + 1,
    defense: player.defense + 1,
    intelligence: player.intelligence + 1,
  }
}
