
import { BlackBodyShape } from "./BlackBodyShapeState";

export const B_STRAIGHT_SHAPE: BlackBodyShape = {
    topLeft: { x: -3, y: 0 },
    topRight: { x: 83, y: 0 },

    rightCurve: {
        cp1: { x: 83, y: 0 },
        cp2: { x: 80, y: 220 }
    },

    bottomRight: { x: 83, y: 220 },
    bottomLeft: { x: -3, y: 220 },

    leftCurve: {
        cp1: { x: -3, y: 0 },
        cp2: { x: -3, y: 220 }
    },
    cornerRadius : 3,
    faceSocketPosition:{
        rotation: 0,
        offset: { offsetX: 0, offsetY: 0 }
    }
};


export const B_LEAN_RIGHT_SHAPE: BlackBodyShape = {
    topLeft: { x: 20, y: 0 },
    topRight: { x: 106, y: 0 },

    rightCurve: {
        cp1: { x: 106, y: 0 },
        cp2: { x: 86, y: 220 }
    },

    bottomRight: { x: 86, y: 220 },
    bottomLeft: { x: 0, y: 220 },
    
    leftCurve: {
        cp1: { x: 20, y: 0 },
        cp2: { x: 0, y: 220 }
    },

    cornerRadius :3,

    faceSocketPosition:{
        rotation: 0,
        offset: { offsetX: 23, offsetY: 0 }
    },
};

export const B_LOOKING_ANXIOUS_SHAPE: BlackBodyShape = {
    topLeft: { x: -3, y: 0 },
    topRight: { x: 83, y: 0 },

    rightCurve: {
        cp1: { x: 83, y: 0 },
        cp2: { x: 80, y: 220 }
    },

    bottomRight: { x: 83, y: 220 },
    bottomLeft: { x: -3, y: 220 },

    leftCurve: {
        cp1: { x: -3, y: 0 },
        cp2: { x: -3, y: 220 }
    },
    cornerRadius : 3,
    faceSocketPosition:{
        rotation: 0,
        offset: { offsetX: -20, offsetY: 60 }
    }  
}



export const B_LOOKING_BEHIND_SHAPE: BlackBodyShape = {
    topLeft: { x: 20, y: 0 },
    topRight: { x: 106, y: -20 },

    rightCurve: {
        cp1: { x: 116, y: 80 },
        cp2: { x: 116, y: 90 }
    },

    bottomRight: { x: 86, y: 220 },
    bottomLeft: { x: 0, y: 220 },
    
    leftCurve: {
        cp1: { x: 30, y: 80 },
        cp2: { x: 30, y: 90 }
    },

    cornerRadius :3,

 
    faceSocketPosition: {
        rotation: -13.085421,
        offset: { 
            offsetX: 10, 
            offsetY: -5
        }
    }
};



export const B_SAD_SHAPE: BlackBodyShape = {
    topLeft: { x: 0, y: 70 },
    topRight: { x: 80, y: 70 },

    rightCurve: {
        cp1: { x: 80, y: 100 },
        cp2: { x: 80, y: 110 }
    },

    bottomRight: { x: 80, y: 220 },
    bottomLeft: { x: 0, y: 220 },

    leftCurve: {
        cp1: { x: 0, y: 100 },
        cp2: { x: 0, y: 110 }
    },
    cornerRadius : 3 ,

    faceSocketPosition:{
        rotation: 0,
        offset: { offsetX: 0, offsetY: 70 }
    }
};






// aniamtion entrance shapes

export const B_BEFORE_FALL_SHAPE: BlackBodyShape = {
    topLeft: { x: -3, y: 0 },

    topRight: { x: 82.67, y: -7.50 },

    rightCurve: {
        cp1: { x: 87.76, y: 56.243 },
        cp2: { x: 87.91, y: 156.243 }
    },

    leftCurve: {
        cp1: { x: 2, y: 80 },
        cp2: { x: 2, y: 140 }
    },

    bottomRight: { x: 83, y: 220 },
    bottomLeft: { x: -3, y: 220 },

    cornerRadius: 3,

    faceSocketPosition: {
        rotation: -5.002,
        offset: { 
            offsetX: 0, 
            offsetY: -3.75 
        }
    }
};


export const B_BEFORE_FALL_SHAPE2: BlackBodyShape = {
    topLeft: { x: -9, y: 0 },

    topRight: { x: 76.67, y: -7.50 },

    rightCurve: {
        cp1: { x: 87.76, y: 56.243 },
        cp2: { x: 87.91, y: 156.243 }
    },

    leftCurve: {
        cp1: { x: 2, y: 80 },
        cp2: { x: 2, y: 140 }
    },

    bottomRight: { x: 83, y: 220 },
    bottomLeft: { x: -3, y: 220 },


    cornerRadius: 3,

    faceSocketPosition: {
        rotation: -5.002,
        offset: { 
            offsetX: -6.165,
            offsetY: -3.75  
        }
    }
};

export const B_FALLING_SHAPE: BlackBodyShape = {
    // Top is stretched 3px higher than 0
    topLeft: { x: 17, y: -3 }, 
    topRight: { x: 100.00, y: 19.26 },

    rightCurve: {
        // Pulled left, but less aggressive than before
        cp1: { x: 68.01, y: 150.61 },
        cp2: { x: 73.02, y: 90.81 }
    },

    bottomRight: { x: 83, y: 223 }, 
    bottomLeft: { x: -3, y: 223 },  

    leftCurve: {
        // Pushed left, but staying within a smoother range
        cp1: { x: -25.465, y: 158.4425 },
        cp2: { x: -16.415, y: 58.8425 },
    },
    
    cornerRadius: 3,

    faceSocketPosition: {
        rotation: 15.012, 
        offset: { offsetX: 18.5, offsetY: -3 }
    }
};

export const B_SQUASH_SHAPE: BlackBodyShape = {
    topLeft: { x: -3, y: 0 },    // Pushed down and out
    topRight: { x: 83, y: 0 },   // Pushed down and out

    rightCurve: {
        cp1: { x: 85, y: 60 },    // Bulging out
        cp2: { x: 85, y: 180 }
    },

    bottomRight: { x: 83, y: 220 }, // Flared wider on the floor
    bottomLeft: { x: -3, y: 220 }, // Flared wider on the floor

    leftCurve: {
        cp1: { x: -5, y: 60 },
        cp2: { x: -5, y: 180 }
    },
    cornerRadius: 3 ,

    faceSocketPosition: {
        rotation: 0, 
        offset: { offsetX: 0, offsetY: 0 }
    }
};

