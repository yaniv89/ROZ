// src/context/GameContext.jsx
// Game state management using React Context and useReducer

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { GamePhases, ActionTypes, RelationStatus, LogTypes } from '../data/types';
import { REGIONS_DATA, CORE_REGION_IDS } from '../data/regions';
import { NATIONS_DATA, INDEPENDENCE_WAR_ATTACKERS } from '../data/nations';
import { TECH_TREE } from '../data/techTree';
import { HISTORICAL_EVENTS, shouldEventFire } from '../data/events';
import { 
  calcIncome, 
  calcMilitaryPower, 
  getTechBonuses,
  calcCombatResult,
  formatNumber
} from '../utils/helpers';
import { processAllAINations } from '../utils/aiLogic';

// ============ INITIAL STATE FACTORY ============
const createInitialState = () => {
  // Initialize regions
  const regions = {};
  Object.entries(REGIONS_DATA).forEach(([id, data]) => {
    regions[id] = {
      id,
      owner: data.startOwner,
      control: data.startOwner === 'player' ? data.startControl : 100,
      currentPopulation: data.population,
      currentInfrastructure: data.infrastructure,
      underInvasion: false,
      isOccupied: false
    };
  });

  // Initialize nations
  const nations = {};
  Object.entries(NATIONS_DATA).forEach(([id, data]) => {
    if (data.isPlayer) {
      nations[id] = { id, name: data.name, color: data.color, isPlayer: true };
    } else {
      nations[id] = {
        id,
        name: data.name,
        color: data.color,
        hostility: data.startHostility,
        militaryStrength: data.startMilitary,
        aggression: data.aggression,
        relationStatus: data.startRelation || RelationStatus.NEUTRAL,
        isAtWar: false,
        hasPeaceTreaty: false,
        hasTradeAgreement: false,
        hasMilitaryPact: false
      };
    }
  });

  // Initialize tech tree
  const techTree = {};
  Object.entries(TECH_TREE).forEach(([id, data]) => {
    techTree[id] = {
      id,
      researched: false,
      available: data.yearAvailable <= 1870
    };
  });

  return {
    // Time
    year: 1870,
    period: 0, // 0 = H1 (First Half), 1 = H2 (Second Half)
    turnNumber: 1,
    phase: GamePhases.PRE_STATE,

    // Resources
    resources: {
      money: 50000,
      manpower: 1000,
      diplomacyPoints: 20,
      techPoints: 0,
      actionPoints: 3,
      maxActionPoints: 3
    },

    // Military
    undergroundStrength: 500,
    militaryPower: 0,

    // Societal alignment (0 = Secular, 100 = Religious)
    societalSlider: 50,

    // World state
    regions,
    nations,
    techTree,

    // Wars and invasions
    wars: [],
    invasions: [],

    // Events
    activeEvent: null,
    firedEvents: {},

    // Logs
    logs: [
      { year: 1870, message: '1870 H1: The Yishuv begins. Build your homeland.', type: LogTypes.MILESTONE }
    ]
  };
};

