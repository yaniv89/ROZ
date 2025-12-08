// src/data/techTree.js
// Technology tree definitions

import { TechCategories } from './types';

export const TECH_TREE = {
  // ============ AGRICULTURAL/ECONOMY BRANCH ============
  drip_irrigation: {
    id: 'drip_irrigation',
    name: 'Drip Irrigation',
    category: TechCategories.AGRI_ECON,
    cost: { money: 15000, techPoints: 10 },
    prerequisites: [],
    effects: { moneyMult: 1.1 },
    description: 'Water-efficient farming technology',
    yearAvailable: 1948
  },
  desalination: {
    id: 'desalination',
    name: 'Desalination',
    category: TechCategories.AGRI_ECON,
    cost: { money: 30000, techPoints: 25 },
    prerequisites: ['drip_irrigation'],
    effects: { moneyMult: 1.15, waterBonus: true },
    description: 'Convert seawater to freshwater',
    yearAvailable: 1965
  },
  desert_blooming: {
    id: 'desert_blooming',
    name: 'Desert Blooming',
    category: TechCategories.AGRI_ECON,
    cost: { money: 50000, techPoints: 40 },
    prerequisites: ['desalination'],
    effects: { negevBonus: 0.5, moneyMult: 1.2 },
    description: 'Make the desert bloom',
    yearAvailable: 1980
  },
  startup_nation: {
    id: 'startup_nation',
    name: 'Startup Nation',
    category: TechCategories.AGRI_ECON,
    cost: { money: 80000, techPoints: 60 },
    prerequisites: ['desert_blooming'],
    effects: { techPointMult: 1.25, moneyMult: 1.3 },
    description: 'High-tech innovation hub',
    yearAvailable: 2000
  },
  green_energy: {
    id: 'green_energy',
    name: 'Green Energy',
    category: TechCategories.AGRI_ECON,
    cost: { money: 120000, techPoints: 80 },
    prerequisites: ['startup_nation'],
    effects: { moneyMult: 1.4, diplomacyBonus: 10 },
    description: 'Renewable energy independence',
    yearAvailable: 2020
  },

  // ============ DEFENSE BRANCH ============
  haganah_doctrine: {
    id: 'haganah_doctrine',
    name: 'Haganah Doctrine',
    category: TechCategories.DEFENSE,
    cost: { money: 5000, techPoints: 5 },
    prerequisites: [],
    effects: { defenseBonus: 0.1 },
    description: 'Self-defense organization principles',
    yearAvailable: 1870
  },
  uzi_production: {
    id: 'uzi_production',
    name: 'Uzi Production',
    category: TechCategories.DEFENSE,
    cost: { money: 20000, techPoints: 15 },
    prerequisites: ['haganah_doctrine'],
    effects: { infantryBonus: 0.15 },
    description: 'Iconic Israeli SMG',
    yearAvailable: 1948
  },
  merkava_mk1: {
    id: 'merkava_mk1',
    name: 'Merkava Mk1',
    category: TechCategories.DEFENSE,
    cost: { money: 80000, techPoints: 50 },
    prerequisites: ['uzi_production'],
    effects: { tankDiscount: 0.2, tankBonus: 0.25 },
    description: 'Main battle tank',
    yearAvailable: 1979
  },
  iron_dome: {
    id: 'iron_dome',
    name: 'Iron Dome',
    category: TechCategories.DEFENSE,
    cost: { money: 150000, techPoints: 80 },
    prerequisites: ['merkava_mk1'],
    effects: { missileDefense: 0.9, civilianProtection: true },
    description: 'Short-range missile defense',
    yearAvailable: 2011
  },
  arrow_3: {
    id: 'arrow_3',
    name: 'Arrow 3',
    category: TechCategories.DEFENSE,
    cost: { money: 200000, techPoints: 100 },
    prerequisites: ['iron_dome'],
    effects: { ballisticDefense: 0.95 },
    description: 'Exo-atmospheric interception',
    yearAvailable: 2017
  },
  laser_defense: {
    id: 'laser_defense',
    name: 'Iron Beam',
    category: TechCategories.DEFENSE,
    cost: { money: 300000, techPoints: 150 },
    prerequisites: ['arrow_3'],
    effects: { laserDefense: true, upkeepReduction: 0.3 },
    description: 'Directed energy weapon system',
    yearAvailable: 2025
  },
  autonomous_defense: {
    id: 'autonomous_defense',
    name: 'Autonomous Defense',
    category: TechCategories.DEFENSE,
    cost: { money: 400000, techPoints: 200 },
    prerequisites: ['laser_defense'],
    effects: { aiDefense: true, combatBonus: 0.4 },
    description: 'AI-powered defense systems',
    yearAvailable: 2040
  },

  // ============ INTELLIGENCE BRANCH ============
  radio_networks: {
    id: 'radio_networks',
    name: 'Radio Networks',
    category: TechCategories.INTEL,
    cost: { money: 8000, techPoints: 8 },
    prerequisites: [],
    effects: { intel: 0.1 },
    description: 'Secure communications network',
    yearAvailable: 1870
  },
  mossad_formation: {
    id: 'mossad_formation',
    name: 'Mossad',
    category: TechCategories.INTEL,
    cost: { money: 40000, techPoints: 30 },
    prerequisites: ['radio_networks'],
    effects: { covertOps: true, hostilityReduction: 5 },
    description: 'Intelligence agency formation',
    yearAvailable: 1949
  },
  unit_8200: {
    id: 'unit_8200',
    name: 'Unit 8200',
    category: TechCategories.INTEL,
    cost: { money: 100000, techPoints: 70 },
    prerequisites: ['mossad_formation'],
    effects: { cyber: true, techPointMult: 1.15 },
    description: 'Signals intelligence unit',
    yearAvailable: 1980
  },
  cyber_command: {
    id: 'cyber_command',
    name: 'Cyber Command',
    category: TechCategories.INTEL,
    cost: { money: 180000, techPoints: 100 },
    prerequisites: ['unit_8200'],
    effects: { cyberWarfare: true, enemyDebuff: 0.15 },
    description: 'Offensive cyber capabilities',
    yearAvailable: 2010
  },
  ai_warfare: {
    id: 'ai_warfare',
    name: 'AI Warfare',
    category: TechCategories.INTEL,
    cost: { money: 250000, techPoints: 120 },
    prerequisites: ['cyber_command'],
    effects: { aiBonus: 0.3, combatPrediction: true },
    description: 'AI-powered military systems',
    yearAvailable: 2030
  },
  quantum_intel: {
    id: 'quantum_intel',
    name: 'Quantum Intelligence',
    category: TechCategories.INTEL,
    cost: { money: 350000, techPoints: 180 },
    prerequisites: ['ai_warfare'],
    effects: { quantumBonus: true, globalIntel: true },
    description: 'Quantum computing for intelligence',
    yearAvailable: 2050
  }
};

