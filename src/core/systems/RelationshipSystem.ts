import type { NPCId } from '../models/NPC'

// 声望值/道德值等级
export type MoralLevel = 'evil' | 'selfish' | 'neutral' | 'kind' | 'righteous'

// 道德值配置
export const MORAL_LEVELS: Record<MoralLevel, { min: number; max: number; label: string; description: string }> = {
  evil: { min: -100, max: -30, label: '邪恶', description: '为了利益不择手段' },
  selfish: { min: -30, max: 0, label: '自私', description: '只顾自己的利益' },
  neutral: { min: 0, max: 30, label: '中立', description: '在自保和善良间徘徊' },
  kind: { min: 30, max: 70, label: '善良', description: '愿意帮助他人' },
  righteous: { min: 70, max: 100, label: '正直', description: '坚守正义与信念' },
}

// 获取道德值等级
export function getMoralLevel(value: number): MoralLevel {
  if (value < -30) return 'evil'
  if (value < 0) return 'selfish'
  if (value < 30) return 'neutral'
  if (value < 70) return 'kind'
  return 'righteous'
}

// 好感度系统状态
export interface RelationshipState {
  // 各个NPC的好感度 (-100 到 100)
  relationships: Record<NPCId, number>
  // 道德值/声望值 (-100 到 100)
  moralValue: number
  // 关键选择记录
  keyChoices: string[]
  // 剧情标记
  storyFlags: Record<string, boolean>
  // 莉莉的特殊状态
  lilyStatus: {
    hp: number
    maxHp: number
    mental: number // 精神状态 (0-100)
    isAlive: boolean
    healUsesLeft: number // 今日剩余治疗次数
  }
}

// 创建默认好感度状态
export function createDefaultRelationshipState(): RelationshipState {
  return {
    relationships: {
      lily: 10, // 初始有一些好感度
      gredon: -10, // 债主初始为负
      margaret: 20, // 酒馆老板娘比较友善
      shadow: 0,
      tom: 0,
      irene: 0,
      jack: 0,
    },
    moralValue: 0,
    keyChoices: [],
    storyFlags: {},
    lilyStatus: {
      hp: 50,
      maxHp: 50,
      mental: 80,
      isAlive: true,
      healUsesLeft: 3,
    },
  }
}

// 修改好感度
export function modifyRelationship(
  state: RelationshipState,
  npcId: NPCId,
  delta: number
): RelationshipState {
  const current = state.relationships[npcId] ?? 0
  const newValue = Math.max(-100, Math.min(100, current + delta))
  
  return {
    ...state,
    relationships: {
      ...state.relationships,
      [npcId]: newValue,
    },
  }
}

// 修改道德值
export function modifyMoralValue(
  state: RelationshipState,
  delta: number
): RelationshipState {
  const newValue = Math.max(-100, Math.min(100, state.moralValue + delta))
  return {
    ...state,
    moralValue: newValue,
  }
}

// 记录关键选择
export function recordChoice(
  state: RelationshipState,
  choiceId: string
): RelationshipState {
  if (state.keyChoices.includes(choiceId)) {
    return state
  }
  return {
    ...state,
    keyChoices: [...state.keyChoices, choiceId],
  }
}

// 设置剧情标记
export function setStoryFlag(
  state: RelationshipState,
  flag: string,
  value: boolean = true
): RelationshipState {
  return {
    ...state,
    storyFlags: {
      ...state.storyFlags,
      [flag]: value,
    },
  }
}

// 检查剧情标记
export function hasStoryFlag(state: RelationshipState, flag: string): boolean {
  return state.storyFlags[flag] === true
}

// 更新莉莉状态
export function updateLilyStatus(
  state: RelationshipState,
  updates: Partial<RelationshipState['lilyStatus']>
): RelationshipState {
  return {
    ...state,
    lilyStatus: {
      ...state.lilyStatus,
      ...updates,
    },
  }
}

// 重置莉莉每日治疗次数
export function resetLilyHealUses(state: RelationshipState): RelationshipState {
  return {
    ...state,
    lilyStatus: {
      ...state.lilyStatus,
      healUsesLeft: 3,
    },
  }
}

// 使用莉莉的治疗
export function useLilyHeal(state: RelationshipState): { state: RelationshipState; success: boolean } {
  if (state.lilyStatus.healUsesLeft <= 0) {
    return { state, success: false }
  }
  
  return {
    state: {
      ...state,
      lilyStatus: {
        ...state.lilyStatus,
        healUsesLeft: state.lilyStatus.healUsesLeft - 1,
      },
    },
    success: true,
  }
}

// 契约反噬：当莉莉受伤时主角也会受伤
export function calculateBondDamage(lilyHpPercent: number): number {
  // 莉莉生命值越低，主角受到的契约反噬越大
  if (lilyHpPercent > 0.5) return 0
  if (lilyHpPercent > 0.3) return 0.1 // 10%
  if (lilyHpPercent > 0.1) return 0.25 // 25%
  return 0.5 // 50%
}
