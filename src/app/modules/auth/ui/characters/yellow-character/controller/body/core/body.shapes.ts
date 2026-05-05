import { YellowBodyShape } from "./YellowBodyShapeState";


export const Y_STRAIGHT_SHAPE: YellowBodyShape = {
    bottomLeft: { x: 0, y: 250 },
    
    shoulderLeft: { x: 0, y: 105 },

    cp1: { x: 0, y: 20 },
    
    cp2: { x: 120, y: 20 },
    
    shoulderRight: { x: 120, y: 105 },

    bottomRight: { x: 120, y: 250 },

    faceSocketPosition: {
        rotation: 0,
        offset: {
            offsetX: 0,
            offsetY: 0  
        }
    }
};

export const Y_LEAN_RIGHT_SHAPE: YellowBodyShape = {
    bottomLeft: { x: 0, y: 250 },
    
    shoulderLeft: { x: 20, y: 112 },

    cp1: { x: 20, y: 20 },
    
    cp2: { x: 140, y: 15 },
    
    shoulderRight: { x: 140, y: 97 },

    bottomRight: { x: 120, y: 250 },

    faceSocketPosition: {
        rotation: 0,
        offset: {
            offsetX: 40,
            offsetY: 0  
        }
    }
};






export const Y_START_SHAPE: YellowBodyShape = {
    bottomLeft: { x: 0, y: 250 },
    
    shoulderLeft: { x: 0, y: 220 },

    cp1: { x: 0, y: 135 },
    
    cp2: { x: 120, y: 135 },
    
    shoulderRight: { x: 120, y: 220 },

    bottomRight: { x: 120, y: 250 },

    faceSocketPosition: {
        rotation: 0,
        offset: {
            offsetX: 0,
            offsetY: 110  
        }
    }
};




//M0 250 20 75C20-5 140-5 140 75L120 250Z

export const Y_ENGAGED_SHAPE: YellowBodyShape = {
    bottomLeft: { x: 0, y: 250 },
    
    shoulderLeft: { x: 17, y: 102 },

    cp1: { x: 10, y: 0 },
    
    cp2: { x: 152, y: 0},
    
    shoulderRight: { x: 137, y: 102 },

    bottomRight: { x: 120, y: 250 },

    faceSocketPosition: {
        rotation: 0,
        offset: {
            offsetX: 20,
            offsetY: -25 
        }
    }
};


export const Y_SAD_SHAPE: YellowBodyShape = {
    bottomLeft: { x: 0, y: 250 },
    
    shoulderLeft: { x: 0, y: 105 },

    cp1: { x: 0, y: 20 },
    
    cp2: { x: 120, y: 20 },
    
    shoulderRight: { x: 120, y: 105 },

    bottomRight: { x: 120, y: 250 },

    faceSocketPosition: {
        rotation: 0,
        offset: {
            offsetX: 0,
            offsetY: 0  
        }
    }
};
