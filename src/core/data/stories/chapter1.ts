import type { StoryNode } from '../../systems/StorySystem'

// 第一章：初入地下城（第4-10天）
export const chapter1Nodes: StoryNode[] = [
  // ========== 第4天 ==========
  {
    id: 'chapter1_4_enter',
    day: 4,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '【第一章：初入地下城】' },
      { speaker: 'lily', text: '我们...我们已经进入地下城第2层了。', emotion: 'worried' },
      { speaker: 'player', text: '怎么，害怕了？', emotion: 'normal' },
      { speaker: 'lily', text: '没、没有！我会努力不拖后腿的！', emotion: 'normal' },
    ],
    nextNode: 'chapter1_4_margaret',
  },
  {
    id: 'chapter1_4_margaret',
    day: 4,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '（回到城镇，酒馆老板娘玛格丽特叫住了你们）' },
      { speaker: 'margaret', text: '哟，新人！过来过来，姐姐请你们喝一杯。', emotion: 'happy' },
      { speaker: 'margaret', text: '听说格雷顿那家伙让你们当担保人了？真不容易啊...', emotion: 'worried' },
      { speaker: 'margaret', text: '有什么消息需要打听的，尽管来找我。这个镇上，没有我不知道的事。', emotion: 'happy' },
    ],
    effects: [
      { type: 'modify_relationship', target: 'margaret', value: 10, description: '玛格丽特好感度+10' },
      { type: 'set_flag', target: 'margaret_met', value: 1 },
    ],
  },
  
  // ========== 第5天 ==========
  {
    id: 'chapter1_5_nightmare',
    day: 5,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '（深夜，营地中传来莉莉的哭泣声）' },
      { speaker: 'lily', text: '妈妈...不要离开我...', emotion: 'sad' },
      { speaker: 'narrator', text: '（莉莉似乎在做噩梦）' },
    ],
    choices: [
      {
        id: 'chapter1_5_comfort',
        text: '安慰她',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: 15, description: '莉莉好感度+15' },
          { type: 'modify_moral', value: 2, description: '道德值+2' },
          { type: 'modify_relationship', target: 'lily', value: 0, description: '莉莉精神状态恢复' },
        ],
        nextNode: 'chapter1_5_comfort_result',
        moralValue: 2,
      },
      {
        id: 'chapter1_5_ignore',
        text: '假装没听到',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: -5, description: '莉莉好感度-5' },
        ],
        nextNode: 'chapter1_5_ignore_result',
        moralValue: -1,
      },
    ],
  },
  {
    id: 'chapter1_5_comfort_result',
    day: 5,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'player', text: '...做噩梦了？', emotion: 'normal' },
      { speaker: 'lily', text: '（惊醒）啊！对、对不起，吵醒你了...', emotion: 'worried' },
      { speaker: 'player', text: '...梦到你母亲了？', emotion: 'normal' },
      { speaker: 'lily', text: '嗯...她总是说，要我坚强地活下去...但我...', emotion: 'sad' },
      { speaker: 'player', text: '...至少你现在还活着。只要活着，就有希望。', emotion: 'normal' },
      { speaker: 'lily', text: '（抬起头，眼中闪着泪光）...谢谢你。', emotion: 'happy' },
    ],
  },
  {
    id: 'chapter1_5_ignore_result',
    day: 5,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '（你翻了个身继续睡觉，假装没听到）' },
      { speaker: 'narrator', text: '（莉莉的哭泣声渐渐停止，但她的精神状态似乎变差了）' },
    ],
  },
  
  // ========== 第6天 ==========
  {
    id: 'chapter1_6_treasure_rumor',
    day: 6,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'margaret', text: '听说了吗？地下城第10层有传说中的宝藏！', emotion: 'happy' },
      { speaker: 'margaret', text: '据说打败那里的BOSS，能获得一辈子都花不完的金币！', emotion: 'happy' },
      { speaker: 'lily', text: '第10层...那不是很危险吗？', emotion: 'worried' },
      { speaker: 'margaret', text: '当然危险啦！不过高风险高回报嘛~', emotion: 'normal' },
    ],
    choices: [
      {
        id: 'chapter1_6_interested',
        text: '听起来不错，我们可以试试。',
        effects: [
          { type: 'set_flag', target: 'wants_deep_dungeon', value: 1 },
          { type: 'modify_relationship', target: 'lily', value: -5, description: '莉莉好感度-5' },
        ],
        nextNode: 'chapter1_6_interested_result',
        moralValue: 0,
      },
      {
        id: 'chapter1_6_cautious',
        text: '太危险了，我们先稳扎稳打。',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: 5, description: '莉莉好感度+5' },
        ],
        nextNode: 'chapter1_6_cautious_result',
        moralValue: 1,
      },
    ],
  },
  {
    id: 'chapter1_6_interested_result',
    day: 6,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '但、但是第10层...那需要很强的实力才能去...', emotion: 'worried' },
      { speaker: 'player', text: '放心，我会保护你的。只要能还清债务，冒点险也值得。', emotion: 'normal' },
      { speaker: 'lily', text: '（低头）...好吧，如果你决定了，我会跟着你的...', emotion: 'worried' },
    ],
  },
  {
    id: 'chapter1_6_cautious_result',
    day: 6,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '（松了口气）太好了...我也觉得安全第一。', emotion: 'happy' },
      { speaker: 'player', text: '我们先把前5层摸熟，积累实力再说。', emotion: 'normal' },
      { speaker: 'margaret', text: '明智的选择！贪心的人通常都死在地下城深处了。', emotion: 'happy' },
    ],
  },
  
  // ========== 第7天 ==========
  {
    id: 'chapter1_7_tom_visit',
    day: 7,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'tom', text: '莉莉！你还好吗？', emotion: 'worried' },
      { speaker: 'lily', text: '汤姆！我没事的，别担心。', emotion: 'happy' },
      { speaker: 'tom', text: '（转向主角）喂，你这个骗子。莉莉虽然善良，但我可不会被骗。', emotion: 'angry' },
      { speaker: 'tom', text: '如果你敢欺负她，我一定不会放过你！', emotion: 'angry' },
    ],
    choices: [
      {
        id: 'chapter1_7_reassure',
        text: '我会保护好她的。',
        effects: [
          { type: 'modify_relationship', target: 'tom', value: 5, description: '汤姆好感度+5' },
          { type: 'modify_relationship', target: 'lily', value: 5, description: '莉莉好感度+5' },
        ],
        nextNode: 'chapter1_7_reassure_result',
        moralValue: 1,
      },
      {
        id: 'chapter1_7_mock',
        text: '管好你自己吧，胆小鬼。',
        effects: [
          { type: 'modify_relationship', target: 'tom', value: -10, description: '汤姆好感度-10' },
          { type: 'modify_relationship', target: 'lily', value: -5, description: '莉莉好感度-5' },
        ],
        nextNode: 'chapter1_7_mock_result',
        moralValue: -1,
      },
      {
        id: 'chapter1_7_silent',
        text: '（沉默）',
        effects: [],
        nextNode: 'chapter1_7_silent_result',
        moralValue: 0,
      },
    ],
  },
  {
    id: 'chapter1_7_reassure_result',
    day: 7,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'tom', text: '哼...最好是这样。莉莉，如果你被他欺负了，一定要告诉我。', emotion: 'normal' },
      { speaker: 'lily', text: '他其实...没你想的那么坏...', emotion: 'worried' },
      { speaker: 'tom', text: '（叹气）...你太善良了。好吧，我相信你。但如果他敢伤害你...', emotion: 'worried' },
    ],
  },
  {
    id: 'chapter1_7_mock_result',
    day: 7,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'tom', text: '你说什么？！', emotion: 'angry' },
      { speaker: 'lily', text: '汤姆，冷静点！拜托了...', emotion: 'worried' },
      { speaker: 'tom', text: '（咬牙切齿）...看在莉莉的面子上，这次放过你。', emotion: 'angry' },
    ],
  },
  {
    id: 'chapter1_7_silent_result',
    day: 7,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'tom', text: '...算了，我言尽于此。莉莉，小心点。', emotion: 'worried' },
      { speaker: 'lily', text: '嗯...谢谢你，汤姆。', emotion: 'normal' },
    ],
  },
  
  // ========== 第9天 ==========
  {
    id: 'chapter1_9_birthday',
    day: 9,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '（心不在焉）', emotion: 'sad' },
      { speaker: 'player', text: '怎么了？', emotion: 'normal' },
      { speaker: 'lily', text: '啊，没什么！只是在想事情...', emotion: 'worried' },
      { speaker: 'narrator', text: '（玛格丽特悄悄拉过你）' },
      { speaker: 'margaret', text: '今天是莉莉的生日哦。她肯定在想她妈妈了。', emotion: 'worried' },
    ],
    choices: [
      {
        id: 'chapter1_9_gift',
        text: '送她一份礼物',
        condition: (state: import('../../systems/StorySystem').StoryState) => state.relationshipState.storyFlags['prologue_3_give_potion'] !== undefined,
        effects: [
          { type: 'modify_relationship', target: 'lily', value: 20, description: '莉莉好感度+20' },
          { type: 'modify_moral', value: 3, description: '道德值+3' },
          { type: 'modify_gold', value: -200, description: '花费200金币' },
        ],
        nextNode: 'chapter1_9_gift_result',
        moralValue: 3,
      },
      {
        id: 'chapter1_9_forget',
        text: '假装不知道',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: -10, description: '莉莉好感度-10' },
        ],
        nextNode: 'chapter1_9_forget_result',
        moralValue: -1,
      },
    ],
  },
  {
    id: 'chapter1_9_gift_result',
    day: 9,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'player', text: '...生日快乐。', emotion: 'normal' },
      { speaker: 'lily', text: '诶？你怎么知道...', emotion: 'surprised' },
      { speaker: 'player', text: '酒馆老板娘说的。这是送你的礼物。', emotion: 'normal' },
      { speaker: 'lily', text: '（眼眶湿润）谢、谢谢你...这是我母亲去世后，第一次有人给我过生日...', emotion: 'happy' },
    ],
  },
  {
    id: 'chapter1_9_forget_result',
    day: 9,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '（你装作不知道，莉莉看起来很失望）' },
      { speaker: 'lily', text: '（叹气）...没什么，我们走吧。', emotion: 'sad' },
    ],
  },
  
  // ========== 第10天 ==========
  {
    id: 'chapter1_end',
    day: 10,
    chapter: 'chapter1',
    type: 'dialogue',
    priority: 10,
    isOneTime: true,
    condition: (state: import('../../systems/StorySystem').StoryState) => !state.completedNodes.includes('chapter1_end'),
    dialogues: [
      { speaker: 'narrator', text: '【第一章结束】\n你和莉莉已经在这个地下城世界生活了一周。债务的压力依旧沉重，但你们逐渐适应了这种生活。\n\n然而，暗流正在涌动...第11天开始，第二章：暗流涌动' },
    ],
    effects: [
      { type: 'set_flag', target: 'chapter2_unlocked', value: 1 },
    ],
  },
]

// 导出所有第一章节点选择
export const chapter1NodeMap: Record<string, StoryNode> = chapter1Nodes.reduce((acc, node) => {
  acc[node.id] = node
  return acc
}, {} as Record<string, StoryNode>)
