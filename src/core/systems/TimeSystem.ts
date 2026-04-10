import type { Player } from '../models/Player'
import { calculatePlayerStats, createDefaultPlayer } from '../models/Player'
import { settleStage, getCurrentStage } from './EconomySystem'

export interface GameState {
  player: Player
  gameOver: boolean
  victory: boolean
  ending: 'perfect' | 'normal' | 'bad' | null
}

// 消耗行动点
export function consumeAction(player: Player, amount: number = 1): Player {
  return {
    ...player,
    actionsLeft: Math.max(0, player.actionsLeft - amount),
  }
}

// 结束今天
export function endDay(state: GameState): GameState {
  let newPlayer = { ...state.player }
  let messages: string[] = []
  
  // 天数增加
  newPlayer.day += 1
  newPlayer.actionsLeft = 3
  
  // 检查阶段结算
  const prevStage = getCurrentStage(state.player.day)
  const newStage = getCurrentStage(newPlayer.day)
  
  // 如果进入新阶段，结算上一阶段
  if (newStage > prevStage) {
    const settlement = settleStage(newPlayer, prevStage)
    newPlayer = settlement.player
    messages.push(settlement.message)
  }
  
  // 检查游戏结束
  if (newPlayer.day > 100) {
    return checkEnding({ ...state, player: newPlayer })
  }
  
  return {
    ...state,
    player: newPlayer,
  }
}

// 营地休息
export function restAtCamp(player: Player): {
  success: boolean
  player: Player
  message: string
} {
  if (player.actionsLeft <= 0) {
    return {
      success: false,
      player,
      message: '今日行动次数已用完',
    }
  }
  
  const stats = calculatePlayerStats(player)
  const restorePercent = 0.3 // 基础恢复 30%
  const restoreAmount = Math.floor(stats.maxHp * restorePercent)
  
  const newPlayer = {
    ...player,
    hp: Math.min(stats.maxHp, player.hp + restoreAmount),
    actionsLeft: player.actionsLeft - 1,
  }
  
  return {
    success: true,
    player: newPlayer,
    message: `在营地休息，恢复了 ${restoreAmount} 点生命值`,
  }
}

// 检查游戏结局
export function checkEnding(state: GameState): GameState {
  const { player } = state
  
  // 第 100 天结束
  if (player.debt <= 0) {
    // 还清债务
    if (player.gold >= 5000) {
      return {
        ...state,
        gameOver: true,
        victory: true,
        ending: 'perfect',
      }
    } else {
      return {
        ...state,
        gameOver: true,
        victory: true,
        ending: 'normal',
      }
    }
  } else {
    // 未还清债务
    return {
      ...state,
      gameOver: true,
      victory: false,
      ending: 'bad',
    }
  }
}

// 获取结局文本
export function getEndingText(ending: 'perfect' | 'normal' | 'bad'): {
  title: string
  description: string
} {
  switch (ending) {
    case 'perfect':
      return {
        title: '完美结局 - 富豪冒险者',
        description: '你不仅还清了所有债务，还积攒了可观的财富。现在的你可以自由地探索地下城，或者开一家自己的道具店...',
      }
    case 'normal':
      return {
        title: '普通结局 - 自由之身',
        description: '你成功还清了债务，虽然手头并不宽裕，但你自由了。告别地下城的日子，你开始规划新的人生...',
      }
    case 'bad':
      return {
        title: '失败结局 - 债务缠身',
        description: '100天的期限已过，但你未能还清债务。债权人收走了你的一切，你不得不签订更苛刻的契约，继续在地下城中挣扎求生...',
      }
  }
}

// 初始化新游戏
export function initGame(): GameState {
  return {
    player: createDefaultPlayer(),
    gameOver: false,
    victory: false,
    ending: null,
  }
}
