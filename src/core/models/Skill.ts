export interface Skill {
  id: string
  name: string
  description: string
  type: 'active' | 'passive'
  category: 'physical' | 'magical' | 'support'
  mpCost?: number
  hpCost?: number
  cooldown: number // 回合冷却
  currentCooldown: number
  effects: SkillEffect[]
  requiredLevel: number
  requiredWeapon?: 'sword' | 'staff' | 'bow' | 'any'
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'summon'
  target: 'self' | 'enemy' | 'ally' | 'all_enemies' | 'all_allies'
  value: number | string // 固定值或公式（如 "attack * 1.5"）
  duration?: number // 持续回合（buff/debuff）
  element?: 'none' | 'fire' | 'ice' | 'thunder' | 'wind' | 'earth'
  chance?: number // 触发概率（0-1）
}

export interface SkillConfig {
  [skillId: string]: Skill
}

// 初始技能配置
export const SKILL_CONFIG: SkillConfig = {
  'power_slash': {
    id: 'power_slash',
    name: '强力斩击',
    description: '造成150%攻击力的物理伤害',
    type: 'active',
    category: 'physical',
    mpCost: 10,
    cooldown: 2,
    currentCooldown: 0,
    effects: [{
      type: 'damage',
      target: 'enemy',
      value: 'attack * 1.5',
      element: 'none'
    }],
    requiredLevel: 3,
    requiredWeapon: 'sword'
  },
  'fireball': {
    id: 'fireball',
    name: '火球术',
    description: '发射火球造成魔法伤害',
    type: 'active',
    category: 'magical',
    mpCost: 15,
    cooldown: 1,
    currentCooldown: 0,
    effects: [{
      type: 'damage',
      target: 'enemy',
      value: 'intelligence * 2',
      element: 'fire'
    }],
    requiredLevel: 5,
    requiredWeapon: 'staff'
  },
  'heal': {
    id: 'heal',
    name: '治愈术',
    description: '恢复自身生命值',
    type: 'active',
    category: 'support',
    mpCost: 20,
    cooldown: 3,
    currentCooldown: 0,
    effects: [{
      type: 'heal',
      target: 'self',
      value: 'intelligence * 1.5',
      element: 'none'
    }],
    requiredLevel: 4
  },
  'defend': {
    id: 'defend',
    name: '防御',
    description: '本回合受到的伤害减少50%',
    type: 'active',
    category: 'support',
    mpCost: 0,
    cooldown: 0,
    currentCooldown: 0,
    effects: [{
      type: 'buff',
      target: 'self',
      value: 50, // 伤害减免百分比
      duration: 1,
      element: 'none'
    }],
    requiredLevel: 1
  },
  'charge': {
    id: 'charge',
    name: '蓄力',
    description: '下一次攻击伤害提升100%，但本回合无法行动',
    type: 'active',
    category: 'support',
    mpCost: 5,
    cooldown: 2,
    currentCooldown: 0,
    effects: [{
      type: 'buff',
      target: 'self',
      value: 100, // 伤害增加百分比
      duration: 1,
      element: 'none'
    }],
    requiredLevel: 2
  },
  'critical_boost': {
    id: 'critical_boost',
    name: '暴击强化',
    description: '被动：暴击率提升10%',
    type: 'passive',
    category: 'support',
    cooldown: 0,
    currentCooldown: 0,
    effects: [{
      type: 'buff',
      target: 'self',
      value: 10,
      duration: -1, // 永久
      element: 'none'
    }],
    requiredLevel: 7
  }
}

// 获取技能列表（用于UI显示）
export function getAvailableSkills(playerLevel: number, weaponType?: string): Skill[] {
  return Object.values(SKILL_CONFIG).filter(skill => {
    if (skill.requiredLevel > playerLevel) return false
    if (skill.requiredWeapon && skill.requiredWeapon !== 'any' && weaponType !== skill.requiredWeapon) return false
    return true
  })
}

// 克隆技能（用于战斗状态）
export function cloneSkill(skill: Skill): Skill {
  return {
    ...skill,
    effects: skill.effects.map(effect => ({ ...effect })),
    currentCooldown: 0
  }
}