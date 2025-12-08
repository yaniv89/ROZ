// src/data/mapPaths.js
// ViewBox: 0 0 1000 800

export const MAP_VIEWBOX = {
  x: 0,
  y: 0,
  width: 1000,
  height: 800
};

// =====================================================================
// COORDINATE POINTS (ANCHORS)
// These are NOT regions. They are just X,Y dots used to connect borders.
// =====================================================================
const PTS = {
  // COASTLINE (North to South)
  COAST_TURKEY_SYRIA: { x: 280, y: 150 },
  COAST_SYRIA_LEB:    { x: 270, y: 180 },
  COAST_LEB_ISRAEL:   { x: 260, y: 240 }, // Border point
  COAST_HAIFA:        { x: 255, y: 260 },
  COAST_TELAVIV:      { x: 250, y: 290 },
  COAST_GAZA_START:   { x: 245, y: 315 },
  COAST_GAZA_END:     { x: 235, y: 335 }, // Border w/ Egypt

  // ISRAEL INLAND
  JERUSALEM:          { x: 280, y: 310 },
  WESTBANK_NW:        { x: 280, y: 280 },
  WESTBANK_NE:        { x: 300, y: 280 }, // Jordan River N
  WESTBANK_SE:        { x: 300, y: 320 }, // Dead Sea N
  DEAD_SEA_S:         { x: 300, y: 350 }, // Dead Sea S
  EILAT:              { x: 280, y: 450 }, // Red Sea tip

  // BORDER JUNCTIONS (Tri-points)
  TRIPOINT_ISR_LEB_SYR: { x: 290, y: 230 }, // Golan North
  TRIPOINT_ISR_SYR_JOR: { x: 310, y: 260 }, // Golan South / Yarmouk
  
  TRIPOINT_SYR_JOR_IRQ: { x: 450, y: 280 }, // Desert junction
  TRIPOINT_JOR_SAU_IRQ: { x: 480, y: 360 }, // Desert junction
  TRIPOINT_TUR_SYR_IRQ: { x: 460, y: 170 }, // North junction
  TRIPOINT_TUR_IRQ_IRN: { x: 550, y: 160 }, // Mountain junction

  // IRAQ/IRAN/KUWAIT
  BASRA_GATE:         { x: 580, y: 350 },
  FAO_PENINSULA:      { x: 620, y: 400 }, // Persian Gulf tip
  KUWAIT_BORDER:      { x: 580, y: 400 },

  // EGYPT/RED SEA
  SUEZ:               { x: 220, y: 360 },
  SHARM_EL_SHEIKH:    { x: 260, y: 470 }, // Tip of Sinai
};

// Helper to make path strings
const P = (...pts) => pts.map((pt, i) => (i===0 ? "M" : "L") + ` ${pt.x},${pt.y}`).join(" ") + " Z";


