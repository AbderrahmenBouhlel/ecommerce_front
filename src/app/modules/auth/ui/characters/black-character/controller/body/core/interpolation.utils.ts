import { BlackBodyShape } from "./BlackBodyShapeState";

import { lerp , interpolatePoint, interpolateTransform } from "../../../../shared/core/math/interpolation";


export const interpolateBodyShapes = (shapes: BlackBodyShape[], t: number): BlackBodyShape =>{
    if(shapes.length === 0) throw new Error("No shapes provided for interpolation");
    if(shapes.length === 1) return shapes[0];

    const totalSegments = shapes.length -1;

    const currentSegment = Math.min(Math.floor(t * totalSegments), totalSegments - 1);

    const reltiveProgress = (t * totalSegments) - currentSegment;

    return interpolateBodyShape(shapes[currentSegment], shapes[currentSegment + 1], reltiveProgress);
}

export const interpolateBodyShape = (
    start: BlackBodyShape, 
    end: BlackBodyShape, 
    t: number
): BlackBodyShape => {
    return {
        // Simple Points
        topLeft: interpolatePoint(start.topLeft, end.topLeft, t),
        topRight: interpolatePoint(start.topRight, end.topRight, t),
        bottomRight: interpolatePoint(start.bottomRight, end.bottomRight, t),
        bottomLeft: interpolatePoint(start.bottomLeft, end.bottomLeft, t),

        // Nested Curves
        leftCurve: {
            cp1: interpolatePoint(start.leftCurve.cp1, end.leftCurve.cp1, t),
            cp2: interpolatePoint(start.leftCurve.cp2, end.leftCurve.cp2, t),
        },
        rightCurve: {
            cp1: interpolatePoint(start.rightCurve.cp1, end.rightCurve.cp1, t),
            cp2: interpolatePoint(start.rightCurve.cp2, end.rightCurve.cp2, t),
        },

        // Single Values
        cornerRadius: lerp(start.cornerRadius, end.cornerRadius, t),

        faceSocketPosition: interpolateTransform(start.faceSocketPosition, end.faceSocketPosition, t)
    };
};





