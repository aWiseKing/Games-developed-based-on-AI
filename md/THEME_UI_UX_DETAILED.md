# 地下城主题与UI/UX改进详细实施方案

基于GAMEPLAY_FEATURES.md中的建议，结合当前项目结构，制定以下详细实施方案。

## 第一部分：地下城主题系统

### 1. 主题数据结构设计

#### 1.1 主题配置接口
```typescript
// 新增文件：src/core/models/DungeonTheme.ts
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
  description: string
  element: 'none' | 'fire' | 'ice' | 'thunder' | 'earth' | 'wind' | 'water'
  
  // 视觉配置
  visual: {
    background: string // CSS背景类或图片路径
    ambientColor: string // 环境光颜色
    particleEffect?: string // 粒子效果类型
    fogColor?: string // 迷雾颜色
    fogDensity?: number // 迷雾密度（0-1）
  }
  
  // 音频配置
  audio: {
    bgm: string // 背景音乐路径
    ambient: string // 环境音效
    battleBgm?: string // 战斗音乐
  }
  
  // 游戏机制影响
  mechanics: {
    monsterTypes: string[] // 该主题出现的怪物类型
    environmentalEffects: EnvironmentalEffect[] // 环境效果
    specialEvents: string[] // 特殊事件类型
    boss: string // 主题BOSS
    traps: TrapType[] // 该主题常见陷阱类型
  }
  
  // 解锁条件
  unlockCondition: {
    floorReached?: number // 需要达到的层数
    questCompleted?: string // 需要完成的任务
    itemCollected?: string // 需要收集的物品
  }
}

export interface EnvironmentalEffect {
  type: 'visibility' | 'movement_speed' | 'damage_taken' | 'healing_effect' | 'monster_strength'
  value: number // 效果值（百分比或固定值）
  description: string
}
```

#### 1.2 主题配置文件
```json
// 新增文件：data/dungeon/themes.json
{
  "forest": {
    "id": "forest",
    "name": "迷雾森林",
    "description": "充满迷雾的古老森林，栖息着各种生物。",
    "element": "earth",
    "visual": {
      "background": "linear-gradient(to bottom, #1a3a1a, #0d1f0d)",
      "ambientColor": "#2d5a2d",
      "particleEffect": "leaves",
      "fogColor": "#a0c0a0",
      "fogDensity": 0.3
    },
    "audio": {
      "bgm": "audio/bgm/forest_theme.mp3",
      "ambient": "audio/sfx/forest_ambient.mp3",
      "battleBgm": "audio/bgm/forest_battle.mp3"
    },
    "mechanics": {
      "monsterTypes": ["slime", "goblin", "wolf", "treant"],
      "environmentalEffects": [
        {
          "type": "visibility",
          "value": 0.7,
          "description": "视野范围减少30%"
        }
      ],
      "specialEvents": ["herb_gathering", "beast_nest", "fairy_encounter"],
      "boss": "Forest Guardian",
      "traps": ["poison", "entangle", "pit"]
    },
    "unlockCondition": {}
  },
  "volcano": {
    "id": "volcano",
    "name": "熔岩火山",
    "description": "炽热的火山地带，到处流淌着岩浆。",
    "element": "fire",
    "visual": {
      "background": "linear-gradient(to bottom, #4a1a1a, #2d0d0d)",
      "ambientColor": "#8b0000",
      "particleEffect": "embers",
      "fogColor": "#ff4500",
      "fogDensity": 0.2
    },
    "audio": {
      "bgm": "audio/bgm/volcano_theme.mp3",
      "ambient": "audio/sfx/volcano_ambient.mp3",
      "battleBgm": "audio/bgm/volcano_battle.mp3"
    },
    "mechanics": {
      "monsterTypes": ["fire_elemental", "lava_golem", "phoenix"],
      "environmentalEffects": [
        {
          "type": "damage_taken",
          "value": 5,
          "description": "每回合受到5点火焰伤害"
        }
      ],
      "specialEvents": ["lava_river", "obsidian_deposit", "fire_shrine"],
      "boss": "Volcanic Dragon",
      "traps": ["fire", "lava", "explosion"]
    },
    "unlockCondition": {
      "floorReached": 10
    }
  }
  // ... 其他主题配置
}
```

### 2. 主题系统实现

