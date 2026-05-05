

export type BlinkSnapshot = {
    p1: number;
    p2: number;
};



export const EPSILON: number = 0.01;

export const CLOSED:BlinkSnapshot = {
    p1: Math.PI/2 - EPSILON,
    p2: -3*Math.PI/2 + EPSILON
}
export const  OPEN:BlinkSnapshot = {
    p1: -Math.PI/2 + EPSILON ,
    p2: -Math.PI/2 - EPSILON
};


export function computeLargeArcFlag(P1: number, P2: number): number {
    // angle between P2 and P1 clockwise
    const TWO_PI = 2 * Math.PI;
    let delta =(P1 - P2 + TWO_PI) % TWO_PI;
    
    return delta > Math.PI ? 1 : 0;
}




export function  interpolateBlinkSnapShot(start: BlinkSnapshot, t: number): BlinkSnapshot {
    // from start to CLOSED and from CLOSED to OPEN
    let newState: BlinkSnapshot;

    if (t <= 0.5) {
        // from start to CLOSED
        let normalizeT = t / .5; // normalize t to [0, 1] for the first half
        const newP1 = start.p1 + (CLOSED.p1 - start.p1) * normalizeT;
        const newP2 = start.p2 + (CLOSED.p2 - start.p2) * normalizeT;
        newState = {
            p1: newP1,
            p2: newP2
        };
    } else {
        // from CLOSED to OPEN
        start = CLOSED;
        let normalizeT = (t - 0.5) / 0.5; // normalize t to [0, 1] for the second half
        const newP1 = start.p1 + (OPEN.p1 - start.p1) * normalizeT;
        const newP2 = start.p2 + (OPEN.p2 - start.p2) * normalizeT;
        newState = {
            p1: newP1,
            p2: newP2
        };
    }
    return newState;
}

