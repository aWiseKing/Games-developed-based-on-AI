import type { Player } from '../models/Player'
import type { Monster } from '../models/Monster'
import type { Skill } from '../models/Skill'
import { calculatePlayerStats, getExpForLevel, levelUp } from '../models/Player'
import { SKILL_CONFIG } from '../models/Skill'
// Equipment and Item imports reserved for future drop implementation

export interface BattleState {
  player: Player
  monster: Monster
  turn: number
  isPlayerTurn: boolean
  battleLog: string[]
  isFinished: boolean
  result: 'victory' | 'defeat' | 'escape' | null
  rewards: {
    exp: number
    gold: number
    items: string[]
  } | null
}

export interface BattleAction {
  type: 'attack' | 'use_item' | 'escape' | 'use_skill' | 'defend' | 'charge'
  itemId?: string
  skillId?: string
}

export interface BattleResult {
  state: BattleState
  message: string
}

// 初始化战斗
export function initBattle(player: Player, monster: Monster): BattleState {
  return {
    player: { ...player },
    monster: { ...monster },
    turn: 1,
    isPlayerTurn: true,
    battleLog: [`遭遇了 ${monster.name}（Lv.${monster.level}）！`],
    isFinished: false,
    result: null,
    rewards: null,
  }
}

// 计算伤害
export function calculateDamage(
  attacker: { attack: number },
  defender: { defense: number },
  isCrit: boolean
): number {
  const baseDamage = Math.max(1, attacker.attack - Math.floor(defender.defense / 2))
  return isCrit ? Math.floor(baseDamage * 1.5) : baseDamage
}

// 玩家行动
export function playerAction(state: BattleState, action: BattleAction): BattleResult {
  if (!state.isPlayerTurn || state.isFinished) {
    return { state, message: '现在不是玩家的回合' }
  }

  const newState = { ...state }
  const stats = calculatePlayerStats(newState.player)
  let message = ''

  switch (action.type) {
    case 'attack': {
      // 闪避判定
      if (Math.random() < 0.05) {
        newState.battleLog.push(`${newState.monster.name} 闪避了攻击！`)
      } else {
        const isCrit = Math.random() < stats.critRate
        const damage = calculateDamage(
          { attack: stats.attack },
          { defense: newState.monster.defense },
          isCrit
        )
        
        newState.monster.hp -= damage
        
        if (isCrit) {
          message = `暴击！造成 ${damage} 点伤害！`
        } else {
          message = `造成 ${damage} 点伤害`
        }
        newState.battleLog.push(message)
      }
      break
    }
    
    case 'use_item':
      // TODO: 使用物品逻辑
      message = '使用了物品'
      newState.battleLog.push(message)
      break
    
    case 'escape':
      // 逃跑成功率 70%
      if (Math.random() < 0.7) {
        newState.isFinished = true
        newState.result = 'escape'
        message = '成功逃脱了！'
      } else {
        message = '逃跑失败！'
      }
      newState.battleLog.push(message)
      break
      
    case 'use_skill': {
      if (!action.skillId) {
        message = '未选择技能'
        newState.battleLog.push(message)
        break
      }
      
      // 查找技能
      const skill = SKILL_CONFIG[action.skillId]
      if (!skill) {
        message = '技能不存在'
        newState.battleLog.push(message)
        break
      }
      
      // 检查MP消耗
      const mpCost = skill.mpCost || 0
      if (mpCost > 0 && newState.player.mp < mpCost) {
        message = 'MP不足！'
        newState.battleLog.push(message)
        break
      }
      
      // 检查冷却（暂时忽略）
      // TODO: 技能冷却检查
      
      // 消耗MP
      if (mpCost > 0) {
        newState.player.mp -= mpCost
      }
      
      // 应用技能效果
      const effectResult = applySkillEffect(skill, newState.player, newState.monster, stats)
      newState.player = effectResult.player
      newState.monster = effectResult.monster
      message = effectResult.message
      newState.battleLog.push(message)
      
      // 技能冷却（暂时忽略）
      // TODO: 技能冷却管理
      break
    }
    
    case 'defend': {
      // 防御：本回合受到的伤害减少50%
      // 这是一个特殊的技能效果，我们将其作为buff处理
      // 暂时简单实现：添加一个临时防御buff
      message = '摆出防御姿态，本回合受到的伤害将减少50%'
      newState.battleLog.push(message)
      // TODO: 添加防御buff到玩家状态
      break
    }
    
    case 'charge': {
      // 蓄力：下一次攻击伤害提升100%，但本回合无法行动
      message = '开始蓄力，下一次攻击伤害将提升100%'
      newState.battleLog.push(message)
      // TODO: 添加蓄力buff到玩家状态
      break
    }
  }

  // 检查怪物是否死亡
  if (newState.monster.hp <= 0) {
    newState.monster.hp = 0
    newState.isFinished = true
    newState.result = 'victory'
    newState.rewards = generateRewards(newState.monster)
    newState.battleLog.push(`战胜了 ${newState.monster.name}！`)
    newState.battleLog.push(`获得 ${newState.rewards.exp} 经验值，${newState.rewards.gold} 金币`)
    
    // 应用奖励
    newState.player.exp += newState.rewards.exp
    newState.player.gold += newState.rewards.gold
    
    // 检查升级
    while (newState.player.exp >= getExpForLevel(newState.player.level)) {
      newState.player = levelUp(newState.player)
      newState.battleLog.push(`升级了！等级提升至 ${newState.player.level}！`)
    }
  } else {
    // 切换到怪物回合
    newState.isPlayerTurn = false
  }

  return { state: newState, message }
}