#### 2.1 主题管理器
```typescript
// 新增文件：src/core/systems/ThemeSystem.ts
import type { DungeonThemeId, DungeonThemeConfig } from '../models/DungeonTheme'

// 主题配置缓存
let themeConfigs: Record<DungeonThemeId, DungeonThemeConfig> | null = null

// 加载主题配置
export async function loadThemeConfigs(): Promise<Record<DungeonThemeId, DungeonThemeConfig>> {
  if (themeConfigs) return themeConfigs
  
  try {
    const response = await fetch('/data/dungeon/themes.json')
    const data = await response.json()
    themeConfigs = data
    return data
  } catch (error) {
    console.error('Failed to load theme configs:', error)
    throw error
  }
}

// 获取主题配置
export async function getThemeConfig(themeId: DungeonThemeId): Promise<DungeonThemeConfig> {
  const configs = await loadThemeConfigs()
  return configs[themeId]
}

// 获取可用主题（根据解锁条件）
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

// 检查主题是否解锁
function isThemeUnlocked(config: DungeonThemeConfig, player: Player): boolean {
  const condition = config.unlockCondition
  
  if (condition.floorReached && player.highestFloor < condition.floorReached) {
    return false
  }
  
  // 其他解锁条件检查...
  
  return true
}

// 应用主题环境效果
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
        
      // 其他效果...
    }
  }
  
  return { player: modifiedPlayer, monster: modifiedMonster }
}
```

#### 2.2 扩展DungeonRun接口
```typescript
// 修改 src/core/systems/DungeonSystem.ts
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

// 修改 startDungeonRun 函数
export async function startDungeonRun(
  floor: number, 
  theme: DungeonThemeId = 'forest'
): Promise<DungeonRun> {
  const themeConfig = await getThemeConfig(theme)
  
  // 根据主题生成事件
  const events = generateEventsForTheme(floor, themeConfig)
  
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

// 根据主题生成事件
function generateEventsForTheme(
  floor: number, 
  themeConfig: DungeonThemeConfig
): DungeonEvent[] {
  const events: DungeonEvent[] = []
  const floorInfo = DUNGEON_FLOORS[floor - 1]
  
  // 生成战斗事件，使用主题特定的怪物
  for (let i = 0; i < floorInfo.enemyCount; i++) {
    const monsterType = themeConfig.mechanics.monsterTypes[
      Math.floor(Math.random() * themeConfig.mechanics.monsterTypes.length)
    ]
    
    events.push({
      type: 'battle',
      description: `遭遇了${monsterType}！`,
      completed: false,
      data: { monsterType, theme: themeConfig.id }
    })
    
    // 生成主题特定的非战斗事件
    if (i < floorInfo.enemyCount - 1 && Math.random() < 0.7) {
      const eventType = themeConfig.mechanics.specialEvents[
        Math.floor(Math.random() * themeConfig.mechanics.specialEvents.length)
      ]
      events.push(generateThemeEvent(eventType, floor, themeConfig))
    }
  }
  
  // 添加主题BOSS
  events.push({
    type: 'battle',
    description: `BOSS战：${themeConfig.mechanics.boss}`,
    completed: false,
    data: { isBoss: true, bossType: themeConfig.mechanics.boss }
  })
  
  return events
}
```

### 3. 主题选择UI