// ============ REDUCER ============
const gameReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADVANCE_TURN: {
      const { newYear, newPeriod, newLogs, resChanges, invUpdates, nationUpdates } = action.payload;
      
      // Update tech availability
      const updTech = { ...state.techTree };
      Object.keys(updTech).forEach(id => {
        if (TECH_TREE[id].yearAvailable <= newYear) {
          updTech[id] = { ...updTech[id], available: true };
        }
      });

      // Apply nation updates
      const updNations = { ...state.nations };
      if (nationUpdates) {
        Object.entries(nationUpdates).forEach(([nId, updates]) => {
          if (updNations[nId] && !updNations[nId].isPlayer) {
            updNations[nId] = {
              ...updNations[nId],
              militaryStrength: Math.max(100, updNations[nId].militaryStrength + (updates.militaryStrengthChange || 0)),
              hostility: Math.max(0, Math.min(100, updNations[nId].hostility + (updates.hostilityChange || 0)))
            };
          }
        });
      }

      return {
        ...state,
        year: newYear,
        period: newPeriod,
        turnNumber: state.turnNumber + 1,
        resources: {
          ...state.resources,
          ...resChanges,
          actionPoints: state.resources.maxActionPoints
        },
        techTree: updTech,
        invasions: invUpdates || state.invasions,
        nations: updNations,
        logs: [...state.logs, ...newLogs]
      };
    }

    case ActionTypes.DECLARE_INDEPENDENCE: {
      // Set all core regions to 100% control
      const updRegions = { ...state.regions };
      CORE_REGION_IDS.forEach(id => {
        if (updRegions[id] && updRegions[id].owner === 'player') {
          updRegions[id] = { ...updRegions[id], control: 100 };
        }
      });

      // All historical enemies declare war
      const updNations = { ...state.nations };
      INDEPENDENCE_WAR_ATTACKERS.forEach(id => {
        if (updNations[id]) {
          updNations[id] = {
            ...updNations[id],
            isAtWar: true,
            hostility: 100,
            relationStatus: RelationStatus.WAR
          };
        }
      });

      // Create war records
      const newWars = INDEPENDENCE_WAR_ATTACKERS.map(n => ({
        id: `war_${n}_${state.year}`,
        enemy: n,
        startYear: state.year,
        active: true
      }));

      // Initial invasions
      const newInvasions = [
        { id: 'inv_egypt_1948', targetRegion: 'negev', strength: 8000, morale: 100, supply: 100, active: true, isPlayerAttacker: false, attackerNation: 'egypt' },
        { id: 'inv_syria_1948', targetRegion: 'galilee', strength: 5000, morale: 100, supply: 100, active: true, isPlayerAttacker: false, attackerNation: 'syria' },
        { id: 'inv_jordan_1948', targetRegion: 'jerusalem', strength: 3000, morale: 100, supply: 100, active: true, isPlayerAttacker: false, attackerNation: 'jordan' },
        { id: 'inv_iraq_1948', targetRegion: 'haifa', strength: 2000, morale: 90, supply: 100, active: true, isPlayerAttacker: false, attackerNation: 'iraq' }
      ];

      // Update regions to show under invasion
      newInvasions.forEach(inv => {
        if (updRegions[inv.targetRegion]) {
          updRegions[inv.targetRegion] = { ...updRegions[inv.targetRegion], underInvasion: true };
        }
      });

      return {
        ...state,
        phase: GamePhases.POST_STATE,
        militaryPower: state.undergroundStrength * 2,
        undergroundStrength: 0,
        regions: updRegions,
        nations: updNations,
        wars: [...state.wars, ...newWars],
        invasions: [...state.invasions, ...newInvasions],
        resources: {
          ...state.resources,
          techPoints: 10,
          actionPoints: state.resources.maxActionPoints
        },
        logs: [
          ...state.logs,
          { year: state.year, message: 'INDEPENDENCE DECLARED! The State of Israel is born!', type: LogTypes.MILESTONE },
          { year: state.year, message: 'Arab armies invade from all directions!', type: LogTypes.CRISIS }
        ]
      };
    }

    case ActionTypes.UPDATE_RESOURCES:
      return {
        ...state,
        resources: { ...state.resources, ...action.payload }
      };

    case ActionTypes.SPEND_RESOURCES: {
      const newRes = { ...state.resources };
      Object.entries(action.payload.costs).forEach(([key, value]) => {
        newRes[key] = (newRes[key] || 0) - value;
      });
      return { ...state, resources: newRes };
    }

    case ActionTypes.UPDATE_REGION:
      return {
        ...state,
        regions: {
          ...state.regions,
          [action.payload.regionId]: {
            ...state.regions[action.payload.regionId],
            ...action.payload.updates
          }
        }
      };

    case ActionTypes.CAPTURE_REGION: {
      const { regionId, initControl } = action.payload;
      return {
        ...state,
        regions: {
          ...state.regions,
          [regionId]: {
            ...state.regions[regionId],
            owner: 'player',
            control: initControl || 60,
            isOccupied: true,
            underInvasion: false
          }
        }
      };
    }

    case ActionTypes.UPDATE_RELATION:
      return {
        ...state,
        nations: {
          ...state.nations,
          [action.payload.nationId]: {
            ...state.nations[action.payload.nationId],
            ...action.payload.updates
          }
        }
      };

    case ActionTypes.DECLARE_WAR: {
      const { nationId } = action.payload;
      return {
        ...state,
        nations: {
          ...state.nations,
          [nationId]: {
            ...state.nations[nationId],
            isAtWar: true,
            hostility: 100,
            relationStatus: RelationStatus.WAR
          }
        },
        wars: [
          ...state.wars,
          { id: `war_${nationId}_${state.year}`, enemy: nationId, startYear: state.year, active: true }
        ],
        logs: [
          ...state.logs,
          { year: state.year, message: `WAR declared on ${NATIONS_DATA[nationId]?.name}!`, type: LogTypes.CRISIS }
        ]
      };
    }

    case ActionTypes.SIGN_PEACE: {
      const { nationId } = action.payload;
      // Remove active invasions from this nation
      const filteredInvasions = state.invasions.filter(inv => {
        if (inv.attackerNation === nationId && !inv.isPlayerAttacker) return false;
        return true;
      });

      return {
        ...state,
        nations: {
          ...state.nations,
          [nationId]: {
            ...state.nations[nationId],
            isAtWar: false,
            hostility: 20,
            relationStatus: RelationStatus.COLD_PEACE,
            hasPeaceTreaty: true
          }
        },
        wars: state.wars.map(w => w.enemy === nationId ? { ...w, active: false } : w),
        invasions: filteredInvasions,
        logs: [
          ...state.logs,
          { year: state.year, message: `PEACE signed with ${NATIONS_DATA[nationId]?.name}!`, type: LogTypes.MILESTONE }
        ]
      };
    }

    case ActionTypes.SIGN_TRADE: {
      const { nationId } = action.payload;
      return {
        ...state,
        nations: {
          ...state.nations,
          [nationId]: {
            ...state.nations[nationId],
            hasTradeAgreement: true,
            hostility: Math.max(0, state.nations[nationId].hostility - 10),
            relationStatus: RelationStatus.FRIENDLY
          }
        },
        logs: [
          ...state.logs,
          { year: state.year, message: `Trade agreement with ${NATIONS_DATA[nationId]?.name}!`, type: LogTypes.DIPLOMACY }
        ]
      };
    }

    case ActionTypes.SIGN_MILITARY_PACT: {
      const { nationId } = action.payload;
      return {
        ...state,
        nations: {
          ...state.nations,
          [nationId]: {
            ...state.nations[nationId],
            hasMilitaryPact: true,
            relationStatus: RelationStatus.ALLIED
          }
        },
        logs: [
          ...state.logs,
          { year: state.year, message: `Military pact with ${NATIONS_DATA[nationId]?.name}!`, type: LogTypes.MILESTONE }
        ]
      };
    }

    case ActionTypes.RESEARCH_TECH:
      return {
        ...state,
        techTree: {
          ...state.techTree,
          [action.payload.techId]: {
            ...state.techTree[action.payload.techId],
            researched: true
          }
        },
        logs: [
          ...state.logs,
          { year: state.year, message: `Researched: ${TECH_TREE[action.payload.techId]?.name}`, type: LogTypes.TECH }
        ]
      };

    case ActionTypes.UPDATE_SLIDER:
      return {
        ...state,
        societalSlider: Math.max(0, Math.min(100, action.payload))
      };

    case ActionTypes.UPDATE_MILITARY:
      return {
        ...state,
        militaryPower: state.militaryPower + (action.payload.mil || 0),
        undergroundStrength: state.undergroundStrength + (action.payload.ug || 0)
      };

    case ActionTypes.LAUNCH_INVASION: {
      const { targetRegion, strength, isPlayer } = action.payload;
      return {
        ...state,
        invasions: [
          ...state.invasions,
          {
            id: `inv_${Date.now()}`,
            targetRegion,
            strength,
            morale: 100,
            supply: 100,
            active: true,
            isPlayerAttacker: isPlayer
          }
        ],
        regions: {
          ...state.regions,
          [targetRegion]: {
            ...state.regions[targetRegion],
            underInvasion: true
          }
        }
      };
    }

    case ActionTypes.UPDATE_INVASION:
      return {
        ...state,
        invasions: state.invasions.map(inv =>
          inv.id === action.payload.invId ? { ...inv, ...action.payload.updates } : inv
        )
      };

    case ActionTypes.REMOVE_INVASION: {
      const invId = action.payload.invId;
      const inv = state.invasions.find(i => i.id === invId);
      const updRegions = { ...state.regions };
      
      if (inv && updRegions[inv.targetRegion]) {
        // Check if there are other active invasions for this region
        const otherInvasions = state.invasions.filter(
          i => i.id !== invId && i.targetRegion === inv.targetRegion && i.active
        );
        if (otherInvasions.length === 0) {
          updRegions[inv.targetRegion] = {
            ...updRegions[inv.targetRegion],
            underInvasion: false
          };
        }
      }

      return {
        ...state,
        invasions: state.invasions.filter(i => i.id !== invId),
        regions: updRegions
      };
    }

    case ActionTypes.ADD_LOG:
      return {
        ...state,
        logs: [
          ...state.logs,
          { year: state.year, message: action.payload.message, type: action.payload.type || LogTypes.ACTION }
        ]
      };

    case ActionTypes.SET_EVENT:
      return { ...state, activeEvent: action.payload };

    case ActionTypes.RESOLVE_EVENT:
      return {
        ...state,
        activeEvent: null,
        firedEvents: {
          ...state.firedEvents,
          [action.payload?.eventId]: true
        }
      };

    case ActionTypes.RESET_GAME:
      return createInitialState();

    default:
      return state;
  }
};

