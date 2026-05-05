




export type TransformData = {
    rotation: number
    offset :Offset ;
}




export type Point = {
    x: number ,
    y: number
}


export type Offset = {
  offsetX:number;
  offsetY:number;
}



// eyes related types
export type Move = {
    moveX: number;
    moveY: number;
}

export type EyeMove = {
    eyePair: Move;
    eyePupil: Move;
};

export type EyeRadius = {
    rx: number;
    ry: number;
}






export type MousePosition = {
    x: number;
    y: number;
}
export type MousePositionProvider = () => MousePosition;




export enum CharactersState {
    Entering,
    Reseting,
    Idle,
    Anxious,
    Sad,
    Attentive,
    Engaged
}



// GSAP related types
export type GSAPPosition = number | string;




// Mouth related types