#### 3.1 主题选择界面组件
```typescript
// 新增文件：src/renderer/src/views/ThemeSelect.tsx
import { useState, useEffect } from 'react'
import { useGameStore } from '../stores/gameStore'
import { getAvailableThemes, getThemeConfig } from '../../../core/systems/ThemeSystem'
import type { DungeonThemeId, DungeonThemeConfig } from '../../../core/models/DungeonTheme'

export default function ThemeSelect() {
  const { player, navigateTo, startDungeon } = useGameStore()
  const [availableThemes, setAvailableThemes] = useState<DungeonThemeId[]>([])
  const [selectedTheme, setSelectedTheme] = useState<DungeonThemeId>('forest')
  const [themeConfig, setThemeConfig] = useState<DungeonThemeConfig | null>(null)
  
  useEffect(() => {
    const loadThemes = async () => {
      const themes = await getAvailableThemes(player)
      setAvailableThemes(themes)
      if (themes.length > 0) {
        setSelectedTheme(themes[0])
        const config = await getThemeConfig(themes[0])
        setThemeConfig(config)
      }
    }
    loadThemes()
  }, [player])
  
  const handleThemeSelect = async (themeId: DungeonThemeId) => {
    setSelectedTheme(themeId)
    const config = await getThemeConfig(themeId)
    setThemeConfig(config)
  }
  
  const handleStartDungeon = () => {
    startDungeon(1, selectedTheme) // 需要修改 startDungeon 支持主题参数
  }
  
  if (!themeConfig) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>
  }
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-game-accent mb-6">选择地下城主题</h1>
        
        {/* 主题列表 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {availableThemes.map(themeId => (
            <button
              key={themeId}
              onClick={() => handleThemeSelect(themeId)}
              className={`game-panel p-4 text-center transition-all ${
                selectedTheme === themeId 
                  ? 'border-game-accent bg-game-accent/20' 
                  : 'hover:border-game-accent/50'
              }`}
            >
              <div className="text-2xl mb-2">
                {getThemeIcon(themeId)}
              </div>
              <div className="font-bold">
                {getThemeName(themeId)}
              </div>
            </button>
          ))}
        </div>
        
        {/* 主题详情 */}
        <div className="game-panel p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: themeConfig.visual.ambientColor }}>
            {themeConfig.name}
          </h2>
          <p className="text-gray-300 mb-4">{themeConfig.description}</p>
          
          {/* 环境效果 */}
          <div className="mb-4">
            <h3 className="font-bold text-game-accent mb-2">环境效果</h3>
            {themeConfig.mechanics.environmentalEffects.map((effect, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-yellow-400">⚠️</span>
                <span>{effect.description}</span>
              </div>
            ))}
          </div>
          
          {/* 可能遭遇的怪物 */}
          <div className="mb-4">
            <h3 className="font-bold text-game-accent mb-2">可能遭遇的怪物</h3>
            <div className="flex flex-wrap gap-2">
              {themeConfig.mechanics.monsterTypes.map((monster, index) => (
                <span key={index} className="bg-game-bg px-2 py-1 rounded text-sm">
                  {monster}
                </span>
              ))}
            </div>
          </div>
          
          {/* 特殊事件 */}
          <div>
            <h3 className="font-bold text-game-accent mb-2">特殊事件</h3>
            <div className="flex flex-wrap gap-2">
              {themeConfig.mechanics.specialEvents.map((event, index) => (
                <span key={index} className="bg-game-bg px-2 py-1 rounded text-sm">
                  {event}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* 开始按钮 */}
        <div className="text-center">
          <button
            onClick={handleStartDungeon}
            className="game-button text-xl px-8 py-4"
          >
            开始探险
          </button>
        </div>
      </div>
    </div>
  )
}

// 辅助函数
function getThemeIcon(themeId: DungeonThemeId): string {
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

function getThemeName(themeId: DungeonThemeId): string {
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
```

## 第二部分：UI/UX改进方案

### 4. 动画系统优化

