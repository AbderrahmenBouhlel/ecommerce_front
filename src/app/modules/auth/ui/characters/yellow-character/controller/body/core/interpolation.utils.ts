
import { interpolatePurpleBodyShape } from "../../../../purple-character/controller/body/core/interpolation.utils";
import { lerp , interpolatePoint, interpolateTransform } from "../../../../shared/core/math/interpolation";
import { YellowBodyShape } from "./YellowBodyShapeState";


export const interpolateYellowBodyShape = (
    start: YellowBodyShape, 
    end: YellowBodyShape, 
    t: number
): YellowBodyShape => {
    return {
        shoulderLeft: interpolatePoint(start.shoulderLeft, end.shoulderLeft, t),
        shoulderRight: interpolatePoint(start.shoulderRight, end.shoulderRight, t),
        bottomRight: interpolatePoint(start.bottomRight, end.bottomRight, t),
        bottomLeft: interpolatePoint(start.bottomLeft, end.bottomLeft, t),

        cp1: interpolatePoint(start.cp1, end.cp1, t),
        cp2: interpolatePoint(start.cp2, end.cp2, t),

        faceSocketPosition: interpolateTransform(start.faceSocketPosition, end.faceSocketPosition, t)
    };
};

export const interpolateYellowBodyShapes = (shapes: YellowBodyShape[], t: number): YellowBodyShape =>{
    if(shapes.length === 0) throw new Error("No shapes provided for interpolation");
    if(shapes.length === 1) return shapes[0];

    const totalSegments = shapes.length -1;

    const currentSegment = Math.min(Math.floor(t * totalSegments), totalSegments - 1);

    const reltiveProgress = (t * totalSegments) - currentSegment;

    return interpolateYellowBodyShape(shapes[currentSegment], shapes[currentSegment + 1], reltiveProgress);
}

