import { useState } from 'react'
import { useGameStore } from '../stores/gameStore'
import { QUALITY_COLORS } from '../../../core/models/Equipment'

export default function Shop() {
  const {
    player,
    shopItems,
    buyItem,
    sellItem,
    navigateTo,
  } = useGameStore()

  const [message, setMessage] = useState<string | null>(null)

  // 分离装备和消耗品
  const consumables = shopItems.filter(item => item.type === 'consumable')
  const equipments = shopItems.filter(item => item.type === 'equipment')

  const handleBuy = (item: typeof shopItems[0]) => {
    if (player.gold < item.price) {
      setMessage('金币不足！')
      setTimeout(() => setMessage(null), 2000)
      return
    }
    
    buyItem(item)
    setMessage(`成功购买 ${item.name}`)
    setTimeout(() => setMessage(null), 2000)
  }

  const handleSell = (item: typeof player.inventory[0]) => {
    // 检查是否是装备（通过description判断）
    const isEquip = item.description?.includes('武器') || 
                    item.description?.includes('护甲') || 
                    item.description?.includes('饰品')
    
    sellItem(item, isEquip)
    setMessage(`出售了 ${item.name}，获得 ${item.sellPrice} 金币`)
    setTimeout(() => setMessage(null), 2000)
  }

  return (
    <div className="min-h-screen p-6">
      {/* 消息提示 */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-game-accent text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
          {message}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-game-accent">🏪 商店</h1>
        <div className="flex items-center gap-4">
          <div className="text-xl">
            💰 <span className="text-game-gold font-bold">{player.gold.toLocaleString()}</span>
          </div>
          <button
            onClick={() => navigateTo('town')}
            className="game-button-secondary"
          >
            返回城镇
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 购买区域 */}
        <div className="game-panel">
          <h2 className="text-xl font-bold mb-4 text-game-accent">购买</h2>
          
          {/* 消耗品 */}
          <div className="mb-6">
            <h3 className="text-sm text-gray-400 mb-2">消耗品</h3>
            <div className="space-y-2">
              {consumables.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-game-bg p-3 rounded"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧪</span>
                    <div>
                      <div className="font-bold">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.id.includes('small') ? '回复 30 HP' : item.id.includes('medium') ? '回复 60 HP' : '回复 100 HP'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-game-gold">{item.price} G</span>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={player.gold < item.price}
                      className="game-button text-sm py-1 px-3 disabled:opacity-50"
                    >
                      购买
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 装备 */}
          <div>
            <h3 className="text-sm text-gray-400 mb-2">装备</h3>
            <div className="space-y-2">
              {equipments.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-game-bg p-3 rounded"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {item.equipment?.slot === 'weapon' ? '⚔️' : item.equipment?.slot === 'armor' ? '🛡️' : '💍'}
                    </span>
                    <div>
                      <div
                        className="font-bold"
                        style={{ color: item.equipment ? QUALITY_COLORS[item.equipment.quality] : 'white' }}
                      >
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.equipment?.attackBonus ? `攻击 +${item.equipment.attackBonus} ` : ''}
                        {item.equipment?.defenseBonus ? `防御 +${item.equipment.defenseBonus} ` : ''}
                        {item.equipment?.hpBonus ? `HP +${item.equipment.hpBonus} ` : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-game-gold">{item.price} G</span>
                    <button
                      onClick={() => handleBuy(item)}
                      disabled={player.gold < item.price}
                      className="game-button text-sm py-1 px-3 disabled:opacity-50"
                    >
                      购买
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 出售区域 */}
        <div className="game-panel">
          <h2 className="text-xl font-bold mb-4 text-game-accent">出售</h2>
          
          {/* 已装备 */}
          <div className="mb-4">
            <h3 className="text-sm text-gray-400 mb-2">已装备（需先卸下才能出售）</h3>
            <div className="space-y-2">
              {Object.entries(player.equipment).map(([slot, equip]) => (
                equip ? (
                  <div
                    key={equip.id}
                    className="flex justify-between items-center bg-game-bg p-3 rounded opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {slot === 'weapon' ? '⚔️' : slot === 'armor' ? '🛡️' : '💍'}
                      </span>
                      <div>
                        <div style={{ color: QUALITY_COLORS[equip.quality] }}>{equip.name}</div>
                        <div className="text-xs text-gray-500">已装备 - 请先在城镇卸下</div>
                      </div>
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          </div>

          {/* 背包 */}
          <div>
            <h3 className="text-sm text-gray-400 mb-2">背包（点击出售）</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {player.inventory.length === 0 ? (
                <div className="text-gray-500 text-center py-4">背包为空</div>
              ) : (
                player.inventory.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center bg-game-bg p-3 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {item.type === 'consumable' ? '🧪' : '📦'}
                      </span>
                      <div>
                        <div className="font-bold">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          数量: {item.quantity} | 售价: {item.sellPrice?.toLocaleString() ?? 0} G
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleSell(item)}
                      className="game-button-secondary text-sm py-1 px-3"
                    >
                      出售
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 提示 */}
      <div className="mt-6 game-panel text-center text-sm text-gray-400">
        💡 提示：购买的装备会自动放入背包，请在城镇点击"管理装备"进行穿戴
      </div>
    </div>
  )
}
