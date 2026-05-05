import { CurvedMouthShape } from "./CurvedMouth.utils";
export const NEUTRAL_SHAPE: CurvedMouthShape = {
  move: { x: -8, y: 0 },
  cs1: { 
    cp1: { x: -8, y: -2.4 }, 
    cp2: { x: -1.6, y: -1.5 }, 
    to: { x: 0, y: -1.5 } 
  },
  cs2: { 
    cp1: { x: 1.6, y: -1.5 }, 
    cp2: { x: 8, y: -2.4 }, 
    to: { x: 8, y: 0 } 
  },
  cs3: { 
    cp1: { x: 8, y: 2.4 }, 
    cp2: { x: 1.6, y: 2.5 }, 
    to: { x: 0, y: 2.5 } 
  },
  cs4: { 
    cp1: { x: -1.6, y: 2.5 }, 
    cp2: { x: -8, y: 2.4 }, 
    to: { x: -8, y: 0 } 
  }
};



export const SAD_SHAPE: CurvedMouthShape = {
  move: { x: -11, y: 0 },
  cs1: { 
    cp1: { x: -11, y: -4.5 }, 
    cp2: { x: -2.2, y: -6 }, 
    to: { x: 0, y: -6 } 
  },
  cs2: { 
    cp1: { x: 2.2, y: -6 }, 
    cp2: { x: 11, y: -4.5 }, 
    to: { x: 11, y: 0 } 
  },
  cs3: { 
    cp1: { x: 11, y: 4 }, 
    cp2: { x: 4, y: -1.5 }, 
    to: { x: 0, y: -1.5 } 
  },
  cs4: { 
    cp1: { x: -4, y: -1.5 }, 
    cp2: { x: -11, y: 4 }, 
    to: { x: -11, y: 0 } 
  }
};



export const SURPRISED_OVAL: CurvedMouthShape = {
  move: { x: -3, y: -10 },

  cs1: { 
    cp1: { x: -3, y: -19.6 }, 
    cp2: { x: -1.5, y: -22 }, 
    to:  { x: 0, y: -22 } 
  },

  cs2: { 
    cp1: { x: 1.5, y: -22 }, 
    cp2: { x: 3, y: -19.6 }, 
    to:  { x: 3, y: -10 } 
  },

  cs3: { 
    cp1: { x: 3, y: -0.4 }, 
    cp2: { x: 1.5, y: 2 }, 
    to:  { x: 0, y: 2 } 
  },

  cs4: { 
    cp1: { x: -1.5, y: 2 }, 
    cp2: { x: -3, y: -0.4 }, 
    to:  { x: -3, y: -10 } 
  }
};


export const SURPRISED_CIRCLE: CurvedMouthShape = {
  move: { x: -3, y: 0 },
  cs1: { 
    cp1: { x: -3, y: -3.2 }, 
    cp2: { x: -1.5, y: -4 }, 
    to: { x: 0, y: -4 } 
  },
  cs2: { 
    cp1: { x: 1.5, y: -4 }, 
    cp2: { x: 3, y: -3.2 }, 
    to: { x: 3, y: 0 } 
  },
  cs3: { 
    cp1: { x: 3, y: 3.2 }, 
    cp2: { x: 1.5, y: 4 }, 
    to: { x: 0, y: 4 } 
  },
  cs4: { 
    cp1: { x: -1.5, y: 4 }, 
    cp2: { x: -3, y: 3.2 }, 
    to: { x: -3, y: 0 } 
  }
};