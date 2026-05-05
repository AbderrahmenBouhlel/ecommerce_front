import { PurpleBodyShape } from "./PurpleBodyShapeState"


export const P_STRAIGHT_SHAPE : PurpleBodyShape = {
    topLeft: { x: 0, y: 0 },
    topRight: { x: 160, y: 0 },
    bottomRight: { x: 160, y: 300 },
    bottomLeft: { x: 0, y: 300 },

    // Straight vertical right side
    rightCurve: {
      midSeg: { x: 160, y: 150 },
      topSegment: { 
        cp1: { x: 160, y: 0 }, 
        cp2: { x: 160, y: 150 } 
      },
      bottomSegment: {
        cp1: { x: 160, y: 150 },
        cp2: { x: 160, y: 300 }
      }
      
    },

    // Straight vertical left side
    leftCurve: {
      midSeg: { x: 0, y: 150 },
      topSegment: { 
        cp1: { x: 0, y: 0 },
        cp2: { x: 0, y: 150 }
      },
      bottomSegment: {
        cp1: { x: 0, y: 150 },
        cp2: { x: 0, y: 300 }
      }
    },

    cornerRadius: 2,

    faceSocketPosition: {
      rotation: 0,
      offset: { offsetX: 0, offsetY: 0 }
    }
}

export const P_LEAN_RIGHT_SHAPE : PurpleBodyShape = {
    topLeft: { x: 20, y: 0 },
    topRight: { x: 180, y: 0 }, 
    bottomRight: { x: 160, y: 300 },
    bottomLeft: { x: 0, y: 300 },

    // Straight vertical right side
    rightCurve: {
      midSeg: { x: 170, y: 150 },
      topSegment: { 
        cp1: { x: 180, y: 0 }, 
        cp2: { x: 170, y: 150 } 
      },
      bottomSegment: {
          cp1: { x: 170, y: 150 }, // At midSeg
          cp2: { x: 160, y: 300 }  // At bottomRight
      }
      
    },

    // Straight vertical left side
    leftCurve: {
        // midSeg is the midpoint between {0, 300} and {20, 0}
        midSeg: { x: 10, y: 150 },
        bottomSegment: { 
            cp1: { x: 0, y: 300 },   // At bottomLeft
            cp2: { x: 10, y: 150 }   // At midSeg
        },
        topSegment: { 
            cp1: { x: 10, y: 150 },  // At midSeg
            cp2: { x: 20, y: 0 }     // At topLeft
        }
    },

    cornerRadius: 2,

    faceSocketPosition: {
        rotation: 0,
        // Assuming a similar offset shift as the Black character
        offset: { offsetX: 20, offsetY: 0 }
    }
}

export const P_ANXIOUS_SHAPE : PurpleBodyShape = {
    topLeft: { x: 0, y: 0 },
    topRight: { x: 160, y: 0 },
    bottomRight: { x: 160, y: 300 },
    bottomLeft: { x: 0, y: 300 },

    // Straight vertical right side
    rightCurve: {
      midSeg: { x: 160, y: 150 },
      topSegment: { 
        cp1: { x: 160, y: 0 }, 
        cp2: { x: 160, y: 150 } 
      },
      bottomSegment: {
        cp1: { x: 160, y: 150 },
        cp2: { x: 160, y: 300 }
      }
      
    },

    // Straight vertical left side
    leftCurve: {
      midSeg: { x: 0, y: 150 },
      topSegment: { 
        cp1: { x: 0, y: 0 },
        cp2: { x: 0, y: 150 }
      },
      bottomSegment: {
        cp1: { x: 0, y: 150 },
        cp2: { x: 0, y: 300 }
      }
    },

    cornerRadius: 2,

    faceSocketPosition: {
      rotation: 0,
      offset: { offsetX: -48, offsetY: 10 }
    }
}



export const P_LOOK_DOWN_SHAPE: PurpleBodyShape = {
    topLeft: { x: 71, y: -45 },
    topRight: { x: 186, y: 46 },
    bottomRight: { x: 160, y: 300 },
    bottomLeft: { x: 0, y: 300 },

    rightCurve: {
        midSeg: { x: 142, y: 204 },
        topSegment: {
            cp1: { x: 158, y: 76 },
            cp2: { x: 137, y: 135 }
        },
        bottomSegment: {
            cp1: { x: 145, y: 228 },
            cp2: { x: 161, y: 301 }
        }
    },

    leftCurve: {
        midSeg: { x: -10, y: 140 },
        bottomSegment: {
            cp1: { x: -5, y: 250 },
            cp2: { x: -10, y: 190 }
        },
        topSegment: {
            cp1: { x: -7, y: 96 },
            cp2: { x: 15, y: 30 }
        }
    },

    cornerRadius: 0,
    faceSocketPosition: {
        rotation: 35,
        offset: {
            offsetX: 50,
            offsetY: -40
        }
    }
};




