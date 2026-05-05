import { BaseBodyController } from "../../../shared/body/BaseBodyController";
import {GSAPPosition, TransformData } from "../../../shared/core/types/types";
import { Y_ENGAGED_SHAPE, Y_LEAN_RIGHT_SHAPE, Y_SAD_SHAPE, Y_START_SHAPE, Y_STRAIGHT_SHAPE } from "./core/body.shapes";
import { YellowBodyShape, YellowBodyShapeState } from "./core/YellowBodyShapeState";
import { MirrorElementsGroup, normalizeToMirrorElementsGroup } from "../../../shared/core/types/MirrorElemetns";




const ANCHOR_BODY_POSISTION: TransformData = {
    rotation: 0,
    offset: { offsetX: 0, offsetY: 0}
};

    
export class YellowBodyController extends BaseBodyController<YellowBodyShape> {

    private clipPath: SVGPathElement;     


    constructor(
        shape: SVGPathElement,
        bodyContainerGroup: SVGGElement | MirrorElementsGroup,
        faceContainerGroup: SVGGElement|MirrorElementsGroup,
        clipPath: SVGPathElement
    ){
       
        const shapeState = new YellowBodyShapeState(Y_START_SHAPE);

        const normolizedBodyGoup: MirrorElementsGroup = normalizeToMirrorElementsGroup(bodyContainerGroup);
        const normolizedFaceContainerGroup: MirrorElementsGroup = normalizeToMirrorElementsGroup(faceContainerGroup);

        super(
            shape,
            normolizedBodyGoup,
            normolizedFaceContainerGroup,
            shapeState,
            ANCHOR_BODY_POSISTION,
            YellowBodyShapeState.interpolateToTargets
        )

        this.clipPath = clipPath;
        

        this.applyPose();
    }


    public leanRight(tl:GSAPTimeline , position: GSAPPosition = ">") {
        this.tweenStates(Y_LEAN_RIGHT_SHAPE, tl, position)
    }

    public addLookEngagedTween(
        tl: GSAPTimeline,
        duration: number = 0.4,
        position: GSAPPosition = ">"
    ) {
        this.tweenStates(Y_ENGAGED_SHAPE, tl , position, duration, "back.out(1.7)");
    }


    public addReturnFromEngagedTween(
        tl: GSAPTimeline,
        duration: number = 0.4,
        position: GSAPPosition = ">"
    ) {
        
        const morph = this.morpheFlow({
            shapes: [Y_ENGAGED_SHAPE, Y_LEAN_RIGHT_SHAPE],
            morphOptions: { 
                duration: duration, 
                ease: "power3.out" ,
            },
        });

        tl.add(morph, position);
    }


    public playEntrance(tl: GSAPTimeline , position: GSAPPosition = ">" , duration: number = 1) {
        const firstMorphe = this.morpheFlow({
            shapes: [Y_START_SHAPE, Y_STRAIGHT_SHAPE],
            morphOptions: { duration: duration, ease: "back.out(1.7)" },
        });


        tl.add(firstMorphe , position);
    }



    // sad , anxious
    public addStraightBodyTween(tl: GSAPTimeline, position: GSAPPosition, duration: number = 0.3) {
        this.tweenStates(Y_STRAIGHT_SHAPE, tl, position, duration, "cubic-bezier(0.4, 0, 0.2, 1)");
    }


    protected override applyPose(): void {
        super.applyPose();
        this.clipPath.setAttribute('d', this.bodyShapeState.toPathString())
    }
}