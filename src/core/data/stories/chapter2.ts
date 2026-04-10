import type { StoryNode } from '../../systems/StorySystem'

// 第二章：暗流涌动（第11-20天）
export const chapter2Nodes: StoryNode[] = [
  // ========== 第11天 ==========
  {
    id: 'chapter2_11_shadow_appears',
    day: 11,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '【第二章：暗流涌动】' },
      { speaker: 'narrator', text: '（一个神秘人影在地下城出口处等待）' },
      { speaker: 'shadow', text: '你就是那个骗子担保人？有意思...', emotion: 'normal' },
      { speaker: 'shadow', text: '我叫暗影，专门做...特殊生意。', emotion: 'happy' },
      { speaker: 'shadow', text: '格雷顿那家伙在利用你们，你知道吗？', emotion: 'normal' },
    ],
    nextNode: 'chapter2_11_shadow_hint',
  },
  {
    id: 'chapter2_11_shadow_hint',
    day: 11,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'player', text: '什么意思？', emotion: 'worried' },
      { speaker: 'shadow', text: '那个红发女孩...莉莉对吧？格雷顿对她很感兴趣。', emotion: 'normal' },
      { speaker: 'shadow', text: '他在"养肥"她。而你，不过是负责饲养的工具罢了。', emotion: 'happy' },
      { speaker: 'lily', text: '（害怕地躲在主角身后）', emotion: 'worried' },
      { speaker: 'shadow', text: '呵呵...如果你想活着离开这里，最好小心点。', emotion: 'normal' },
      { speaker: 'shadow', text: '如果你需要...特殊帮助，可以来找我。', emotion: 'happy' },
    ],
    effects: [
      { type: 'modify_relationship', target: 'shadow', value: 10, description: '暗影好感度+10' },
      { type: 'set_flag', target: 'shadow_met', value: 1 },
    ],
  },
  
  // ========== 第12天 ==========
  {
    id: 'chapter2_12_loan_offer',
    day: 12,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'shadow', text: '看来你们的债务压力很大啊。', emotion: 'normal' },
      { speaker: 'shadow', text: '我可以提供...无息贷款。', emotion: 'happy' },
      { speaker: 'shadow', text: '2000金币，随时可以借。当然，利息嘛...每天10%。', emotion: 'happy' },
    ],
    choices: [
      {
        id: 'chapter2_12_take_loan',
        text: '借高利贷',
        effects: [
          { type: 'modify_gold', value: 2000, description: '获得2000金币' },
          { type: 'set_flag', target: 'has_shadow_loan', value: 1 },
          { type: 'modify_relationship', target: 'shadow', value: 5, description: '暗影好感度+5' },
          { type: 'modify_relationship', target: 'gredon', value: -10, description: '格雷顿好感度-10' },
        ],
        nextNode: 'chapter2_12_loan_taken',
        moralValue: -2,
      },
      {
        id: 'chapter2_12_refuse',
        text: '拒绝',
        effects: [
          { type: 'modify_relationship', target: 'shadow', value: -5, description: '暗影好感度-5' },
        ],
        nextNode: 'chapter2_12_refused',
        moralValue: 1,
      },
      {
        id: 'chapter2_12_lily_collateral',
        text: '以莉莉为抵押借款',
        effects: [
          { type: 'modify_gold', value: 3000, description: '获得3000金币' },
          { type: 'set_flag', target: 'lily_collateral', value: 1 },
          { type: 'modify_relationship', target: 'lily', value: -30, description: '莉莉好感度-30' },
          { type: 'modify_moral', value: -5, description: '道德值-5' },
        ],
        nextNode: 'chapter2_12_collateral_result',
        moralValue: -5,
      },
    ],
  },
  {
    id: 'chapter2_12_loan_taken',
    day: 12,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'shadow', text: '明智的选择。记住，债务可是会滚雪球的。', emotion: 'happy' },
      { speaker: 'lily', text: '（担忧）每天10%的利息...我们能还得起吗？', emotion: 'worried' },
    ],
  },
  {
    id: 'chapter2_12_refused',
    day: 12,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'shadow', text: '哼...固执。等你走投无路的时候，会回来找我的。', emotion: 'angry' },
    ],
  },
  {
    id: 'chapter2_12_collateral_result',
    day: 12,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'shadow', text: '哦？有意思...你比我想象的还要无情。我喜欢。', emotion: 'happy' },
      { speaker: 'lily', text: '（难以置信地看着主角）你...你把我抵押出去了？', emotion: 'surprised' },
      { speaker: 'lily', text: '（眼眶泛红）我...我明白了...在你眼里，我只是个工具...', emotion: 'sad' },
      { speaker: 'shadow', text: '小姑娘，这世界就是这样。别太天真了。', emotion: 'normal' },
    ],
  },
  
  // ========== 第13天 ==========
  {
    id: 'chapter2_13_lily_discovery',
    day: 13,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '那个...我昨天无意中经过格雷顿的书房...', emotion: 'worried' },
      { speaker: 'lily', text: '我看到了一幅画像...上面的人，长得好像我妈妈...', emotion: 'worried' },
      { speaker: 'player', text: '你妈妈？', emotion: 'surprised' },
      { speaker: 'lily', text: '嗯...虽然我不确定，但那眼睛、那头发...', emotion: 'worried' },
    ],
    effects: [
      { type: 'set_flag', target: 'lily_saw_portrait', value: 1 },
    ],
  },
  
  // ========== 第15天 ==========
  {
    id: 'chapter2_15_crisis',
    day: 15,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '（地下城第4层，突然遭遇精英怪物）' },
      { speaker: 'narrator', text: '（暗影魔狼将莉莉扑倒，爪子抵在她喉咙上）' },
      { speaker: 'lily', text: '救...救命！', emotion: 'worried' },
      { speaker: 'gredon', text: '（远处观望）让我看看你会怎么选，骗子。', emotion: 'normal' },
    ],
    choices: [
      {
        id: 'chapter2_15_save',
        text: '冲上去救她！',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: 25, description: '莉莉好感度+25' },
          { type: 'modify_moral', value: 3, description: '道德值+3' },
          { type: 'damage_player', value: 20, description: '主角受伤' },
          { type: 'set_flag', target: 'protector_trait', value: 1 },
        ],
        nextNode: 'chapter2_15_save_result',
        moralValue: 3,
      },
      {
        id: 'chapter2_15_negotiate',
        text: '冷静周旋',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: 5, description: '莉莉好感度+5' },
          { type: 'modify_gold', value: -200, description: '花费200金币' },
        ],
        nextNode: 'chapter2_15_negotiate_result',
        moralValue: 1,
      },
      {
        id: 'chapter2_15_abandon',
        text: '趁机逃跑',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: -50, description: '莉莉好感度-50' },
          { type: 'modify_moral', value: -5, description: '道德值-5' },
          { type: 'damage_player', value: 0, description: '莉莉重伤' },
          { type: 'set_flag', target: 'abandoned_lily', value: 1 },
        ],
        nextNode: 'chapter2_15_abandon_result',
        moralValue: -5,
      },
    ],
  },
  {
    id: 'chapter2_15_save_result',
    day: 15,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'player', text: '放开她！', emotion: 'angry' },
      { speaker: 'narrator', text: '（你拼尽全力击退了魔狼，但自己也受了伤）' },
      { speaker: 'lily', text: '（哭泣）谢谢你...我以为你会丢下我...', emotion: 'happy' },
      { speaker: 'lily', text: '我...我愿意相信你...不管别人怎么说你是骗子...', emotion: 'happy' },
    ],
  },
  {
    id: 'chapter2_15_negotiate_result',
    day: 15,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'player', text: '喂，怪物！放了她，我身上有更好吃的！', emotion: 'normal' },
      { speaker: 'narrator', text: '（你抛出金币引开了魔狼的注意力）' },
      { speaker: 'lily', text: '（惊魂未定）谢...谢谢...', emotion: 'worried' },
    ],
  },
  {
    id: 'chapter2_15_abandon_result',
    day: 15,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'player', text: '（心想）反正只是担保关系...', emotion: 'normal' },
      { speaker: 'narrator', text: '（你转身逃跑，留下莉莉在原地）' },
      { speaker: 'gredon', text: '（冷笑）呵，果然是个自私的骗子。', emotion: 'normal' },
      { speaker: 'lily', text: '（绝望地看着主角的背影）为什么...为什么要丢下我...', emotion: 'sad' },
      { speaker: 'narrator', text: '（契约反噬！你感到一阵剧痛，失去50%生命值）' },
    ],
  },
  
  // ========== 第16天 ==========
  {
    id: 'chapter2_16_irene_info',
    day: 16,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'irene', text: '你就是那个担保人吧？我有些事情要告诉你。', emotion: 'normal' },
      { speaker: 'irene', text: '格雷顿...他在收集契约师后裔。', emotion: 'worried' },
      { speaker: 'player', text: '契约师后裔？', emotion: 'surprised' },
      { speaker: 'irene', text: '古老的一种血脉，拥有强大的魔力。莉莉...很可能就是其中之一。', emotion: 'worried' },
      { speaker: 'irene', text: '小心点，格雷顿在策划什么大事。', emotion: 'worried' },
    ],
    effects: [
      { type: 'set_flag', target: 'knows_contractor_bloodline', value: 1 },
    ],
  },
  
  // ========== 第18天 ==========
  {
    id: 'chapter2_18_margaret_secret',
    day: 18,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    condition: (state: import('../../systems/StorySystem').StoryState) => state.relationshipState.relationships.margaret >= 30,
    dialogues: [
      { speaker: 'margaret', text: '你们要小心格雷顿...', emotion: 'worried' },
      { speaker: 'margaret', text: '他曾经有过妻子和孩子。但是...他们死在了地下城事故中。', emotion: 'sad' },
      { speaker: 'margaret', text: '从那以后，他就变了。他一直在寻找...复活死者的办法。', emotion: 'worried' },
      { speaker: 'player', text: '复活死者？', emotion: 'surprised' },
      { speaker: 'margaret', text: '契约师后裔的血...有强大的魔力。也许...', emotion: 'worried' },
    ],
    effects: [
      { type: 'set_flag', target: 'knows_gredon_past', value: 1 },
    ],
  },
  
  // ========== 第20天 ==========
  {
    id: 'chapter2_end',
    day: 20,
    chapter: 'chapter2',
    type: 'dialogue',
    priority: 10,
    isOneTime: true,
    condition: (state: import('../../systems/StorySystem').StoryState) => !state.completedNodes.includes('chapter2_end'),
    dialogues: [
      { speaker: 'narrator', text: '【第二章结束】\n阴谋的迷雾渐渐散开，格雷顿的真实目的开始浮出水面。莉莉的特殊身份，古老的契约师血脉...这一切究竟意味着什么？\n\n第21天开始，第三章：真相浮现' },
    ],
    effects: [
      { type: 'set_flag', target: 'chapter3_unlocked', value: 1 },
    ],
  },
]

// 导出所有第二章节点选择
export const chapter2NodeMap: Record<string, StoryNode> = chapter2Nodes.reduce((acc, node) => {
  acc[node.id] = node
  return acc
}, {} as Record<string, StoryNode>)
