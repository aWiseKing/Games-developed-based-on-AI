import { useState } from 'react'
import { useGameStore } from '../stores/gameStore'
import { calculatePlayerStats } from '../../../core/models/Player'
import { calculatePayment } from '../../../core/systems/EconomySystem'
import { QUALITY_COLORS } from '../../../core/models/Equipment'
import type { Equipment } from '../../../core/models/Equipment'
import type { Item } from '../../../core/models/Item'

// 装备管理弹窗
function EquipmentModal({
  isOpen,
  onClose,
  player,
  onEquip,
  onUnequip,
}: {
  isOpen: boolean
  onClose: () => void
  player: ReturnType<typeof useGameStore.getState>['player']
  onEquip: (item: Item) => void
  onUnequip: (slot: 'weapon' | 'armor' | 'accessory') => void
}) {
  if (!isOpen) return null

  const stats = calculatePlayerStats(player)
  
  // 从背包中筛选出装备
  const equippableItems = player.inventory.filter(item => 
    item.type === 'material' && (
      item.description?.includes('武器') ||
      item.description?.includes('护甲') ||
      item.description?.includes('饰品')
    )
  )

  const slotNames: Record<string, string> = {
    weapon: '武器',
    armor: '护甲',
    accessory: '饰品'
  }

  const slotIcons: Record<string, string> = {
    weapon: '⚔️',
    armor: '🛡️',
    accessory: '💍'
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="game-panel max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-game-accent">🎒 装备管理</h2>
        
        {/* 当前装备 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-300">当前装备</h3>
          <div className="grid grid-cols-3 gap-3">
            {(['weapon', 'armor', 'accessory'] as const).map(slot => {
              const equip = player.equipment[slot]
              return (
                <div key={slot} className="bg-game-bg rounded-lg p-3 text-center">
                  <div className="text-2xl mb-2">{slotIcons[slot]}</div>
                  <div className="text-sm text-gray-400 mb-1">{slotNames[slot]}</div>
                  {equip ? (
                    <>
                      <div className="font-bold text-sm" style={{ color: QUALITY_COLORS[equip.quality] }}>
                        {equip.name}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {equip.attackBonus > 0 && `攻击+${equip.attackBonus} `}
                        {equip.defenseBonus > 0 && `防御+${equip.defenseBonus} `}
                        {equip.hpBonus > 0 && `HP+${equip.hpBonus}`}
                      </div>
                      <button
                        onClick={() => onUnequip(slot)}
                        className="mt-2 text-xs text-red-400 hover:text-red-300 underline"
                      >
                        卸下
                      </button>
                    </>
                  ) : (
                    <div className="text-gray-500 text-sm">未装备</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 可装备物品 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 text-gray-300">背包中的装备</h3>
          {equippableItems.length === 0 ? (
            <div className="text-gray-500 text-center py-4">背包中没有可装备的装备</div>
          ) : (
            <div className="space-y-2">
              {equippableItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-game-bg p-3 rounded">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {item.description?.includes('武器') ? '⚔️' : 
                       item.description?.includes('护甲') ? '🛡️' : '💍'}
                    </span>
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onEquip(item)}
                    className="game-button text-sm py-1 px-3"
                  >
                    装备
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 当前属性 */}
        <div className="bg-game-bg rounded-lg p-4 mb-4">
          <h3 className="text-sm font-bold mb-2 text-gray-400">当前属性</h3>
          <div className="grid grid-cols-4 gap-2 text-center text-sm">
            <div>
              <div className="text-gray-500">攻击</div>
              <div className="font-bold text-game-accent text-lg">{stats.attack}</div>
            </div>
            <div>
              <div className="text-gray-500">防御</div>
              <div className="font-bold text-blue-400 text-lg">{stats.defense}</div>
            </div>
            <div>
              <div className="text-gray-500">HP</div>
              <div className="font-bold text-green-400 text-lg">{stats.maxHp}</div>
            </div>
            <div>
              <div className="text-gray-500">暴击</div>
              <div className="font-bold text-yellow-400 text-lg">{(stats.critRate * 100).toFixed(0)}%</div>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full game-button-secondary py-2"
        >
          关闭
        </button>
      </div>
    </div>
  )
}

