
import { lerp , interpolatePoint, interpolateTransform } from "../../../../shared/core/math/interpolation";
import { PurpleBodyShape } from "./PurpleBodyShapeState";


export const interpolatePurpleBodyShapes = (shapes: PurpleBodyShape[], t: number): PurpleBodyShape =>{
    if(shapes.length === 0) throw new Error("No shapes provided for interpolation");
    if(shapes.length === 1) return shapes[0];

    const totalSegments = shapes.length -1;

    const currentSegment = Math.min(Math.floor(t * totalSegments), totalSegments - 1);

    const reltiveProgress = (t * totalSegments) - currentSegment;

    return interpolatePurpleBodyShape(shapes[currentSegment], shapes[currentSegment + 1], reltiveProgress);
}

export const interpolatePurpleBodyShape = (
    start: PurpleBodyShape, 
    end: PurpleBodyShape, 
    t: number
): PurpleBodyShape => {
    return {
        // Simple Points
        topLeft: interpolatePoint(start.topLeft, end.topLeft, t),
        topRight: interpolatePoint(start.topRight, end.topRight, t),
        bottomRight: interpolatePoint(start.bottomRight, end.bottomRight, t),
        bottomLeft: interpolatePoint(start.bottomLeft, end.bottomLeft, t),

        // Nested Curves
        leftCurve: {
            midSeg: interpolatePoint(start.leftCurve.midSeg, end.leftCurve.midSeg, t),
            bottomSegment: {
                cp1: interpolatePoint(start.leftCurve.bottomSegment.cp1, end.leftCurve.bottomSegment.cp1, t),
                cp2: interpolatePoint(start.leftCurve.bottomSegment.cp2, end.leftCurve.bottomSegment.cp2, t),
            },
            topSegment: {
                cp1: interpolatePoint(start.leftCurve.topSegment.cp1, end.leftCurve.topSegment.cp1, t),
                cp2: interpolatePoint(start.leftCurve.topSegment.cp2, end.leftCurve.topSegment.cp2, t),
            }
        },
        rightCurve: {
            midSeg: interpolatePoint(start.rightCurve.midSeg, end.rightCurve.midSeg, t),
            topSegment: {
                cp1: interpolatePoint(start.rightCurve.topSegment.cp1, end.rightCurve.topSegment.cp1, t),
                cp2: interpolatePoint(start.rightCurve.topSegment.cp2, end.rightCurve.topSegment.cp2, t),
            },
            bottomSegment: {
                cp1: interpolatePoint(start.rightCurve.bottomSegment.cp1, end.rightCurve.bottomSegment.cp1, t),
                cp2: interpolatePoint(start.rightCurve.bottomSegment.cp2, end.rightCurve.bottomSegment.cp2, t),
            }
        },

        // Single Values
        cornerRadius: lerp(start.cornerRadius, end.cornerRadius, t),

        faceSocketPosition: interpolateTransform(start.faceSocketPosition, end.faceSocketPosition, t)
    };
};





