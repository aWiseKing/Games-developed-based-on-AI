import type { StoryNode } from '../../systems/StorySystem'

// 第三章：真相浮现（第21-28天）
export const chapter3Nodes: StoryNode[] = [
  // ========== 第21天 ==========
  {
    id: 'chapter3_21_truth',
    day: 21,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '【第三章：真相浮现】' },
      { speaker: 'narrator', text: '（你潜入格雷顿的书房，发现了惊人的秘密）' },
      { speaker: 'narrator', text: '（一本古老的典籍记载着：契约师后裔的血液可以打开生死之门）' },
      { speaker: 'player', text: '这是...', emotion: 'surprised' },
    ],
    nextNode: 'chapter3_21_discovery',
  },
  {
    id: 'chapter3_21_discovery',
    day: 21,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'gredon', text: '（突然出现）看来你发现了不少东西。', emotion: 'normal' },
      { speaker: 'player', text: '格雷顿！你到底想对莉莉做什么？', emotion: 'angry' },
      { speaker: 'gredon', text: '...既然你都知道了，那我也没什么好隐瞒的。', emotion: 'sad' },
      { speaker: 'gredon', text: '莉莉是古代契约师的后裔，她的血液有复活死者的力量。', emotion: 'normal' },
      { speaker: 'gredon', text: '我需要她...来复活我的妻子。', emotion: 'sad' },
    ],
    nextNode: 'chapter3_21_gredon_truth',
  },
  {
    id: 'chapter3_21_gredon_truth',
    day: 21,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 80,
    isOneTime: true,
    dialogues: [
      { speaker: 'player', text: '复活你的妻子？你在说什么疯话！', emotion: 'angry' },
      { speaker: 'gredon', text: '（痛苦地闭上眼睛）五年前，我妻子和孩子一起死在了地下城崩塌中...', emotion: 'sad' },
      { speaker: 'gredon', text: '我花了五年时间寻找办法...终于发现了契约师血脉的秘密。', emotion: 'normal' },
      { speaker: 'gredon', text: '莉莉是我最后的希望。', emotion: 'sad' },
    ],
    effects: [
      { type: 'set_flag', target: 'knows_full_truth', value: 1 },
    ],
  },
  
  // ========== 第22天 ==========
  {
    id: 'chapter3_22_lily_reaction',
    day: 22,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    condition: (state: import('../../systems/StorySystem').StoryState) => state.relationshipState.storyFlags['knows_full_truth'] === true,
    dialogues: [
      { speaker: 'player', text: '莉莉...我有事情要告诉你。', emotion: 'worried' },
      { speaker: 'lily', text: '...是关于我的身世吗？我昨天也做了那个奇怪的梦。', emotion: 'worried' },
      { speaker: 'lily', text: '梦里有人告诉我...我是古代契约师的后裔...', emotion: 'worried' },
      { speaker: 'player', text: '格雷顿他...想用你来复活他的妻子。', emotion: 'sad' },
    ],
    choices: [
      {
        id: 'chapter3_22_protect',
        text: '我一定会保护你的',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: 15, description: '莉莉好感度+15' },
          { type: 'set_flag', target: 'vow_to_protect', value: 1 },
        ],
        nextNode: 'chapter3_22_protect_result',
        moralValue: 2,
      },
      {
        id: 'chapter3_22_think',
        text: '我们需要想办法',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: 5, description: '莉莉好感度+5' },
        ],
        nextNode: 'chapter3_22_think_result',
        moralValue: 1,
      },
    ],
  },
  {
    id: 'chapter3_22_protect_result',
    day: 22,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '（眼泪流下）...谢谢你。虽然你是骗子，但...你是第一个愿意保护我的人。', emotion: 'happy' },
      { speaker: 'lily', text: '我愿意相信你...不管发生什么。', emotion: 'happy' },
    ],
  },
  {
    id: 'chapter3_22_think_result',
    day: 22,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '嗯...我相信你一定能想出办法的。', emotion: 'normal' },
    ],
  },
  
  // ========== 第23天 ==========
  {
    id: 'chapter3_23_plan',
    day: 23,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'shadow', text: '看来你们都知道真相了。', emotion: 'normal' },
      { speaker: 'shadow', text: '想救那小姑娘吗？我给你们指条路。', emotion: 'happy' },
      { speaker: 'shadow', text: '第10层的BOSS——莫拉格斯，它的核心可以打破契约。', emotion: 'normal' },
      { speaker: 'shadow', text: '但是...那需要你们有足够的实力。', emotion: 'normal' },
      { speaker: 'player', text: '你有什么目的？', emotion: 'worried' },
      { speaker: 'shadow', text: '（笑）我只是喜欢看戏罢了。', emotion: 'happy' },
    ],
    effects: [
      { type: 'set_flag', target: 'knows_moraguss_solution', value: 1 },
    ],
  },
  
  // ========== 第25天 ==========
  {
    id: 'chapter3_25_confrontation',
    day: 25,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'gredon', text: '时间快到了。第30天，仪式就要开始了。', emotion: 'normal' },
      { speaker: 'gredon', text: '我知道你发现了真相。', emotion: 'normal' },
      { speaker: 'gredon', text: '但是...你也应该理解我。失去挚爱是什么感觉。', emotion: 'sad' },
    ],
    choices: [
      {
        id: 'chapter3_25_oppose',
        text: '我不会让你伤害莉莉',
        effects: [
          { type: 'modify_relationship', target: 'gredon', value: -30, description: '格雷顿好感度-30' },
          { type: 'set_flag', target: 'opposes_gredon', value: 1 },
        ],
        nextNode: 'chapter3_25_oppose_result',
        moralValue: 3,
      },
      {
        id: 'chapter3_25_negotiate',
        text: '一定有别的办法',
        effects: [
          { type: 'modify_relationship', target: 'gredon', value: -10, description: '格雷顿好感度-10' },
          { type: 'set_flag', target: 'seeks_alternative', value: 1 },
        ],
        nextNode: 'chapter3_25_negotiate_result',
        moralValue: 2,
      },
      {
        id: 'chapter3_25_betray',
        text: '也许我们可以合作',
        condition: (state: import('../../systems/StorySystem').StoryState) => state.relationshipState.moralValue < -20,
        effects: [
          { type: 'modify_relationship', target: 'gredon', value: 10, description: '格雷顿好感度+10' },
          { type: 'modify_relationship', target: 'lily', value: -20, description: '莉莉好感度-20' },
          { type: 'set_flag', target: 'considers_betrayal', value: 1 },
        ],
        nextNode: 'chapter3_25_betray_result',
        moralValue: -3,
      },
    ],
  },
  {
    id: 'chapter3_25_oppose_result',
    day: 25,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'gredon', text: '（叹息）...我就知道会这样。', emotion: 'sad' },
      { speaker: 'gredon', text: '那么，我们就用实力说话吧。', emotion: 'angry' },
      { speaker: 'gredon', text: '第30天，我会亲自来抓她。', emotion: 'normal' },
    ],
  },
  {
    id: 'chapter3_25_negotiate_result',
    day: 25,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'gredon', text: '别的办法？我找遍了所有古籍...', emotion: 'sad' },
      { speaker: 'gredon', text: '但是...如果你真的能想出别的办法...', emotion: 'worried' },
      { speaker: 'gredon', text: '我愿意听。但时间不多了。', emotion: 'normal' },
    ],
  },
  {
    id: 'chapter3_25_betray_result',
    day: 25,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'gredon', text: '（惊讶地看着你）...你认真的？', emotion: 'surprised' },
      { speaker: 'gredon', text: '哈哈...有意思。你比我想象的还要无情。', emotion: 'happy' },
      { speaker: 'gredon', text: '好！事成之后，我可以免除你的债务。', emotion: 'normal' },
    ],
  },
  
  // ========== 第27天 ==========
  {
    id: 'chapter3_27_preparation',
    day: 27,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '（距离最后期限只剩3天了）' },
      { speaker: 'lily', text: '明天...就是最后了。', emotion: 'worried' },
      { speaker: 'lily', text: '不管发生什么...谢谢你这段时间的保护。', emotion: 'happy' },
    ],
    choices: [
      {
        id: 'chapter3_27_reassure',
        text: '我们一定能度过难关',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: 10, description: '莉莉好感度+10' },
          { type: 'modify_relationship', target: 'lily', value: 0, description: '莉莉精神状态提升' },
        ],
        nextNode: 'chapter3_27_reassure_result',
        moralValue: 1,
      },
      {
        id: 'chapter3_27_plan',
        text: '明天我们必须打败莫拉格斯',
        condition: (state: import('../../systems/StorySystem').StoryState) => state.relationshipState.storyFlags['knows_moraguss_solution'] === true,
        effects: [
          { type: 'set_flag', target: 'plans_moraguss_battle', value: 1 },
        ],
        nextNode: 'chapter3_27_plan_result',
        moralValue: 1,
      },
    ],
  },
  {
    id: 'chapter3_27_reassure_result',
    day: 27,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '嗯！我相信你！', emotion: 'happy' },
      { speaker: 'lily', text: '不管发生什么...我们一起面对！', emotion: 'happy' },
    ],
  },
  {
    id: 'chapter3_27_plan_result',
    day: 27,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '莫拉格斯...第10层的BOSS...', emotion: 'worried' },
      { speaker: 'lily', text: '但我们没有别的选择了，对吗？', emotion: 'normal' },
      { speaker: 'lily', text: '好！明天我们就去第10层！', emotion: 'happy' },
    ],
  },
  
  // ========== 第28天 ==========
  {
    id: 'chapter3_end',
    day: 28,
    chapter: 'chapter3',
    type: 'dialogue',
    priority: 10,
    isOneTime: true,
    condition: (state: import('../../systems/StorySystem').StoryState) => !state.completedNodes.includes('chapter3_end'),
    dialogues: [
      { speaker: 'narrator', text: '【第三章结束】\n真相已经浮现，最后的抉择即将到来。\n\n明天，就是命运的第30天。' },
    ],
    effects: [
      { type: 'set_flag', target: 'finale_unlocked', value: 1 },
    ],
  },
]

// 导出所有第三章节点选择
export const chapter3NodeMap: Record<string, StoryNode> = chapter3Nodes.reduce((acc, node) => {
  acc[node.id] = node
  return acc
}, {} as Record<string, StoryNode>)
