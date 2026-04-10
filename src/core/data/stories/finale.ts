import type { StoryNode } from '../../systems/StorySystem'

// 终章：最后的选择（第29-30天）
export const finaleNodes: StoryNode[] = [
  // ========== 第29天 ==========
  {
    id: 'finale_29_last_night',
    day: 29,
    chapter: 'finale',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '【终章：最后的选择】' },
      { speaker: 'narrator', text: '（最后一天的前夜，营地的篝火摇曳）' },
      { speaker: 'lily', text: '明天...就是最后了。', emotion: 'worried' },
      { speaker: 'lily', text: '不管发生什么...我想告诉你一件事。', emotion: 'happy' },
    ],
    nextNode: 'finale_29_lily_confession',
  },
  {
    id: 'finale_29_lily_confession',
    day: 29,
    chapter: 'finale',
    type: 'dialogue',
    priority: 90,
    isOneTime: true,
    condition: (state: import('../../systems/StorySystem').StoryState) => state.relationshipState.relationships.lily >= 50,
    dialogues: [
      { speaker: 'lily', text: '在遇到你之前...我以为这个世界只有冷漠和欺骗。', emotion: 'sad' },
      { speaker: 'lily', text: '但是你...虽然你嘴上说着是骗子，但你一直都在保护我。', emotion: 'happy' },
      { speaker: 'lily', text: '你教会了我...什么是真正的责任。', emotion: 'happy' },
      { speaker: 'lily', text: '明天...不管结局如何...谢谢你。', emotion: 'happy' },
    ],
    effects: [
      { type: 'modify_relationship', target: 'lily', value: 10, description: '莉莉好感度+10' },
    ],
  },
  
  // ========== 第30天 ==========
  {
    id: 'finale_30_final_day',
    day: 30,
    chapter: 'finale',
    type: 'dialogue',
    priority: 100,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '（第30天，黎明）' },
      { speaker: 'narrator', text: '这一天终于来了。' },
      { speaker: 'gredon', text: '时间到了。', emotion: 'normal' },
    ],
    nextNode: 'finale_30_choices',
  },
  {
    id: 'finale_30_choices',
    day: 30,
    chapter: 'finale',
    type: 'choice',
    priority: 90,
    isOneTime: true,
    dialogues: [
      { speaker: 'gredon', text: '做出你的选择吧，骗子。', emotion: 'normal' },
    ],
    choices: [
      {
        id: 'finale_choice_pay_debt',
        text: '还清债务，带莉莉离开（普通结局）',
        condition: (state: import('../../systems/StorySystem').StoryState) => 
          state.relationshipState.storyFlags['lily_joined'] === true &&
          state.relationshipState.lilyStatus.isAlive,
        effects: [
          { type: 'set_flag', target: 'ending_normal', value: 1 },
        ],
        nextNode: 'ending_normal',
        moralValue: 2,
      },
      {
        id: 'finale_choice_hero',
        text: '击败莫拉格斯和格雷顿（英雄结局）',
        condition: (state: import('../../systems/StorySystem').StoryState) => 
          state.relationshipState.storyFlags['knows_moraguss_solution'] === true &&
          state.relationshipState.relationships.lily >= 60,
        effects: [
          { type: 'set_flag', target: 'ending_hero', value: 1 },
        ],
        nextNode: 'ending_hero',
        moralValue: 5,
      },
      {
        id: 'finale_choice_villain',
        text: '取代格雷顿，控制地下城（反派结局）',
        condition: (state: import('../../systems/StorySystem').StoryState) => 
          state.relationshipState.storyFlags['considers_betrayal'] === true ||
          state.relationshipState.moralValue < -30,
        effects: [
          { type: 'set_flag', target: 'ending_villain', value: 1 },
        ],
        nextNode: 'ending_villain',
        moralValue: -5,
      },
      {
        id: 'finale_choice_escape',
        text: '抛弃莉莉，独自逃跑（逃亡结局）',
        effects: [
          { type: 'set_flag', target: 'ending_escape', value: 1 },
        ],
        nextNode: 'ending_escape',
        moralValue: -5,
      },
      {
        id: 'finale_choice_sacrifice',
        text: '牺牲自己，让莉莉获得自由（牺牲结局）',
        condition: (state: import('../../systems/StorySystem').StoryState) => 
          state.relationshipState.relationships.lily >= 50,
        effects: [
          { type: 'set_flag', target: 'ending_sacrifice', value: 1 },
        ],
        nextNode: 'ending_sacrifice',
        moralValue: 5,
      },
    ],
  },
  
  // ========== 结局 ==========
  {
    id: 'ending_normal',
    day: 30,
    chapter: 'finale',
    type: 'ending',
    priority: 80,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '【结局A：各自的自由】' },
      { speaker: 'narrator', text: '你终于还清了债务，莉莉也得救了。' },
      { speaker: 'narrator', text: '两人站在地下城出口，阳光洒在疲惫但释然的脸上。' },
      { speaker: 'lily', text: '谢谢你...这段时间的保护。', emotion: 'happy' },
      { speaker: 'lily', text: '虽然我们要分开了...但我会永远记住你的。', emotion: 'happy' },
      { speaker: 'narrator', text: '（莉莉和主角并肩走出地下城，然后朝不同方向走去，挥手告别）' },
      { speaker: 'narrator', text: '【普通结局 - 各自的自由】\n\n你们从债务的枷锁中解脱，开始了各自的新生活。虽然没有成为恋人，但你们成为了彼此生命中重要的朋友。' },
    ],
    effects: [
      { type: 'set_flag', target: 'game_completed', value: 1 },
    ],
  },
  {
    id: 'ending_hero',
    day: 30,
    chapter: 'finale',
    type: 'ending',
    priority: 80,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '【结局B：守护的誓言】' },
      { speaker: 'narrator', text: '你不仅还清了债务，还揭露了格雷顿的阴谋，拯救了包括莉莉在内的所有负债者。' },
      { speaker: 'narrator', text: '从骗子蜕变成了真正的英雄，莉莉成为了你最重要的伙伴。' },
      { speaker: 'lily', text: '（微笑）我就知道...你不是真正的骗子。', emotion: 'happy' },
      { speaker: 'lily', text: '你教会了我什么是勇气和责任。现在，让我陪在你身边吧。', emotion: 'happy' },
      { speaker: 'narrator', text: '（主角和莉莉站在小镇广场上，周围是欢呼的人群，格雷顿被卫兵带走）' },
      { speaker: 'narrator', text: '【英雄结局 - 守护的誓言】\n\n你们不仅拯救了自己，也拯救了他人。从骗子到英雄的蜕变，证明每个人都有改变的可能。' },
    ],
    effects: [
      { type: 'set_flag', target: 'game_completed', value: 1 },
    ],
  },
  {
    id: 'ending_villain',
    day: 30,
    chapter: 'finale',
    type: 'ending',
    priority: 80,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '【结局C：黑暗中的羁绊】' },
      { speaker: 'narrator', text: '你成为了新的地下城掌控者。' },
      { speaker: 'narrator', text: '莉莉虽然被救，但对你充满恐惧，已经无法离开。' },
      { speaker: 'lily', text: '（眼神空洞）为什么...为什么会变成这样...', emotion: 'sad' },
      { speaker: 'player', text: '别怕...我会保护你的。', emotion: 'normal' },
      { speaker: 'lily', text: '（躲开主角的手）别碰我...你这个怪物...', emotion: 'angry' },
      { speaker: 'narrator', text: '（主角坐在王座上，莉莉被锁链束缚在旁边，眼神空洞）' },
      { speaker: 'narrator', text: '【反派结局 - 黑暗中的羁绊】\n\n你获得了权力，却失去了最珍贵的东西——莉莉的信任。在黑暗中，你们的关系永远无法回到从前。' },
    ],
    effects: [
      { type: 'set_flag', target: 'game_completed', value: 1 },
    ],
  },
  {
    id: 'ending_escape',
    day: 30,
    chapter: 'finale',
    type: 'ending',
    priority: 80,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '【结局D：自私的逃亡】' },
      { speaker: 'narrator', text: '你带着剩余的金币逃离了小镇，留下莉莉成为祭品。' },
      { speaker: 'player', text: '对不起...但我不能死...', emotion: 'sad' },
      { speaker: 'lily', text: '（绝望的哭喊）不要...不要丢下我...', emotion: 'sad' },
      { speaker: 'narrator', text: '（主角在夜色中逃离，回头看了一眼小镇，隐约听到莉莉的哭喊声，然后咬牙消失在黑暗中）' },
      { speaker: 'narrator', text: '【逃亡结局 - 自私的逃亡】\n\n你暂时逃脱了债务，但良心的谴责永远笼罩着你。每当夜深人静，莉莉的哭喊声总会在你耳边回响。' },
    ],
    effects: [
      { type: 'set_flag', target: 'game_completed', value: 1 },
    ],
  },
  {
    id: 'ending_sacrifice',
    day: 30,
    chapter: 'finale',
    type: 'ending',
    priority: 80,
    isOneTime: true,
    dialogues: [
      { speaker: 'narrator', text: '【结局E：最后的守护】' },
      { speaker: 'narrator', text: '你意识到只有自己的死才能解除契约，让莉莉获得自由。' },
      { speaker: 'player', text: '莉莉...活下去...替我看看这个世界...', emotion: 'happy' },
      { speaker: 'lily', text: '不...不要...！', emotion: 'worried' },
      { speaker: 'player', text: '（微笑着擦去她的眼泪）别哭...这是我自己的选择...', emotion: 'happy' },
      { speaker: 'narrator', text: '（主角的身体开始化作光芒消散）' },
      { speaker: 'narrator', text: '多年后，莉莉成为了一名著名的治疗师，救助了无数人。' },
      { speaker: 'narrator', text: '每当有人问她为什么要成为治疗师，她总是微笑着说："因为有人教会了我，什么是真正的守护。"' },
      { speaker: 'narrator', text: '【牺牲结局 - 最后的守护】\n\n你用自己的生命换取了莉莉的自由。你的牺牲没有白费，莉莉继承了你的意志，成为了拯救他人的英雄。' },
    ],
    effects: [
      { type: 'set_flag', target: 'game_completed', value: 1 },
    ],
  },
]

// 导出所有终章节点选择
export const finaleNodeMap: Record<string, StoryNode> = finaleNodes.reduce((acc, node) => {
  acc[node.id] = node
  return acc
}, {} as Record<string, StoryNode>)
