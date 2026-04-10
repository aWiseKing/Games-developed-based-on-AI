import React from 'react';
import { useGameStore } from '../stores/gameStore';
import StoryDialog from '../components/StoryDialog';
import type { StoryChoice } from '../../../core/systems/StorySystem';

export const StoryView: React.FC = () => {
  const {
    storyState,
    currentStoryNode,
    continueStory,
    selectChoice,
    skipStory,
  } = useGameStore();

  if (!currentStoryNode) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-gray-400">当前没有剧情</p>
          <button
            onClick={() => useGameStore.getState().navigateTo('town')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            返回城镇
          </button>
        </div>
      </div>
    );
  }

  const handleDialogueComplete = () => {
    continueStory();
  };

  const handleChoiceSelect = (choice: StoryChoice) => {
    selectChoice(choice);
  };

  const handleSkip = () => {
    skipStory();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
      </div>

      {/* 故事对话 */}
      <StoryDialog
        node={currentStoryNode}
        onDialogueComplete={handleDialogueComplete}
        onChoiceSelect={handleChoiceSelect}
        onSkip={handleSkip}
      />

      {/* 剧情信息 */}
      <div className="absolute top-4 left-4 text-gray-400 text-sm">
        <div>第 {storyState?.currentDay || 1} 天</div>
        <div className="mt-1">
          {storyState?.currentChapter === 'prologue' && '序章：天降横祸'}
          {storyState?.currentChapter === 'chapter1' && '第一章：初入地下城'}
          {storyState?.currentChapter === 'chapter2' && '第二章：暗流涌动'}
          {storyState?.currentChapter === 'chapter3' && '第三章：真相浮现'}
          {storyState?.currentChapter === 'finale' && '终章：最后的选择'}
        </div>
      </div>
    </div>
  );
};

export default StoryView;