export default function Town() {
  const {
    player,
    gameLog,
    endDay,
    restAtCamp,
    navigateTo,
    openShop,
    equipItem,
    unequipItem,
  } = useGameStore()

  const [showEquipment, setShowEquipment] = useState(false)

  const stats = calculatePlayerStats(player)
  const payment = calculatePayment(player)

  const handleEquip = (item: Item) => {
    // 从 Item 转换回 Equipment
    const equipmentData: Equipment = {
      id: item.id,
      name: item.name,
      slot: item.description?.includes('武器') ? 'weapon' : 
            item.description?.includes('护甲') ? 'armor' : 'accessory',
      quality: 2, // 默认普通品质
      level: 1,
      attackBonus: 0,
      defenseBonus: 0,
      hpBonus: 0,
      critBonus: 0,
      dodgeBonus: 0,
      description: item.description || '',
    }
    
    // 从描述中解析属性
    const attackMatch = item.description?.match(/攻击\+(\d+)/)
    const defenseMatch = item.description?.match(/防御\+(\d+)/)
    const hpMatch = item.description?.match(/HP\+(\d+)/)
    
    if (attackMatch) equipmentData.attackBonus = parseInt(attackMatch[1])
    if (defenseMatch) equipmentData.defenseBonus = parseInt(defenseMatch[1])
    if (hpMatch) equipmentData.hpBonus = parseInt(hpMatch[1])
    
    equipItem(equipmentData)
  }

  return (
    <div className="min-h-screen p-6">
      {/* 装备管理弹窗 */}
      <EquipmentModal
        isOpen={showEquipment}
        onClose={() => setShowEquipment(false)}
        player={player}
        onEquip={handleEquip}
        onUnequip={unequipItem}
      />

      {/* 顶部标题栏 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-game-accent">
          🏰 关于负债不得不在地下城打工这件事
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => useGameStore.getState().saveGame()}
            disabled={!window.electronAPI}
            className="game-button-secondary text-sm disabled:opacity-50"
            title={window.electronAPI ? '保存游戏' : 'Electron 环境下可用'}
          >
            保存
          </button>
          <button
            onClick={() => navigateTo('main_menu')}
            className="game-button-secondary text-sm"
          >
            退出
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 左侧面板 */}
        <div className="col-span-4 space-y-4">
          {/* 角色信息 */}
          <div className="game-panel">
            <h2 className="text-xl font-bold mb-4 text-game-accent">
              {player.name} Lv.{player.level}
            </h2>
            
            {/* HP */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>HP</span>
                <span>{player.hp}/{stats.maxHp}</span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill hp-bar"
                  style={{ width: `${(player.hp / stats.maxHp) * 100}%` }}
                />
              </div>
            </div>

            {/* MP */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>MP</span>
                <span>{player.mp}/{stats.maxMp}</span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill mp-bar"
                  style={{ width: `${(player.mp / stats.maxMp) * 100}%` }}
                />
              </div>
            </div>

            {/* EXP */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>经验</span>
                <span>{player.exp}</span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill exp-bar"
                  style={{ width: `${(player.exp / (player.level * 20 + Math.pow(player.level - 1, 2) * 5)) * 100}%` }}
                />
              </div>
            </div>

            {/* 属性 */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-game-bg p-2 rounded">
                <span className="text-gray-400">攻击</span>
                <div className="text-lg font-bold">{stats.attack}</div>
              </div>
              <div className="bg-game-bg p-2 rounded">
                <span className="text-gray-400">防御</span>
                <div className="text-lg font-bold">{stats.defense}</div>
              </div>
              <div className="bg-game-bg p-2 rounded">
                <span className="text-gray-400">智力</span>
                <div className="text-lg font-bold">{stats.intelligence}</div>
              </div>
              <div className="bg-game-bg p-2 rounded">
                <span className="text-gray-400">暴击</span>
                <div className="text-lg font-bold">{(stats.critRate * 100).toFixed(0)}%</div>
              </div>
              <div className="bg-game-bg p-2 rounded">
                <span className="text-gray-400">闪避</span>
                <div className="text-lg font-bold">{(stats.dodgeRate * 100).toFixed(0)}%</div>
              </div>
            </div>

            {/* 装备管理按钮 */}
            <button
              onClick={() => setShowEquipment(true)}
              className="w-full mt-4 game-button-secondary py-2"
            >
              🎒 管理装备
            </button>
          </div>

          {/* 财务信息 */}
          <div className="game-panel">
            <h3 className="text-lg font-bold mb-3 text-game-gold">💰 财务状况</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">持有金币</span>
                <span className="text-game-gold font-bold text-xl">{player.gold.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">剩余债务</span>
                <span className="text-red-400 font-bold">{player.debt.toLocaleString()}</span>
              </div>
              <div className="border-t border-game-accent/20 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span>下期还款</span>
                  <span className={payment.remaining > 0 ? 'text-red-400' : 'text-green-400'}>
                    {payment.remaining.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  截止日期：第 {payment.deadlineDay} 天
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 中间面板 */}
        <div className="col-span-5 space-y-4">
          {/* 游戏状态 */}
          <div className="game-panel">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-sm text-gray-400">第 {player.day} 天 / 100 天</div>
                <div className="text-game-accent font-bold">今日剩余行动：{player.actionsLeft}/3</div>
              </div>
              <button
                onClick={endDay}
                className="game-button-secondary"
                disabled={player.day >= 100}
              >
                结束今天
              </button>
            </div>
            
            {/* 债务进度条 */}
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>债务偿还进度</span>
                <span>{((10000 - player.debt) / 100 * 100).toFixed(1)}%</span>
              </div>
              <div className="stat-bar">
                <div
                  className="stat-bar-fill debt-bar"
                  style={{ width: `${((10000 - player.debt) / 10000) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* 主要操作按钮 */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigateTo('theme_select')}
              disabled={player.actionsLeft <= 0 || player.hp <= 10}
              className="game-panel hover:border-game-accent transition-colors p-6 flex flex-col items-center gap-3 disabled:opacity-50"
            >
              <div className="text-4xl">⚔️</div>
              <div className="text-lg font-bold">地下城探险</div>
              <div className="text-xs text-gray-400">选择主题与层数</div>
            </button>

            <button
              onClick={restAtCamp}
              disabled={player.actionsLeft <= 0 || player.hp >= stats.maxHp}
              className="game-panel hover:border-game-accent transition-colors p-6 flex flex-col items-center gap-3 disabled:opacity-50"
            >
              <div className="text-4xl">🏕️</div>
              <div className="text-lg font-bold">营地休息</div>
              <div className="text-xs text-gray-400">消耗 1 行动</div>
            </button>

            <button
              onClick={openShop}
              className="game-panel hover:border-game-accent transition-colors p-6 flex flex-col items-center gap-3"
            >
              <div className="text-4xl">🏪</div>
              <div className="text-lg font-bold">商店</div>
              <div className="text-xs text-gray-400">不消耗行动</div>
            </button>

            <button
              onClick={() => navigateTo('settlement')}
              className="game-panel hover:border-game-accent transition-colors p-6 flex flex-col items-center gap-3"
            >
              <div className="text-4xl">💰</div>
              <div className="text-lg font-bold">还款</div>
              <div className="text-xs text-gray-400">提前还款</div>
            </button>
          </div>
        </div>

        {/* 右侧面板 - 日志 */}
        <div className="col-span-3">
          <div className="game-panel h-full">
            <h3 className="text-lg font-bold mb-3 text-game-accent">📜 冒险日志</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {gameLog.slice().reverse().map((log, index) => (
                <div
                  key={index}
                  className="text-sm p-2 bg-game-bg rounded border-l-2 border-game-accent/30"
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
