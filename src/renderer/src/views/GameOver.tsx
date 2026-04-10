import { useGameStore } from '../stores/gameStore'
import { getEndingText } from '../../../core/systems/TimeSystem'

export default function GameOver() {
  const { ending, player, newGame, navigateTo } = useGameStore()

  if (!ending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-gray-400">加载中...</div>
      </div>
    )
  }

  const endingInfo = getEndingText(ending)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-game-bg to-game-bg-secondary p-6">
      <div className="game-panel max-w-2xl w-full text-center">
        {/* 结局图标 */}
        <div className="text-8xl mb-6">
          {ending === 'perfect' && '🏆'}
          {ending === 'normal' && '✨'}
          {ending === 'bad' && '💀'}
        </div>

        {/* 结局标题 */}
        <h1 className="text-3xl font-bold mb-4 text-game-accent">
          {endingInfo.title}
        </h1>

        {/* 结局描述 */}
        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          {endingInfo.description}
        </p>

        {/* 最终统计 */}
        <div className="bg-game-bg p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">最终统计</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-gray-400 text-sm">最终等级</div>
              <div className="text-2xl font-bold text-game-accent">Lv.{player.level}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">剩余金币</div>
              <div className="text-2xl font-bold text-game-gold">{player.gold.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">总天数</div>
              <div className="text-2xl font-bold">{player.day} / 100</div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4">
          <button
            onClick={newGame}
            className="game-button text-xl px-8 py-4"
          >
            再玩一次
          </button>
          <button
            onClick={() => navigateTo('main_menu')}
            className="game-button-secondary text-xl px-8 py-4"
          >
            返回主菜单
          </button>
        </div>
      </div>
    </div>
  )
}
