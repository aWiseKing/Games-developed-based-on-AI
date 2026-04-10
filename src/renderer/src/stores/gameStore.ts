import { create } from 'zustand'
import type { GameState } from '../../../core/systems/TimeSystem'
import { initGame, endDay, restAtCamp, consumeAction } from '../../../core/systems/TimeSystem'
import type { DungeonRun } from '../../../core/systems/DungeonSystem'
import { startDungeonRun, abandonDungeon, processEvent } from '../../../core/systems/DungeonSystem'
import type { DungeonThemeId } from '../../../core/models/DungeonTheme'
import type { BattleState } from '../../../core/systems/BattleSystem'
import { initBattle, playerAction, monsterTurn } from '../../../core/systems/BattleSystem'
import type { ShopItem } from '../../../core/systems/EconomySystem'
import { generateShopItems, makePayment, buyItem, sellItem, calculatePayment } from '../../../core/systems/EconomySystem'
import type { Monster } from '../../../core/models/Monster'
import type { Equipment } from '../../../core/models/Equipment'
import type { Item } from '../../../core/models/Item'
import type { StoryState, StoryNode, StoryChoice, StoryEffect } from '../../../core/systems/StorySystem'
import { createDefaultStoryState, canTriggerNode, completeNode, advanceDay as advanceStoryDay } from '../../../core/systems/StorySystem'
import type { NPCId } from '../../../core/models/NPC'
import { allStoryNodes, storyNodeMap } from '../../../core/data/stories'

interface GameStore extends GameState {
  // 游戏流程状态
  currentView: 'main_menu' | 'town' | 'dungeon_select' | 'theme_select' | 'dungeon' | 'battle' | 'shop' | 'camp' | 'settlement' | 'game_over' | 'story'
  
  // 地下城状态
  dungeonRun: DungeonRun | null
  
  // 战斗状态
  battleState: BattleState | null
  
  // 商店状态
  shopItems: ShopItem[]
  
  // 故事状态
  storyState: StoryState
  currentStoryNode: StoryNode | null
  
  // 日志
  gameLog: string[]
  
  // 方法
  newGame: () => void
  loadGame: (saveData: GameState) => void
  saveGame: () => Promise<boolean>
  
  // 导航
  navigateTo: (view: GameStore['currentView']) => void
  
  // 游戏操作
  endDay: () => void
  restAtCamp: () => void
  
  // 地下城
  startDungeon: (floor: number, theme?: DungeonThemeId) => void
  abandonDungeon: () => void
  completeDungeon: () => void
  processDungeonEvent: () => void
  
  // 战斗
  startBattle: (monster: Monster) => void
  playerAttack: () => void
  playerEscape: () => void
  monsterAttack: () => void
  useSkill: (skillId: string) => void
  defend: () => void
  charge: () => void
  
  // 商店
  openShop: () => void
  buyItem: (item: ShopItem) => void
  sellItem: (item: Item | Equipment, isEquipment: boolean) => void
  
  // 还款
  makePayment: (amount: number) => void
  
  // 装备
  equipItem: (equipment: Equipment) => void
  unequipItem: (slot: 'weapon' | 'armor' | 'accessory') => void
  useItem: (itemId: string) => void
  
  // 故事系统
  checkStoryTriggers: () => void
  continueStory: () => void
  selectChoice: (choice: StoryChoice) => void
  skipStory: () => void
  applyStoryEffect: (effect: StoryEffect) => void
  
  // 日志
  addLog: (message: string) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initGame(),
  currentView: 'main_menu',
  dungeonRun: null,
  battleState: null,
  shopItems: [],
  storyState: createDefaultStoryState(),
  currentStoryNode: null,
  gameLog: [],

  newGame: () => {
    const newState = initGame()
    const storyState = createDefaultStoryState()
    set({
      ...newState,
      currentView: 'town',
      dungeonRun: null,
      battleState: null,
      storyState,
      currentStoryNode: null,
      gameLog: ['游戏开始！目标：在30天内还清 10,000 金币债务'],
    })
    setTimeout(() => {
      get().checkStoryTriggers()
    }, 100)
  },

  loadGame: (saveData) => {
    set({
      ...saveData,
      currentView: 'town',
      dungeonRun: null,
      battleState: null,
    })
  },

  saveGame: async () => {
    if (!window.electronAPI) {
      console.log('非 Electron 环境，无法保存')
      return false
    }

    const state = get()
    const saveData = {
      player: state.player,
      gameOver: state.gameOver,
      victory: state.victory,
      ending: state.ending,
      storyState: state.storyState,
    }
    
    try {
      const result = await window.electronAPI.saveGame(saveData)
      return result.success
    } catch {
      return false
    }
  },

