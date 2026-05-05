import { TransformData } from "../../core/types/types";



export abstract class BaseBodyShapeState<T> {
    protected current: T;

    constructor(initial: T) {
        this.current = structuredClone(initial);
    }

    public getCurrent(): T {
        return this.current;
    }

    public setCurrent(shape: T): void {
        this.current = shape;
    }

    public abstract toPathString(): string;

    public abstract getCurrentFaceSocketPosition(): TransformData;

    protected static round(n: number, decimals = 3): number {
        const factor = Math.pow(10, decimals);
        return Math.round(n * factor) / factor;
    }
}