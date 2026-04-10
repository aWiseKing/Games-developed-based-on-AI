import { useGameStore } from '../stores/gameStore'
import { DUNGEON_FLOORS } from '../../../core/systems/DungeonSystem'

export default function DungeonSelect() {
  const { startDungeon, navigateTo, player } = useGameStore()

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-game-accent">⚔️ 选择探险层数</h1>
            <p className="text-sm text-gray-400 mt-1">或者直接选择主题进行探险</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigateTo('theme_select')}
              className="game-button"
            >
              🗺️ 选择主题
            </button>
            <button
              onClick={() => navigateTo('town')}
              className="game-button-secondary"
            >
              返回城镇
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {DUNGEON_FLOORS.map((floor) => {
            const isLocked = floor.floor > player.highestFloor + 1
            const difficulty = floor.floor <= 3 ? '简单' : floor.floor <= 6 ? '普通' : floor.floor <= 8 ? '困难' : '极难'
            const difficultyColor = floor.floor <= 3 ? 'text-green-400' : floor.floor <= 6 ? 'text-yellow-400' : floor.floor <= 8 ? 'text-orange-400' : 'text-red-400'

            return (
              <button
                key={floor.floor}
                onClick={() => startDungeon(floor.floor)}
                disabled={isLocked}
                className={`game-panel p-4 text-left transition-all hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed ${
                  isLocked ? '' : 'hover:border-game-accent cursor-pointer'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-2xl font-bold">{floor.floor}F</span>
                  {isLocked && <span className="text-2xl">🔒</span>}
                </div>
                <div className="text-sm text-gray-400 mb-1">{floor.name}</div>
                <div className={`text-xs ${difficultyColor}`}>{difficulty}</div>
                {!isLocked && (
                  <div className="mt-3 text-xs text-gray-500">
                    预计 {floor.enemyCount} 场战斗
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="mt-8 game-panel">
          <h3 className="text-lg font-bold mb-3 text-game-accent">⚠️ 探险提示</h3>
          <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
            <li>地下城层数越高，敌人越强，奖励也越丰厚</li>
            <li>每场战斗消耗 HP，请合理评估自身实力</li>
            <li>可以随时撤退，保留已获得的奖励</li>
            <li>每层的最后一场是 BOSS 战</li>
            <li>完成当前层可解锁下一层</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