  navigateTo: (view) => set({ currentView: view }),

  endDay: () => {
    const state = get()
    const newState = endDay(state)
    
    const newStoryState = advanceStoryDay(state.storyState)
    
    set({
      player: newState.player,
      gameOver: newState.gameOver,
      victory: newState.victory,
      ending: newState.ending,
      storyState: newStoryState,
    })
    
    if (newState.gameOver) {
      set({ currentView: 'game_over' })
    } else {
      get().addLog(`第 ${newState.player.day} 天开始了`)
      
      setTimeout(() => {
        get().checkStoryTriggers()
      }, 100)
      
      const payment = calculatePayment(newState.player)
      if (payment.remaining > 0 && newState.player.day % 20 === 0) {
        set({ currentView: 'settlement' })
      }
    }
  },

  restAtCamp: () => {
    const state = get()
    const result = restAtCamp(state.player)
    if (result.success) {
      set({ player: result.player })
      get().addLog(result.message)
    }
  },

  startDungeon: (floor, theme = 'forest') => {
    const run = startDungeonRun(floor, theme)
    set({
      dungeonRun: run,
      currentView: 'dungeon',
    })
    get().addLog(`开始探索地下城第 ${floor} 层`)
    
    const state = get()
    set({ player: consumeAction(state.player) })
  },

  abandonDungeon: () => {
    const state = get()
    if (state.dungeonRun) {
      const newRun = abandonDungeon(state.dungeonRun)
      set({ dungeonRun: newRun })
      get().addLog('放弃了探险，返回城镇')
    }
    set({ currentView: 'town', dungeonRun: null })
  },

  completeDungeon: () => {
    const state = get()
    if (state.dungeonRun) {
      const rewards = state.dungeonRun.rewards
      get().addLog(`探险结束！总计获得 ${rewards.totalExp} 经验，${rewards.totalGold} 金币`)
      
      const completedFloor = state.dungeonRun.floor
      if (completedFloor > state.player.highestFloor) {
        set({
          player: {
            ...state.player,
            highestFloor: completedFloor
          }
        })
        get().addLog(`解锁了地下城第 ${completedFloor + 1} 层！`)
      }
    }
    set({ currentView: 'town', dungeonRun: null })
  },

  processDungeonEvent: () => {
    const state = get()
    if (!state.dungeonRun) return
    
    const currentEvent = state.dungeonRun.events[state.dungeonRun.currentEventIndex]
    if (!currentEvent || currentEvent.type === 'battle') return
    
    const result = processEvent(state.dungeonRun, state.player)
    
    set({
      dungeonRun: result.run,
      player: result.player,
    })
    
    get().addLog(result.message)
  },

  startBattle: (monster) => {
    const state = get()
    const battleState = initBattle(state.player, monster)
    set({ battleState })
    
    if (!state.dungeonRun) {
      set({ currentView: 'battle' })
    }
  },

  playerAttack: () => {
    const state = get()
    if (!state.battleState || !state.battleState.isPlayerTurn || state.battleState.isFinished) return
    
    const result = playerAction(state.battleState, { type: 'attack' })
    set({ battleState: result.state })
    
    if (result.state.isFinished) {
      if (result.state.result === 'victory') {
        set({ player: result.state.player })
        
        if (state.dungeonRun) {
          const rewards = result.state.rewards
          if (rewards) {
            const newRun = { ...state.dungeonRun }
            newRun.rewards.totalExp += rewards.exp
            newRun.rewards.totalGold += rewards.gold
            newRun.rewards.items.push(...rewards.items)
            newRun.currentEventIndex += 1
            
            if (newRun.currentEventIndex >= newRun.events.length) {
              newRun.isFinished = true
            }
            
            set({ dungeonRun: newRun, battleState: null })
            
            if (newRun.isFinished) {
              get().addLog(`战斗胜利！获得 ${rewards.exp} 经验，${rewards.gold} 金币`)
            } else {
              get().addLog(`战斗胜利！获得 ${rewards.exp} 经验，${rewards.gold} 金币，继续探险...`)
            }
          }
        } else {
          setTimeout(() => {
            set({ currentView: 'town', battleState: null })
          }, 1500)
        }
      } else if (result.state.result === 'defeat') {
        set({ player: result.state.player })
        if (state.dungeonRun) {
          get().addLog('战斗失败，被迫撤退...')
          set({ dungeonRun: null })
        }
        setTimeout(() => {
          set({ currentView: 'town', battleState: null })
        }, 1500)
      }
    } else {
      const currentBattleState = result.state
      setTimeout(() => {
        const monsterResult = monsterTurn(currentBattleState)
        set({ battleState: monsterResult.state })
        
        if (monsterResult.state.isFinished && monsterResult.state.result === 'defeat') {
          set({ player: monsterResult.state.player })
          if (get().dungeonRun) {
            get().addLog('战斗失败，被迫撤退...')
            set({ dungeonRun: null })
          }
          setTimeout(() => {
            set({ currentView: 'town', battleState: null })
          }, 1500)
        }
      }, 800)
    }
  },

