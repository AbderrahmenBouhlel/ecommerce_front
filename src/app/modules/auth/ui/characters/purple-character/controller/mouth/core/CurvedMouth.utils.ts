import { Point } from "../../../../shared/core/types/types";



interface CubicSegment {
    cp1: Point
    cp2: Point
    to: Point
}
export type CurvedMouthShape = {
    move:Point ,
    cs1: CubicSegment; // Top-Left to Mid-Top
    cs2: CubicSegment; // Mid-Top to Top-Right
    cs3: CubicSegment; // Top-Right to Mid-Bottom
    cs4: CubicSegment; // Mid-Bottom back to Start 
}


function interpolatePoint(p1: Point, p2: Point, t: number): Point {
    return {
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t
    };
}

function interpolateCubicSegment(seg1: CubicSegment, seg2: CubicSegment, t: number): CubicSegment {
    return {
        cp1: interpolatePoint(seg1.cp1, seg2.cp1, t),
        cp2: interpolatePoint(seg1.cp2, seg2.cp2, t),
        to: interpolatePoint(seg1.to, seg2.to, t)
    };
}


export function interpolateMouthShape(shape1: CurvedMouthShape, shape2: CurvedMouthShape, t: number): CurvedMouthShape {
    return {
        move: interpolatePoint(shape1.move, shape2.move, t),
        cs1: interpolateCubicSegment(shape1.cs1, shape2.cs1, t),
        cs2: interpolateCubicSegment(shape1.cs2, shape2.cs2, t),
        cs3: interpolateCubicSegment(shape1.cs3, shape2.cs3, t),
        cs4: interpolateCubicSegment(shape1.cs4, shape2.cs4, t)
    };
}




export function isSamePoint(a: Point, b: Point): boolean {
    return a.x === b.x && a.y === b.y;
}

export function isSameCubicSegment(a: CubicSegment, b: CubicSegment): boolean {
    return (
        isSamePoint(a.cp1, b.cp1) &&
        isSamePoint(a.cp2, b.cp2) &&
        isSamePoint(a.to, b.to)
    );
}