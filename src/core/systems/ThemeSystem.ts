import type { DungeonThemeId, DungeonThemeConfig } from '../models/DungeonTheme'
import type { Player } from '../models/Player'
import type { Monster } from '../models/Monster'

// 主题配置 - 直接嵌入代码避免文件路径问题
const themeConfigs: Record<DungeonThemeId, DungeonThemeConfig> = {
  forest: {
    id: 'forest',
    name: 'Forest',
    nameZh: '迷雾森林',
    description: '充满迷雾的古老森林，栖息着各种生物。小心潜伏在阴影中的危险。',
    element: 'earth',
    visual: {
      background: 'linear-gradient(to bottom, #1a3a1a, #0d1f0d)',
      ambientColor: '#2d5a2d',
      particleEffect: 'leaves',
      fogColor: 'rgba(160, 192, 160, 0.3)',
      fogDensity: 0.3,
      icon: '🌲'
    },
    audio: {
      bgm: 'audio/bgm/forest_theme.mp3',
      ambient: 'audio/sfx/forest_ambient.mp3',
      battleBgm: 'audio/bgm/forest_battle.mp3'
    },
    mechanics: {
      monsterTypes: ['slime', 'goblin', 'wolf', 'treant', 'spider', 'snake'],
      environmentalEffects: [
        {
          type: 'visibility',
          value: 0.7,
          description: '视野范围减少30%'
        }
      ],
      specialEvents: ['herb_gathering', 'beast_nest', 'fairy_encounter', 'ancient_tree', 'mushroom_circle'],
      boss: 'Forest Guardian',
      bossDescription: '森林的古老守护者，拥有强大的自然之力'
    },
    unlockCondition: {}
  },
  volcano: {
    id: 'volcano',
    name: 'Volcano',
    nameZh: '熔岩火山',
    description: '炽热的火山地带，到处流淌着岩浆。只有最勇敢的冒险者才能在这里生存。',
    element: 'fire',
    visual: {
      background: 'linear-gradient(to bottom, #4a1a1a, #2d0d0d)',
      ambientColor: '#8b0000',
      particleEffect: 'embers',
      fogColor: 'rgba(255, 69, 0, 0.2)',
      fogDensity: 0.2,
      icon: '🌋'
    },
    audio: {
      bgm: 'audio/bgm/volcano_theme.mp3',
      ambient: 'audio/sfx/volcano_ambient.mp3',
      battleBgm: 'audio/bgm/volcano_battle.mp3'
    },
    mechanics: {
      monsterTypes: ['fire_elemental', 'lava_golem', 'phoenix', 'salamander', 'magma_beast'],
      environmentalEffects: [
        {
          type: 'damage_taken',
          value: 3,
          description: '每回合受到3点火焰伤害'
        },
        {
          type: 'healing_effect',
          value: 0.8,
          description: '治疗效果降低20%'
        }
      ],
      specialEvents: ['lava_river', 'obsidian_deposit', 'fire_shrine', 'volcanic_vent', 'magma_chamber'],
      boss: 'Volcanic Dragon',
      bossDescription: '沉睡于火山深处的远古巨龙'
    },
    unlockCondition: {
      floorReached: 5
    }
  },
  ice_cave: {
    id: 'ice_cave',
    name: 'Ice Cave',
    nameZh: '极寒冰窟',
    description: '永冻的地下洞穴，寒冷会侵蚀你的意志。小心脚下，冰面很滑。',
    element: 'ice',
    visual: {
      background: 'linear-gradient(to bottom, #1a2a3a, #0d151f)',
      ambientColor: '#4682b4',
      particleEffect: 'snow',
      fogColor: 'rgba(200, 220, 255, 0.4)',
      fogDensity: 0.4,
      icon: '❄️'
    },
    audio: {
      bgm: 'audio/bgm/ice_theme.mp3',
      ambient: 'audio/sfx/ice_ambient.mp3',
      battleBgm: 'audio/bgm/ice_battle.mp3'
    },
    mechanics: {
      monsterTypes: ['ice_elemental', 'yeti', 'frost_wolf', 'snowman', 'polar_bear'],
      environmentalEffects: [
        {
          type: 'movement_speed',
          value: 0.8,
          description: '移动速度降低20%'
        }
      ],
      specialEvents: ['frozen_lake', 'ice_crystal', 'blizzard', 'warm_spring', 'glacier'],
      boss: 'Ice Queen',
      bossDescription: '统治冰窟的冰雪女王'
    },
    unlockCondition: {
      floorReached: 10
    }
  },
  ruins: {
    id: 'ruins',
    name: 'Ruins',
    nameZh: '远古遗迹',
    description: '被遗忘的古代文明遗址，充满了神秘的机关和宝藏。',
    element: 'earth',
    visual: {
      background: 'linear-gradient(to bottom, #3a3a2a, #1f1f15)',
      ambientColor: '#8b7355',
      particleEffect: 'dust',
      fogColor: 'rgba(180, 160, 140, 0.3)',
      fogDensity: 0.3,
      icon: '🏛️'
    },
    audio: {
      bgm: 'audio/bgm/ruins_theme.mp3',
      ambient: 'audio/sfx/ruins_ambient.mp3',
      battleBgm: 'audio/bgm/ruins_battle.mp3'
    },
    mechanics: {
      monsterTypes: ['skeleton', 'mummy', 'golem', 'ghost', 'sarcophagus'],
      environmentalEffects: [
        {
          type: 'gold_bonus',
          value: 1.2,
          description: '金币获取增加20%'
        }
      ],
      specialEvents: ['ancient_mechansim', 'hidden_chamber', 'treasure_room', 'inscription', 'time_portal'],
      boss: 'Ancient Guardian',
      bossDescription: '守护遗迹的古代魔像'
    },
    unlockCondition: {
      floorReached: 15
    }
  },
  tomb: {
    id: 'tomb',
    name: 'Tomb',
    nameZh: '幽暗墓穴',
    description: '死者的安息之地，不死生物在这里游荡。黑暗会吞噬你的理智。',
    element: 'dark',
    visual: {
      background: 'linear-gradient(to bottom, #1a1a1a, #0d0d0d)',
      ambientColor: '#696969',
      particleEffect: 'darkness',
      fogColor: 'rgba(50, 50, 50, 0.6)',
      fogDensity: 0.6,
      icon: '⚰️'
    },
    audio: {
      bgm: 'audio/bgm/tomb_theme.mp3',
      ambient: 'audio/sfx/tomb_ambient.mp3',
      battleBgm: 'audio/bgm/tomb_battle.mp3'
    },
    mechanics: {
      monsterTypes: ['zombie', 'skeleton', 'ghost', 'vampire', 'lich'],
      environmentalEffects: [
        {
          type: 'healing_effect',
          value: 0.7,
          description: '治疗效果降低30%'
        }
      ],
      specialEvents: ['coffin', 'sacrificial_altar', 'haunted_mirror', 'cursed_treasure', 'soul_well'],
      boss: 'Death Knight',
      bossDescription: '死亡骑士，墓穴中最强大的不死生物'
    },
    unlockCondition: {
      floorReached: 20
    }
  },
  sewer: {
    id: 'sewer',
    name: 'Sewer',
    nameZh: '污秽下水道',
    description: '城市的下水道系统，充满了肮脏和疾病。',
    element: 'water',
    visual: {
      background: 'linear-gradient(to bottom, #2a3a2a, #151f15)',
      ambientColor: '#556b2f',
      particleEffect: 'sludge',
      fogColor: 'rgba(100, 120, 100, 0.4)',
      fogDensity: 0.4,
      icon: '🐀'
    },
    audio: {
      bgm: 'audio/bgm/sewer_theme.mp3',
      ambient: 'audio/sfx/sewer_ambient.mp3',
      battleBgm: 'audio/bgm/sewer_battle.mp3'
    },
    mechanics: {
      monsterTypes: ['rat', 'slime', 'crocodile', 'plague_rat', 'ooze'],
      environmentalEffects: [
        {
          type: 'damage_taken',
          value: 2,
          description: '每回合受到2点毒素伤害'
        }
      ],
      specialEvents: ['toxic_waste', 'rat_nest', 'flooded_tunnel', 'hidden_cache', 'toxic_flower'],
      boss: 'Plague Bringer',
      bossDescription: '带来瘟疫的巨型老鼠'
    },
    unlockCondition: {
      floorReached: 8
    }
  },
  castle: {
    id: 'castle',
    name: 'Castle',
    nameZh: '古老城堡',
    description: '废弃的贵族城堡，曾经是权力的象征，现在是怪物的巢穴。',
    element: 'none',
    visual: {
      background: 'linear-gradient(to bottom, #2a2a3a, #15151f)',
      ambientColor: '#483d8b',
      particleEffect: 'dust',
      fogColor: 'rgba(180, 180, 200, 0.2)',
      fogDensity: 0.2,
      icon: '🏰'
    },
    audio: {
      bgm: 'audio/bgm/castle_theme.mp3',
      ambient: 'audio/sfx/castle_ambient.mp3',
      battleBgm: 'audio/bgm/castle_battle.mp3'
    },
    mechanics: {
      monsterTypes: ['knight', 'mage', 'archer', 'royal_guard', 'jester'],
      environmentalEffects: [
        {
          type: 'exp_bonus',
          value: 1.15,
          description: '经验值获取增加15%'
        }
      ],
      specialEvents: ['throne_room', 'treasury', 'library', 'dungeon', 'banquet_hall'],
      boss: 'Fallen King',
      bossDescription: '堕落的国王，城堡的主人'
    },
    unlockCondition: {
      floorReached: 25
    }
  },
  mine: {
    id: 'mine',
    name: 'Mine',
    nameZh: '废弃矿洞',
    description: '被遗弃的矿洞，富含珍贵矿石但也充满危险。',
    element: 'earth',
    visual: {
      background: 'linear-gradient(to bottom, #3a2a1a, #1f150d)',
      ambientColor: '#8b4513',
      particleEffect: 'dust',
      fogColor: 'rgba(160, 140, 120, 0.3)',
      fogDensity: 0.3,
      icon: '⛏️'
    },
    audio: {
      bgm: 'audio/bgm/mine_theme.mp3',
      ambient: 'audio/sfx/mine_ambient.mp3',
      battleBgm: 'audio/bgm/mine_battle.mp3'
    },
    mechanics: {
      monsterTypes: ['bat', 'spider', 'golem', 'miner_ghost', 'crystal_beast'],
      environmentalEffects: [
        {
          type: 'gold_bonus',
          value: 1.25,
          description: '金币获取增加25%'
        }
      ],
      specialEvents: ['crystal_vein', 'abandoned_cart', 'cave_in', 'gem_deposit', 'forge'],
      boss: 'Crystal Golem',
      bossDescription: '由珍贵水晶构成的巨大魔像'
    },
    unlockCondition: {
      floorReached: 12
    }
  }
}

