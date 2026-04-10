# 战斗系统增强详细方案

基于当前项目战斗系统（`src/core/systems/BattleSystem.ts`），提出以下增强方案，旨在提升战斗策略性和可玩性。

## 1. 技能系统

### 1.1 技能数据结构
```typescript
// 新增 Skill.ts 模型
export interface Skill {
  id: string
  name: string
  description: string
  type: 'active' | 'passive'
  category: 'physical' | 'magical' | 'support'
  mpCost?: number
  hpCost?: number
  cooldown: number // 回合冷却
  currentCooldown: number
  effects: SkillEffect[]
  requiredLevel: number
  requiredWeapon?: 'sword' | 'staff' | 'bow' | 'any'
}

export interface SkillEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'summon'
  target: 'self' | 'enemy' | 'ally' | 'all_enemies' | 'all_allies'
  value: number | string // 固定值或公式（如 "attack * 1.5"）
  duration?: number // 持续回合（buff/debuff）
  element?: 'none' | 'fire' | 'ice' | 'thunder' | 'wind' | 'earth'
  chance?: number // 触发概率（0-1）
}
```

### 1.2 技能学习与装备
- 玩家通过升级获得技能点，用于学习技能树中的技能
- 每个角色可装备最多4个主动技能和2个被动技能
- 被动技能提供常驻效果（如暴击率+5%）

### 1.3 技能示例
```typescript
// 示例技能数据
const SKILLS: Record<string, Skill> = {
  'power_slash': {
    id: 'power_slash',
    name: '强力斩击',
    description: '造成150%攻击力的物理伤害',
    type: 'active',
    category: 'physical',
    mpCost: 10,
    cooldown: 2,
    effects: [{
      type: 'damage',
      target: 'enemy',
      value: 'attack * 1.5',
      element: 'none'
    }],
    requiredLevel: 3,
    requiredWeapon: 'sword'
  },
  'fireball': {
    id: 'fireball',
    name: '火球术',
    description: '发射火球造成魔法伤害',
    type: 'active',
    category: 'magical',
    mpCost: 15,
    cooldown: 1,
    effects: [{
      type: 'damage',
      target: 'enemy',
      value: 'intelligence * 2',
      element: 'fire'
    }],
    requiredLevel: 5,
    requiredWeapon: 'staff'
  },
  'critical_boost': {
    id: 'critical_boost',
    name: '暴击强化',
    description: '被动：暴击率提升10%',
    type: 'passive',
    category: 'support',
    cooldown: 0,
    effects: [{
      type: 'buff',
      target: 'self',
      value: 10,
      duration: -1 // 永久
    }],
    requiredLevel: 7
  }
}
```

## 2. 魔法系统（MP系统）

### 2.1 魔法值属性
- 在Player模型中添加 `mp` 和 `maxMp` 属性
- 每次升级增加最大MP
- 战斗外可通过休息或药水恢复MP

### 2.2 MP恢复机制
- 每回合自动恢复少量MP（如最大值的5%）
- 使用技能消耗MP，MP不足时无法使用技能
- 添加MP恢复药水

## 3. 更多战斗行动

### 3.1 防御
- 效果：本回合受到的伤害减少50%
- 可用于应对Boss的强力攻击

### 3.2 蓄力
- 效果：下一次攻击伤害提升100%，但本回合无法行动
- 高风险高回报策略

### 3.3 逃跑增强
- 逃跑成功率受敏捷属性影响
- 逃跑失败本回合无法行动

### 3.4 技能使用
- 在战斗界面添加技能按钮，点击后显示技能列表
- 技能有冷却时间，需合理规划使用时机

## 4. 怪物属性相克系统

### 4.1 属性定义
```typescript
// 扩展 Monster 模型
export interface Monster {
  // ...现有属性
  element: 'none' | 'fire' | 'ice' | 'thunder' | 'wind' | 'earth'
  weaknesses: Element[] // 弱点属性（受到伤害+50%）
  resistances: Element[] // 抗性属性（受到伤害-50%）
  immunities: Element[] // 免疫属性（受到伤害为0）
}
```

### 4.2 相克关系
- 火克冰，冰克雷，雷克水，水克火（可自定义）
- 使用克制属性攻击伤害+50%，被克制属性攻击伤害-50%

### 4.3 UI显示
- 在怪物信息面板显示属性图标和弱点
- 使用克制属性时显示特效和提示

## 5. Boss战机制增强

### 5.1 多阶段Boss
- Boss在不同血量阶段变换形态和技能
- 例如：100%-50%血量为第一阶段，50%-0%为第二阶段

### 5.2 特殊技能
- Boss拥有独特技能，如召唤小怪、全屏攻击、 debuff
- 技能有冷却和预警提示

### 5.3 弱点系统
- Boss有特定弱点，攻击弱点造成额外伤害
- 弱点可能随阶段变化

### 5.4 环境互动
- 战斗场景中有可互动元素（如爆炸桶、陷阱）
- 利用环境可对Boss造成大量伤害

## 6. 实现步骤

### 6.1 第一阶段：基础框架（1-2周）
1. 创建 `Skill.ts` 模型和技能数据
2. 在Player模型中添加MP属性
3. 修改BattleState，支持技能和MP
4. 更新战斗UI，添加技能按钮

### 6.2 第二阶段：技能系统（2-3周）
1. 实现技能学习、装备功能
2. 实现技能效果（伤害、治疗、buff等）
3. 添加冷却系统
4. 创建技能配置文件

### 6.3 第三阶段：属性相克（1-2周）
1. 扩展Monster模型，添加属性字段
2. 修改伤害计算公式，考虑属性相克
3. 添加属性显示UI
4. 创建属性相克配置

### 6.4 第四阶段：Boss增强（2-3周）
1. 设计多阶段Boss机制
2. 实现Boss特殊技能
3. 添加弱点系统
4. 创建Boss配置文件

### 6.5 第五阶段：平衡与测试（1-2周）
1. 调整技能数值和冷却
2. 测试属性相克平衡性
3. 测试Boss难度
4. 收集反馈并优化

## 7. 数据配置建议

为了便于平衡调整，建议将以下数据外置为JSON或配置文件：
- 技能数据（伤害、消耗、冷却等）
- 属性相克关系
- Boss阶段和技能
- 怪物属性和抗性

## 8. 技术注意事项

1. **状态管理**：技能冷却、buff/debuff需要持久化到战斗状态中
2. **性能**：复杂技能效果可能影响战斗性能，需优化计算
3. **存档兼容**：添加新属性后需处理旧存档兼容性
4. **UI响应**：技能按钮需根据MP和冷却状态动态启用/禁用

## 9. 扩展可能性

1. **技能组合**：特定技能组合触发额外效果
2. **元素反应**：不同元素攻击产生反应（如火+雷=爆炸）
3. **宠物技能**：宠物拥有辅助技能
4. **装备技能**：特定装备提供技能
5. **技能升级**：重复使用技能提升等级，增强效果

## 10. 优先级建议

1. **技能系统**（核心战斗扩展）
2. **MP系统**（资源管理）
3. **属性相克**（策略深度）
4. **Boss增强**（挑战性）
5. **防御/蓄力**（战术选择）

此方案可显著提升战斗系统的策略性和可玩性，建议按阶段逐步实现。