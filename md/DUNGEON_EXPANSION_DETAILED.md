# 地下城探索扩展详细方案

基于GAMEPLAY_FEATURES.md中的"地下城探索扩展"建议，结合当前项目DungeonSystem.ts的实现，提出以下详细扩展方案。

## 1. 更多事件类型

### 1.1 当前事件类型
- battle（战斗）
- treasure（宝箱）
- trap（陷阱）
- heal（回复之泉）
- empty（空房间）

### 1.2 扩展事件类型
```typescript
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
```

### 1.3 事件数据结构扩展
```typescript
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
}

export interface EventRequirement {
  type: 'level' | 'item' | 'skill' | 'gold' | 'stat'
  value: number
  itemId?: string
  skillId?: string
  stat?: 'attack' | 'defense' | 'intelligence' | 'hp' | 'mp'
}
```

## 2. 陷阱多样性

### 2.1 当前陷阱
- 固定伤害陷阱（10 * floor点伤害）

### 2.2 扩展陷阱类型
```typescript
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
```

### 2.3 陷阱效果实现
```typescript
// 陷阱效果处理函数
function processTrap(trap: TrapEvent, player: Player): {
  player: Player
  message: string
  damage?: number
  statusEffects?: StatusEffect[]
} {
  const difficultyMultiplier = 1 + (trap.difficulty - 1) * 0.2
  
  switch (trap.trapType) {
    case 'damage':
      const damage = Math.floor(10 * trap.difficulty * difficultyMultiplier)
      return {
        player: { ...player, hp: Math.max(1, player.hp - damage) },
        message: `触发伤害陷阱，受到 ${damage} 点伤害！`,
        damage
      }
      
    case 'poison':
      // 添加中毒状态效果，持续3回合
      return {
        player: addStatusEffect(player, {
          type: 'poison',
          duration: 3,
          value: Math.floor(5 * difficultyMultiplier)
        }),
        message: '触发毒气陷阱，中毒了！',
        statusEffects: [{ type: 'poison', duration: 3, value: Math.floor(5 * difficultyMultiplier) }]
      }
      
    case 'curse':
      // 随机降低一项属性
      const stats = ['attack', 'defense', 'intelligence'] as const
      const randomStat = stats[Math.floor(Math.random() * stats.length)]
      const reduction = Math.floor(2 * difficultyMultiplier)
      return {
        player: { ...player, [randomStat]: player[randomStat] - reduction },
        message: `触发诅咒陷阱，${randomStat} 降低了 ${reduction}！`
      }
      
    // ... 其他陷阱类型
  }
}
```

## 3. 环境互动

### 3.1 可互动元素
```typescript
export interface EnvironmentElement {
  id: string
  type: 'destructible_wall' | 'mechanism' | 'chest_key' | 'lever' | 'pressure_plate'
  interacted: boolean
  requires?: Item[] // 需要的物品
  reveals?: DungeonEvent // 互动后揭示的事件
  rewards?: EventReward[]
}
```

### 3.2 环境互动类型
1. **可破坏的墙壁**：使用攻击或特定技能破坏，可能发现隐藏房间
2. **机关**：需要特定物品或属性才能激活，可能打开新路径或宝箱
3. **宝箱钥匙**：需要钥匙才能打开的宝箱，奖励更丰厚
4. **拉杆**：改变地下城结构或触发事件
5. **压力板**：需要站上去触发，可能打开门或触发陷阱

### 3.3 实现示例
```typescript
export interface DestructibleWall extends EnvironmentElement {
  type: 'destructible_wall'
  hp: number // 墙壁耐久度
  requiredDamage: number // 需要的最低伤害
  hiddenEvent?: DungeonEvent // 墙后隐藏的事件
}

function interactWithWall(
  wall: DestructibleWall, 
  player: Player
): { wall: DestructibleWall; event?: DungeonEvent; message: string } {
  const stats = calculatePlayerStats(player)
  
  if (stats.attack < wall.requiredDamage) {
    return {
      wall,
      message: '你的攻击力不足以破坏这面墙。'
    }
  }
  
  // 破坏墙壁
  const newWall = { ...wall, interacted: true, hp: 0 }
  
  return {
    wall: newWall,
    event: wall.hiddenEvent,
    message: '墙壁被破坏了！'
  }
}
```

## 4. 地下城主题

### 4.1 主题定义
```typescript
export type DungeonTheme = 
  | 'forest'   // 森林
  | 'volcano'  // 火山
  | 'ice_cave' // 冰窟
  | 'ruins'    // 遗迹
  | 'tomb'     // 墓穴
  | 'sewer'    // 下水道
  | 'castle'   // 城堡
  | 'mine'     // 矿洞

export interface DungeonThemeConfig {
  name: string
  description: string
  monsterTypes: string[] // 可能出现的怪物类型
  element: 'none' | 'fire' | 'ice' | 'thunder' | 'earth' | 'wind' | 'water'
  environmentalEffects: EnvironmentalEffect[]
  specialEvents: DungeonEventType[] // 该主题特有的事件
  boss: string // 主题BOSS
  background: string // 背景图片
  music: string // 背景音乐
}
```

