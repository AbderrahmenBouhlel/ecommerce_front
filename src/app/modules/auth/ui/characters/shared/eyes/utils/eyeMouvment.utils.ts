import { EyeMove, Move } from "../../core/types/types";




export function interpolateEyesMove(start: EyeMove, end: EyeMove, t: number): EyeMove {
    return {
        eyePair: {
            moveX: start.eyePair.moveX + (end.eyePair.moveX - start.eyePair.moveX) * t,
            moveY: start.eyePair.moveY + (end.eyePair.moveY - start.eyePair.moveY) * t,
        },
        eyePupil: {
            moveX: start.eyePupil.moveX + (end.eyePupil.moveX - start.eyePupil.moveX) * t,
            moveY: start.eyePupil.moveY + (end.eyePupil.moveY - start.eyePupil.moveY) * t,
        }
    };
}

export function interpolateMove(start: Move, end: Move, t: number): Move {
    return {
        moveX: start.moveX + (end.moveX - start.moveX) * t,
        moveY: start.moveY + (end.moveY - start.moveY) * t,
    };
}



export function amplification(d: number , M: number=15 , k: number= .05){
    if (d < 0){
        return 1
    }
    return M *(1 - Math.exp(-k*d)) ;
}