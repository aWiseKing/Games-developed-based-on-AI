import type { Player } from '../models/Player'
import type { Monster } from '../models/Monster'
import { generateMonster, generateBoss } from '../models/Monster'
import type { DungeonThemeId } from '../models/DungeonTheme'

export type TrapType = 
  | 'damage'      // 伤害陷阱（当前实现）
  | 'poison'      // 毒气陷阱（持续伤害）
  | 'curse'       // 诅咒陷阱（属性下降）
  | 'teleport'    // 传送陷阱（随机传送）
  | 'slow'        // 减速陷阱（行动点减少）
  | 'instant_death' // 即死陷阱（低概率）
  | 'gold_theft'  // 偷窃陷阱（损失金币）
  | 'mp_drain'    // MP吸取陷阱

export interface TrapEvent extends DungeonEvent {
  type: 'trap'
  trapType: TrapType
  difficulty: number // 难度等级，影响触发概率和效果
  disarmed: boolean // 是否被解除
}

export type DungeonEventType = 
  | 'battle' 
  | 'treasure' 
  | 'trap' 
  | 'heal' 
  | 'empty'
  | 'puzzle'      // 谜题
  | 'merchant'    // 商人
  | 'quest_npc'   // 任务NPC
  | 'hidden_room' // 隐藏房间
  | 'portal'      // 传送门
  | 'shrine'      // 神坛（临时增益）
  | 'camp'        // 营地（完全回复）
  | 'gambling'    // 赌博事件
  | 'skill_book'  // 技能书（学习新技能）
  | 'equipment'   // 装备事件（获得装备）

export interface DungeonEvent {
  type: DungeonEventType
  description: string
  completed: boolean
  data?: any // 事件特定数据
  choices?: EventChoice[] // 选择分支
  requirements?: EventRequirement[] // 触发条件
}

export interface EventChoice {
  id: string
  text: string
  outcome: EventOutcome
  requirements?: EventRequirement[]
}

export interface EventOutcome {
  successChance?: number // 成功概率（0-1）
  rewards?: EventReward[]
  penalties?: EventPenalty[]
  nextEvent?: string // 跳转到其他事件
  message?: string // 结果消息
}

export interface EventReward {
  type: 'gold' | 'exp' | 'item' | 'skill' | 'stat'
  value: number
  itemId?: string
  skillId?: string
  stat?: 'attack' | 'defense' | 'intelligence' | 'hp' | 'mp'
}

export interface EventPenalty {
  type: 'damage' | 'gold_loss' | 'stat_reduction' | 'status_effect'
  value: number
  stat?: 'attack' | 'defense' | 'intelligence' | 'hp' | 'mp'
  statusEffect?: StatusEffect
}

export interface StatusEffect {
  type: 'poison' | 'curse' | 'slow' | 'burn' | 'freeze'
  duration: number
  value: number
}

export interface EventRequirement {
  type: 'level' | 'item' | 'skill' | 'gold' | 'stat'
  value: number
  itemId?: string
  skillId?: string
  stat?: 'attack' | 'defense' | 'intelligence' | 'hp' | 'mp'
}

export interface DungeonRun {
  floor: number
  theme: DungeonThemeId // 新增：当前主题
  events: DungeonEvent[]
  currentEventIndex: number
  isFinished: boolean
  rewards: {
    totalExp: number
    totalGold: number
    items: string[]
  }
  themeEffectsApplied?: boolean // 标记主题效果是否已应用
}

// 地下城层数信息
export const DUNGEON_FLOORS = [
  { floor: 1, name: '入口', enemyCount: 2 },
  { floor: 2, name: '浅层', enemyCount: 2 },
  { floor: 3, name: '上层', enemyCount: 3 },
  { floor: 4, name: '中上层', enemyCount: 3 },
  { floor: 5, name: '中层', enemyCount: 3 },
  { floor: 6, name: '中下层', enemyCount: 3 },
  { floor: 7, name: '下层', enemyCount: 4 },
  { floor: 8, name: '深处', enemyCount: 4 },
  { floor: 9, name: '深渊', enemyCount: 4 },
  { floor: 10, name: '最深处', enemyCount: 1 }, // 只有BOSS
]

