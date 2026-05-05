import { OffsetState } from "../core/OffsetState";
import { amplification } from "../utils/eyeMouvment.utils";
import {GSAPPosition, Move } from "../../core/types/types";
import { MirrorElementsGroup , normalizeToMirrorElementsGroup } from "../../core/types/MirrorElemetns";
import { BaseEyesController, WithPupilEyesConfig } from "../base/BaseEyesController";





export class WithPupilEyesController extends BaseEyesController{
 
    private leftPupilElement: SVGCircleElement;
    private rightPupilElement: SVGCircleElement;


    private eyePairState: OffsetState;
    private pupilsState: OffsetState;

    private config: WithPupilEyesConfig ;


    constructor(
        faceElement: SVGGElement | MirrorElementsGroup,
        config: WithPupilEyesConfig
    ) {

        const normalizedFaceGroup = normalizeToMirrorElementsGroup(faceElement);

        super(normalizedFaceGroup, config.eyeRadius) ;

        this.config = config ;
    
        this.leftPupilElement = this.getOriginalFaceElement().querySelector('#leftPupil') as SVGCircleElement;
        this.rightPupilElement = this.getOriginalFaceElement().querySelector('#rightPupil') as SVGCircleElement;


        const {eyePairAnchorOffset} = config ;


        this.eyePairState = new OffsetState(eyePairAnchorOffset);
        this.pupilsState = new OffsetState({ offsetX: 0, offsetY: 0 });

        this.applyPose();
        
    }

    override lookAt(mouseX:number , mouseY:number , isUpsideDown:boolean){
        if (this.isEyesBlocked) return;

        const rect = this.getOriginalFaceElement().getBoundingClientRect();
       
        const rectCenterX = rect.x + rect.width / 2;
        const rectCenterY = rect.y + rect.height / 2;

        const dx = mouseX - rectCenterX;
        const dy = mouseY - rectCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 0.001) return


        const multiplier = isUpsideDown ? -1 : 1;
        

       
        const eyePairMoveXAmp = amplification(distance, this.config.eyePairOffsetXMaxDistance, 0.008);
        const eyePairMoveYAmp = amplification(distance, this.config.eyePairOffsetYMaxDistance, 0.008);
        
        const eyePairMoveX = (dx / distance) * eyePairMoveXAmp * multiplier;
        const eyePairMoveY = (dy / distance) * eyePairMoveYAmp * multiplier;

        this.eyePairState.move(eyePairMoveX,eyePairMoveY)

        // Pupil movement (relative to eye center)
        const pupilAmp = amplification(distance, this.config.pupilMaxDistance, 0.01);  
        const pupilMoveX = (dx / distance) * pupilAmp * multiplier;
        const pupilMoveY = (dy / distance) * pupilAmp *  multiplier;


       
        this.pupilsState.move(pupilMoveX,pupilMoveY)

        this.applyPose();
    }


    public factoryReset(): void {
        this.eyePairState.reset();
        this.pupilsState.reset()
        this.applyPose();
    }
 


    launch(): void {
        this.resetEyesEmotion();
        this.factoryReset();
        this.unblockEyesMovement();
        this.blinkController.startBlinking();
    }



    public smoothRevert(duration: number, tl: GSAPTimeline , position: GSAPPosition = ">"): void {
        this.addGazeComponentTween(
            this.pupilsState,
            this.pupilsState.getPrevMove(),
            duration,
            tl,
            position
        );
    }


    /**
     * Timeline-Lego-Builder for pupil movement
     */
    public addPupilMoveTween(
        targetPupilMove: Move, 
        duration: number,
        tl: GSAPTimeline, 
        position: GSAPPosition = ">"
    ): void {
        this.pupilsState.takeMoveSnapshot();
        this.addGazeComponentTween(
            this.pupilsState,
            targetPupilMove,
            duration,
            tl,
            position
        );
    }

    public addEyeMoveTween(
        targetEyeMove: Move, 
        duration: number,
        tl: GSAPTimeline, 
        position: GSAPPosition = ">"
    ): void {
        this.eyePairState.takeMoveSnapshot();
        this.addGazeComponentTween(
            this.eyePairState,
            targetEyeMove,
            duration,
            tl,
            position
        );
    }




    override applyPose(): void {
        // apply eye pair movement
        this.applyToAllFaceElements((element) => {
            element.setAttribute(
                "transform",
                `translate(${this.eyePairState.getCurrentOffsetXString()}, ${this.eyePairState.getCurrentOffsetYString()})`
            );
        });


        // apply pupils movement
        const currentPupilsCx = this.pupilsState.getCurrentOffsetXString()
        const currentPupilsCy = this.pupilsState.getCurrentOffsetYString()

        this.leftPupilElement.setAttribute('cx',currentPupilsCx);
        this.leftPupilElement.setAttribute('cy',currentPupilsCy);

        this.rightPupilElement.setAttribute('cx',currentPupilsCx);
        this.rightPupilElement.setAttribute('cy',currentPupilsCy);

        // apply eye shape
        this.scleraElements.forEach(sclera => {
            sclera.setAttribute('rx', this.eyeShape.rx.toString());
            sclera.setAttribute('ry', this.eyeShape.ry.toString());
        });
    }

}