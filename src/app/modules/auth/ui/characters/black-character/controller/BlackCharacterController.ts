import { BlackBodyController } from "./body/BlackBodyController";
import { WithPupilEyesController } from "../../shared/eyes/variants/WithPupilEyesController";

import {CharactersState, MousePosition, MousePositionProvider, Move } from "../../shared/core/types/types";
import { BaseCharacterController } from "../../shared/controller/BaseCharacterController";
import { WithPupilEyesConfig } from "../../shared/eyes/base/BaseEyesController";




const LOOk_BEHIND_PUPILS_MOVE: Move = {
    moveX: -1, 
    moveY: -4 
}


const LOOK_BEHIND_ANIMATION = {
    actionDur: 0.3, 
    holdDur: 0.2,
    recoveryDur: 0.5, 
};


const BLACK_CHARACTER_EYE_CONFIG: WithPupilEyesConfig = {
    eyePairOffsetXMaxDistance: 15,
    eyePairOffsetYMaxDistance: 15,
    pupilMaxDistance: 4,
    eyeRadius: {
        rx: 8,
        ry: 8
    },
    eyePairAnchorOffset: {
        offsetX: 40,
        offsetY: 25
    }
}


export class BlackCharacterController extends BaseCharacterController {
    

    private bodyController:BlackBodyController ;
    private eyesController: WithPupilEyesController ;


    constructor(
        mousePosProvider: MousePositionProvider,
        shape: SVGPathElement, 
        bodyAnchor:SVGGElement,
        eyePairContainer:SVGGElement,
        eyePair: SVGGElement,
    ) {

        super(mousePosProvider);
        const eyeConfig: WithPupilEyesConfig = structuredClone(BLACK_CHARACTER_EYE_CONFIG) ;
                
        
        this.eyesController = new WithPupilEyesController(eyePair ,eyeConfig)  ;
        this.bodyController = new BlackBodyController(shape,bodyAnchor,eyePairContainer)

        // initially the character eyes are blocked 
        this.eyesController.blockEyesMovment();
    }



    public lookAt(mouseX:number , mouseY:number){
        const isUpsideDown = this.bodyController.isUpsideDown();
        this.eyesController.lookAt(mouseX,mouseY,isUpsideDown)  
    }


    // lean right
    public playAttentive(onComplete: () => void) : GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

        this.bodyController.leanRight(tl,"<") ;
        tl.add(() => {
            this.eyesController.blockEyesMovment();
        }, "<") ;

        return tl ;
    }




    public playEngaged(onComplete: () => void) : GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete) ;
        


        const animConfig = LOOK_BEHIND_ANIMATION;


        tl.addLabel("action"); // Bookmark the start
        

        //-- PHASE 1: THE TURN BEHIND --
        this.eyesController.addPupilMoveTween(LOOk_BEHIND_PUPILS_MOVE, animConfig.actionDur, tl, "action");
        this.bodyController.addLookBehindTween(tl, animConfig.actionDur, "action");
       

        // --- PHASE 2: THE HOLD ---
        // We add the hold duration after the action phase
        tl.to({}, { duration: animConfig.holdDur });

        
        // --- PHASE 3: THE RECOVERY ---
        tl.addLabel("recovery"); // Bookmark the recovery point
        
        this.bodyController.addReturnFromLookBehindTween(tl, animConfig.recoveryDur, "recovery");
        this.eyesController.smoothRevert(animConfig.recoveryDur, tl, "recovery");


        return tl;
    }


    // mark character sad
    public playSad(onComplete: () => void): GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete) ;
        tl.addLabel("startSad");

        // we wrap this instant callback into the timeline soo they dont fire early
        tl.add(() => {
            this.eyesController.resetEyesEmotion()
            this.eyesController.factoryReset();
            this.eyesController.turnEyesSad();
        }, "startSad");

        this.bodyController.addSadBodyTween(tl, "startSad");

        return tl;
    }


    // mark character anxious
    public playAnxious(onComplete: () => void): GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete) ;

        tl.addLabel("startAnxious");
        
        tl.add(() => {
            this.eyesController.factoryReset()
            this.eyesController.resetEyesEmotion()
            this.eyesController.turnEyesNervous();
        }, "startAnxious");


        this.bodyController.addAnxiousBodyTween(tl, "startAnxious");
        
        return tl;
    }

    public playEntrance(onComplete: () => void): GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete) ;

        tl.addLabel("startEntrance");
        this.bodyController.playEntrance(
            tl, 
            "startEntrance", 
            ()=>{
                this.eyesController.unblockEyesMovement(this.getMousePos());
                this.eyesController.blinkController.startBlinking();
            }
        ) ;
        return tl;
    }



    
    public reset(onComplete: () => void): GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

    
        tl.addLabel("startResetting");
         
        tl.add(()=>{
            const latestMousePos = this.getMousePos();
            this.eyesController.reset(latestMousePos) ;
        },"startResetting")
        
        this.bodyController.reset(tl, "startResetting") ;
    
        return tl ;
    }

    override prepareForTransition(tl: GSAPTimeline) {
        const previous = this.previousState;

        // 1. Generic cleanup that applies to almost every non-idle state
        const needsGenericCleanup = [CharactersState.Sad, CharactersState.Anxious].includes(previous);

        if (needsGenericCleanup) {
            tl.add(() => {
                this.eyesController.resetEyesEmotion();
                this.eyesController.unblockEyesMovement(this.getMousePos());
            }, 0); // Force at the very start
        }
    }




}




