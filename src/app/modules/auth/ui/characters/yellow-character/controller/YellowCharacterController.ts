import { BaseCharacterController } from "../../shared/controller/BaseCharacterController";
import { CharactersState, MousePositionProvider } from "../../shared/core/types/types";
import { MirrorElementsGroup } from "../../shared/core/types/MirrorElemetns";
import { WithouPupilEyesConfig } from "../../shared/eyes/base/BaseEyesController";
import { WithOutPupilEyesController } from "../../shared/eyes/variants/WithOutPupilEyesController";
import { YellowBodyController } from "./body/YellowBodyController";
import { LinearMouthController } from "./mouth/LinearMouthController";


const YELLOW_EYE_CONFIG: WithouPupilEyesConfig = {
    eyePairOffsetXMaxDistance: 50,
    eyePairOffsetYMaxDistance: 20,
    // Pupil distance is 0 because the black eye is the only layer
    eyeRadius: {
        rx: 4,
        ry: 4
    },
    // Starting positions within the face group
    faceAnchorOffset:{
        offsetX: 60,
        offsetY: 80
    },
    initialFaceMove: {
        moveX: -35,
        moveY: 0
    }
}

export class YellowCharacterController extends BaseCharacterController {
    private eyesController: WithOutPupilEyesController;
    private bodyController: YellowBodyController;
    private linearMouthController: LinearMouthController;

    constructor(
        mousePosProvider: MousePositionProvider,
        bodyShape: SVGPathElement,
        bodyContainerGroup: MirrorElementsGroup,
        faceContainerGroup: MirrorElementsGroup,
        faceGroup: MirrorElementsGroup,
        bodyClipPath: SVGPathElement,
        mouthGroup: SVGGElement
    ) {
        super(mousePosProvider);
        const eyeConfig: WithouPupilEyesConfig = structuredClone(YELLOW_EYE_CONFIG);

        this.eyesController = new WithOutPupilEyesController(faceGroup, eyeConfig);

        this.bodyController = new YellowBodyController(
            bodyShape,
            bodyContainerGroup,
            faceContainerGroup,
            bodyClipPath
        );

        this.linearMouthController = new LinearMouthController(mouthGroup);

        this.eyesController.blinkController.startBlinking()
    }

    override lookAt(mouseX: number, mouseY: number): void {
        this.eyesController.lookAt(mouseX, mouseY);
    }


    
    public playEntrance(onComplete: () => void): GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

        // 1- block the eyes 
        tl.add(()=>{
            this.eyesController.blockEyesMovment();
        })

        // 2- hold a little bit before the entrance
        tl.to({}, { duration: .6 }); 

        
        tl.addLabel("startEntrance");
        this.eyesController.addEyeMoveTween({ moveX: 35, moveY: 0 }, .5, tl, "startEntrance") ;
        this.bodyController.playEntrance(tl, "startEntrance",.5) ;

        tl.add(()=>{
            this.eyesController.unblockEyesMovement(this.getMousePos());
        }, '>') ;
        return tl;
    }
   


    override reset(onComplete: () => void): gsap.core.Timeline {
        const tl = this.createPreparedTimeline(onComplete);
        return tl;
    }


    override playAttentive(onComplete: () => void) : GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

        this.bodyController.leanRight(tl,"<") ;
        this.linearMouthController.setNormal(.2,tl,"<") ;
        tl.add(() => {
            this.eyesController.blockEyesMovment();
        }, "<") ;

        return tl ;
    }

    public playEngaged(onComplete: () => void) : GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

        
        tl.addLabel("action"); // Bookmark the start
        this.bodyController.addLookEngagedTween(tl, .4, "action");
       

        
        // --- PHASE 2: THE RECOVERY ---
        tl.addLabel("recovery"); // Bookmark the recovery point
        
        this.bodyController.addReturnFromEngagedTween(tl, .8, "recovery");

        return tl;
    }

    
    
    // mark character sad
    public playSad(onComplete: () => void): GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

        tl.addLabel("startSad");

        // we wrap this instant callback into the timeline soo they dont fire early
        tl.add(() => {
            this.eyesController.turnEyesSad();
        }, "startSad");
        this.eyesController.addEyeMoveTween({ moveX: 40, moveY: 30 }, .2, tl, "startSad");

        this.bodyController.addStraightBodyTween(tl, "startSad");
        this.linearMouthController.setSad(.2, tl, "startSad");

        return tl;
    }



    override playAnxious(onComplete: () => void): gsap.core.Timeline { 
        const tl = this.createPreparedTimeline(onComplete);

        tl.addLabel("startAnxious");

        tl.add(() => {
            this.eyesController.turnEyesNervous();
        }, "startAnxious");
    
        this.eyesController.addEyeMoveTween({ moveX: -35, moveY: 5 }, .2, tl, "startAnxious");
        this.bodyController.addStraightBodyTween(tl, "startAnxious");

        return tl;
    }
    

    // todo: if prevMode is anxious ,and we go to sad : dont reset the eye movment !!!
    override prepareForTransition(tl: gsap.core.Timeline): void {
        const previous = this.previousState;

        // 1. Generic cleanup that applies to almost every non-idle state
        const needsGenericCleanup = [CharactersState.Sad, CharactersState.Anxious].includes(previous);

        if (needsGenericCleanup && this.shouldUnblockEyes(previous, this.currentState)) {
            tl.add(() => {
                this.eyesController.resetEyesEmotion();
                this.eyesController.unblockEyesMovement(this.getMousePos());
            }, 0); // Force at the very start
        }
        
    }


    private shouldUnblockEyes(prevMood: CharactersState, newMood: CharactersState): boolean {
        // if from sad to anxious or from anxious to sad : dont unblock the eyes
        if ((prevMood === CharactersState.Sad && newMood === CharactersState.Anxious) ||
            (prevMood === CharactersState.Anxious && newMood === CharactersState.Sad)) {
            return false;
        }
        return true;
    }
}