  playerEscape: () => {
    const state = get()
    if (!state.battleState) return
    
    const result = playerAction(state.battleState, { type: 'escape' })
    set({ battleState: result.state })
    
    if (result.state.isFinished && result.state.result === 'escape') {
      if (state.dungeonRun) {
        get().addLog('逃跑成功，放弃探险...')
        set({ dungeonRun: null })
      }
      setTimeout(() => {
        set({ currentView: 'town', battleState: null })
      }, 1000)
    }
  },

  useSkill: (skillId: string) => {
    const state = get()
    if (!state.battleState || !state.battleState.isPlayerTurn || state.battleState.isFinished) return
    
    const result = playerAction(state.battleState, { type: 'use_skill', skillId })
    set({ battleState: result.state })
    
    if (result.state.isFinished) {
      if (result.state.result === 'victory') {
        set({ player: result.state.player })
        
        if (state.dungeonRun) {
          const rewards = result.state.rewards
          if (rewards) {
            const newRun = { ...state.dungeonRun }
            newRun.rewards.totalExp += rewards.exp
            newRun.rewards.totalGold += rewards.gold
            newRun.rewards.items.push(...rewards.items)
            newRun.currentEventIndex += 1
            
            if (newRun.currentEventIndex >= newRun.events.length) {
              newRun.isFinished = true
            }
            
            set({ dungeonRun: newRun, battleState: null })
            
            if (newRun.isFinished) {
              get().addLog(`战斗胜利！获得 ${rewards.exp} 经验，${rewards.gold} 金币`)
            } else {
              get().addLog(`战斗胜利！获得 ${rewards.exp} 经验，${rewards.gold} 金币，继续探险...`)
            }
          }
        } else {
          setTimeout(() => {
            set({ currentView: 'town', battleState: null })
          }, 1500)
        }
      } else if (result.state.result === 'defeat') {
        set({ player: result.state.player })
        if (state.dungeonRun) {
          get().addLog('战斗失败，被迫撤退...')
          set({ dungeonRun: null })
        }
        setTimeout(() => {
          set({ currentView: 'town', battleState: null })
        }, 1500)
      }
    } else {
      const currentBattleState = result.state
      setTimeout(() => {
        const monsterResult = monsterTurn(currentBattleState)
        set({ battleState: monsterResult.state })
        
        if (monsterResult.state.isFinished && monsterResult.state.result === 'defeat') {
          set({ player: monsterResult.state.player })
          if (get().dungeonRun) {
            get().addLog('战斗失败，被迫撤退...')
            set({ dungeonRun: null })
          }
          setTimeout(() => {
            set({ currentView: 'town', battleState: null })
          }, 1500)
        }
      }, 800)
    }
  },

  defend: () => {
    const state = get()
    if (!state.battleState || !state.battleState.isPlayerTurn || state.battleState.isFinished) return
    
    const result = playerAction(state.battleState, { type: 'defend' })
    set({ battleState: result.state })
    
    const currentBattleState = result.state
    setTimeout(() => {
      const monsterResult = monsterTurn(currentBattleState)
      set({ battleState: monsterResult.state })
      
      if (monsterResult.state.isFinished && monsterResult.state.result === 'defeat') {
        set({ player: monsterResult.state.player })
        if (get().dungeonRun) {
          get().addLog('战斗失败，被迫撤退...')
          set({ dungeonRun: null })
        }
        setTimeout(() => {
          set({ currentView: 'town', battleState: null })
        }, 1500)
      }
    }, 800)
  },