### 4.2 主题配置示例
```typescript
export const DUNGEON_THEMES: Record<DungeonTheme, DungeonThemeConfig> = {
  forest: {
    name: '迷雾森林',
    description: '充满迷雾的古老森林，栖息着各种生物。',
    monsterTypes: ['slime', 'goblin', 'wolf', 'treant'],
    element: 'earth',
    environmentalEffects: [
      { type: 'visibility', value: 0.7 }, // 视野减少
      { type: 'movement_speed', value: 0.8 } // 移动速度减少
    ],
    specialEvents: ['herb_gathering', 'beast_nest'],
    boss: 'Forest Guardian',
    background: 'forest_bg.jpg',
    music: 'forest_theme.mp3'
  },
  volcano: {
    name: '熔岩火山',
    description: '炽热的火山地带，到处流淌着岩浆。',
    monsterTypes: ['fire_elemental', 'lava_golem', 'phoenix'],
    element: 'fire',
    environmentalEffects: [
      { type: 'fire_damage', value: 5 }, // 每回合受到火焰伤害
      { type: 'heat_exhaustion', value: 0.9 } // 行动消耗增加
    ],
    specialEvents: ['lava_river', 'obsidian_deposit'],
    boss: 'Volcanic Dragon',
    background: 'volcano_bg.jpg',
    music: 'volcano_theme.mp3'
  }
  // ... 其他主题
}
```

### 4.3 主题选择系统
- 玩家达到一定层数后解锁新主题
- 每个主题有独立的难度和奖励
- 主题影响怪物生成、事件概率、环境效果

## 5. 无尽模式

### 5.1 模式定义
```typescript
export interface EndlessModeState {
  currentFloor: number
  highestFloor: number // 历史最高层数
  score: number // 当前分数
  multiplier: number // 奖励倍率（随层数增加）
  specialRules: SpecialRule[] // 特殊规则
  leaderboard: LeaderboardEntry[] // 排行榜
}

export interface SpecialRule {
  id: string
  name: string
  description: string
  effect: RuleEffect
  active: boolean
}

export type RuleEffect = 
  | 'double_monster_hp'
  | 'half_player_healing'
  | 'no_items'
  | 'time_limit'
  | 'permanent_curse'
```

### 5.2 无尽模式规则
1. **无限层数**：没有上限，挑战玩家极限
2. **动态难度**：怪物属性随层数指数增长
3. **特殊规则**：每10层随机激活一个特殊规则
4. **排行榜**：记录最高层数，可本地或在线排行
5. **奖励机制**：每通过一层获得分数，可兑换特殊奖励

### 5.3 实现方案
```typescript
// 无尽模式生成函数
export function generateEndlessFloor(
  floor: number, 
  theme: DungeonTheme,
  activeRules: SpecialRule[]
): DungeonRun {
  const themeConfig = DUNGEON_THEMES[theme]
  
  // 计算难度倍率
  const difficultyMultiplier = Math.pow(1.15, floor - 1)
  
  // 生成事件
  const events: DungeonEvent[] = []
  
  // 根据主题生成怪物
  const monsterCount = Math.min(5, 2 + Math.floor(floor / 10))
  
  for (let i = 0; i < monsterCount; i++) {
    events.push({
      type: 'battle',
      description: `第 ${i + 1} 场战斗`,
      completed: false,
      data: {
        monsterType: themeConfig.monsterTypes[
          Math.floor(Math.random() * themeConfig.monsterTypes.length)
        ],
        difficultyMultiplier
      }
    })
    
    // 添加随机事件
    if (Math.random() < 0.3) {
      const eventType = getRandomEvent(themeConfig.specialEvents)
      events.push({
        type: eventType,
        description: getEventDescription(eventType),
        completed: false
      })
    }
  }
  
  // 每10层添加BOSS
  if (floor % 10 === 0) {
    events.push({
      type: 'battle',
      description: `BOSS战：${themeConfig.boss}`,
      completed: false,
      data: { isBoss: true, bossType: themeConfig.boss }
    })
  }
  
  return {
    floor,
    events,
    currentEventIndex: 0,
    isFinished: false,
    rewards: {
      totalExp: 0,
      totalGold: 0,
      items: []
    }
  }
}
```

## 6. UI/UX 改进

### 6.1 地下城探索界面
1. **地图显示**：显示当前层的地图，标记已探索区域
2. **事件图标**：不同事件类型使用不同图标
3. **进度指示**：显示当前事件/总事件数
4. **环境效果**：显示当前环境效果和剩余时间

