import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '../stores/gameStore'
import { calculatePlayerStats } from '../../../core/models/Player'
import { getAvailableSkills } from '../../../core/models/Skill'

// 战斗动画组件
function AttackAnimation({ 
  isActive, 
  direction 
}: { 
  isActive: boolean
  direction: 'left' | 'right'
}) {
  if (!isActive) return null
  
  return (
    <div 
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
    >
      <div className="text-6xl font-bold text-yellow-400 drop-shadow-lg"
        style={{
          textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
          animation: direction === 'right' 
            ? 'attackRight 0.5s ease-out' 
            : 'attackLeft 0.5s ease-out'
        }}
      >
        {direction === 'right' ? '⚔️' : '💥'}
      </div>
    </div>
  )
}

// 伤害数字动画
function DamageNumber({ 
  damage, 
  isCrit,
  position 
}: { 
  damage: number
  isCrit: boolean
  position: 'left' | 'right'
}) {
  return (
    <div 
      className={`absolute text-4xl font-bold pointer-events-none z-20
        ${isCrit ? 'text-yellow-400' : 'text-red-500'}`}
      style={{
        top: '30%',
        [position]: '20%',
        animation: 'damageFloat 1s ease-out forwards',
        textShadow: isCrit ? '0 0 10px gold' : '0 0 5px red',
        fontSize: isCrit ? '3rem' : '2rem'
      }}
    >
      {isCrit ? '暴击! ' : '-'}{damage}
    </div>
  )
}

// 道具选择弹窗
function ItemModal({
  isOpen,
  onClose,
  onUse,
  inventory,
  isPlayerTurn,
}: {
  isOpen: boolean
  onClose: () => void
  onUse: (itemId: string) => void
  inventory: Array<{ id: string; name: string; quantity: number; type: string; effect?: { type: string; value: number } }>
  isPlayerTurn: boolean
}) {
  if (!isOpen) return null
  
  const consumables = inventory.filter(i => i.type === 'consumable')
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="game-panel max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4 text-game-accent">🎒 选择道具</h3>
        
        {consumables.length === 0 ? (
          <div className="text-gray-400 text-center py-8">没有可用的消耗品</div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {consumables.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (isPlayerTurn) {
                    onUse(item.id)
                    onClose()
                  }
                }}
                disabled={!isPlayerTurn}
                className="w-full flex justify-between items-center bg-game-bg p-3 rounded hover:bg-game-accent/20 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧪</span>
                  <div className="text-left">
                    <div className="font-bold">{item.name}</div>
                    <div className="text-xs text-gray-400">
                      {item.effect?.type === 'heal' ? `回复 ${item.effect.value} HP` : ''}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">x{item.quantity}</span>
                  <span className="text-game-accent">使用</span>
                </div>
              </button>
            ))}
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-full mt-4 game-button-secondary py-2"
        >
          取消
        </button>
      </div>
    </div>
  )
}

