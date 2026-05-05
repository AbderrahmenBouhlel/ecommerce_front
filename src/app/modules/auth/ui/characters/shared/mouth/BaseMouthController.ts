
import { GSAPPosition } from "../core/types/types";



export type MouthInterpolateFunction<S> = (startShape: S, targetShapeState: S, progress: number) => S;

export abstract class BaseMouthController<S> {
    protected mouthShapeElement: SVGPathElement ;

    public currentShape: S;
    public interpolateShapeFn: MouthInterpolateFunction<S>;


    constructor(mouthGroup: SVGGElement , initialShape: S , interpolateShapeFn: MouthInterpolateFunction<S>) {
        this.mouthShapeElement = mouthGroup.querySelector('#mouthShape') as SVGPathElement;
        this.currentShape = structuredClone(initialShape);
        this.interpolateShapeFn = interpolateShapeFn;
    }

 
    abstract toPathString(): string ;


    protected setCurrentShape(shape: S) {
        this.currentShape = structuredClone(shape);
        this.applyShape();
    }

    protected tweenMouthShape(targetShapeState: S, duration: number = 0.5 , tl: GSAPTimeline, position: GSAPPosition = ">") {
        // Stop any ongoing tween to prevent conflicts
        const progress = { t: 0 };
        let startShape: S;

        tl.to(progress, {
            t: 1,
            ease: "power2.out",
            duration: duration,
            onStart: () => {
                startShape = structuredClone(this.currentShape);
            },
            onUpdate: () => {
                const interpolatedShape:S = this.interpolateShapeFn(startShape ? startShape : this.currentShape, targetShapeState, progress.t);
                this.setCurrentShape(interpolatedShape);
            },
        } , position);
    }

    protected applyShape() {
        this.mouthShapeElement.setAttribute('d', this.toPathString());
    }


    abstract isSameShape(shape1:S , shape2:S): boolean ;

}