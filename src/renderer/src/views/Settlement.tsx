import { useState } from 'react'
import { useGameStore } from '../stores/gameStore'
import { calculatePayment } from '../../../core/systems/EconomySystem'

export default function Settlement() {
  const { player, makePayment, navigateTo } = useGameStore()
  const [paymentAmount, setPaymentAmount] = useState('')

  const payment = calculatePayment(player)

  const handlePayment = () => {
    const amount = parseInt(paymentAmount)
    if (amount > 0) {
      makePayment(amount)
      setPaymentAmount('')
    }
  }

  const handleFullPayment = () => {
    const amount = Math.min(player.gold, payment.remaining > 0 ? payment.remaining : player.debt)
    makePayment(amount)
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="game-panel max-w-lg w-full">
        <h1 className="text-3xl font-bold text-game-accent mb-6 text-center">
          💰 债务还款
        </h1>

        {/* 当前债务状态 */}
        <div className="bg-game-bg p-4 rounded mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">总债务</span>
            <span className="text-red-400 font-bold">{player.debt.toLocaleString()} G</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">持有金币</span>
            <span className="text-game-gold font-bold">{player.gold.toLocaleString()} G</span>
          </div>
          <div className="border-t border-game-accent/20 my-2" />
          <div className="flex justify-between">
            <span className="text-gray-400">当前阶段</span>
            <span>第 {payment.stageIndex + 1} / 5 阶段</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">阶段截止</span>
            <span>第 {payment.deadlineDay} 天</span>
          </div>
        </div>

        {/* 本期还款信息 */}
        <div className="bg-game-bg p-4 rounded mb-6">
          <h3 className="text-lg font-bold mb-3 text-game-accent">本期还款</h3>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">最低还款额</span>
            <span className="font-bold">{payment.minimumPayment.toLocaleString()} G</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">已还</span>
            <span className="text-green-400">{payment.alreadyPaid.toLocaleString()} G</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-400">还需还款</span>
            <span className={payment.remaining > 0 ? 'text-red-400 font-bold' : 'text-green-400'}>
              {payment.remaining.toLocaleString()} G
            </span>
          </div>
          {payment.remaining > 0 && (
            <div className="mt-3 text-xs text-yellow-400 bg-yellow-400/10 p-2 rounded">
              ⚠️ 若截止时未还清，未还部分将产生 25% 利息
            </div>
          )}
        </div>

        {/* 还款操作 */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder="输入还款金额"
              className="flex-1 bg-game-bg border border-game-accent/30 rounded px-4 py-2 text-white focus:outline-none focus:border-game-accent"
            />
            <button
              onClick={handlePayment}
              disabled={!paymentAmount || parseInt(paymentAmount) <= 0 || parseInt(paymentAmount) > player.gold}
              className="game-button disabled:opacity-50"
            >
              还款
            </button>
          </div>

          <button
            onClick={handleFullPayment}
            disabled={player.gold <= 0 || player.debt <= 0}
            className="w-full game-button disabled:opacity-50"
          >
            还清本期 ({Math.min(player.gold, payment.remaining > 0 ? payment.remaining : player.debt).toLocaleString()} G)
          </button>

          <button
            onClick={() => navigateTo('town')}
            className="w-full game-button-secondary"
          >
            返回城镇
          </button>
        </div>

        {/* 还款历史 */}
        <div className="mt-6">
          <h3 className="text-sm text-gray-400 mb-2">还款历史</h3>
          <div className="grid grid-cols-5 gap-2">
            {player.repaidHistory.map((paid, index) => (
              <div
                key={index}
                className={`text-center p-2 rounded text-sm ${
                  index < payment.stageIndex
                    ? paid >= [1000, 2000, 2500, 3000, 0][index]
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                    : index === payment.stageIndex
                    ? 'bg-game-accent/20 text-game-accent'
                    : 'bg-game-bg text-gray-500'
                }`}
              >
                <div className="text-xs text-gray-500">{[20, 40, 60, 80, 100][index]}天</div>
                <div>{paid.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
