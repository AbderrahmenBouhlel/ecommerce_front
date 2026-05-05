import { TransformData } from "../../../shared/core/types/types";
import { Offset } from "../../../shared/core/types/types";

export class TransformState {
    private current: TransformData;
    private anchorPose: TransformData ;

    constructor(intialPose: TransformData) {
        this.anchorPose = structuredClone(intialPose);
        this.current = structuredClone(intialPose);
    }

    setTransform(eyesContainerPose:TransformData): void {
        this.current = structuredClone(eyesContainerPose)
    }
       
    
    
    resset(){
        this.current = structuredClone(this.anchorPose)
    }



    getCurrentTransform(): TransformData {
        return structuredClone(this.current)
    }

    getCurrentRotation():number{
        return this.current.rotation
    }

    getCurrentOffset():Offset{
        return this.current.offset
    }
    
}