import { interpolatePoint } from "../../../../shared/core/math/interpolation";
import { Point } from "../../../../shared/core/types/types";




export interface LinearMouthShape {
    p1: Point; // Left Anchor (Static)
    p2: Point; // Peak 1
    p3: Point; // Valley 1
    p4: Point; // right Anchor (Static)
    rotation: number; // in degrees
}



export function interpolateLinearMouth(startShape: LinearMouthShape, targetShape: LinearMouthShape, t: number): LinearMouthShape {
        return {
            p1: interpolatePoint(startShape.p1, targetShape.p1, t),
            p2: interpolatePoint(startShape.p2, targetShape.p2, t),
            p3: interpolatePoint(startShape.p3, targetShape.p3, t),
            p4: interpolatePoint(startShape.p4, targetShape.p4, t),
            rotation: startShape.rotation + (targetShape.rotation - startShape.rotation) * t
        };
}
 

export interface MouthAgitation {
    p2: number;
    p3: number;
    p4: number;
    p5: number;
}

