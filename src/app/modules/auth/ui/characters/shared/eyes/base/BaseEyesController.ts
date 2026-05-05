import { EyeRadius, GSAPPosition, MousePosition, Move, Offset } from "../../core/types/types";
import { BlinkController } from "../core/BlinkController";
import { interpolateMove } from "../utils/eyeMouvment.utils";
import { OffsetState } from "../core/OffsetState";
import { MirrorElementsGroup } from "../../core/types/MirrorElemetns";

export type WithPupilEyesConfig = {
    eyePairOffsetXMaxDistance: number ;
    eyePairOffsetYMaxDistance: number ;
    eyeRadius: {
        rx: number ;
        ry: number ;
    },
    pupilMaxDistance: number ;
    eyePairAnchorOffset: Offset ;
} ;

export type WithouPupilEyesConfig = {
    eyePairOffsetXMaxDistance: number ;
    eyePairOffsetYMaxDistance: number ;
    eyeRadius: {
        rx: number ;
        ry: number ;
    },
    faceAnchorOffset: Offset ;
    initialFaceMove: Move ;

} ;

export type BaseEyeConfig = WithouPupilEyesConfig | WithPupilEyesConfig ;



export abstract class BaseEyesController {
    private faceGroup: MirrorElementsGroup;
    protected scleraElements: NodeListOf<SVGElement> ;

    public blinkController: BlinkController ;

    protected eyeShape:EyeRadius ;

    protected isEyesBlocked: boolean = false ;
    


    // base eyes controler 
    // take care of :
    /**
     * - holding faceElement reference
     * - holding eyeShape state, blinkController , eye config and isEyesBlocked state
     * -> shared logic between all eyesControllers
     */
    constructor(
        faceGroup: MirrorElementsGroup,  // Accept single or array
        eyeRadius: EyeRadius
    ) {

        this.faceGroup = faceGroup ;
 
        this.scleraElements = this.faceGroup.original.querySelectorAll('.sclera') as NodeListOf<SVGElement>
        this.eyeShape = structuredClone(eyeRadius) ;
        this.blinkController = new BlinkController(eyeRadius.rx,eyeRadius.ry , this.faceGroup.original)  ;
    }



    abstract lookAt(mouseX:number , mouseY:number , isUpsideDown:boolean) : void ;
    abstract applyPose(): void



    public blockEyesMovment(){this.isEyesBlocked = true ;}
    

    // ToDo: instead of snap directly to mousse (using lookAt) add this :
    // ToDo 1. unblock the movement
    // ToDo 2. calcualte the move from current position to mouse position
    // ToDo 3 . animate the move using addGazeComponentTween
    public unblockEyesMovement(currentMousePos?: MousePosition){
        this.isEyesBlocked = false ;
        if (currentMousePos) {
            this.lookAt(currentMousePos.x, currentMousePos.y, false);
        }
    }



    public turnEyesSad(){
        this.blockEyesMovment();
        this.applyToAllFaceElements((element) => {
            element.classList.remove("nervous");
            element.classList.add("sad");
        });
    }

    public turnEyesNervous(){
        this.blockEyesMovment()
        this.applyToAllFaceElements((element) => {
            element.classList.remove("sad");
            element.classList.add("nervous");
        });
    }

    public resetEyesEmotion(): void {
        this.applyToAllFaceElements((element) => {
            element.classList.remove("sad");
            element.classList.remove("nervous");
        });
    }

    reset(mousePos: MousePosition): void {  
        this.resetEyesEmotion();
        this.unblockEyesMovement(mousePos);
    }


    
    protected addGazeComponentTween(
        gazeComponent:OffsetState, 
        targetMove: Move, 
        duration: number,
        tl: GSAPTimeline, 
        position: GSAPPosition = ">"
    ): void {
        // store current move as snapshot before animating, so we can revert to it later if needed

        // we use a function instead of a tween , soo the tween will run using the latest value of currentMove (after its being changed at runtime by early tweens in the timeLine)

        let startMove: Move;
        const progress = { t: 0 };
        tl.to(progress, {
            t: 1,
            ease:"power2.inOut",
            duration: duration,
            onStart: () => {
                startMove = gazeComponent.getCurrentMove();
            },
            onUpdate: () => {
                const newMove = interpolateMove(startMove ? startMove : gazeComponent.getCurrentMove(), targetMove, progress.t);
                gazeComponent.move(newMove.moveX, newMove.moveY);
                this.applyPose();
            }
        }, position)
    }

    
    
    /**
     * The Lego-Builder method for Eye Shape
     * @param position - Controls when this tween starts relative to the timeline
     */
    public addShapeTween(
        tl: GSAPTimeline, 
        position: GSAPPosition = ">" ,// Default to "after previous"
        targetShape: EyeRadius, // Default to the config shape
        duration: number = 0.3,
      
    ) {  
        const proxy = { rx: this.eyeShape.rx, ry: this.eyeShape.ry };
        tl.to(proxy, {
            rx: targetShape.rx,
            ry: targetShape.ry,
            ease: "power2.inOut",
            duration: duration,
            onUpdate: () => {
                this.blinkController.setShape(proxy.rx, proxy.ry);
                this.eyeShape.rx = proxy.rx;
                this.eyeShape.ry = proxy.ry;
                this.applyPose();
            }
        }, position); 
    }



    protected getOriginalFaceElement(): SVGGElement {
        return this.faceGroup.original;
    }


    protected applyToAllFaceElements(callback: (element: SVGGElement) => void): void {
        callback(this.faceGroup.original);
        this.faceGroup.mirrors.forEach(callback);
    }
    
}