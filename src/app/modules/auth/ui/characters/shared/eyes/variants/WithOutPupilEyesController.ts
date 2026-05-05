
import { OffsetState } from "../core/OffsetState";
import { amplification } from "../utils/eyeMouvment.utils";
import { GSAPPosition, Move } from "../../core/types/types";
import { MirrorElementsGroup , normalizeToMirrorElementsGroup } from "../../core/types/MirrorElemetns";
import { BaseEyesController, WithouPupilEyesConfig } from "../base/BaseEyesController";






export class WithOutPupilEyesController extends BaseEyesController {

    private eyePairState: OffsetState;
    private config: WithouPupilEyesConfig ;

    constructor(
        faceElement: SVGGElement | MirrorElementsGroup,
        config: WithouPupilEyesConfig
    ) {

        const normalizedFaceGroup = normalizeToMirrorElementsGroup(faceElement);
        super(normalizedFaceGroup, config.eyeRadius) ;

        this.config = config ;

        const {faceAnchorOffset , initialFaceMove} = config ;


        this.eyePairState = new OffsetState(faceAnchorOffset , initialFaceMove);
        this.applyPose(); 
    }



    public lookAt(mouseX:number , mouseY:number){
        if (this.isEyesBlocked) return;

        const rect = this.getOriginalFaceElement().getBoundingClientRect();
       
        const rectCenterX = rect.x + rect.width / 2;
        const rectCenterY = rect.y + rect.height / 2;

        const dx = mouseX - rectCenterX;
        const dy = mouseY - rectCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 0.001) return


       
        const eyePairMoveXAmp = amplification(distance, this.config.eyePairOffsetXMaxDistance, 0.008);
        const eyePairMoveYAmp = amplification(distance, this.config.eyePairOffsetYMaxDistance, 0.008);
        
        const eyePairMoveX = (dx / distance) * eyePairMoveXAmp;
        const eyePairMoveY = (dy / distance) * eyePairMoveYAmp ;

        this.eyePairState.move(eyePairMoveX,eyePairMoveY)



        this.applyPose();
    }


    

    launch(): void {
        this.resetEyesEmotion();
        this.unblockEyesMovement();
        this.blinkController.startBlinking();
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


    





    public applyPose(): void {
        // apply eye pair movement to all face elements 
        // face elements are just the original and its mirrors (if exist) so we can apply the same transform to all of them without worrying about individuals syncing
        this.applyToAllFaceElements((element) => {
            element.setAttribute(
                "transform",
                `translate(${this.eyePairState.getCurrentOffsetXString()}, ${this.eyePairState.getCurrentOffsetYString()})`
            );
        });

        //apply eye shape
        this.scleraElements.forEach(sclera => {
            sclera.setAttribute('rx', this.eyeShape.rx.toString());
            sclera.setAttribute('ry', this.eyeShape.ry.toString());
        });
    }

}