/**
 * 加载主题配置
 * 直接从代码中获取，无需文件读取
 */
export async function loadThemeConfigs(): Promise<Record<DungeonThemeId, DungeonThemeConfig>> {
  return themeConfigs
}

/**
 * 获取单个主题配置
 * @param themeId 主题ID
 * @returns 主题配置
 */
export async function getThemeConfig(themeId: DungeonThemeId): Promise<DungeonThemeConfig> {
  const configs = await loadThemeConfigs()
  return configs[themeId]
}

/**
 * 获取玩家可用的主题列表
 * 根据玩家进度和解锁条件返回可用的主题ID列表
 * @param player 玩家对象
 * @returns 可用的主题ID数组
 */
export async function getAvailableThemes(player: Player): Promise<DungeonThemeId[]> {
  const configs = await loadThemeConfigs()
  const available: DungeonThemeId[] = []
  
  for (const [id, config] of Object.entries(configs)) {
    if (isThemeUnlocked(config, player)) {
      available.push(id as DungeonThemeId)
    }
  }
  
  return available
}

/**
 * 检查主题是否已解锁
 * 根据主题配置的解锁条件检查玩家是否满足解锁要求
 * @param config 主题配置
 * @param player 玩家对象
 * @returns 是否已解锁
 */
export function isThemeUnlocked(config: DungeonThemeConfig, player: Player): boolean {
  const condition = config.unlockCondition
  
  if (!condition) {
    return true
  }
  
  // 检查层数要求
  if (condition.floorReached) {
    // 这里需要玩家的最高层数，暂时使用day作为替代
    // 实际应该从玩家数据中获取最高层数
    const highestFloor = Math.floor(player.day / 10) + 1
    if (highestFloor < condition.floorReached) {
      return false
    }
  }
  
  // 检查任务要求
  if (condition.questCompleted) {
    // TODO: 检查玩家是否完成特定任务
  }
  
  // 检查物品要求
  if (condition.itemCollected) {
    // TODO: 检查玩家是否收集特定物品
  }
  
  // 检查金币要求
  if (condition.goldRequired && player.gold < condition.goldRequired) {
    return false
  }
  
  return true
}