// 技能选择弹窗
function SkillModal({
  isOpen,
  onClose,
  onUse,
  playerLevel,
  isPlayerTurn,
  playerMp,
}: {
  isOpen: boolean
  onClose: () => void
  onUse: (skillId: string) => void
  playerLevel: number
  isPlayerTurn: boolean
  playerMp: number
}) {
  if (!isOpen) return null
  
  // 获取可用技能（根据玩家等级）
  const availableSkills = getAvailableSkills(playerLevel)
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="game-panel max-w-md w-full m-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4 text-game-accent">✨ 选择技能</h3>
        
        {availableSkills.length === 0 ? (
          <div className="text-gray-400 text-center py-8">没有可用的技能</div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {availableSkills.map((skill) => {
              const canUse = isPlayerTurn && (skill.mpCost || 0) <= playerMp
              return (
                <button
                  key={skill.id}
                  onClick={() => {
                    if (canUse) {
                      onUse(skill.id)
                      onClose()
                    }
                  }}
                  disabled={!canUse}
                  className={`w-full flex justify-between items-center bg-game-bg p-3 rounded transition-colors disabled:opacity-50 ${
                    canUse ? 'hover:bg-game-accent/20' : 'cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {skill.category === 'physical' ? '⚔️' : 
                       skill.category === 'magical' ? '🔮' : '🛡️'}
                    </span>
                    <div className="text-left">
                      <div className="font-bold">{skill.name}</div>
                      <div className="text-xs text-gray-400">
                        {skill.mpCost ? `MP消耗: ${skill.mpCost}` : ''}
                        {skill.mpCost && skill.cooldown ? ' | ' : ''}
                        {skill.cooldown ? `冷却: ${skill.cooldown}回合` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${canUse ? 'text-game-accent' : 'text-red-400'}`}>
                      {canUse ? '使用' : 'MP不足'}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        )}
        
        <button
          onClick={onClose}
          className="w-full mt-4 game-button-secondary py-2"
        >
          取消
        </button>
      </div>
    </div>
  )
}

// 战斗结果展示组件
function BattleResult({ 
  result, 
  rewards, 
  onReturn 
}: { 
  result: 'victory' | 'defeat' | 'escape'
  rewards: { exp: number; gold: number } | null
  onReturn: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="game-panel max-w-md w-full text-center p-8">
        <div className={`text-5xl mb-6 ${
          result === 'victory' ? 'text-green-400' :
          result === 'defeat' ? 'text-red-400' :
          'text-yellow-400'
        }`}>
          {result === 'victory' && '🎉'}
          {result === 'defeat' && '💀'}
          {result === 'escape' && '🏃'}
        </div>
        
        <div className={`text-3xl font-bold mb-6 ${
          result === 'victory' ? 'text-green-400' :
          result === 'defeat' ? 'text-red-400' :
          'text-yellow-400'
        }`}>
          {result === 'victory' && '战斗胜利！'}
          {result === 'defeat' && '战斗失败...'}
          {result === 'escape' && '成功逃脱'}
        </div>
        
        {result === 'victory' && rewards && (
          <div className="bg-game-bg rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>经验值</span>
              <span className="text-blue-400 font-bold">+{rewards.exp}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>金币</span>
              <span className="text-game-gold font-bold">+{rewards.gold}</span>
            </div>
          </div>
        )}
        
        <button
          onClick={onReturn}
          className="game-button text-xl px-8 py-3"
        >
          继续
        </button>
      </div>
    </div>
  )
}

// 主战斗组件
export default function Battle() {
  // 首先获取所有状态
  const battleState = useGameStore(state => state.battleState)
  const player = useGameStore(state => state.player)
  const dungeonRun = useGameStore(state => state.dungeonRun)
  const playerAttack = useGameStore(state => state.playerAttack)
  const playerEscape = useGameStore(state => state.playerEscape)
  const useItem = useGameStore(state => state.useItem)
  const useSkill = useGameStore(state => state.useSkill)
  // TODO: 实现防御和蓄力功能
  // const defend = useGameStore(state => state.defend)
  // const charge = useGameStore(state => state.charge)
  const navigateTo = useGameStore(state => state.navigateTo)

  // 动画状态
  const [playerAttacking, setPlayerAttacking] = useState(false)
  const [monsterAttacking, setMonsterAttacking] = useState(false)
  const [playerDamage, setPlayerDamage] = useState<{value: number, isCrit: boolean} | null>(null)
  const [monsterDamage, setMonsterDamage] = useState<{value: number, isCrit: boolean} | null>(null)
  const [lastLogCount, setLastLogCount] = useState(0)
  const [showItemModal, setShowItemModal] = useState(false)
  const [showSkillModal, setShowSkillModal] = useState(false)

  const stats = calculatePlayerStats(player)

  // 监听战斗日志变化，触发动画
  useEffect(() => {
    if (!battleState) return
    
    const currentLogCount = battleState.battleLog.length
    if (currentLogCount > lastLogCount) {
      const newLogs = battleState.battleLog.slice(lastLogCount)
      
      newLogs.forEach(log => {
        // 玩家攻击动画
        if (log.includes('造成') && !log.includes('怪物')) {
          setPlayerAttacking(true)
          setTimeout(() => setPlayerAttacking(false), 500)
          
          const match = log.match(/造成 (\d+) 点伤害/)
          if (match) {
            const damage = parseInt(match[1])
            const isCrit = log.includes('暴击')
            setMonsterDamage({ value: damage, isCrit })
            setTimeout(() => setMonsterDamage(null), 1000)
          }
        }
        
        // 怪物攻击动画
        if (log.includes('怪物') && log.includes('造成')) {
          setMonsterAttacking(true)
          setTimeout(() => setMonsterAttacking(false), 500)
          
          const match = log.match(/造成 (\d+) 点伤害/)
          if (match) {
            const damage = parseInt(match[1])
            setPlayerDamage({ value: damage, isCrit: false })
            setTimeout(() => setPlayerDamage(null), 1000)
          }
        }
      })
      
      setLastLogCount(currentLogCount)
    }
  }, [battleState?.battleLog, lastLogCount])

  // 重置日志计数当战斗变化
  useEffect(() => {
    if (battleState) {
      setLastLogCount(battleState.battleLog.length)
    }
  }, [battleState?.monster?.id])

  // 事件处理
  const handleAttack = useCallback(() => {
    if (battleState?.isPlayerTurn && !battleState?.isFinished) {
      playerAttack()
    }
  }, [battleState?.isPlayerTurn, battleState?.isFinished, playerAttack])

  const handleEscape = useCallback(() => {
    if (battleState?.isPlayerTurn && !battleState?.isFinished) {
      playerEscape()
    }
  }, [battleState?.isPlayerTurn, battleState?.isFinished, playerEscape])

  const handleUseItem = useCallback((itemId: string) => {
    if (battleState?.isPlayerTurn && !battleState?.isFinished) {
      useItem(itemId)
    }
  }, [battleState?.isPlayerTurn, battleState?.isFinished, useItem])

  const handleUseSkill = useCallback((skillId: string) => {
    if (battleState?.isPlayerTurn && !battleState?.isFinished) {
      useSkill(skillId)
    }
  }, [battleState?.isPlayerTurn, battleState?.isFinished, useSkill])

  const handleReturn = useCallback(() => {
    // 如果存在地下城探险，返回地下城界面，否则返回城镇
    if (dungeonRun) {
      navigateTo('dungeon')
    } else {
      navigateTo('town')
    }
  }, [navigateTo, dungeonRun])

  // 如果战斗状态不存在，返回城镇
  if (!battleState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl text-gray-400 mb-4">战斗结束</div>
          <button
            onClick={handleReturn}
            className="game-button px-6 py-2"
          >
            返回城镇
          </button>
        </div>
      </div>
    )
  }

  const { monster, isPlayerTurn, isFinished, result, battleLog } = battleState

  // 战斗结束显示结果
  if (isFinished && result) {
    return (
      <BattleResult
        result={result}
        rewards={battleState.rewards}
        onReturn={handleReturn}
      />
    )
  }

  // 战斗进行中
  return (
    <div className="min-h-screen p-4 flex flex-col">
      <style>{`
        @keyframes attackRight {
          0% { transform: translateX(-100px) scale(0.5); opacity: 0; }
          50% { transform: translateX(0) scale(1.2); opacity: 1; }
          100% { transform: translateX(100px) scale(1); opacity: 0; }
        }
        @keyframes attackLeft {
          0% { transform: translateX(100px) scale(0.5); opacity: 0; }
          50% { transform: translateX(0) scale(1.2); opacity: 1; }
          100% { transform: translateX(-100px) scale(1); opacity: 0; }
        }
        @keyframes damageFloat {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .shake { animation: shake 0.3s ease-in-out; }
      `}</style>

      {/* 道具选择弹窗 */}
      <ItemModal
        isOpen={showItemModal}
        onClose={() => setShowItemModal(false)}
        onUse={handleUseItem}
        inventory={player.inventory}
        isPlayerTurn={isPlayerTurn}
      />
      
      {/* 技能选择弹窗 */}
      <SkillModal
        isOpen={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        onUse={handleUseSkill}
        playerLevel={player.level}
        isPlayerTurn={isPlayerTurn}
        playerMp={player.mp}
      />

      {/* 战斗标题 */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-game-accent">⚔️ 战斗</h1>
        <div className="text-sm text-gray-400 mt-1">
          第 {battleState.turn} 回合 | {isPlayerTurn ? '你的回合' : '怪物回合'}
        </div>
      </div>

      {/* 角色属性面板 */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* 玩家属性 */}
        <div className="game-panel p-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">🧙‍♂️</div>
            <div>
              <div className="font-bold text-lg">{player.name}</div>
              <div className="text-sm text-gray-400">Lv.{player.level}</div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>HP</span>
              <span>{battleState.player.hp}/{stats.maxHp}</span>
            </div>
            <div className="stat-bar h-3">
              <div
                className="stat-bar-fill hp-bar transition-all duration-300"
                style={{ width: `${Math.max(0, (battleState.player.hp / stats.maxHp) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>MP</span>
              <span>{battleState.player.mp}/{stats.maxMp}</span>
            </div>
            <div className="stat-bar h-3">
              <div
                className="stat-bar-fill mp-bar transition-all duration-300"
                style={{ width: `${Math.max(0, (battleState.player.mp / stats.maxMp) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-xs text-center">
            <div className="bg-game-bg rounded p-1">
              <div className="text-gray-500">攻击</div>
              <div className="font-bold text-game-accent">{stats.attack}</div>
            </div>
            <div className="bg-game-bg rounded p-1">
              <div className="text-gray-500">防御</div>
              <div className="font-bold text-blue-400">{stats.defense}</div>
            </div>
            <div className="bg-game-bg rounded p-1">
              <div className="text-gray-500">智力</div>
              <div className="font-bold text-purple-400">{stats.intelligence}</div>
            </div>
            <div className="bg-game-bg rounded p-1">
              <div className="text-gray-500">暴击</div>
              <div className="font-bold text-yellow-400">{(stats.critRate * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>

        {/* 怪物属性 */}
        <div className="game-panel p-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">👹</div>
            <div>
              <div className="font-bold text-lg">{monster.name}</div>
              <div className="text-sm text-gray-400">Lv.{monster.level}</div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span>HP</span>
              <span>{monster.hp}/{monster.maxHp}</span>
            </div>
            <div className="stat-bar h-3">
              <div
                className="stat-bar-fill bg-red-600 transition-all duration-300"
                style={{ width: `${Math.max(0, (monster.hp / monster.maxHp) * 100)}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="bg-game-bg rounded p-1">
              <div className="text-gray-500">攻击</div>
              <div className="font-bold text-red-400">{monster.attack}</div>
            </div>
            <div className="bg-game-bg rounded p-1">
              <div className="text-gray-500">防御</div>
              <div className="font-bold text-blue-400">{monster.defense}</div>
            </div>
            <div className="bg-game-bg rounded p-1">
              <div className="text-gray-500">经验</div>
              <div className="font-bold text-green-400">{monster.expReward}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 战斗场景 */}
      <div className="flex-1 relative flex items-center justify-around mb-4 min-h-[200px]">
        {/* 玩家 */}
        <div 
          className={`relative transition-transform duration-200 
            ${playerAttacking ? 'translate-x-20' : ''} 
            ${playerDamage ? 'shake' : ''}`}
          style={{ filter: battleState.player.hp <= stats.maxHp * 0.3 ? 'grayscale(50%) brightness(0.7)' : 'none' }}
        >
          <div className="text-8xl">🧙‍♂️</div>
          {playerAttacking && <AttackAnimation isActive={true} direction="right" />}
          {playerDamage && (
            <DamageNumber damage={playerDamage.value} isCrit={playerDamage.isCrit} position="left" />
          )}
          {battleState.player.hp <= stats.maxHp * 0.3 && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500 font-bold animate-pulse">
              ⚠️ 危险
            </div>
          )}
        </div>

        <div className="text-3xl font-bold text-game-accent/50">VS</div>

        {/* 怪物 */}
        <div 
          className={`relative transition-transform duration-200 
            ${monsterAttacking ? '-translate-x-20' : ''} 
            ${monsterDamage ? 'shake' : ''}`}
          style={{ filter: monster.hp <= monster.maxHp * 0.3 ? 'grayscale(50%) brightness(0.7)' : 'none' }}
        >
          <div className="text-8xl">👹</div>
          {monsterAttacking && <AttackAnimation isActive={true} direction="left" />}
          {monsterDamage && (
            <DamageNumber damage={monsterDamage.value} isCrit={monsterDamage.isCrit} position="right" />
          )}
          {monster.hp <= monster.maxHp * 0.3 && monster.hp > 0 && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-red-500 font-bold animate-pulse">
              虚弱
            </div>
          )}
        </div>
      </div>

      {/* 战斗日志 */}
      <div className="game-panel h-32 overflow-y-auto mb-4 p-3">
        <div className="text-xs text-gray-500 mb-2">战斗记录</div>
        {battleLog.length === 0 ? (
          <div className="text-gray-500 text-center">战斗开始！</div>
        ) : (
          <div className="space-y-1">
            {battleLog.slice(-5).map((log, index) => (
              <div
                key={index}
                className={`text-sm ${
                  log.includes('暴击') ? 'text-yellow-400 font-bold' :
                  log.includes('战胜') ? 'text-green-400 font-bold' :
                  log.includes('失败') ? 'text-red-400 font-bold' :
                  log.includes('闪避') ? 'text-blue-400' :
                  'text-gray-300'
                }`}
              >
                {index === battleLog.slice(-5).length - 1 && (
                  <span className="inline-block w-2 h-2 bg-game-accent rounded-full mr-2 animate-pulse" />
                )}
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 战斗操作 */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleAttack}
          disabled={!isPlayerTurn}
          className={`
            game-button text-xl px-8 py-4 transition-all duration-200
            ${!isPlayerTurn ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
          `}
        >
          <span className="mr-2">⚔️</span>
          攻击
        </button>
        <button
          onClick={() => setShowSkillModal(true)}
          disabled={!isPlayerTurn}
          className={`
            game-button text-xl px-6 py-4 transition-all duration-200
            ${!isPlayerTurn ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
          `}
        >
          <span className="mr-2">✨</span>
          技能
        </button>
        <button
          onClick={() => setShowItemModal(true)}
          disabled={!isPlayerTurn}
          className={`
            game-button-secondary text-xl px-6 py-4 transition-all duration-200
            ${!isPlayerTurn ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
          `}
        >
          <span className="mr-2">🎒</span>
          道具
        </button>
        <button
          onClick={handleEscape}
          disabled={!isPlayerTurn}
          className={`
            game-button-secondary text-xl px-6 py-4 transition-all duration-200
            ${!isPlayerTurn ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
          `}
        >
          <span className="mr-2">🏃</span>
          逃跑
        </button>
      </div>

      {/* 回合指示 */}
      <div className="text-center mt-4">
        {isPlayerTurn ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-game-accent/20 rounded-full">
            <span className="w-3 h-3 bg-game-accent rounded-full animate-pulse" />
            <span className="text-game-accent font-bold">你的回合 - 请选择行动</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700/50 rounded-full">
            <span className="w-3 h-3 bg-gray-500 rounded-full animate-pulse" />
            <span className="text-gray-400">{monster.name} 正在攻击...</span>
          </div>
        )}
      </div>
    </div>
  )
}