// Get tech by category
export const getTechsByCategory = () => {
  const categories = {
    [TechCategories.AGRI_ECON]: { name: 'Economy & Agriculture', techs: [], icon: 'Sprout' },
    [TechCategories.DEFENSE]: { name: 'Defense', techs: [], icon: 'Shield' },
    [TechCategories.INTEL]: { name: 'Intelligence', techs: [], icon: 'Eye' }
  };
  
  Object.values(TECH_TREE).forEach(tech => {
    if (categories[tech.category]) {
      categories[tech.category].techs.push(tech);
    }
  });
  
  // Sort by year available
  Object.values(categories).forEach(cat => {
    cat.techs.sort((a, b) => a.yearAvailable - b.yearAvailable);
  });
  
  return categories;
};

// Check if tech can be researched
export const canResearchTech = (techId, techTree, resources, year) => {
  const tech = TECH_TREE[techId];
  const state = techTree[techId];
  
  if (!tech || !state) return { can: false, reason: 'Invalid tech' };
  if (state.researched) return { can: false, reason: 'Already researched' };
  if (tech.yearAvailable > year) return { can: false, reason: `Available in ${tech.yearAvailable}` };
  
  const hasPrereqs = tech.prerequisites.every(p => techTree[p]?.researched);
  if (!hasPrereqs) return { can: false, reason: 'Prerequisites not met' };
  
  if (resources.money < tech.cost.money) return { can: false, reason: 'Insufficient funds' };
  if (resources.techPoints < tech.cost.techPoints) return { can: false, reason: 'Insufficient tech points' };
  if (resources.actionPoints < 2) return { can: false, reason: 'Need 2 AP' };
  
  return { can: true, reason: null };
};
