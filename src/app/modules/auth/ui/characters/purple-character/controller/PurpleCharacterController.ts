
import { CurvedMouthController } from "./mouth/MouthController";
import { PurpleBodyController } from "./body/PurpleBodyController";
import { CharactersState, EyeRadius, MousePosition, MousePositionProvider, Move } from "../../shared/core/types/types";
import { BaseCharacterController } from "../../shared/controller/BaseCharacterController";
import { WithPupilEyesController } from "../../shared/eyes/variants/WithPupilEyesController";
import { WithPupilEyesConfig } from "../../shared/eyes/base/BaseEyesController";


const LOOk_DOWN_PUPILS_MOVE: Move = {
    moveX: 1, 
    moveY: 2 
}

const LOOK_DOWN_ANIMATION = {
    actionDur: 0.3, 
    holdDur: 0.2,
    recoveryDur: 0.5, 
};

const PURPLE_EYE_CONFIG: WithPupilEyesConfig = {
    eyePairOffsetXMaxDistance: 40,
    eyePairOffsetYMaxDistance: 10,
    pupilMaxDistance: 2,
    eyeRadius: {
        rx: 4,
        ry: 4
    },
    eyePairAnchorOffset:{
        offsetX: 80,
        offsetY: 20
    }
}
const PURPLE_SAD_EYE_RADIUS: EyeRadius = {
    rx: 4,
    ry: 5.5
};




export class PurpleCharacterController extends BaseCharacterController  {
    private eyesController: WithPupilEyesController ;
    private mouthController: CurvedMouthController ; 
    private bodyController: PurpleBodyController;


    constructor(
        mousePosProvider: MousePositionProvider,
        mouth: SVGGElement,
        bodyShape: SVGPathElement,
        bodyContainerGroup: SVGGElement,
        faceContainerGroup: SVGGElement
    ) {
        super(mousePosProvider) ;
        const eyeConfig: WithPupilEyesConfig = structuredClone(PURPLE_EYE_CONFIG) ;
        const faceGroupElement = faceContainerGroup.querySelector('#face') as SVGGElement;
        this.eyesController = new WithPupilEyesController(faceGroupElement ,eyeConfig)  ;
        this.mouthController = new CurvedMouthController(mouth)  ;
        this.bodyController = new PurpleBodyController(
            bodyShape,
            bodyContainerGroup,
            faceContainerGroup
        )
        this.eyesController.blockEyesMovment();
    }



    public lookAt(mouseX:number , mouseY:number){
        this.eyesController.lookAt(mouseX,mouseY,false)  
    }


    // lean right
    // at the start of lean right animation , the eyes will be blocked from any movment for a btter visual effect (the character will prioritize looking at email field)
    // the lock will be released at the end of the play engdaged animation 
    public playAttentive(onComplete: () => void) : GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

        this.mouthController.setSurprisedOval(.2,tl, "<") ;
        this.bodyController.leanRight(tl,"<") ;
        tl.add(() => {
            this.eyesController.blockEyesMovment();
        }, "<") ;

        return tl ;
    }

    public playEngaged(onComplete: () => void) : GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

        const config = LOOK_DOWN_ANIMATION;


        tl.addLabel("action"); // Bookmark the start
        

        this.mouthController.setSurprisedCircle(config.actionDur, tl, "action");
        this.eyesController.addPupilMoveTween(LOOk_DOWN_PUPILS_MOVE, config.actionDur, tl, "action");
        this.bodyController.addLookDownTween(tl, config.actionDur, "action");
       

        // --- PHASE 2: THE HOLD ---
        // We add the hold duration after the action phase
        tl.to({}, { duration: config.holdDur }); 

        
        // --- PHASE 3: THE RECOVERY ---
        tl.addLabel("recovery"); // Bookmark the recovery point
        
        this.bodyController.addReturnFromLookDownTween(tl, config.recoveryDur, "recovery");
        this.eyesController.smoothRevert(config.recoveryDur, tl, "recovery");
        
        this.mouthController.setSurprisedOval(config.recoveryDur, tl, "recovery");

        
        // tl.add(() => {
        //     //this.eyesController.unblockEyesMovement();
        // }, ">recovery");

        return tl;
    }





    // mark character sad
    public playSad(onComplete: () => void): GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

        tl.addLabel("startSad");

        // we wrap this instant callback into the timeline soo they dont fire early
        tl.add(() => {
            this.eyesController.resetEyesEmotion();
            this.eyesController.turnEyesSad();
        }, "startSad");


        this.eyesController.addShapeTween(tl ,"startSad", PURPLE_SAD_EYE_RADIUS) ;
        this.mouthController.setSad(0.2, tl, "startSad");
        this.bodyController.addSadBodyTween(tl, "startSad");

        return tl;
    }

    // mark character anxious
    // ToDo: change the blinkRate of the character to blink more
    public playAnxious(onComplete: () => void): GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

        tl.add(() => {
            this.eyesController.factoryReset()
            this.eyesController.turnEyesNervous();
        }, "<");
        
        this.bodyController.addAnxiousBodyTween(tl, '<', .3);
        this.mouthController.setSad(0.2, tl, "<");
        return tl;
    }

    public playEntrance(onComplete: () => void): GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

        tl.addLabel("startEntrance");
        this.bodyController.playEntrance(tl, "startEntrance") ;
        tl.add(()=>{
            this.eyesController.unblockEyesMovement(this.getMousePos());
            this.eyesController.blinkController.startBlinking();
        }, "<") ;
        return tl;
    }


    public reset(onComplete: () => void): GSAPTimeline {
        const tl = this.createPreparedTimeline(onComplete);

        
        tl.addLabel("startResetting");
         
        tl.add(()=>{
            const latestMousePos = this.getMousePos();
            this.eyesController.reset(latestMousePos) ;
        },"startResetting")
        this.mouthController.reset(0.5, tl , "startResetting") ;
        
        this.bodyController.reset(tl, "startResetting") ;
    
        return tl ;
    }

    // this will be called before any state transition animation , it s usefull to reset some specific features of a specific state before going to another state
    // example: if we are in sad state the eyes are in a specific shape (oval) , when the state is being changed to anxious or any other state , we want the eyes to get back to normal
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

        // 2. Specific "Physical" transitions (Lego bricks)
        if (previous === CharactersState.Sad) {
            this.eyesController.addShapeTween(tl, 0, PURPLE_EYE_CONFIG.eyeRadius, 0.3);
        }
    }


    // ToDo:  make sad and enagegd animation dicatete the eyeMovement (inside the animation ) 
    // ToDo   -> deteminstic behaviour of the eyes during the aniamtion that dont depend on the current movement (the movememnt need to be chanegd and static during the aniamtion))



    // ToDo: make the animation queue solution to handle stacked aniamtion were aniamtion tiggerd while another one is still running 
    // todo: current behavior: block any new state transition (animtion and state changing) untill current state transition end
}




