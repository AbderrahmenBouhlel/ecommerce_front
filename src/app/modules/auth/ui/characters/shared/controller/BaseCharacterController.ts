import { CharactersState, MousePositionProvider } from "../core/types/types";
import { CharacterControllerInterface } from "./CharacterControllerInterface";
import gsap from "gsap";



export abstract class BaseCharacterController implements CharacterControllerInterface {

    private isAnimating: boolean = false;

    protected currentState: CharactersState = CharactersState.Idle;
    protected previousState: CharactersState = CharactersState.Idle;
    protected getMousePos: MousePositionProvider ;
    




    abstract lookAt(mouseX: number, mouseY: number): void;

    abstract playSad(onComplete: () => void): GSAPTimeline  ;
    abstract playAnxious(onComplete: () => void): GSAPTimeline ;
    abstract playEntrance(onComplete: () => void): GSAPTimeline ;
    abstract playAttentive(onComplete: () => void) : GSAPTimeline ;
    abstract playEngaged(onComplete: () => void): GSAPTimeline ;

    abstract reset(onComplete: () => void): GSAPTimeline;
    
    abstract prepareForTransition(timeline: GSAPTimeline): void;


    constructor(getMousePos: MousePositionProvider) {
        this.getMousePos = getMousePos;
    }


    public isCurrentlyAnimating(): boolean {
        return this.isAnimating;
    }




    // make one central function that handel the transition between states
    // ToDo : use the queue system (of length 2) to make sure that if the user change the mood while an animation is playing, the next animation will be played after the current animation finish
    // Todo: make the lock managed by the orchestrator service , to ensure uniform behaviour
    public transitionToState(nextState: CharactersState) {
      
        if (this.isTransitionBlocked(nextState))  return;
        this.startTransition(nextState);

        let timeline: GSAPTimeline | null = null;

        // The "onComplete" callback that all timelines will use
        const onComplete = () => {
            this.onTransitionComplete(nextState);
        };


        switch (nextState) {
            case CharactersState.Entering:
                timeline = this.playEntrance(onComplete);
                break;
            case CharactersState.Engaged: 
                timeline = this.playEngaged(onComplete);
                break;
            case CharactersState.Sad:
                timeline = this.playSad(onComplete);
                break;
            case CharactersState.Anxious:
                timeline = this.playAnxious(onComplete);
                break;
            case CharactersState.Attentive:
                timeline = this.playAttentive(onComplete);
                break;
            case CharactersState.Reseting:
                timeline = this.reset(onComplete);
                break;
        }

        // --- THE ENGINE ---
        if (timeline) {
            timeline.play();
        } else {
            // Safety valve: if no timeline was built, unlock the controller
            this.isAnimating = false;
        }
    }



    protected createPreparedTimeline(onComplete: () => void): GSAPTimeline {
        const tl = gsap.timeline({
            onComplete: onComplete,
            paused: true
        });

        // Automatically handle the cleanup of previous states
        this.prepareForTransition(tl);

        return tl;
    }



    /**
     * 
     * internal function to "clean up" after the trnsition end 
     * (like make the isAnimating flag false , sync state to "idle" after Entering or Reseting transition)
     */
    private onTransitionComplete(newState: CharactersState) {
        this.isAnimating = false;
        if (newState === CharactersState.Entering || newState === CharactersState.Reseting) {
            this.currentState = CharactersState.Idle;
        }
    }


    /**
     * internal function to change the current state, it also save the previous state for reference 
     */
    private changeState(nextState: CharactersState) {
        if (this.currentState === nextState) return; 
        this.previousState = this.currentState;
        this.currentState = nextState;
    }

    /**
     * check if the character is busy (animating) or already in the requested state.
     */
    private isTransitionBlocked(nextState: CharactersState): boolean {
        return this.isAnimating || this.currentState === nextState;
    }

    /**
     * 
     * set the internal falgs (isAnimation and currentState) to preapre for the new animation
     */
    private startTransition(nextState: CharactersState): void {
        this.changeState(nextState);
        this.isAnimating = true;
    }

}