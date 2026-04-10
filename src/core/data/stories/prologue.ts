import type { StoryNode } from '../../systems/StorySystem'

// 序章：天降横祸（第1-3天）
export const prologueNodes: StoryNode[] = [
  // ========== 第1天 ==========
  {
    id: 'prologue_1_intro',
    day: 1,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '（热闹的酒馆，主角正在向商人兜售假药）' },
      { speaker: 'player', text: '这可是从地下城深处采来的神药，包治百病！只要500金币！' },
      { speaker: 'narrator', text: '（格雷顿突然现身，揭穿骗局）' },
    ],
    nextNode: 'prologue_1_gredon_arrives',
  },
  {
    id: 'prologue_1_gredon_arrives',
    day: 1,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'gredon', text: '小子，这种把戏我见多了。假药卖了不少钱吧？', emotion: 'angry' },
      { speaker: 'player', text: '（糟糕，被发现了）你...你是谁？', emotion: 'worried' },
      { speaker: 'gredon', text: '地下城公会的格雷顿。两个选择：要么坐牢，要么接受我的"提议"。', emotion: 'normal' },
    ],
    nextNode: 'prologue_1_meet_lily',
  },
  {
    id: 'prologue_1_meet_lily',
    day: 1,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 80,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '（主角被带到地牢，看到角落里蜷缩的红发少女）' },
      { speaker: 'gredon', text: '介绍一下，这是莉莉。跟你一样，欠了债还不起。从今天起，你成为她的担保人。', emotion: 'normal' },
      { speaker: 'player', text: '担保人？什么意思？', emotion: 'worried' },
      { speaker: 'gredon', text: '意思是——你们俩的命运绑定了。她死，你也完蛋。30天内还清10000金币，否则...你们都会成为地下城的"祭品"。', emotion: 'angry' },
      { speaker: 'lily', text: '（颤抖）请...请救救我...', emotion: 'sad' },
    ],
    choices: [
      {
        id: 'prologue_choice_protect',
        text: '我...我会保护她的。',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: 5, description: '莉莉好感度+5' },
          { type: 'modify_moral', value: 1, description: '道德值+1' },
        ],
        nextNode: 'prologue_1_contract',
        moralValue: 1,
      },
      {
        id: 'prologue_choice_refuse',
        text: '凭什么要我管她？',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: -10, description: '莉莉好感度-10' },
          { type: 'modify_moral', value: -1, description: '道德值-1' },
          { type: 'modify_relationship', target: 'gredon', value: -5, description: '格雷顿好感度-5' },
        ],
        nextNode: 'prologue_1_contract_forced',
        moralValue: -1,
      },
      {
        id: 'prologue_choice_silent',
        text: '（沉默）',
        effects: [],
        nextNode: 'prologue_1_contract',
        moralValue: 0,
      },
    ],
  },
  {
    id: 'prologue_1_contract',
    day: 1,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 70,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '（魔法光芒将主角和莉莉连接）' },
      { speaker: 'gredon', text: '游戏开始，骗子。让我看看，你是会继续骗人，还是学会承担责任。', emotion: 'normal' },
      { speaker: 'narrator', text: '【获得：莉莉的信赖（初始好感度10）】\n【获得：破旧的剑 x1，治疗药水 x3】\n【莉莉加入队伍】' },
      { speaker: 'lily', text: '那个...谢谢你愿意成为我的担保人。虽然我...我知道你是骗子，但是...', emotion: 'worried' },
      { speaker: 'player', text: '...少说废话。从今天开始，你跟着我下地下城打工还债。', emotion: 'normal' },
      { speaker: 'lily', text: '嗯！我会努力的！虽然我不能战斗，但是我会治疗和草药知识...', emotion: 'happy' },
    ],
    effects: [
      { type: 'add_item', target: 'sword_old', value: 1 },
      { type: 'add_item', target: 'potion_heal', value: 3 },
      { type: 'set_flag', target: 'lily_joined', value: 1 },
      { type: 'set_flag', target: 'tutorial_enabled', value: 1 },
    ],
  },
  {
    id: 'prologue_1_contract_forced',
    day: 1,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 70,
    isOneTime: true,
    dialogues: [
      { speaker: 'gredon', text: '你没得选，小子。契约已经成立了。', emotion: 'angry' },
      { speaker: 'narrator', text: '（魔法光芒强行将主角和莉莉连接）' },
      { speaker: 'gredon', text: '游戏开始。记住，她死了，你也活不了。', emotion: 'normal' },
      { speaker: 'lily', text: '（低着头，不敢看主角）对不起...连累你了...', emotion: 'sad' },
    ],
    effects: [
      { type: 'add_item', target: 'sword_old', value: 1 },
      { type: 'add_item', target: 'potion_heal', value: 3 },
      { type: 'set_flag', target: 'lily_joined', value: 1 },
    ],
  },
  
  // ========== 第2天 ==========
  {
    id: 'prologue_2_first_dungeon',
    day: 2,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '那个...今天我们真的要进地下城吗？', emotion: 'worried' },
      { speaker: 'player', text: '不然呢？待在这里债务又不会自己消失。', emotion: 'normal' },
      { speaker: 'lily', text: '我、我明白了！我会努力的！虽然我很弱...但是我会尽力不拖后腿！', emotion: 'normal' },
      { speaker: 'narrator', text: '（莉莉的治疗能力：在非战斗状态下，每天可以使用3次治疗，每次回复30点生命值）' },
    ],
    nextNode: 'prologue_2_tutorial',
  },
  {
    id: 'prologue_2_tutorial',
    day: 2,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '【教学：行动系统】\n每天你有3个行动点，可以用于：\n- 探索地下城（消耗1点）\n- 休息（消耗1点，回复生命值）\n- 访问商店\n行动点耗尽后必须结束这一天。' },
      { speaker: 'narrator', text: '【教学：契约系统】\n你和莉莉通过魔法契约绑定：\n- 如果莉莉死亡，你将受到契约反噬（失去50%生命值）\n- 莉莉的精神状态会影响她的治疗效果\n- 保护好她，也是在保护你自己' },
      { speaker: 'narrator', text: '【教学：债务系统】\n每20天需要进行一次还款，每次至少2000金币。\n如果无法还款，债务会累积利息。\n第100天必须还清所有债务！' },
    ],
    effects: [
      { type: 'set_flag', target: 'tutorial_completed', value: 1 },
    ],
  },
  
  // ========== 第3天 ==========
  {
    id: 'prologue_3_lily_request',
    day: 3,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    condition: (state: import('../../systems/StorySystem').StoryState) => state.relationshipState.relationships.lily > -10,
    dialogues: [
      { speaker: 'lily', text: '那个...有件事想请求你...', emotion: 'worried' },
      { speaker: 'player', text: '什么事？', emotion: 'normal' },
      { speaker: 'lily', text: '我的青梅竹马汤姆也在地下城打工还债。他昨天受伤了，但是没钱买治疗药水...', emotion: 'sad' },
      { speaker: 'lily', text: '如果你愿意把最后一瓶治疗药水给他...我会很感激的...', emotion: 'worried' },
    ],
    choices: [
      {
        id: 'prologue_3_give_potion',
        text: '好吧，给他吧。',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: 10, description: '莉莉好感度+10' },
          { type: 'modify_relationship', target: 'tom', value: 15, description: '汤姆好感度+15' },
          { type: 'modify_moral', value: 2, description: '道德值+2' },
          { type: 'add_item', target: 'potion_heal', value: -1 },
        ],
        nextNode: 'prologue_3_give_potion_result',
        moralValue: 2,
      },
      {
        id: 'prologue_3_refuse_potion',
        text: '不行，我们自己还不够用。',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: -5, description: '莉莉好感度-5' },
          { type: 'modify_moral', value: -1, description: '道德值-1' },
        ],
        nextNode: 'prologue_3_refuse_potion_result',
        moralValue: -1,
      },
      {
        id: 'prologue_3_condition',
        text: '可以，但让他欠我一个人情。',
        effects: [
          { type: 'modify_relationship', target: 'lily', value: -5, description: '莉莉好感度-5' },
          { type: 'set_flag', target: 'tom_owe_favor', value: 1 },
          { type: 'modify_moral', value: -2, description: '道德值-2' },
          { type: 'add_item', target: 'potion_heal', value: -1 },
        ],
        nextNode: 'prologue_3_condition_result',
        moralValue: -2,
      },
    ],
  },
  {
    id: 'prologue_3_give_potion_result',
    day: 3,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '真的吗？谢谢你！', emotion: 'happy' },
      { speaker: 'lily', text: '汤姆是我从小一起长大的朋友，看到他能得到帮助，我真的很开心...', emotion: 'happy' },
      { speaker: 'tom', text: '（一个壮实的年轻战士走来）你就是莉莉的担保人吧？谢谢你救了我。以后有需要帮忙的地方，尽管说！', emotion: 'happy' },
    ],
  },
  {
    id: 'prologue_3_refuse_potion_result',
    day: 3,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '（低下头）...我明白了。你说得对，我们自己也很困难...', emotion: 'sad' },
      { speaker: 'narrator', text: '（莉莉看起来有些失望，但什么也没说）' },
    ],
  },
  {
    id: 'prologue_3_condition_result',
    day: 3,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'lily', text: '（犹豫了一下）...好吧，我会告诉他的。', emotion: 'worried' },
      { speaker: 'tom', text: '（皱眉看着主角）我欠你一个人情，但请你不要利用莉莉。如果让我发现你欺负她...', emotion: 'angry' },
      { speaker: 'player', text: '放心，我只是个看重利益的骗子罢了。', emotion: 'normal' },
    ],
  },
  {
    id: 'prologue_end',
    day: 3,
    chapter: 'prologue',
    type: 'dialogue',
    priority: 10,
    isOneTime: true,
    condition: (state: import('../../systems/StorySystem').StoryState) => !state.completedNodes.includes('prologue_end'),
    dialogues: [
      { speaker: 'narrator', text: '【序章结束】\n你和莉莉开始了地下城打工还债的生活。未来的路还很长，你们能否在30天内还清债务？\n\n第4天开始，第一章：初入地下城' },
    ],
    effects: [
      { type: 'set_flag', target: 'chapter1_unlocked', value: 1 },
    ],
  },
]

// 导出所有序章节点选择
export const prologueNodeMap: Record<string, StoryNode> = prologueNodes.reduce((acc, node) => {
  acc[node.id] = node
  return acc
}, {} as Record<string, StoryNode>)