// 开始地下城探险
export function startDungeonRun(floor: number, theme: DungeonThemeId = 'forest'): DungeonRun {
  const floorInfo = DUNGEON_FLOORS[floor - 1]
  const events: DungeonEvent[] = []
  
  if (floor === 10) {
    // 第10层只有BOSS战
    events.push({
      type: 'battle',
      description: '遭遇了强大的龙王！',
      completed: false,
    })
  } else {
    // 生成事件序列
    for (let i = 0; i < floorInfo.enemyCount; i++) {
      events.push({
        type: 'battle',
        description: `第 ${i + 1} 场战斗`,
        completed: false,
      })
      
      // 战斗后可能有额外事件
      if (i < floorInfo.enemyCount - 1) {
        const roll = Math.random()
        if (roll < 0.2) {
          events.push({
            type: 'treasure',
            description: '发现了宝箱！',
            completed: false,
          })
        } else if (roll < 0.4) {
          // 生成随机陷阱
          const trapEvent = generateTrapEvent(floor)
          events.push(trapEvent)
        } else if (roll < 0.5) {
          events.push({
            type: 'heal',
            description: '发现了回复之泉',
            completed: false,
          })
        } else if (roll < 0.6) {
          events.push(generateRandomEvent(floor, 'puzzle'))
        } else if (roll < 0.7) {
          events.push(generateRandomEvent(floor, 'merchant'))
        } else if (roll < 0.8) {
          events.push(generateRandomEvent(floor, 'hidden_room'))
        } else if (roll < 0.9) {
          events.push(generateRandomEvent(floor, 'shrine'))
        } else if (roll < 1.0) {
          events.push(generateRandomEvent(floor, 'camp'))
        } else {
          // 确保总有事件发生
          events.push(generateRandomEvent(floor, 'empty'))
        }
      }
    }
    
    // 最后一场是BOSS战
    events.push({
      type: 'battle',
      description: 'BOSS 战！',
      completed: false,
    })
  }
  
  return {
    floor,
    theme,
    events,
    currentEventIndex: 0,
    isFinished: false,
    rewards: {
      totalExp: 0,
      totalGold: 0,
      items: [],
    },
    themeEffectsApplied: false
  }
}

// 生成随机陷阱事件
function generateTrapEvent(floor: number): DungeonEvent {
  const trapTypes: TrapType[] = ['damage', 'poison', 'curse', 'teleport', 'slow', 'gold_theft', 'mp_drain']
  const randomTrapType = trapTypes[Math.floor(Math.random() * trapTypes.length)]
  
  const descriptions: Record<TrapType, string> = {
    damage: '触发了尖刺陷阱！',
    poison: '触发了毒气陷阱！',
    curse: '触发了诅咒陷阱！',
    teleport: '触发了传送陷阱！',
    slow: '触发了减速陷阱！',
    instant_death: '触发了即死陷阱！',
    gold_theft: '触发了偷窃陷阱！',
    mp_drain: '触发了MP吸取陷阱！'
  }
  
  return {
    type: 'trap',
    description: descriptions[randomTrapType],
    completed: false,
    data: {
      trapType: randomTrapType,
      difficulty: Math.min(10, floor),
      disarmed: false
    }
  }
}