#### 4.1 统一动画管理器
```typescript
// 新增文件：src/renderer/src/utils/AnimationManager.ts
type AnimationType = 
  | 'attack' 
  | 'damage' 
  | 'heal' 
  | 'buff' 
  | 'debuff' 
  | 'death' 
  | 'victory'
  | 'theme_transition'

interface AnimationConfig {
  type: AnimationType
  duration: number
  easing: string
  keyframes: Keyframe[]
  onComplete?: () => void
}

interface ActiveAnimation {
  id: string
  config: AnimationConfig
  startTime: number
  element: HTMLElement
}

class AnimationManager {
  private activeAnimations: Map<string, ActiveAnimation> = new Map()
  private animationId = 0
  
  // 播放动画
  play(
    element: HTMLElement, 
    config: AnimationConfig
  ): string {
    const id = `anim_${++this.animationId}`
    
    const animation = element.animate(config.keyframes, {
      duration: config.duration,
      easing: config.easing,
      fill: 'forwards'
    })
    
    const activeAnimation: ActiveAnimation = {
      id,
      config,
      startTime: Date.now(),
      element
    }
    
    this.activeAnimations.set(id, activeAnimation)
    
    animation.onfinish = () => {
      this.activeAnimations.delete(id)
      config.onComplete?.()
    }
    
    return id
  }
  
  // 停止动画
  stop(id: string): void {
    const animation = this.activeAnimations.get(id)
    if (animation) {
      // 停止动画逻辑
      this.activeAnimations.delete(id)
    }
  }
  
  // 停止所有动画
  stopAll(): void {
    this.activeAnimations.clear()
  }
  
  // 预定义动画
  static animations = {
    attackRight: {
      type: 'attack',
      duration: 500,
      easing: 'ease-out',
      keyframes: [
        { transform: 'translateX(-100px) scale(0.5)', opacity: 0 },
        { transform: 'translateX(0) scale(1.2)', opacity: 1 },
        { transform: 'translateX(100px) scale(1)', opacity: 0 }
      ]
    },
    
    attackLeft: {
      type: 'attack',
      duration: 500,
      easing: 'ease-out',
      keyframes: [
        { transform: 'translateX(100px) scale(0.5)', opacity: 0 },
        { transform: 'translateX(0) scale(1.2)', opacity: 1 },
        { transform: 'translateX(-100px) scale(1)', opacity: 0 }
      ]
    },
    
    damageFloat: {
      type: 'damage',
      duration: 1000,
      easing: 'ease-out',
      keyframes: [
        { transform: 'translateY(0) scale(1)', opacity: 1 },
        { transform: 'translateY(-50px) scale(1.2)', opacity: 0 }
      ]
    },
    
    shake: {
      type: 'damage',
      duration: 300,
      easing: 'ease-in-out',
      keyframes: [
        { transform: 'translateX(0)' },
        { transform: 'translateX(-5px)' },
        { transform: 'translateX(5px)' },
        { transform: 'translateX(0)' }
      ]
    },
    
    heal: {
      type: 'heal',
      duration: 800,
      easing: 'ease-out',
      keyframes: [
        { transform: 'scale(1)', boxShadow: '0 0 0 rgba(46, 204, 113, 0)' },
        { transform: 'scale(1.1)', boxShadow: '0 0 20px rgba(46, 204, 113, 0.8)' },
        { transform: 'scale(1)', boxShadow: '0 0 0 rgba(46, 204, 113, 0)' }
      ]
    },
    
    themeTransition: {
      type: 'theme_transition',
      duration: 1000,
      easing: 'ease-in-out',
      keyframes: [
        { opacity: 1 },
        { opacity: 0 },
        { opacity: 1 }
      ]
    }
  }
}

export const animationManager = new AnimationManager()
```

#### 4.2 在组件中使用动画管理器
```typescript
// 修改 Battle.tsx 中的动画组件
import { animationManager } from '../utils/AnimationManager'

function AttackAnimation({ 
  isActive, 
  direction 
}: { 
  isActive: boolean
  direction: 'left' | 'right'
}) {
  const animationRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (isActive && animationRef.current) {
      const config = direction === 'right' 
        ? AnimationManager.animations.attackRight
        : AnimationManager.animations.attackLeft
        
      animationManager.play(animationRef.current, config)
    }
  }, [isActive, direction])
  
  if (!isActive) return null
  
  return (
    <div 
      ref={animationRef}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
    >
      <div className="text-6xl font-bold text-yellow-400 drop-shadow-lg">
        {direction === 'right' ? '⚔️' : '💥'}
      </div>
    </div>
  )
}
```

### 5. 响应式设计改进

#### 5.1 移动端适配配置
```typescript
// 新增文件：src/renderer/src/utils/responsive.ts
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
}

export function isMobile(): boolean {
  return window.innerWidth < breakpoints.md
}

export function isTablet(): boolean {
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg
}

export function isDesktop(): boolean {
  return window.innerWidth >= breakpoints.lg
}

// 响应式类名生成器
export function responsiveClass(
  mobile: string,
  tablet?: string,
  desktop?: string
): string {
  const classes = [mobile]
  
  if (tablet) {
    classes.push(`md:${tablet}`)
  }
  
  if (desktop) {
    classes.push(`lg:${desktop}`)
  }
  
  return classes.join(' ')
}

// 触摸设备检测
export function isTouchDevice(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}
```

