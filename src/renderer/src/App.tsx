import { useEffect } from 'react'
import { useGameStore } from './stores/gameStore'
import MainMenu from './views/MainMenu'
import Town from './views/Town'
import DungeonSelect from './views/DungeonSelect'
import ThemeSelect from './views/ThemeSelect'
import Dungeon from './views/Dungeon'
import Battle from './views/Battle'
import Shop from './views/Shop'
import Settlement from './views/Settlement'
import GameOver from './views/GameOver'
import StoryView from './views/StoryView'

function App() {
  const { currentView, loadGame } = useGameStore()

  useEffect(() => {
    // 检查是否在 Electron 环境中
    if (!window.electronAPI) {
      console.log('非 Electron 环境，跳过菜单事件监听')
      return
    }

    // 监听菜单事件
    const unsubscribeNewGame = window.electronAPI.onMenuNewGame(() => {
      useGameStore.getState().newGame()
    })
    
    const unsubscribeSave = window.electronAPI.onMenuSave(() => {
      useGameStore.getState().saveGame()
    })
    
    const unsubscribeLoad = window.electronAPI.onMenuLoad(async () => {
      const result = await window.electronAPI.loadGame()
      if (result.success && result.data) {
        loadGame(result.data as Parameters<typeof loadGame>[0])
      }
    })

    return () => {
      unsubscribeNewGame()
      unsubscribeSave()
      unsubscribeLoad()
    }
  }, [loadGame])

  return (
    <div className="min-h-screen bg-game-bg text-game-text">
      {currentView === 'main_menu' && <MainMenu />}
      {currentView === 'town' && <Town />}
      {currentView === 'dungeon_select' && <DungeonSelect />}
      {currentView === 'theme_select' && <ThemeSelect />}
      {currentView === 'dungeon' && <Dungeon />}
      {currentView === 'battle' && <Battle />}
      {currentView === 'shop' && <Shop />}
      {currentView === 'settlement' && <Settlement />}
      {currentView === 'game_over' && <GameOver />}
      {currentView === 'story' && <StoryView />}
    </div>
  )
}

export default App
