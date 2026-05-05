import gsap from "gsap";
import { BaseBodyController } from "../../../shared/body/BaseBodyController";
import { GSAPPosition, TransformData } from "../../../shared/core/types/types";
import { P_ANXIOUS_SHAPE, P_LEAN_RIGHT_SHAPE, P_LOOK_DOWN_SHAPE, P_SAD_SHAPE, P_SQUARE_SHAPE, P_SQUARE_SHAPE_ROTATED__45, P_SQUARE_SHAPE_ROTATED_PI_36, P_STRAIGHT_SHAPE } from "./core/body.shapes";
import { PurpleBodyShape, PurpleBodyShapeState } from "./core/PurpleBodyShapeState";
import { applyToAllElements, MirrorElementsGroup, normalizeToMirrorElementsGroup } from "../../../shared/core/types/MirrorElemetns";


const ANCHOR_BODY_POSISTION: TransformData = {
    rotation: 0,
    offset: { offsetX: 0, offsetY: 0}
};

export class PurpleBodyController extends BaseBodyController<PurpleBodyShape> {

    constructor(
        shape: SVGPathElement,
        bodyContainerGroup: SVGGElement,
        faceSocketGroup: SVGGElement
    ) {
        const shapeState = new PurpleBodyShapeState(P_SQUARE_SHAPE_ROTATED__45);

        const normolizedBodyGoup : MirrorElementsGroup= normalizeToMirrorElementsGroup(bodyContainerGroup);
        const normolizedFaceContainerGroup : MirrorElementsGroup = normalizeToMirrorElementsGroup(faceSocketGroup);

        super(
            shape,
            normolizedBodyGoup,
            normolizedFaceContainerGroup,
            shapeState,
            ANCHOR_BODY_POSISTION,
            PurpleBodyShapeState.interpolateToTargets
        )
    }

    public leanRight(tl:GSAPTimeline , position: GSAPPosition = ">") {
        this.tweenStates(P_LEAN_RIGHT_SHAPE, tl, position)
    }
    


    public playEntrance(tl: GSAPTimeline , position: GSAPPosition = ">") {
        const firstMorphe = this.morpheFlow({
            shapes: [P_SQUARE_SHAPE_ROTATED__45, P_SQUARE_SHAPE_ROTATED_PI_36],
            morphOptions: { duration: .5, ease: "power2.in" },
        });

        const secondMorphe = this.morpheFlow({
            shapes: [P_SQUARE_SHAPE_ROTATED_PI_36, P_SQUARE_SHAPE],
            morphOptions: { duration: .5, ease: "back.out(1.7)" },
        });

        const thirdMorphe = this.morpheFlow({
            shapes: [P_SQUARE_SHAPE, P_STRAIGHT_SHAPE],
            morphOptions: { duration: .6, ease: "back.out(1.7)" },
        });


        const entranceGroup = gsap.timeline();
        // 1/ set the opacity of the faceSocket to 0 at the start of the entrance animation
        applyToAllElements(this.faceContainerGroup, (elem) => gsap.set(elem, { autoAlpha: 0 })) ;

        entranceGroup.add(firstMorphe);
        entranceGroup.add(secondMorphe);

        // Add a label (bookMark) called "startFinal" at this exact point in the timeline
        entranceGroup.add("startFinal");

        // Tell this tween to start at the "startFinal" label
        applyToAllElements(this.faceContainerGroup ,container => {
            entranceGroup.to(container, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, "startFinal");
        });
        entranceGroup.add(thirdMorphe, "startFinal"); // Use the same label to synchronize it with the fade-in


        tl.add(entranceGroup , position);
    }

    //---------------------  Look down animation ---------------------

    /**
     * Action 1: The Descent
     * Moves the character from current shape to LookDown shape.
     */
    public addLookDownTween(
        tl: GSAPTimeline,
        duration: number = 0.4,
        position: GSAPPosition = ">"
    ) {
        const initialShape = this.bodyShapeState.getCurrent();
        
        const morphDown = this.morpheFlow({
            shapes: [initialShape, P_LOOK_DOWN_SHAPE],
            morphOptions: { duration: duration, ease: "power2.out" },
        });

        tl.add(morphDown, position);
    }

    /**
     * action 2: The Ascent
     * move the character from LookDown shape back to the initial shape before the look down
     */
    public addReturnFromLookDownTween(
        tl: GSAPTimeline,
        duration: number = 0.4,
        position: GSAPPosition = ">"
    ) {
        // We morph from LookDown back to the Straight/Initial shape
        const morphUp = this.morpheFlow({
            shapes: [P_LOOK_DOWN_SHAPE, P_LEAN_RIGHT_SHAPE],
            morphOptions: { duration: duration, ease: "power2.inOut" },
        });

        tl.add(morphUp, position);
    }









    
    
    public addSadBodyTween(tl: GSAPTimeline, position: GSAPPosition, duration: number = 0.3) {
        const currentShape = this.bodyShapeState.getCurrent();
        const morpheShape = this.morpheFlow({
            shapes: [currentShape, P_SAD_SHAPE],
            morphOptions: { duration: duration, ease: "cubic-bezier(0.4, 0, 0.2, 1)" },
        });

        tl.add(morpheShape, position);
        this.performNoGesture(tl, ">"); // The wiggle follows the morph
    }


    
        // anxious 
    public addAnxiousBodyTween(tl:GSAPTimeline , position: GSAPPosition = ">", duration: number = 0.3) {
        this.tweenStates(P_ANXIOUS_SHAPE, tl, position,duration)
    }
    

    private performNoGesture(tl: gsap.core.Timeline , position: GSAPPosition = ">") {
        const rx = 20; const ry = 40; const maxAngle = Math.PI / 7;
        const state = { theta: 0 };
        const onUpdate = () => {
            this.faceAnimOffset.offsetX = rx * Math.sin(state.theta);
            this.faceAnimOffset.offsetY = ry * Math.cos(state.theta) - ry;
            this.applyPose();
        };

        // Faster total duration (~0.6s total for the swings)
        // Chain the wiggles into a sub-timeline
        const wiggle = gsap.timeline({onUpdate })
            .to(state, { theta: -maxAngle * 0.5, duration: 0.08, ease: "sine.out" })
            .to(state, { theta: maxAngle, duration: 0.12, ease: "sine.inOut" })
            .to(state, { theta: -maxAngle, duration: 0.12, ease: "sine.inOut" })
            .to(state, { theta: maxAngle * 0.3, duration: 0.1, ease: "sine.inOut" })
            .to(state, { theta: 0, duration: 0.5, ease: "elastic.out(1.5, 0.3)" });

        tl.add(wiggle, position);
    }


     public reset(tl:GSAPTimeline , position: GSAPPosition = ">") {
        const resetMorpheFlow = this.morpheFlow({
            shapes: [this.bodyShapeState.getCurrent(), P_STRAIGHT_SHAPE],
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