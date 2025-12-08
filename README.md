# Rise of Zion 🇮🇱

A comprehensive grand strategy browser game covering Middle Eastern history from 1870 to 2150. Guide the Jewish people from the first pioneers through the establishment of Israel and into a speculative future.

## Features

### Game Phases
- **Pre-State Era (1870-1948)**: Build the Yishuv, purchase land, organize immigration, strengthen underground forces, and navigate British mandate politics
- **Post-State Era (1948-2150)**: Manage the State of Israel through wars, peace treaties, technological advancement, and future challenges

### Core Mechanics
- **Resource Management**: Money, Manpower, Diplomacy Points, Tech Points, Action Points
- **Interactive Map**: 25+ regions across the Middle East with strategic value, terrain modifiers, and dynamic control
- **Diplomacy System**: War, peace treaties, trade agreements, and military pacts with 13+ nations
- **Technology Tree**: 18 technologies across Agriculture/Economy, Defense, and Intelligence branches
- **Societal Slider**: Balance between Secular (tech bonuses) and Religious (defense/manpower bonuses) society
- **Historical Events**: 70+ historical events from 1870-2150 with meaningful choices and effects

### Historical Events Include
- First through Fifth Aliyah waves
- Balfour Declaration and British Mandate
- Arab Revolt and White Paper
- Holocaust aftermath
- UN Partition Plan
- Independence and War of Independence
- Suez Crisis, Six Day War, Yom Kippur War
- Camp David Accords
- Lebanon Wars
- Intifadas and Oslo
- Abraham Accords
- October 7th and aftermath
- Future: AI revolution, space colonization, singularity, and more

---

## Original README 🇮🇱

A production-grade grand strategy browser game covering Middle Eastern history from 1870-2150.

## 🎮 Game Overview

Guide the Jewish nation from the early Zionist settlements through independence and into a speculative future. Make strategic decisions about diplomacy, military action, technology, and domestic policy across nearly three centuries of history.

### Two Phases

1. **Pre-State Era (1870-1948)**: Build the Yishuv
   - Purchase land and increase control
   - Organize immigration (Aliyah)
   - Build underground defense forces
   - Navigate British Mandate politics
   - Achieve 60% core control to declare independence

2. **Post-State Era (1948-2150)**: Lead Israel
   - Fight wars of survival
   - Research technologies
   - Manage diplomacy with neighbors
   - Make historic decisions
   - Survive to 2150 to win

## 🛠️ Tech Stack

- **React 18** - UI framework with hooks
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server
- **Context + Reducer** - State management

## 📁 Project Structure

```
rise-of-zion/
├── src/
│   ├── components/
│   │   ├── map/          # SVG map components
│   │   ├── panels/       # Action panels (Domestic, Military, etc.)
│   │   ├── modals/       # Event and region modals
│   │   └── ui/           # Reusable UI components
│   ├── context/          # Game state management
│   ├── data/             # Game data (regions, nations, events, tech)
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Main app component
│   ├── index.jsx         # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or copy the project
cd rise-of-zion

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## 🎯 Game Mechanics

### Resources

| Resource | Description |
|----------|-------------|
| 💰 Money | Fund all activities |
| 👥 Manpower | Population for military and work |
| 🌐 Diplomacy Points | Political capital for treaties |
| 🔬 Tech Points | Research new technologies (post-state) |
| ⚡ Action Points | Actions per turn (refreshes each turn) |

### Societal Slider

Balance between Secular and Religious society:
- **Secular**: +20% tech output, -10% manpower
- **Religious**: -20% tech, +20% manpower, +10% defense

### Victory Conditions

- **Win**: Survive to 2150 OR control all regions
- **Lose**: Lose Tel Aviv or Jerusalem (post-state only)

## 📜 Historical Events

70+ historical events from 1878-2150:
- Pre-state: Dreyfus Affair, Balfour Declaration, Holocaust, UN Partition
- Post-state: Wars, peace treaties, technological milestones
- Future: AI revolution, space colonization, singularity

## 🗺️ Regions

25+ Middle Eastern regions including:
- **Core Israel**: Tel Aviv, Jerusalem, Haifa, Galilee, Negev
- **Contested**: Gaza, West Bank, Golan
- **Neighbors**: Egypt, Jordan, Syria, Lebanon, Iraq, Saudi Arabia, Iran, Turkey, Gulf States

## 🤝 Nations

13 AI nations with dynamic behavior:
- Hostility levels affect war probability
- Peace treaties, trade agreements, military pacts
- AI-vs-AI conflicts

## ⚔️ Combat System

- Invasion mechanics with strength, morale, supply
- Terrain and fortification modifiers
- Counterattacks and air strikes
- Technology bonuses

## 🔬 Technology Tree

18 technologies across 3 branches:
- **Agriculture/Economy**: Drip irrigation → Startup Nation
- **Defense**: Haganah Doctrine → Laser Defense
- **Intelligence**: Radio Networks → Quantum Intel

## 📱 Mobile Support

Fully responsive design:
- Touch-friendly controls
- Scrollable panels
- Collapsible map legend

## 🐛 Known Issues

- First load may be slow due to SVG rendering
- Some events may need balance adjustments

## 📄 License

MIT License - feel free to modify and distribute.

## 🙏 Acknowledgments

Inspired by grand strategy games like Crusader Kings, Victoria, and Hearts of Iron.

---

**Note**: This is a historical strategy game. Events are presented for gameplay purposes and do not represent political endorsements.