/**
 * 应用主题环境效果
 * 将主题的环境效果应用到玩家和怪物身上
 * @param themeConfig 主题配置
 * @param player 玩家对象
 * @param monster 怪物对象
 * @returns 修改后的玩家和怪物对象
 */
export function applyThemeEffects(
  themeConfig: DungeonThemeConfig, 
  player: Player, 
  monster: Monster
): { player: Player; monster: Monster } {
  let modifiedPlayer = { ...player }
  let modifiedMonster = { ...monster }
  
  for (const effect of themeConfig.mechanics.environmentalEffects) {
    switch (effect.type) {
      case 'damage_taken':
        // 每回合受到固定伤害
        modifiedPlayer.hp = Math.max(1, modifiedPlayer.hp - effect.value)
        break
        
      case 'monster_strength':
        // 怪物增强
        modifiedMonster.attack = Math.floor(modifiedMonster.attack * (1 + effect.value / 100))
        modifiedMonster.defense = Math.floor(modifiedMonster.defense * (1 + effect.value / 100))
        break
        
      case 'visibility':
        // 视野效果，可能影响UI显示
        break
        
      case 'movement_speed':
        // 移动速度影响，可能影响行动点消耗
        break
        
      case 'healing_effect':
        // 治疗效果影响
        break
        
      case 'exp_bonus':
        // 经验加成
        break
        
      case 'gold_bonus':
        // 金币加成
        break
    }
  }
  
  return { player: modifiedPlayer, monster: modifiedMonster }
}

