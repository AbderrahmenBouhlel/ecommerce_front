import { Point , Offset, TransformData } from "../types/types";


export const lerp = (a:number , b:number , t:number) => a + (b - a) * t ;
export const interpolatePoint = (start: Point, end: Point, t: number): Point => ({
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t)
});
export const interpolateOffset = (start: Offset, end: Offset, t: number): Offset => ({
    offsetX: lerp(start.offsetX, end.offsetX, t),
    offsetY: lerp(start.offsetY, end.offsetY, t)
});

export const interpolateTransform = (
    start: TransformData, 
    end: TransformData, 
    t: number
): TransformData => {
    return {
        offset: interpolateOffset(start.offset, end.offset, t),
        rotation: lerp(start.rotation,end.rotation,t)
    };
};
