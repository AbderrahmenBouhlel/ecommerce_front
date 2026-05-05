import { Move, Offset } from "../../core/types/types";

export class OffsetState {

    private anchor :Offset ;


    private currentMove: Move;
    private prevMove:Move ;


    constructor(anchor: Offset, initialMove?: Move) {
        this.anchor = { ...anchor };

        this.currentMove = initialMove ? { ...initialMove } : { moveX: 0, moveY: 0 };
        
        this.prevMove = { ...this.currentMove };

        
    }


    move(dx: number, dy: number): void {
        this.currentMove.moveX = dx;
        this.currentMove.moveY = dy;
    }

    getAnchor():Offset {
        return structuredClone(this.anchor) ;
    }



    getCurrentMove(): Move {
        return { moveX: this.currentMove.moveX, moveY: this.currentMove.moveY };
    }

    getPrevMove():Move  {
        return structuredClone(this.prevMove)
    }

    takeMoveSnapshot():void {
        this.prevMove = structuredClone(this.currentMove) ;
    }

    reset(): void {
        this.currentMove = { moveX: 0, moveY: 0 };
    }



    getCurrentOffsetXString():string{
        return (this.anchor.offsetX + this.currentMove.moveX).toString()
    }
    getCurrentOffsetYString():string{
        return (this.anchor.offsetY + this.currentMove.moveY).toString()
    }
}