/**
 * 获取主题图标
 * @param themeId 主题ID
 * @returns 图标emoji
 */
export function getThemeIcon(themeId: DungeonThemeId): string {
  const icons: Record<DungeonThemeId, string> = {
    forest: '🌲',
    volcano: '🌋',
    ice_cave: '❄️',
    ruins: '🏛️',
    tomb: '⚰️',
    sewer: '🐀',
    castle: '🏰',
    mine: '⛏️'
  }
  return icons[themeId] || '❓'
}

/**
 * 获取主题名称
 * @param themeId 主题ID
 * @returns 主题中文名称
 */
export function getThemeName(themeId: DungeonThemeId): string {
  const names: Record<DungeonThemeId, string> = {
    forest: '森林',
    volcano: '火山',
    ice_cave: '冰窟',
    ruins: '遗迹',
    tomb: '墓穴',
    sewer: '下水道',
    castle: '城堡',
    mine: '矿洞'
  }
  return names[themeId] || themeId
}

/**
 * 获取主题中文名称
 * @param themeId 主题ID
 * @returns 主题的完整中文名称
 */
export function getThemeNameZh(themeId: DungeonThemeId): string {
  const names: Record<DungeonThemeId, string> = {
    forest: '迷雾森林',
    volcano: '熔岩火山',
    ice_cave: '极寒冰窟',
    ruins: '远古遗迹',
    tomb: '幽暗墓穴',
    sewer: '污秽下水道',
    castle: '古老城堡',
    mine: '废弃矿洞'
  }
  return names[themeId] || themeId
}
