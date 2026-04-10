import type { NPCId } from '../models/NPC'
import type { RelationshipState } from './RelationshipSystem'

// 剧情节点类型
export type StoryNodeType = 'dialogue' | 'choice' | 'event' | 'battle' | 'reward' | 'ending'

// 剧情效果类型
export type StoryEffectType = 
  | 'modify_relationship' 
  | 'modify_moral' 
  | 'modify_gold'
  | 'modify_debt'
  | 'add_item'
  | 'set_flag'
  | 'start_battle'
  | 'unlock_floor'
  | 'heal_player'
  | 'damage_player'
  | 'change_day'

// 剧情效果
export interface StoryEffect {
  type: StoryEffectType
  target?: NPCId | string
  value: number
  description?: string
}

// 剧情选择项
export interface StoryChoice {
  id: string
  text: string
  condition?: (state: StoryState) => boolean
  effects: StoryEffect[]
  nextNode?: string
  moralValue: number // 道德值影响
}

// 对话内容
export interface Dialogue {
  speaker: NPCId | 'player' | 'narrator'
  text: string
  emotion?: string // 情绪：normal, happy, sad, angry, surprised, worried
}

// 剧情节点
export interface StoryNode {
  id: string
  day: number // 触发天数
  chapter: 'prologue' | 'chapter1' | 'chapter2' | 'chapter3' | 'finale'
  type: StoryNodeType
  condition?: (state: StoryState) => boolean
  priority: number // 优先级，数字越大越优先
  dialogues: Dialogue[]
  choices?: StoryChoice[]
  effects?: StoryEffect[]
  nextNode?: string
  isOneTime: boolean // 是否只触发一次
}

// 故事状态
export interface StoryState {
  currentDay: number
  currentChapter: StoryNode['chapter']
  completedNodes: string[] // 已完成的剧情节点
  activeNode: string | null // 当前激活的剧情节点
  pendingNodes: string[] // 等待触发的剧情节点队列
  relationshipState: RelationshipState
}

// 创建默认故事状态
export function createDefaultStoryState(): StoryState {
  return {
    currentDay: 1,
    currentChapter: 'prologue',
    completedNodes: [],
    activeNode: null,
    pendingNodes: [],
    relationshipState: createDefaultRelationshipState(),
  }
}

// 导入需要使用的函数
import { createDefaultRelationshipState } from './RelationshipSystem'

// 检查剧情节点是否可以触发
export function canTriggerNode(node: StoryNode, state: StoryState): boolean {
  // 检查天数
  if (node.day !== state.currentDay) {
    return false
  }
  
  // 检查是否已完成（一次性剧情）
  if (node.isOneTime && state.completedNodes.includes(node.id)) {
    return false
  }
  
  // 检查自定义条件
  if (node.condition && !node.condition(state)) {
    return false
  }
  
  return true
}

// 获取所有可触发的剧情节点
export function getTriggerableNodes(
  nodes: StoryNode[],
  state: StoryState
): StoryNode[] {
  return nodes
    .filter(node => canTriggerNode(node, state))
    .sort((a, b) => b.priority - a.priority)
}

// 触发剧情节点
export function triggerNode(
  nodeId: string,
  nodes: Record<string, StoryNode>,
  state: StoryState
): { state: StoryState; node: StoryNode | null } {
  const node = nodes[nodeId]
  if (!node) {
    return { state, node: null }
  }
  
  return {
    state: {
      ...state,
      activeNode: nodeId,
    },
    node,
  }
}

// 完成剧情节点
export function completeNode(
  state: StoryState,
  nodeId: string,
  _effects: StoryEffect[] = []
): StoryState {
  return {
    ...state,
    completedNodes: [...state.completedNodes, nodeId],
    activeNode: null,
  }
}

// 推进到下一天
export function advanceDay(state: StoryState): StoryState {
  return {
    ...state,
    currentDay: state.currentDay + 1,
  }
}

// 应用剧情效果
export function applyEffect(
  state: StoryState,
  effect: StoryEffect
): StoryState {
  switch (effect.type) {
    case 'set_flag':
      return {
        ...state,
        relationshipState: {
          ...state.relationshipState,
          storyFlags: {
            ...state.relationshipState.storyFlags,
            [effect.target!]: true,
          },
        },
      }
    default:
      return state
  }
}
