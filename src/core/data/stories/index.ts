import type { StoryNode } from '../../systems/StorySystem'
import { prologueNodes, prologueNodeMap } from './prologue'
import { chapter1Nodes, chapter1NodeMap } from './chapter1'
import { chapter2Nodes, chapter2NodeMap } from './chapter2'
import { chapter3Nodes, chapter3NodeMap } from './chapter3'
import { finaleNodes, finaleNodeMap } from './finale'

// 合并所有剧情节点
export const allStoryNodes: StoryNode[] = [
  ...prologueNodes,
  ...chapter1Nodes,
  ...chapter2Nodes,
  ...chapter3Nodes,
  ...finaleNodes,
]

// 合并所有剧情节点映射
export const storyNodeMap: Record<string, StoryNode> = {
  ...prologueNodeMap,
  ...chapter1NodeMap,
  ...chapter2NodeMap,
  ...chapter3NodeMap,
  ...finaleNodeMap,
}

// 按天数分组的剧情节点
export function getNodesByDay(day: number): StoryNode[] {
  return allStoryNodes
    .filter(node => node.day === day)
    .sort((a, b) => b.priority - a.priority)
}

// 获取特定章节的所有节点
export function getNodesByChapter(chapter: StoryNode['chapter']): StoryNode[] {
  return allStoryNodes.filter(node => node.chapter === chapter)
}

// 导出各个章节的数据（方便单独导入）
export {
  prologueNodes,
  prologueNodeMap,
  chapter1Nodes,
  chapter1NodeMap,
  chapter2Nodes,
  chapter2NodeMap,
  chapter3Nodes,
  chapter3NodeMap,
  finaleNodes,
  finaleNodeMap,
}