export const P_SAD_SHAPE: PurpleBodyShape = {
    topLeft: { x: -28, y: -17 },
    topRight: { x: 130.13, y: 7 },
    bottomRight: { x: 160, y: 300 },
    bottomLeft: { x: 0, y: 300 },

    rightCurve: {
        midSeg: { x: 114, y: 90 },
        topSegment: {
            cp1: { x: 126, y: 29 },
            cp2: { x: 123, y: 42 }
        },
        bottomSegment: {
            cp1: { x: 146, y: 227 },
            cp2: { x: 161, y: 301 }
        }
    },

    leftCurve: {
        midSeg: { x: -49, y: 103 },
        bottomSegment: {
            cp1: { x: -12, y: 244 },
            cp2: { x: -25, y: 186 }
        },
        topSegment: {
            cp1: { x: -41, y: 54 },
            cp2: { x: -37, y: 33 }
        }
    },

    cornerRadius: 2,
    faceSocketPosition: {
        rotation: 8.65,
        offset: {
            offsetX: -35,
            offsetY: -10
        }
    }
};



export const P_SQUARE_SHAPE: PurpleBodyShape = {
    topLeft: { x: 0, y: 140 },
    topRight: { x: 160, y: 140 },
    bottomRight: { x: 160, y: 300 },
    bottomLeft: { x: 0, y: 300 },

    rightCurve: {
        midSeg: { x: 160, y: 216 },
        topSegment: {
            cp1: { x: 160, y: 182 },
            cp2: { x: 160, y: 192 }
        },
        bottomSegment: {
            cp1: { x: 160, y: 242 },
            cp2: { x: 160, y: 300 }
        }
    },

    leftCurve: {
        midSeg: { x: 0, y: 213 },
        bottomSegment: {
            cp1: { x: 0, y: 257 },
            cp2: { x: 0, y: 241 }
        },
        topSegment: {
            cp1: { x: 0, y: 160 },
            cp2: { x: 0, y: 192 }
        }
    },

    cornerRadius: 2,
    faceSocketPosition: {
        rotation: 0,
        offset: {
            offsetX: 0,
            offsetY: 140
        }
    }
};

export const P_SQUARE_SHAPE_ROTATED__45: PurpleBodyShape = {
    // Calculated based on anchor (0, 300)
    topLeft: { x: -113.14, y: 186.86 }, 
    topRight: { x: 0, y: 73.73 },
    bottomRight: { x: 113.14, y: 186.86 },
    bottomLeft: { x: 0, y: 300 }, // Anchor remains the same

    rightCurve: {
        midSeg: { x: 53.74, y: 127.48 },
        topSegment: {
            cp1: { x: 29.7, y: 103.44 },
            cp2: { x: 36.77, y: 110.51 }
        },
        bottomSegment: {
            cp1: { x: 72.12, y: 145.87 },
            cp2: { x: 113.14, y: 186.86 }
        }
    },

    leftCurve: {
        midSeg: { x: -61.52, y: 238.48 },
        bottomSegment: {
            cp1: { x: -30.41, y: 269.59 },
            cp2: { x: -41.72, y: 258.28 }
        },
        topSegment: {
            cp1: { x: -98.99, y: 201.01 },
            cp2: { x: -76.37, y: 223.63 }
        }
    },

    cornerRadius: 2,
    faceSocketPosition: {
        rotation: -45, // Updated rotation
        offset: {
            offsetX: -113.14,
            offsetY: 186.86
        }
    }
};

export const P_SQUARE_SHAPE_ROTATED_PI_36: PurpleBodyShape = {
    // Rotated around (160, 300) by PI/36 (5 degrees)
    topLeft: { x: 14.56, y: 126.83 },
    topRight: { x: 173.95, y: 140.61 },
    bottomRight: { x: 160, y: 300 }, // Anchor point
    bottomLeft: { x: 0.61, y: 286.04 },

    rightCurve: {
        midSeg: { x: 167.33, y: 216.32 },
        topSegment: {
            cp1: { x: 170.29, y: 182.47 },
            cp2: { x: 169.41, y: 192.44 }
        },
        bottomSegment: {
            cp1: { x: 165.06, y: 242.22 },
            cp2: { x: 160, y: 300 }
        }
    },

    leftCurve: {
        midSeg: { x: 8.24, y: 186.22 },
        bottomSegment: {
            cp1: { x: 4.44, y: 230.04 },
            cp2: { x: 5.84, y: 214.10 }
        },
        topSegment: {
            cp1: { x: 13.78, y: 133.47 },
            cp2: { x: 10.96, y: 165.29 }
        }
    },

    cornerRadius: 2,
    faceSocketPosition: {
        rotation: 5, // PI/36 in degrees
        offset: {
            offsetX: 14.56,
            offsetY: 126.83
        }
    }
};
