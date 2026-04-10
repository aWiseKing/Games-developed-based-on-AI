import { useState, useEffect } from 'react'
import { useGameStore } from '../stores/gameStore'
import { getAvailableThemes, getThemeConfig, getThemeIcon, getThemeName } from '../../../core/systems/ThemeSystem'
import type { DungeonThemeId, DungeonThemeConfig } from '../../../core/models/DungeonTheme'

export default function ThemeSelect() {
  const { player, navigateTo, startDungeon } = useGameStore()
  const [availableThemes, setAvailableThemes] = useState<DungeonThemeId[]>([])
  const [selectedTheme, setSelectedTheme] = useState<DungeonThemeId>('forest')
  const [themeConfig, setThemeConfig] = useState<DungeonThemeConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [showFloorSelect, setShowFloorSelect] = useState(false)
  
  useEffect(() => {
    const loadThemes = async () => {
      try {
        const themes = await getAvailableThemes(player)
        setAvailableThemes(themes)
        if (themes.length > 0) {
          setSelectedTheme(themes[0])
          const config = await getThemeConfig(themes[0])
          setThemeConfig(config)
        }
      } catch (error) {
        console.error('Failed to load themes:', error)
      } finally {
        setLoading(false)
      }
    }
    loadThemes()
  }, [player])
  
  const handleThemeSelect = async (themeId: DungeonThemeId) => {
    setSelectedTheme(themeId)
    try {
      const config = await getThemeConfig(themeId)
      setThemeConfig(config)
    } catch (error) {
      console.error('Failed to load theme config:', error)
    }
  }
  
  const handleStartDungeon = (floor: number) => {
    startDungeon(floor, selectedTheme)
  }
  
  // 生成可选择的层数列表（1到最高解锁层数）
  const getAvailableFloors = () => {
    const maxFloor = Math.min(10, player.highestFloor + 1)
    return Array.from({ length: maxFloor }, (_, i) => i + 1)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-400">加载主题中...</div>
      </div>
    )
  }
  
  if (!themeConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-400">没有可用的主题</div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-game-accent">🗺️ 选择地下城主题</h1>
          <button
            onClick={() => navigateTo('town')}
            className="game-button-secondary"
          >
            返回城镇
          </button>
        </div>
        
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
              <div className="text-3xl mb-2">
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
              <div key={index} className="flex items-center gap-2 text-sm mb-1">
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
          <div className="mb-4">
            <h3 className="font-bold text-game-accent mb-2">特殊事件</h3>
            <div className="flex flex-wrap gap-2">
              {themeConfig.mechanics.specialEvents.map((event, index) => (
                <span key={index} className="bg-game-bg px-2 py-1 rounded text-sm">
                  {event}
                </span>
              ))}
            </div>
          </div>
          
          {/* 解锁条件 */}
          {themeConfig.unlockCondition?.floorReached && (
            <div className="mt-4 p-3 bg-game-bg rounded">
              <div className="text-sm text-gray-400">
                解锁条件：达到地下城第 {themeConfig.unlockCondition.floorReached} 层
              </div>
            </div>
          )}
        </div>
        
        {/* 层数选择或开始按钮 */}
        {!showFloorSelect ? (
          <div className="text-center">
            <button
              onClick={() => setShowFloorSelect(true)}
              className="game-button text-xl px-8 py-4"
            >
              选择层数开始探险
            </button>
            <div className="mt-4 text-sm text-gray-400">
              已解锁 {player.highestFloor > 0 ? `1-${Math.min(10, player.highestFloor + 1)}` : '第1'} 层
            </div>
          </div>
        ) : (
          <div className="game-panel p-6">
            <h3 className="text-xl font-bold mb-4 text-game-accent">选择探险层数</h3>
            <div className="grid grid-cols-5 gap-3">
              {getAvailableFloors().map(floor => (
                <button
                  key={floor}
                  onClick={() => handleStartDungeon(floor)}
                  className="game-panel p-3 text-center hover:border-game-accent transition-all"
                >
                  <div className="text-2xl font-bold">{floor}F</div>
                  <div className="text-xs text-gray-400 mt-1">
                    {floor <= 3 ? '简单' : floor <= 6 ? '普通' : floor <= 8 ? '困难' : '极难'}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowFloorSelect(false)}
                className="game-button-secondary px-6 py-2"
              >
                返回
              </button>
            </div>
          </div>
        )}
        
        {/* 提示信息 */}
        <div className="mt-8 game-panel">
          <h3 className="text-lg font-bold mb-3 text-game-accent">💡 主题说明</h3>
          <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
            <li>不同主题有不同的环境效果，会影响战斗和探索</li>
            <li>主题会影响出现的怪物类型和特殊事件</li>
            <li>部分主题需要达到特定层数才能解锁</li>
            <li>主题会影响地下城的视觉效果和背景音乐</li>
            <li>完成地下城层数可解锁更高层</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
