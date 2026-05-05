

import { isSamePoint } from "../../../purple-character/controller/mouth/core/CurvedMouth.utils";
import { GSAPPosition } from "../../../shared/core/types/types";
import { BaseMouthController } from "../../../shared/mouth/BaseMouthController";
import { LinearMouthShape, interpolateLinearMouth } from "./core/LinearMouth.utils";
import { NEUTRAL_SHAPE, SAD_SHAPE } from "./core/mouth.shapes";
import gsap from "gsap";


// from currentAgitation -> targetAgitation  pick new random targetAgitation , currentAgitation -> targetAgitation , and so on ...
// make the function build on top of given timeLine (dynmically add to the timeline) and finish after a certain duration  (error duration) or after a certain number of repeats (vibration count) , whatever comes first
// do this animation up to 5s
// the timeLine can be interrupted and killed by other animations (like anxious, attentive) 
export class LinearMouthController extends BaseMouthController<LinearMouthShape> {
   
    // used inside the animation loop
    private static AGITATION_DURATION = Math.PI * 7; 
    private agitationPhase = 0;

    constructor(mouthGroup: SVGGElement) {
        super(mouthGroup, NEUTRAL_SHAPE , interpolateLinearMouth);
        this.applyShape();
    }

    override toPathString(): string {
        const s = this.currentShape;

        const t = this.agitationPhase;
        const duration = LinearMouthController.AGITATION_DURATION;

        const amplitude = this.agitationPhase == 0 ? 0 : Math.max(0, 1 - t / duration); // decrease amplitude over time

        const p1 = amplitude * Math.sin(t) * 2;
        const p2 = amplitude * Math.sin(t + 1.2) * 10;
        const p3 = amplitude * Math.sin(t + 2.4) * 10;
        const p4 = amplitude * Math.sin(t + 3.6) * 2;

        return `M ${s.p1.x},${s.p1.y + p1}
                C ${s.p2.x + p2},${s.p2.y + p2},
                ${s.p3.x + p3},${s.p3.y + p3},
                ${s.p4.x},${s.p4.y + p4}`;
    }



    public setSad(duration: number = 0.5 , tl: GSAPTimeline, position: GSAPPosition = ">" ) {
        this.tweenMouthShape(SAD_SHAPE,.5,tl,position)

        this.playAgitatedAnimation(5, tl, position);
    }
    public setNormal(duration: number = 0.5 , tl: GSAPTimeline, position: GSAPPosition = ">") {
        if (this.isSameShape(this.currentShape, NEUTRAL_SHAPE))  return ;
        this.tweenMouthShape(NEUTRAL_SHAPE, duration, tl, position);
    }


    private playAgitatedAnimation(duration: number = 5 , tl: GSAPTimeline, position: GSAPPosition = ">" ) {   
        tl.to(this, {
            agitationPhase: LinearMouthController.AGITATION_DURATION,
            duration: duration, 
            ease: "none",
            onUpdate: () => {
                this.applyShape();
            },
            onComplete: () => {
                this.agitationPhase = 0;
                this.applyShape();
            }
        }, position);
    }


    protected override applyShape(): void {
        super.applyShape();
        const rotation = this.currentShape.rotation;
        this.mouthShapeElement.style.transform = `rotate(${rotation}deg)`;
    }



    public isSameShape(shape1: LinearMouthShape, shape2: LinearMouthShape): boolean {
        return isSamePoint(shape1.p1, shape2.p1) &&
               isSamePoint(shape1.p2, shape2.p2) &&
               isSamePoint(shape1.p3, shape2.p3) &&
               isSamePoint(shape1.p4, shape2.p4) &&
               shape1.rotation === shape2.rotation;
    }
    
}