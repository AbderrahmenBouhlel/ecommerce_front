


export interface CharacterControllerInterface {
    lookAt(mouseX: number, mouseY: number): void;



    playEntrance(onComplete: () => void): GSAPTimeline; 
    playAnxious(onComplete: () => void): GSAPTimeline; 
    playAttentive(onComplete: () => void) : GSAPTimeline ;
    playEngaged(onComplete: () => void): GSAPTimeline ;
    playSad(onComplete: () => void): gsap.core.Timeline  ;
    reset(onComplete: () => void): GSAPTimeline;
}