  charge: () => {
    const state = get()
    if (!state.battleState || !state.battleState.isPlayerTurn || state.battleState.isFinished) return
    
    const result = playerAction(state.battleState, { type: 'charge' })
    set({ battleState: result.state })
    
    const currentBattleState = result.state
    setTimeout(() => {
      const monsterResult = monsterTurn(currentBattleState)
      set({ battleState: monsterResult.state })
      
      if (monsterResult.state.isFinished && monsterResult.state.result === 'defeat') {
        set({ player: monsterResult.state.player })
        if (get().dungeonRun) {
          get().addLog('战斗失败，被迫撤退...')
          set({ dungeonRun: null })
        }
        setTimeout(() => {
          set({ currentView: 'town', battleState: null })
        }, 1500)
      }
    }, 800)
  },

  monsterAttack: () => {
    const state = get()
    if (!state.battleState) return
    
    const result = monsterTurn(state.battleState)
    set({ battleState: result.state })
    
    if (result.state.isFinished && result.state.result === 'defeat') {
      set({ player: result.state.player })
      if (state.dungeonRun) {
        get().addLog('战斗失败，被迫撤退...')
        set({ dungeonRun: null })
      }
      setTimeout(() => {
        set({ currentView: 'town', battleState: null })
      }, 1500)
    }
  },

  openShop: () => {
    const state = get()
    const items = generateShopItems(state.player.day)
    set({
      shopItems: items,
      currentView: 'shop',
    })
  },

  buyItem: (shopItem) => {
    const state = get()
    const result = buyItem(state.player, shopItem)
    if (result.success) {
      set({ player: result.player })
      get().addLog(result.message)
    }
  },

  sellItem: (item, isEquipment) => {
    const state = get()
    const result = sellItem(state.player, item, isEquipment)
    if (result.success) {
      set({ player: result.player })
      get().addLog(result.message)
    }
  },

  makePayment: (amount) => {
    const state = get()
    const result = makePayment(state.player, amount)
    if (result.success) {
      set({ player: result.player })
      get().addLog(result.message)
    }
  },

  equipItem: (equipment) => {
    const state = get()
    const newPlayer = { ...state.player }
    
    if (newPlayer.equipment[equipment.slot]) {
      newPlayer.inventory.push(newPlayer.equipment[equipment.slot]! as unknown as Item)
    }
    
    newPlayer.equipment[equipment.slot] = equipment
    newPlayer.inventory = newPlayer.inventory.filter(i => i.id !== equipment.id)
    
    set({ player: newPlayer })
    get().addLog(`装备了 ${equipment.name}`)
  },

  unequipItem: (slot) => {
    const state = get()
    const newPlayer = { ...state.player }
    
    if (newPlayer.equipment[slot]) {
      newPlayer.inventory.push(newPlayer.equipment[slot]! as unknown as Item)
      newPlayer.equipment[slot] = null
    }
    
    set({ player: newPlayer })
  },

  useItem: (itemId) => {
    const state = get()
    const itemIndex = state.player.inventory.findIndex(i => i.id === itemId)
    if (itemIndex < 0) return
    
    const item = state.player.inventory[itemIndex]
    if (item.type !== 'consumable' || !item.effect) {
      get().addLog('该物品无法使用')
      return
    }
    
    if (state.battleState && (!state.battleState.isPlayerTurn || state.battleState.isFinished)) {
      get().addLog('现在无法使用物品')
      return
    }
    
    let newPlayer = { ...state.player }
    let newBattleState = state.battleState ? { ...state.battleState } : null
    
    if (item.effect.type === 'heal') {
      const maxHp = newPlayer.maxHp
      const oldHp = newPlayer.hp
      newPlayer.hp = Math.min(maxHp, newPlayer.hp + item.effect.value)
      const healed = newPlayer.hp - oldHp
      
      get().addLog(`使用了 ${item.name}，回复 ${healed} 点生命值`)
      
      if (newBattleState) {
        newBattleState.player.hp = newPlayer.hp
      }
    }
    
    const newInventory = [...newPlayer.inventory]
    if (newInventory[itemIndex].quantity > 1) {
      newInventory[itemIndex] = { ...newInventory[itemIndex], quantity: newInventory[itemIndex].quantity - 1 }
    } else {
      newInventory.splice(itemIndex, 1)
    }
    newPlayer.inventory = newInventory
    
    if (newBattleState) {
      set({ player: newPlayer, battleState: newBattleState })
    } else {
      set({ player: newPlayer })
    }
  },