// 怪物回合
export function monsterTurn(state: BattleState): BattleResult {
  if (state.isPlayerTurn || state.isFinished) {
    return { state, message: '现在不是怪物的回合' }
  }

  const newState = { ...state }
  const stats = calculatePlayerStats(newState.player)
  
  // 玩家闪避判定
  if (Math.random() < stats.dodgeRate) {
    newState.battleLog.push(`${newState.player.name} 闪避了攻击！`)
  } else {
    const damage = calculateDamage(
      { attack: newState.monster.attack },
      { defense: stats.defense },
      false
    )
    
    newState.player.hp -= damage
    newState.battleLog.push(`${newState.monster.name} 造成 ${damage} 点伤害`)
  }

  // 检查玩家是否死亡
  if (newState.player.hp <= 0) {
    newState.player.hp = 1 // 保留1点HP
    newState.isFinished = true
    newState.result = 'defeat'
    newState.player.gold = Math.floor(newState.player.gold * 0.5) // 损失50%金币
    newState.battleLog.push('战斗失败...损失了 50% 金币')
  } else {
    // 切换到玩家回合
    newState.isPlayerTurn = true
    newState.turn += 1
  }

  return { state: newState, message: newState.battleLog[newState.battleLog.length - 1] }
}

// 生成战斗奖励
function generateRewards(monster: Monster): {
  exp: number
  gold: number
  items: string[]
} {
  const items: string[] = []
  
  // 掉落判定
  for (const drop of monster.dropTable) {
    if (Math.random() < drop.probability) {
      items.push(drop.itemId)
    }
  }
  
  return {
    exp: monster.expReward,
    gold: monster.goldReward,
    items,
  }
}

// 应用技能效果
function applySkillEffect(
  skill: Skill,
  player: Player,
  monster: Monster,
  playerStats: ReturnType<typeof calculatePlayerStats>
): { player: Player; monster: Monster; message: string } {
  let newPlayer = { ...player }
  let newMonster = { ...monster }
  let message = ''

  for (const effect of skill.effects) {
    // 计算效果值
    let effectValue = 0
    if (typeof effect.value === 'number') {
      effectValue = effect.value
    } else if (typeof effect.value === 'string') {
      // 解析公式（如 "attack * 1.5"）
      const match = effect.value.match(/^(\w+)\s*\*\s*([\d.]+)$/)
      if (match) {
        const statName = match[1]
        const multiplier = parseFloat(match[2])
        switch (statName) {
          case 'attack':
            effectValue = Math.floor(playerStats.attack * multiplier)
            break
          case 'intelligence':
            effectValue = Math.floor(playerStats.intelligence * multiplier)
            break
          case 'defense':
            effectValue = Math.floor(playerStats.defense * multiplier)
            break
          default:
            effectValue = 0
        }
      }
    }

    // 根据效果类型应用
    switch (effect.type) {
      case 'damage':
        if (effect.target === 'enemy') {
          // 对敌人造成伤害
          const damage = Math.max(1, effectValue - Math.floor(newMonster.defense / 2))
          newMonster.hp -= damage
          message = `${skill.name}造成 ${damage} 点伤害！`
        }
        break
        
      case 'heal':
        if (effect.target === 'self') {
          // 恢复自身生命值
          const healAmount = Math.min(effectValue, playerStats.maxHp - newPlayer.hp)
          newPlayer.hp += healAmount
          message = `${skill.name}恢复了 ${healAmount} 点生命值！`
        }
        break
        
      case 'buff':
        // TODO: 实现buff效果
        message = `${skill.name}效果生效！`
        break
        
      case 'debuff':
        // TODO: 实现debuff效果
        message = `${skill.name}对敌人施加了负面效果！`
        break
        
      default:
        message = `${skill.name}使用了！`
    }
  }

  return { player: newPlayer, monster: newMonster, message }
}
