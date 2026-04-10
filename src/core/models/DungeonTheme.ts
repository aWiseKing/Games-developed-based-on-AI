export type DungeonThemeId = 
  | 'forest'   // 森林
  | 'volcano'  // 火山
  | 'ice_cave' // 冰窟
  | 'ruins'    // 遗迹
  | 'tomb'     // 墓穴
  | 'sewer'    // 下水道
  | 'castle'   // 城堡
  | 'mine'     // 矿洞

export interface DungeonThemeConfig {
  id: DungeonThemeId
  name: string
  nameZh: string
  description: string
  element: 'none' | 'fire' | 'ice' | 'thunder' | 'earth' | 'wind' | 'water' | 'dark'
  
  // 视觉配置
  visual: {
    background: string // CSS背景类或渐变色
    ambientColor: string // 环境光颜色
    particleEffect?: string // 粒子效果类型
    fogColor?: string // 迷雾颜色
    fogDensity?: number // 迷雾密度（0-1）
    icon: string // 图标emoji
  }
  
  // 音频配置
  audio: {
    bgm?: string // 背景音乐路径
    ambient?: string // 环境音效
    battleBgm?: string // 战斗音乐
  }
  
  // 游戏机制影响
  mechanics: {
    monsterTypes: string[] // 该主题出现的怪物类型
    environmentalEffects: EnvironmentalEffect[] // 环境效果
    specialEvents: string[] // 特殊事件类型
    boss: string // 主题BOSS名称
    bossDescription: string // BOSS描述
  }
  
  // 解锁条件
  unlockCondition?: {
    floorReached?: number // 需要达到的层数
    questCompleted?: string // 需要完成的任务ID
    itemCollected?: string // 需要收集的物品ID
    goldRequired?: number // 需要的金币数量
  }
}

export interface EnvironmentalEffect {
  type: 'visibility' | 'movement_speed' | 'damage_taken' | 'healing_effect' | 'monster_strength' | 'exp_bonus' | 'gold_bonus'
  value: number // 效果值（百分比或固定值）
  description: string
}

export type TrapType = 
  | 'damage'      // 伤害陷阱（当前实现）
  | 'poison'      // 毒气陷阱（持续伤害）
  | 'curse'       // 诅咒陷阱（属性下降）
  | 'teleport'    // 传送陷阱（随机传送）
  | 'slow'        // 减速陷阱（行动点减少）
  | 'instant_death' // 即死陷阱（低概率）
  | 'gold_theft'  // 偷窃陷阱（损失金币）
  | 'mp_drain'    // MP吸取陷阱
  | 'entangle'    // 缠绕陷阱
  | 'pit'         // 陷阱坑
  | 'fire'        // 火焰陷阱
  | 'lava'        // 岩浆陷阱
  | 'explosion'   // 爆炸陷阱
  | 'freeze'      // 冰冻陷阱
  | 'slippery'    // 滑倒陷阱
  | 'icicle'      // 冰柱陷阱
  | 'collapse'    // 坍塌陷阱

// 主题中文名称映射
export const THEME_NAMES_ZH: Record<DungeonThemeId, string> = {
  forest: '迷雾森林',
  volcano: '熔岩火山',
  ice_cave: '极寒冰窟',
  ruins: '远古遗迹',
  tomb: '幽暗墓穴',
  sewer: '污秽下水道',
  castle: '古老城堡',
  mine: '废弃矿洞'
}

// 主题图标映射
export const THEME_ICONS: Record<DungeonThemeId, string> = {
  forest: '🌲',
  volcano: '🌋',
  ice_cave: '❄️',
  ruins: '🏛️',
  tomb: '⚰️',
  sewer: '🐀',
  castle: '🏰',
  mine: '⛏️'
}

// 默认主题配置（作为回退）
export const DEFAULT_THEME_CONFIG: DungeonThemeConfig = {
  id: 'forest',
  name: 'Forest',
  nameZh: '迷雾森林',
  description: '充满迷雾的古老森林，栖息着各种生物。',
  element: 'earth',
  visual: {
    background: 'linear-gradient(to bottom, #1a3a1a, #0d1f0d)',
    ambientColor: '#2d5a2d',
    icon: '🌲'
  },
  audio: {},
  mechanics: {
    monsterTypes: ['slime', 'goblin', 'wolf'],
    environmentalEffects: [],
    specialEvents: [],
    boss: 'Forest Guardian',
    bossDescription: '森林的守护者'
  }
}