// 生成随机事件
function generateRandomEvent(floor: number, type: DungeonEventType): DungeonEvent {
  const eventConfigs: Record<DungeonEventType, () => DungeonEvent> = {
    puzzle: () => ({
      type: 'puzzle',
      description: '遇到了一个古老的谜题。',
      completed: false,
      choices: [
        {
          id: 'solve',
          text: '尝试解谜',
          outcome: {
            successChance: 0.7,
            rewards: [{ type: 'gold', value: Math.floor(50 * floor * (0.8 + Math.random() * 0.4)) }]
          }
        },
        {
          id: 'ignore',
          text: '无视谜题',
          outcome: { message: '你决定不理会这个谜题。' }
        }
      ]
    }),
    merchant: () => ({
      type: 'merchant',
      description: '遇到了一个旅行商人。',
      completed: false,
      choices: [
        {
          id: 'trade',
          text: '查看商品',
          outcome: { message: '商人向你展示了他的商品。' }
        },
        {
          id: 'rob',
          text: '抢劫商人',
          outcome: {
            successChance: 0.5,
            rewards: [{ type: 'gold', value: Math.floor(100 * floor * (0.8 + Math.random() * 0.4)) }],
            penalties: [{ type: 'damage', value: Math.floor(20 * floor) }]
          }
        }
      ]
    }),
    hidden_room: () => ({
      type: 'hidden_room',
      description: '发现了一个隐藏的房间！',
      completed: false,
      choices: [
        {
          id: 'enter',
          text: '进入房间',
          outcome: {
            rewards: [
              { type: 'gold', value: Math.floor(80 * floor * (0.8 + Math.random() * 0.4)) },
              { type: 'item', value: 1, itemId: 'potion_small' }
            ]
          }
        }
      ]
    }),
    shrine: () => ({
      type: 'shrine',
      description: '发现了一个古老的神坛。',
      completed: false,
      choices: [
        {
          id: 'pray',
          text: '祈祷',
          outcome: {
            rewards: [{ type: 'stat', value: 1, stat: 'attack' }]
          }
        }
      ]
    }),
    camp: () => ({
      type: 'camp',
      description: '发现了一个安全的营地。',
      completed: false,
      choices: [
        {
          id: 'rest',
          text: '休息',
          outcome: {
            rewards: [
              { type: 'stat', value: 100, stat: 'hp' },
              { type: 'stat', value: 50, stat: 'mp' }
            ]
          }
        }
      ]
    }),
    // 其他事件类型的默认实现
    battle: () => ({ type: 'battle', description: '战斗', completed: false }),
    treasure: () => ({ type: 'treasure', description: '宝箱', completed: false }),
    trap: () => generateTrapEvent(floor),
    heal: () => ({ type: 'heal', description: '回复之泉', completed: false }),
    empty: () => ({ type: 'empty', description: '空房间', completed: false }),
    portal: () => ({ type: 'portal', description: '传送门', completed: false }),
    quest_npc: () => ({ type: 'quest_npc', description: '任务NPC', completed: false }),
    gambling: () => ({ type: 'gambling', description: '赌博', completed: false }),
    skill_book: () => ({ type: 'skill_book', description: '技能书', completed: false }),
    equipment: () => ({ type: 'equipment', description: '装备', completed: false })
  }
  
  return eventConfigs[type]()
}

// 获取当前事件
export function getCurrentEvent(run: DungeonRun): DungeonEvent | null {
  if (run.currentEventIndex >= run.events.length) {
    return null
  }
  return run.events[run.currentEventIndex]
}

// 获取当前战斗的怪物
export function getCurrentMonster(run: DungeonRun): Monster {
  const event = getCurrentEvent(run)
  if (!event || event.type !== 'battle') {
    throw new Error('当前不是战斗事件')
  }
  
  const isLastEvent = run.currentEventIndex === run.events.length - 1
  
  if (isLastEvent || run.floor === 10) {
    return generateBoss(run.floor)
  }
  
  return generateMonster(run.floor)
}

// 完成当前事件
export function completeCurrentEvent(run: DungeonRun, result: {
  exp?: number
  gold?: number
  items?: string[]
  hpChange?: number
}): DungeonRun {
  const newRun = { ...run }
  const event = newRun.events[newRun.currentEventIndex]
  
  if (event) {
    event.completed = true
  }
  
  // 累加奖励
  if (result.exp) newRun.rewards.totalExp += result.exp
  if (result.gold) newRun.rewards.totalGold += result.gold
  if (result.items) newRun.rewards.items.push(...result.items)
  
  // 进入下一个事件
  newRun.currentEventIndex++
  
  // 检查是否结束
  if (newRun.currentEventIndex >= newRun.events.length) {
    newRun.isFinished = true
  }
  
  return newRun
}