  // 故事系统方法
  checkStoryTriggers: () => {
    const state = get()
    
    const triggerableNodes = allStoryNodes
      .filter(node => canTriggerNode(node, state.storyState))
      .sort((a, b) => b.priority - a.priority)
    
    if (triggerableNodes.length > 0) {
      const nodeToTrigger = triggerableNodes[0]
      set({
        currentStoryNode: nodeToTrigger,
        currentView: 'story',
        storyState: {
          ...state.storyState,
          activeNode: nodeToTrigger.id,
        },
      })
    }
  },

  continueStory: () => {
    const state = get()
    if (!state.currentStoryNode) return
    
    const currentNode = state.currentStoryNode
    
    if (currentNode.nextNode && storyNodeMap[currentNode.nextNode]) {
      const nextNode = storyNodeMap[currentNode.nextNode]
      set({
        currentStoryNode: nextNode,
        storyState: {
          ...state.storyState,
          activeNode: nextNode.id,
        },
      })
    } else {
      const newStoryState = completeNode(state.storyState, currentNode.id)
      set({
        storyState: newStoryState,
        currentStoryNode: null,
        currentView: 'town',
      })
      
      if (currentNode.effects) {
        currentNode.effects.forEach(effect => {
          get().applyStoryEffect(effect)
        })
      }
    }
  },

  selectChoice: (choice) => {
    const state = get()
    
    // 获取当前的关系状态
    const relationshipState = state.storyState.relationshipState
    
    // 记录选择
    const newKeyChoices = [...relationshipState.keyChoices]
    if (!newKeyChoices.includes(choice.id)) {
      newKeyChoices.push(choice.id)
    }
    
    // 应用道德值变化
    const newMoralValue = Math.max(-100, Math.min(100, relationshipState.moralValue + choice.moralValue))
    
    // 应用效果
    let newRelationships = { ...relationshipState.relationships }
    let newStoryFlags = { ...relationshipState.storyFlags }
    
    if (choice.effects) {
      choice.effects.forEach(effect => {
        if (effect.type === 'modify_relationship' && effect.target) {
          const npcId = effect.target as NPCId
          const currentValue = newRelationships[npcId] ?? 0
          newRelationships[npcId] = Math.max(-100, Math.min(100, currentValue + effect.value))
        } else if (effect.type === 'set_flag' && effect.target) {
          newStoryFlags[effect.target] = true
        }
      })
    }
    
    const newStoryState: StoryState = {
      ...state.storyState,
      relationshipState: {
        ...relationshipState,
        keyChoices: newKeyChoices,
        moralValue: newMoralValue,
        relationships: newRelationships,
        storyFlags: newStoryFlags,
      },
    }
    
    if (choice.nextNode && storyNodeMap[choice.nextNode]) {
      const nextNode = storyNodeMap[choice.nextNode]
      set({
        currentStoryNode: nextNode,
        storyState: {
          ...newStoryState,
          activeNode: nextNode.id,
        },
      })
    } else {
      const completedState: StoryState = {
        ...newStoryState,
        completedNodes: [...newStoryState.completedNodes, state.storyState.activeNode!],
        activeNode: null,
      }
      set({
        storyState: completedState,
        currentStoryNode: null,
        currentView: 'town',
      })
    }
  },

  skipStory: () => {
    const state = get()
    if (!state.currentStoryNode) return
    
    const newStoryState = completeNode(state.storyState, state.currentStoryNode.id)
    set({
      storyState: newStoryState,
      currentStoryNode: null,
      currentView: 'town',
    })
  },

  applyStoryEffect: (effect) => {
    const state = get()
    
    switch (effect.type) {
      case 'add_item':
        get().addLog(`获得物品: ${effect.target}`)
        break
      case 'modify_gold':
        const newGold = state.player.gold + effect.value
        set({
          player: { ...state.player, gold: newGold },
        })
        if (effect.value > 0) {
          get().addLog(`获得 ${effect.value} 金币`)
        } else {
          get().addLog(`失去 ${Math.abs(effect.value)} 金币`)
        }
        break
      case 'damage_player':
        const newHp = Math.max(0, state.player.hp - effect.value)
        set({
          player: { ...state.player, hp: newHp },
        })
        get().addLog(`受到 ${effect.value} 点伤害`)
        break
      case 'heal_player':
        const healedHp = Math.min(state.player.maxHp, state.player.hp + effect.value)
        set({
          player: { ...state.player, hp: healedHp },
        })
        get().addLog(`回复 ${effect.value} 点生命值`)
        break
    }
  },

  addLog: (message) => {
    set((state) => ({
      gameLog: [...state.gameLog.slice(-19), message],
    }))
  },
}))
