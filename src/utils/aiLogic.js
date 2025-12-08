// src/utils/aiLogic.js
// AI logic for non-player nations

import { NATIONS_DATA } from '../data/nations';
import { REGIONS_DATA } from '../data/regions';
import { RelationStatus } from '../data/types';

// Process AI turn for a single nation
export const processAINationTurn = (nation, state, year) => {
  const updates = {
    militaryStrengthChange: 0,
    hostilityChange: 0,
    newInvasions: [],
    regionConflicts: [],
    logs: []
  };
  
  if (nation.isPlayer) return updates;
  
  // 1. Economic growth - nations build military over time
  const baseGrowth = Math.floor(nation.militaryStrength * 0.03);
  const economyBonus = Math.floor(Math.random() * 500);
  updates.militaryStrengthChange = baseGrowth + economyBonus;
  
  // Rich nations grow faster
  const nationData = NATIONS_DATA[nation.id];
  if (nationData) {
    const regions = Object.values(state.regions).filter(r => r.owner === nation.id);
    const totalResources = regions.reduce((sum, r) => {
      const regData = REGIONS_DATA[r.id];
      return sum + (regData?.resources?.money || 0);
    }, 0);
    updates.militaryStrengthChange += Math.floor(totalResources * 0.05);
  }
  
  // 2. Hostility changes
  if (!nation.isAtWar) {
    // Hostility can decay over time (toward player)
    if (nation.hostility > 20 && Math.random() < 0.2) {
      updates.hostilityChange = -2;
      updates.logs.push({
        message: `${nation.name} tensions ease slightly`,
        type: 'ai'
      });
    }
    
    // Or increase randomly based on aggression
    if (Math.random() < nationData?.aggression * 0.1) {
      updates.hostilityChange = 3;
    }
  }
  
  // 3. War actions - launch invasions
  if (nation.isAtWar && state.phase !== 'PRE_STATE') {
    const aggression = nationData?.aggression || 0.5;
    
    // Check if should launch new invasion
    if (Math.random() < aggression * 0.3) {
      const playerRegions = Object.values(state.regions).filter(r => r.owner === 'player');
      const existingInvasions = state.invasions.filter(
        inv => !inv.isPlayerAttacker && inv.active
      );
      
      // Don't have too many simultaneous invasions
      if (playerRegions.length > 0 && existingInvasions.length < 3) {
        // Pick a target - prefer border regions or regions with low control
        const validTargets = playerRegions.filter(r => {
          // Don't attack same region twice
          return !existingInvasions.some(inv => inv.targetRegion === r.id);
        });
        
        if (validTargets.length > 0) {
          // Sort by strategic value and control (lower control = easier target)
          validTargets.sort((a, b) => {
            const aData = REGIONS_DATA[a.id];
            const bData = REGIONS_DATA[b.id];
            const aScore = (aData?.strategicValue || 5) - (a.control / 20);
            const bScore = (bData?.strategicValue || 5) - (b.control / 20);
            return bScore - aScore;
          });
          
          const target = validTargets[0];
          const invasionStrength = Math.floor(nation.militaryStrength * (0.2 + Math.random() * 0.15));
          
          updates.newInvasions.push({
            id: `inv_${nation.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            targetRegion: target.id,
            strength: invasionStrength,
            morale: 80 + Math.floor(Math.random() * 20),
            supply: 100,
            active: true,
            isPlayerAttacker: false,
            attackerNation: nation.id
          });
          
          updates.logs.push({
            message: `${nation.name} attacks ${REGIONS_DATA[target.id]?.name || target.id}!`,
            type: 'crisis'
          });
          
          // Launching attack costs military strength
          updates.militaryStrengthChange -= Math.floor(invasionStrength * 0.1);
        }
      }
    }
  }
  
  // 4. AI vs AI conflicts (simplified)
  if (!nation.isAtWar && Math.random() < 0.02) {
    const otherNations = Object.values(state.nations).filter(
      n => n.id !== nation.id && !n.isPlayer && !n.isAtWar && n.hostility > 50
    );
    
    if (otherNations.length > 0) {
      const enemy = otherNations[Math.floor(Math.random() * otherNations.length)];
      
      updates.regionConflicts.push({
        aggressor: nation.id,
        defender: enemy.id,
        casualtiesAggressor: Math.floor(nation.militaryStrength * 0.02),
        casualtiesDefender: Math.floor(enemy.militaryStrength * 0.02)
      });
      
      updates.logs.push({
        message: `Regional skirmish: ${nation.name} clashes with ${enemy.name}`,
        type: 'ai'
      });
    }
  }
  
  // 5. Peace seeking (if losing badly)
  if (nation.isAtWar && nation.militaryStrength < NATIONS_DATA[nation.id]?.startMilitary * 0.3) {
    updates.logs.push({
      message: `${nation.name} military severely weakened`,
      type: 'ai'
    });
    // This could trigger peace negotiations in the future
  }
  
  return updates;
};

// Process all AI nations for a turn
export const processAllAINations = (state, year) => {
  const allUpdates = {
    nationUpdates: {},
    newInvasions: [],
    regionConflicts: [],
    logs: []
  };
  
  Object.values(state.nations).forEach(nation => {
    if (nation.isPlayer) return;
    
    const updates = processAINationTurn(nation, state, year);
    
    allUpdates.nationUpdates[nation.id] = {
      militaryStrengthChange: updates.militaryStrengthChange,
      hostilityChange: updates.hostilityChange
    };
    
    allUpdates.newInvasions.push(...updates.newInvasions);
    allUpdates.regionConflicts.push(...updates.regionConflicts);
    allUpdates.logs.push(...updates.logs);
  });
  
  return allUpdates;
};

// Calculate if nation should declare war
export const shouldDeclareWar = (nation, state) => {
  if (nation.isPlayer || nation.isAtWar || nation.hasPeaceTreaty) return false;
  
  const nationData = NATIONS_DATA[nation.id];
  if (!nationData) return false;
  
  // High hostility + high aggression = war likely
  const warChance = (nation.hostility / 100) * nationData.aggression;
  
  // Historical enemies more likely to attack
  const isHistoricalEnemy = ['egypt', 'syria', 'jordan', 'iraq'].includes(nation.id);
  const historicalBonus = isHistoricalEnemy ? 0.1 : 0;
  
  return Math.random() < (warChance + historicalBonus) * 0.05;
};

// Get relation status from hostility
export const getRelationFromHostility = (hostility, isAtWar, hasPeace, hasTrade) => {
  if (isAtWar) return RelationStatus.WAR;
  if (hasTrade) return RelationStatus.FRIENDLY;
  if (hasPeace) return RelationStatus.COLD_PEACE;
  if (hostility >= 80) return RelationStatus.HOSTILE;
  if (hostility >= 50) return RelationStatus.NEUTRAL;
  return RelationStatus.NEUTRAL;
};