#### 5.2 响应式布局组件
```typescript
// 新增文件：src/renderer/src/components/ResponsiveLayout.tsx
import { ReactNode } from 'react'
import { isMobile, isTablet, responsiveClass } from '../utils/responsive'

interface ResponsiveLayoutProps {
  children: ReactNode
  className?: string
}

export function ResponsiveLayout({ children, className = '' }: ResponsiveLayoutProps) {
  return (
    <div className={`min-h-screen ${responsiveClass('p-2', 'p-4', 'p-6')} ${className}`}>
      {children}
    </div>
  )
}

export function ResponsiveGrid({ 
  children, 
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = 'gap-4'
}: {
  children: ReactNode
  cols?: { mobile: number; tablet: number; desktop: number }
  gap?: string
}) {
  const gridClass = responsiveClass(
    `grid grid-cols-${cols.mobile}`,
    `md:grid-cols-${cols.tablet}`,
    `lg:grid-cols-${cols.desktop}`
  )
  
  return (
    <div className={`${gridClass} ${gap}`}>
      {children}
    </div>
  )
}

export function ResponsiveText({
  children,
  size = { mobile: 'text-sm', tablet: 'text-base', desktop: 'text-lg' }
}: {
  children: ReactNode
  size?: { mobile: string; tablet: string; desktop: string }
}) {
  const textClass = responsiveClass(size.mobile, size.tablet, size.desktop)
  
  return (
    <span className={textClass}>
      {children}
    </span>
  )
}
```

### 6. 音效与音乐系统

#### 6.1 音频管理器
```typescript
// 新增文件：src/renderer/src/utils/AudioManager.ts
interface AudioConfig {
  volume: number
  loop: boolean
  fadeIn?: number
  fadeOut?: number
}

interface PlayingAudio {
  id: string
  audio: HTMLAudioElement
  config: AudioConfig
  type: 'bgm' | 'sfx' | 'ambient'
}

class AudioManager {
  private audioContext: AudioContext | null = null
  private playingAudio: Map<string, PlayingAudio> = new Map()
  private masterVolume = 1.0
  private bgmVolume = 0.7
  private sfxVolume = 1.0
  
  constructor() {
    this.initAudioContext()
  }
  
  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    } catch (error) {
      console.warn('AudioContext not supported:', error)
    }
  }
  
  // 播放背景音乐
  playBGM(src: string, config: Partial<AudioConfig> = {}): string {
    return this.playAudio(src, {
      volume: this.bgmVolume,
      loop: true,
      fadeIn: 1000,
      ...config
    }, 'bgm')
  }
  
  // 播放音效
  playSFX(src: string, config: Partial<AudioConfig> = {}): string {
    return this.playAudio(src, {
      volume: this.sfxVolume,
      loop: false,
      ...config
    }, 'sfx')
  }
  
  // 播放环境音效
  playAmbient(src: string, config: Partial<AudioConfig> = {}): string {
    return this.playAudio(src, {
      volume: this.sfxVolume * 0.5,
      loop: true,
      fadeIn: 500,
      ...config
    }, 'ambient')
  }
  
  private playAudio(
    src: string, 
    config: AudioConfig,
    type: 'bgm' | 'sfx' | 'ambient'
  ): string {
    const id = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const audio = new Audio(src)
    audio.volume = config.volume * this.masterVolume
    audio.loop = config.loop
    
    if (config.fadeIn) {
      audio.volume = 0
      const fadeInInterval = setInterval(() => {
        if (audio.volume < config.volume * this.masterVolume) {
          audio.volume = Math.min(
            audio.volume + 0.05,
            config.volume * this.masterVolume
          )
        } else {
          clearInterval(fadeInInterval)
        }
      }, config.fadeIn / 20)
    }
    
    audio.play().catch(error => {
      console.warn('Audio play failed:', error)
    })
    
    const playingAudio: PlayingAudio = {
      id,
      audio,
      config,
      type
    }
    
    this.playingAudio.set(id, playingAudio)
    
    audio.onended = () => {
      this.playingAudio.delete(id)
    }
    
    return id
  }
  
  // 停止音频
  stop(id: string, fadeOut?: number): void {
    const playing = this.playingAudio.get(id)
    if (!playing) return
    
    if (fadeOut) {
      const originalVolume = playing.audio.volume
      const fadeOutInterval = setInterval(() => {
        if (playing.audio.volume > 0.05) {
          playing.audio.volume -= 0.05
        } else {
          clearInterval(fadeOutInterval)
          playing.audio.pause()
          this.playingAudio.delete(id)
        }
      }, fadeOut / 20)
    } else {
      playing.audio.pause()
      this.playingAudio.delete(id)
    }
  }
  
  // 停止所有BGM
  stopAllBGM(fadeOut?: number): void {
    for (const [id, playing] of this.playingAudio) {
      if (playing.type === 'bgm') {
        this.stop(id, fadeOut)
      }
    }
  }
  
  // 设置主音量
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume))
    this.updateAllVolumes()
  }
  
  // 设置BGM音量
  setBGMVolume(volume: number): void {
    this.bgmVolume = Math.max(0, Math.min(1, volume))
    this.updateVolumesByType('bgm')
  }
  
  // 设置音效音量
  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume))
    this.updateVolumesByType('sfx')
    this.updateVolumesByType('ambient')
  }
  
  private updateAllVolumes(): void {
    for (const playing of this.playingAudio.values()) {
      const baseVolume = playing.type === 'bgm' ? this.bgmVolume : this.sfxVolume
      playing.audio.volume = baseVolume * this.masterVolume
    }
  }
  
  private updateVolumesByType(type: 'bgm' | 'sfx' | 'ambient'): void {
    for (const playing of this.playingAudio.values()) {
      if (playing.type === type) {
        const baseVolume = type === 'bgm' ? this.bgmVolume : this.sfxVolume
        playing.audio.volume = baseVolume * this.masterVolume
      }
    }
  }
}

export const audioManager = new AudioManager()
```