// 处理非战斗事件
export function processEvent(run: DungeonRun, player: Player): {
  run: DungeonRun
  player: Player
  message: string
} {
  const event = getCurrentEvent(run)
  if (!event || event.type === 'battle') {
    return { run, player, message: '' }
  }
  
  let newPlayer = { ...player }
  let message = ''
  
  switch (event.type) {
    case 'treasure':
      const goldFound = Math.floor(20 * run.floor * (0.8 + Math.random() * 0.4))
      newPlayer.gold += goldFound
      message = `打开宝箱，获得 ${goldFound} 金币！`
      break
      
    case 'trap':
      // 处理新式陷阱
      if (event.data && event.data.trapType) {
        const trapResult = processTrap(event as TrapEvent, newPlayer, run.floor)
        newPlayer = trapResult.player
        message = trapResult.message
      } else {
        // 兼容旧式陷阱
        const trapDamage = Math.floor(10 * run.floor)
        newPlayer.hp = Math.max(1, newPlayer.hp - trapDamage)
        message = `触发陷阱，受到 ${trapDamage} 点伤害！`
      }
      break
      
    case 'heal':
      const healAmount = Math.floor(newPlayer.maxHp * 0.3)
      newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + healAmount)
      message = `回复之泉恢复了 ${healAmount} 点生命值`
      break
      
    case 'empty':
      message = '什么都没有发生...'
      break
      
    case 'puzzle':
    case 'merchant':
    case 'hidden_room':
    case 'shrine':
    case 'camp':
      // 这些事件有选择分支，需要在UI中处理
      // 这里暂时自动选择第一个选项
      if (event.choices && event.choices.length > 0) {
        const choice = event.choices[0]
        const outcome = choice.outcome
        
        if (outcome.successChance !== undefined) {
          if (Math.random() < outcome.successChance) {
            // 成功
            if (outcome.rewards) {
              newPlayer = applyRewards(newPlayer, outcome.rewards, run.floor)
              message = `成功！获得了奖励。`
            }
          } else {
            // 失败
            if (outcome.penalties) {
              newPlayer = applyPenalties(newPlayer, outcome.penalties, run.floor)
              message = `失败！受到了惩罚。`
            }
          }
        } else {
          // 无概率，直接应用结果
          if (outcome.rewards) {
            newPlayer = applyRewards(newPlayer, outcome.rewards, run.floor)
          }
          message = outcome.message || `处理了${event.type}事件。`
        }
      }
      break
      
    default:
      message = `遇到了${event.type}事件，但还没有处理逻辑。`
  }
  
  const newRun = completeCurrentEvent(run, {})
  
  return { run: newRun, player: newPlayer, message }
}

