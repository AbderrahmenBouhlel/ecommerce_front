import { interpolateMouthShape, CurvedMouthShape, isSameCubicSegment, isSamePoint } from "./core/CurvedMouth.utils";
import { GSAPPosition } from "../../../shared/core/types/types";
import { NEUTRAL_SHAPE, SAD_SHAPE, SURPRISED_CIRCLE, SURPRISED_OVAL } from "./core/mouth.shapes";
import { BaseMouthController } from "../../../shared/mouth/BaseMouthController";



export class CurvedMouthController  extends BaseMouthController<CurvedMouthShape>{



    constructor(mouthGroup: SVGGElement) {
        super(mouthGroup , NEUTRAL_SHAPE , interpolateMouthShape);
        this.applyShape();
    }


    /** Transitions to the Sad expression */
    public setSad(duration: number = 0.5 , tl:GSAPTimeline , position: GSAPPosition = ">") {
        this.tweenMouthShape(SAD_SHAPE, duration, tl, position);
    }

    /** Transitions to the Tall Oval Surprise expression */
    public setSurprisedOval(duration: number = 0.2 , tl: GSAPTimeline , position: GSAPPosition = ">") {
        this.tweenMouthShape(SURPRISED_OVAL, duration, tl, position);
    }

    /** Transitions to the Rounded Circle Surprise expression */
    public setSurprisedCircle(duration: number = 0.2 , tl: GSAPTimeline , position: GSAPPosition = ">") {
        this.tweenMouthShape(SURPRISED_CIRCLE, duration, tl, position);
    }

    /** Resets the mouth to the Neutral expression */
    public reset(duration: number = 0.5 , tl: GSAPTimeline, position: GSAPPosition = ">") {
        this.tweenMouthShape(NEUTRAL_SHAPE, duration, tl, position);
    }


    


    public toPathString(): string {
        const s = this.currentShape;
        return `M ${s.move.x},${s.move.y} ` +
               `C ${s.cs1.cp1.x},${s.cs1.cp1.y} ${s.cs1.cp2.x},${s.cs1.cp2.y} ${s.cs1.to.x},${s.cs1.to.y} ` +
               `C ${s.cs2.cp1.x},${s.cs2.cp1.y} ${s.cs2.cp2.x},${s.cs2.cp2.y} ${s.cs2.to.x},${s.cs2.to.y} ` +
               `C ${s.cs3.cp1.x},${s.cs3.cp1.y} ${s.cs3.cp2.x},${s.cs3.cp2.y} ${s.cs3.to.x},${s.cs3.to.y} ` +
               `C ${s.cs4.cp1.x},${s.cs4.cp1.y} ${s.cs4.cp2.x},${s.cs4.cp2.y} ${s.cs4.to.x},${s.cs4.to.y} Z`;
    }

    public isSameShape(shape1: CurvedMouthShape, shape2: CurvedMouthShape): boolean {
        return (
            isSamePoint(shape1.move, shape2.move) &&

            isSameCubicSegment(shape1.cs1, shape2.cs1) &&
            isSameCubicSegment(shape1.cs2, shape2.cs2) &&
            isSameCubicSegment(shape1.cs3, shape2.cs3) &&
            isSameCubicSegment(shape1.cs4, shape2.cs4)
        );
    }

}