### 6.2 事件处理界面
1. **选择分支**：对于有选择的事件，显示选项按钮
2. **概率显示**：显示成功/失败概率
3. **奖励预览**：显示可能获得的奖励
4. **动画效果**：事件触发时的动画反馈

### 6.3 实现建议
```typescript
// 地下城探索组件
export default function Dungeon() {
  // ... 现有代码
  
  // 新增状态
  const [currentTheme, setCurrentTheme] = useState<DungeonTheme>('forest')
  const [environmentEffects, setEnvironmentEffects] = useState<EnvironmentalEffect[]>([])
  const [mapData, setMapData] = useState<MapData | null>(null)
  
  // 事件选择处理
  const handleEventChoice = (choiceId: string) => {
    // 处理玩家选择
  }
  
  // 环境互动处理
  const handleEnvironmentInteract = (elementId: string) => {
    // 处理环境互动
  }
  
  return (
    <div className="min-h-screen p-6">
      {/* 主题信息 */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-game-accent">
          {DUNGEON_THEMES[currentTheme].name}
        </h2>
        <p className="text-sm text-gray-400">
          {DUNGEON_THEMES[currentTheme].description}
        </p>
      </div>
      
      {/* 环境效果显示 */}
      {environmentEffects.length > 0 && (
        <div className="mb-4 flex gap-2">
          {environmentEffects.map((effect, index) => (
            <div key={index} className="bg-game-bg px-3 py-1 rounded text-sm">
              {effect.type}: {effect.value}
            </div>
          ))}
        </div>
      )}
      
      {/* 地图区域 */}
      <div className="game-panel mb-6">
        <h3 className="text-lg font-bold mb-3 text-game-accent">地图</h3>
        {/* 地图组件 */}
      </div>
      
      {/* 事件列表 */}
      <div className="game-panel max-w-2xl mx-auto">
        {/* 现有事件列表代码 */}
      </div>
    </div>
  )
}
```

## 7. 数据配置

### 7.1 配置文件结构
```
data/
  dungeons/
    themes.json          # 地下城主题配置
    events.json          # 事件配置
    traps.json           # 陷阱配置
    environment.json     # 环境元素配置
    endless_rules.json   # 无尽模式规则
```

### 7.2 示例配置（events.json）
```json
{
  "puzzle": {
    "riddle": {
      "description": "一个古老的谜题挡住了去路。",
      "choices": [
        {
          "id": "solve",
          "text": "尝试解谜",
          "successChance": 0.7,
          "successOutcome": {
            "rewards": [{ "type": "gold", "value": 100 }]
          },
          "failureOutcome": {
            "penalties": [{ "type": "damage", "value": 20 }]
          }
        },
        {
          "id": "ignore",
          "text": "无视谜题",
          "outcome": {
            "message": "你决定不理会这个谜题。"
          }
        }
      ]
    }
  }
}
```

## 8. 实现步骤

### 8.1 第一阶段：基础扩展（2-3周）
1. 扩展事件类型数据结构
2. 添加2-3种新事件（谜题、商人、隐藏房间）
3. 实现陷阱多样性
4. 更新UI显示新事件

### 8.2 第二阶段：环境互动（2-3周）
1. 添加环境元素数据结构
2. 实现可破坏墙壁和机关
3. 添加钥匙和宝箱系统
4. 更新地下城探索界面

### 8.3 第三阶段：主题系统（3-4周）
1. 设计和实现主题配置
2. 添加2-3个主题（森林、火山、冰窟）
3. 实现主题选择界面
4. 添加主题相关怪物和BOSS

### 8.4 第四阶段：无尽模式（3-4周）
1. 设计无尽模式规则
2. 实现动态难度系统
3. 添加排行榜功能
4. 实现特殊规则系统

### 8.5 第五阶段：优化和测试（2-3周）
1. 平衡性调整
2. 性能优化
3. 用户体验改进
4. 全面测试

## 9. 技术注意事项

1. **性能优化**：大量事件和环境元素可能影响性能，需要优化渲染和计算
2. **存档兼容性**：添加新数据结构时需要考虑旧存档兼容性
3. **配置管理**：大量配置数据需要良好的管理和加载机制
4. **随机种子**：为保证可重现性，考虑使用随机种子生成事件
5. **国际化**：所有文本需要支持多语言

## 10. 优先级建议

1. **陷阱多样性**（快速提升游戏体验）
2. **更多事件类型**（增加探索乐趣）
3. **环境互动**（增加策略性）
4. **主题系统**（增加视觉多样性）
5. **无尽模式**（增加重玩价值）

此方案可根据开发资源和时间逐步实现，建议从陷阱多样性和事件类型扩展开始，快速提升游戏体验。