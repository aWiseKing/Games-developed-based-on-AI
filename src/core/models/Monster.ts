export interface Monster {
  id: string
  name: string
  level: number
  hp: number
  maxHp: number
  attack: number
  defense: number
  expReward: number
  goldReward: number
  dropTable: Array<{
    itemId: string
    probability: number
  }>
}

// 根据地下城层数生成怪物
export function generateMonster(floor: number): Monster {
  const monsterTypes = [
    { name: '史莱姆', baseHp: 30, baseAttack: 5, baseDefense: 2, exp: 5, gold: 10 },
    { name: '哥布林', baseHp: 40, baseAttack: 8, baseDefense: 3, exp: 8, gold: 15 },
    { name: '骷髅兵', baseHp: 50, baseAttack: 10, baseDefense: 5, exp: 12, gold: 20 },
    { name: '史莱姆王', baseHp: 80, baseAttack: 12, baseDefense: 6, exp: 20, gold: 35 },
    { name: '哥布林战士', baseHp: 70, baseAttack: 15, baseDefense: 8, exp: 25, gold: 40 },
    { name: '暗影狼', baseHp: 60, baseAttack: 18, baseDefense: 4, exp: 22, gold: 38 },
    { name: '兽人', baseHp: 100, baseAttack: 20, baseDefense: 10, exp: 35, gold: 55 },
    { name: '黑暗骑士', baseHp: 150, baseAttack: 25, baseDefense: 15, exp: 50, gold: 80 },
    { name: '深渊恶魔', baseHp: 200, baseAttack: 35, baseDefense: 20, exp: 80, gold: 120 },
    { name: '龙王', baseHp: 500, baseAttack: 50, baseDefense: 30, exp: 200, gold: 350 },
  ]

  // 根据层数选择怪物类型
  const typeIndex = Math.min(Math.floor((floor - 1) / 1), monsterTypes.length - 1)
  const type = monsterTypes[typeIndex]
  
  // 根据层数调整数值
  const levelMultiplier = 1 + (floor - 1) * 0.15
  
  const level = Math.max(1, Math.floor(floor * 0.8 + Math.random() * floor * 0.5))
  const maxHp = Math.floor(type.baseHp * levelMultiplier)
  
  return {
    id: `monster_${Date.now()}_${Math.random()}`,
    name: type.name,
    level,
    hp: maxHp,
    maxHp,
    attack: Math.floor(type.baseAttack * levelMultiplier),
    defense: Math.floor(type.baseDefense * levelMultiplier),
    expReward: Math.floor(type.exp * levelMultiplier),
    goldReward: Math.floor(type.gold * levelMultiplier * (0.9 + Math.random() * 0.2)),
    dropTable: [
      { itemId: 'potion_small', probability: 0.3 },
      { itemId: 'equipment_random', probability: 0.15 },
    ],
  }
}

// 获取 BOSS 怪物
export function generateBoss(floor: number): Monster {
  const boss = generateMonster(floor)
  return {
    ...boss,
    name: `${boss.name}首领`,
    hp: Math.floor(boss.hp * 1.5),
    maxHp: Math.floor(boss.maxHp * 1.5),
    attack: Math.floor(boss.attack * 1.3),
    expReward: Math.floor(boss.expReward * 2),
    goldReward: Math.floor(boss.goldReward * 2),
  }
}
