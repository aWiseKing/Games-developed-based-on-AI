import { useGameStore } from '../stores/gameStore'
import { getCurrentEvent, getCurrentMonster } from '../../../core/systems/DungeonSystem'
import { getThemeConfig } from '../../../core/systems/ThemeSystem'
import type { DungeonThemeConfig } from '../../../core/models/DungeonTheme'
import { useEffect, useState } from 'react'

export default function Dungeon() {
  const {
    dungeonRun,
    battleState,
    startBattle,
    abandonDungeon,
    completeDungeon,
    processDungeonEvent,
    navigateTo,
  } = useGameStore()

  const [processing, setProcessing] = useState(false)
  const [themeConfig, setThemeConfig] = useState<DungeonThemeConfig | null>(null)

  useEffect(() => {
    if (dungeonRun?.theme) {
      getThemeConfig(dungeonRun.theme).then(setThemeConfig)
    }
  }, [dungeonRun?.theme])

  useEffect(() => {
    if (!dungeonRun || dungeonRun.isFinished) return

    const event = getCurrentEvent(dungeonRun)
    if (!event) {
      // 所有事件完成
      completeDungeon()
      return
    }

    // 移除自动开始战斗逻辑，改为手动点击开始
  }, [dungeonRun, completeDungeon])

  if (!dungeonRun) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-400">加载中...</div>
      </div>
    )
  }

  const currentEvent = getCurrentEvent(dungeonRun)
  const progress = (dungeonRun.currentEventIndex / dungeonRun.events.length) * 100

  const handleProcessEvent = async () => {
    if (!currentEvent || currentEvent.type === 'battle' || processing) return
    
    setProcessing(true)
    processDungeonEvent()
    setProcessing(false)
  }

  const handleAbandon = () => {
    abandonDungeon()
  }

  // 如果正在战斗中，显示提示并等待战斗页面加载
  if (battleState && !battleState.isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-game-accent mb-4">⚔️ 进入战斗...</div>
          <div className="text-gray-400">{battleState.monster.name}</div>
        </div>
      </div>
    )
  }

  if (dungeonRun.isFinished) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center">
        <div className="game-panel max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold text-game-accent mb-6">
            🏆 探险完成！
          </h1>
          
          <div className="bg-game-bg p-4 rounded mb-6">
            <h2 className="text-xl font-bold mb-4">本次探险收获</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>经验值</span>
                <span className="text-blue-400">+{dungeonRun.rewards.totalExp}</span>
              </div>
              <div className="flex justify-between">
                <span>金币</span>
                <span className="text-game-gold">+{dungeonRun.rewards.totalGold}</span>
              </div>
              <div className="flex justify-between">
                <span>物品</span>
                <span>{dungeonRun.rewards.items.length} 件</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigateTo('town')}
            className="game-button text-xl px-8"
          >
            返回城镇
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen p-6"
      style={{ 
        background: themeConfig?.visual.background || 'linear-gradient(to bottom, #1a1a2e, #16213e)'
      }}
    >
      {/* 主题信息头部 */}
      {themeConfig && (
        <div className="mb-6 game-panel p-4" style={{ borderColor: themeConfig.visual.ambientColor }}>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{themeConfig.visual.icon}</span>
            <div>
              <h2 className="text-xl font-bold" style={{ color: themeConfig.visual.ambientColor }}>
                {themeConfig.nameZh}
              </h2>
              <p className="text-sm text-gray-400">{themeConfig.description}</p>
            </div>
          </div>
          
          {/* 环境效果提示 */}
          {themeConfig.mechanics.environmentalEffects.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {themeConfig.mechanics.environmentalEffects.map((effect, index) => (
                <span 
                  key={index}
                  className="text-xs px-2 py-1 rounded bg-red-900/30 text-yellow-400 border border-yellow-400/30"
                >
                  ⚠️ {effect.description}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 头部信息 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-game-accent">
            地下城第 {dungeonRun.floor} 层
          </h1>
          <div className="text-sm text-gray-400">
            进度: {dungeonRun.currentEventIndex + 1} / {dungeonRun.events.length}
          </div>
        </div>
        <button
          onClick={handleAbandon}
          className="game-button-secondary"
        >
          撤退
        </button>
      </div>

      {/* 进度条 */}
      <div className="stat-bar mb-8">
        <div
          className="stat-bar-fill bg-game-accent"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 事件列表 */}
      <div className="game-panel max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-game-accent">探险进程</h2>
        
        <div className="space-y-2">
          {dungeonRun.events.map((event, index) => {
            const isCurrent = index === dungeonRun.currentEventIndex
            const isPast = index < dungeonRun.currentEventIndex

            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 rounded ${
                  isCurrent ? 'bg-game-accent/20 border border-game-accent' :
                  isPast ? 'bg-game-bg opacity-50' :
                  'bg-game-bg opacity-30'
                }`}
              >
                <div className="text-2xl">
                  {event.type === 'battle' && '⚔️'}
                  {event.type === 'treasure' && '💎'}
                  {event.type === 'trap' && '⚠️'}
                  {event.type === 'heal' && '💚'}
                  {event.type === 'empty' && '⚪'}
                  {event.type === 'puzzle' && '🧩'}
                  {event.type === 'merchant' && '🛒'}
                  {event.type === 'quest_npc' && '👤'}
                  {event.type === 'hidden_room' && '🚪'}
                  {event.type === 'portal' && '🌀'}
                  {event.type === 'shrine' && '⛩️'}
                  {event.type === 'camp' && '🏕️'}
                  {event.type === 'gambling' && '🎰'}
                  {event.type === 'skill_book' && '📖'}
                  {event.type === 'equipment' && '🛡️'}
                </div>
                <div className="flex-1">
                  <div className="font-bold">
                    {event.type === 'battle' && (index === dungeonRun.events.length - 1 ? 'BOSS 战' : '战斗')}
                    {event.type === 'treasure' && '宝箱'}
                    {event.type === 'trap' && '陷阱'}
                    {event.type === 'heal' && '回复之泉'}
                    {event.type === 'empty' && '空房间'}
                    {event.type === 'puzzle' && '谜题'}
                    {event.type === 'merchant' && '商人'}
                    {event.type === 'quest_npc' && '任务NPC'}
                    {event.type === 'hidden_room' && '隐藏房间'}
                    {event.type === 'portal' && '传送门'}
                    {event.type === 'shrine' && '神坛'}
                    {event.type === 'camp' && '营地'}
                    {event.type === 'gambling' && '赌博'}
                    {event.type === 'skill_book' && '技能书'}
                    {event.type === 'equipment' && '装备'}
                  </div>
                  <div className="text-sm text-gray-500">{event.description}</div>
                </div>
                {isCurrent && (
                  <div className="text-game-accent font-bold">当前</div>
                )}
                {isPast && (
                  <div className="text-green-400">✓ 完成</div>
                )}
              </div>
            )
          })}
        </div>

        {/* 非战斗事件的处理按钮 */}
        {currentEvent && currentEvent.type !== 'battle' && (
          <div className="mt-6 text-center">
            <button
              onClick={handleProcessEvent}
              disabled={processing}
              className="game-button text-xl px-8 disabled:opacity-50"
            >
              {processing ? '处理中...' : '继续'}
            </button>
          </div>
        )}

        {/* 战斗事件按钮 */}
        {currentEvent && currentEvent.type === 'battle' && !battleState && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                const monster = getCurrentMonster(dungeonRun)
                startBattle(monster)
                navigateTo('battle')
              }}
              className="game-button text-xl px-8"
            >
              开始战斗
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