#### 6.2 音频集成到游戏
```typescript
// 修改 gameStore.ts，添加音频管理
import { audioManager } from '../renderer/src/utils/AudioManager'

// 在游戏状态中添加音频配置
interface GameStore extends GameState {
  // ... 现有字段
  audioConfig: {
    bgmVolume: number
    sfxVolume: number
    masterVolume: number
  }
}

// 在游戏初始化时播放主题音乐
const playThemeMusic = async (themeId: DungeonThemeId) => {
  const themeConfig = await getThemeConfig(themeId)
  audioManager.stopAllBGM(1000) // 淡出当前BGM
  audioManager.playBGM(themeConfig.audio.bgm, { fadeIn: 2000 })
  audioManager.playAmbient(themeConfig.audio.ambient)
}

// 在战斗开始时播放战斗音乐
const playBattleMusic = async (themeId: DungeonThemeId) => {
  const themeConfig = await getThemeConfig(themeId)
  audioManager.stopAllBGM(500)
  if (themeConfig.audio.battleBgm) {
    audioManager.playBGM(themeConfig.audio.battleBgm, { fadeIn: 500 })
  }
}
```

### 7. 用户界面改进

#### 7.1 主题化的UI组件
```typescript
// 新增文件：src/renderer/src/components/ThemeAwareUI.tsx
import { ReactNode } from 'react'
import { DungeonThemeId } from '../../../core/models/DungeonTheme'

interface ThemeAwareUIProps {
  theme: DungeonThemeId
  children: ReactNode
}

export function ThemeAwarePanel({ theme, children }: ThemeAwareUIProps) {
  const themeStyles = getThemeStyles(theme)
  
  return (
    <div 
      className="game-panel"
      style={{
        borderColor: themeStyles.borderColor,
        background: themeStyles.panelBackground
      }}
    >
      {children}
    </div>
  )
}

export function ThemeAwareButton({ 
  theme, 
  children, 
  variant = 'primary',
  ...props 
}: {
  theme: DungeonThemeId
  children: ReactNode
  variant?: 'primary' | 'secondary'
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const themeStyles = getThemeStyles(theme)
  
  const baseClass = variant === 'primary' ? 'game-button' : 'game-button-secondary'
  
  return (
    <button
      className={baseClass}
      style={{
        backgroundColor: variant === 'primary' ? themeStyles.primaryColor : undefined,
        borderColor: variant === 'secondary' ? themeStyles.borderColor : undefined
      }}
      {...props}
    >
      {children}
    </button>
  )
}

function getThemeStyles(theme: DungeonThemeId) {
  const styles: Record<DungeonThemeId, any> = {
    forest: {
      primaryColor: '#2d5a2d',
      borderColor: '#4a7c4a',
      panelBackground: 'rgba(45, 90, 45, 0.2)'
    },
    volcano: {
      primaryColor: '#8b0000',
      borderColor: '#ff4500',
      panelBackground: 'rgba(139, 0, 0, 0.2)'
    },
    ice_cave: {
      primaryColor: '#4682b4',
      borderColor: '#87ceeb',
      panelBackground: 'rgba(70, 130, 180, 0.2)'
    },
    ruins: {
      primaryColor: '#8b7355',
      borderColor: '#d2b48c',
      panelBackground: 'rgba(139, 115, 85, 0.2)'
    },
    tomb: {
      primaryColor: '#696969',
      borderColor: '#a9a9a9',
      panelBackground: 'rgba(105, 105, 105, 0.2)'
    },
    sewer: {
      primaryColor: '#556b2f',
      borderColor: '#6b8e23',
      panelBackground: 'rgba(85, 107, 47, 0.2)'
    },
    castle: {
      primaryColor: '#483d8b',
      borderColor: '#6a5acd',
      panelBackground: 'rgba(72, 61, 139, 0.2)'
    },
    mine: {
      primaryColor: '#8b4513',
      borderColor: '#d2691e',
      panelBackground: 'rgba(139, 69, 19, 0.2)'
    }
  }
  
  return styles[forest] // 默认主题
}
```

