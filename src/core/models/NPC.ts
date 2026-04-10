// NPC角色类型
export type NPCId = 'lily' | 'gredon' | 'margaret' | 'shadow' | 'tom' | 'irene' | 'jack'

// NPC基础信息
export interface NPC {
  id: NPCId
  name: string
  title: string
  description: string
  avatar?: string // 头像资源路径
}

// 好感度等级
export type RelationshipLevel = 'hostile' | 'unfriendly' | 'neutral' | 'friendly' | 'trust' | 'bond'

// 好感度配置
export const RELATIONSHIP_LEVELS: Record<RelationshipLevel, { min: number; max: number; label: string }> = {
  hostile: { min: -100, max: -50, label: '敌对' },
  unfriendly: { min: -50, max: 0, label: '不友好' },
  neutral: { min: 0, max: 30, label: '普通' },
  friendly: { min: 30, max: 60, label: '友好' },
  trust: { min: 60, max: 80, label: '信任' },
  bond: { min: 80, max: 100, label: '羁绊' },
}

// 获取好感度等级
export function getRelationshipLevel(value: number): RelationshipLevel {
  if (value < -50) return 'hostile'
  if (value < 0) return 'unfriendly'
  if (value < 30) return 'neutral'
  if (value < 60) return 'friendly'
  if (value < 80) return 'trust'
  return 'bond'
}

// NPC数据库
export const NPC_DATABASE: Record<NPCId, NPC> = {
  lily: {
    id: 'lily',
    name: '莉莉',
    title: '被担保人',
    description: '17岁的红发少女，原本是小镇药剂师学徒。母亲重病时为买药借了高利贷，结果母亲去世，债务却越滚越大。善良、坚强但胆小，擅长治疗和草药知识。',
  },
  gredon: {
    id: 'gredon',
    name: '格雷顿',
    title: '债主',
    description: '地下城公会的高阶成员，也是地下城的实际掌控者之一。冷酷、精于算计，但也有自己的原则。表面上是逼迫主角还债的恶人，实际上有着不为人知的秘密。',
  },
  margaret: {
    id: 'margaret',
    name: '玛格丽特',
    title: '酒馆老板娘',
    description: '小镇酒馆的老板娘，格雷顿的前妻（已离婚）。热情、消息灵通，同情负债者，暗中帮助主角和莉莉。',
  },
  shadow: {
    id: 'shadow',
    name: '暗影',
    title: '神秘商人',
    description: '黑市商人，似乎是格雷顿的对头。神秘、亦正亦邪，对主角的骗术很欣赏。提供高风险高回报的交易。',
  },
  tom: {
    id: 'tom',
    name: '汤姆',
    title: '战士',
    description: '正直但运气不好的战士，莉莉的青梅竹马（暗恋莉莉）。',
  },
  irene: {
    id: 'irene',
    name: '艾琳',
    title: '法师',
    description: '聪明但有些自私的法师，知道格雷顿的一些内幕。',
  },
  jack: {
    id: 'jack',
    name: '杰克',
    title: '盗贼',
    description: '狡猾的盗贼，知道如何逃避债务，但警告主角不要信任格雷顿。',
  },
}

// 获取NPC信息
export function getNPC(id: NPCId): NPC {
  return NPC_DATABASE[id]
}
