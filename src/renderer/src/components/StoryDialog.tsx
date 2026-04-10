import React, { useState, useEffect } from 'react';
import type { StoryNode, Dialogue, StoryChoice } from '../../../core/systems/StorySystem';
import type { NPCId } from '../../../core/models/NPC';
import { getNPC } from '../../../core/models/NPC';

interface StoryDialogProps {
  node: StoryNode;
  onDialogueComplete: () => void;
  onChoiceSelect: (choice: StoryChoice) => void;
  onSkip: () => void;
}

// 获取说话者名称
function getSpeakerName(speaker: Dialogue['speaker']): string {
  if (speaker === 'player') return '你';
  if (speaker === 'narrator') return '';
  const npc = getNPC(speaker as NPCId);
  return npc ? npc.name : speaker;
}

// 获取说话者样式
function getSpeakerStyle(speaker: Dialogue['speaker']): string {
  if (speaker === 'player') return 'text-blue-400 font-bold';
  if (speaker === 'narrator') return 'text-gray-400 italic';
  if (speaker === 'lily') return 'text-pink-400 font-bold';
  if (speaker === 'gredon') return 'text-red-400 font-bold';
  if (speaker === 'margaret') return 'text-yellow-400 font-bold';
  if (speaker === 'shadow') return 'text-purple-400 font-bold';
  return 'text-green-400 font-bold';
}

export const StoryDialog: React.FC<StoryDialogProps> = ({
  node,
  onDialogueComplete,
  onChoiceSelect,
  onSkip,
}) => {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showChoices, setShowChoices] = useState(false);

  const currentDialogue = node.dialogues[currentDialogueIndex];
  const isLastDialogue = currentDialogueIndex >= node.dialogues.length - 1;

  // 打字机效果
  useEffect(() => {
    if (!currentDialogue) return;

    setIsTyping(true);
    setDisplayedText('');
    let index = 0;
    const text = currentDialogue.text;

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30);

    return () => clearInterval(typeInterval);
  }, [currentDialogue]);

  // 点击继续
  const handleContinue = () => {
    if (isTyping) {
      // 如果正在打字，直接显示完整文本
      setDisplayedText(currentDialogue.text);
      setIsTyping(false);
      return;
    }

    if (isLastDialogue) {
      // 最后一条对话
      if (node.choices && node.choices.length > 0) {
        // 显示选择
        setShowChoices(true);
      } else {
        // 对话结束
        onDialogueComplete();
      }
    } else {
      // 下一条对话
      setCurrentDialogueIndex(prev => prev + 1);
    }
  };

  // 选择选项
  const handleChoice = (choice: StoryChoice) => {
    setShowChoices(false);
    onChoiceSelect(choice);
  };

  // 跳过剧情
  const handleSkip = () => {
    onSkip();
  };

  if (!currentDialogue) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end justify-center z-50 pb-8">
      {/* 跳过按钮 */}
      <button
        onClick={handleSkip}
        className="absolute top-4 right-4 px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors text-sm"
      >
        跳过
      </button>

      {/* 对话容器 */}
      <div className="w-full max-w-4xl mx-4">
        {/* 对话内容 */}
        <div
          onClick={handleContinue}
          className="bg-gray-900/95 border-2 border-gray-700 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition-colors min-h-[200px]"
        >
          {/* 说话者名称 */}
          {currentDialogue.speaker !== 'narrator' && (
            <div className={`mb-3 text-lg ${getSpeakerStyle(currentDialogue.speaker)}`}>
              {getSpeakerName(currentDialogue.speaker)}
            </div>
          )}

          {/* 对话文本 */}
          <div className={`text-lg leading-relaxed whitespace-pre-wrap ${
            currentDialogue.speaker === 'narrator' ? 'text-gray-400 italic text-center' : 'text-white'
          }`}>
            {displayedText}
            {isTyping && <span className="animate-pulse">▊</span>}
          </div>

          {/* 继续提示 */}
          {!isTyping && !showChoices && (
            <div className="mt-4 text-right text-gray-500 text-sm">
              点击继续 →
            </div>
          )}
        </div>

        {/* 选择项 */}
        {showChoices && node.choices && (
          <div className="mt-4 space-y-2">
            {node.choices.map((choice, index) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                className="w-full p-4 bg-gray-800 border border-gray-600 rounded-lg text-left hover:bg-gray-700 hover:border-gray-400 transition-all"
              >
                <span className="text-yellow-400 mr-2">{String.fromCharCode(65 + index)}.</span>
                <span className="text-white">{choice.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryDialog;