#### 7.2 改进的地下城探索界面
```typescript
// 修改 Dungeon.tsx，添加主题感知UI
import { ThemeAwarePanel, ThemeAwareButton } from '../components/ThemeAwareUI'
import { getThemeConfig } from '../../../core/systems/ThemeSystem'

export default function Dungeon() {
  const { dungeonRun, ... } = useGameStore()
  const [themeConfig, setThemeConfig] = useState<DungeonThemeConfig | null>(null)
  
  useEffect(() => {
    if (dungeonRun?.theme) {
      getThemeConfig(dungeonRun.theme).then(setThemeConfig)
    }
  }, [dungeonRun?.theme])
  
  // 应用主题背景
  const backgroundStyle = themeConfig ? {
    background: themeConfig.visual.background
  } : {}
  
  return (
    <div 
      className="min-h-screen p-4"
      style={backgroundStyle}
    >
      {/* 主题信息头部 */}
      {themeConfig && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2" style={{ color: themeConfig.visual.ambientColor }}>
            {themeConfig.name}
          </h2>
          <p className="text-sm text-gray-400">
            {themeConfig.description}
          </p>
        </div>
      )}
      
      {/* 事件列表，使用主题感知UI */}
      <ThemeAwarePanel theme={dungeonRun?.theme || 'forest'}>
        {/* 事件内容 */}
      </ThemeAwarePanel>
      
      {/* 操作按钮，使用主题感知UI */}
      <div className="mt-6 text-center">
        <ThemeAwareButton 
          theme={dungeonRun?.theme || 'forest'}
          onClick={handleAbandon}
        >
          放弃探险
        </ThemeAwareButton>
      </div>
    </div>
  )
}
```

## 第三部分：实施计划

### 8. 实施阶段

#### 阶段1：基础框架（2-3周）
1. 创建主题数据结构
2. 实现主题配置加载
3. 修改DungeonRun支持主题
4. 创建主题选择界面

#### 阶段2：视觉实现（3-4周）
1. 实现主题背景系统
2. 添加主题特定的视觉效果
3. 创建主题感知UI组件
4. 实现主题切换动画

#### 阶段3：音频集成（2-3周）
1. 实现音频管理器
2. 添加主题音乐和音效
3. 集成音频到游戏流程
4. 添加音量控制界面

#### 阶段4：UI/UX优化（3-4周）
1. 实现响应式布局
2. 优化动画系统
3. 改进移动端体验
4. 添加用户设置界面

#### 阶段5：测试与平衡（2-3周）
1. 测试所有主题
2. 平衡游戏机制
3. 性能优化
4. 用户反馈收集

### 9. 技术注意事项

1. **性能优化**：主题切换时注意资源加载和释放
2. **内存管理**：音频和图像资源需要合理管理
3. **兼容性**：确保在不同设备和浏览器上正常工作
4. **可扩展性**：设计易于添加新主题的架构
5. **本地化**：支持多语言文本和音频

### 10. 优先级建议

1. **主题选择界面**（用户首先接触）
2. **主题背景系统**（视觉差异化）
3. **主题音乐**（听觉沉浸感）
4. **响应式设计**（移动端体验）
5. **动画优化**（操作反馈）

此方案可根据开发资源和时间逐步实施，建议从主题选择界面和背景系统开始，快速提升游戏视觉体验。