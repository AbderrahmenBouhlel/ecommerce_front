import gsap from "gsap";
import { GSAPPosition, Offset, TransformData } from "../core/types/types";
import { TransformState } from "./core/TransformState";
import { BaseBodyShapeState } from "./core/BaseBodyShapeState";
import { interpolateTransform } from "../core/math/interpolation";
import { applyToAllElements, MirrorElementsGroup } from "../core/types/MirrorElemetns";

export interface BodyPositionTweenOptions {
    currentBodyPosition: TransformData;
    nextBodyPosition: TransformData;
}

export type MorphOptions = {
    duration?: number;
    ease?: string;
    onComplete?: () => void;
    onStart?: () => void;
}

export type MorphFlowConfig<T> =  {
    shapes: T[];
    morphOptions: MorphOptions;
    bodyPoseTweenOptions?: BodyPositionTweenOptions;
}

export abstract class BaseBodyController<T> {

    protected shapeElement: SVGPathElement;

    protected bodyGroup: MirrorElementsGroup;
    protected faceContainerGroup: MirrorElementsGroup;

    protected bodyShapeState: BaseBodyShapeState<T>;
    
    protected bodyTransform: TransformState;
    protected faceSocketTransform: TransformState;

    protected faceAnimOffset: Offset = { offsetX: 0, offsetY: 0 };

    private interpolateFn: (targets: T[], progress: number) => T;


    constructor(
        shapeElement: SVGPathElement,
        bodyGroup: MirrorElementsGroup,
        faceContainerGroup: MirrorElementsGroup,
        bodyShapeState: BaseBodyShapeState<T>,
        initialBodyTransform: TransformData,
        interpolateFn: (targets: T[], progress: number) => T
    ){
        this.shapeElement = shapeElement;
        this.bodyGroup = bodyGroup;
        this.faceContainerGroup = faceContainerGroup;
        this.bodyShapeState = bodyShapeState;
        this.bodyTransform = new TransformState(initialBodyTransform);
        this.faceSocketTransform = new TransformState(bodyShapeState.getCurrentFaceSocketPosition());
    
        this.interpolateFn = interpolateFn;
    }




    /**
     * Creates a MorpheFlow operation.
     *
     * A MorpheFlow represents a single morph animation between multiple body shapes.
     * Optionally, it can also animate the body's transform (translation, rotation, etc.)
     * if `bodyPoseTweenOptions` is provided. This allows shapes and body movement
     * to be animated together or shapes alone.
    */
    protected morpheFlow(config: MorphFlowConfig<T>): gsap.core.Tween {
        const { shapes, bodyPoseTweenOptions, morphOptions } = config;

        const progress = { t: 0 };

        const onUpdateWithoutBodyPoseTween = () => {
            const t = progress.t;
            const nextShape = this.interpolateFn(shapes, t);
            this.apply(nextShape);
        }
        const onUpdateWithBodyPoseTween = () => {
            const t = progress.t;
            const nextShape = this.interpolateFn(shapes, t);
            const nextBodyPose = interpolateTransform(
                bodyPoseTweenOptions!.currentBodyPosition,
                bodyPoseTweenOptions!.nextBodyPosition,
                t
            );
            this.apply(nextShape, nextBodyPose);
        }

        return gsap.to(progress, {
            t: 1,
            duration: morphOptions.duration ?? 0.5,
            ease: morphOptions.ease ?? "power1.inOut",
            onComplete: morphOptions.onComplete,
            onStart: morphOptions.onStart,
            onUpdate: bodyPoseTweenOptions ? onUpdateWithBodyPoseTween : onUpdateWithoutBodyPoseTween
        });
    }

    protected tweenStates(
        nextShape: T,
        tl: GSAPTimeline,
        position: GSAPPosition = ">",
        duration: number = .2,
        ease: string = "cubic-bezier(0.4, 0, 0.2, 1)",
       
    ){
        const currentShape = this.bodyShapeState.getCurrent();
        // simple tween without body position tween just shape tween
        const morphFlow = this.morpheFlow({
            shapes: [currentShape, nextShape],
            morphOptions: {
                duration: duration,
                ease: ease,
            }
        })

        tl.add(morphFlow, position) ;
    }
        
    

    protected applyPose(): void {
        const bodyPose = this.bodyTransform.getCurrentTransform();
        
        applyToAllElements(this.bodyGroup, (element) => {
            element.setAttribute("transform", `translate(${bodyPose.offset.offsetX}, ${bodyPose.offset.offsetY}) rotate(${bodyPose.rotation})`);
        });

        const faceSocketPose = this.faceSocketTransform.getCurrentTransform();
        
        // Add the temporary animation offset to the calculated pose
        const finalX = faceSocketPose.offset.offsetX + this.faceAnimOffset.offsetX;
        const finalY = faceSocketPose.offset.offsetY + this.faceAnimOffset.offsetY;

        applyToAllElements(this.faceContainerGroup, (element) => {
            element.setAttribute("transform", `translate(${finalX}, ${finalY}) rotate(${faceSocketPose.rotation})`);
        });

        this.shapeElement.setAttribute("d", this.bodyShapeState.toPathString());
    }


    protected apply(newShape:T , newBodyPose?: TransformData):void {
        this.bodyShapeState.setCurrent(newShape);
        if (newBodyPose) {
            this.bodyTransform.setTransform(newBodyPose);
        }
        this.faceSocketTransform.setTransform(this.bodyShapeState.getCurrentFaceSocketPosition());
        this.applyPose();
    }
    

}