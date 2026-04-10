import { useGameStore } from '../stores/gameStore'
import type { GameState } from '../../../core/systems/TimeSystem'

export default function MainMenu() {
  const { newGame, navigateTo, loadGame } = useGameStore()

  const handleLoadGame = async () => {
    // 检查是否在 Electron 环境中
    if (!window.electronAPI) {
      console.log('非 Electron 环境，无法加载存档')
      alert('请在 Electron 环境中运行以使用存档功能')
      return
    }

    const result = await window.electronAPI.loadGame()
    if (result.success && result.data) {
      loadGame(result.data as GameState)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-game-bg to-game-bg-secondary">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 text-shadow">
          <span className="text-game-accent">关于负债</span>
          <br />
          <span className="text-white">不得不在地下城打工这件事</span>
        </h1>
        <p className="text-xl text-gray-400 mt-6">Debt & Dungeon: A Working Story</p>
      </div>

      <div className="flex flex-col gap-4 w-80">
        <button
          onClick={newGame}
          className="game-button text-xl py-4"
        >
          开始新游戏
        </button>
        
        <button
          onClick={handleLoadGame}
          className="game-button-secondary text-xl py-4"
          disabled={!window.electronAPI}
        >
          继续游戏
        </button>
        
        <button
          onClick={() => navigateTo('town')}
          className="game-button-secondary text-xl py-4"
        >
          测试模式
        </button>
      </div>

      <div className="mt-12 text-sm text-gray-500">
        <p>使用 Electron + React + TypeScript 构建</p>
        <p>v1.0.0</p>
      </div>
    </div>
  )
}
