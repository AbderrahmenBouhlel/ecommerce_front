
import { gsap } from "gsap";
import { BlinkSnapshot, interpolateBlinkSnapShot, OPEN,computeLargeArcFlag } from "../utils/blinkController.utils";

export class BlinkController {
    private static BLINK_RATE: number = 1.5;

    private currentBlinkSnapshot: BlinkSnapshot ;

    private radius: { x: number, y: number };


    private leftEyeLidElement: SVGPathElement;
    private rightEyeLidElement: SVGPathElement;

    private isBlinkingBlocked: boolean = true ;

    private blinkTween ?: gsap.core.Tween ;
    private blinkDelay?: gsap.core.Tween;


    public constructor(rx: number, ry: number, faceGElement: SVGGElement) {
        this.radius = { x: rx, y: ry };

        this.leftEyeLidElement = faceGElement.querySelector('#leftEyelid') as SVGPathElement;
        this.rightEyeLidElement = faceGElement.querySelector('#rightEyelid') as SVGPathElement;

        // the blink animation always start from open state to make the animation more natural
        this.currentBlinkSnapshot = structuredClone(OPEN);
    }

    // -------------------------
    // CONTROL API
    // -------------------------
    public startBlinking() {
        if (!this.isBlinkingBlocked) return;
        this.isBlinkingBlocked = false;
        this.animateBlink(this.currentBlinkSnapshot);
    }

    public stopBlinking() {
        if (this.isBlinkingBlocked) return;
        this.isBlinkingBlocked = true;
        this.blinkTween?.kill();
        this.blinkDelay?.kill();
    }


    // -------------------------

  

    public updateCurrentBlinkSnap(newBlinkState: BlinkSnapshot): void {
        if(this.isBlinkingBlocked) return ;
        this.currentBlinkSnapshot = structuredClone(newBlinkState);
    }

    public getCurrentBlinkSnap(): BlinkSnapshot {
        return structuredClone(this.currentBlinkSnapshot);
    }
 

  
    // start param: represent the start state of the blink animation ,  it should be static and dont chnage durring the TWEEN operation
    private animateBlink(start: BlinkSnapshot){
        const progress = { t: 0 };
        this.blinkTween = gsap.to(progress, {
            t: 1,
            duration: .3,
            ease: "power.in",
            onUpdate: () => {
                const newBlinkSnap = interpolateBlinkSnapShot(
                    start,
                    progress.t
                );

                this.updateCurrentBlinkSnap(newBlinkSnap);
                this.applyBlink();
            },
            onComplete: () => {
                this.blinkDelay = gsap.delayedCall(
                    BlinkController.BLINK_RATE,
                    () => this.animateBlink(this.currentBlinkSnapshot)
                );
            }
        });
    }

    private applyBlink(): void {
        const pathData = this.toPathString();
        this.leftEyeLidElement.setAttribute('d', pathData);
        this.rightEyeLidElement.setAttribute('d', pathData);
    }


    public toPathString(): string {
        const x1 = this.radius.x * Math.cos(this.currentBlinkSnapshot.p1);
        const y1 = this.radius.y * Math.sin(this.currentBlinkSnapshot.p1);
        const x2 = this.radius.x * Math.cos(this.currentBlinkSnapshot.p2);
        const y2 = this.radius.y * Math.sin(this.currentBlinkSnapshot.p2);

        const largeArcFlag = computeLargeArcFlag(this.currentBlinkSnapshot.p1, this.currentBlinkSnapshot.p2);

        return `M ${x1} ${y1} A ${this.radius.x} ${this.radius.y} 0 ${largeArcFlag} 0 ${x2} ${y2}`;
    }


    public setShape(rx: number, ry: number) {
        this.radius.x = rx;
        this.radius.y = ry;
        this.applyBlink();
    }

}