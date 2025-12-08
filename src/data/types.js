// src/data/types.js
// Game phase and status enums

export const GamePhases = {
  PRE_STATE: 'PRE_STATE',
  POST_STATE: 'POST_STATE'
};

export const RelationStatus = {
  WAR: 'War',
  HOSTILE: 'Hostile',
  COLD_PEACE: 'Cold Peace',
  NEUTRAL: 'Neutral',
  FRIENDLY: 'Friendly',
  ALLIED: 'Allied'
};

export const ActionTypes = {
  ADVANCE_TURN: 'ADVANCE_TURN',
  DECLARE_INDEPENDENCE: 'DECLARE_INDEPENDENCE',
  RESET_GAME: 'RESET_GAME',
  UPDATE_RESOURCES: 'UPDATE_RESOURCES',
  SPEND_RESOURCES: 'SPEND_RESOURCES',
  UPDATE_REGION: 'UPDATE_REGION',
  CAPTURE_REGION: 'CAPTURE_REGION',
  UPDATE_RELATION: 'UPDATE_RELATION',
  DECLARE_WAR: 'DECLARE_WAR',
  SIGN_PEACE: 'SIGN_PEACE',
  SIGN_TRADE: 'SIGN_TRADE',
  SIGN_MILITARY_PACT: 'SIGN_MILITARY_PACT',
  RESEARCH_TECH: 'RESEARCH_TECH',
  UPDATE_SLIDER: 'UPDATE_SLIDER',
  LAUNCH_INVASION: 'LAUNCH_INVASION',
  UPDATE_INVASION: 'UPDATE_INVASION',
  REMOVE_INVASION: 'REMOVE_INVASION',
  ADD_LOG: 'ADD_LOG',
  SET_EVENT: 'SET_EVENT',
  RESOLVE_EVENT: 'RESOLVE_EVENT',
  UPDATE_MILITARY: 'UPDATE_MILITARY',
  AI_NATIONS_TURN: 'AI_NATIONS_TURN'
};

export const LogTypes = {
  ACTION: 'action',
  EVENT: 'event',
  COMBAT: 'combat',
  MILESTONE: 'milestone',
  CRISIS: 'crisis',
  TECH: 'tech',
  DIPLOMACY: 'diplomacy',
  AI: 'ai'
};

export const RegionTypes = {
  CORE: 'core',           // Israeli core territories
  CONTESTED: 'contested', // Gaza, West Bank, Golan
  CAPTURABLE: 'capturable', // Can be captured (Sinai, S.Lebanon)
  FOREIGN: 'foreign'      // Foreign nation territories
};

export const TechCategories = {
  AGRI_ECON: 'agri_econ',
  DEFENSE: 'defense',
  INTEL: 'intel'
};