export const MAP_PATHS = {
  // ============ ISRAEL CORE ============
  haifa: {
    path: P(PTS.COAST_LEB_ISRAEL, PTS.TRIPOINT_ISR_LEB_SYR, {x:280, y:250}, PTS.WESTBANK_NW, PTS.COAST_HAIFA),
    labelX: 270, labelY: 255
  },
  galilee: {
    path: P(PTS.TRIPOINT_ISR_LEB_SYR, PTS.TRIPOINT_ISR_SYR_JOR, PTS.WESTBANK_NE, {x:280, y:250}),
    labelX: 295, labelY: 250
  },
  tel_aviv: {
    path: P(PTS.COAST_HAIFA, PTS.WESTBANK_NW, PTS.JERUSALEM, PTS.COAST_TELAVIV),
    labelX: 260, labelY: 280
  },
  jerusalem: {
    path: P(PTS.COAST_TELAVIV, PTS.JERUSALEM, PTS.WESTBANK_SE, {x:280, y:330}, PTS.COAST_GAZA_START),
    labelX: 275, labelY: 315
  },
  negev: {
    path: P({x:280, y:330}, PTS.WESTBANK_SE, PTS.DEAD_SEA_S, PTS.EILAT, PTS.COAST_GAZA_END, PTS.COAST_GAZA_START),
    labelX: 280, labelY: 380
  },

  // ============ CONTESTED ============
  gaza: {
    path: P(PTS.COAST_GAZA_START, PTS.COAST_GAZA_END, {x:255, y:325}),
    labelX: 250, labelY: 325
  },
  west_bank: {
    path: P(PTS.WESTBANK_NW, PTS.WESTBANK_NE, PTS.WESTBANK_SE, PTS.JERUSALEM),
    labelX: 290, labelY: 300
  },
  golan: {
    path: P(PTS.TRIPOINT_ISR_LEB_SYR, {x:310, y:230}, PTS.TRIPOINT_ISR_SYR_JOR),
    labelX: 300, labelY: 245
  },

  // ============ EGYPT ============
  egypt_sinai: {
    path: P(PTS.SUEZ, PTS.COAST_GAZA_END, PTS.EILAT, PTS.SHARM_EL_SHEIKH),
    labelX: 240, labelY: 410
  },
  egypt_cairo: {
    path: P({x:50, y:350}, PTS.SUEZ, PTS.SHARM_EL_SHEIKH, {x:180, y:600}, {x:50, y:600}),
    labelX: 120, labelY: 480
  },

  // ============ LEBANON ============
  lebanon_south: {
    // Starts at Beirut coast, goes East to the Hinge, South to Israel border, West to Rosh Hanikra
    path: P({x:265, y:210}, {x:280, y:210}, PTS.TRIPOINT_ISR_LEB_SYR, PTS.COAST_LEB_ISRAEL),
    labelX: 275, labelY: 225
  },
  
  lebanon_north: {
    // Starts at Syria coast, goes inland to NE corner, down to Hinge, West to Beirut
    path: P(PTS.COAST_SYRIA_LEB, {x:290, y:190}, {x:280, y:210}, {x:265, y:210}),
    labelX: 280, labelY: 195
  },

  // ============ SYRIA ============
  syria_damascus: {
    // Traces the exact eastern border of Lebanon (NE -> Hinge -> Tripoint) to close the gap
    path: P(
      PTS.COAST_TURKEY_SYRIA, 
      PTS.TRIPOINT_TUR_SYR_IRQ, 
      PTS.TRIPOINT_SYR_JOR_IRQ, 
      PTS.TRIPOINT_ISR_SYR_JOR, 
      {x:310, y:230},             // Bulge east of Golan
      PTS.TRIPOINT_ISR_LEB_SYR,   // Mount Hermon
      {x:280, y:210},             // <--- THE FIX: The Hinge point shared with Lebanon
      {x:290, y:190},             // Lebanon NE corner
      PTS.COAST_SYRIA_LEB
    ),
    labelX: 360, labelY: 210
  },

  // ============ JORDAN ============
  jordan_amman: {
    path: P(PTS.TRIPOINT_ISR_SYR_JOR, PTS.TRIPOINT_SYR_JOR_IRQ, PTS.TRIPOINT_JOR_SAU_IRQ, {x:300, y:460}, PTS.EILAT, PTS.DEAD_SEA_S, PTS.WESTBANK_NE),
    labelX: 360, labelY: 330
  },

  // ============ IRAQ ============
  iraq_baghdad: {
    path: P(PTS.TRIPOINT_TUR_SYR_IRQ, PTS.TRIPOINT_TUR_IRQ_IRN, {x:600, y:250}, PTS.BASRA_GATE, PTS.TRIPOINT_SYR_JOR_IRQ),
    labelX: 520, labelY: 240
  },
  iraq_basra: {
    path: P(PTS.BASRA_GATE, {x:600, y:250}, {x:650, y:300}, PTS.FAO_PENINSULA, PTS.KUWAIT_BORDER, PTS.TRIPOINT_JOR_SAU_IRQ, PTS.TRIPOINT_SYR_JOR_IRQ),
    labelX: 550, labelY: 320
  },

  // ============ SAUDI ARABIA ============
  saudi_north: {
    // East border traces Kuwait -> Gulf -> UAE -> Desert Hub
    path: P(
      {x:300, y:460}, 
      PTS.TRIPOINT_JOR_SAU_IRQ, 
      PTS.KUWAIT_BORDER, 
      {x:650, y:450}, // Start of UAE border
      {x:700, y:460}, // End of UAE border / Start of Oman border
      {x:600, y:550}, // <--- FIXED: The "Desert Hub"
      {x:350, y:600}  // Divider with Saudi South
    ),
    labelX: 450, labelY: 480
  },
  
  saudi_south: {
    // North border is the divider line; East is the Oman border
    path: P(
      {x:350, y:600}, // Divider West
      {x:600, y:550}, // <--- FIXED: The "Desert Hub"
      {x:650, y:600}, // Border with Oman/Yemen
      {x:400, y:700}  // Border with Yemen South
    ),
    labelX: 480, labelY: 620
  },

  // ============ TURKEY ============
  turkey_west: {
    path: P({x:50, y:40}, {x:350, y:20}, {x:350, y:150}, PTS.COAST_TURKEY_SYRIA, {x:100, y:150}),
    labelX: 200, labelY: 100
  },
  
  turkey_east: {
    path: P({x:350, y:20}, {x:650, y:40}, PTS.TRIPOINT_TUR_IRQ_IRN, PTS.TRIPOINT_TUR_SYR_IRQ, PTS.COAST_TURKEY_SYRIA, {x:350, y:150}),
    labelX: 450, labelY: 100
  },

  // ============ IRAN ============
  iran_west: {
    path: P(PTS.TRIPOINT_TUR_IRQ_IRN, {x:700, y:100}, {x:700, y:350}, PTS.FAO_PENINSULA, {x:650, y:300}, {x:600, y:250}),
    labelX: 650, labelY: 220
  },
  iran_east: {
    path: P({x:700, y:100}, {x:900, y:100}, {x:850, y:400}, {x:700, y:350}),
    labelX: 800, labelY: 220
  },

  // ============ GULF STATES ============
  kuwait: {
    path: P(PTS.KUWAIT_BORDER, PTS.FAO_PENINSULA, {x:600, y:410}, {x:590, y:410}),
    labelX: 595, labelY: 415
  },
  bahrain: {
    path: "M 620,430 L 630,430 L 630,440 L 620,440 Z", 
    labelX: 625, labelY: 435
  },
  qatar: {
    path: P({x:630, y:440}, {x:640, y:420}, {x:650, y:440}),
    labelX: 640, labelY: 435
  },
  uae: {
    // Saudi border is exactly the line from (650,450) to (700,460)
    path: P({x:650, y:450}, {x:680, y:430}, {x:720, y:440}, {x:700, y:460}),
    labelX: 685, labelY: 445
  },
  
  oman: {
    // Connects UAE tip -> Coast -> Yemen border -> Saudi Desert Hub -> UAE
    path: P(
      {x:700, y:460}, // Border with UAE
      {x:720, y:440}, // Coast
      {x:760, y:460}, // East tip
      {x:720, y:550}, // Coast South
      {x:650, y:600}, // Border with Yemen
      {x:600, y:550}  // <--- FIXED: The "Desert Hub" shared with Saudi
    ),
    labelX: 710, labelY: 500
  },
  yemen: {
    // Top border matches Saudi South and Oman exactly
    path: P(
      {x:400, y:700}, // Border with Saudi
      {x:650, y:600}, // Border with Saudi/Oman
      {x:720, y:550}, // Coast
      {x:450, y:750}  // Aden/Red Sea
    ),
    labelX: 550, labelY: 680
  }
};


// ============ COSMETIC WATER ============
export const MEDITERRANEAN_SEA = {
  path: P({x:0,y:0}, {x:280,y:0}, PTS.COAST_TURKEY_SYRIA, PTS.COAST_SYRIA_LEB, PTS.COAST_LEB_ISRAEL, PTS.COAST_GAZA_START, PTS.SUEZ, {x:50,y:350}, {x:0,y:350}),
};

export const RED_SEA = {
  path: P(PTS.SUEZ, PTS.SHARM_EL_SHEIKH, PTS.EILAT, {x:300, y:460}, {x:350, y:600}, {x:400, y:700}, {x:200, y:750}, {x:180, y:600}),
};

export const PERSIAN_GULF = {
  path: P(PTS.FAO_PENINSULA, {x:700, y:350}, {x:760, y:460}, {x:720, y:440}, {x:680, y:430}, {x:640, y:420}),
};

export const getPathCentroid = (pathData) => ({ x: pathData.labelX, y: pathData.labelY });