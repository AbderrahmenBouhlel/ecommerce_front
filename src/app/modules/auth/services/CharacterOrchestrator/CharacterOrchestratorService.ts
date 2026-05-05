import { Injectable, OnDestroy } from "@angular/core";
import { CharactersState, MousePosition } from "../../ui/characters/shared/core/types/types";
import { BaseCharacterController } from "../../ui/characters/shared/controller/BaseCharacterController";


@Injectable()
export class CharacterOrchestratorService implements OnDestroy {
    private controllers: Set<BaseCharacterController> = new Set() ;
    private currentMousePos: MousePosition = { x: 0, y: 0 };


    private boundMouseMove = this.handleMouseMove.bind(this);

    constructor() {
        // Listen to mouse movements globally
        window.addEventListener('mousemove', this.boundMouseMove);
    }


    public getLatestPos = () => this.currentMousePos;


    private hasAnimatingController(): boolean {
        for (const controller of this.controllers) {
            if (controller.isCurrentlyAnimating()) {
                return true;
            }
        }
        return false;
    }


    private transitionAll(nextState: CharactersState): void {
        if (this.hasAnimatingController()) {
            return;
        }

        for (const controller of this.controllers) {
            controller.transitionToState(nextState);
        }
    }


    playEntrance(){
        this.transitionAll(CharactersState.Entering);
    }



    lookAt(x: number, y: number) {
        for (const controller of this.controllers) {
            controller.lookAt(x, y);
        }
    }
    

    onEmailStartTyping(): void {
        this.transitionAll(CharactersState.Attentive);
    }

    onEmailTypingFinished(): void {
        this.transitionAll(CharactersState.Engaged);
    }
    makeCharacterAnxious(): void {
        this.transitionAll(CharactersState.Anxious);
    }

    makeCharacterSad(): void {
        this.transitionAll(CharactersState.Sad);
    }

    reset(): void {
        this.transitionAll(CharactersState.Reseting);
    }


    register(controller: BaseCharacterController) {
        this.controllers.add(controller);
    }

    unregister(controller: BaseCharacterController) {
        this.controllers.delete(controller);
    }

    private handleMouseMove(event: MouseEvent) {
        this.currentMousePos = { x: event.clientX, y: event.clientY };
        this.lookAt(event.clientX, event.clientY);
    }


    ngOnDestroy() {
        window.removeEventListener('mousemove', this.boundMouseMove);
    }
}