// 处理陷阱事件
function processTrap(trap: TrapEvent, player: Player, _floor: number): {
  player: Player
  message: string
} {
  let newPlayer = { ...player }
  let message = ''
  const difficultyMultiplier = 1 + (trap.data.difficulty - 1) * 0.2
  
  switch (trap.data.trapType) {
    case 'damage':
      const damage = Math.floor(10 * trap.data.difficulty * difficultyMultiplier)
      newPlayer.hp = Math.max(1, newPlayer.hp - damage)
      message = `触发伤害陷阱，受到 ${damage} 点伤害！`
      break
      
    case 'poison':
      // 添加中毒状态效果，持续3回合
      // 这里简化处理，直接造成伤害
      const poisonDamage = Math.floor(5 * difficultyMultiplier)
      newPlayer.hp = Math.max(1, newPlayer.hp - poisonDamage)
      message = `触发毒气陷阱，中毒了！受到 ${poisonDamage} 点持续伤害。`
      break
      
    case 'curse':
      // 随机降低一项属性
      const stats = ['attack', 'defense', 'intelligence'] as const
      const randomStat = stats[Math.floor(Math.random() * stats.length)]
      const reduction = Math.floor(2 * difficultyMultiplier)
      newPlayer[randomStat] = Math.max(0, newPlayer[randomStat] - reduction)
      message = `触发诅咒陷阱，${randomStat} 降低了 ${reduction}！`
      break
      
    case 'teleport':
      // 传送陷阱：随机传送，这里简化为跳过下一个事件
      message = `触发传送陷阱，被传送到了其他地方！`
      // 实际实现需要修改run.currentEventIndex
      break
      
    case 'slow':
      // 减速陷阱：减少行动点
      const actionReduction = Math.floor(1 * difficultyMultiplier)
      newPlayer.actionsLeft = Math.max(0, newPlayer.actionsLeft - actionReduction)
      message = `触发减速陷阱，行动点减少了 ${actionReduction}！`
      break
      
    case 'gold_theft':
      // 偷窃陷阱：损失金币
      const goldLoss = Math.floor(20 * trap.data.difficulty * difficultyMultiplier)
      newPlayer.gold = Math.max(0, newPlayer.gold - goldLoss)
      message = `触发偷窃陷阱，损失了 ${goldLoss} 金币！`
      break
      
    case 'mp_drain':
      // MP吸取陷阱
      const mpLoss = Math.floor(10 * trap.data.difficulty * difficultyMultiplier)
      newPlayer.mp = Math.max(0, newPlayer.mp - mpLoss)
      message = `触发MP吸取陷阱，损失了 ${mpLoss} MP！`
      break
      
    case 'instant_death':
      // 即死陷阱：低概率即死
      const instantDeathChance = 0.05 * difficultyMultiplier
      if (Math.random() < instantDeathChance) {
        newPlayer.hp = 1
        message = `触发即死陷阱，勉强存活！`
      } else {
        message = `触发即死陷阱，但你幸存了下来。`
      }
      break
      
    default:
      message = `触发了未知陷阱。`
  }
  
  return { player: newPlayer, message }
}

// 应用奖励
function applyRewards(player: Player, rewards: EventReward[], _floor: number): Player {
  let newPlayer = { ...player }
  
  for (const reward of rewards) {
    switch (reward.type) {
      case 'gold':
        newPlayer.gold += reward.value
        break
      case 'exp':
        newPlayer.exp += reward.value
        break
      case 'item':
        // 这里简化处理，实际需要添加物品到背包
        break
      case 'skill':
        // 这里简化处理，实际需要学习技能
        break
      case 'stat':
        if (reward.stat) {
          if (reward.stat === 'hp') {
            newPlayer.hp = Math.min(newPlayer.maxHp, newPlayer.hp + reward.value)
          } else if (reward.stat === 'mp') {
            newPlayer.mp = Math.min(newPlayer.maxMp, newPlayer.mp + reward.value)
          } else {
            newPlayer[reward.stat] += reward.value
          }
        }
        break
    }
  }
  
  return newPlayer
}

// 应用惩罚
function applyPenalties(player: Player, penalties: EventPenalty[], _floor: number): Player {
  let newPlayer = { ...player }
  
  for (const penalty of penalties) {
    switch (penalty.type) {
      case 'damage':
        newPlayer.hp = Math.max(1, newPlayer.hp - penalty.value)
        break
      case 'gold_loss':
        newPlayer.gold = Math.max(0, newPlayer.gold - penalty.value)
        break
      case 'stat_reduction':
        if (penalty.stat) {
          newPlayer[penalty.stat] = Math.max(0, newPlayer[penalty.stat] - penalty.value)
        }
        break
      case 'status_effect':
        // 这里简化处理，实际需要添加状态效果
        break
    }
  }
  
  return newPlayer
}

// 放弃探险（撤退）
export function abandonDungeon(run: DungeonRun): DungeonRun {
  return {
    ...run,
    isFinished: true,
  }
}