// ============ CONTEXT ============
const GameContext = createContext(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// ============ PROVIDER ============
export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  // Add log helper
  const addLog = useCallback((message, type = LogTypes.ACTION) => {
    dispatch({ type: ActionTypes.ADD_LOG, payload: { message, type } });
  }, []);

  // Advance turn logic
  const advanceTurn = useCallback(() => {
    // --- TIME CALCULATION LOGIC ---
    // If current period is 0 (H1), we move to 1 (H2) and keep year same.
    // If current period is 1 (H2), we move to 0 (H1) and increment year.
    const isH2 = state.period === 1;
    const newPeriod = isH2 ? 0 : 1;
    const newYear = isH2 ? state.year + 1 : state.year;
    
    // Formatting the string for logs
    const dateString = `${newYear} ${newPeriod === 0 ? 'H1' : 'H2'}`;
    
    const newLogs = [];

    // Calculate income
    const income = calcIncome(state);
    newLogs.push({
      year: newYear,
      message: `${dateString}: +$${formatNumber(income.money)}, +${formatNumber(income.manpower)} Men${state.phase === GamePhases.POST_STATE ? `, +${income.techPoints} TP` : ''}`,
      type: LogTypes.ACTION
    });

    // Process invasions
    let updatedInvasions = [...state.invasions];
    const techBonuses = getTechBonuses(state.techTree);

    updatedInvasions = updatedInvasions.map(inv => {
      if (!inv.active) return inv;

      let newInv = { ...inv, supply: inv.supply - 10 };
      const targetRegion = state.regions[inv.targetRegion];
      const targetData = REGIONS_DATA[inv.targetRegion];

      if (inv.isPlayerAttacker) {
        // Player offensive
        const defender = state.nations[targetRegion?.owner];
        if (defender && !defender.isPlayer) {
          const defenseStrength = defender.militaryStrength * 0.3 * (targetData?.fortification || 1);
          const result = calcCombatResult(inv.strength, defenseStrength, techBonuses, targetData?.terrain);

          if (result.attackerWins) {
            newInv.active = false;
            newLogs.push({
              year: newYear,
              message: `VICTORY! Captured ${targetData?.name}!`,
              type: LogTypes.MILESTONE
            });
            dispatch({ type: ActionTypes.CAPTURE_REGION, payload: { regionId: inv.targetRegion, initControl: 60 } });
          } else if (result.stalemate) {
            newInv.morale -= 10;
            newLogs.push({
              year: newYear,
              message: `Offensive in ${targetData?.name}: progress slow`,
              type: LogTypes.COMBAT
            });
          } else {
            newInv.morale -= 25;
            newInv.strength = Math.floor(newInv.strength * 0.85);
            newLogs.push({
              year: newYear,
              message: `Offensive in ${targetData?.name} stalled!`,
              type: LogTypes.COMBAT
            });
          }
        }
      } else {
        // Enemy offensive against player
        if (targetRegion && targetRegion.owner === 'player') {
          const playerDefense = calcMilitaryPower(state) * 0.3;
          const result = calcCombatResult(inv.strength, playerDefense, techBonuses, targetData?.terrain);

          if (result.attackerWins) {
            const damage = 25;
            dispatch({
              type: ActionTypes.UPDATE_REGION,
              payload: {
                regionId: inv.targetRegion,
                updates: { control: Math.max(0, targetRegion.control - damage) }
              }
            });
            newLogs.push({
              year: newYear,
              message: `${targetData?.name} OVERRUN! Control -${damage}%`,
              type: LogTypes.CRISIS
            });
          } else if (result.stalemate) {
            const damage = 10;
            dispatch({
              type: ActionTypes.UPDATE_REGION,
              payload: {
                regionId: inv.targetRegion,
                updates: { control: Math.max(0, targetRegion.control - damage) }
              }
            });
            newInv.morale -= 10;
            newLogs.push({
              year: newYear,
              message: `${targetData?.name} under pressure. Control -${damage}%`,
              type: LogTypes.COMBAT
            });
          } else {
            newInv.morale -= 25;
            newInv.strength = Math.floor(newInv.strength * 0.8);
            newLogs.push({
              year: newYear,
              message: `Defended ${targetData?.name}! Enemy repelled.`,
              type: LogTypes.COMBAT
            });
          }
        }
      }

      // Check if invasion collapses
      if (newInv.supply <= 0 || newInv.morale <= 0) {
        newInv.active = false;
        dispatch({
          type: ActionTypes.UPDATE_REGION,
          payload: { regionId: inv.targetRegion, updates: { underInvasion: false } }
        });
        newLogs.push({
          year: newYear,
          message: `${inv.isPlayerAttacker ? 'Our' : 'Enemy'} invasion of ${targetData?.name} collapsed`,
          type: LogTypes.COMBAT
        });
      }

      return newInv;
    });

    // Process AI nations
    const aiUpdates = processAllAINations(state, newYear);
    
    // Add AI invasions
    if (aiUpdates.newInvasions.length > 0) {
      updatedInvasions = [...updatedInvasions, ...aiUpdates.newInvasions];
      // Mark regions as under invasion
      aiUpdates.newInvasions.forEach(inv => {
        dispatch({
          type: ActionTypes.UPDATE_REGION,
          payload: { regionId: inv.targetRegion, updates: { underInvasion: true } }
        });
      });
    }

    // Add AI logs
    newLogs.push(...aiUpdates.logs.map(l => ({ year: newYear, ...l })));

    // Check for historical events
    // Triggers based on year (integer), will fire in H1 of that year usually
    const checkEvent = Object.values(HISTORICAL_EVENTS).find(e => 
      shouldEventFire(e, newYear, state.year, state.phase, state.nations, state.firedEvents)
    );

    if (checkEvent) {
      dispatch({ type: ActionTypes.SET_EVENT, payload: checkEvent });
    }

    // Apply turn changes
    dispatch({
      type: ActionTypes.ADVANCE_TURN,
      payload: {
        newYear, // Pass explicitly calculated year
        newPeriod, // Pass new period (H1/H2)
        newLogs,
        resChanges: {
          money: state.resources.money + income.money,
          manpower: state.resources.manpower + income.manpower,
          techPoints: state.resources.techPoints + income.techPoints,
          diplomacyPoints: state.resources.diplomacyPoints + income.diplomacyPoints
        },
        invUpdates: updatedInvasions,
        nationUpdates: aiUpdates.nationUpdates
      }
    });

    // Victory/Defeat checks
    if (state.phase === GamePhases.POST_STATE) {
      const hasTelAviv = state.regions.tel_aviv?.owner === 'player' && state.regions.tel_aviv?.control > 0;
      const hasJerusalem = state.regions.jerusalem?.owner === 'player' && state.regions.jerusalem?.control > 0;

      if (!hasTelAviv || !hasJerusalem) {
        addLog('DEFEAT: Lost core territories!', LogTypes.CRISIS);
      }
    }

    if (newYear >= 2150) {
      addLog('VICTORY: Israel survives to 2150!', LogTypes.MILESTONE);
    }
  }, [state, addLog]);

  // Resolve event
  const resolveEvent = useCallback((optionIndex) => {
    if (!state.activeEvent) return;

    const event = state.activeEvent;
    const option = event.options[optionIndex];

    if (option.effects) {
      const effects = option.effects;

      // Resource changes
      if (effects.money) dispatch({ type: ActionTypes.UPDATE_RESOURCES, payload: { money: state.resources.money + effects.money } });
      if (effects.manpower) dispatch({ type: ActionTypes.UPDATE_RESOURCES, payload: { manpower: state.resources.manpower + effects.manpower } });
      if (effects.diplomacyPoints) dispatch({ type: ActionTypes.UPDATE_RESOURCES, payload: { diplomacyPoints: state.resources.diplomacyPoints + effects.diplomacyPoints } });
      if (effects.techPoints) dispatch({ type: ActionTypes.UPDATE_RESOURCES, payload: { techPoints: state.resources.techPoints + effects.techPoints } });

      // Military changes
      if (effects.undergroundBonus) dispatch({ type: ActionTypes.UPDATE_MILITARY, payload: { ug: effects.undergroundBonus } });
      if (effects.militaryBonus) dispatch({ type: ActionTypes.UPDATE_MILITARY, payload: { mil: effects.militaryBonus } });

      // Control changes
      if (effects.controlBonus) {
        Object.values(state.regions).filter(r => r.owner === 'player').forEach(r => {
          dispatch({
            type: ActionTypes.UPDATE_REGION,
            payload: { regionId: r.id, updates: { control: Math.min(100, r.control + effects.controlBonus) } }
          });
        });
      }
      if (effects.controlPenalty) {
        Object.values(state.regions).filter(r => r.owner === 'player' && r.isOccupied).forEach(r => {
          dispatch({
            type: ActionTypes.UPDATE_REGION,
            payload: { regionId: r.id, updates: { control: Math.max(0, r.control - effects.controlPenalty) } }
          });
        });
      }

      // Capture regions
      if (effects.captureRegions) {
        effects.captureRegions.forEach(rId => {
          if (state.regions[rId]) {
            dispatch({ type: ActionTypes.CAPTURE_REGION, payload: { regionId: rId, initControl: 80 } });
          }
        });
      }

      // Return regions
      if (effects.returnRegion && state.regions[effects.returnRegion]?.owner === 'player') {
        const origOwner = REGIONS_DATA[effects.returnRegion]?.startOwner;
        if (origOwner) {
          dispatch({
            type: ActionTypes.UPDATE_REGION,
            payload: { regionId: effects.returnRegion, updates: { owner: origOwner, control: 100, isOccupied: false } }
          });
        }
      }

      // Diplomatic changes
      if (effects.peaceWith) {
        const nations = Array.isArray(effects.peaceWith) ? effects.peaceWith : [effects.peaceWith];
        nations.forEach(nId => {
          if (state.nations[nId]) dispatch({ type: ActionTypes.SIGN_PEACE, payload: { nationId: nId } });
        });
      }
      if (effects.tradeWith) {
        const nations = Array.isArray(effects.tradeWith) ? effects.tradeWith : [effects.tradeWith];
        nations.forEach(nId => {
          if (state.nations[nId]) dispatch({ type: ActionTypes.SIGN_TRADE, payload: { nationId: nId } });
        });
      }
      if (effects.warWith) {
        const nations = Array.isArray(effects.warWith) ? effects.warWith : [effects.warWith];
        nations.forEach(nId => {
          if (state.nations[nId] && !state.nations[nId].isAtWar) {
            dispatch({ type: ActionTypes.DECLARE_WAR, payload: { nationId: nId } });
          }
        });
      }

      // Special flags
      if (effects.canDeclareIndependence) {
        addLog('Independence is now possible! Declare when ready.', LogTypes.MILESTONE);
      }
    }

    addLog(`Event: ${event.title} → ${option.label}`, LogTypes.EVENT);
    dispatch({ type: ActionTypes.RESOLVE_EVENT, payload: { eventId: event.id } });
  }, [state, addLog]);

  // Context value
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    addLog,
    advanceTurn,
    resolveEvent
  }), [state, addLog, advanceTurn, resolveEvent]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;