import { GSAPPosition, TransformData } from "../../../shared/core/types/types";
import { MirrorElementsGroup, normalizeToMirrorElementsGroup } from "../../../shared/core/types/MirrorElemetns";
import {
  B_BEFORE_FALL_SHAPE,
  B_BEFORE_FALL_SHAPE2,
  B_FALLING_SHAPE,
  B_LEAN_RIGHT_SHAPE,
  B_LOOKING_ANXIOUS_SHAPE,
  B_LOOKING_BEHIND_SHAPE,
  B_SAD_SHAPE,
  B_SQUASH_SHAPE,
  B_STRAIGHT_SHAPE
} from "./core/Body.shapes";

import { BaseBodyController } from "../../../shared/body/BaseBodyController";
import { BlackBodyShape, BlackBodyShapeState } from "./core/BlackBodyShapeState";
import gsap from "gsap";

const ANCHOR_BODY_POSISTION: TransformData = {
    rotation: 0,
    offset: { offsetX: 0, offsetY: 0 }
};

export const CEILING_BODY_POSISTION: TransformData = {
    rotation: -180,
    offset: { offsetX: 80, offsetY: -180 } // Original floor position
};

export class BlackBodyController extends BaseBodyController<BlackBodyShape>{
    
    constructor(
        shape: SVGPathElement,
        bodyContainerGroup: SVGGElement,
        faceSocketGroup: SVGGElement
    ) {
        const shapeState = new BlackBodyShapeState(B_BEFORE_FALL_SHAPE);


        const normolizedBodyGoup : MirrorElementsGroup= normalizeToMirrorElementsGroup(bodyContainerGroup);
        const normolizedFaceContainerGroup : MirrorElementsGroup = normalizeToMirrorElementsGroup(faceSocketGroup);
        super(
            shape,
            normolizedBodyGoup,
            normolizedFaceContainerGroup,
            shapeState,
            CEILING_BODY_POSISTION,
            BlackBodyShapeState.interpolateToTargets
        )
    }


    public isUpsideDown(): boolean {
        const rotation = this.bodyTransform.getCurrentTransform().rotation;
        const normalizedRotation = Math.abs(rotation % 360);
        return normalizedRotation > 90 && normalizedRotation < 270;
    }



    // lean right 
    public leanRight(tl:GSAPTimeline , position: GSAPPosition = ">") {
        this.tweenStates(B_LEAN_RIGHT_SHAPE, tl, position)
    }
        

    //----------------------------------------------------------- look behind -----------------------------------
    /**
     * Action 1: The Turn Behind
     * Morphs the body from current state to the 'Look Behind' shape.
     */
    public addLookBehindTween(
        tl: GSAPTimeline,
        duration: number,
        position: GSAPPosition = ">"
    ) {
        const initialShape = this.bodyShapeState.getCurrent();

        const morph = this.morpheFlow({
            shapes: [initialShape, B_LOOKING_BEHIND_SHAPE],
            morphOptions: {
                duration: duration,
                ease: "power1.out",
            },
        });

        tl.add(morph, position);
    }

    /**
     * Action 2: The Return
     * Returns the body back to its initial anchor shape.
     */
    public addReturnFromLookBehindTween(
        tl: GSAPTimeline,
        duration: number,
        position: GSAPPosition = ">"
    ) {
        // We morph from LookBehind back to our default state
        const morph = this.morpheFlow({
            shapes: [B_LOOKING_BEHIND_SHAPE, B_LEAN_RIGHT_SHAPE], // Or current anchor
            morphOptions: {
                duration: duration,
                ease: "power1.in",
            }
        });

        tl.add(morph, position);
    }

    
    
    public addSadBodyTween(tl:GSAPTimeline , position: GSAPPosition = ">") {
        this.tweenStates(B_SAD_SHAPE, tl, position)
    }
    

    // anxious 
    public addAnxiousBodyTween(tl:GSAPTimeline , position: GSAPPosition = ">") {
        this.tweenStates(B_LOOKING_ANXIOUS_SHAPE, tl, position)
    }



    public playEntrance(tl: GSAPTimeline , position: GSAPPosition = ">", onImpact?: () => void) {
        // From Ceiling to Floor
        const bodyPosition = CEILING_BODY_POSISTION;
        const endBodyPosistion = ANCHOR_BODY_POSISTION;


         // before_fall -> before_fall2 -> straight 
        const firstMorphe = this.morpheFlow({
            shapes: [B_BEFORE_FALL_SHAPE, B_BEFORE_FALL_SHAPE2 , B_STRAIGHT_SHAPE],
            morphOptions: { duration: .2, ease: "none" },
        });

        // straight -> falling -> straight -> straight -> falling
        // with body pose tween from ceiling to floor
        const secondMorphe = this.morpheFlow({
            shapes: [  B_STRAIGHT_SHAPE, B_FALLING_SHAPE, B_STRAIGHT_SHAPE, B_STRAIGHT_SHAPE, B_FALLING_SHAPE ],
            bodyPoseTweenOptions: {
                currentBodyPosition: bodyPosition,
                nextBodyPosition: endBodyPosistion
            },
            morphOptions: { duration: .5, ease: "power1.in" },
        });

         // falling -> squash
        const thirdMorphe = this.morpheFlow({
            shapes: [B_FALLING_SHAPE,B_SQUASH_SHAPE,],
            morphOptions: { duration: .65, ease: "elastic.out(1.2, 0.7)" },
        });

        const fourthMorphe = this.morpheFlow({
            shapes: [B_SQUASH_SHAPE, B_STRAIGHT_SHAPE],
            morphOptions: { duration: .2, ease: "none" },
        });


        const entranceGroup = gsap.timeline();

        entranceGroup.add(firstMorphe);
        entranceGroup.add(secondMorphe);
        entranceGroup.add(thirdMorphe);
         // after the chacater hit the ground it call the onImpact
        entranceGroup.add(()=>{
            if(onImpact) onImpact();
        }, '<')
    
       
        entranceGroup.add(fourthMorphe);
       



        tl.add(entranceGroup , position);
    }



    public reset(tl:GSAPTimeline , position: GSAPPosition = ">") {
        const resetMorpheFlow = this.morpheFlow({
            shapes: [this.bodyShapeState.getCurrent(), B_STRAIGHT_SHAPE],
            bodyPoseTweenOptions: {
                currentBodyPosition: this.bodyTransform.getCurrentTransform(),
                nextBodyPosition: ANCHOR_BODY_POSISTION
            },
            morphOptions: {
                duration: 0.2,
                ease: "cubic-bezier(0.4, 0, 0.2, 1)",
            }
        })
        tl.add(resetMorpheFlow , position);
    }
}