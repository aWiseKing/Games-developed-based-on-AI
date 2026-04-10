# Dungeon Debt Story

[English](README.md) | [简体中文](README_zh.md)

## Introduction & The Idea

This is an RPG game project developed entirely using AI.

**The idea behind this project:** A project completely developed by AI, aiming to test AI's capabilities in game development, while rapidly turning some of my own small creative ideas and concepts into reality.

## Game Content & Worldview

This game is a Role-Playing Game combining "Dungeon Exploration", "Turn-Based Combat", and "Simulation & Management". The player takes on the role of a protagonist burdened with massive debt. To pay it off, you have no choice but to "work" by exploring dangerous and unknown dungeons.

- **Dynamic Story & Multiple Endings**: A complete storyline from prologue to finale, driven by NPC relationships and a moral value system. Every choice you make can lead to one of 5 distinct endings (Normal, Hero, Villain, Escape, or Sacrifice).
- **Dungeon Ecosystem**: Various dungeon themes including Forests, Volcanoes, and Ice Caves. Each theme features unique environmental debuffs, exclusive monsters (like fire-immune creatures), hidden traps, and random events.
- **Deep Combat Experience**: Features an MP/HP dual-resource system, physical/magical active skills, passive buffs, elemental weaknesses (e.g., Fire beats Ice), and challenging multi-stage Boss fights.
- **Diverse Economy & Survival**: Beyond looting monsters, the game features town part-time jobs, shop investments, black-market loans, and debt negotiation systems, simulating the realistic pressure of surviving under heavy debt.

## Tech Architecture & Software Stack

This project is built using a modern frontend and desktop technology stack, ensuring a smooth cross-platform experience:

- **Core Language**: [TypeScript](https://www.typescriptlang.org/) - Provides robust type inference and system model definitions (e.g., `NPC.ts`, `DungeonTheme.ts`).
- **User Interface**: [React 18](https://react.dev/) + [React Router](https://reactrouter.com/) - Builds responsive game views and dynamic story dialog components (`StoryDialog`) using modern Hooks.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) - A lightweight global state manager that drives the core `gameStore`, seamlessly integrating combat, economy, and story systems.
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building theme-aware game panels and animated interfaces.
- **Desktop Framework**: [Electron](https://www.electronjs.org/) + [electron-builder](https://www.electron.build/) - Packages the app for cross-platform distribution (Windows/Mac/Linux).
- **Build Tool**: [Vite](https://vitejs.dev/) - Provides lightning-fast cold starts and hot module replacement.

### Core System Design (Systems)
- `StorySystem`: Manages story nodes and triggers events automatically based on the in-game "day".
- `BattleSystem`: A combat state machine handling skill cooldowns, turn logic, damage calculation, and visual effects.
- `ThemeSystem`: Manages dungeon environments, dynamically applying ambient lighting, particle effects, stat debuffs, and background music.
- `RelationshipSystem`: Calculates complex NPC affection levels and interaction networks.

## Creative Ideas & Concepts (From Documentations)

Within the project's design documents, we've recorded numerous creative sparks generated between the AI and the developer:

1. **Deep Environment-Combat Interaction**: Dungeon environments (like taking damage every turn in a Volcano, or reduced vision in a Forest) are tightly integrated with combat. Players can even use environmental traps to deal massive damage to Bosses.
2. **Realistic Human Choices**: Under the crushing weight of debt, players are forced to choose between "morality" and "money". Will you betray your companions for a bounty, or risk everything to protect Lily, the contract master?
3. **Financial Simulation ("Work" & "Invest")**: Introduces simple financial markets like "stocks/futures" and "usury". If fighting monsters gets too exhausting, perhaps you can achieve financial freedom (or total ruin) by gambling at the tavern or investing in local shops.
4. **Theme-Aware Immersive UI**: It's not just about changing background images. When entering different dungeons, the entire UI's primary color, borders, background music, and even button styles dynamically adapt to match the theme, providing ultimate immersion.

## Get Involved

This project supports and encourages anyone to try it out and submit their own ideas. Everyone is welcome to join in and build something fun together! Whether you want to add a new storyline, design a quirky boss, or come up with a new way to make money, you are more than welcome!
